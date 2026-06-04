import { useState, useEffect, useCallback } from 'react';
import { electronBridge } from '../services/electronBridge';
import { usePlatform } from '../hooks/usePlatform';
import { ConfigForm } from './ConfigForm';

interface TShockConfig {
  [key: string]: any;
}

interface WizardConfigEditorModalProps {
  isOpen: boolean;
  onConfirm: (config: TShockConfig) => void;
}

const DEFAULT_SETTINGS = {
  ServerPassword: '',
  RestApiEnabled: true,
  RestApiPort: 7878,
  EnableTokenEndpointAuthentication: false,
  LogRest: true,
  RESTMaximumRequestsPerInterval: 50,
  RESTRequestBucketDecreaseIntervalMinutes: 1,
  ApplicationRestTokens: {}
};

const DEFAULT_CONFIG: TShockConfig = {
  Settings: DEFAULT_SETTINGS
};

export const WizardConfigEditorModal = ({ isOpen, onConfirm }: WizardConfigEditorModalProps) => {
  const { isElectron } = usePlatform();
  const [config, setConfig] = useState<TShockConfig>({ ...DEFAULT_CONFIG });
  const [sscConfig, setSscConfig] = useState<any>({ Settings: {} });
  const [motdText, setMotdText] = useState('');
  const [rulesText, setRulesText] = useState('');
  const [whitelistText, setWhitelistText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'config' | 'ssc' | 'motd' | 'rules' | 'whitelist'>('config');

  const loadAllConfigs = useCallback(async () => {
    if (!isElectron) return;

    setIsLoading(true);
    setError(null);

    try {
      // 加载主配置
      const configResult = await electronBridge.config.read('config.json');
      if (configResult && typeof configResult === 'object' && configResult.Settings) {
        const mergedSettings = {
          ...configResult.Settings,
          RestApiEnabled: true,
          RestApiPort: 7878,
          EnableTokenEndpointAuthentication: false,
          LogRest: true,
          RESTMaximumRequestsPerInterval: 50,
          RESTRequestBucketDecreaseIntervalMinutes: 1,
          ApplicationRestTokens: {}
        };
        setConfig({ Settings: mergedSettings });
      }

      // 加载 sscconfig.json
      const sscResult = await electronBridge.config.read('sscconfig.json');
      if (sscResult && typeof sscResult === 'object') {
        setSscConfig(sscResult);
      }

      // 加载 motd.txt
      const motdResult = await electronBridge.config.read('motd.txt');
      setMotdText(typeof motdResult === 'string' ? motdResult : '');

      // 加载 rules.txt
      const rulesResult = await electronBridge.config.read('rules.txt');
      setRulesText(typeof rulesResult === 'string' ? rulesResult : '');

      // 加载 whitelist.txt
      const whitelistResult = await electronBridge.config.read('whitelist.txt');
      setWhitelistText(typeof whitelistResult === 'string' ? whitelistResult : '');
    } catch (err) {
      console.error('loadConfigs error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isElectron]);

  useEffect(() => {
    if (isOpen) {
      loadAllConfigs();
    }
  }, [isOpen, loadAllConfigs]);

  const handleConfirm = async () => {
    if (!isElectron) return;
    
    // 保存所有配置
    await electronBridge.config.write('config.json', config);
    await electronBridge.config.write('sscconfig.json', sscConfig);
    await electronBridge.config.write('motd.txt', motdText);
    await electronBridge.config.write('rules.txt', rulesText);
    await electronBridge.config.write('whitelist.txt', whitelistText);
    
    onConfirm(config);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl mx-4 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 001.066-2.573c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 001.065-2.572c1.756-.426 1.756-2.924 0-3.35a1.724 1.724 0 00-1.065-2.573c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">配置 TShock 服务器</h2>
                <p className="text-slate-400 text-sm mt-0.5">请检查并确认服务器配置</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 border-b border-slate-700/50 pb-2">
            {[
              { id: 'config', label: 'config.json' },
              { id: 'ssc', label: 'sscconfig.json' },
              { id: 'motd', label: 'motd.txt' },
              { id: 'rules', label: 'rules.txt' },
              { id: 'whitelist', label: 'whitelist.txt' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>加载配置中...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-red-400 font-semibold mb-2 text-sm">加载失败</h3>
              <p className="text-slate-400 text-xs">{error}</p>
            </div>
          ) : (
            <>
              {activeTab === 'config' && (
                <ConfigForm
                  config={config}
                  onChange={setConfig}
                />
              )}
              
              {activeTab === 'ssc' && (
                <div className="space-y-4">
                  <div className="text-white text-sm mb-2">SSC 配置 (服务器端角色配置</div>
                  <textarea
                    value={JSON.stringify(sscConfig, null, 2)}
                    onChange={(e) => {
                      try {
                        setSscConfig(JSON.parse(e.target.value));
                      } catch {}
                    }}
                    className="w-full h-64 bg-slate-900 border border-slate-700 rounded text-white text-sm font-mono p-2"
                  />
                </div>
              )}
              
              {activeTab === 'motd' && (
                <div className="space-y-4">
                  <div className="text-white text-sm mb-2">MOTD (消息)</div>
                  <textarea
                    value={motdText}
                    onChange={(e) => setMotdText(e.target.value)}
                    className="w-full h-64 bg-slate-900 border border-slate-700 rounded text-white text-sm p-2"
                    placeholder="Welcome to the server..."
                  />
                </div>
              )}
              
              {activeTab === 'rules' && (
                <div className="space-y-4">
                  <div className="text-white text-sm mb-2">规则</div>
                  <textarea
                    value={rulesText}
                    onChange={(e) => setRulesText(e.target.value)}
                    className="w-full h-64 bg-slate-900 border border-slate-700 rounded text-white text-sm p-2"
                    placeholder="1. Respect others..."
                  />
                </div>
              )}
              
              {activeTab === 'whitelist' && (
                <div className="space-y-4">
                  <div className="text-white text-sm mb-2">白名单</div>
                  <textarea
                    value={whitelistText}
                    onChange={(e) => setWhitelistText(e.target.value)}
                    className="w-full h-64 bg-slate-900 border border-slate-700 rounded text-white text-sm p-2"
                    placeholder="127.0.0.1"
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-700/50 bg-slate-950/30 rounded-b-2xl flex-shrink-0">
          <div className="flex justify-end">
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认并继续
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};