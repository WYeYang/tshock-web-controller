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
    }
  }, []);

  // 当进入步骤2时自动打开配置编辑器
  useEffect(() => {
    if (step === 2 && !showConfigEditor) {
      setShowConfigEditor(true);
    }
  }, [step]);

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
      
      // 进入配置确认页面
      setStep(2);
    } catch (err) {
      console.error('[SetupWizard] handleAutoRunInstaller error:', err);
      // 即使检测失败，也继续到下一步
      setStep(2);
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

  const handleSelectDirectory = async () => {
    if (!isElectronAvailable()) return;

    try {
      setError('');
      const result = await selectFile({
        properties: ['openDirectory'],
        title: '选择 TShock 安装目录'
      });

      if (result && !result.canceled && result.filePaths.length > 0) {
        // 选择目录后自动检测配置并执行 Installer
        await handleAutoRunInstaller();
      } else {
        setError('未选择目录');
      }
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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-4 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10">
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            TShock 快速设置向导
          </h2>
          <p className="text-slate-400 mt-2">按照以下步骤快速配置 TShock 服务器</p>
        </div>

        <div className="px-6 py-4 border-b border-slate-700/50">
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

        <div className="p-6">
          {/* Terminal Display */}
          <div className="mb-4">
            <TerminalUI visible={true} />
          </div>

          {/* IDLE 状态下的输入框 */}
          {terminalStatus === 'idle' && (
            <div className="mb-4 flex gap-2 items-center">
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
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-red-400">
                <span className="text-xl">⚠</span>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            {step === 1 && (
              <>
                <button
                  onClick={handleUseBuiltinTshock}
                  disabled={loading || !builtinInfo?.exists}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/25 flex flex-col items-center"
                >
                  <span className="text-lg">📦 使用内置版本</span>
                  <span className="text-xs opacity-80">v{builtinInfo?.version}</span>
                </button>
                <button
                  onClick={handleSelectDirectory}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 flex flex-col items-center"
                >
                  <span className="text-lg">📁 自己选择路径</span>
                  <span className="text-xs opacity-80">自定义目录</span>
                </button>
              </>
            )}

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
