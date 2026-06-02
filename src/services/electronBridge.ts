let electronAPI: any = null;

if (typeof window !== 'undefined') {
  electronAPI = (window as any).electronAPI || null;
}

export const isElectronAvailable = !!electronAPI;

export interface ElectronAPI {
  terminal: {
    start: () => Promise<any>;
    stop: () => Promise<any>;
    send: (command: string) => Promise<any>;
    getStatus: () => Promise<any>;
    setup: (tshockDir: string) => Promise<any>;
    sync: () => Promise<any>;
    clear: () => Promise<any>;
    onOutput: (callback: (data: any) => void) => () => void;
    onStatusChange: (callback: (status: any) => void) => () => void;
    onStartRequest: (callback: () => void) => () => void;
    onStopRequest: (callback: () => void) => () => void;
  };
  config: {
    read: () => Promise<any>;
    write: (data: any) => Promise<any>;
    setToken: (token: string) => Promise<any>;
    generateToken: () => Promise<any>;
    getPath: () => Promise<any>;
    setPath: (path: string) => Promise<any>;
    setWorkingDir: (workingDir: string) => Promise<any>;
    validatePath: (path: string) => Promise<any>;
    onTshockPathUpdated: (callback: (path: string) => void) => () => void;
    onSaved: (callback: (success: boolean, error?: string) => void) => () => void;
  };
  app: {
    getVersion: () => Promise<string>;
    getPlatform: () => Promise<string>;
    getStore: (key: string) => Promise<any>;
    setStore: (key: string, value: any) => Promise<boolean>;
    selectFile: (options: any) => Promise<any>;
    extractBuiltinTShock: () => Promise<any>;
    getBuiltinTShockInfo: () => Promise<any>;
    clearConfig: () => Promise<any>;
  };
}

export const electronBridge = {
  terminal: {
    start: async () => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.terminal.start();
    },

    stop: async () => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.terminal.stop();
    },

    send: async (command: string) => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.terminal.send(command);
    },

    getStatus: async () => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.terminal.getStatus();
    },

    setup: async (tshockDir: string) => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.terminal.setup(tshockDir);
    },

    sync: async () => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.terminal.sync();
    },

    clear: async () => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.terminal.clear();
    },

    onOutput: (callback: (data: TerminalOutput) => void) => {
      if (!electronAPI) {
        return () => {};
      }
      return electronAPI.terminal.onOutput(callback);
    },

    onStatusChange: (callback: (status: TerminalStatus) => void) => {
      if (!electronAPI) {
        return () => {};
      }
      return electronAPI.terminal.onStatusChange(callback);
    },

    onStartRequest: (callback: () => void) => {
      if (!electronAPI) {
        return () => {};
      }
      return electronAPI.terminal.onStartRequest(callback);
    },

    onStopRequest: (callback: () => void) => {
      if (!electronAPI) {
        return () => {};
      }
      return electronAPI.terminal.onStopRequest(callback);
    }
  },

  config: {
    read: async () => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.config.read();
    },

    write: async (data: any) => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.config.write(data);
    },

    setToken: async (token: string) => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.config.setToken(token);
    },

    generateToken: async () => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.config.generateToken();
    },

    getPath: async () => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.config.getPath();
    },

    setPath: async (configPath: string) => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.config.setPath(configPath);
    },

    setWorkingDir: async (workingDir: string) => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.config.setWorkingDir(workingDir);
    },

    validatePath: async (filePath: string) => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.config.validatePath(filePath);
    },

    onTshockPathUpdated: (callback: (path: string) => void) => {
      if (!electronAPI) {
        return () => {};
      }
      return electronAPI.config.onTshockPathUpdated(callback);
    },

    onSaved: (callback: (success: boolean, error?: string) => void) => {
      if (!electronAPI) {
        return () => {};
      }
      return electronAPI.config.onSaved(callback);
    }
  },

  app: {
    getVersion: async () => {
      if (!electronAPI) return null;
      return await electronAPI.app.getVersion();
    },

    getPlatform: async () => {
      if (!electronAPI) return null;
      return await electronAPI.app.getPlatform();
    },

    getStore: async (key: string) => {
      if (!electronAPI) return null;
      return await electronAPI.app.getStore(key);
    },

    setStore: async (key: string, value: any) => {
      if (!electronAPI) return false;
      return await electronAPI.app.setStore(key, value);
    },

    selectFile: async (options: any) => {
      if (!electronAPI) return null;
      return await electronAPI.app.selectFile(options);
    },

    extractBuiltinTShock: async () => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.app.extractBuiltinTShock();
    },

    getBuiltinTShockInfo: async () => {
      if (!electronAPI) return null;
      return await electronAPI.app.getBuiltinTShockInfo();
    },

    clearConfig: async () => {
      if (!electronAPI) throw new Error('Electron API not available');
      return await electronAPI.app.clearConfig();
    }
  }
};

export interface TerminalOutput {
  type: 'stdout' | 'stderr' | 'command' | 'error' | 'exit' | 'info';
  data: string;
  timestamp: number;
}

export interface TerminalStatus {
  status: 'stopped' | 'starting' | 'running' | 'stopping' | 'error' | 'setup';
  mode?: 'setup' | 'server';
  error?: string;
  timestamp: number;
}

export default electronBridge;
