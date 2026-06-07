const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  terminal: {
    start: () => ipcRenderer.invoke('terminal:start'),
    stop: () => ipcRenderer.invoke('terminal:stop'),
    send: (data) => ipcRenderer.invoke('terminal:send', data),
    resize: (cols, rows) => ipcRenderer.invoke('terminal:resize', cols, rows),
    getStatus: () => ipcRenderer.invoke('terminal:status'),
    startTShock: (worldPath) => ipcRenderer.invoke('terminal:start-tshock', worldPath),
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
    read: (filename) => ipcRenderer.invoke('config:read', filename),
    write: (filename, data) => ipcRenderer.invoke('config:write', filename, data),
    getPath: () => ipcRenderer.invoke('config:get-path'),
    getExtractPaths: () => ipcRenderer.invoke('config:get-extract-paths'),
    onTshockPathUpdated: (callback) => {
      const subscription = (event, path) => callback(path);
      ipcRenderer.on('config:tshock-path-updated', subscription);
      return () => ipcRenderer.removeListener('config:tshock-path-updated', subscription);
    }
  },

  app: {
    getVersion: () => ipcRenderer.invoke('app:get-version'),
    getPlatform: () => ipcRenderer.invoke('app:get-platform'),
    getStore: (key) => ipcRenderer.invoke('app:get-store', key),
    setStore: (key, value) => ipcRenderer.invoke('app:set-store', key, value),
    selectFile: (options) => ipcRenderer.invoke('dialog:select-file', options),
    getBuiltinTShockInfo: () => ipcRenderer.invoke('app:get-builtin-tshock-info'),
    getTerrariaWorldsPath: () => ipcRenderer.invoke('app:get-terraria-worlds-path'),
    getAppRootPath: () => ipcRenderer.invoke('app:get-root-path')
  }
});

console.log('Preload script loaded successfully');
