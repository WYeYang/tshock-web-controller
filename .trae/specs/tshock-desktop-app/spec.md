# TShock 桌面控制器规格说明

## Why

当前项目是一个纯Web端的TShock服务器管理工具，用户希望将其扩展为桌面应用，以获得更强大的本地控制能力，包括直接运行TShock服务器、可视化配置文件编辑、以及更稳定的终端代理功能。同时需要保持Web端功能不变。

## What Changes

- 新增 **Electron 桌面应用**，提供原生系统体验
- 新增 **TShock 本地终端**，支持启动/停止本地TShock服务器进程
- 新增 **可视化配置文件编辑器**，支持编辑tshock的config.json和用户数据库
- 新增 **Token 自动配置功能**，一键生成并保存Token到配置文件
- 新增 **WebView 终端代理**，通过iframe或独立窗口集成Web界面
- 区分 **平台检测机制**，Web端和桌面端自动适配不同功能

### **BREAKING**

- 新增Electron依赖，可能影响构建流程
- 配置文件路径改为Electron的userData目录

## Impact

### Affected specs

- TShock API 交互功能（保持不变）
- 命令助手功能（保持不变，但可扩展终端输出）
- 配置面板功能（新增桌面端专用配置项）

### Affected code

- `src/App.tsx` - 新增平台检测逻辑
- `src/components/Dashboard.tsx` - 新增桌面端视图
- `src/components/ConfigPanel.tsx` - 新增配置文件编辑器
- `src/components/Sidebar.tsx` - 新增终端菜单项
- `src/services/tshockApi.ts` - 桌面端Token自动写入配置
- 新增 `electron/` 目录 - Electron主进程代码
- 新增 `src/components/TerminalView.tsx` - 终端视图组件
- 新增 `src/components/ConfigEditor.tsx` - 配置文件编辑器组件

## ADDED Requirements

### Requirement: Electron桌面应用框架

桌面应用必须基于Electron框架构建，支持Windows、macOS、Linux平台。

#### Scenario: 启动桌面应用
- **WHEN** 用户双击桌面应用图标或运行命令行启动
- **THEN** 应用窗口打开，加载Web界面，显示平台检测结果

#### Scenario: 检测运行环境
- **WHEN** Web界面初始化时
- **THEN** 自动检测是否在Electron环境中运行
- **AND** 根据平台显示/隐藏对应的功能入口

### Requirement: TShock本地终端管理

桌面端必须提供TShock服务器进程管理功能。

#### Scenario: 启动TShock服务
- **WHEN** 用户在终端界面点击"启动TShock"按钮
- **THEN** 应用在后台启动TShock进程
- **AND** 实时显示进程stdout/stderr输出
- **AND** 更新服务器状态指示器

#### Scenario: 停止TShock服务
- **WHEN** 用户在终端界面点击"停止TShock"按钮
- **THEN** 应用发送终止信号给TShock进程
- **AND** 等待进程优雅退出或强制终止
- **AND** 更新服务器状态指示器

#### Scenario: 发送命令到终端
- **WHEN** 用户在终端输入框输入命令并按Enter
- **THEN** 命令发送到TShock进程的stdin
- **AND** 显示命令回显和响应输出

### Requirement: TShock路径配置

桌面端必须支持手动配置TShock可执行文件路径。

#### Scenario: 配置TShock路径
- **WHEN** 用户首次启动或点击"设置TShock路径"
- **THEN** 显示文件选择对话框（针对TShock可执行文件）
- **OR** 显示路径输入框供手动输入
- **AND** 验证路径是否指向有效的TShock可执行文件
- **AND** 保存路径到本地配置

#### Scenario: 路径验证
- **WHEN** 用户配置的路径不存在或无效
- **THEN** 显示错误提示
- **AND** 阻止使用该路径启动服务

### Requirement: 可视化配置文件编辑器

桌面端必须提供config.json的可视化编辑功能。

#### Scenario: 打开配置文件编辑器
- **WHEN** 用户点击"编辑配置"菜单
- **THEN** 加载TShock目录下的config.json文件
- **AND** 以表单形式展示可编辑的配置项

#### Scenario: 一键添加Token
- **WHEN** 用户点击"自动配置Token"按钮
- **THEN** 生成新的Token值
- **AND** 自动填入配置文件中的对应字段
- **AND** 保存配置文件

