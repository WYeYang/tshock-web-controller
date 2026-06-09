import * as pty from 'node-pty';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { ipcMain, app } from 'electron';
import { registry, parseCommandArgs } from './commands.js';
import { UnzipCommandHandler } from './command-handlers/unzip.js';
import { getTShockRootDir, getExecutablePath, getConfigPath } from './config.js';
import iconv from 'iconv-lite';

const execFileAsync = promisify(execFile);

let shellProcess = null;
let mainWindow = null;
let outputBuffer = [];
const MAX_BUFFER = 2000;

const TShockStatus = {
  STOPPED: 'stopped',
  STARTING: 'starting',
  RUNNING: 'running',
  STOPPING: 'stopping',
  ERROR: 'error',
  SETUP: 'setup',
  IDLE: 'idle'
};

let currentStatus = TShockStatus.STOPPED;
let processMode = null;

function updateStatus(status, error = null) {
  currentStatus = status;
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('terminal:status-change', {
      status,
      error,
      timestamp: Date.now()
    });
  }
}

function sendOutput(type, data) {
  const outputData = {
    type,
    data: data,
    timestamp: Date.now()
  };
  outputBuffer.push(outputData);
  if (outputBuffer.length > MAX_BUFFER) {
    outputBuffer.shift();
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('terminal:output', outputData);
  }
}

function syncOutputBuffer() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    outputBuffer.forEach(output => {
      mainWindow.webContents.send('terminal:output', output);
    });
  }
}

function startShell() {
  return new Promise((resolve, reject) => {
    try {
      const shell = process.platform === 'win32' ? 'cmd.exe' : 'bash';
      // 启动时使用 APP 根目录，解压后再 cd 到 TShock 目录
      const appPath = app.isPackaged
        ? path.dirname(app.getPath('exe'))
        : process.cwd();

      const env = { ...process.env };

      const spawnOptions = {
        name: 'xterm-color',
        cols: 120,
        rows: 50,
        cwd: appPath,
        env: env,
      };

      shellProcess = pty.spawn(shell, [], spawnOptions);

      shellProcess.onData((data) => {
        sendOutput('stdout', data);
      });

      shellProcess.onExit(({ exitCode, signal }) => {
        const message = signal
          ? `Shell terminated by signal: ${signal}`
          : `Shell exited with code: ${exitCode}`;
        sendOutput('exit', message);
        updateStatus(TShockStatus.STOPPED);
        shellProcess = null;
        processMode = null;
      });

      updateStatus(TShockStatus.IDLE);
      sendOutput('info', 'Shell session started');
      resolve({ success: true, pid: shellProcess.pid });
    } catch (error) {
      console.error('[startTshock] 异常:', error);
      updateStatus(TShockStatus.ERROR, error.message);
      reject(error);
    }
  });
}

function sendToShell(data) {
  return new Promise((resolve, reject) => {
    if (!shellProcess) {
      reject(new Error('Shell not started'));
      return;
    }

    try {
      // 如果是特殊字符（如 Ctrl+C），直接发送不附加换行符
      if (data === '\x03') {
        shellProcess.write(data);
        resolve({ success: true, data });
        return;
      }

      const command = data.trim();
      if (command) {
        console.log('[sendToShell] 完整命令:', command);
        
        // 解析命令
        const args = parseCommandArgs(command);
        const commandName = args[0];
        const commandArgs = args.slice(1);
        
        // 查找并执行注册的命令处理器
        const handler = registry.findCommand(commandName);
        if (handler) {
          console.log('[sendToShell] 找到命令处理器:', commandName);
          // 先把命令显示在终端上
          sendOutput('stdout', command + '\r\n');
          // 执行命令处理器
          (async () => {
            const success = await handler.execute(commandArgs);
            resolve({ success, command });
          })();
          return;
        }
      }

      // 普通命令直接写入 shell，自动附加换行符
      shellProcess.write(data + '\r\n');
      resolve({ success: true, data });
    } catch (error) {
      console.error('[sendToShell] Error:', error);
      reject(error);
    }
  });
}

