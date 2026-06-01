import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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
  if (configuredPath) {
    return configuredPath;
  }

  const workingDir = store.get('tshock.workingDir');
  if (workingDir) {
    return path.join(workingDir, 'tshock', 'config.json');
  }

  return path.join(process.cwd(), 'tshock', 'config.json');
}

function readConfig() {
  return new Promise((resolve, reject) => {
    const configPath = getConfigPath();

    fs.readFile(configPath, 'utf8', (err, data) => {
      if (err) {
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

      try {
        const config = JSON.parse(data);
        resolve({
          success: true,
          config,
          path: configPath,
          exists: true
        });
      } catch (parseError) {
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
          RestApiEnabled: true,
          RestApiPort: 7878
        };
      }

      config.Token = token;
      config.EnableTokenLoginAuthentication = true;
      config.RestApiEnabled = true;

      const result = await writeConfig(config);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function validatePath(filePath) {
  return new Promise((resolve) => {
    const stats = {
      exists: false,
      isFile: false,
      isExecutable: false,
      readable: false,
      extension: '',
      size: 0
    };

    try {
      const ext = path.extname(filePath).toLowerCase();
      const basename = path.basename(filePath).toLowerCase();

      stats.exists = fs.existsSync(filePath);

      if (stats.exists) {
        const stat = fs.statSync(filePath);
        stats.isFile = stat.isFile();
        stats.size = stat.size;
        stats.readable = fs.accessSync(filePath, fs.constants.R_OK) === undefined;

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
        suggestedConfigPath: path.join(path.dirname(filePath), 'tshock', 'config.json')
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

export function setupConfigIpc(window, electronStore) {
  mainWindow = window;
  store = electronStore;

  const { ipcMain } = require('electron');

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

  ipcMain.handle('config:set-path', async (event, configPath) => {
    try {
      store.set('tshock.configPath', configPath);
      store.set('tshock.workingDir', path.dirname(path.dirname(configPath)));

      if (path.dirname(configPath) !== path.dirname(getConfigPath())) {
        const validation = await validatePath(configPath.replace('config.json', 'TerrariaServer.exe'));
        if (validation.valid) {
          store.set('tshock.executablePath', path.join(path.dirname(configPath), 'TerrariaServer.exe'));
        }
      }

      return {
        success: true,
        path: configPath,
        workingDir: store.get('tshock.workingDir')
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  });

  ipcMain.handle('config:validate-path', async (event, filePath) => {
    return await validatePath(filePath);
  });
}
