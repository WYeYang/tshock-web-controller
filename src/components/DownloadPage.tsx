import { useEffect, useState } from 'react';
import packageInfo from '../../package.json';
import { ItemRain } from './ItemRain';

const NAV_ITEMS = [
  { id: 'section-download', label: '下载', color: 'cyan' },
  { id: 'section-features', label: '核心特色', color: 'cyan' },
  { id: 'section-controller', label: '控制器', color: 'purple' },
  { id: 'section-install', label: '安装说明', color: 'pink' },
];

export function DownloadPage() {
  const [activeSection, setActiveSection] = useState<string>('section-download');

  useEffect(() => {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    const root = document.getElementById('root');
    if (root) {
      root.style.overflow = 'auto';
      root.style.height = 'auto';
    }

    return () => {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      if (root) {
        root.style.overflow = 'hidden';
        root.style.height = '100%';
      }
    };
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map(item => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const updateActive = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.offsetTop <= scrollPos) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = window.innerHeight * 0.1;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const fileName = `TShock.Controller-${packageInfo.version}-win.zip`;
  const encodedFileName = encodeURIComponent(fileName);
  const githubUrl = `https://github.com/WYeYang/tshock-web-controller/releases/download/v${packageInfo.version}/${encodedFileName}`;

  const mirrors = [
    { name: 'gh-proxy', url: `https://gh-proxy.com/${githubUrl}`, description: '国内加速' },
  ];

  return (
    <div className="relative min-h-screen">
      {/* 背景装饰层 - 最底层 */}
      <div className="fixed inset-0 bg-slate-950 z-0 pointer-events-none"></div>
      <div className="fixed inset-0 cyber-grid pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none z-0"></div>

      {/* ItemRain 层 - 顶层，只在物品上可交互，容器穿透 */}
      <div className="fixed inset-0 z-5 pointer-events-none">
        <ItemRain />
      </div>

      {/* 右侧定制化导航条 */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 pointer-events-auto hidden md:flex flex-col items-end gap-3">
        <div className="glass-card neon-border p-3 flex flex-col gap-3">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const colorMap: Record<string, { dot: string; glow: string; text: string }> = {
              cyan: { dot: 'bg-cyan-400', glow: 'shadow-[0_0_12px_rgba(34,211,238,0.7)]', text: 'text-cyan-400' },
              purple: { dot: 'bg-purple-400', glow: 'shadow-[0_0_12px_rgba(168,85,247,0.7)]', text: 'text-purple-400' },
              pink: { dot: 'bg-pink-400', glow: 'shadow-[0_0_12px_rgba(236,72,153,0.7)]', text: 'text-pink-400' },
            };
            const c = colorMap[item.color];
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="group flex items-center gap-3"
              >
                <span
                  className={`text-sm font-medium transition-all duration-300 ${
                    isActive ? `${c.text} opacity-100 translate-x-0` : 'text-slate-500 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`relative flex items-center justify-center w-3 h-3 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                    isActive
                      ? `${c.dot} border-transparent ${c.glow} scale-125`
                      : 'border-slate-600 hover:border-slate-400'
                  }`}
                >
                  {isActive && (
                    <span className={`absolute inset-0 rounded-full ${c.dot} animate-ping opacity-40`}></span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
        {/* 装饰性竖线 */}
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-600 to-transparent self-center mr-1.5"></div>
      </nav>

      {/* 内容层 */}
      <div className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* 下载区 */}
          <div id="section-download" className="mb-16 scroll-mt-20">
            <div className="text-center mb-16">
              <div className="flex justify-center mb-8">
                <img src={import.meta.env.BASE_URL + 'favicon.svg'} alt="TShock 服务器控制器" className="w-24 h-24" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
                TShock 服务器控制器
              </h1>
              <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                功能强大的 TShock 服务器管理工具，让你的泰拉瑞亚服务器管理更简单
              </p>
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse"></span>
                <span className="text-slate-300">最新版本</span>
                <span className="font-bold text-lg text-blue-400">v{packageInfo.version}</span>
              </div>
            </div>

            <div className="mb-16">
              <div className="glass-card neon-border p-8 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center text-slate-100 flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  下载应用
                </h2>
                <div className="text-center mb-6">
                  <span className="inline-block px-3 py-1 bg-slate-800/60 rounded-full text-sm text-slate-400">
                    {fileName} · 约 150MB
                  </span>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 w-full px-10 py-4 rounded-xl font-semibold text-lg bg-blue-500 hover:bg-blue-600 text-white hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>GitHub 官方下载</span>
                  </a>

                  {mirrors.length > 0 && (
                    <div className="w-full">
                      <p className="text-center text-sm text-slate-400 mb-3">国内镜像加速</p>
                      <div className="flex flex-col gap-3">
                        {mirrors.map((mirror) => (
                          <a
                            key={mirror.name}
                            href={mirror.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <span className="font-semibold">{mirror.description}</span>
                            <span className="text-xs opacity-70">({mirror.name})</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <a
                    href="https://github.com/WYeYang/tshock-web-controller/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    查看所有版本
                  </a>
                </div>
                <div className="mt-6 flex items-center justify-center gap-4">
                  <a
                    href="#/"
                    className="inline-flex items-center gap-3 px-7 py-3 glass-card neon-border hover:border-cyan-500/30 rounded-2xl font-medium text-slate-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    进入网页版
                  </a>
                  <a
                    href="https://github.com/WYeYang/tshock-web-controller"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-7 py-3 glass-card neon-border hover:border-cyan-500/30 rounded-2xl font-medium text-slate-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* TShock 服务器核心特色 */}
          <div id="section-features" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-10 text-center text-gradient flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              TShock 服务器核心特色
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 2 0 0112 0v1zm0 0h6v-1a6 2 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'cyan', title: '强制开荒（SSC）', desc: '服务端角色系统，强制玩家从零开始，背包和角色数据保存于服务器', commands: ['ServerSideCharacter'] },
                { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'purple', title: '玩家管理', desc: '踢出、封禁、禁言玩家，维护服务器秩序', commands: ['/kick', '/ban', '/mute'] },
                { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'pink', title: '物品管理', desc: '给予玩家物品，管理物品禁令，防止作弊', commands: ['/give', '/item', '/itemban'] },
                { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', color: 'cyan', title: '传送系统', desc: '丰富的传送功能，包括玩家间传送、传送点、坐标传送', commands: ['/tp', '/warp', '/tppos'] },
                { icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'purple', title: '世界事件控制', desc: '手动触发血月、日食、入侵等事件，生成Boss和怪物', commands: ['/worldevent', '/spawnboss', '/butcher'] },
                { icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'pink', title: '世界管理', desc: '控制时间、天气、难度，设置出生点和地牢位置', commands: ['/time', '/rain', '/hardmode'] },
                { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'cyan', title: '区域保护', desc: '创建受保护区域，防止恶意破坏', commands: ['/region'] },
                { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', color: 'purple', title: '玩家功能', desc: '治愈、增益、上帝模式、复活等管理员功能', commands: ['/heal', '/buff', '/godmode'] },
                { icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: 'pink', title: '聊天系统', desc: '队伍聊天、私聊、广播消息等完善的聊天功能', commands: ['/party', '/whisper', '/broadcast'] },
              ].map((feature, i) => {
                const colorClasses = {
                  cyan: 'bg-cyan-500/20 text-cyan-400',
                  purple: 'bg-purple-500/20 text-purple-400',
                  pink: 'bg-pink-500/20 text-pink-400'
                };
                return (
                  <div key={i} className="glass-card neon-border p-6 hover:border-cyan-500/30 transition-colors">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-slate-100">{feature.title}</h3>
                    <p className="text-slate-400 mb-3">{feature.desc}</p>
                    {feature.commands && (
                      <div className="flex flex-wrap gap-2">
                        {feature.commands.map((cmd, j) => (
                          <code key={j} className="px-2 py-1 bg-slate-800/70 text-cyan-300 text-xs rounded border border-slate-700/50">
                            {cmd}
                          </code>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TShock 控制器特色功能 */}
          <div id="section-controller" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-10 text-center text-gradient flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              控制器特色功能
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'cyan', title: '服务器状态监控', desc: '实时查看服务器运行状态、玩家在线情况和性能指标' },
                { icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 2 0 0112 0v1zm0 0h6v-1a6 2 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'purple', title: '用户和用户组管理', desc: '可视化界面管理用户权限和用户组配置' },
                { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'pink', title: '玩家信息查看', desc: '查看玩家详细信息、背包、装备和属性' },
                { icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.065c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z', color: 'cyan', title: '配置面板', desc: '图形化配置服务器参数，无需手动编辑配置文件' },
                { icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'purple', title: '终端面板', desc: '内置终端支持直接执行服务器命令' },
                { icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'pink', title: '内置 TShock 服务器', desc: '桌面版包含完整的 TShock 服务器，开箱即用' },
              ].map((feature, i) => {
                const colorClasses = {
                  cyan: 'bg-cyan-500/20 text-cyan-400',
                  purple: 'bg-purple-500/20 text-purple-400',
                  pink: 'bg-pink-500/20 text-pink-400'
                };
                return (
                  <div key={i} className="glass-card neon-border p-6 hover:border-cyan-500/30 transition-colors">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-slate-100">{feature.title}</h3>
                    <p className="text-slate-400">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 安装使用说明 */}
          <div id="section-install" className="mb-16 scroll-mt-20">
            <div className="glass-card neon-border p-8">
              <h2 className="text-2xl font-bold mb-8 text-center text-gradient flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.065c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                </div>
                安装使用说明
              </h2>
              <div className="space-y-5">
                {[
                  { step: 1, color: 'cyan', title: '下载', desc: '点击上方下载按钮，下载 Windows 压缩包' },
                  { step: 2, color: 'purple', title: '解压', desc: '将下载的 zip 文件解压到任意文件夹' },
                  { step: 3, color: 'pink', title: '运行', desc: '双击运行应用程序' },
                  { step: 4, color: 'cyan', title: '配置', desc: '首次启动会自动进入设置向导，按照提示完成配置' }
                ].map((item, i) => {
                  const colorClasses = {
                    cyan: 'bg-cyan-500',
                    purple: 'bg-purple-500',
                    pink: 'bg-pink-500'
                  };
                  return (
                    <div key={i} className="flex items-start gap-5 p-5 bg-slate-900/60 rounded-xl border border-slate-700/50">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${colorClasses[item.color as keyof typeof colorClasses]}`}>
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1 text-slate-100">{item.title}</h3>
                        <p className="text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
