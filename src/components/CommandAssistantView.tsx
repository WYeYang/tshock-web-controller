import { useState, useEffect, useCallback, useRef } from 'react';
import { useTShock } from '../hooks/useTShock';
import { addCommandToHistory, loadCommandHistory, clearCommandHistory, type CommandHistoryItem } from '../utils/storage';

const QUICK_COMMANDS = [
  { name: '查看状态', command: '/status', icon: '📊' },
  { name: '查看玩家', command: '/who', icon: '👥' },
  { name: '广播消息', command: '/broadcast ', icon: '📢' },
  { name: '设置时间', command: '/time set ', icon: '⏰' },
  { name: '设置天气', command: '/weather ', icon: '🌤️' },
  { name: '生成物品', command: '/spawn ', icon: '🎁' },
  { name: '传送玩家', command: '/tp ', icon: '🚀' },
  { name: '查看帮助', command: '/help', icon: '❓' },
];

type MessageType = 'user' | 'assistant' | 'system';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  isError?: boolean;
}

interface CommandAssistantViewProps {
  onKickPlayer?: () => void;
  onBanPlayer?: () => void;
}

export const CommandAssistantView = ({ }: CommandAssistantViewProps) => {
  const { loading, error, clearError, executeCommand } = useTShock();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showQuickCommands, setShowQuickCommands] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (!isInitialLoad.current) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    // 加载历史记录
    const history = loadCommandHistory();
    if (history.length > 0) {
      const historyMessages: Message[] = [];
      history.slice().reverse().forEach((item: CommandHistoryItem) => {
        historyMessages.push({
          id: `user-${item.id}`,
          type: 'user',
          content: item.command,
          timestamp: new Date(item.timestamp),
        });
        historyMessages.push({
          id: `assistant-${item.id}`,
          type: 'assistant',
          content: item.response || '',
          timestamp: new Date(item.timestamp + 1),
          isError: !item.success,
        });
      });
      setMessages(historyMessages);
    } else {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: '欢迎使用 TShock 命令助手！🎮\n\n我可以帮你：\n• 执行服务器命令\n• 查看服务器状态\n\n试试输入 "/help" 查看可用命令，或点击下方的快捷命令按钮！',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
    isInitialLoad.current = false;
    // 初始加载后稍微延迟一下，确保 DOM 准备好再滚动
    setTimeout(() => scrollToBottom(), 100);
  }, []);

  const addMessage = useCallback((type: MessageType, content: string, isError?: boolean) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      isError,
    };
    setMessages(prev => [...prev, message]);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue('');
    setShowQuickCommands(false);
    addMessage('user', userMessage);

    try {
      const result = await executeCommand(userMessage);
      let responseText = result.response || result.error || '命令执行完成';
      // 确保 responseText 是字符串
      if (Array.isArray(responseText)) {
        responseText = responseText.join('\n');
      }
      const isError = !!result.error;
      addMessage('assistant', responseText as string, isError);
      addCommandToHistory(userMessage, !isError, responseText);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '命令执行失败';
      addMessage('assistant', errorMessage, true);
      addCommandToHistory(userMessage, false, errorMessage);
    }
  }, [inputValue, addMessage, executeCommand]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickCommand = (command: string) => {
    setInputValue(command);
    setShowQuickCommands(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatColoredText = (text: any) => {
    // 确保 text 是字符串类型
    let textStr = '';
    if (Array.isArray(text)) {
      textStr = text.join('\n');
    } else if (text !== null && text !== undefined) {
      textStr = String(text);
    }
    
    // 先处理换行符
    const lines = textStr.split('\n');
    const result: any[] = [];
    
    // 文本换行样式
    const textStyle: React.CSSProperties = {
      wordBreak: 'break-word',
      overflowWrap: 'anywhere' as const,
      whiteSpace: 'pre-wrap' as const,
    };
    
    lines.forEach((line, lineIndex) => {
      const parts: any[] = [];
      let lastIndex = 0;
      let match;
      
      // 更灵活的颜色标签匹配，使用非贪婪匹配
      const colorRegex = /\[c\/([0-9A-Fa-f]{6}):([\s\S]*?)\]/g;
      
      while ((match = colorRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(<span key={`${lineIndex}-${lastIndex}`} style={textStyle}>{line.slice(lastIndex, match.index)}</span>);
        }
        parts.push(
          <span key={`${lineIndex}-${match.index}`} style={{ color: `#${match[1]}`, ...textStyle }}>
            {match[2]}
          </span>
        );
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < line.length) {
        parts.push(<span key={`${lineIndex}-${lastIndex}`} style={textStyle}>{line.slice(lastIndex)}</span>);
      }
      
      // 添加这一行
      if (parts.length > 0) {
        result.push(<span key={lineIndex} style={textStyle}>{parts}</span>);
      } else {
        result.push(<span key={lineIndex} style={textStyle}>{line}</span>);
      }
      
      // 添加换行，除非是最后一行
      if (lineIndex < lines.length - 1) {
        result.push(<br key={`br-${lineIndex}`} />);
      }
    });
    
    return <div style={textStyle}>{result}</div>;
  };

  const handleClearHistory = () => {
    if (window.confirm('确定要清除聊天记录吗？')) {
      clearCommandHistory();
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: '欢迎使用 TShock 命令助手！🎮\n\n我可以帮你：\n• 执行服务器命令\n• 查看服务器状态\n\n试试输入 "/help" 查看可用命令，或点击下方的快捷命令按钮！',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center neon-pulse">
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">命令助手</h1>
            <p className="text-slate-400 text-sm">与服务器进行交互</p>
          </div>
        </div>
        <button
          onClick={handleClearHistory}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-red-400 transition-all text-sm"
          title="清除聊天记录"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          清除
        </button>
      </div>

      {error && (
        <div className="mx-4 mt-4 glass-card neon-border p-4 border-red-500/50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-red-400 font-semibold mb-1">错误</h3>
              <p className="text-slate-400">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className={`
              max-w-[80%] rounded-2xl px-4 py-3
              ${message.type === 'user' 
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-tr-sm' 
                : message.type === 'system'
                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                : 'bg-slate-800/50 border border-slate-700/50 rounded-tl-sm'
              }
              ${message.isError ? 'border-red-500/50 bg-red-500/10' : ''}
            `}>
              <div className={`
                whitespace-pre-wrap text-sm
                ${message.type === 'user' ? 'text-cyan-100' : message.type === 'system' ? 'text-yellow-100' : 'text-slate-200'}
                ${message.isError ? 'text-red-200' : ''}
              `}>
                {message.type === 'assistant' && !message.isError ? formatColoredText(message.content) : message.content}
              </div>
              <div className={`
                text-xs mt-1
                ${message.type === 'user' ? 'text-cyan-400' : message.type === 'system' ? 'text-yellow-400' : 'text-slate-500'}
              `}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-xl p-4">
        {showQuickCommands && (
          <div className="mb-4 glass-card neon-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                快捷命令
              </h3>
              <button
                onClick={() => setShowQuickCommands(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {QUICK_COMMANDS.map((cmd) => (
                <button
                  key={cmd.command}
                  onClick={() => handleQuickCommand(cmd.command)}
                  className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all group"
                >
                  <span className="text-lg">{cmd.icon}</span>
                  <span className="text-slate-300 text-sm font-medium group-hover:text-cyan-400 transition-colors">
                    {cmd.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setShowQuickCommands(!showQuickCommands)}
            className={`
              p-3 rounded-xl transition-all
              ${showQuickCommands 
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 text-cyan-400' 
                : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }
            `}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>

          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="输入命令... (如 /help)"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
              rows={1}
              style={{ maxHeight: '120px' }}
            />
            {inputValue && (
              <button
                onClick={() => setInputValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <button
            onClick={handleSendMessage}
            disabled={loading || !inputValue.trim()}
            className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white font-bold hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 neon-pulse"
          >
            {loading ? (
              <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