#### Scenario: 保存配置文件
- **WHEN** 用户修改配置后点击"保存"
- **THEN** 验证配置格式是否正确
- **AND** 写入config.json文件
- **AND** 显示保存成功提示
- **OR** 显示保存失败原因

### Requirement: 平台差异功能适配

Web端和桌面端必须自动适配各自的功能集。

#### Scenario: Web端环境
- **WHEN** 检测到运行环境不是Electron
- **THEN** 隐藏TShock终端菜单入口
- **AND** 隐藏配置文件编辑器入口
- **AND** 使用现有的API代理模式连接远程服务器

#### Scenario: 桌面端环境
- **WHEN** 检测到运行环境是Electron
- **THEN** 显示TShock终端菜单入口
- **AND** 显示配置文件编辑器入口
- **AND** 优先使用本地配置和Token

## MODIFIED Requirements

### Requirement: 配置面板功能增强

**原要求**: 配置面板仅支持API连接配置

**修改后**:
- 桌面端新增"TShock路径"配置项
- 桌面端新增"配置文件编辑器"入口按钮
- 桌面端新增"自动配置Token"快捷操作

### Requirement: 侧边栏菜单项

**原要求**: 侧边栏包含命令助手、服务器状态、帮助文档、文档中心、配置面板

**修改后**:
- 桌面端新增"终端"菜单项（仅Electron环境显示）
- 桌面端配置面板新增配置文件编辑区域

## REMOVED Requirements

### Requirement: 无

**Reason**: 无需移除现有功能

**Migration**: 保持Web端功能完全不变，仅进行功能扩展

## 技术架构

### 目录结构

```
tshock-web-controller/
├── electron/                    # Electron主进程
│   ├── main.js                # 主进程入口
│   ├── preload.js             # 预加载脚本
│   ├── ipc/                   # IPC通信处理
│   │   ├── tshock.ts          # TShock进程管理
│   │   └── config.ts          # 配置文件管理
│   └── utils/
│       └── platform.ts        # 平台检测工具
├── src/
│   ├── components/
│   │   ├── TerminalView.tsx   # 终端视图（新）
│   │   ├── ConfigEditor.tsx   # 配置编辑器（新）
│   │   ├── Dashboard.tsx      # 修改：新增平台检测
│   │   ├── Sidebar.tsx        # 修改：新增终端菜单
│   │   └── ConfigPanel.tsx    # 修改：新增桌面配置
│   ├── hooks/
│   │   ├── usePlatform.ts     # 平台检测Hook（新）
│   │   └── useTShock.ts       # 修改：桌面端Token写入
│   ├── services/
│   │   ├── tshockApi.ts       # 修改：Token自动配置
│   │   └── electronBridge.ts  # Electron IPC桥接（新）
│   ├── types/
│   │   └── config.ts          # 修改：新增桌面配置类型
│   └── utils/
│       └── storage.ts          # 修改：Electron路径支持
└── package.json               # 修改：新增electron依赖
```

### 平台检测机制

```typescript
// 通过window对象的特性检测Electron环境
const isElectron = !!window.require || !!window.electronAPI;
```

### IPC通信接口

```typescript
// 主进程 → 渲染进程
'terminal:output'     // 终端输出事件
'status:update'       // TShock状态更新
'config:saved'        // 配置保存完成

// 渲染进程 → 主进程
'terminal:start'      // 启动TShock
'terminal:stop'       // 停止TShock
'terminal:input'      // 发送命令
'config:read'         // 读取配置
'config:write'        // 写入配置
'config:setToken'     // 自动设置Token
```

### 依赖项

- **Electron**: ^28.0.0（桌面应用框架）
- **electron-builder**: ^24.0.0（打包工具）
- **electron-store**: ^8.0.0（配置存储）
- **tree-kill**: ^1.2.0（进程终止）
- **chokidar**: ^3.5.0（文件监控）

## 配置数据结构

### Electron Store配置

```typescript
interface ElectronConfig {
  tshock: {
    executablePath: string;    // TShock可执行文件路径
    configPath: string;       // config.json路径
    workingDir: string;       // 工作目录
  };
  app: {
    autoStartTShock: boolean; // 启动时自动启动TShock
    minimizeToTray: boolean; // 最小化到托盘
  };
}
```

### TShock配置扩展

在config.json中添加Token配置：

```json
{
  "RestApiEnabled": true,
  "RestApiPort": 7878,
  "Token": "auto-generated-token",
  "EnableTokenLoginAuthentication": true
}
```
