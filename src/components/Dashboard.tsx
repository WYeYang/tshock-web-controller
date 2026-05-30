import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import type { ViewType } from './Sidebar';
import { CommandAssistantView } from './CommandAssistantView';
import { ServerStatusView } from './ServerStatusView';
import { HelpDocView } from './HelpDocView';
import { DocView } from './DocView';
import { ConfigView } from './ConfigView';
import { useConfig } from '../hooks/useConfig';

export const Dashboard = () => {
  const { config } = useConfig();
  const [currentView, setCurrentView] = useState<ViewType>('help');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [previousConfigured, setPreviousConfigured] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>(undefined);

  // 直接计算是否已配置
  const isConfigured = !!(config.tshock.serverUrl && config.tshock.token);

  useEffect(() => {
    // 如果从未配置变为已配置，自动跳转到命令助手
    if (isConfigured && !previousConfigured && (currentView === 'help' || currentView === 'docs' || currentView === 'config')) {
      setCurrentView('command');
    }
    // 只有未配置且当前不在帮助文档、文档中心或配置面板时，才强制跳转到帮助文档
    else if (!isConfigured && currentView !== 'help' && currentView !== 'docs' && currentView !== 'config') {
      setCurrentView('help');
    }
    // 保存上一次的配置状态
    setPreviousConfigured(isConfigured);
  }, [config.tshock.serverUrl, config.tshock.token, currentView]);

  const renderView = () => {
    // 如果用户明确选择了配置面板，即使未配置也显示配置面板
    if (currentView === 'config') {
      return <ConfigView />;
    }
    
    // 如果未配置且不是在配置面板，显示帮助文档或文档中心
    if (!isConfigured) {
      if (currentView === 'help') {
        return <HelpDocView onGoToConfig={() => setCurrentView('config')} />;
      } else if (currentView === 'docs') {
        return <DocView onGoToConfig={() => setCurrentView('config')} />;
      }
      return <HelpDocView onGoToConfig={() => setCurrentView('config')} />;
    }
    
    // 已配置时正常切换视图
    switch (currentView) {
      case 'command':
        return <CommandAssistantView />;
      case 'server':
        return <ServerStatusView />;
      case 'help':
        return <HelpDocView onGoToConfig={() => setCurrentView('config')} onGoToDocs={(docId) => { setCurrentView('docs'); if (docId) setSelectedDocId?.(docId); }} />;
      case 'docs':
        return <DocView onGoToConfig={() => setCurrentView('config')} initialDocId={selectedDocId} />;
      default:
        return <CommandAssistantView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 cyber-grid"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>

      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-50 h-full transform transition-transform duration-300
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            setIsMobileSidebarOpen(false);
          }}
          isConfigured={isConfigured}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gradient">
            {currentView === 'command' && '命令助手'}
            {currentView === 'server' && '服务器状态'}
            {currentView === 'help' && '帮助文档'}
            {currentView === 'docs' && '文档中心'}
            {currentView === 'config' && '配置面板'}
          </h1>
          <div className="w-10"></div>
        </div>

        {/* View content */}
        <div className="flex-1 overflow-hidden">
          {renderView()}
        </div>
      </div>
    </div>
  );
};
