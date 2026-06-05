import { useState, useEffect, useCallback } from 'react';
import { electronBridge } from '../services/electronBridge';
import { usePlatform } from '../hooks/usePlatform';
import { ItemSlot } from './ItemSlot';
import { ItemSelectorModal } from './ItemSelectorModal';
import { CONFIG_DESCRIPTIONS } from '../config/descriptions';

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


// 解析 MOTD 格式 [c/HEX颜色:文本] 为带样式的 HTML
function renderMotdPreview(text: string): string {
  if (!text) return '';
  
  // 正则匹配 [c/HEX:文本] 格式
  const colorPattern = /\[c\/([0-9a-fA-F]{6}):([^\]]*)\]/g;
  let result = text;
  let lastIndex = 0;
  let html = '';
  
  let match;
  while ((match = colorPattern.exec(text)) !== null) {
    const [fullMatch, hexColor, content] = match;
    const before = text.substring(lastIndex, match.index);
    html += escapeHtml(before);
    html += `<span style="color:#${hexColor}">${escapeHtml(content)}</span>`;
    lastIndex = match.index + fullMatch.length;
  }
  
  // 添加剩余文本
  html += escapeHtml(text.substring(lastIndex));
  
  return html;
}

// 简单的 HTML 转义
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
  
  // 物品选择器状态
  const [isItemSelectorOpen, setIsItemSelectorOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [pendingItemId, setPendingItemId] = useState<number | null>(null);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [configSearchQuery, setConfigSearchQuery] = useState('');

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
        // 确保有默认的StartingInventory (铜短剑、铜斧、铜镐)
        const defaultStartingInventory = [
          { netID: 3505, prefix: 0, stack: 1, favorited: false },
          { netID: 3502, prefix: 0, stack: 1, favorited: false },
          { netID: 3501, prefix: 0, stack: 1, favorited: false },
        ];
        setSscConfig({
          ...sscResult,
          Settings: {
            ...sscResult.Settings,
            StartingInventory: sscResult.Settings?.StartingInventory || defaultStartingInventory
          }
        });
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
              <div className="h-[500px] overflow-y-auto">
                {activeTab === 'config' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white text-sm">服务器配置</div>
                      {/* 搜索框 */}
                      <div className="relative">
                        <input
                          type="text"
                          value={configSearchQuery}
                          onChange={(e) => setConfigSearchQuery(e.target.value)}
                          placeholder="搜索配置..."
                          className="w-48 px-3 py-1.5 pl-8 bg-slate-800 border border-slate-700 rounded text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                        <svg className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {configSearchQuery && (
                          <button
                            onClick={() => setConfigSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Rest 相关配置 - 不可编辑 */}
                      <div className="bg-slate-800/30 border border-cyan-500/20 rounded-lg p-3 mb-4">
                        <div className="text-cyan-400 text-xs font-semibold mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          REST API 配置（已锁定）
                        </div>
                        
                        <div className="space-y-3">
                          {/* RestApiEnabled */}
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-slate-300 text-sm block">RestApiEnabled</label>
                              <p className="text-xs text-slate-500">启用 REST API</p>
                            </div>
                            <div className="flex items-center opacity-60">
                              <span className="px-3 py-1 bg-cyan-600 text-white rounded text-sm">是</span>
                            </div>
                          </div>
                          
                          {/* RestApiPort */}
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-slate-300 text-sm block">RestApiPort</label>
                              <p className="text-xs text-slate-500">REST API 端口</p>
                            </div>
                            <input
                              type="number"
                              value={7878}
                              disabled
                              className="w-32 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm opacity-60 cursor-not-allowed"
                            />
                          </div>
                          
                          {/* EnableTokenEndpointAuthentication */}
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-slate-300 text-sm block">EnableTokenEndpointAuthentication</label>
                              <p className="text-xs text-slate-500">启用令牌端点认证</p>
                            </div>
                            <div className="flex items-center opacity-60">
                              <span className="px-3 py-1 bg-slate-700 text-slate-400 rounded text-sm">否</span>
                            </div>
                          </div>
                          
                          {/* LogRest */}
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-slate-300 text-sm block">LogRest</label>
                              <p className="text-xs text-slate-500">记录 REST 日志</p>
                            </div>
                            <div className="flex items-center opacity-60">
                              <span className="px-3 py-1 bg-cyan-600 text-white rounded text-sm">是</span>
                            </div>
                          </div>
                          
                          {/* RESTMaximumRequestsPerInterval */}
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-slate-300 text-sm block">RESTMaximumRequestsPerInterval</label>
                              <p className="text-xs text-slate-500">每间隔最大请求数</p>
                            </div>
                            <input
                              type="number"
                              value={50}
                              disabled
                              className="w-32 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm opacity-60 cursor-not-allowed"
                            />
                          </div>
                          
                          {/* RESTRequestBucketDecreaseIntervalMinutes */}
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-slate-300 text-sm block">RESTRequestBucketDecreaseIntervalMinutes</label>
                              <p className="text-xs text-slate-500">请求桶减少间隔（分钟）</p>
                            </div>
                            <input
                              type="number"
                              value={1}
                              disabled
                              className="w-32 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm opacity-60 cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* 其他配置字段 - 可编辑 */}
                      <div className="space-y-3">
                        {/* 遍历所有配置字段，排除 Rest 相关字段，支持搜索过滤 */}
                        {(config.Settings ? Object.keys(config.Settings) : [])
                          .filter((key) => ![
                            'RestApiEnabled',
                            'RestApiPort',
                            'EnableTokenEndpointAuthentication',
                            'LogRest',
                            'RESTMaximumRequestsPerInterval',
                            'RESTRequestBucketDecreaseIntervalMinutes',
                            'ApplicationRestTokens'
                          ].includes(key))
                          .filter((key) => {
                            if (!configSearchQuery) return true;
                            const query = configSearchQuery.toLowerCase();
                            const description = (CONFIG_DESCRIPTIONS[key] || '').toLowerCase();
                            return key.toLowerCase().includes(query) || description.includes(query);
                          })
                          .map((key) => {
                          const value = config.Settings?.[key];
                          const type = typeof value;
                          
                          const description = CONFIG_DESCRIPTIONS[key] || '暂无说明';
                          
                          return (
                            <div key={key}>
                              {type === 'boolean' ? (
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <label className="text-slate-300 text-sm block">{key}</label>
                                    <p className="text-xs text-slate-500">{description}</p>
                                  </div>
                                  <div className="flex items-center">
                                    <button
                                      onClick={() => setConfig({ 
                                        ...config, 
                                        Settings: { 
                                          ...config.Settings, 
                                          [key]: true 
                                        } 
                                      })}
                                      className={`px-3 py-1 rounded-l text-sm ${config.Settings?.[key] ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                                    >
                                      是
                                    </button>
                                    <button
                                      onClick={() => setConfig({ 
                                        ...config, 
                                        Settings: { 
                                          ...config.Settings, 
                                          [key]: false 
                                        } 
                                      })}
                                      className={`px-3 py-1 rounded-r text-sm ${!config.Settings?.[key] ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                                    >
                                      否
                                    </button>
                                  </div>
                                </div>
                              ) : type === 'number' ? (
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <label className="text-slate-300 text-sm block">{key}</label>
                                    <p className="text-xs text-slate-500">{description}</p>
                                  </div>
                                  <input
                                    type="number"
                                    value={value ?? ''}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      Settings: { 
                                        ...config.Settings, 
                                        [key]: parseInt(e.target.value) ?? value 
                                      } 
                                    })}
                                    className="w-32 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>
                              ) : type === 'object' || Array.isArray(value) ? (
                                <div>
                                  <label className="text-slate-300 text-sm block mb-1">{key}</label>
                                  <p className="text-xs text-slate-500 mb-1">{description}</p>
                                  <textarea
                                    value={JSON.stringify(value, null, 2)}
                                    onChange={(e) => {
                                      try {
                                        const val = JSON.parse(e.target.value);
                                        setConfig({ 
                                          ...config, 
                                          Settings: { 
                                            ...config.Settings, 
                                            [key]: val 
                                          } 
                                        });
                                      } catch {}
                                    }}
                                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm font-mono"
                                    rows={Math.min(Math.max(JSON.stringify(value, null, 2).split('\n').length, 3), 10)}
                                  />
                                </div>
                              ) : (
                                <div>
                                  <label className="text-slate-300 text-sm block mb-1">{key}</label>
                                  <p className="text-xs text-slate-500 mb-1">{description}</p>
                                  <input
                                    type="text"
                                    value={value ?? ''}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      Settings: { 
                                        ...config.Settings, 
                                        [key]: e.target.value 
                                      } 
                                    })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                        
                        {/* 搜索无结果提示 */}
                        {configSearchQuery && Object.keys(config.Settings || {}).filter((key) => ![
                          'RestApiEnabled',
                          'RestApiPort',
                          'EnableTokenEndpointAuthentication',
                          'LogRest',
                          'RESTMaximumRequestsPerInterval',
                          'RESTRequestBucketDecreaseIntervalMinutes',
                          'ApplicationRestTokens'
                        ].includes(key)).filter((key) => {
                          if (!configSearchQuery) return true;
                          const query = configSearchQuery.toLowerCase();
                          const description = (CONFIG_DESCRIPTIONS[key] || '').toLowerCase();
                          return key.toLowerCase().includes(query) || description.includes(query);
                        }).length === 0 && (
                          <div className="text-center py-8">
                            <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-slate-400 text-sm">未找到匹配的配置项</p>
                            <p className="text-slate-500 text-xs mt-1">试试其他关键词</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'ssc' && (
                  <div className="space-y-4">
                    <div className="text-white text-sm mb-2">SSC 配置 (服务器端角色)</div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-300 text-sm">启用 SSC</label>
                        <div className="flex items-center">
                          <button
                            onClick={() => setSscConfig({ ...sscConfig, Settings: { ...sscConfig.Settings, Enabled: true } })}
                            className={`px-3 py-1 rounded-l text-sm ${sscConfig.Settings?.Enabled ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                          >
                            开
                          </button>
                          <button
                            onClick={() => setSscConfig({ ...sscConfig, Settings: { ...sscConfig.Settings, Enabled: false } })}
                            className={`px-3 py-1 rounded-r text-sm ${!sscConfig.Settings?.Enabled ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                          >
                            关
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-slate-300 text-sm block mb-1">服务器端角色保存 (分钟)</label>
                          <input
                            type="number"
                            value={sscConfig.Settings?.ServerSideCharacterSave || 5}
                            onChange={(e) => setSscConfig({ ...sscConfig, Settings: { ...sscConfig.Settings, ServerSideCharacterSave: parseInt(e.target.value) || 5 } })}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="text-slate-300 text-sm block mb-1">登录丢弃阈值 (秒)</label>
                          <input
                            type="number"
                            value={sscConfig.Settings?.LogonDiscardThreshold || 250}
                            onChange={(e) => setSscConfig({ ...sscConfig, Settings: { ...sscConfig.Settings, LogonDiscardThreshold: parseInt(e.target.value) || 250 } })}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="text-slate-300 text-sm block mb-1">初始生命值</label>
                          <input
                            type="number"
                            value={sscConfig.Settings?.StartingHealth || 100}
                            onChange={(e) => setSscConfig({ ...sscConfig, Settings: { ...sscConfig.Settings, StartingHealth: parseInt(e.target.value) || 100 } })}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="text-slate-300 text-sm block mb-1">初始魔力值</label>
                          <input
                            type="number"
                            value={sscConfig.Settings?.StartingMana || 20}
                            onChange={(e) => setSscConfig({ ...sscConfig, Settings: { ...sscConfig.Settings, StartingMana: parseInt(e.target.value) || 20 } })}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-slate-300 text-sm">保留玩家外观</label>
                        <div className="flex items-center">
                          <button
                            onClick={() => setSscConfig({ ...sscConfig, Settings: { ...sscConfig.Settings, KeepPlayerAppearance: true } })}
                            className={`px-3 py-1 rounded-l text-sm ${sscConfig.Settings?.KeepPlayerAppearance ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                          >
                            是
                          </button>
                          <button
                            onClick={() => setSscConfig({ ...sscConfig, Settings: { ...sscConfig.Settings, KeepPlayerAppearance: false } })}
                            className={`px-3 py-1 rounded-r text-sm ${!sscConfig.Settings?.KeepPlayerAppearance ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                          >
                            否
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-slate-300 text-sm">警告玩家绕过权限</label>
                        <div className="flex items-center">
                          <button
                            onClick={() => setSscConfig({ ...sscConfig, Settings: { ...sscConfig.Settings, WarnPlayersAboutBypassPermission: true } })}
                            className={`px-3 py-1 rounded-l text-sm ${sscConfig.Settings?.WarnPlayersAboutBypassPermission ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                          >
                            是
                          </button>
                          <button
                            onClick={() => setSscConfig({ ...sscConfig, Settings: { ...sscConfig.Settings, WarnPlayersAboutBypassPermission: false } })}
                            className={`px-3 py-1 rounded-r text-sm ${!sscConfig.Settings?.WarnPlayersAboutBypassPermission ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                          >
                            否
                          </button>
                        </div>
                      </div>
                      
                      {/* 初始背包编辑 */}
                      <div>
                        <label className="text-slate-300 text-sm block mb-2">初始背包</label>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                          <div className="flex flex-wrap gap-1.5">
                            {(sscConfig.Settings?.StartingInventory || []).map((item: any, index: number) => (
                              <div 
                                key={`${item.netID}-${item.stack}-${index}`} 
                                className="flex flex-col gap-1 items-center"
                              >
                                {/* 物品格子 - 点击打开选择器 */}
                                <div
                                  className="cursor-pointer hover:ring-2 hover:ring-cyan-500/50 rounded"
                                >
                                  <ItemSlot 
                                    item={item} 
                                    onClick={() => {
                                      setSelectedSlotIndex(index);
                                      setIsItemSelectorOpen(true);
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                            {/* 添加按钮 - 类似物品格子 */}
                            <div className="flex flex-col gap-1 items-center">
                              <div
                                onClick={() => {
                                  const newInv = [...(sscConfig.Settings?.StartingInventory || [])];
                                  const newIndex = newInv.length;
                                  newInv.push({ netID: 0, prefix: 0, stack: 1, favorited: false });
                                  setSscConfig({ ...sscConfig, Settings: { ...sscConfig.Settings, StartingInventory: newInv } });
                                  setSelectedSlotIndex(newIndex);
                                  setIsItemSelectorOpen(true);
                                }}
                                className="w-10 h-10 bg-slate-700/50 border border-dashed border-slate-600/50 rounded flex items-center justify-center cursor-pointer hover:border-cyan-500/50 hover:bg-slate-600/50 transition-all"
                              >
                                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'motd' && (
                  <div className="flex flex-col h-full space-y-4">
                    <div className="text-white text-sm mb-2">MOTD (欢迎消息)</div>
                    
                    {/* 格式说明 - 放最上面 */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex-shrink-0">
                      <div className="text-slate-300 text-xs font-semibold mb-2">格式说明:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <div>
                          <span className="text-slate-200">[c/ff0000:红色]</span>
                          <span className="ml-2">→ 红色文本</span>
                        </div>
                        <div>
                          <span className="text-slate-200">[c/00ff00:绿色]</span>
                          <span className="ml-2">→ 绿色文本</span>
                        </div>
                        <div>
                          <span className="text-slate-200">[c/0000ff:蓝色]</span>
                          <span className="ml-2">→ 蓝色文本</span>
                        </div>
                        <div>
                          <span className="text-slate-200">[c/ffffff:白色]</span>
                          <span className="ml-2">→ 白色文本</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        占位符: %map% → 地图名, %players% → 玩家数, %serverslots% → 服务器槽数
                      </div>
                    </div>
                    
                    {/* 预览和编辑 - 上下排列，占满剩余空间 */}
                    <div className="flex flex-col flex-1 gap-4 overflow-hidden">
                      {/* 预览区域 - 占一半高度 */}
                      <div className="flex flex-col flex-1 overflow-hidden">
                        <div className="text-slate-400 text-xs mb-2 flex-shrink-0">预览 (游戏内显示):</div>
                        <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 flex-1 overflow-y-auto">
                          <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: renderMotdPreview(motdText) }} />
                        </div>
                      </div>
                      
                      {/* 编辑区域 - 占一半高度 */}
                      <div className="flex flex-col flex-1 overflow-hidden">
                        <div className="text-slate-400 text-xs mb-2 flex-shrink-0">编辑:</div>
                        <textarea
                          value={motdText}
                          onChange={(e) => setMotdText(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded text-white text-sm p-2 font-mono resize-none flex-1"
                          placeholder="Welcome to the server..."
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'rules' && (
                  <div className="space-y-4">
                    <div className="text-white text-sm mb-2">规则</div>
                    <textarea
                      value={rulesText}
                      onChange={(e) => setRulesText(e.target.value)}
                      className="w-full h-[360px] bg-slate-900 border border-slate-700 rounded text-white text-sm p-2"
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
                      className="w-full h-[360px] bg-slate-900 border border-slate-700 rounded text-white text-sm p-2"
                      placeholder="127.0.0.1"
                    />
                  </div>
                )}
              </div>
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
      
      {/* 物品选择器 */}
      <ItemSelectorModal
        isOpen={isItemSelectorOpen}
        onClose={() => setIsItemSelectorOpen(false)}
        onSelectItem={(itemId) => {
          setPendingItemId(itemId);
          setIsItemSelectorOpen(false);
          setShowQuantityDialog(true);
        }}
      />
      
      {/* 数量选择对话框 */}
      {showQuantityDialog && pendingItemId !== null && selectedSlotIndex !== null && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 w-64">
            <h3 className="text-white text-sm font-semibold mb-3">输入数量</h3>
            <input
              type="number"
              defaultValue={sscConfig.Settings?.StartingInventory[selectedSlotIndex]?.stack || 1}
              min="1"
              autoFocus
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white text-sm mb-3"
              ref={(input) => input?.select()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const newInv = [...(sscConfig.Settings?.StartingInventory || [])];
                  newInv[selectedSlotIndex] = {
                    netID: pendingItemId,
                    prefix: 0,
                    stack: Math.max(1, parseInt((e.target as HTMLInputElement).value) || 1),
                    favorited: false
                  };
                  setSscConfig({ ...sscConfig, Settings: { ...sscConfig.Settings, StartingInventory: newInv } });
                  setShowQuantityDialog(false);
                  setPendingItemId(null);
                  setSelectedSlotIndex(null);
                }
                if (e.key === 'Escape') {
                  setShowQuantityDialog(false);
                  setPendingItemId(null);
                  setSelectedSlotIndex(null);
                }
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowQuantityDialog(false);
                  setPendingItemId(null);
                  setSelectedSlotIndex(null);
                }}
                className="flex-1 px-3 py-1.5 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600 transition-all"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const input = document.querySelector('.fixed.z-\\[10001\\] input[type="number"]') as HTMLInputElement;
                  const newInv = [...(sscConfig.Settings?.StartingInventory || [])];
                  newInv[selectedSlotIndex] = {
                    netID: pendingItemId,
                    prefix: 0,
                    stack: Math.max(1, parseInt(input?.value || '1')),
                    favorited: false
                  };
                  setSscConfig({ ...sscConfig, Settings: { ...sscConfig.Settings, StartingInventory: newInv } });
                  setShowQuantityDialog(false);
                  setPendingItemId(null);
                  setSelectedSlotIndex(null);
                }}
                className="flex-1 px-3 py-1.5 bg-cyan-600 text-white rounded text-sm hover:bg-cyan-500 transition-all"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};