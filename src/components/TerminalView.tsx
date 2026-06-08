import { useTerminalStream } from '../hooks/useTerminalStream';
import { TerminalPanel } from './TerminalPanel';
import { useConfig } from '../hooks/useConfig';

export const TerminalView = () => {
  const { config } = useConfig();
  const stream = useTerminalStream(config.tshock.useBuiltinServer);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center neon-pulse">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gradient">TShock 终端</h1>
          <p className="text-slate-400 text-sm">服务器命令管理</p>
        </div>
      </div>

      <div className="flex-1 glass-card neon-border overflow-hidden m-4 mt-0">
        <TerminalPanel stream={stream} showInput={true} showActions={true} className="h-full" />
      </div>
    </div>
  );
};
