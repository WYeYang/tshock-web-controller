# TShock Web Controller

TShock Web Controller 是一个用于管理 TShock 服务器的 Web 前端界面。

## 在线演示

https://wyeyang.github.io/tshock-web-controller/

## 功能特性

- 服务器状态监控
- 用户和用户组管理
- 玩家信息查看
- 配置面板
- 命令助手
- 文档中心

## 开发构建流程

### 环境要求

- Node.js 20 或更高版本
- npm

### 安装依赖

```bash
npm ci
```

### 开发模式

启动开发服务器，支持热模块替换：

```bash
npm run dev
```

### 生产构建

构建生产版本：

```bash
npm run build
```

### 预览构建结果

预览生产构建结果：

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
1. `Build and Release Zip` - 构建并发布 zip 压缩包
2. `Deploy to GitHub Pages` - 部署到 GitHub Pages

## 项目结构

- `src/` - 源代码目录
  - `components/` - React 组件
  - `hooks/` - 自定义 hooks
  - `services/` - API 服务
  - `utils/` - 工具函数
- `server/` - 后端代理服务
- `docs/` - 文档
- `.github/workflows/` - GitHub Actions 工作流
