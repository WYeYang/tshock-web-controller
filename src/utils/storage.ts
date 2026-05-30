import type { AppConfig } from '../types/config';

const STORAGE_KEY = 'tshock-web-config';
const HISTORY_KEY = 'tshock-web-history';

export interface CommandHistoryItem {
  id: string;
  command: string;
  timestamp: number;
  response?: string;
  success: boolean;
}

const encrypt = (data: string): string => {
  return btoa(encodeURIComponent(data));
};

const decrypt = (data: string): string => {
  try {
    return decodeURIComponent(atob(data));
  } catch {
    return data;
  }
};

export const defaultConfig: AppConfig = {
  tshock: {
    serverUrl: 'http://localhost:7878',
    token: '',
    username: '',
    password: '',
    useCredentials: true,
  },
  llm: {
    apiUrl: '',
    apiKey: '',
  },
};

export const saveConfig = (config: AppConfig): void => {
  try {
    const data = JSON.stringify(config);
    const encrypted = encrypt(data);
    localStorage.setItem(STORAGE_KEY, encrypted);
  } catch (error) {
    console.error('Failed to save config:', error);
  }
};

export const loadConfig = (): AppConfig | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const decrypted = decrypt(data);
    const saved = JSON.parse(decrypted) as AppConfig;
    // 合并默认配置 - 只有为空的字段才使用默认值
    return {
      ...defaultConfig,
      ...saved,
      tshock: {
        ...defaultConfig.tshock,
        ...saved.tshock,
        serverUrl: saved.tshock?.serverUrl || defaultConfig.tshock.serverUrl,
      },
      llm: {
        ...defaultConfig.llm,
        ...saved.llm,
      },
    };
  } catch (error) {
    console.error('Failed to load config:', error);
    return null;
  }
};

export const saveCommandHistory = (history: CommandHistoryItem[]): void => {
  try {
    const data = JSON.stringify(history);
    localStorage.setItem(HISTORY_KEY, data);
  } catch (error) {
    console.error('Failed to save command history:', error);
  }
};

export const loadCommandHistory = (): CommandHistoryItem[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    return JSON.parse(data) as CommandHistoryItem[];
  } catch (error) {
    console.error('Failed to load command history:', error);
    return [];
  }
};

export const addCommandToHistory = (command: string, success: boolean, response?: any): CommandHistoryItem => {
  const history = loadCommandHistory();
  
  // 将响应转换为字符串格式
  let responseStr = '';
  if (Array.isArray(response)) {
    responseStr = response.join('\n');
  } else if (response !== null && response !== undefined) {
    responseStr = String(response);
  }
  
  const newItem: CommandHistoryItem = {
    id: Date.now().toString(),
    command,
    timestamp: Date.now(),
    success,
    response: responseStr,
  };
  const updatedHistory = [newItem, ...history].slice(0, 100);
  saveCommandHistory(updatedHistory);
  return newItem;
};

export const clearCommandHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear command history:', error);
  }
};


