import { useState, useCallback, useEffect } from 'react';
import { electronBridge, isElectronAvailable } from '../services/electronBridge';
import { useConfig } from '../hooks/useConfig';
import { usePlatform } from '../hooks/usePlatform';
import { WizardConfigEditorModal } from './WizardConfigEditorModal';
import { TerminalUI } from './TerminalUI';

interface SetupWizardProps {
  onComplete: () => void;
}

export const SetupWizard = ({ onComplete }: SetupWizardProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateTshockConfig } = useConfig();
  const { selectFile } = usePlatform();
  const [builtinInfo, setBuiltinInfo] = useState<any>(null);
  const [showConfigEditor, setShowConfigEditor] = useState(false);
  const [detectedOptions, setDetectedOptions] = useState<string[]>([]);
  const [pendingInput, setPendingInput] = useState<{prompt: string, type: 'text' | 'password'} | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [skipMode, setSkipMode] = useState(false);
  const [worldSize, setWorldSize] = useState<number | null>(null);
  const [serverReady, setServerReady] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [setupComplete, setSetupComplete] = useState(false);
  const [configExists, setConfigExists] = useState(false);
  const [terminalStatus, setTerminalStatus] = useState<string>('stopped');
  const [commandInput, setCommandInput] = useState('');
  const [savedPath, setSavedPath] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<'builtin' | 'saved' | 'new' | null>(null);
  const [worldPath, setWorldPath] = useState<string | null>(null);

  // 默认值配置
  const DEFAULT_VALUES = {
    port: '7777',
    maxPlayers: '8',
    worldName: '',
    password: '',
    autoAccept: 'y'
  };

  // 在组件加载时获取内置 TShock 信息，并且在第一步就启动终端
  useEffect(() => {
    if (isElectronAvailable()) {
      electronBridge.app.getBuiltinTShockInfo().then(info => {
        setBuiltinInfo(info);
      }).catch(err => {
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

  // 检测选项
  const detectOptions = (text: string): string[] => {
    const options: string[] = [];
    
    // 检测 [Y/N] 格式
    const yesNoMatch = text.match(/\[([YNyn])\]/g);
    if (yesNoMatch) {
      yesNoMatch.forEach(match => {
        const letter = match[1].toUpperCase();
        if (!options.includes(letter)) {
          options.push(letter);
        }
      });
    }
    
    // 检测 [数字] 格式
    const numberMatch = text.match(/\[(\d+)\]/g);
    if (numberMatch) {
      numberMatch.forEach(match => {
        const num = match.slice(1, -1);
        if (!options.includes(num)) {
          options.push(num);
        }
      });
    }
    
    // 检测不带方括号的纯数字选项（世界列表）
    const pureNumberMatch = text.match(/^\s*(\d+)\s+/gm);
    if (pureNumberMatch) {
      pureNumberMatch.forEach(match => {
        const num = match.trim();
        if (!options.includes(num)) {
          options.push(num);
        }
      });
    }
    
    // 检测特殊选项 n（新建世界）和 d（删除世界）
    if (text.includes('n\t\t新建世界') && !options.includes('n')) {
      options.push('n');
    }
    if (text.includes('d <number>') && !options.includes('d')) {
      options.push('d');
    }
    
    return options;
  };

  // 检测文本输入
  const detectTextInput = (text: string): {prompt: string, type: 'text' | 'password'} | null => {
    const lowerText = text.toLowerCase();
    
    if (/password|密码/.test(lowerText)) {
      return { prompt: '请输入密码:', type: 'password' };
    }
    
    if (/port|端口/.test(lowerText)) {
      return { prompt: '请输入端口:', type: 'text' };
    }
    
    if (/name|名称/.test(lowerText)) {
      return { prompt: '请输入名称:', type: 'text' };
    }
    
    if (/players|玩家/.test(lowerText)) {
      return { prompt: '请输入最大玩家数:', type: 'text' };
    }
    
    return null;
  };

  // 处理选项点击
  const handleOptionClick = async (option: string) => {
    if (!isElectronAvailable()) return;
    await electronBridge.terminal.send(option);
    setDetectedOptions([]);
  };

  // 处理文本输入提交
  const handleSubmitInput = async () => {
    if (!isElectronAvailable() || !inputValue) return;
    await electronBridge.terminal.send(inputValue);
    setInputValue('');
    setPendingInput(null);
  };

  // 监听终端状态变化
  useEffect(() => {
    if (!isElectronAvailable) return;

    const unsubscribeStatus = electronBridge.terminal.onStatusChange((data) => {
      setTerminalStatus(data.status);
    });

    const unsubscribeOutput = electronBridge.terminal.onOutput((data) => {
      // 检测服务器就绪
      if (data.data.includes('Listening on') || 
          data.data.includes('Server started, waiting for connections')) {
        setServerReady(true);
      }
      
      // 检测解压完成
      if (data.data.includes('✓ 解压完成') || data.data.includes('Extraction complete')) {
        setLoading(false);
        // 解压完成后自动检测配置并执行 Installer
        handleAutoRunInstaller();
      }
      
      // 检测解压失败
      if (data.data.includes('ERROR:') || data.data.includes('解压失败')) {
        setLoading(false);
      }
    });

    // 初始获取状态
    electronBridge.terminal.getStatus().then((statusData) => {
      setTerminalStatus(statusData.status);
    });

    return () => {
      unsubscribeStatus();
      unsubscribeOutput();
    };
  }, []);

  // 处理命令发送
  const handleSendCommand = async () => {
    if (!isElectronAvailable()) return;
    await electronBridge.terminal.send(commandInput);
    setCommandInput('');
  };

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
        
        const result = await electronBridge.terminal.setup();
        if (result.success) {
          setConfigExists(true);
        } else {
          setError(result.error || 'Installer 执行失败');
        }
        
        setLoading(false);
      } else {
        console.log('[SetupWizard] 配置已存在');
        setConfigExists(true);
      }
      
      // 先发送两次 Ctrl+C 终止指令
      await electronBridge.terminal.send('\x03');
      await new Promise(resolve => setTimeout(resolve, 500)); // 等一会儿
      await electronBridge.terminal.send('\x03');
      await new Promise(resolve => setTimeout(resolve, 500)); // 再等一会儿
      
      // 配置已就绪，打开配置编辑器
      setShowConfigEditor(true);
    } catch (err) {
      console.error('[SetupWizard] handleAutoRunInstaller error:', err);
      // 即使检测失败，也尝试打开配置编辑器
      setShowConfigEditor(true);
    }
  };

  const handleUseBuiltinTshock = async () => {
    if (!isElectronAvailable()) return;

    setLoading(true);
    try {
      // 获取路径
      const paths = await electronBridge.config.getExtractPaths();
      
      console.log('[SetupWizard] 获取到的路径:', paths);
      
      // 构建命令（单个单词带参数）
      const command = `unzip "${paths.zipPath}" "${paths.targetDir}"`;
      
      console.log('[SetupWizard] 发送的命令:', command);
      
      // 发送到终端
      await electronBridge.terminal.send(command);
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
      
      // 选择目录后自动检测配置并执行 Installer
      await handleAutoRunInstaller();
    } catch (err) {
      setError(err instanceof Error ? err.message : '选择目录失败');
    }
  };

  const handleRunInstaller = async () => {
    if (!isElectronAvailable()) return;

    setLoading(true);

    try {
      const result = await electronBridge.terminal.setup();

      if (result.success) {
        setStep(3);
        setShowConfigEditor(true);
      } else {
        setError(result.error || 'Installer 执行失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '运行 Installer 失败');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigConfirm = async (config: any) => {
    setLoading(true);

    try {
      const writeResult = await electronBridge.config.write('config.json', config);
      
      if (writeResult.success) {
        updateTshockConfig({
          serverUrl: 'http://localhost:7878',
          token: '',
          username: '',
          password: ''
        });
        setShowConfigEditor(false);
        
        // 先发送 Ctrl+C 终止当前进程
        await electronBridge.terminal.send('\x03');
        // 等待一下让进程停止
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 然后执行 Installer（带配置运行）
        const startResult = await electronBridge.terminal.setup();
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

  const handleConfigureRest = async () => {
    setLoading(true);

    try {
      setShowConfigEditor(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '打开配置编辑器失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!isElectronAvailable() || !adminUsername || !adminPassword) return;

    try {
      const command = `/auth ${adminUsername} ${adminPassword}`;
      await electronBridge.terminal.send(command);
    } catch (err) {
      // 静默失败
    }
  };

  const handleSetupComplete = async () => {
    setSetupComplete(true);
    
    if (adminUsername && adminPassword) {
      await handleCreateAdmin();
    }
    
    setTimeout(onComplete, 2000);
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
                <h3 className="text-white font-medium mb-3">选择 TShock 安装方式</h3>
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
                        <p className="text-slate-400 text-xs mt-1">使用应用内置的 TShock 版本</p>
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
                      const result = await selectFile({
                        properties: ['openDirectory'],
                        title: '选择 TShock 安装目录'
                      });
                      if (result && !result.canceled && result.filePaths.length > 0) {
                        const selectedPath = result.filePaths[0];
                        localStorage.setItem('tshock_last_path', selectedPath);
                        setSavedPath(selectedPath);
                        setSelectedOption('saved');
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
                        选择新路径
                      </div>
                      <p className="text-slate-400 text-xs mt-1">选择一个新的 TShock 安装目录</p>
                    </div>
                  </button>
                </div>

                {/* 世界文件选择 */}
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <h3 className="text-white font-medium mb-3">世界文件（可选）</h3>
                  <div className="space-y-2">
                    <button
                      onClick={async () => {
                        const result = await selectFile({
                          properties: ['openFile'],
                          title: '选择世界文件',
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
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={loading || !selectedOption}
                  className="mx-auto mt-4 px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                >
                  {loading ? '处理中...' : '确认'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Terminal Display */}
              <div className="flex-1 min-h-[200px] mb-4 overflow-hidden">
                <TerminalUI visible={true} />
              </div>

              {/* IDLE 状态下的输入框 */}
              {terminalStatus === 'idle' && (
                <div className="mb-4 flex gap-2 items-center flex-shrink-0">
                  <span className="text-slate-400 text-sm">命令:</span>
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendCommand()}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                    placeholder="输入命令..."
                    autoFocus
                  />
                  <button
                    onClick={handleSendCommand}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-sm transition-all"
                  >
                    发送
                  </button>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4 flex-shrink-0">
                  <div className="flex items-center gap-2 text-red-400">
                    <span className="text-xl">⚠</span>
                    <span className="font-medium">{error}</span>
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

                {/* 管理员账号创建（步骤4之前） */}
                {step === 3 && !showConfigEditor && (
                  <div className="mb-4 space-y-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-cyan-400 text-sm font-medium">可选：创建管理员账号</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 text-xs mb-1">管理员用户名</label>
                        <input
                          type="text"
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                          placeholder="输入用户名"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs mb-1">管理员密码</label>
                        <input
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="输入密码"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                        />
                      </div>
                    </div>
                    <div className="text-slate-500 text-xs">
                      服务器启动后将自动创建管理员账号
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-3">
                    <div className="text-cyan-400 text-sm font-medium">
                      ✓ 终端已启动，请在下方终端中直接输入命令启动
                    </div>
                    
                    <button
                      onClick={handleSetupComplete}
                      disabled={setupComplete}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-medium rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-green-500/25"
                    >
                      {setupComplete ? '完成中...' : '✓ 完成设置'}
                    </button>
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
