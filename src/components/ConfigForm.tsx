import { useState, useCallback, useEffect } from 'react';

interface TShockConfig {
  [key: string]: any;
}

interface ConfigFormProps {
  config: TShockConfig;
  onChange: (config: TShockConfig) => void;
}

const formatKey = (key: string): string => {
  // 特殊处理一些常见的缩写词
  const specialCases: Record<string, string> = {
    'RestApiEnabled': 'REST API Enabled',
    'RestApiPort': 'REST API Port',
    'EnableTokenEndpointAuthentication': 'Enable Token Endpoint Authentication',
    'LogRest': 'Log REST',
    'RESTMaximumRequestsPerInterval': 'REST Maximum Requests Per Interval',
    'RESTRequestBucketDecreaseIntervalMinutes': 'REST Request Bucket Decrease Interval Minutes',
    'ApplicationRestTokens': 'Application REST Tokens',
    'EnableTokenLoginAuthentication': 'Enable Token Login Authentication',
    'ServerPassword': 'Server Password',
    'ServerPort': 'Server Port',
    'ServerName': 'Server Name',
    'ServerSideCharacter': 'Server Side Character',
    'DisableBuild': 'Disable Build',
    'DisableHardmode': 'Disable Hardmode',
    'DisableDungeonGuardian': 'Disable Dungeon Guardian',
    'AutoSave': 'Auto Save',
    'AnnounceSave': 'Announce Save',
    'ShowBackupAutosaveMessages': 'Show Backup Autosave Messages',
    'BackupInterval': 'Backup Interval',
    'BackupKeepFor': 'Backup Keep For',
    'SaveWorldOnCrash': 'Save World On Crash',
    'KickProxyUsers': 'Kick Proxy Users',
    'StorageType': 'Storage Type',
    'UseSqlLogs': 'Use SQL Logs',
  };

  if (specialCases[key]) {
    return specialCases[key];
  }

  // 对于没有特殊处理的，仍然使用简单的格式化，但避免把缩写词拆分开
  return key
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase());
};

const getValueType = (value: any): 'boolean' | 'number' | 'string' | 'object' | 'array' => {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') return 'string';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object' && value !== null) return 'object';
  return 'string';
};

const getConfigDescription = (key: string): string => {
  const descriptions: Record<string, string> = {
    // 服务器基础配置
    'ServerPassword': '服务器密码，玩家加入时需要输入此密码才能进入',
    'MaxPlayers': '服务器最大玩家数量限制',
    'ServerPort': '服务器监听的端口号',
    'ServerName': '服务器显示的名称',
    'ServerFullNotice': '服务器已满时向玩家显示的提示信息',
    
    // REST API 配置
    'RestApiEnabled': '是否启用 REST API 接口（必需，用于 Web 控制）',
    'RestApiPort': 'REST API 监听的端口号（必需）',
    'EnableTokenEndpointAuthentication': '是否启用端点身份验证（必需，安全设置）',
    'LogRest': '是否记录 REST API 请求日志（必需）',
    'RESTMaximumRequestsPerInterval': '指定时间间隔内最大 API 请求数限制（必需）',
    'RESTRequestBucketDecreaseIntervalMinutes': 'API 请求限流的重置时间间隔（分钟，必需）',
    'ApplicationRestTokens': '存储 REST API 访问令牌的对象（必需）',
    
    // 其他常见配置
    'EnableTokenLoginAuthentication': '是否启用 Token 登录认证（允许玩家通过 REST API Token 登录）',
    'DisableBuild': '是否禁用玩家建造功能',
    'DisableHardmode': '是否禁用困难模式',
    'DisableDungeonGuardian': '是否禁用地牢守护者',
    'DisableInvasion': '是否禁用入侵事件',
    'DisableSnowMoon': '是否禁用霜月事件',
    'DisablePumpkinMoon': '是否禁用南瓜月事件',
    'DisableFishing': '是否禁用钓鱼功能',
    'DisableSunMoon': '是否禁用日月石修改时间',
    'ServerSideCharacter': '是否启用服务端角色管理',
    'SaveWorldOnCrash': '服务器崩溃时是否自动保存世界',
    'AutoSave': '是否启用世界自动保存',
    'AnnounceSave': '保存世界时是否公告通知',
    'ShowBackupAutosaveMessages': '是否显示自动备份消息',
    'BackupInterval': '世界自动备份间隔（分钟）',
    'BackupKeepFor': '保留备份的天数',
    'BackupPath': '世界备份文件存储路径',
    'WorldPath': '世界文件存储路径',
    'LogPath': '日志文件存储路径',
    'WorldName': '世界名称',
    'Difficulty': '游戏难度（0=普通，1=专家，2=大师，3=旅途）',
    'DisableBugs': '是否禁用 Bug 报告功能',
    'DisabledInvasions': '禁用的入侵事件列表',
    'DisableClownBombs': '是否禁用小丑炸弹',
    'DisableSnowBalls': '是否禁用雪球伤害',
    'ForceXmas': '是否强制圣诞节活动',
    'ForceHalloween': '是否强制万圣节活动',
    'KickProxyUsers': '是否踢出代理用户',
    'AllowVanillaSSC': '是否允许原版服务端角色',
    'DisableLoginBeforeJoin': '是否禁用加入前的登录要求',
    'DisableWhitelist': '是否禁用白名单',
    'DisableBlacklist': '是否禁用黑名单',
    'DisableHardcoreBan': '是否禁用硬核角色死亡封禁',
    'ServerNamePlate': '服务器显示在玩家头顶的名称',
    'StorageType': '数据存储类型（sqlite/mysql）',
    'UseSqlLogs': '是否启用 SQL 日志',
  };
  
  return descriptions[key] || '暂无描述';
};

