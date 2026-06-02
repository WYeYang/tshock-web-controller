import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ipcMain, app } from 'electron';
import AdmZip from 'adm-zip';

let mainWindow = null;
let store = null;

function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function sendSavedResult(success, error = null) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('config:saved', success, error);
  }
}

function getConfigPath() {
  const configuredPath = store.get('tshock.configPath');
  console.log('getConfigPath - configuredPath:', configuredPath);
  
  if (configuredPath) {
    console.log('getConfigPath - using configuredPath:', configuredPath);
    return configuredPath;
  }

  const workingDir = store.get('tshock.workingDir');
  console.log('getConfigPath - workingDir:', workingDir);
  
  if (workingDir) {
    const configPath = path.join(workingDir, 'tshock', 'config.json');
    console.log('getConfigPath - using workingDir configPath:', configPath);
    return configPath;
  }

  const defaultPath = path.join(process.cwd(), 'tshock', 'config.json');
  console.log('getConfigPath - using defaultPath:', defaultPath);
  return defaultPath;
}

function readConfig() {
  return new Promise((resolve, reject) => {
    const configPath = getConfigPath();
    console.log('readConfig - configPath:', configPath);

    fs.readFile(configPath, 'utf8', (err, data) => {
      if (err) {
        console.log('readConfig - error reading file:', err);
        if (err.code === 'ENOENT') {
          resolve({
            success: false,
            error: `Configuration file not found at: ${configPath}`,
            path: configPath,
            exists: false
          });
        } else {
          reject(err);
        }
        return;
      }

      console.log('readConfig - raw file data:', data.substring(0, 500) + '...');

      try {
        const config = JSON.parse(data);
        console.log('readConfig - parsed config:', config);
        resolve({
          success: true,
          config,
          path: configPath,
          exists: true
        });
      } catch (parseError) {
        console.log('readConfig - parse error:', parseError);
        resolve({
          success: false,
          error: 'Failed to parse configuration file: Invalid JSON',
          path: configPath,
          exists: true
        });
      }
    });
  });
}

function writeConfig(data) {
  return new Promise((resolve, reject) => {
    const configPath = getConfigPath();
    const configDir = path.dirname(configPath);

    fs.mkdir(configDir, { recursive: true }, (mkdirErr) => {
      if (mkdirErr) {
        sendSavedResult(false, mkdirErr.message);
        reject(mkdirErr);
        return;
      }

      const jsonData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

      fs.writeFile(configPath, jsonData, 'utf8', (err) => {
        if (err) {
          sendSavedResult(false, err.message);
          reject(err);
          return;
        }

        sendSavedResult(true);
        resolve({
          success: true,
          path: configPath
        });
      });
    });
  });
}

function setToken(token) {
  return new Promise(async (resolve, reject) => {
    try {
      const configResult = await readConfig();

      let config = {};
      if (configResult.success && configResult.exists) {
        config = configResult.config;
      } else if (!configResult.exists) {
        config = {
          Settings: {
            RestApiEnabled: true,
            RestApiPort: 7878
          }
        };
      }

      // 确保配置是新格式
      if (!config.Settings) {
        config.Settings = {};
      }

      // 设置 Token 和相关配置
      config.Settings.Token = token;
      config.Settings.EnableTokenLoginAuthentication = true;
      config.Settings.RestApiEnabled = true;
      config.Settings.RestApiPort = 7878;

      console.log('setToken - writing config:', config);
      const result = await writeConfig(config);
      resolve(result);
    } catch (error) {
      console.error('setToken - error:', error);
      reject(error);
    }
  });
}