function startTshock(worldPath) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!shellProcess) {
        await startShell();
      }

      updateStatus(TShockStatus.SETUP);
      processMode = 'setup';
      sendOutput('info', 'Starting TShock server...');

      const tshockDir = getTShockRootDir();
      const installerPath = path.join(tshockDir, 'TShock.Installer.exe');

      if (!fs.existsSync(installerPath)) {
        updateStatus(TShockStatus.ERROR, `TShock.Installer.exe not found at: ${installerPath}`);
        reject(new Error(`TShock.Installer.exe not found at: ${installerPath}`));
        return;
      }

      // 先 cd 到 TShock 目录
      await sendToShell(`cd "${tshockDir}"`);

      let command = `"${installerPath}"`;
      if (worldPath && fs.existsSync(worldPath)) {
        command += ` -world "${worldPath}"`;
      }

      await sendToShell(command);
      
      // 等待 config.json 生成，同时检测解压失败
      await waitForConfigWithErrorDetection();
      
      updateStatus(TShockStatus.IDLE);
      resolve({ success: true });
    } catch (error) {
      console.error('[startTshock] 异常:', error);
      updateStatus(TShockStatus.ERROR, error.message);
      reject(error);
    }
  });
}

function waitForConfigWithErrorDetection() {
  return new Promise((resolve, reject) => {
    const configPath = getConfigPath();
    let attempts = 0;
    const maxAttempts = 120;
    const checkInterval = 1000;

    const check = () => {
      attempts++;

      if (fs.existsSync(configPath)) {
        console.log('[waitForConfigWithErrorDetection] 配置文件已生成！');
        resolve();
        return;
      }

      if (attempts >= maxAttempts) {
        console.log('[waitForConfigWithErrorDetection] 等待配置文件超时');
        reject(new Error('等待配置文件生成超时'));
        return;
      }

      console.log(`[waitForConfigWithErrorDetection] 等待配置文件... (${attempts}/${maxAttempts})`);
      setTimeout(check, checkInterval);
    };

    check();
  });
}

function stopShell() {
  return new Promise((resolve) => {
    if (!shellProcess) {
      resolve({ success: true, message: 'Shell is not running' });
      return;
    }

    updateStatus(TShockStatus.STOPPING);

    let exited = false;

    // 监听进程退出
    const exitHandler = () => {
      exited = true;
      updateStatus(TShockStatus.STOPPED);
      shellProcess = null;
      processMode = null;
      resolve({ success: true, message: 'Shell stopped gracefully' });
    };

    shellProcess.once('exit', exitHandler);

    try {
      // 发送 Ctrl+C 让进程安全退出
      if (process.platform === 'win32') {
        try {
          shellProcess.write('\x03'); // Ctrl+C
        } catch (e) {
          // 忽略错误
        }
      } else {
        shellProcess.kill('SIGINT');
      }
    } catch (e) {
      console.error('Error sending interrupt to shell:', e);
    }

    // 超时强制 kill
    setTimeout(() => {
      if (!exited && shellProcess) {
        try {
          shellProcess.kill();
        } catch (e) {
          console.error('Error killing shell:', e);
        }
        updateStatus(TShockStatus.STOPPED);
        shellProcess = null;
        processMode = null;
        resolve({ success: true, message: 'Shell stopped (forced)' });
      }
    }, 3000); // 5秒超时
  });
}

function getStatus() {
  return {
    status: currentStatus,
    mode: processMode,
    isRunning: currentStatus === TShockStatus.RUNNING || currentStatus === TShockStatus.SETUP || currentStatus === TShockStatus.IDLE,
    pid: shellProcess ? shellProcess.pid : null
  };
}

export function stopShellOnQuit() {
  return stopShell();
}

export function setupTshockIpc(window, electronStore) {
  mainWindow = window;

  const unzipHandler = new UnzipCommandHandler({
    sendOutput: (data) => sendOutput('stdout', data),
    fs,
    path
  });
  registry.registerCommand('unzip', unzipHandler);

  // 只启动终端
  ipcMain.handle('terminal:start', async () => {
    try {
      return await startShell();
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('terminal:stop', async () => {
    try {
      return await stopShell();
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('terminal:send', async (event, data) => {
    try {
      return await sendToShell(data);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('terminal:status', () => {
    return getStatus();
  });

  ipcMain.handle('terminal:start-tshock', async (event, worldPath) => {
    try {
      return await startTshock(worldPath);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('terminal:sync', () => {
    syncOutputBuffer();
    return { success: true };
  });

  ipcMain.handle('terminal:clear', () => {
    outputBuffer = [];
    return { success: true };
  });

  ipcMain.handle('terminal:resize', async (event, cols, rows) => {
    try {
      if (shellProcess) {
        shellProcess.resize(cols, rows);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}
