import { useState, useEffect, useCallback, useRef } from 'react';
import type { TerminalOutput } from '../services/electronBridge';
import type { TerminalStream } from '../hooks/useTerminalStream';

// ANSI 256色标准色表
const ANSI_COLORS: string[] = [
  '#000000', '#cd0000', '#00cd00', '#cdcd00', '#0000ee', '#cd00cd', '#00cdcd', '#e5e5e5',
  '#7f7f7f', '#ff0000', '#00ff00', '#ffff00', '#5c5cff', '#ff00ff', '#00ffff', '#ffffff',
];
for (let r = 0; r < 6; r++) {
  for (let g = 0; g < 6; g++) {
    for (let b = 0; b < 6; b++) {
      ANSI_COLORS.push(`rgb(${r ? r * 40 + 55 : 0},${g ? g * 40 + 55 : 0},${b ? b * 40 + 55 : 0})`);
    }
  }
}
for (let i = 0; i < 24; i++) {
  const v = i * 10 + 8;
  ANSI_COLORS.push(`rgb(${v},${v},${v})`);
}

const ansiToHtml = (str: string): string => {
  let text = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 保留 m 结尾的 SGR 颜色序列，剥离其他所有 CSI 序列
  text = text.replace(/\x1b\[[0-9;]*[A-Za-z]/g, (match) => {
    return match.endsWith('m') ? match : '';
  });
  text = text.replace(/\x1b\[\?[0-9;]*[a-zA-Z]/g, '');
  text = text.replace(/\x1b\][^\x07]*\x07/g, '');
  text = text.replace(/\x1b\][^\x1b]*\x1b\\/g, '');
  text = text.replace(/\x1b[^[\]].?/g, '');
  text = text.replace(/[\r\n]+/g, '\n');
  // 去掉开头的换行
  text = text.replace(/^[\r\n]+/, '');
  let fg = '';
  let bg = '';
  let bold = false;
  let result = '';

  const currentStyle = (): string => {
    const parts: string[] = [];
    if (bold) parts.push('font-weight:bold');
    if (fg) parts.push(`color:${fg}`);
    if (bg) parts.push(`background-color:${bg}`);
    return parts.join(';');
  };

  const regex = /(\x1b\[([0-9;]*)m)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let openSpan = false;

  const closeSpan = () => {
    if (openSpan) {
      result += '</span>';
      openSpan = false;
    }
  };

  const openNewSpan = () => {
    const style = currentStyle();
    if (style) {
      result += `<span style="${style}">`;
      openSpan = true;
    }
  };

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      closeSpan();
      openNewSpan();
      result += text.slice(lastIndex, match.index);
    }

    const params = match[2].split(';').map(Number);
    for (const param of params) {
      if (param === 0) { fg = ''; bg = ''; bold = false; }
      else if (param === 1) { bold = true; }
      else if (param >= 30 && param <= 37) { fg = ANSI_COLORS[param - 30]; }
      else if (param === 38) { /* 扩展前景色 */ }
      else if (param === 39) { fg = ''; }
      else if (param >= 40 && param <= 47) { bg = ANSI_COLORS[param - 40]; }
      else if (param === 48) { /* 扩展背景色 */ }
      else if (param === 49) { bg = ''; }
      else if (param >= 90 && param <= 97) { fg = ANSI_COLORS[param - 90 + 8]; }
      else if (param >= 100 && param <= 107) { bg = ANSI_COLORS[param - 100 + 8]; }
    }

    const fullParams = match[2].split(';').map(Number);
    for (let j = 0; j < fullParams.length; j++) {
      if (fullParams[j] === 38 && fullParams[j + 1] === 5 && fullParams[j + 2] !== undefined) {
        fg = ANSI_COLORS[fullParams[j + 2]] || '';
        j += 2;
      } else if (fullParams[j] === 48 && fullParams[j + 1] === 5 && fullParams[j + 2] !== undefined) {
        bg = ANSI_COLORS[fullParams[j + 2]] || '';
        j += 2;
      }
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    closeSpan();
    openNewSpan();
    result += text.slice(lastIndex);
    closeSpan();
  }

  if (openSpan) {
    result += '</span>';
  }

  return result;
};

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

interface TerminalPanelProps {
  /** 终端数据流 */
  stream: TerminalStream;
  /** 是否显示命令输入框 */
  showInput?: boolean;
  /** 是否显示复制/清除按钮 */
  showActions?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 快捷命令输入（外部传入时自动填入输入框） */
  quickCommandInput?: string;
  /** 快捷命令被消费后的回调 */
  onQuickCommandConsumed?: () => void;
}

