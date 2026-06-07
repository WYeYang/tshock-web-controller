import React from 'react';

export function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background decorative elements - Crystalline Cybernetics style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500/5 to-transparent blur-3xl"></div>
        
        {/* Geometric grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl animate-pulse"></div>
                <img src="/favicon.svg" alt="TShock 服务器控制器" className="w-32 h-32 relative z-10" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              TShock 服务器控制器
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-2xl mx-auto">
              功能强大的 TShock 服务器管理工具，让你的泰拉瑞亚服务器管理更简单
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
              <span className="text-slate-300">最新版本</span>
              <span className="font-bold text-cyan-400 text-xl">v1.0.0</span>
            </div>
          </div>

          {/* Download Section */}
          <div className="mb-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-900/70 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/50">
                <h2 className="text-3xl font-bold text-center mb-8 text-white">
                  下载应用
                </h2>
                <div className="flex flex-col items-center gap-6">
                  <a
                    href="./download/TShock-Controller-win-x64.zip"
                    className="group relative inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 rounded-2xl font-bold text-xl shadow-2xl shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
                    <div className="relative flex items-center gap-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>下载 Windows 版本</span>
                      <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span>或者访问</span>
                    <a href="https://github.com/WYeYang/tshock-web-controller/releases/latest" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline transition-colors">
                      GitHub Releases
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              功能特性
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'cyan', title: '服务器状态监控', desc: '实时查看服务器运行状态和玩家在线情况' },
                { icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'purple', title: '用户和用户组管理', desc: '完整的用户权限管理和用户组配置' },
                { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'green', title: '玩家信息查看', desc: '查看和管理玩家详细信息' },
                { icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.572c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', color: 'yellow', title: '配置面板', desc: '简单易用的服务器配置界面' },
                { icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'pink', title: '终端面板', desc: '内置终端支持直接执行服务器命令' },
                { icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'slate', title: '内置 TShock 服务器', desc: '桌面版包含完整的 TShock 服务器（仅桌面版）' }
              ].map((feature, i) => (
                <div key={i} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br border border-slate-700/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{
                    background: feature.color === 'cyan' ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), transparent)' :
                               feature.color === 'purple' ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), transparent)' :
                               feature.color === 'green' ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), transparent)' :
                               feature.color === 'yellow' ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), transparent)' :
                               feature.color === 'pink' ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), transparent)' :
                               'linear-gradient(135deg, rgba(148, 163, 184, 0.1), transparent)'
                  }}></div>
                  <div className="relative bg-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 transition-all duration-300 hover:border-slate-600/70 hover:shadow-lg" style={{
                    boxShadow: feature.color === 'cyan' ? '0 0 0 0 rgba(6, 182, 212, 0)' :
                               feature.color === 'purple' ? '0 0 0 0 rgba(168, 85, 247, 0)' :
                               feature.color === 'green' ? '0 0 0 0 rgba(34, 197, 94, 0)' :
                               feature.color === 'yellow' ? '0 0 0 0 rgba(234, 179, 8, 0)' :
                               feature.color === 'pink' ? '0 0 0 0 rgba(236, 72, 153, 0)' :
                               '0 0 0 0 rgba(148, 163, 184, 0)'
                  }} onMouseEnter={(e) => {
                    const colors = { cyan: '0 0 30px rgba(6, 182, 212, 0.15)', purple: '0 0 30px rgba(168, 85, 247, 0.15)', green: '0 0 30px rgba(34, 197, 94, 0.15)', yellow: '0 0 30px rgba(234, 179, 8, 0.15)', pink: '0 0 30px rgba(236, 72, 153, 0.15)', slate: '0 0 30px rgba(148, 163, 184, 0.15)' };
                    e.currentTarget.style.boxShadow = colors[feature.color as keyof typeof colors];
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 0 rgba(0,0,0,0)';
                  }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{
                      background: feature.color === 'cyan' ? 'rgba(6, 182, 212, 0.15)' :
                                 feature.color === 'purple' ? 'rgba(168, 85, 247, 0.15)' :
                                 feature.color === 'green' ? 'rgba(34, 197, 94, 0.15)' :
                                 feature.color === 'yellow' ? 'rgba(234, 179, 8, 0.15)' :
                                 feature.color === 'pink' ? 'rgba(236, 72, 153, 0.15)' :
                                 'rgba(148, 163, 184, 0.15)'
                    }}>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                        color: feature.color === 'cyan' ? '#22d3ee' :
                               feature.color === 'purple' ? '#a855f7' :
                               feature.color === 'green' ? '#4ade80' :
                               feature.color === 'yellow' ? '#facc15' :
                               feature.color === 'pink' ? '#f472b6' :
                               '#94a3b8'
                      }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Installation Guide */}
          <div className="mb-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-900/60 backdrop-blur-sm rounded-3xl p-10 border border-slate-700/50">
                <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  安装使用说明
                </h2>
                <div className="space-y-6">
                  {[
                    { step: 1, color: 'cyan', title: '下载', desc: '点击上方下载按钮，下载 Windows 压缩包' },
                    { step: 2, color: 'purple', title: '解压', desc: '将下载的 zip 文件解压到任意文件夹' },
                    { step: 3, color: 'green', title: '运行', desc: '双击运行应用程序' },
                    { step: 4, color: 'pink', title: '配置', desc: '首次启动会自动进入设置向导，按照提示完成配置' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/30">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl" style={{
                        background: item.color === 'cyan' ? 'linear-gradient(135deg, #22d3ee, #06b6d4)' :
                                   item.color === 'purple' ? 'linear-gradient(135deg, #c084fc, #a855f7)' :
                                   item.color === 'green' ? 'linear-gradient(135deg, #4ade80, #22c55e)' :
                                   'linear-gradient(135deg, #f472b6, #ec4899)'
                      }}>
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                        <p className="text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-slate-800/70 backdrop-blur-sm hover:bg-slate-700/70 rounded-2xl font-semibold text-white transition-all duration-300 border border-slate-700/50 hover:border-slate-600/70"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              进入在线演示
            </a>
            <a
              href="https://github.com/WYeYang/tshock-web-controller"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-slate-800/70 backdrop-blur-sm hover:bg-slate-700/70 rounded-2xl font-semibold text-white transition-all duration-300 border border-slate-700/50 hover:border-slate-600/70"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
