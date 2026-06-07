# 合并工作流和创建下载页面计划

## 需求概述

1. 合并 `build-release.yml` 和 `deploy-pages.yml` 为一个工作流
2. 将构建的 zip 文件同步部署到 GitHub Pages
3. 创建一个下载页面，包含功能说明、使用说明和安装步骤
4. 更新 README，添加下载页面链接

## 项目现状分析

### 现有工作流

- **build-release.yml**: 构建 Electron 应用并发布到 GitHub Releases
- **deploy-pages.yml**: 构建 Web 版并部署到 GitHub Pages

两个工作流都在推送到 `v*` tag 时触发

### 现有代码结构

- React + TypeScript + Vite 项目
- Electron 桌面应用支持
- GitHub Pages 部署配置已存在

## 实施步骤

### 1. 创建新的下载页面组件

**文件**: `src/components/DownloadPage.tsx`

功能：
- 显示项目 logo 和标题
- 显示最新版本号（从 package.json 读取）
- 提供下载按钮（链接到 GitHub Pages 的 zip 文件）
- 显示功能特性列表
- 显示安装/使用步骤说明
- 提供回到在线演示的链接

### 2. 修改主应用路由

**文件**: `src/App.tsx`

修改：
- 添加简单的路由逻辑
- 根据 URL 路径显示不同页面：
  - `/` - 显示原 Dashboard（服务器管理界面）
  - `/download` - 显示新的 DownloadPage

### 3. 合并工作流

**文件**: `.github/workflows/release.yml` (新建)

合并两个工作流的功能：
1. 构建 Electron 应用（Windows）
2. 构建 Web 应用
3. 将 zip 文件复制到 `dist/download/` 目录
4. 上传到 GitHub Pages
5. 同时发布到 GitHub Releases（保留作为备份）

删除旧的两个工作流文件。

### 4. 更新 README

**文件**: `README.md`

修改：
- 更新下载链接，指向 `/download` 页面
- 更新工作流 badge（只有一个 badge）
- 保持其他内容不变

### 5. 更新 vite.config.ts

**文件**: `vite.config.ts`

修改：
- 添加 GitHub Pages base 配置（如果需要）

## 技术细节

### 工作流流程

```
Push v* tag
  ├─ build-electron-win (Windows runner)
  │  └─ 构建 zip 文件
  │  └─ 上传 artifact
  ├─ build-web (Ubuntu runner)
  │  └─ 下载 Electron 构建的 artifact
  │  └─ 复制 zip 文件到 dist/download/
  │  └─ 构建 Web 应用
  │  └─ 上传到 GitHub Pages artifact
  ├─ deploy-pages (Ubuntu runner)
  │  └─ 部署到 GitHub Pages
  └─ release (Ubuntu runner)
     └─ 发布到 GitHub Releases
```

### 下载页面内容

1. **标题区域**
   - 项目 logo
   - 项目名称
   - 版本号
   - 简短描述

2. **下载区域**
   - Windows 下载按钮
   - 文件大小提示
   - 链接到 Releases 作为备选

3. **功能特性**
   - 图标 + 功能描述列表

4. **安装使用说明**
   - Windows 安装步骤
   - Web 版使用说明

5. **链接区域**
   - 回到在线演示
   - GitHub 仓库

## 文件变更清单

### 新增文件
- `src/components/DownloadPage.tsx` - 下载页面组件
- `.github/workflows/release.yml` - 合并后的新工作流

### 修改文件
- `src/App.tsx` - 添加路由逻辑
- `README.md` - 更新链接和 badge
- `vite.config.ts` - 可能需要配置 base 路径

### 删除文件
- `.github/workflows/build-release.yml`
- `.github/workflows/deploy-pages.yml`

## 注意事项

1. GitHub Pages 部署需要保留原有的权限配置
2. Electron 构建需要使用 Windows runner，Web 构建使用 Ubuntu runner
3. 需要确保构建产物正确传递（通过 artifacts）
4. 下载页面的 zip 文件路径要与构建输出一致
5. README 中的 badge 要更新为新的工作流名称
