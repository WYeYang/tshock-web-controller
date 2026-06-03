import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ipcMain, app } from 'electron';

let mainWindow = null;
let customTShockDir = null;

// TShock 根目录：优先使用用户选择的路径
function getTShockRootDir() {
  if (customTShockDir) {
    return customTShockDir;
  }
  if (!app.isPackaged) {
    return path.join(process.cwd(), 'TShock');
  }
  const appDir = path.dirname(app.getPath('exe'));
  return path.join(appDir, 'TShock');
}

function getConfigPath() {
  const tshockDir = getTShockRootDir();
  return path.join(tshockDir, 'tshock', 'config.json');
}

function getExecutablePath() {
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

export function setupConfigIpc(window) {
  mainWindow = window;

  ipcMain.handle('config:read', async () => {
    try {
      return await readConfig(getConfigPath());
    } catch (error) {
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
