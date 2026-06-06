// 设置Node.js进程的默认编码为UTF-8
if (process.platform === 'win32') {
  process.env.LANG = 'zh_CN.UTF-8';
  process.env.LC_ALL = 'zh_CN.UTF-8';
  process.env.LC_CTYPE = 'zh_CN.UTF-8';
  process.env.CHCP = '65001';
}

import { app, BrowserWindow, ipcMain, Menu, dialog, shell, session } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import Store from 'electron-store';
import { setupTshockIpc, stopShellOnQuit } from './ipc/tshock.js';
import { setupConfigIpc } from './ipc/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

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
    title: 'TShock 服务器控制器',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false // 禁用 webSecurity，允许跨域请求（这是 Electron 应用，安全可接受）
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
  
  // 隐藏菜单栏
  mainWindow.setMenuBarVisibility(false);

  // 处理外部链接，在浏览器打开
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // 处理<a>标签点击导航到外部链接
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

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
    if (!app.isQuitting) {
      event.preventDefault();
      app.isQuitting = true;
      
      try {
        await stopShellOnQuit();
      } catch (error) {
        console.error('Error stopping shell on window close:', error);
      }
      
      app.quit();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const isDev = !app.isPackaged;

  // 已启用 webSecurity: false，直接请求完整 URL，不需要任何拦截器！

  if (isDev) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
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
        { role: 'close' }
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
              title: '关于 TShock 服务器控制器',
              message: 'TShock 服务器控制器',
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
  createMenu();

  setupTshockIpc(mainWindow, store);
  setupConfigIpc(mainWindow, store);

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
  }
});
