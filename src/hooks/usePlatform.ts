import { useState, useEffect, useCallback } from 'react';

export type Platform = 'windows' | 'mac' | 'linux' | 'web';

interface ElectronAPI {
  terminal: {
    start: () => Promise<any>;
    stop: () => Promise<any>;
    send: (command: string) => Promise<any>;
    getStatus: () => Promise<any>;
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
  };
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

interface PlatformInfo {
  isElectron: boolean;
  platform: Platform;
  version: string | null;
}

export function usePlatform() {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    isElectron: false,
    platform: 'web',
    version: null
  });

  useEffect(() => {
    const checkPlatform = async () => {
      const isElectron = !!window.electronAPI;

      if (isElectron && window.electronAPI) {
        try {
          const platform = await window.electronAPI.app.getPlatform();
          const version = await window.electronAPI.app.getVersion();

          let normalizedPlatform: Platform = 'web';
          if (platform === 'win32') normalizedPlatform = 'windows';
          else if (platform === 'darwin') normalizedPlatform = 'mac';
          else if (platform === 'linux') normalizedPlatform = 'linux';

          setPlatformInfo({
            isElectron: true,
            platform: normalizedPlatform,
            version
          });
        } catch (error) {
          console.error('Failed to get platform info:', error);
          setPlatformInfo({
            isElectron: true,
            platform: 'web',
            version: null
          });
        }
      } else {
        setPlatformInfo({
          isElectron: false,
          platform: 'web',
          version: null
        });
      }
    };

    checkPlatform();
  }, []);

  const selectFile = useCallback(async (options: any) => {
    if (window.electronAPI) {
      return await window.electronAPI.app.selectFile(options);
    }
    return null;
  }, []);

  const getStore = useCallback(async (key: string) => {
    if (window.electronAPI) {
      return await window.electronAPI.app.getStore(key);
    }
    return null;
  }, []);

  const setStore = useCallback(async (key: string, value: any) => {
    if (window.electronAPI) {
      return await window.electronAPI.app.setStore(key, value);
    }
    return false;
  }, []);

  return {
    ...platformInfo,
    isDesktop: platformInfo.isElectron,
    selectFile,
    getStore,
    setStore,
    hasElectronAPI: !!window.electronAPI
  };
}
