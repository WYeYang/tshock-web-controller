import fs from 'fs';
import path from 'path';
import { ipcMain, app } from 'electron';

let mainWindow = null;
let store = null;

export function getTShockRootDir() {
  // 1. 用户自定义目录（优先级最高）
  //    示例：C:\Users\WEN\Documents\project\Tshock Server\CustomTShock
  const customDir = store?.get('tshockDir');
  if (customDir) {
    return customDir;
  }
  
  // 2. 开发环境默认值：项目根目录/TShock
  //    示例：C:\Users\WEN\Documents\project\Tshock Server\tshock-web-controller\TShock
  if (!app.isPackaged) {
    return path.join(process.cwd(), 'TShock');
  }
  
  // 3. 打包后环境：程序所在目录/TShock
  //    示例：C:\Program Files\tshock-web-controller\TShock
  return path.join(path.dirname(app.getPath('exe')), 'TShock');
}

export function getConfigPath() {
  return path.join(getTShockRootDir(), 'tshock', 'config.json');
}

export function getExecutablePath() {
  const tshockDir = getTShockRootDir();
  const installerPath = path.join(tshockDir, 'TShock.Installer.exe');
  const serverPath = path.join(tshockDir, 'TerrariaServer.exe');
  
  if (fs.existsSync(installerPath)) {
    return installerPath;
  }
  return serverPath;
}


function readConfig(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const config = JSON.parse(data);
        resolve(config);
      } catch (parseError) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

function writeConfig(filePath, data) {
  return new Promise((resolve, reject) => {
    const configDir = path.dirname(filePath);

    fs.mkdir(configDir, { recursive: true }, (mkdirErr) => {
      if (mkdirErr) {
        reject(mkdirErr);
        return;
      }

      const jsonData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

      fs.writeFile(filePath, jsonData, 'utf8', (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
}

function getBuiltinTShockZipPath() {
  const resourcesPath = app.isPackaged 
    ? path.join(process.resourcesPath, 'resources')
    : path.join(process.cwd(), 'resources');
  
  const files = fs.readdirSync(resourcesPath);
  return path.join(resourcesPath, files.find(file => /^TShock.*\.zip$/.test(file)));
}

function getExtractTargetDir() {
  return getTShockRootDir();
}

function getBuiltinTShockInfo() {
  return {
    exists: true,
    zipPath: getBuiltinTShockZipPath()
  };
}

export function setupConfigIpc(window, electronStore) {
  mainWindow = window;
  store = electronStore;

  ipcMain.handle('config:read', async () => {
    const configPath = getConfigPath();
    console.log('[config:read] 读取配置路径:', configPath);
    console.log('[config:read] 文件是否存在:', fs.existsSync(configPath));
    
    try {
      const config = await readConfig(configPath);
      console.log('[config:read] 配置读取成功');
      return config;
    } catch (error) {
      console.error('[config:read] 配置读取失败:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  });

  ipcMain.handle('config:write', async (event, data) => {
    try {
      await writeConfig(getConfigPath(), data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  });

  ipcMain.handle('config:get-extract-paths', () => {
    return {
      zipPath: getBuiltinTShockZipPath(),
      targetDir: getExtractTargetDir()
    };
  });

  ipcMain.handle('config:get-path', () => {
    return getConfigPath();
  });

  ipcMain.handle('app:get-builtin-tshock-info', () => {
    return getBuiltinTShockInfo();
  });
}
