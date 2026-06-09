import { useState, useEffect, useMemo, useRef } from 'react';
import { electronBridge, isElectronAvailable } from '../services/electronBridge';
import { TShockApi } from '../services/tshockApi';
import { useConfig } from '../hooks/useConfig';
import { usePlatform } from '../hooks/usePlatform';
import { WizardConfigEditorModal } from './WizardConfigEditorModal';
import { TerminalPanel } from './TerminalPanel';
import { ElectronTerminalStream } from '../hooks/useTerminalStream';
import { DEFAULT_SERVER_URL, mergeWithDefaultRestApiSettings } from '../config/tshock-config';

interface SetupWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const SetupWizard = ({ onComplete, onSkip }: SetupWizardProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { config, updateTshockConfig } = useConfig();
  const { selectFile } = usePlatform();
  const electronStream = useMemo(() => new ElectronTerminalStream(), []);
  const [builtinInfo, setBuiltinInfo] = useState<any>(null);
  const [showConfigEditor, setShowConfigEditor] = useState(false);
  const [adminUsername, setAdminUsername] = useState(config.tshock.username || '');
  const [adminPassword, setAdminPassword] = useState(config.tshock.password || '');

  const [setupComplete, setSetupComplete] = useState(false);
  const [savedPath, setSavedPath] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<'builtin' | 'saved' | 'new' | null>(null);
  const [worldPath, setWorldPath] = useState<string | null>(null);
  const [reinstall, setReinstall] = useState(true);
  const [skipConfig, setSkipConfig] = useState(() => localStorage.getItem('tshock_skip_config') === 'true');

  const handleSkip = () => {
    onSkip();
  };
  const prevOptionRef = useRef<string | null>(null);

  // 输入时立即保存用户名和密码
  const handleUsernameChange = (value: string) => {
    setAdminUsername(value);
    updateTshockConfig({ username: value });
  };

  const handlePasswordChange = (value: string) => {
    setAdminPassword(value);
    updateTshockConfig({ password: value });
  };

  // 在组件加载时获取内置 TShock 信息，并且在第一步就启动终端
  useEffect(() => {
    if (isElectronAvailable()) {
      electronBridge.app.getBuiltinTShockInfo().then(info => {
        setBuiltinInfo(info);
      }).catch(() => {
        setBuiltinInfo({ exists: false });
      });

      // 在第一步就启动终端
      electronBridge.terminal.start().catch(err => {
        console.error('SetupWizard - 启动终端失败:', err);
      });

      // 读取保存的路径
      const saved = localStorage.getItem('tshock_last_path');
      if (saved) {
        setSavedPath(saved);
      }

      // 读取保存的世界文件路径
      const savedWorld = localStorage.getItem('tshock_last_world');
      if (savedWorld) {
        setWorldPath(savedWorld);
      }
    }
  }, []);

  // 根据 savedPath 和 builtinInfo 自动设置默认选项
  useEffect(() => {
    if (savedPath) {
      setSelectedOption('saved');
    } else if (builtinInfo?.exists) {
      setSelectedOption('builtin');
    }
  }, [savedPath, builtinInfo]);

  // 当切换选项时重置跳过配置为关闭（只在真正切换选项时）
  useEffect(() => {
    if (selectedOption && prevOptionRef.current && selectedOption !== prevOptionRef.current) {
      setSkipConfig(false);
      localStorage.setItem('tshock_skip_config', 'false');
    }
    prevOptionRef.current = selectedOption;
  }, [selectedOption]);

  // 监听终端输出
  useEffect(() => {
    if (!isElectronAvailable) return;

    const unsubscribeOutput = electronBridge.terminal.onOutput((data) => {
      // 检测解压完成
      if (data.data.includes('✓ 解压完成') || data.data.includes('Extraction complete')) {
        setLoading(false);
        // 解压完成后自动检测配置并执行 Installer
        handleAutoRunInstaller();
      }
      
      // 检测解压失败
      if (data.data.includes('ERROR:') || data.data.includes('解压失败')) {
        setLoading(false);
        setError('解压失败，请重新开始');
      }
      
      // 检测 dotnet runtime 解压失败
      if (data.data.includes('Failed to extract')) {
        setLoading(false);
        setError('运行时解压失败：' + data.data.trim());
      }
      
      // 检测下载失败
      if (data.data.includes('Failed to download')) {
        setLoading(false);
        setError('下载失败，请检查网络连接后重新开始');
      }
    });

    return () => {
      unsubscribeOutput();
    };
  }, [savedPath, builtinInfo]);

  const handleAutoRunInstaller = async () => {
    if (!isElectronAvailable()) return;

    try {
      // 尝试读取配置来判断是否存在
      const configPath = await electronBridge.config.getPath();
      console.log('[SetupWizard] 检查配置路径:', configPath);
      
      const readResult = await electronBridge.config.read('config.json');
      const hasConfig = !(readResult && readResult.success === false);
      
      // 如果不存在配置，先执行 Installer 生成配置
      if (!hasConfig) {
        console.log('[SetupWizard] 配置不存在，执行 Installer 生成配置');
        setLoading(true);
        
        const result = await electronBridge.terminal.startTShock();
        if (result.success) {
          // 配置已生成
        } else {
          setError(result.error || 'Installer 执行失败');
        }
        
        setLoading(false);
      } else {
        console.log('[SetupWizard] 配置已存在');
      }
      
      // 先发送两次 Ctrl+C 终止指令
      await electronBridge.terminal.send('\x03');
      await new Promise(resolve => setTimeout(resolve, 500)); // 等一会儿
      await electronBridge.terminal.send('\x03');
      await new Promise(resolve => setTimeout(resolve, 500)); // 再等一会儿
      
      // 配置已就绪
      if (skipConfig) {
        const config = await electronBridge.config.read('config.json');
        // 确保 REST API 配置被设置为默认值
        const mergedConfig = mergeWithDefaultRestApiSettings(config);
        await handleConfigConfirm(mergedConfig);
      } else {
        setShowConfigEditor(true);
      }
    } catch (err) {
      console.error('[SetupWizard] handleAutoRunInstaller error:', err);
      setError(err instanceof Error ? err.message : '配置生成失败');
      setLoading(false);
    }
  };

  const handleUseBuiltinTshock = async () => {
    if (!isElectronAvailable()) return;

    setLoading(true);
    try {
      // 获取路径
      const paths = await electronBridge.config.getExtractPaths();
      
      console.log('[SetupWizard] 获取到的路径:', paths);

      // 保存路径到 savedPath
      localStorage.setItem('tshock_last_path', paths.targetDir);
      setSavedPath(paths.targetDir);

      if (reinstall) {
        // 重新安装：正常解压（删除旧文件再解压）
        const command = `unzip "${paths.zipPath}" "${paths.targetDir}"`;
        console.log('[SetupWizard] 发送的命令:', command);
        await electronBridge.terminal.send(command);
      } else {
        // 不重新安装：跳过解压，直接走和"使用上次路径"一样的逻辑
        await handleAutoRunInstaller();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '解压 TShock 失败');
      setLoading(false);
    }
  };

  const handleSelectDirectory = async (path?: string) => {
    if (!isElectronAvailable()) return;

    try {
      setError('');
      
      let selectedPath;
      if (path) {
        selectedPath = path;
      } else {
        const result = await selectFile({
          properties: ['openDirectory'],
          title: '选择 TShock 安装目录'
        });

        if (result && !result.canceled && result.filePaths.length > 0) {
          selectedPath = result.filePaths[0];
        } else {
          setError('未选择目录');
          return;
        }
      }

      // 保存路径
      localStorage.setItem('tshock_last_path', selectedPath);
      setSavedPath(selectedPath);
      setSkipConfig(false);
      localStorage.setItem('tshock_skip_config', 'false');
      
      // 选择目录后自动检测配置并执行 Installer
      await handleAutoRunInstaller();
    } catch (err) {
      setError(err instanceof Error ? err.message : '选择目录失败');
    }
  };

  const handleConfigConfirm = async (config: any) => {
    setLoading(true);

    try {
      const writeResult = await electronBridge.config.write('config.json', config);
      
      if (writeResult.success) {
        updateTshockConfig({
          serverUrl: DEFAULT_SERVER_URL,
          token: ''
          // 不清空 username 和 password，保持它们
        });
        setShowConfigEditor(false);
        
        // 确认配置后，下次跳过配置确认
        setSkipConfig(true);
        localStorage.setItem('tshock_skip_config', 'true');
        
        // 先发送 Ctrl+C 终止当前进程
        await electronBridge.terminal.send('\x03');
        // 等待一下让进程停止
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 启动 TShock 服务器（带世界文件参数）
        const startResult = await electronBridge.terminal.startTShock(worldPath || undefined);
        if (startResult.success) {
          setStep(4);
        } else {
          setError(startResult.error || '启动服务器失败');
        }
      } else {
        setError('保存配置失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存配置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = async () => {
    if (!adminUsername || !adminPassword) {
      setError('请输入服主账号和密码');
      return;
    }

    setSetupComplete(true);
    setLoading(true);

    try {
      // 1. 添加用户
      await electronBridge.terminal.send(`/user add ${adminUsername} ${adminPassword} owner`);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 2. 给 owner 组添加 REST 权限
      await electronBridge.terminal.send(`/group addperm owner tshock.rest.*`);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. 通过 REST API 获取 token
      const api = new TShockApi();
      const token = await api.getToken(adminUsername, adminPassword);

      // 4. 只保存 url 和 token（用户名和密码已经在输入时保存了）
      updateTshockConfig({
        serverUrl: DEFAULT_SERVER_URL,
        token: token,
        useBuiltinServer: true
      });

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加服主账号失败');
      setSetupComplete(false);
    } finally {
      setLoading(false);
    }
  };

  // 处理确认按钮点击
  const handleConfirm = async () => {
    if (!selectedOption) return;

    // 立即进入步骤2，显示终端
    setStep(2);

    if (selectedOption === 'builtin') {
      await handleUseBuiltinTshock();
    } else if (selectedOption === 'saved') {
      await handleSelectDirectory(savedPath!);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-4 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-700/50 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            TShock 快速设置向导
          </h2>
          <p className="text-slate-400 mt-2">按照以下步骤快速配置 TShock 服务器</p>
        </div>

        <div className="px-6 py-4 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            {['选择目录', '生成配置', '配置 REST', '启动服务器'].map((label, index) => {
              const stepNum = index + 1;
              const isActive = step === stepNum;
              const isCompleted = step > stepNum;
              
              return (
                <div key={stepNum} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                    ${isActive ? 'bg-cyan-500 text-white animate-pulse' : ''}
                    ${!isActive && !isCompleted ? 'bg-slate-700 text-slate-400' : ''}
                  `}>
                    {isCompleted ? '✓' : stepNum}
                  </div>
                  <span className={`
                    ml-2 text-sm hidden sm:block
                    ${isActive ? 'text-cyan-400 font-medium' : ''}
                    ${isCompleted ? 'text-green-400' : ''}
                    ${!isActive && !isCompleted ? 'text-slate-500' : ''}
                  `}>
                    {label}
                  </span>
                  {index < 3 && (
                    <div className={`
                      w-8 sm:w-16 h-0.5 mx-2
                      ${isCompleted ? 'bg-green-500' : 'bg-slate-700'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1 min-h-0 overflow-hidden">
          {step === 1 && !showConfigEditor ? (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">选择 TShock 安装方式</h3>
                  <a
                    href="https://github.com/Pryaxis/TShock/releases/latest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white text-xs font-medium rounded-lg transition-all shadow-lg shadow-blue-500/20"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    下载最新版本
                  </a>
                </div>
                <div className="space-y-2 flex-1">
                  {builtinInfo?.exists && (
                    <label 
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                        selectedOption === 'builtin' 
                          ? 'border-cyan-500 bg-cyan-500/10' 
                          : 'border-transparent hover:border-slate-600 hover:bg-slate-700/30'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === 'builtin' 
                          ? 'border-cyan-500' 
                          : 'border-slate-500'
                      }`}>
                        {selectedOption === 'builtin' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                        )}
                      </div>
                      <input 
                        type="radio" 
                        name="tshockOption" 
                        value="builtin" 
                        checked={selectedOption === 'builtin'}
                        onChange={() => setSelectedOption('builtin')}
                        className="hidden"
                      />
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                          使用内置版本
                          <span className="text-xs opacity-70">{builtinInfo?.version}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-slate-400 text-xs">使用应用内置的 TShock 版本</p>
                          {selectedOption === 'builtin' && (
                            <label className="flex items-center gap-1.5 ml-auto cursor-pointer select-none">
                              <span className="text-slate-400 text-xs">重新安装</span>
                              <div
                                className={`w-8 h-4 rounded-full transition-colors relative ${reinstall ? 'bg-cyan-500' : 'bg-slate-600'}`}
                                onClick={(e) => { e.stopPropagation(); setReinstall(!reinstall); }}
                              >
                                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${reinstall ? 'translate-x-4' : 'translate-x-0.5'}`} />
                              </div>
                            </label>
                          )}
                        </div>
                      </div>
                    </label>
                  )}
                  
                  {savedPath && (
                    <label 
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                        selectedOption === 'saved' 
                          ? 'border-cyan-500 bg-cyan-500/10' 
                          : 'border-transparent hover:border-slate-600 hover:bg-slate-700/30'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === 'saved' 
                          ? 'border-cyan-500' 
                          : 'border-slate-500'
                      }`}>
                        {selectedOption === 'saved' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                        )}
                      </div>
                      <input 
                        type="radio" 
                        name="tshockOption" 
                        value="saved" 
                        checked={selectedOption === 'saved'}
                        onChange={() => setSelectedOption('saved')}
                        className="hidden"
                      />
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          使用上次路径
                        </div>
                        <p className="text-slate-400 text-xs mt-1 truncate">{savedPath}</p>
                      </div>
                    </label>
                  )}

                  <button
                    onClick={async () => {
                      const rootPath = await electronBridge.app.getAppRootPath();
                      const result = await selectFile({
                        properties: ['openDirectory'],
                        title: '选择已有的 TShock 版本目录',
                        defaultPath: rootPath || undefined
                      });
                      if (result && !result.canceled && result.filePaths.length > 0) {
                        const selectedPath = result.filePaths[0];
                        localStorage.setItem('tshock_last_path', selectedPath);
                        setSavedPath(selectedPath);
                        setSelectedOption('saved');
                        setSkipConfig(false);
                        localStorage.setItem('tshock_skip_config', 'false');
                      }
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 border-transparent hover:border-slate-600 hover:bg-slate-700/30 w-full text-left"
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-slate-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                        </svg>
                        选择已有的版本
                      </div>
                      <p className="text-slate-400 text-xs mt-1">选择一个已有的 TShock 安装目录</p>
                    </div>
                  </button>
                </div>

                {/* 世界文件选择 */}
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <h3 className="text-white font-medium mb-3">世界文件（可选）</h3>
                  <div className="space-y-2">
                    <div
                      onClick={async () => {
                        const worldsDir = await electronBridge.app.getTerrariaWorldsPath();
                        const result = await selectFile({
                          properties: ['openFile'],
                          title: '选择世界文件',
                          defaultPath: worldsDir || undefined,
                          filters: [{ name: '世界文件', extensions: ['wld'] }]
                        });
                        if (result && !result.canceled && result.filePaths.length > 0) {
                          const selected = result.filePaths[0];
                          setWorldPath(selected);
                          localStorage.setItem('tshock_last_world', selected);
                        }
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 border-transparent hover:border-slate-600 hover:bg-slate-700/30 w-full text-left"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-slate-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          选择世界文件
                        </div>
                        {worldPath ? (
                          <p className="text-cyan-400 text-xs mt-1 truncate">{worldPath}</p>
                        ) : (
                          <p className="text-slate-400 text-xs mt-1">未选择，将使用默认世界</p>
                        )}
                      </div>
                      {worldPath && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setWorldPath(null);
                            localStorage.removeItem('tshock_last_world');
                          }}
                          className="p-1 hover:bg-slate-600 rounded transition-all flex-shrink-0"
                          title="清除"
                        >
                          <svg className="w-4 h-4 text-slate-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 跳过配置确认开关 */}
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className={`p-3 rounded-lg border-2 transition-all ${
                    skipConfig 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-slate-700/30 border-slate-600/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${skipConfig ? 'text-green-400' : 'text-white'}`}>
                            跳过配置确认
                          </span>
                          {skipConfig && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                              已启用
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs mt-1">
                          确认过配置后将自动启用
                        </p>
                      </div>
                      <div
                        className={`w-12 h-6 rounded-full transition-all relative cursor-pointer shadow-lg ${
                          skipConfig 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : 'bg-slate-600'
                        }`}
                        onClick={() => {
                          const newVal = !skipConfig;
                          setSkipConfig(newVal);
                          localStorage.setItem('tshock_skip_config', String(newVal));
                        }}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${skipConfig ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 mt-4">
                  <button
                    onClick={handleConfirm}
                    disabled={loading || !selectedOption}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                  >
                    {loading ? '处理中...' : '确认'}
                  </button>
                  <button
                    onClick={handleSkip}
                    className="text-slate-400 hover:text-slate-300 text-sm font-medium underline underline-offset-2 transition-colors"
                  >
                    已有 TShock 服务器？跳过
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Terminal Display */}
              <div className="flex-1 min-h-0 mb-4 overflow-hidden">
                <TerminalPanel stream={electronStream} showInput={true} showActions={true} className="h-full border border-slate-700/50 rounded-lg" />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4 flex-shrink-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-red-400">
                      <span className="text-xl">⚠</span>
                      <span className="font-medium">{error}</span>
                    </div>
                    <button
                      onClick={() => {
                        setError('');
                        setLoading(false);
                        setStep(1);
                      }}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 text-sm rounded-lg transition-all flex-shrink-0"
                    >
                      重新开始
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 flex-shrink-0">
                {step === 2 && (
                  <div className="text-cyan-400 text-sm">
                    请在弹出的配置编辑器中确认配置
                  </div>
                )}

                {step === 3 && (
                  <div className="text-cyan-400 text-sm">
                    服务器启动中...
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                      <div className="text-cyan-400 text-sm font-medium mb-3">添加服主账号</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 text-xs mb-1">用户名</label>
                          <input
                            type="text"
                            value={adminUsername}
                            onChange={(e) => handleUsernameChange(e.target.value)}
                            placeholder="输入用户名"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 text-xs mb-1">密码</label>
                          <input
                            type="password"
                            value={adminPassword}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            placeholder="输入密码"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={handleSetupComplete}
                        disabled={setupComplete || !adminUsername || !adminPassword}
                        className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                      >
                        {setupComplete ? '添加中...' : '添加服主账号并完成设置'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-950/30 rounded-b-2xl">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>桌面模式 - 自动配置</span>
            <span>Powered by TShock Controller</span>
          </div>
        </div>
      </div>

      <WizardConfigEditorModal
        isOpen={showConfigEditor}
        onConfirm={handleConfigConfirm}
      />
    </div>
  );
};
