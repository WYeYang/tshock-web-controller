import { spawn, ChildProcess } from 'child_process';
import treeKill from 'tree-kill';
import path from 'path';
import fs from 'fs';

let tshockProcess = null;
let mainWindow = null;
let store = null;

const TShockStatus = {
  STOPPED: 'stopped',
  STARTING: 'starting',
  RUNNING: 'running',
  STOPPING: 'stopping',
  ERROR: 'error'
};

let currentStatus = TShockStatus.STOPPED;

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
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('terminal:output', {
      type,
      data: data.toString(),
      timestamp: Date.now()
    });
  }
}

function getTshockExecutable() {
  const configuredPath = store.get('tshock.executablePath');
  if (configuredPath && fs.existsSync(configuredPath)) {
    return configuredPath;
  }

  const workingDir = store.get('tshock.workingDir') || process.cwd();
  const platform = process.platform;

  if (platform === 'win32') {
    return path.join(workingDir, 'TerrariaServer.exe');
  } else if (platform === 'darwin') {
    return path.join(workingDir, 'tshock', 'TerrariaServer');
  } else {
    return path.join(workingDir, 'tshock', 'TerrariaServer');
  }
}

function startTshock() {
  return new Promise((resolve, reject) => {
    if (currentStatus === TShockStatus.RUNNING || currentStatus === TShockStatus.STARTING) {
      reject(new Error('TShock is already running'));
      return;
    }

    updateStatus(TShockStatus.STARTING);

    const executablePath = getTshockExecutable();
    const workingDir = store.get('tshock.workingDir') || path.dirname(executablePath);

    if (!fs.existsSync(executablePath)) {
      updateStatus(TShockStatus.ERROR, `Executable not found: ${executablePath}`);
      reject(new Error(`TShock executable not found at: ${executablePath}`));
      return;
    }

    try {
      const args = [
        '-config',
        path.join(workingDir, 'tshock', 'config.json'),
        '-port',
        '7777',
        '-maxplayers',
        '8'
      ];

      tshockProcess = spawn(executablePath, args, {
        cwd: workingDir,
        stdio: ['pipe', 'pipe', 'pipe'],
        detached: false,
        env: { ...process.env }
      });

      tshockProcess.stdout.on('data', (data) => {
        sendOutput('stdout', data);
      });

      tshockProcess.stderr.on('data', (data) => {
        sendOutput('stderr', data);
      });

      tshockProcess.on('error', (error) => {
        updateStatus(TShockStatus.ERROR, error.message);
        sendOutput('error', `Process error: ${error.message}`);
        tshockProcess = null;
        reject(error);
      });

      tshockProcess.on('exit', (code, signal) => {
        const message = signal
          ? `Process terminated by signal: ${signal}`
          : `Process exited with code: ${code}`;
        sendOutput('exit', message);
        updateStatus(TShockStatus.STOPPED);
        tshockProcess = null;
      });

      setTimeout(() => {
        if (tshockProcess && currentStatus === TShockStatus.STARTING) {
          updateStatus(TShockStatus.RUNNING);
          sendOutput('info', 'TShock server started successfully');
        }
      }, 3000);

      resolve({
        success: true,
        pid: tshockProcess.pid,
        executable: executablePath
      });
    } catch (error) {
      updateStatus(TShockStatus.ERROR, error.message);
      reject(error);
    }
  });
}

function stopTshock() {
  return new Promise((resolve, reject) => {
    if (!tshockProcess) {
      resolve({ success: true, message: 'TShock is not running' });
      return;
    }

    updateStatus(TShockStatus.STOPPING);

    const pid = tshockProcess.pid;

    treeKill(pid, 'SIGTERM', (err) => {
      if (err) {
        console.error('Error killing process:', err);
        treeKill(pid, 'SIGKILL', (killErr) => {
          if (killErr) {
            updateStatus(TShockStatus.ERROR, killErr.message);
            reject(killErr);
          } else {
            updateStatus(TShockStatus.STOPPED);
            tshockProcess = null;
            resolve({ success: true, message: 'TShock stopped (forced)' });
          }
        });
      } else {
        setTimeout(() => {
          if (!tshockProcess || tshockProcess.exitCode !== null) {
            updateStatus(TShockStatus.STOPPED);
            tshockProcess = null;
            resolve({ success: true, message: 'TShock stopped gracefully' });
          }
        }, 2000);
      }
    });

    setTimeout(() => {
      if (tshockProcess && currentStatus === TShockStatus.STOPPING) {
        try {
          process.kill(pid, 'SIGKILL');
        } catch (e) {
          console.error('Failed to kill process:', e);
        }
      }
    }, 10000);
  });
}

function sendCommand(command) {
  return new Promise((resolve, reject) => {
    if (!tshockProcess) {
      reject(new Error('TShock is not running'));
      return;
    }

    if (tshockProcess.stdin.destroyed) {
      reject(new Error('stdin is not available'));
      return;
    }

    try {
      tshockProcess.stdin.write(command + '\n');
      sendOutput('command', command);
      resolve({ success: true, command });
    } catch (error) {
      reject(error);
    }
  });
}

function getStatus() {
  return {
    status: currentStatus,
    isRunning: currentStatus === TShockStatus.RUNNING,
    pid: tshockProcess ? tshockProcess.pid : null
  };
}

export function setupTshockIpc(window, electronStore) {
  mainWindow = window;
  store = electronStore;

  const { ipcMain } = require('electron');

  ipcMain.handle('terminal:start', async () => {
    try {
      return await startTshock();
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('terminal:stop', async () => {
    try {
      return await stopTshock();
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('terminal:send', async (event, command) => {
    try {
      return await sendCommand(command);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('terminal:status', () => {
    return getStatus();
  });
}
