import { useState, useCallback } from 'react';
import { LLMApi } from '../services/llmApi';
import { useConfig } from './useConfig';
import type { CommandGenerationResult } from '../types/llm';

export const useLLM = () => {
  const { config } = useConfig();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getApi = useCallback(() => {
    if (!config.llm.apiUrl || !config.llm.apiKey) {
      throw new Error('请先配置 LLM API');
    }
    return new LLMApi(config.llm.apiUrl, config.llm.apiKey);
  }, [config.llm]);

  const generateCommand = useCallback(async (naturalLanguage: string): Promise<CommandGenerationResult> => {
    setLoading(true);
    setError(null);
    try {
      const api = getApi();
      const result = await api.generateCommand(naturalLanguage);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成命令失败';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getApi]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    generateCommand,
    clearError,
    isConfigured: !!config.llm.apiUrl && !!config.llm.apiKey,
  };
};
