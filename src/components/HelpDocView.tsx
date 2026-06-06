import { useState } from 'react';

interface HelpDocViewProps {
  onGoToConfig?: () => void;
  onGoToDocs?: (docId?: string) => void;
}

// 可折叠区域组件
interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  iconClass?: string;
  borderClass?: string;
  bgClass?: string;
  defaultExpanded?: boolean;
  hint?: string;
  children: React.ReactNode;
}

const CollapsibleSection = ({
  title,
  icon,
  iconClass = 'text-white',
  borderClass = 'border-yellow-500/50',
  bgClass = 'bg-yellow-500/5',
  defaultExpanded = false,
  hint,
  children,
}: CollapsibleSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`glass-card neon-border p-6 ${borderClass} ${bgClass}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left group"
      >
        <h2 className={`text-lg font-bold ${iconClass} flex items-center gap-3`}>
          <div className="w-10 h-10 rounded-lg bg-current/10 flex items-center justify-center opacity-80">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {icon}
            </svg>
          </div>
          {title}
          {hint && <span className="text-xs text-slate-500 font-normal ml-2">（{hint}）</span>}
        </h2>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[5000px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
};

export const HelpDocView = ({ onGoToConfig, onGoToDocs }: HelpDocViewProps) => {
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
        {/* 1. TShock 安装与初始化 - 默认折叠 */}
        <CollapsibleSection
          title="TShock 安装与初始化"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
          iconClass="text-yellow-400"
          borderClass="border-yellow-500/50"
          bgClass="bg-yellow-500/5"
          defaultExpanded={false}
          hint="已熟悉可跳过"
        >
          <div className="space-y-4 text-slate-300">
            <div>
              <h3 className="text-cyan-400 font-medium mb-2">1. 下载与安装</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm mb-1">访问 GitHub Releases 页面：</p>
                  <a href="https://github.com/Pryaxis/TShock/releases/latest" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm underline">
                    https://github.com/Pryaxis/TShock/releases/latest
                  </a>
                </div>
                <div>
                  <p className="text-sm mb-1">下载压缩包：</p>
                  <p className="text-xs text-slate-400">
                    在上方 Releases 页面下载 <code className="text-cyan-400">TShock-x.x.x-for-Terraria-x.x.x-win-x64-Release.zip</code> 格式的文件
                  </p>
                </div>
                <div>
                  <p className="text-sm mb-1">解压运行：</p>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                    <li>解压到任意目录（如 <code className="text-cyan-400">D:\TShock</code>）</li>
                    <li>进入解压目录，双击运行 <code className="text-cyan-400">TShock.Installer.exe</code></li>
                    <li>安装程序会自动下载并安装 .NET 6 运行时</li>
                    <li>运行后会生成 <code className="text-cyan-400">tshock\config.json</code> 和 <code className="text-cyan-400">tshock\sscconfig.json</code>（强制开荒配置）配置文件</li>
                  </ul>
                  {onGoToDocs && (
                    <button
                      onClick={() => onGoToDocs('tshock-config-files')}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white text-sm hover:opacity-90 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      查看配置文件说明
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-cyan-400 font-medium mb-2">2. 服务器配置</h3>
              <p className="text-sm mb-2">运行安装程序后，按提示完成以下配置：</p>
              <div className="bg-slate-800/50 rounded-lg p-3 space-y-2 text-sm">
                <div><span className="text-green-400">1.</span> 选择服务器端口（默认 7777，可直接回车）</div>
                <div><span className="text-green-400">2.</span> 选择地图/世界（输入数字选择）</div>
                <div><span className="text-green-400">3.</span> 设置最大玩家数量（默认 8）</div>
                <div><span className="text-green-400">4.</span> 是否启用自动端口转发（输入 <code className="text-cyan-400">y</code> 启用）</div>
                <div><span className="text-green-400">5.</span> 设置服务器密码（无密码直接回车跳过）</div>
                <div><span className="text-green-400">6.</span> 等待服务器启动完成</div>
              </div>
            </div>

            <div>
              <h3 className="text-cyan-400 font-medium mb-2">3. 初始化管理员</h3>
              <p className="text-sm mb-2">服务器启动后会显示 setup code，按以下步骤创建管理员：</p>
              <div className="bg-slate-800/50 rounded-lg p-3 space-y-2 text-sm">
                <div><span className="text-green-400">1.</span> 游戏内连接服务器，输入 <code className="text-cyan-400">/setup [你的setup code]</code></div>
                <div><span className="text-green-400">2.</span> 创建管理员账户：<code className="text-cyan-400 ml-2">/user add 用户名 密码 superadmin</code></div>
                <div><span className="text-green-400">3.</span> 登录账户：<code className="text-cyan-400 ml-2">/login 用户名 密码</code></div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 2. 远程控制（内网穿透）- 默认折叠 */}
        <CollapsibleSection
          title="远程控制（内网穿透）"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0 3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />}
          iconClass="text-cyan-400"
          borderClass="border-cyan-500/50"
          bgClass="bg-cyan-500/5"
          defaultExpanded={false}
          hint="已熟悉可跳过"
        >
          <div className="space-y-3">
            <p className="text-slate-300 text-sm">
              如果服务器在内网，需要使用内网穿透工具。推荐使用花生壳：
            </p>
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">花生壳内网穿透</h4>
              <p className="text-slate-400 text-xs mb-2">免费易用的内网穿透工具，适合游戏服务器</p>
              <a href="https://hsk.oray.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-xs underline">
                花生壳官网
              </a>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
              <h4 className="text-yellow-400 font-medium mb-2">端口映射配置（TCP）</h4>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                <li>7777 - Terraria 游戏服务器端口</li>
                <li>7878 - TShock REST API 端口（开放远程控制需要）</li>
              </ul>
              <p className="text-slate-400 text-xs mt-2">协议类型：TCP（用于远程访问和准确性要求高的数据传输）</p>
            </div>
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
              <h4 className="text-green-400 font-medium mb-2">映射后获取的信息</h4>
              <p className="text-slate-300 text-xs mb-2">完成映射后，复制花生壳提供的外网域名和外网端口：</p>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                <li>外网域名 - 用于连接的唯一地址</li>
                <li>外网端口 - 对应内网端口的外部访问端口</li>
              </ul>
              <p className="text-slate-300 text-xs mt-2">在控制器中配置时：</p>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                <li>服务器地址：填入 TShock 服务器地址（如 <code className="text-cyan-400">https://xxx.oicp.vip:12345</code>）</li>
                <li>API 请求会通过后端代理转发</li>
              </ul>
            </div>
            <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-3">
              <h4 className="text-cyan-400 font-medium mb-2">其他人加入联机</h4>
              <p className="text-slate-300 text-xs mb-2">让其他玩家加入服务器，需要告诉他们：</p>
              <p className="text-slate-400 text-xs">游戏内 → 多人游戏 → 通过IP加入 → 输入以下地址和端口：</p>
              <div className="bg-slate-900/50 rounded p-2 mt-2">
                <code className="text-green-400 text-xs">地址：域名</code>
                <br />
                <code className="text-green-400 text-xs">端口：端口号</code>
              </div>
              <p className="text-slate-300 text-xs mt-2">示例：<code className="text-cyan-400">xxx.oicp.vip</code> 端口：<code className="text-cyan-400">12345</code></p>
            </div>
          </div>
        </CollapsibleSection>

        {/* 3. TShock REST API 配置 */}
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
  "RESTMaximumRequestsPerInterval": 50,
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
                  <span className="text-slate-400">推荐设为 50+，避免频繁触发限流</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">必要权限设置</h3>
              <p className="text-sm text-slate-400 mb-3">在 TShock 控制台或游戏中执行以下命令，为用户组添加必要权限：</p>
              <div className="space-y-2">
                <div className="bg-slate-900/50 rounded p-3 border-2 border-cyan-500/40">
                  <div className="font-mono text-green-400 text-sm mb-1">/group addperm owner tshock.rest.*</div>
                  <p className="text-slate-300 text-xs">添加所有 REST API 相关权限</p>
                  <p className="text-yellow-400 text-xs mt-2">重要：获取 Token 的用户必须在拥有此权限的组中</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-4">其他所需权限可以在命令助手中根据需要添加。</p>
            </div>

            <div className="bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-purple-900/50 border-2 border-purple-500/50 rounded-lg p-4 neon-purple">
              <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                快速配置步骤
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-200">
                <li>编辑 <span className="font-mono text-cyan-400 bg-slate-800 px-1 rounded">config.json</span>，确保 REST API 已启用</li>
                <li>重启 TShock 服务器</li>
                <li>在游戏中或控制台执行权限添加命令</li>
                <li>确保您使用的账户在 <span className="font-mono text-cyan-400">owner</span> 组或有相应权限</li>
                <li>在控制器中填写服务器地址、用户名和密码获取 Token</li>
              </ol>
              {onGoToConfig && (
                <button
                  onClick={onGoToConfig}
                  className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  前往配置
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4. 故障排查 */}
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
                <li className="text-orange-300">
                  <strong>重启后需重新获取:</strong> 每次重启 TShock 服务器后，Token 会失效，需要重新获取
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