const renderField = (
  key: string,
  value: any,
  parentPath: string,
  onChange: (newValue: any) => void,
  isLocked: boolean = false
) => {
  const type = getValueType(value);
  const fullPath = parentPath ? `${parentPath}.${key}` : key;

  // 注意：Settings 对象由专门的 renderSettingsFields 处理，这里不再需要在这里处理嵌套对象

  return (
    <div key={fullPath} className="mb-3">
      <label className={`block text-xs font-medium mb-1 flex items-center gap-1 ${isLocked ? 'text-green-400' : 'text-slate-300'}`}>
        {isLocked && <span className="text-xs">🔒</span>}
        {formatKey(key)}
        {isLocked && <span className="text-xs text-green-400 opacity-75">(必需)</span>}
      </label>
      <p className="text-xs text-slate-500 mb-1">{getConfigDescription(key)}</p>
      {type === 'boolean' ? (
        <select
          value={value ? 'true' : 'false'}
          onChange={(e) => !isLocked && onChange(e.target.value === 'true')}
          disabled={isLocked}
          className={`w-full px-2 py-1 text-xs rounded text-white focus:outline-none focus:border-cyan-400 transition-all ${
            isLocked 
              ? 'bg-green-900/30 border border-green-500/30 opacity-75 cursor-not-allowed' 
              : 'bg-slate-900/50 border border-cyan-500/30'
          }`}
        >
          <option value="true">是</option>
          <option value="false">否</option>
        </select>
      ) : type === 'number' ? (
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => !isLocked && onChange(parseInt(e.target.value, 10) || 0)}
          disabled={isLocked}
          placeholder={`输入 ${formatKey(key)}`}
          className={`w-full px-2 py-1 text-xs rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all ${
            isLocked 
              ? 'bg-green-900/30 border border-green-500/30 opacity-75 cursor-not-allowed' 
              : 'bg-slate-900/50 border border-cyan-500/30'
          }`}
        />
      ) : type === 'object' || type === 'array' ? (
        <textarea
          value={JSON.stringify(value, null, 2)}
          onChange={(e) => {
            if (!isLocked) {
              try {
                onChange(JSON.parse(e.target.value));
              } catch {
                // 忽略无效 JSON
              }
            }
          }}
          disabled={isLocked}
          placeholder="输入 JSON"
          rows={3}
          className={`w-full px-2 py-1 text-xs rounded text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all resize-none ${
            isLocked 
              ? 'bg-green-900/30 border border-green-500/30 opacity-75 cursor-not-allowed' 
              : 'bg-slate-900/50 border border-cyan-500/30'
          }`}
        />
      ) : (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => !isLocked && onChange(e.target.value)}
          disabled={isLocked}
          placeholder={`输入 ${formatKey(key)}`}
          className={`w-full px-2 py-1 text-xs rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all ${
            isLocked 
              ? 'bg-green-900/30 border border-green-500/30 opacity-75 cursor-not-allowed' 
              : 'bg-slate-900/50 border border-cyan-500/30'
          }`}
        />
      )}
    </div>
  );
};

