import { app, BrowserWindow, ipcMain, Menu, Tray, dialog, nativeImage } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import Store from 'electron-store';
import { setupTshockIpc, stopShellOnQuit } from './ipc/tshock.js';
import { setupConfigIpc } from './ipc/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let tray = null;

const store = new Store({
  name: 'tshock-controller-config',
  defaults: {
    tshock: {
      executablePath: '',
      configPath: '',
      workingDir: ''
    },
    app: {
      autoStartTShock: false,
      minimizeToTray: false
    },
    window: {
      width: 1200,
      height: 800,
      x: null,
      y: null
    }
  }
});

function createWindow() {
  const windowConfig = store.get('window');

  const windowOptions = {
    width: windowConfig.width,
    height: windowConfig.height,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    show: false,
    backgroundColor: '#0f172a'
  };

  // 如果有保存的位置，使用它
  if (windowConfig.x !== null && windowConfig.y !== null) {
    windowOptions.x = windowConfig.x;
    windowOptions.y = windowConfig.y;
  }

  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('resize', () => {
    const { width, height, x, y } = mainWindow.getBounds();
    store.set('window', { width, height, x, y });
  });

  mainWindow.on('move', () => {
    const { width, height, x, y } = mainWindow.getBounds();
    store.set('window', { width, height, x, y });
  });

  mainWindow.on('close', async (event) => {
    if (!app.isQuitting && store.get('app.minimizeToTray') && tray) {
      event.preventDefault();
      mainWindow.hide();
    } else if (!app.isQuitting) {
      event.preventDefault();
      app.isQuitting = true;
      
      try {
        await stopShellOnQuit();
      } catch (error) {
        console.error('Error stopping shell on window close:', error);
      }
      
      if (tray) {
        tray.destroy();
      }
      
      app.quit();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

function createTray() {
  try {
    tray = new Tray(nativeImage.createEmpty());

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示窗口',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        }
      },
      {
        label: '启动TShock',
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send('terminal:start-request');
          }
        }
      },
      {
        label: '停止TShock',
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send('terminal:stop-request');
          }
        }
      },
      { type: 'separator' },
      {
        label: '退出',
        click: () => {
          app.quit();
        }
      }
    ]);

    tray.setToolTip('TShock Controller');
    tray.setContextMenu(contextMenu);

    tray.on('double-click', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  } catch (error) {
    console.error('Failed to create tray:', error);
  }
}

function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '设置TShock路径',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'Executables', extensions: ['exe', 'app', ''] }
              ]
            });
            if (!result.canceled && result.filePaths.length > 0) {
              const tshockPath = result.filePaths[0];
              store.set('tshock.executablePath', tshockPath);
              store.set('tshock.workingDir', path.dirname(tshockPath));
              mainWindow.webContents.send('config:tshock-path-updated', tshockPath);
            }
          }
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
        { type: 'separator' },
        {
          label: '最小化到托盘',
          type: 'checkbox',
          checked: store.get('app.minimizeToTray'),
          click: (menuItem) => {
            store.set('app.minimizeToTray', menuItem.checked);
          }
        }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于 TShock Controller',
              message: 'TShock Controller',
              detail: '版本 1.0.0\n\n一个基于Electron的TShock服务器管理工具。'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  createMenu();

  setupTshockIpc(mainWindow, store);
  setupConfigIpc(mainWindow);

  ipcMain.handle('app:get-version', () => {
    return app.getVersion();
  });

  ipcMain.handle('app:get-platform', () => {
    return process.platform;
  });

  ipcMain.handle('app:get-store', (event, key) => {
    return store.get(key);
  });

  ipcMain.handle('app:set-store', (event, key, value) => {
    store.set(key, value);
    return true;
  });

  ipcMain.handle('dialog:select-file', async (event, options) => {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', (event) => {
  if (!app.isQuitting) {
    event.preventDefault();
    app.isQuitting = true;
    // 清理逻辑已经在 window close 事件中处理
    // 这里只是确保不会重复清理
  }
});
