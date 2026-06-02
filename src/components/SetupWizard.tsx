import { useState, useCallback, useEffect, useRef } from 'react';
import { electronBridge, isElectronAvailable } from '../services/electronBridge';
import { useConfig } from '../hooks/useConfig';
import { usePlatform } from '../hooks/usePlatform';
import { WizardConfigEditorModal } from './WizardConfigEditorModal';

interface SetupWizardProps {
  onComplete: () => void;
}

export const SetupWizard = ({ onComplete }: SetupWizardProps) => {
  const [step, setStep] = useState(1);
  const [tshockDir, setTshockDir] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const { updateTshockConfig } = useConfig();
  const { selectFile } = usePlatform();
  const [builtinInfo, setBuiltinInfo] = useState<any>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [showConfigEditor, setShowConfigEditor] = useState(false);

  // 在组件加载时清理旧配置
  useEffect(() => {
    if (isElectronAvailable) {
      electronBridge.app.clearConfig().then(result => {
        console.log('SetupWizard - 旧配置清理结果:', result);
      });
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [logs, scrollToBottom]);

  const addLog = useCallback((message: string) => {
    const timestampedMessage = `[${new Date().toLocaleTimeString()}] ${message}`;
    setLogs(prev => [...prev, timestampedMessage]);
  }, []);

  useEffect(() => {
    if (isElectronAvailable) {
      electronBridge.terminal.sync();
      electronBridge.app.getBuiltinTShockInfo().then(info => {
        setBuiltinInfo(info);
      });
    }
  }, []);

  const handleUseBuiltinTShock = async () => {
    if (!isElectronAvailable) return;

    setLoading(true);
    addLog('正在解压内置 TShock 版本...');

    try {
      const result = await electronBridge.app.extractBuiltinTShock();
      
      if (result.success) {
        addLog('✓ 解压完成');
        setTshockDir(result.path);
        
        // 现在 extractBuiltinTShock 已经自动设置好所有路径了
        addLog(`✓ 设置工作目录: ${result.path}`);
        
        // 获取配置路径用于验证
        const configPath = await electronBridge.config.getPath();
        const installerPath = `${result.path}\\TShock.Installer.exe`;
        const pathResult = await electronBridge.config.validatePath(installerPath);
        
        if (pathResult.valid) {
          addLog('✓ 找到 TShock.Installer.exe');
          
          const configValidation = await electronBridge.config.validatePath(configPath);
          
          if (configValidation.valid) {
            addLog('✓ 找到现有 config.json');
            addLog('跳过生成配置，直接配置 REST API...');
            setStep(3);
            await handleConfigureRest();
          } else {
            addLog('未找到现有 config.json，将先生成配置...');
            setStep(2);
          }
        } else {
          setError('解压后未找到 TShock.Installer.exe');
        }
      } else {
        setError(result.error || '解压失败');
        addLog('✗ 解压失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '解压 TShock 失败');
      addLog(`✗ 解压失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isElectronAvailable) return;

    const unsubscribe = electronBridge.terminal.onOutput((data) => {
      addLog(data.data);
    });

    return unsubscribe;
  }, [addLog]);

  const handleSelectDirectory = async () => {
    if (!isElectronAvailable) return;

    try {
      setError('');
      addLog('正在打开目录选择对话框...');
      const result = await selectFile({
        properties: ['openDirectory'],
        title: '选择 TShock 安装目录'
      });

      if (result && !result.canceled && result.filePaths.length > 0) {
        const selectedPath = result.filePaths[0];
        setTshockDir(selectedPath);
        addLog(`已选择目录: ${selectedPath}`);
        
        try {
          // 使用新的 setWorkingDir 方法来设置所有路径
          const setResult = await electronBridge.config.setWorkingDir(selectedPath);
          
          if (!setResult.success) {
            throw new Error(setResult.error);
          }
          
          addLog(`✓ 设置工作目录: ${selectedPath}`);
          
          const installerPath = `${selectedPath}\\TShock.Installer.exe`;
          const pathResult = await electronBridge.config.validatePath(installerPath);
          
          if (!pathResult.valid) {
            setError('未在所选目录中找到 TShock.Installer.exe');
            addLog('✗ 未找到 TShock.Installer.exe');
            return;
          }

          addLog('✓ 找到 TShock.Installer.exe');
          
          const configValidation = await electronBridge.config.validatePath(setResult.configPath);
          
          if (configValidation.valid) {
            addLog('✓ 找到现有 config.json');
            addLog('跳过生成配置，直接配置 REST API...');
            setStep(3);
            await handleConfigureRest();
          } else {
            addLog('未找到现有 config.json，将先生成配置...');
            setStep(2);
          }
        } catch (err) {
          setError('验证目录失败');
          addLog(`✗ 验证失败: ${err instanceof Error ? err.message : '未知错误'}`);
        }
      } else {
        setError('未选择目录');
        addLog('✗ 用户取消了选择');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '选择目录失败');
      addLog(`✗ 选择目录失败: ${err instanceof Error ? err.message : '未知错误'}`);
    }
  };

  const handleRunInstaller = async () => {
    if (!isElectronAvailable || !tshockDir) return;

    setLoading(true);
    addLog('正在运行 TShock.Installer.exe 生成配置...');

    try {
      const result = await electronBridge.terminal.setup(tshockDir);

      if (result.success) {
        addLog('✓ 配置生成完成');
        setStep(3);
        addLog('准备打开配置编辑器...');
        // 设置所有路径，然后打开编辑器
        await electronBridge.config.setWorkingDir(tshockDir);
        setShowConfigEditor(true);
      } else {
        setError(result.error || 'Installer 执行失败');
        addLog('✗ Installer 执行失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '运行 Installer 失败');
      addLog(`✗ 运行失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigConfirm = async (config: any) => {
    setLoading(true);
    addLog('正在保存配置...');

    try {
      const writeResult = await electronBridge.config.write(config);
      
      if (writeResult.success) {
        addLog('✓ 配置保存完成');
        await electronBridge.app.setStore('tshock.workingDir', tshockDir);
        updateTshockConfig({
          serverUrl: 'http://localhost:7878',
          token: '',
          username: '',
          password: ''
        });
        addLog('✓ 基础配置已保存');
        setShowConfigEditor(false);
        setStep(4);
        await handleStartTshock();
      } else {
        setError('保存配置失败');
        addLog('✗ 保存配置失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存配置失败');
      addLog(`✗ 保存失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigureRest = async () => {
    setLoading(true);
    addLog('准备打开配置编辑器...');

    try {
      await electronBridge.config.setWorkingDir(tshockDir);
      setShowConfigEditor(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '打开配置编辑器失败');
      addLog(`✗ 打开失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTshock = async () => {
    if (!isElectronAvailable) return;

    setLoading(true);
    addLog('正在启动 TShock 服务器...');

    try {
      const unsubscribeStatus = electronBridge.terminal.onStatusChange((status) => {
        if (status.status === 'running') {
          addLog('✓ TShock 服务器已启动');
        }
      });

      const result = await electronBridge.terminal.start();

      if (result.success) {
        addLog('等待服务器初始化...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        unsubscribeStatus();

        setStep(5);
        
        addLog('');
        addLog('========================================');
        addLog('✓ 设置完成！即将跳转到命令助手...');
        addLog('请在命令助手中登录服务器获取 Token');
        addLog('========================================');
        setTimeout(onComplete, 1500);
      } else {
        setError(result.error || '启动 TShock 失败');
        addLog('✗ 启动 TShock 失败');
        unsubscribeStatus();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '启动 TShock 失败');
      addLog(`✗ 启动失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10">
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            TShock 快速设置向导
          </h2>
          <p className="text-slate-400 mt-2">按照以下步骤快速配置 TShock 服务器</p>
        </div>

        <div className="px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            {['选择目录', '生成配置', '配置 REST', '启动服务器', '完成'].map((label, index) => {
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
                  {index < 4 && (
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
          <div
            ref={logContainerRef}
            className="bg-slate-950/50 border border-slate-700/50 rounded-lg p-4 mb-4 h-64 overflow-y-auto font-mono text-sm"
          >
            {logs.length === 0 ? (
              <div className="text-slate-500">等待开始...</div>
            ) : (
              logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`
                    mb-1
                    ${log.includes('✓') ? 'text-green-400' : ''}
                    ${log.includes('✗') ? 'text-red-400' : ''}
                    ${log.includes('⚠') ? 'text-yellow-400' : ''}
                    ${log.includes('========') ? 'text-cyan-400 font-bold' : ''}
                    ${!log.includes('✓') && !log.includes('✗') && !log.includes('⚠') && !log.includes('====') ? 'text-slate-300' : ''}
                  `}
                >
                  {log}
                </div>
              ))
            )}
          </div>

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
                  onClick={handleUseBuiltinTShock}
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
              <button
                onClick={handleRunInstaller}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/25"
              >
                {loading ? '运行中...' : '运行 TShock.Installer.exe 生成配置'}
              </button>
            )}

            {step === 3 && (
              <div className="text-cyan-400 text-sm">
                请在弹出的配置编辑器中确认配置
              </div>
            )}

            {step === 4 && (
              <div className="text-cyan-400 text-sm">
                正在启动服务器...
              </div>
            )}

            {step === 5 && !error && (
              <div className="text-green-400 text-sm font-medium animate-pulse">
                ✓ 配置完成！
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
