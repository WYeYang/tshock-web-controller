# TShock Web Controller

![Build and Release](https://github.com/WYeYang/tshock-web-controller/actions/workflows/release.yml/badge.svg)

TShock Web Controller 是一个用于管理 TShock 服务器的 Web 前端界面，同时支持以桌面应用程序运行。

## 在线演示

https://wyeyang.github.io/tshock-web-controller/

## 下载

- [下载页面](https://wyeyang.github.io/tshock-web-controller/download)
- [GitHub Releases](https://github.com/WYeYang/tshock-web-controller/releases/latest)

## 快速开始

### 桌面版（推荐）

1. 前往 [最新版本下载](https://github.com/WYeYang/tshock-web-controller/releases/latest)
2. 下载对应系统的压缩包（Windows 下载 `.zip` 文件）
3. 解压到任意目录
4. 运行 `TShock Controller.exe`（Windows）或对应可执行文件
5. 首次启动会自动进入设置向导，按照提示配置即可

### Web 版

1. 访问 [在线演示](https://wyeyang.github.io/tshock-web-controller/)
2. 在配置页面输入 TShock 服务器地址和 Token
3. 开始使用

## 功能特性

- 服务器状态监控
- 用户和用户组管理
- 玩家信息查看
- 配置面板
- 终端面板
- 设置向导
- 文档中心
- 内置 TShock 服务器（桌面版）

## 开发构建流程

### 环境要求

- Node.js 20 或更高版本
- npm

### 安装依赖

```bash
npm ci
```

### 开发模式 - Web 版

启动开发服务器，支持热模块替换：

```bash
npm run dev
```

### 开发模式 - Electron 桌面版

启动 Electron 开发环境：

```bash
npm run electron:dev
```

### 生产构建 - Web 版

构建生产版本：

```bash
npm run build
```

### 生产构建 - Electron 桌面版

为不同平台构建桌面应用：

```bash
# Windows (Zip)
npm run electron:build:win:zip

# Windows (完整构建)
npm run electron:build:win

# macOS
npm run electron:build:mac

# Linux
npm run electron:build:linux
```

### 预览构建结果

预览生产构建结果（Web 版）：

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 发布流程

### 打标签发布

项目使用 GitHub Actions 自动构建和发布，当推送以 `v` 开头的标签时会自动触发：

```bash
git tag v1.0.0
git push origin v1.0.0
```

这将同时触发两个工作流：
1. `Build and Release Electron App` - 构建并发布 Electron 桌面应用
2. `Deploy to GitHub Pages` - 部署 Web 版到 GitHub Pages

## 项目结构

- `src/` - 源代码目录
  - `components/` - React 组件
  - `hooks/` - 自定义 hooks
  - `services/` - API 服务
  - `utils/` - 工具函数
- `electron/` - Electron 主进程代码
- `resources/` - 资源文件
- `scripts/` - 工具脚本
- `docs/` - 文档
- `.github/workflows/` - GitHub Actions 工作流
