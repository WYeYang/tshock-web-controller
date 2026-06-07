# Checklist - TShock 桌面控制器

## Phase 1: 项目基础配置

- [ ] Electron依赖已正确安装为devDependencies（package.json包含electron相关依赖）
- [ ] electron-builder已配置并能正常运行
- [ ] electron-store已安装并配置
- [ ] tree-kill和chokidar依赖已安装
- [ ] package.json包含electron开发脚本（dev/build）
- [ ] **Web打包产物不包含Electron运行时**
- [ ] Electron主进程文件结构正确
- [ ] preload脚本正确配置
- [ ] 主进程窗口创建逻辑正常
- [ ] IPC通信基础架构可用
- [ ] 应用菜单和托盘图标配置正确
- [ ] 运行`npm run electron:dev`能成功启动Electron应用

## Phase 2: 平台检测与适配

- [ ] `src/hooks/usePlatform.ts`已创建
- [ ] 平台检测能正确识别Electron环境
- [ ] 操作系统类型检测正确（Windows/macOS/Linux）
- [ ] `src/App.tsx`包含平台检测逻辑
- [ ] Web端运行时`isElectron`为`false`
- [ ] 桌面端运行时`isElectron`为`true`
- [ ] 条件渲染根据平台正确工作

## Phase 3: 侧边栏与导航

- [ ] `src/components/Sidebar.tsx`已修改
- [ ] "终端"菜单项已添加
- [ ] 终端菜单项仅在Electron环境显示
- [ ] ViewType类型包含'terminal'
- [ ] 菜单项图标正确显示
- [ ] `src/components/Dashboard.tsx`已修改
- [ ] 终端视图路由正确配置
- [ ] 视图切换功能正常

## Phase 4: TShock终端功能

- [ ] `electron/ipc/tshock.ts` IPC模块已创建
- [ ] TShock进程启动功能正常
- [ ] TShock进程停止功能正常
- [ ] 命令发送功能正常
- [ ] stdout/stderr事件正确转发到渲染进程
- [ ] `src/services/electronBridge.ts`已创建
- [ ] IPC调用方法封装完整
- [ ] Promise风格接口可用
- [ ] `src/components/TerminalView.tsx`组件已创建
- [ ] 终端输出显示区域正常
- [ ] 命令输入框功能正常
- [ ] 启动/停止按钮功能正常
- [ ] 状态指示器正确显示
- [ ] TShock路径配置UI已实现
- [ ] 路径验证逻辑正确
- [ ] 路径保存到electron-store成功
- [ ] 手动输入路径功能正常

## Phase 5: 配置文件编辑器

- [ ] `electron/ipc/config.ts` IPC模块已创建
- [ ] config.json文件读取功能正常
- [ ] config.json文件写入功能正常
- [ ] Token自动生成功能正常
- [ ] Token写入config.json功能正常
- [ ] 文件格式验证功能正常
- [ ] `src/components/ConfigEditor.tsx`组件已创建
- [ ] JSON可视化编辑表单正常显示
- [ ] 常见配置项可编辑
- [ ] 保存功能正常
- [ ] 取消功能正常
- [ ] 编辑状态和错误提示显示正常
- [ ] "一键Token配置"按钮已添加
- [ ] Token生成逻辑正确
- [ ] Token自动填入功能正常
- [ ] Token保存到配置文件功能正常

## Phase 6: 配置面板增强

- [ ] `src/types/config.ts`已更新
- [ ] TShock路径配置类型已添加
- [ ] Electron特有配置类型已添加
- [ ] TypeScript类型检查通过
- [ ] `src/components/ConfigPanel.tsx`已修改
- [ ] TShock路径配置区域已添加（桌面端）
- [ ] 配置文件编辑器入口按钮已添加（桌面端）
- [ ] 自动配置Token按钮已添加（桌面端）
- [ ] Web端配置面板保持原样
- [ ] `src/utils/storage.ts`已修改
- [ ] Electron环境路径配置支持正常
- [ ] 路径验证辅助函数可用

## Phase 7: API与Token同步

- [ ] `src/services/tshockApi.ts`已修改
- [ ] Token自动写入配置逻辑已实现（桌面端）
- [ ] Token获取流程已优化
- [ ] `src/hooks/useTShock.ts`已修改
- [ ] Electron Token写入功能已集成
- [ ] 错误处理已优化
- [ ] 获取Token后自动保存到配置文件

## Phase 8: 构建与打包

- [ ] electron-builder配置正确
- [ ] 应用图标已配置
- [ ] 应用名称和版本配置正确
- [ ] 打包输出目录配置正确
- [ ] 运行`npm run build:electron`成功生成可执行文件
- [ ] Windows平台可执行文件测试通过
- [ ] macOS平台可执行文件测试通过
- [ ] Linux平台可执行文件测试通过

## Phase 9: 文档与测试

- [ ] 接口类型注释完整
- [ ] Electron相关类型文档完整
- [ ] Web端命令助手功能测试通过
- [ ] Web端服务器状态功能测试通过
- [ ] Web端配置保存功能测试通过
- [ ] Web端功能未受桌面端开发影响

## 集成测试

- [ ] Electron应用完整启动流程正常
- [ ] Web界面在Electron中正确加载
- [ ] 终端功能完整可用
- [ ] 配置文件编辑功能完整可用
- [ ] Token配置功能完整可用
- [ ] Web端浏览器访问功能正常
- [ ] Web端和桌面端功能互不影响
- [ ] 打包后应用功能正常

## 性能测试

- [ ] Electron应用启动时间可接受（<5秒）
- [ ] 终端输出响应及时（<100ms延迟）
- [ ] 配置文件保存性能可接受（<1秒）
- [ ] 内存占用合理（<500MB空闲状态）

## 安全测试

- [ ] IPC通信使用contextBridge正确隔离
- [ ] 用户输入已正确转义
- [ ] 文件路径操作已验证
- [ ] Token存储安全（不暴露到日志）
