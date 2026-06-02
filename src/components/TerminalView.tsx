import { useState, useEffect, useCallback, useRef } from 'react';
import { electronBridge, type TerminalOutput, type TerminalStatus } from '../services/electronBridge';
import { usePlatform } from '../hooks/usePlatform';

type TerminalStatusType = 'stopped' | 'starting' | 'running' | 'stopping' | 'error' | 'setup' | 'idle';

export const TerminalView = () => {
  const { isElectron, selectFile } = usePlatform();
  const [outputs, setOutputs] = useState<TerminalOutput[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<TerminalStatusType>('stopped');
  const [error, setError] = useState<string | null>(null);
  const [tshockPath, setTshockPath] = useState<string>('');
  const [configPath, setConfigPath] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPathError, setHasPathError] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const scrollToBottom = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (!isInitialMount.current) {
      scrollToBottom();
    }
  }, [outputs, scrollToBottom]);

  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  useEffect(() => {
    if (!isElectron) return;

    const loadInitialStatus = async () => {
      try {
        const terminalStatus = await electronBridge.terminal.getStatus();
        setStatus(terminalStatus.status);

        const path = await electronBridge.config.getPath();
        setConfigPath(path);

        const tshockConfig = await electronBridge.app.getStore('tshock');
        if (tshockConfig?.executablePath) {
          setTshockPath(tshockConfig.executablePath);
        }
      } catch (err) {
        console.error('Failed to load initial status:', err);
      }
    };

    loadInitialStatus();

    const unsubscribeOutput = electronBridge.terminal.onOutput((data) => {
      setOutputs(prev => [...prev, data]);
    });

    const unsubscribeStatus = electronBridge.terminal.onStatusChange((data: TerminalStatus) => {
      setStatus(data.status);
      if (data.error) {
        setError(data.error);
      }
    });

    const unsubscribeStartRequest = electronBridge.terminal.onStartRequest(() => {
      handleStart();
    });

    const unsubscribeStopRequest = electronBridge.terminal.onStopRequest(() => {
      handleStop();
    });

    const unsubscribePathUpdate = electronBridge.config.onTshockPathUpdated((path) => {
      setTshockPath(path);
    });

    return () => {
      unsubscribeOutput();
      unsubscribeStatus();
      unsubscribeStartRequest();
      unsubscribeStopRequest();
      unsubscribePathUpdate();
    };
  }, [isElectron]);

  const handleStart = useCallback(async () => {
    if (!isElectron) return;

    setIsLoading(true);
    setError(null);
    setOutputs(prev => [...prev, {
      type: 'info',
      data: '正在启动 TShock 服务器...',
      timestamp: Date.now()
    }]);

    try {
      const result = await electronBridge.terminal.start();
      if (!result.success) {
        setError(result.error || '启动失败');
        setOutputs(prev => [...prev, {
          type: 'error',
          data: `启动失败: ${result.error}`,
          timestamp: Date.now()
        }]);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '启动失败';
      setError(errorMsg);
      setOutputs(prev => [...prev, {
        type: 'error',
        data: `启动失败: ${errorMsg}`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [isElectron]);

  const handleStop = useCallback(async () => {
    if (!isElectron) return;

    setIsLoading(true);
    setError(null);
    setOutputs(prev => [...prev, {
      type: 'info',
      data: '正在停止 TShock 服务器...',
      timestamp: Date.now()
    }]);

    try {
      const result = await electronBridge.terminal.stop();
      if (!result.success) {
        setError(result.error || '停止失败');
        setOutputs(prev => [...prev, {
          type: 'error',
          data: `停止失败: ${result.error}`,
          timestamp: Date.now()
        }]);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '停止失败';
      setError(errorMsg);
      setOutputs(prev => [...prev, {
        type: 'error',
        data: `停止失败: ${errorMsg}`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [isElectron]);

  const handleSendCommand = useCallback(async () => {
    if (!inputValue.trim() || !isElectron) return;

    const command = inputValue.trim();
    setInputValue('');

    try {
      const result = await electronBridge.terminal.send(command);
      if (!result.success) {
        setError(result.error || '命令发送失败');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '命令发送失败';
      setError(errorMsg);
    }
  }, [inputValue, isElectron]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendCommand();
    }
  };

  const handleSelectPath = useCallback(async () => {
    if (!isElectron) return;

    try {
      const result = await selectFile({
        properties: ['openFile'],
        filters: [
          { name: 'Executables', extensions: ['exe', 'app', ''] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (result && !result.canceled && result.filePaths.length > 0) {
        const selectedPath = result.filePaths[0];
        setTshockPath(selectedPath);

        await electronBridge.app.setStore('tshock', {
          executablePath: selectedPath,
          workingDir: selectedPath.substring(0, selectedPath.lastIndexOf(selectedPath.includes('\\') ? '\\' : '/'))
        });

        setOutputs(prev => [...prev, {
          type: 'info',
          data: `TShock 路径已设置为: ${selectedPath}`,
          timestamp: Date.now()
        }]);
      }
    } catch (err) {
      console.error('Failed to select file:', err);
    }
  }, [isElectron, selectFile]);

  const handleValidatePath = useCallback(async () => {
    if (!tshockPath || !isElectron) return;

    try {
      const validation = await electronBridge.config.validatePath(tshockPath);
      setHasPathError(!validation.valid);

      if (validation.valid) {
        setOutputs(prev => [...prev, {
          type: 'info',
          data: `路径验证通过: ${tshockPath}`,
          timestamp: Date.now()
        }]);
      } else {
        setError(`路径无效: ${validation.stats.exists ? '文件不可执行' : '文件不存在'}`);
      }
    } catch (err) {
      console.error('Failed to validate path:', err);
    }
  }, [tshockPath, isElectron]);

  const handleClearOutput = () => {
    setOutputs([]);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = () => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'starting':
      case 'stopping':
      case 'setup': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'idle': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'running': return '运行中';
      case 'starting': return '启动中...';
      case 'stopping': return '停止中...';
      case 'error': return '错误';
      case 'setup': return '配置中...';
      case 'idle': return '空闲';
      default: return '已停止';
    }
  };

  if (!isElectron) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8">
        <div className="glass-card neon-border p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">终端功能仅在桌面端可用</h2>
          <p className="text-slate-400">终端功能需要使用 Electron 桌面应用。请下载桌面版应用以使用此功能。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center neon-pulse">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">TShock 终端</h1>
            <p className="text-slate-400 text-sm">本地服务器管理</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${status === 'running' ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></div>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          <button
            onClick={handleClearOutput}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-all text-sm"
            title="清除输出"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            清除
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 border-b border-slate-700/50 bg-slate-900/30">
        <div className="flex-1">
          <label className="block text-slate-400 text-sm mb-1">TShock 可执行文件路径</label>
          <input
            type="text"
            value={tshockPath}
            onChange={(e) => {
              setTshockPath(e.target.value);
              setHasPathError(false);
            }}
            placeholder="选择或输入 TShock 服务器路径"
            className={`w-full px-3 py-2 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-all ${
              hasPathError ? 'border-red-500' : 'border-slate-600'
            }`}
          />
          {hasPathError && (
            <p className="text-red-400 text-xs mt-1">路径无效，请检查文件是否存在</p>
          )}
        </div>
        <button
          onClick={handleSelectPath}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-white transition-all whitespace-nowrap"
        >
          浏览...
        </button>
        <button
          onClick={handleValidatePath}
          disabled={!tshockPath}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-white transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          验证
        </button>
      </div>

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="flex-1 flex flex-col glass-card neon-border overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-slate-700/50 bg-slate-900/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-slate-300 font-medium">终端输出</span>
            </div>
            <span className="text-slate-500 text-xs">{outputs.length} 条消息</span>
          </div>

          <div
            ref={outputRef}
            className="flex-1 overflow-y-auto p-3 bg-slate-950/50 font-mono text-sm"
          >
            {outputs.length === 0 ? (
              <div className="text-slate-500 text-center py-8">
                暂无输出，请启动 TShock 服务器
              </div>
            ) : (
              outputs.map((output, index) => (
                <div key={index} className="flex gap-2 mb-1">
                  <span className="text-slate-500 shrink-0">[{formatTime(output.timestamp)}]</span>
                  <span className={
                    output.type === 'stderr' || output.type === 'error' ? 'text-red-400' :
                    output.type === 'command' ? 'text-cyan-400' :
                    output.type === 'info' ? 'text-blue-400' :
                    'text-slate-300'
                  }>
                    {output.data}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-slate-700/50 bg-slate-900/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="输入命令..."
                disabled={status !== 'running' && status !== 'idle'}
                className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-all disabled:opacity-50"
              />
              <button
                onClick={handleSendCommand}
                disabled={!inputValue.trim() || (status !== 'running' && status !== 'idle')}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                发送
              </button>
            </div>
          </div>
        </div>

        <div className="w-64 flex flex-col gap-4">
          <div className="glass-card neon-border p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              服务器控制
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleStart}
                disabled={isLoading || status === 'running' || status === 'starting' || status === 'setup'}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'starting' ? '启动中...' : '启动服务器'}
              </button>
              <button
                onClick={handleStop}
                disabled={isLoading || status === 'stopped'}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'stopping' ? '停止中...' : '停止服务器'}
              </button>
            </div>
          </div>

          <div className="glass-card neon-border p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              状态信息
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">状态:</span>
                <span className={getStatusColor()}>{getStatusText()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">配置路径:</span>
                <span className="text-slate-300 text-xs truncate max-w-[120px]" title={configPath}>
                  {configPath.split(/[/\\]/).pop() || '未设置'}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="glass-card neon-border p-4 border-red-500/50">
              <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                错误
              </h3>
              <p className="text-red-300 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-slate-400 hover:text-white text-xs transition-colors"
              >
                关闭
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
