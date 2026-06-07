# Tasks - TShock 桌面控制器

## 任务总览

本项目需要完成以下主要任务，为TShock Web控制器添加Electron桌面应用支持，同时保持Web端功能完全不变。

---

## Phase 1: 项目基础配置

### 任务 1.1: 安装Electron相关依赖

- [ ] 安装Electron核心包作为devDependencies
- [ ] 安装electron-builder作为devDependencies
- [ ] 安装electron-store作为devDependencies
- [ ] 安装tree-kill作为devDependencies
- [ ] 安装chokidar作为devDependencies
- [ ] 配置package.json中的electron脚本
- [ ] 验证Web打包不包含Electron运行时

**验证**: Web打包产物中不包含electron目录或相关运行时

---

### 任务 1.2: 创建Electron主进程结构

- [ ] 创建`electron/main.js`主进程入口文件
- [ ] 创建`electron/preload.js`预加载脚本
- [ ] 配置主进程窗口创建逻辑
- [ ] 配置IPC通信基础架构
- [ ] 配置应用菜单和托盘图标

**验证**: Electron应用能正常启动并显示Web界面

---

## Phase 2: 平台检测与适配

### 任务 2.1: 实现平台检测Hook

- [ ] 创建`src/hooks/usePlatform.ts`
- [ ] 检测Electron运行环境
- [ ] 检测操作系统类型
- [ ] 提供平台相关配置

**验证**: Web端返回`isElectron: false`，桌面端返回`isElectron: true`

---

### 任务 2.2: 修改App组件支持平台差异

- [ ] 修改`src/App.tsx`添加平台检测逻辑
- [ ] 根据平台条件渲染功能入口
- [ ] 添加Electron环境变量注入

**验证**: Web端不显示终端菜单，桌面端显示完整菜单

---

## Phase 3: 侧边栏与导航

### 任务 3.1: 修改侧边栏组件

- [ ] 修改`src/components/Sidebar.tsx`
- [ ] 添加"终端"菜单项（仅桌面端显示）
- [ ] 添加菜单项图标
- [ ] 更新ViewType类型定义

**验证**: 桌面端侧边栏包含终端入口，Web端不显示

---

### 任务 3.2: 修改Dashboard组件

- [ ] 修改`src/components/Dashboard.tsx`
- [ ] 添加终端视图路由
- [ ] 处理平台特定的视图切换逻辑

**验证**: 点击终端菜单能切换到终端视图

---

## Phase 4: TShock终端功能

### 任务 4.1: 创建IPC通信层（主进程）

- [ ] 创建`electron/ipc/tshock.ts`处理TShock进程IPC
- [ ] 实现进程启动逻辑
- [ ] 实现进程停止逻辑
- [ ] 实现命令发送逻辑
- [ ] 实现stdout/stderr事件转发

**验证**: 能通过IPC控制TShock进程

---

### 任务 4.2: 创建Electron IPC桥接服务（渲染进程）

- [ ] 创建`src/services/electronBridge.ts`
- [ ] 封装IPC调用方法
- [ ] 提供Promise风格的接口
- [ ] 处理连接状态

**验证**: 渲染进程能调用主进程功能

---

### 任务 4.3: 创建终端视图组件

- [ ] 创建`src/components/TerminalView.tsx`
- [ ] 实现终端输出显示区域
- [ ] 实现命令输入框
- [ ] 实现启动/停止按钮
- [ ] 实现状态指示器

**验证**: 能显示终端输出，能发送命令

---

### 任务 4.4: 实现TShock路径配置功能

- [ ] 添加路径配置文件选择UI
- [ ] 实现路径验证逻辑
- [ ] 保存路径到electron-store
- [ ] 支持手动输入路径

**验证**: 能选择TShock可执行文件并保存路径

---

## Phase 5: 配置文件编辑器

### 任务 5.1: 创建IPC通信层（配置文件）

- [ ] 创建`electron/ipc/config.ts`处理配置文件IPC
- [ ] 实现配置文件读取
- [ ] 实现配置文件写入
- [ ] 实现Token自动生成和写入
- [ ] 实现文件格式验证