export const TerminalPanel = ({ stream, showInput = true, showActions = true, className = '', quickCommandInput, onQuickCommandConsumed }: TerminalPanelProps) => {
  const [outputs, setOutputs] = useState<TerminalOutput[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [hasSelection, setHasSelection] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [outputs, scrollToBottom]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      setHasSelection(!!(selection && selection.toString().trim().length > 0));
    };
    const handleMouseUp = () => setTimeout(handleSelectionChange, 10);
    const handleKeyUp = () => setTimeout(handleSelectionChange, 10);

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (quickCommandInput) {
      setInputValue(quickCommandInput);
      onQuickCommandConsumed?.();
    }
  }, [quickCommandInput, onQuickCommandConsumed]);

  // 检查输出是否是空的（没有可见内容）
  const isEmptyOutput = (data: string): boolean => {
    const stripped = data
      .replace(/\x1b\[[0-9;]*[A-Za-z]/g, '')
      .replace(/\x1b\[\?[0-9;]*[a-zA-Z]/g, '')
      .replace(/\x1b\][^\x07]*\x07/g, '')
      .replace(/\x1b\][^\x1b]*\x1b\\/g, '')
      .replace(/\x1b[^[\]].?/g, '')
      .replace(/[\r\n\s]/g, '');
    return !stripped;
  };

  useEffect(() => {
    const unsubscribeOutput = stream.onOutput((data) => {
      if (!isEmptyOutput(data.data)) {
        setOutputs(prev => [...prev, data]);
      }
    });

    if (stream.sync) {
      stream.sync();
    }

    return () => {
      unsubscribeOutput();
    };
  }, [stream]);

  const handleSendCommand = useCallback(async () => {
    const command = inputValue;
    setInputValue('');
    try {
      await stream.send(command);
    } catch (err) {
      console.error('命令发送失败:', err);
    }
  }, [inputValue, stream]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendCommand();
    }
  };

  const handleClearOutput = async () => {
    setOutputs([]);
    if (stream.clear) {
      await stream.clear();
    }
  };

  const handleCopyOutput = async () => {
    if (outputs.length === 0) return;
    const text = outputs.map(output =>
      `[${formatTime(output.timestamp)}] ${output.data}`
    ).join('\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const copySelection = async () => {
    try {
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        await navigator.clipboard.writeText(selection.toString());
        setHasSelection(false);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`flex flex-col overflow-hidden relative ${className}`}>
      {showActions && (
        <div className="flex items-center justify-between p-2 border-b border-slate-700/50 bg-slate-900/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-slate-300 font-medium text-sm">终端输出</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs">{outputs.length} 条消息</span>
            <button
              onClick={handleCopyOutput}
              className="flex items-center gap-1 px-2 py-1 bg-slate-800/50 hover:bg-slate-700/50 rounded text-slate-400 hover:text-white transition-all text-xs"
              title="复制全部输出"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制
            </button>
            <button
              onClick={handleClearOutput}
              className="flex items-center gap-1 px-2 py-1 bg-slate-800/50 hover:bg-slate-700/50 rounded text-slate-400 hover:text-white transition-all text-xs"
              title="清除输出"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              清除
            </button>
          </div>
        </div>
      )}

      {hasSelection && (
        <button
          onClick={copySelection}
          className="absolute top-12 right-4 z-10 px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-white text-sm transition-colors"
        >
          复制选中
        </button>
      )}

      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-3 bg-slate-950/50 font-mono text-sm select-text"
        style={{ userSelect: 'text' }}
      >
        {outputs.length === 0 ? (
          <div className="text-slate-500 text-center py-8">
            暂无输出
          </div>
        ) : (
          outputs.map((output, index) => (
            <div key={index} className="flex gap-2 mb-1">
              <span className="text-slate-500 shrink-0">[{formatTime(output.timestamp)}]</span>
              <span
                className={
                  output.type === 'stderr' || output.type === 'error' ? 'text-red-400' :
                  output.type === 'command' ? 'text-cyan-400' :
                  output.type === 'info' ? 'text-blue-400' :
                  'text-slate-300'
                }
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: ansiToHtml(output.data) }}
              />
            </div>
          ))
        )}
      </div>

      {showInput && (
        <div className="p-3 border-t border-slate-700/50 bg-slate-900/30">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="输入命令..."
              className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-all"
            />
            <button
              onClick={handleSendCommand}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              发送
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