function validatePath(filePath) {
  return new Promise((resolve) => {
    // 规范化路径
    const normalizedPath = path.resolve(filePath);
    console.log('validatePath - input:', filePath, 'normalized:', normalizedPath);
    
    const stats = {
      exists: false,
      isFile: false,
      isExecutable: false,
      readable: false,
      extension: '',
      size: 0
    };

    try {
      const ext = path.extname(normalizedPath).toLowerCase();
      const basename = path.basename(normalizedPath).toLowerCase();

      stats.exists = fs.existsSync(normalizedPath);

      if (stats.exists) {
        const stat = fs.statSync(normalizedPath);
        stats.isFile = stat.isFile();
        stats.size = stat.size;
        stats.readable = fs.accessSync(normalizedPath, fs.constants.R_OK) === undefined;

        if (process.platform === 'win32') {
          stats.isExecutable = ext === '.exe' || basename.includes('server') || basename.includes('terraria');
        } else {
          try {
            const mode = stat.mode;
            const isExecutable = (mode & 0o111) !== 0;
            stats.isExecutable = isExecutable;
          } catch (e) {
            stats.isExecutable = false;
          }
        }

        stats.extension = ext;
      }

      resolve({
        valid: stats.exists && stats.isFile && stats.readable,
        stats,
        suggestedConfigPath: path.join(path.dirname(normalizedPath), 'tshock', 'config.json')
      });
    } catch (error) {
      resolve({
        valid: false,
        stats,
        error: error.message
      });
    }
  });
}

function getBuiltinTShockZipPath() {
  let resourcesPath;
  if (!app.isPackaged) {
    resourcesPath = path.join(process.cwd(), 'resources');
  } else {
    resourcesPath = path.join(process.resourcesPath, 'resources');
  }
  return path.join(resourcesPath, 'TShock-6.1.0-for-Terraria-1.4.5.6-win-x64-Release.zip');
}

function extractBuiltinTShock() {
  return new Promise(async (resolve, reject) => {
    try {
      const zipPath = getBuiltinTShockZipPath();
      
      console.log('Zip path:', zipPath);
      console.log('Zip exists:', fs.existsSync(zipPath));
      
      if (!fs.existsSync(zipPath)) {
        reject(new Error('内置 TShock zip 不存在'));
        return;
      }

      let extractDir;
      if (!app.isPackaged) {
        // 开发模式下，解压到项目目录下的 TShock 文件夹
        extractDir = path.join(process.cwd(), 'TShock');
      } else {
        // 打包模式下，解压到 exe 目录下的 TShock 文件夹
        const appDir = path.dirname(app.getPath('exe'));
        extractDir = path.join(appDir, 'TShock');
      }

      console.log('Extract dir:', extractDir);

      if (fs.existsSync(extractDir)) {
        console.log('Deleting existing TShock folder...');
        const deleteFolderRecursive = (folderPath) => {
          if (fs.existsSync(folderPath)) {
            fs.readdirSync(folderPath).forEach((file) => {
              const curPath = path.join(folderPath, file);
              if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
              } else {
                fs.unlinkSync(curPath);
              }
            });
            fs.rmdirSync(folderPath);
          }
        };
        deleteFolderRecursive(extractDir);
      }

      console.log('Extracting zip...');
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(extractDir, true);
      console.log('Extraction complete.');

      // 解压后自动设置所有路径
      await setWorkingDir(extractDir);

      resolve({
        success: true,
        path: extractDir
      });
    } catch (error) {
      console.error('Extract error:', error);
      reject(error);
    }
  });
}

// 新函数：通过工作目录设置所有路径
function setWorkingDir(workingDir) {
  return new Promise((resolve, reject) => {
    try {
      console.log('setWorkingDir - workingDir:', workingDir);
      
      // 安全检查：防止空字符串或无效路径
      if (!workingDir || typeof workingDir !== 'string' || workingDir.trim() === '') {
        console.error('setWorkingDir - invalid workingDir:', workingDir);
        throw new Error('Invalid working directory');
      }
      
      // 确保是绝对路径
      const absoluteWorkingDir = path.resolve(workingDir);
      console.log('setWorkingDir - absoluteWorkingDir:', absoluteWorkingDir);
      
      const configPath = path.join(absoluteWorkingDir, 'tshock', 'config.json');
      const installerPath = path.join(absoluteWorkingDir, 'TShock.Installer.exe');
      const serverPath = path.join(absoluteWorkingDir, 'TerrariaServer.exe');
      
      console.log('setWorkingDir - configPath:', configPath);
      console.log('setWorkingDir - installerPath:', installerPath);
      console.log('setWorkingDir - serverPath:', serverPath);
      
      store.set('tshock.workingDir', absoluteWorkingDir);
      store.set('tshock.configPath', configPath);
      
      // 优先使用 TShock.Installer.exe，如果不存在再用 TerrariaServer.exe
      if (fs.existsSync(installerPath)) {
        store.set('tshock.executablePath', installerPath);
      } else if (fs.existsSync(serverPath)) {
        store.set('tshock.executablePath', serverPath);
      }
      
      console.log('setWorkingDir - store updated:', {
        workingDir: store.get('tshock.workingDir'),
        configPath: store.get('tshock.configPath'),
        executablePath: store.get('tshock.executablePath')
      });
      
      resolve({ success: true, workingDir: absoluteWorkingDir, configPath, installerPath, serverPath });
    } catch (error) {
      console.error('setWorkingDir error:', error);
      reject(error);
    }
  });
}

