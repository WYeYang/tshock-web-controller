// 更健壮的electronBridge实现
function getElectronAPI(): any {
  if (typeof window === 'undefined') {
    console.log('electronBridge - window is undefined (SSR)');
    return null;
  }
  
  const api = (window as any).electronAPI;
  if (!api) {
    console.log('electronBridge - electronAPI not found on window');
    console.log('electronBridge - window keys:', Object.keys(window).filter(k => k.includes('electron')));
  }
  return api;
}

export function isElectronAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  const result = !!(window as any).electronAPI;
  console.log('electronBridge - isElectronAvailable:', result);
  return result;
}

export interface ElectronAPI {
  terminal: {
    start: () => Promise<any>;
    stop: () => Promise<any>;
    send: (data: string) => Promise<any>;
    resize: (cols: number, rows: number) => Promise<any>;
    getStatus: () => Promise<any>;
    startTShock: (worldPath?: string) => Promise<any>;
    sync: () => Promise<any>;
    clear: () => Promise<any>;
    extractBuiltin: () => Promise<any>;
    onOutput: (callback: (data: any) => void) => () => void;
    onStatusChange: (callback: (status: any) => void) => () => void;
    onStartRequest: (callback: () => void) => () => void;
    onStopRequest: (callback: () => void) => () => void;
  };
  config: {
    read: (filename: string) => Promise<any>;
    write: (filename: string, data: any) => Promise<any>;
    getPath: () => Promise<any>;
    getExtractPaths: () => Promise<any>;
    onTshockPathUpdated: (callback: (path: string) => void) => () => void;
  };
  app: {
    getVersion: () => Promise<string>;
    getPlatform: () => Promise<string>;
    getStore: (key: string) => Promise<any>;
    setStore: (key: string, value: any) => Promise<boolean>;
    selectFile: (options: any) => Promise<any>;
    getBuiltinTShockInfo: () => Promise<any>;
    getTerrariaWorldsPath: () => Promise<string>;
    getAppRootPath: () => Promise<string>;
  };
}

export const electronBridge = {
  terminal: {
    start: async () => {
      const api = getElectronAPI();
      if (!api) throw new Error('Electron API not available');
      return await api.terminal.start();
    },

    stop: async () => {
      const api = getElectronAPI();
      if (!api) throw new Error('Electron API not available');
      return await api.terminal.stop();
    },

    send: async (data: string) => {
      const api = getElectronAPI();
      if (!api) throw new Error('Electron API not available');
      return await api.terminal.send(data);
    },

    resize: async (cols: number, rows: number) => {
      const api = getElectronAPI();
      if (!api) throw new Error('Electron API not available');
      return await api.terminal.resize(cols, rows);
    },

    getStatus: async () => {
      const api = getElectronAPI();
      if (!api) throw new Error('Electron API not available');
      return await api.terminal.getStatus();
    },

    startTShock: async (worldPath?: string) => {
      const api = getElectronAPI();
      if (!api) throw new Error('Electron API not available');
      return await api.terminal.startTShock(worldPath);
    },

    sync: async () => {
      const api = getElectronAPI();
      if (!api) throw new Error('Electron API not available');
      return await api.terminal.sync();
    },

    clear: async () => {
      const api = getElectronAPI();
      if (!api) throw new Error('Electron API not available');
      return await api.terminal.clear();
    },

    extractBuiltin: async () => {
      const api = getElectronAPI();
      if (!api) throw new Error('Electron API not available');
      return await api.terminal.extractBuiltin();
    },

    onOutput: (callback: (data: any) => void) => {
      const api = getElectronAPI();
      if (!api) {
        return () => {};
      }
      return api.terminal.onOutput(callback);
    },

    onStatusChange: (callback: (status: any) => void) => {
      const api = getElectronAPI();
      if (!api) {
        return () => {};
      }
      return api.terminal.onStatusChange(callback);
    },

    onStartRequest: (callback: () => void) => {
      const api = getElectronAPI();
      if (!api) {
        return () => {};
      }
      return api.terminal.onStartRequest(callback);
    },

    onStopRequest: (callback: () => void) => {
      const api = getElectronAPI();
      if (!api) {
        return () => {};
      }
      return api.terminal.onStopRequest(callback);
    }
  },

  config: {
    read: async (filename: string) => {
      const api = getElectronAPI();
      if (!api) throw new Error('Electron API not available');
      return await api.config.read(filename);
    },

    write: async (filename: string, data: any) => {
      const api = getElectronAPI();
      if (!api) throw new Error('Electron API not available');
      return await api.config.write(filename, data);
    },

    getPath: async () => {
      const api = getElectronAPI();
      if (!api) throw new Error('Electron API not available');
      return await api.config.getPath();
    },

    getExtractPaths: async () => {
      const api = getElectronAPI();
      if (!api) throw new Error('Electron API not available');
      return await api.config.getExtractPaths();
    },

    onTshockPathUpdated: (callback: (path: string) => void) => {
      const api = getElectronAPI();
      if (!api) {
        return () => {};
      }
      return api.config.onTshockPathUpdated(callback);
    }
  },

  app: {
    getVersion: async () => {
      const api = getElectronAPI();
      if (!api) return null;
      return await api.app.getVersion();
    },

    getPlatform: async () => {
      const api = getElectronAPI();
      if (!api) return null;
      return await api.app.getPlatform();
    },

    getStore: async (key: string) => {
      const api = getElectronAPI();
      if (!api) return null;
      return await api.app.getStore(key);
    },

    setStore: async (key: string, value: any) => {
      const api = getElectronAPI();
      if (!api) return false;
      return await api.app.setStore(key, value);
    },

    selectFile: async (options: any) => {
      const api = getElectronAPI();
      if (!api) return null;
      return await api.app.selectFile(options);
    },

    getBuiltinTShockInfo: async () => {
      console.log('electronBridge - getBuiltinTShockInfo called');
      const api = getElectronAPI();
      if (!api) {
        console.log('electronBridge - API not available, returning null');
        return null;
      }
      console.log('electronBridge - API available');
      console.log('electronBridge - api.app keys:', Object.keys(api.app));
      return await api.app.getBuiltinTShockInfo();
    },

    getTerrariaWorldsPath: async () => {
      const api = getElectronAPI();
      if (!api) return '';
      return await api.app.getTerrariaWorldsPath();
    },

    getAppRootPath: async () => {
      const api = getElectronAPI();
      if (!api) return '';
      return await api.app.getAppRootPath();
    }
  }
};

export interface TerminalOutput {
  type: 'stdout' | 'stderr' | 'command' | 'error' | 'exit' | 'info';
  data: string;
  timestamp: number;
}

export interface TerminalStatus {
  status: 'stopped' | 'starting' | 'running' | 'stopping' | 'error' | 'setup' | 'idle';
  mode?: 'setup' | 'server';
  error?: string;
  timestamp: number;
}

export default electronBridge;