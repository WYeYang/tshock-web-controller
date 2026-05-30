import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppConfig } from '../types/config';
import { saveConfig, loadConfig, defaultConfig } from '../utils/storage';

interface AppContextType {
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
  updateTshockConfig: (updates: Partial<AppConfig['tshock']>) => void;
  updateLLMConfig: (updates: Partial<AppConfig['llm']>) => void;
  saveConfigToStorage: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<AppConfig>(defaultConfig);

  // 初始化加载
  useEffect(() => {
    const saved = loadConfig();
    if (saved) {
      setConfigState(saved);
    }
  }, []);

  const setConfig = (newConfig: AppConfig) => {
    setConfigState(newConfig);
    saveConfig(newConfig);
  };

  const updateTshockConfig = (updates: Partial<AppConfig['tshock']>) => {
    setConfigState(prev => {
      const newConfig = {
        ...prev,
        tshock: {
          ...prev.tshock,
          ...updates,
        },
      };
      saveConfig(newConfig);
      return newConfig;
    });
  };

  const updateLLMConfig = (updates: Partial<AppConfig['llm']>) => {
    setConfigState(prev => {
      const newConfig = {
        ...prev,
        llm: {
          ...prev.llm,
          ...updates,
        },
      };
      saveConfig(newConfig);
      return newConfig;
    });
  };

  const saveConfigToStorage = () => {
    saveConfig(config);
  };

  return (
    <AppContext.Provider value={{ 
      config, 
      setConfig, 
      updateTshockConfig, 
      updateLLMConfig, 
      saveConfigToStorage 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};