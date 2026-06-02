const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  terminal: {
    start: () => ipcRenderer.invoke('terminal:start'),
    stop: () => ipcRenderer.invoke('terminal:stop'),
    send: (command) => ipcRenderer.invoke('terminal:send', command),
    getStatus: () => ipcRenderer.invoke('terminal:status'),
    setup: (tshockDir) => ipcRenderer.invoke('terminal:setup', tshockDir),
    switchToServer: () => ipcRenderer.invoke('terminal:switch-to-server'),
    sync: () => ipcRenderer.invoke('terminal:sync'),
    clear: () => ipcRenderer.invoke('terminal:clear'),
    onOutput: (callback) => {
      const subscription = (event, data) => callback(data);
      ipcRenderer.on('terminal:output', subscription);
      return () => ipcRenderer.removeListener('terminal:output', subscription);
    },
    onStatusChange: (callback) => {
      const subscription = (event, status) => callback(status);
      ipcRenderer.on('terminal:status-change', subscription);
      return () => ipcRenderer.removeListener('terminal:status-change', subscription);
    },
    onStartRequest: (callback) => {
      const subscription = () => callback();
      ipcRenderer.on('terminal:start-request', subscription);
      return () => ipcRenderer.removeListener('terminal:start-request', subscription);
    },
    onStopRequest: (callback) => {
      const subscription = () => callback();
      ipcRenderer.on('terminal:stop-request', subscription);
      return () => ipcRenderer.removeListener('terminal:stop-request', subscription);
    }
  },

  config: {
    read: () => ipcRenderer.invoke('config:read'),
    write: (data) => ipcRenderer.invoke('config:write', data),
    setToken: (token) => ipcRenderer.invoke('config:set-token', token),
    generateToken: () => ipcRenderer.invoke('config:generate-token'),
    getPath: () => ipcRenderer.invoke('config:get-path'),
    setPath: (configPath) => ipcRenderer.invoke('config:set-path', configPath),
    setWorkingDir: (workingDir) => ipcRenderer.invoke('config:set-working-dir', workingDir),
    validatePath: (filePath) => ipcRenderer.invoke('config:validate-path', filePath),
    onTshockPathUpdated: (callback) => {
      const subscription = (event, path) => callback(path);
      ipcRenderer.on('config:tshock-path-updated', subscription);
      return () => ipcRenderer.removeListener('config:tshock-path-updated', subscription);
    },
    onSaved: (callback) => {
      const subscription = (event, success, error) => callback(success, error);
      ipcRenderer.on('config:saved', subscription);
      return () => ipcRenderer.removeListener('config:saved', subscription);
    }
  },

  app: {
    getVersion: () => ipcRenderer.invoke('app:get-version'),
    getPlatform: () => ipcRenderer.invoke('app:get-platform'),
    getStore: (key) => ipcRenderer.invoke('app:get-store', key),
    setStore: (key, value) => ipcRenderer.invoke('app:set-store', key, value),
    selectFile: (options) => ipcRenderer.invoke('dialog:select-file', options),
    extractBuiltinTShock: () => ipcRenderer.invoke('app:extract-builtin-tshock'),
    getBuiltinTShockInfo: () => ipcRenderer.invoke('app:get-builtin-tshock-info'),
    clearConfig: () => ipcRenderer.invoke('app:clear-config')
  }
});

console.log('Preload script loaded successfully');
