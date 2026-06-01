import { useState, useEffect, useCallback } from 'react';
import { electronBridge } from '../services/electronBridge';
import { usePlatform } from '../hooks/usePlatform';

interface TShockConfig {
  RestApiEnabled?: boolean;
  RestApiPort?: number;
  Token?: string;
  EnableTokenLoginAuthentication?: boolean;
  [key: string]: any;
}

const CONFIG_FIELDS = [
  { key: 'RestApiEnabled', label: '启用 REST API', type: 'boolean' },
  { key: 'RestApiPort', label: 'REST API 端口', type: 'number' },
  { key: 'Token', label: 'Token', type: 'string' },
  { key: 'EnableTokenLoginAuthentication', label: '启用 Token 登录认证', type: 'boolean' },
];

export const ConfigEditor = () => {
  const { isElectron } = usePlatform();
  const [config, setConfig] = useState<TShockConfig>({});
  const [originalConfig, setOriginalConfig] = useState<TShockConfig>({});
  const [configPath, setConfigPath] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [newToken, setNewToken] = useState<string>('');
  const [showToken, setShowToken] = useState(false);

  const loadConfig = useCallback(async () => {
    if (!isElectron) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await electronBridge.config.read();

      if (result.success && result.config) {
        setConfig(result.config);
        setOriginalConfig(result.config);
        setConfigPath(result.path);
      } else if (result.exists === false) {
        setError(result.error || '配置文件不存在');
        setConfig({});
        setOriginalConfig({});
      } else {
        setError(result.error || '加载配置失败');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '加载配置失败';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [isElectron]);

  useEffect(() => {
    loadConfig();

    if (!isElectron) return;

    const unsubscribe = electronBridge.config.onSaved((success, errorMsg) => {
      if (success) {
        setSuccess('配置保存成功！');
        setHasChanges(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(errorMsg || '保存失败');
      }
      setIsSaving(false);
    });

    return () => {
      unsubscribe();
    };
  }, [isElectron, loadConfig]);

  useEffect(() => {
    const changed = JSON.stringify(config) !== JSON.stringify(originalConfig);
    setHasChanges(changed);
  }, [config, originalConfig]);

  const handleFieldChange = (key: string, value: any, type: string) => {
    let parsedValue: any = value;

    if (type === 'boolean') {
      parsedValue = value === 'true' || value === true;
    } else if (type === 'number') {
      parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) parsedValue = 0;
    }

    setConfig(prev => ({
      ...prev,
      [key]: parsedValue
    }));
  };

  const handleSave = async () => {
    if (!isElectron) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await electronBridge.config.write(config);
      if (!result.success) {
        setError(result.error || '保存失败');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '保存失败';
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(originalConfig);
    setHasChanges(false);
  };

  const handleGenerateToken = async () => {
    if (!isElectron) return;

    try {
      const token = await electronBridge.config.generateToken();
      setNewToken(token);
      setConfig(prev => ({
        ...prev,
        Token: token
      }));
    } catch (err) {
      console.error('Failed to generate token:', err);
    }
  };

  const handleApplyNewToken = () => {
    if (newToken) {
      setConfig(prev => ({
        ...prev,
        Token: newToken
      }));
      setNewToken('');
    }
  };

  if (!isElectron) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8">
        <div className="glass-card neon-border p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">配置文件编辑器仅在桌面端可用</h2>
          <p className="text-slate-400">配置文件编辑器需要使用 Electron 桌面应用。请下载桌面版应用以使用此功能。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center neon-pulse">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">配置文件编辑器</h1>
            <p className="text-slate-400 text-sm">编辑 TShock 服务器配置</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-yellow-400 text-sm">有未保存的更改</span>
          )}
          <button
            onClick={loadConfig}
            disabled={isLoading}
            className="px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-all text-sm disabled:opacity-50"
          >
            重新加载
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-slate-400">
              <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>加载配置中...</span>
            </div>
          </div>
        ) : error && Object.keys(config).length === 0 ? (
          <div className="glass-card neon-border p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-red-400 font-semibold mb-2">加载失败</h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <button
              onClick={loadConfig}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-all"
            >
              重试
            </button>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="glass-card neon-border">
              <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">配置文件</h3>
                    <p className="text-slate-400 text-sm mt-1 break-all">{configPath}</p>
                  </div>
                  {success && (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {success}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-cyan-400 font-medium flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    REST API 配置
                  </h4>

                  {CONFIG_FIELDS.map(field => (
                    <div key={field.key}>
                      <label className="block text-slate-300 font-medium mb-2">
                        {field.label}
                      </label>
                      {field.type === 'boolean' ? (
                        <select
                          value={config[field.key] ? 'true' : 'false'}
                          onChange={(e) => handleFieldChange(field.key, e.target.value, field.type)}
                          className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-all"
                        >
                          <option value="true">是</option>
                          <option value="false">否</option>
                        </select>
                      ) : field.key === 'Token' ? (
                        <div className="relative">
                          <input
                            type={showToken ? 'text' : 'password'}
                            value={config[field.key] || ''}
                            onChange={(e) => handleFieldChange(field.key, e.target.value, field.type)}
                            placeholder="输入 Token"
                            className="w-full px-4 py-3 pr-12 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowToken(!showToken)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                          >
                            {showToken ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          value={config[field.key] || ''}
                          onChange={(e) => handleFieldChange(field.key, e.target.value, field.type)}
                          placeholder={`输入 ${field.label}`}
                          className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                        />
                      )}
                    </div>
                  ))}

                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleGenerateToken}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-all"
                      >
                        生成新 Token
                      </button>
                      {newToken && (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={newToken}
                            onChange={(e) => setNewToken(e.target.value)}
                            placeholder="生成的新 Token"
                            className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white font-mono text-sm"
                            readOnly
                          />
                          <button
                            onClick={handleApplyNewToken}
                            className="px-3 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white text-sm transition-all"
                          >
                            应用
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm mt-2">
                      点击"生成新 Token"创建一个随机 Token，然后点击"应用"将其填入配置。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleReset}
                disabled={!hasChanges || isSaving}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                重置更改
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? '保存中...' : '保存配置'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
