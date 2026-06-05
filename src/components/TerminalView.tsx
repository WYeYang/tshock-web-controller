import { useState, useEffect, useCallback } from 'react';
import { electronBridge, type TerminalStatus } from '../services/electronBridge';
import { usePlatform } from '../hooks/usePlatform';
import { TerminalPanel } from './TerminalPanel';

type TerminalStatusType = 'stopped' | 'starting' | 'running' | 'stopping' | 'error' | 'setup' | 'idle';

export const TerminalView = () => {
  const { isElectron } = usePlatform();
  const [status, setStatus] = useState<TerminalStatusType>('stopped');
  const [error, setError] = useState<string | null>(null);
  const [configPath, setConfigPath] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isElectron) return;

    const loadInitialStatus = async () => {
      try {
        const terminalStatus = await electronBridge.terminal.getStatus();
        setStatus(terminalStatus.status);

        const path = await electronBridge.config.getPath();
        setConfigPath(path);
      } catch (err) {
        console.error('Failed to load initial status:', err);
      }
    };

    loadInitialStatus();

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

    return () => {
      unsubscribeStatus();
      unsubscribeStartRequest();
      unsubscribeStopRequest();
    };
  }, [isElectron]);

  const handleStart = useCallback(async () => {
    if (!isElectron) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await electronBridge.terminal.start();
      if (!result.success) {
        setError(result.error || '启动失败');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '启动失败';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [isElectron]);

  const handleStop = useCallback(async () => {
    if (!isElectron) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await electronBridge.terminal.stop();
      if (!result.success) {
        setError(result.error || '停止失败');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '停止失败';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [isElectron]);

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
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="flex-1 flex flex-col glass-card neon-border overflow-hidden">
          <TerminalPanel showInput={true} showActions={true} className="flex-1" />
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
