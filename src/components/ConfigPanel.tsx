import { useState } from 'react';
import { useConfig } from '../hooks/useConfig';
import { useTShock } from '../hooks/useTShock';

const maskToken = (token: string): string => {
  if (!token) return '';
  if (token.length <= 8) return token;
  const start = token.slice(0, 4);
  const end = token.slice(-4);
  return `${start}****${end}`;
};

export const ConfigPanel = () => {
  const { config, updateTshockConfig, updateLLMConfig, save } = useConfig();
  const { loading, fetchAndSaveToken, clearError } = useTShock();
  const [showSuccess, setShowSuccess] = useState(false);
  const [tokenMessage, setTokenMessage] = useState<string | null>(null);
  const [showRegenerate, setShowRegenerate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    save(config);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleTshockChange = (field: string, value: string) => {
    updateTshockConfig({ [field]: value });
  };

  const handleLLMChange = (field: string, value: string) => {
    updateLLMConfig({ [field]: value });
  };

  const handleGetToken = async () => {
    if (!config.tshock.username || !config.tshock.password) {
      setTokenMessage('请输入用户名和密码');
      return;
    }
    
    clearError();
    setTokenMessage(null);
    
    try {
      await fetchAndSaveToken(
        config.tshock.username, 
        config.tshock.password, 
        config.tshock.serverUrl
      );
      setTokenMessage('✓ Token获取成功！已自动保存');
      setShowRegenerate(false);
      setTimeout(() => setTokenMessage(null), 5000);
    } catch (err) {
      setTokenMessage(err instanceof Error ? err.message : '获取Token失败');
    }
  };

  const handleRegenerate = () => {
    setShowRegenerate(true);
  };

  const hasToken = !!config.tshock.token;

  return (
    <div className="w-full">
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 glass-card px-6 py-3 neon-cyan animate-fade-in">
          <span className="text-cyan-400 font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            配置保存成功！
          </span>
        </div>
      )}

      <div className="glass-card neon-border">
        <div className="p-6 space-y-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center neon-cyan">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">TShock 服务器配置</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-cyan-400 font-medium mb-2">服务器地址</label>
                <input
                  type="text"
                  value={config.tshock.serverUrl}
                  onChange={(e) => handleTshockChange('serverUrl', e.target.value)}
                  placeholder="http://localhost:7878"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
                <p className="text-slate-500 text-sm mt-1">输入TShock服务器的地址，API请求会通过后端代理转发</p>
              </div>

              {hasToken && !showRegenerate ? (
                <>
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-cyan-400 font-medium mb-1">✓ Token 已配置</div>
                        <div className="text-slate-300 font-mono text-sm">{maskToken(config.tshock.token)}</div>
                      </div>
                      <button
                        onClick={handleRegenerate}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-cyan-400 font-medium transition-all"
                      >
                        重新生成
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-cyan-400 font-medium mb-2">用户名</label>
                    <input
                      type="text"
                      value={config.tshock.username}
                      onChange={(e) => handleTshockChange('username', e.target.value)}
                      placeholder="输入用户名"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-400 font-medium mb-2">密码</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={config.tshock.password}
                        onChange={(e) => handleTshockChange('password', e.target.value)}
                        placeholder="输入密码"
                        className="w-full px-4 py-3 pr-12 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        {showPassword ? (
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
                  </div>

                  <button
                    onClick={handleGetToken}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-bold hover:opacity-90 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? '获取中...' : (hasToken ? '重新获取 Token' : '获取 Token')}
                  </button>

                  {tokenMessage && (
                    <div className={`mt-2 p-3 rounded-lg text-center ${tokenMessage.includes('✓') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {tokenMessage}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center neon-purple">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">LLM API 配置</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-purple-400 font-medium mb-2">API URL</label>
                <input
                  type="text"
                  value={config.llm.apiUrl}
                  onChange={(e) => handleLLMChange('apiUrl', e.target.value)}
                  placeholder="https://api.example.com"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-purple-400 font-medium mb-2">API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={config.llm.apiKey}
                    onChange={(e) => handleLLMChange('apiKey', e.target.value)}
                    placeholder="输入您的 API Key"
                    className="w-full px-4 py-3 pr-12 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                  >
                    {showApiKey ? (
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
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg text-white font-bold text-lg hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] neon-pulse"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};