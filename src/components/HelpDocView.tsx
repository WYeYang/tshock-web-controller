interface HelpDocViewProps {
  onGoToConfig?: () => void;
}

export const HelpDocView = ({ onGoToConfig }: HelpDocViewProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">帮助文档</h1>
            <p className="text-slate-400 text-sm">使用指南与快速参考</p>
          </div>
        </div>
        {onGoToConfig && (
          <button
            onClick={onGoToConfig}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] neon-pulse"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            前往配置
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="glass-card neon-border p-6 border-yellow-500/50 bg-yellow-500/5">
          <h2 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            首次使用请先配置
          </h2>
          <p className="text-slate-300 text-sm mb-4">
            在使用命令助手和服务器状态之前，需要先配置服务器地址和获取 Token。
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300 mb-4">
            <li>配置 TShock 的 config.json（启用 REST API）</li>
            <li>重启 TShock 服务器</li>
            <li>添加 tshock.rest 权限</li>
            <li>在控制器配置服务器地址</li>
            <li>输入用户名密码获取 Token</li>
          </ol>
          {onGoToConfig && (
            <button
              onClick={onGoToConfig}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-bold text-lg hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] neon-pulse"
            >
              立即配置
            </button>
          )}
        </div>

        <div className="glass-card neon-border p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            TShock REST API 配置
          </h2>
          <div className="space-y-4 text-slate-300">
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">配置文件设置 (config.json)</h3>
              <p className="text-sm text-slate-400 mb-3">编辑 TShock 目录下的 config.json，确保以下配置正确：</p>
              <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-slate-300">
{`{
  "RestApiEnabled": true,
  "RestApiPort": 7878,
  "EnableTokenEndpointAuthentication": false,
  "LogRest": true,
  "RESTMaximumRequestsPerInterval": 5,
  "RESTRequestBucketDecreaseIntervalMinutes": 1,
  "ApplicationRestTokens": {}
}`}
                </pre>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">RestApiEnabled</span>
                  <span className="text-slate-400">必须设为 true，启用 REST API</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">RestApiPort</span>
                  <span className="text-slate-400">REST API 端口（默认 7878）</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">EnableTokenEndpointAuthentication</span>
                  <span className="text-slate-400">建议设为 false，允许使用用户名密码获取 Token</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">RESTMaximumRequestsPerInterval</span>
                  <span className="text-slate-400">每个时间窗口内的最大请求数（默认 5）</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">RESTRequestBucketDecreaseIntervalMinutes</span>
                  <span className="text-slate-400">请求限制重置的时间间隔（分钟，默认 1）</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">必要权限设置</h3>
              <p className="text-sm text-slate-400 mb-3">在 TShock 控制台或游戏中执行以下命令，为用户组添加必要权限：</p>
              <div className="space-y-2">
                <div className="bg-slate-900/50 rounded p-3 border-2 border-cyan-500/40">
                  <div className="font-mono text-green-400 text-sm mb-1">/group addperm owner tshock.rest</div>
                  <p className="text-slate-300 text-xs">添加 REST API 基础访问权限</p>
                  <p className="text-yellow-400 text-xs mt-2">⚠️ 重要：获取 Token 的用户必须在拥有此权限的组中</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-4">其他所需权限可以在命令助手中根据需要添加。</p>
            </div>

            <div className="bg-slate-800/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">快速配置步骤</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>编辑 <span className="font-mono text-cyan-400">config.json</span>，确保 REST API 已启用</li>
                <li>重启 TShock 服务器</li>
                <li>在游戏中或控制台执行权限添加命令</li>
                <li>确保您使用的账户在 <span className="font-mono text-cyan-400">owner</span> 组或有相应权限</li>
                <li>在控制器中填写服务器地址、用户名和密码获取 Token</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="glass-card neon-border p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            完整文档参考
          </h2>
          <p className="text-slate-300 text-sm mb-4">
            需要查看详细的命令文档、API 说明和权限配置？访问文档中心获取完整参考。
          </p>
          <p className="text-slate-400 text-sm mb-4">
            点击侧边栏的「文档中心」菜单，可以查看：
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-300 mb-4">
            <li>完整的命令列表和使用示例</li>
            <li>REST API 端点详细说明</li>
            <li>权限系统完整指南</li>
            <li>常见问题解答</li>
          </ul>
        </div>

        <div className="glass-card neon-border p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            故障排查
          </h2>
          <div className="space-y-4 text-slate-300">
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h3 className="text-pink-400 font-medium mb-2">获取 Token 失败 / 403 错误</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>检查 REST API 是否已启用</li>
                <li>确认用户名和密码正确</li>
                <li>确认用户在有 REST 权限的组中</li>
                <li>检查服务器地址和端口是否正确</li>
                <li className="text-yellow-400">
                  <strong>触发限流（常见403原因）:</strong> TShock 默认每分钟最多5个请求
                </li>
              </ul>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h3 className="text-yellow-400 font-medium mb-2">403 限流问题解决方案</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded p-2">
                  <p className="font-medium text-yellow-300 mb-1">情况1: 等待时间窗口自动重置</p>
                  <p className="text-slate-300">等待 1-2 分钟让限流自动重置，TShock 默认每1分钟重置一次请求计数</p>
                </div>
                <div className="bg-orange-900/30 border border-orange-500/30 rounded p-2">
                  <p className="font-medium text-orange-300 mb-1">情况2: 提高限流阈值（推荐）</p>
                  <p className="text-slate-300 mb-1">在 config.json 中修改以下配置：</p>
                  <pre className="font-mono text-xs bg-slate-900/50 p-2 rounded mt-1">
{`"RESTMaximumRequestsPerInterval": 50,  // 提高到50或更高
"RESTRequestBucketDecreaseIntervalMinutes": 1`}
                  </pre>
                  <p className="text-slate-400 text-xs mt-1">修改后需要重启服务器生效</p>
                </div>
                <div className="bg-red-900/30 border border-red-500/30 rounded p-2">
                  <p className="font-medium text-red-300 mb-1">情况3: 重启服务器（最彻底）</p>
                  <p className="text-slate-300">重启 TShock 服务器会完全清空所有限流状态</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h3 className="text-pink-400 font-medium mb-2">命令执行失败</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>确认 Token 有效且未过期</li>
                <li>确认用户有执行该命令的权限</li>
                <li>检查服务器控制台日志获取详细错误</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
