import * as pty from 'node-pty';
import treeKill from 'tree-kill';
import path from 'path';
import fs from 'fs';
import { ipcMain } from 'electron';
import { registry, parseCommandArgs } from './commands.js';
import { UnzipCommandHandler } from './command-handlers/unzip.js';

let shellProcess = null;
let mainWindow = null;
let store = null;
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
    data: data.toString(),
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

function startShell(workingDir) {
  return new Promise((resolve, reject) => {
    try {
      const shell = process.platform === 'win32' ? 'cmd.exe' : 'bash';
      const spawnOptions = {
        name: 'xterm-color',
        cols: 120,
        rows: 50,
        cwd: workingDir,
        env: { ...process.env }
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
      updateStatus(TShockStatus.ERROR, error.message);
      reject(error);
    }
  });
}

function sendToShell(command) {
  return new Promise((resolve, reject) => {
    if (!shellProcess) {
      reject(new Error('Shell not started'));
      return;
    }

    try {
      const cmdWithoutNewline = command.replace(/[\r\n]+$/, '');

      // 先把命令写入终端显示
      shellProcess.write(cmdWithoutNewline + '\r\n');

      // 解析命令
      const args = parseCommandArgs(cmdWithoutNewline);
      const commandName = args[0];
      const commandArgs = args.slice(1);

      console.log('[sendToShell] Command:', commandName, 'Args:', commandArgs);

      // 查找并执行注册的命令处理器
      const handler = registry.findCommand(commandName);
      if (handler) {
        console.log('[sendToShell] Found command handler:', commandName);
        (async () => {
          const success = await handler.execute(commandArgs);
          resolve({ success, command: cmdWithoutNewline });
        })();
        return;
      }

      // 其他命令直接透传给终端
      resolve({ success: true, command });
    } catch (error) {
      console.error('[sendToShell] Error:', error);
      reject(error);
    }
  });
}

function sendRawToShell(data) {
  return new Promise((resolve, reject) => {
    if (!shellProcess) {
      reject(new Error('Shell not started'));
      return;
    }

    try {
      shellProcess.write(data);
      resolve({ success: true });
    } catch (error) {
      reject(error);
    }
  });
}

function getTshockExecutable(workingDir) {
  const configuredPath = store.get('tshock.executablePath');
  if (configuredPath && fs.existsSync(configuredPath)) {
    return configuredPath;
  }

  const useDir = workingDir || store.get('tshock.workingDir') || process.cwd();
  const platform = process.platform;

  if (platform === 'win32') {
    const installerPath = path.join(useDir, 'TShock.Installer.exe');
    if (fs.existsSync(installerPath)) {
      return installerPath;
    }

    const serverPath = path.join(useDir, 'TerrariaServer.exe');
    if (fs.existsSync(serverPath)) {
      return serverPath;
    }

    const tshockServerPath = path.join(useDir, 'tshock', 'TerrariaServer.exe');
    if (fs.existsSync(tshockServerPath)) {
      return tshockServerPath;
    }

    return installerPath;
  } else {
    const serverPath = path.join(useDir, 'tshock', 'TerrariaServer');
    if (fs.existsSync(serverPath)) {
      return serverPath;
    }
    return path.join(useDir, 'TerrariaServer');
  }
}

function setupTshock(tshockDir) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!shellProcess) {
        await startShell(tshockDir);
      }

      updateStatus(TShockStatus.SETUP);
      processMode = 'setup';
      sendOutput('info', 'Starting configuration generation...');

      const installerPath = path.join(tshockDir, 'TShock.Installer.exe');
      if (!fs.existsSync(installerPath)) {
        updateStatus(TShockStatus.ERROR, `TShock.Installer.exe not found at: ${installerPath}`);
        reject(new Error(`TShock.Installer.exe not found at: ${installerPath}`));
        return;
      }

      await sendToShell(`"${installerPath}"`);

      setTimeout(() => {
        sendOutput('info', 'Configuration generation phase complete');
        updateStatus(TShockStatus.IDLE);
        resolve({ success: true });
      }, 10000);
    } catch (error) {
      updateStatus(TShockStatus.ERROR, error.message);
      reject(error);
    }
  });
}

function startTshock() {
  return new Promise(async (resolve, reject) => {
    try {
      const workingDir = store.get('tshock.workingDir') || process.cwd();
      if (!shellProcess) {
        await startShell(workingDir);
      }

      updateStatus(TShockStatus.STARTING);
      processMode = 'server';
      sendOutput('info', 'Starting TShock server...');

      const executablePath = getTshockExecutable(workingDir);
      if (!fs.existsSync(executablePath)) {
        updateStatus(TShockStatus.ERROR, `Executable not found: ${executablePath}`);
        reject(new Error(`TShock executable not found at: ${executablePath}`));
        return;
      }

      let command = `"${executablePath}"`;
      const basename = path.basename(executablePath).toLowerCase();

      if (basename.includes('installer')) {
        command += ' -boot';
      }

      command += ` -config "${path.join(workingDir, 'tshock', 'config.json')}"`;
      command += ' -port 7777 -maxplayers 8';

      await sendToShell(command);

      setTimeout(() => {
        if (shellProcess && currentStatus === TShockStatus.STARTING) {
          updateStatus(TShockStatus.RUNNING);
          sendOutput('info', 'TShock server started successfully');
        }
      }, 3000);

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
  store = electronStore;

  const unzipHandler = new UnzipCommandHandler({
    sendOutput: (data) => sendOutput('stdout', data),
    store,
    fs,
    path
  });
  registry.registerCommand('unzip', unzipHandler);

  ipcMain.handle('terminal:start', async () => {
    try {
      return await startTshock();
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

  ipcMain.handle('terminal:send', async (event, command) => {
    try {
      return await sendToShell(command);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('terminal:sendRaw', async (event, data) => {
    try {
      return await sendRawToShell(data);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('terminal:status', () => {
    return getStatus();
  });

  ipcMain.handle('terminal:setup', async (event, tshockDir) => {
    try {
      return await setupTshock(tshockDir);
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
