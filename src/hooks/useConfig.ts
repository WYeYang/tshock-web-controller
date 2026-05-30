import { useAppContext } from '../context/AppContext';
import type { AppConfig } from '../types/config';

export const useConfig = () => {
  const { config, setConfig, updateTshockConfig, updateLLMConfig, saveConfigToStorage } = useAppContext();

  // 兼容原来的save接口，接受一个可选参数
  const save = (newConfig?: AppConfig) => {
    if (newConfig) {
      setConfig(newConfig);
    } else {
      saveConfigToStorage();
    }
  };

  return {
    config,
    setConfig,
    updateTshockConfig,
    updateLLMConfig,
    save,
  };
};
