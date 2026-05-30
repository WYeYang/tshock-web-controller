export type ViewType = 'command' | 'server' | 'help' | 'docs' | 'config';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isConfigured: boolean;
}

interface MenuItem {
  id: ViewType;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    id: 'command',
    label: '命令助手',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    id: 'server',
    label: '服务器状态',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'help',
    label: '帮助文档',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'docs',
    label: '文档中心',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: 'config',
    label: '配置面板',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export const Sidebar = ({ currentView, onViewChange, isConfigured }: SidebarProps) => {
  const visibleMenuItems = isConfigured 
    ? menuItems 
    : menuItems.filter(item => item.id === 'help' || item.id === 'docs' || item.id === 'config');

  return (
    <div className="w-[280px] h-full bg-slate-950/80 backdrop-blur-xl border-r border-slate-700/50 p-4 overflow-y-auto flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center neon-pulse">
          <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012-2v4a2 2 0 01-2-2M5 12a2 2 0 00-2-2v4a2 2 0 002-2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gradient">TShock</h2>
          <p className="text-slate-400 text-sm">控制器</p>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {visibleMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`
              w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200
              ${currentView === item.id
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 text-cyan-400'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
              }
            `}
          >
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              ${currentView === item.id
                ? 'bg-cyan-500/20'
                : 'bg-slate-800/50'
              }
            `}>
              {item.icon}
            </div>
            <span className="font-semibold">{item.label}</span>
            {currentView === item.id && (
              <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t border-slate-700/50">
        <div className="text-center text-slate-500 text-xs">
          <p>服务器管理工具</p>
          <p className="mt-1">© 2024</p>
        </div>
      </div>
    </div>
  );
};

export type { SidebarProps };