function getBuiltinTShockInfo() {
  return {
    version: '6.1.0',
    terrariaVersion: '1.4.5.6',
    zipPath: getBuiltinTShockZipPath(),
    exists: fs.existsSync(getBuiltinTShockZipPath())
  };
}

export function setupConfigIpc(window, electronStore) {
  mainWindow = window;
  store = electronStore;

  ipcMain.handle('config:read', async () => {
    try {
      return await readConfig();
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  });

  ipcMain.handle('config:write', async (event, data) => {
    try {
      return await writeConfig(data);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  });

  ipcMain.handle('config:set-token', async (event, token) => {
    try {
      const finalToken = token || generateToken();
      return await setToken(finalToken);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  });

  ipcMain.handle('config:generate-token', () => {
    return generateToken();
  });

  ipcMain.handle('config:get-path', () => {
    return getConfigPath();
  });

  ipcMain.handle('config:set-working-dir', async (event, workingDir) => {
    try {
      return await setWorkingDir(workingDir);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  });

  ipcMain.handle('config:set-path', async (event, configPath) => {
    try {
      console.log('config:set-path - input configPath:', configPath);
      
      // 确保路径是绝对路径
      let absolutePath = path.resolve(configPath);
      console.log('config:set-path - absolutePath:', absolutePath);
      
      // 计算 workingDir：从 configPath 中提取 TShock 根目录
      // configPath 格式应该是：<TShock根目录>/tshock/config.json
      const tshockDir = path.dirname(absolutePath); // <TShock根目录>/tshock
      const workingDir = path.dirname(tshockDir); // <TShock根目录>
      
      console.log('config:set-path - tshockDir:', tshockDir);
      console.log('config:set-path - workingDir:', workingDir);
      
      store.set('tshock.configPath', absolutePath);
      store.set('tshock.workingDir', workingDir);

      // 同时设置 executablePath
      const exePath = path.join(workingDir, 'TerrariaServer.exe');
      console.log('config:set-path - exePath:', exePath);
      
      if (fs.existsSync(exePath)) {
        store.set('tshock.executablePath', exePath);
        console.log('config:set-path - set executablePath:', exePath);
      }

      console.log('config:set-path - store updated:', {
        configPath: store.get('tshock.configPath'),
        workingDir: store.get('tshock.workingDir'),
        executablePath: store.get('tshock.executablePath')
      });

      return {
        success: true,
        path: absolutePath,
        workingDir: workingDir
      };
    } catch (error) {
      console.error('config:set-path - error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  ipcMain.handle('config:validate-path', async (event, filePath) => {
    return await validatePath(filePath);
  });

  ipcMain.handle('app:extract-builtin-tshock', async () => {
    try {
      return await extractBuiltinTShock();
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  });

  ipcMain.handle('app:get-builtin-tshock-info', () => {
    return getBuiltinTShockInfo();
  });

  ipcMain.handle('app:clear-config', () => {
    try {
      console.log('app:clear-config - 正在清理旧配置...');
      store.delete('tshock.configPath');
      store.delete('tshock.workingDir');
      store.delete('tshock.executablePath');
      console.log('app:clear-config - 配置清理完成');
      return { success: true };
    } catch (error) {
      console.error('app:clear-config - 清理配置失败:', error);
      return { success: false, error: error.message };
    }
  });
}
