import React from 'react';

export function DownloadPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <img src="/favicon.svg" alt="TShock 服务器控制器" className="w-24 h-24" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            TShock 服务器控制器
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            功能强大的 TShock 服务器管理工具，让你的泰拉瑞亚服务器管理更简单
          </p>
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-gray-800 rounded-full border border-gray-700">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
            <span className="text-gray-300">最新版本</span>
            <span className="font-bold text-green-400 text-lg">v1.0.0</span>
          </div>
        </div>

        {/* Download Section */}
        <div className="mb-16">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">
              下载应用
            </h2>
            <div className="flex flex-col items-center gap-5">
              <a
                href="./download/TShock-Controller-win-x64.zip"
                className="inline-flex items-center gap-3 px-10 py-4 bg-green-600 hover:bg-green-500 rounded-lg font-semibold text-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>下载 Windows 版本</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <span>或者访问</span>
                <a href="https://github.com/WYeYang/tshock-web-controller/releases/latest" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
                  GitHub Releases
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-white">
            功能特性
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: '服务器状态监控', desc: '实时查看服务器运行状态和玩家在线情况' },
              { icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', title: '用户和用户组管理', desc: '完整的用户权限管理和用户组配置' },
              { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', title: '玩家信息查看', desc: '查看和管理玩家详细信息' },
              { icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.572c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', title: '配置面板', desc: '简单易用的服务器配置界面' },
              { icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', title: '终端面板', desc: '内置终端支持直接执行服务器命令' },
              { icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', title: '内置 TShock 服务器', desc: '桌面版包含完整的 TShock 服务器（仅桌面版）' }
            ].map((feature, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Installation Guide */}
        <div className="mb-16">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-8 text-center text-white">
              安装使用说明
            </h2>
            <div className="space-y-5">
              {[
                { step: 1, title: '下载', desc: '点击上方下载按钮，下载 Windows 压缩包' },
                { step: 2, title: '解压', desc: '将下载的 zip 文件解压到任意文件夹' },
                { step: 3, title: '运行', desc: '双击运行应用程序' },
                { step: 4, title: '配置', desc: '首次启动会自动进入设置向导，按照提示完成配置' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 p-5 bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-white">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-5">
          <a
            href="/"
            className="inline-flex items-center gap-3 px-7 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-white transition-colors border border-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            进入在线演示
          </a>
          <a
            href="https://github.com/WYeYang/tshock-web-controller"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-7 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-white transition-colors border border-gray-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