// 专门渲染 Settings 字段，区分必需和普通字段
const renderSettingsFields = (
  settings: any,
  parentPath: string,
  onChange: (newSettings: any) => void
) => {
  const REQUIRED_SETTINGS = [
    'RestApiEnabled',
    'RestApiPort',
    'EnableTokenEndpointAuthentication',
    'LogRest',
    'RESTMaximumRequestsPerInterval',
    'RESTRequestBucketDecreaseIntervalMinutes',
    'ApplicationRestTokens'
  ];

  const allKeys = Object.keys(settings);
  console.log('ConfigForm renderSettingsFields - all Settings keys:', allKeys);
  
  const requiredKeys = allKeys.filter(key => REQUIRED_SETTINGS.includes(key));
  const otherKeys = allKeys.filter(key => !REQUIRED_SETTINGS.includes(key));
  console.log('ConfigForm renderSettingsFields - requiredKeys:', requiredKeys);
  console.log('ConfigForm renderSettingsFields - otherKeys:', otherKeys);

  return (
    <>
      {requiredKeys.length > 0 && (
        <div className="mb-4">
          <h6 className="text-green-400 text-xs font-medium mb-2 flex items-center gap-1">
            <span className="text-xs">⭐</span>
            必需配置 (不可编辑)
          </h6>
          <div className="bg-green-900/10 border border-green-500/20 rounded-lg p-3">
            {requiredKeys.map(key =>
              renderField(key, settings[key], parentPath, (newValue) => {
                onChange({
                  ...settings,
                  [key]: newValue
                });
              }, true)
            )}
          </div>
        </div>
      )}
      {otherKeys.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <h6 className="text-slate-300 text-xs font-medium mb-2 flex items-center gap-1">
            <span className="text-xs">⚙️</span>
            其他配置 (可编辑)
          </h6>
          <div>
            {otherKeys.map(key =>
              renderField(key, settings[key], parentPath, (newValue) => {
                onChange({
                  ...settings,
                  [key]: newValue
                });
              })
            )}
          </div>
        </div>
      )}
    </>
  );
};

export const ConfigForm = ({
  config,
  onChange
}: ConfigFormProps) => {
  const [localConfig, setLocalConfig] = useState(config);

  // 同步 config props 到 localConfig
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleChange = useCallback((newConfig: TShockConfig) => {
    setLocalConfig(newConfig);
    onChange(newConfig);
  }, [onChange]);

  // 渲染所有顶级字段
  const renderConfigFields = (obj: TShockConfig) => {
    const keys = Object.keys(obj).sort();
    
    console.log('ConfigForm renderConfigFields - config keys:', keys);
    console.log('ConfigForm renderConfigFields - config:', obj);

    return keys.map((key) => {
      // 特殊处理 Settings 节点
      if (key === 'Settings' && typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        console.log('ConfigForm - Rendering Settings node');
        return (
          <div key={key} className="mb-4">
            <h5 className="text-cyan-300 text-sm font-medium mb-2 flex items-center gap-1">
              <span className="text-xs">📁</span>
              {formatKey(key)}
            </h5>
            <div className="pl-4 border-l border-slate-700/50">
              {renderSettingsFields(obj[key], key, (newSettings) => {
                // 更新整个配置对象，只修改 Settings 部分
                handleChange({
                  ...obj,
                  Settings: newSettings
                });
              })}
            </div>
          </div>
        );
      }

      // 跳过所有其他根级字段（Token, EnableTokenLoginAuthentication, RestApiEnabled 等）
      // 这些根级字段都是错误的，不应该显示
      console.log('ConfigForm - Skipping root-level key:', key);
      return null;
    });
  };

  return (
    <div className="space-y-1">
      {renderConfigFields(localConfig)}
    </div>
  );
};
