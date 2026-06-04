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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    if (!isElectron) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await electronBridge.config.read();

      // 如果返回的是错误对象，显示错误
      if (result && result.success === false) {
        console.log('loadConfig - config read failed:', result.error);
        setError(result.error);
        return;
      }

      // 直接使用返回的 config 对象
      if (result && result.Settings) {
        console.log('loadConfig - found valid config with Settings object');
        
        const mergedSettings = {
          ...result.Settings,
          RestApiEnabled: true,
          RestApiPort: 7878,
          EnableTokenEndpointAuthentication: false,
          LogRest: true,
          RESTMaximumRequestsPerInterval: 50,
          RESTRequestBucketDecreaseIntervalMinutes: 1,
          ApplicationRestTokens: {}
        };
        
        setConfig({
          Settings: mergedSettings
        });
      } else {
        console.log('loadConfig - no valid config found, using defaults');
        setConfig({ Settings: { ...DEFAULT_SETTINGS } });
      }
    } catch (err) {
      console.error('loadConfig error:', err);
      setConfig({ Settings: { ...DEFAULT_SETTINGS } });
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, [isElectron]);

  useEffect(() => {
    console.log('WizardConfigEditorModal - isOpen changed:', isOpen);
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen, loadConfig]);

  const handleConfirm = () => {
    onConfirm(config);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl mx-4 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426-1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">配置 TShock 服务器</h2>
                <p className="text-slate-400 text-sm mt-0.5">请检查并确认服务器配置</p>
              </div>
            </div>
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
            <ConfigForm
              config={config}
              onChange={setConfig}
            />
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