**验证**: 能读取和写入TShock配置文件

---

### 任务 5.2: 创建配置编辑器组件

- [ ] 创建`src/components/ConfigEditor.tsx`
- [ ] 实现JSON可视化编辑表单
- [ ] 支持常见配置项编辑
- [ ] 实现保存和取消功能
- [ ] 显示编辑状态和错误提示

**验证**: 能编辑config.json并保存

---

### 任务 5.3: 实现一键Token配置功能

- [ ] 添加Token生成逻辑
- [ ] 添加Token自动填入UI
- [ ] 添加保存到配置文件功能
- [ ] 同步Token到应用配置

**验证**: 点击"自动配置Token"能生成并保存Token

---

## Phase 6: 配置面板增强

### 任务 6.1: 扩展配置类型定义

- [ ] 修改`src/types/config.ts`
- [ ] 添加TShock路径配置类型
- [ ] 添加Electron特有配置类型

**验证**: TypeScript类型检查通过

---

### 任务 6.2: 修改ConfigPanel组件

- [ ] 修改`src/components/ConfigPanel.tsx`
- [ ] 添加TShock路径配置区域（仅桌面端）
- [ ] 添加配置文件编辑器入口按钮（仅桌面端）
- [ ] 添加自动配置Token快捷按钮（仅桌面端）

**验证**: 桌面端配置面板包含新增功能，Web端保持原样

---

### 任务 6.3: 修改Storage工具

- [ ] 修改`src/utils/storage.ts`
- [ ] 支持Electron环境下的路径配置
- [ ] 添加路径验证辅助函数

**验证**: 配置能正确保存和加载

---

## Phase 7: API与Token同步

### 任务 7.1: 修改TShock API服务

- [ ] 修改`src/services/tshockApi.ts`
- [ ] 添加Token自动写入配置逻辑（桌面端）
- [ ] 优化Token获取流程

**验证**: 获取Token后自动保存到配置文件

---

### 任务 7.2: 修改useTShock Hook

- [ ] 修改`src/hooks/useTShock.ts`
- [ ] 集成Electron Token写入功能
- [ ] 优化错误处理

**验证**: Token获取流程完整

---

## Phase 8: 构建与打包

### 任务 8.1: 配置Electron打包

- [ ] 配置electron-builder打包配置
- [ ] 配置应用图标
- [ ] 配置应用名称和版本
- [ ] 配置打包输出目录

**验证**: 运行`npm run build:electron`生成可执行文件

---

### 任务 8.2: 测试打包应用

- [ ] 在Windows平台测试打包后的应用
- [ ] 在macOS平台测试打包后的应用
- [ ] 在Linux平台测试打包后的应用

**验证**: 各平台应用能正常运行

---

## Phase 9: 文档与测试

### 任务 9.1: 更新类型定义文档

- [ ] 更新接口类型注释
- [ ] 添加Electron相关类型文档

**验证**: 文档完整清晰

---

### 任务 9.2: Web端回归测试

- [ ] 测试Web端命令助手功能
- [ ] 测试Web端服务器状态功能
- [ ] 测试Web端配置保存功能
- [ ] 验证Web端功能未受影响

**验证**: 所有Web端功能正常工作

---

## 任务依赖关系

```
Phase 1 (基础配置)
  ↓
Phase 2 (平台检测) ← Phase 1完成后
  ↓
Phase 3 (侧边栏) ← Phase 2完成后
  ↓
Phase 4 (终端功能) ← Phase 3完成后
  ↓
Phase 5 (配置编辑器) ← Phase 4完成后
  ↓
Phase 6 (配置面板) ← Phase 5完成后
  ↓
Phase 7 (API同步) ← Phase 6完成后
  ↓
Phase 8 (构建打包) ← Phase 7完成后
  ↓
Phase 9 (文档测试) ← Phase 8完成后
```

## 并行任务说明

以下任务可以并行执行：
- 任务 4.1 和 任务 5.1（两个IPC模块独立开发）
- 任务 4.3 和 任务 5.2（两个UI组件独立开发）
- Phase 2和Phase 3可以部分并行
