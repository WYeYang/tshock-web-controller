import * as pty from 'node-pty';
import treeKill from 'tree-kill';
import path from 'path';
import fs from 'fs';
import { ipcMain, app } from 'electron';
import { registry, parseCommandArgs } from './commands.js';
import { UnzipCommandHandler } from './command-handlers/unzip.js';
import { getTShockRootDir, getExecutablePath, getConfigPath } from './config.js';
import iconv from 'iconv-lite';

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
  let outputString;

  // 在 Windows 平台下，现在终端已经设置为 UTF-8 编码
  if (process.platform === 'win32') {
    try {
      if (Buffer.isBuffer(data)) {
        // 如果是 buffer，直接用 UTF-8 解码
        outputString = data.toString('utf8');
      } else if (typeof data === 'string') {
        // 如果已经是字符串，直接使用
        outputString = data;
      } else {
        outputString = String(data);
      }
    } catch (e) {
      // 如果编码转换失败，回退到原始数据
      console.warn('[sendOutput] 编码转换失败，使用原始数据:', e);
      outputString = String(data);
    }
  } else {
    // 其他平台直接转换
    outputString = data.toString();
  }

  const outputData = {
    type,
    data: outputString,
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

      // Windows 下设置正确的编码环境变量，防止中文乱码
      if (process.platform === 'win32') {
        env.LANG = 'zh_CN.UTF-8';
        env.LC_ALL = 'zh_CN.UTF-8';
        env.LC_CTYPE = 'zh_CN.UTF-8';
        env.CHCP = '65001'; // 设置控制台代码页为UTF-8
      }

      const spawnOptions = {
        name: 'xterm-color',
        cols: 120,
        rows: 50,
        cwd: appPath,
        env: env,
        encoding: 'utf8'
      };

      shellProcess = pty.spawn(shell, [], spawnOptions);

      // Windows 下先设置代码页为UTF-8
      if (process.platform === 'win32') {
        shellProcess.write('chcp 65001\r\n');
      }

      shellProcess.onData((data) => {
        // 对于 Windows 下的原始终端数据，我们需要确保是 Buffer 形式传递给 sendOutput
        let processedData = data;
        if (process.platform === 'win32' && typeof data === 'string') {
          // 如果是字符串，尝试以 Buffer 的方式处理
          processedData = Buffer.from(data, 'binary');
        }
        sendOutput('stdout', processedData);
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

function waitForConfig() {
  return new Promise((resolve, reject) => {
    const configPath = getConfigPath();
    let attempts = 0;
    const maxAttempts = 30; // 最多等30秒
    const checkInterval = 1000; // 每1秒检查一次

    const check = () => {
      attempts++;
      if (fs.existsSync(configPath)) {
        console.log('[waitForConfig] 配置文件已生成！');
        resolve();
        return;
      }

      if (attempts >= maxAttempts) {
        console.log('[waitForConfig] 等待配置文件超时');
        reject(new Error('等待配置文件生成超时'));
        return;
      }

      console.log(`[waitForConfig] 等待配置文件... (${attempts}/${maxAttempts})`);
      setTimeout(check, checkInterval);
    };

    check();
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
      
      // 等待 config.json 生成
      await waitForConfig();
      
      updateStatus(TShockStatus.IDLE);
      resolve({ success: true });
    } catch (error) {
      updateStatus(TShockStatus.ERROR, error.message);
      reject(error);
    }
  });
}

function stopShell() {
  return new Promise((resolve, reject) => {
    if (!shellProcess) {
      resolve({ success: true, message: 'Shell is not running' });
      return;
    }

    updateStatus(TShockStatus.STOPPING);

    const pid = shellProcess.pid;

    try {
      shellProcess.kill();
    } catch (e) {
      console.error('Error killing shell:', e);
    }

    treeKill(pid, 'SIGTERM', (err) => {
      if (err) {
        console.error('Error killing shell:', err);
        treeKill(pid, 'SIGKILL', (killErr) => {
          if (killErr) {
            updateStatus(TShockStatus.ERROR, killErr.message);
            reject(killErr);
          } else {
            updateStatus(TShockStatus.STOPPED);
            shellProcess = null;
            processMode = null;
            resolve({ success: true, message: 'Shell stopped (forced)' });
          }
        });
      } else {
        setTimeout(() => {
          updateStatus(TShockStatus.STOPPED);
          shellProcess = null;
          processMode = null;
          resolve({ success: true, message: 'Shell stopped gracefully' });
        }, 1000);
      }
    });
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
