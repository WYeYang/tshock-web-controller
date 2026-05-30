# 恢复帮助文档并添加独立文档中心入口

## 需求分析

用户反馈：
- 原来有完整的 `HelpDocView` 组件（包含配置指南、故障排查等详细帮助信息）
- 但我之前把它替换成了新的文档系统
- 用户希望保留原有的帮助文档
- 同时在侧边栏添加一个新的"文档中心"菜单入口

## 现有文件状态

### 已创建的新文件（保留）
- `src/components/DocView.tsx` - 新的文档中心组件（Markdown渲染）
- `src/components/MarkdownRenderer.tsx` - Markdown渲染器
- `src/utils/docsLoader.ts` - 文档加载工具
- `src/types/docs.ts` - 文档类型定义
- `docs/01-getting-started.md` - 入门指南文档

### 已修改的文件（需要恢复）
- `src/components/Sidebar.tsx` - 需要同时保留两个菜单项
- `src/components/Dashboard.tsx` - 需要同时支持两个视图
- `src/components/HelpDocView.tsx` - 需要恢复原来的内容

### 现有文档（保留）
- `docs/github_tshock_wiki_rest_endpoints.md` - REST API文档
- `docs/github_tshock_wiki_permissions.md` - 权限说明
- `docs/tshock-rest-api.md` - 其他API文档

## 实现步骤

### 1. 恢复 HelpDocView.tsx

恢复原有的帮助文档内容：
- 首次使用配置指南（保留）
- REST API 配置说明（保留）
- 删除无效的链接（GitHub Wiki中文链接）
- 故障排查部分（保留）
- 添加指向新文档中心的链接

### 2. 更新 Sidebar.tsx

将侧边栏菜单改为包含两个独立的帮助入口：
- **帮助文档** (`help`) - 原来的快速帮助和故障排查
- **文档中心** (`docs`) - 新的完整 Markdown 文档系统

菜单结构：
```
- 命令助手
- 服务器状态  
- 帮助文档 ← 恢复原来的
- 文档中心 ← 新增的完整文档
- 配置面板
```

### 3. 更新 Dashboard.tsx

支持两种视图：
- 当用户点击"帮助文档"时，显示恢复后的 `HelpDocView`
- 当用户点击"文档中心"时，显示新的 `DocView`

路由逻辑：
```typescript
case 'help':
  return <HelpDocView onGoToConfig={() => setCurrentView('config')} />;
case 'docs':
  return <DocView onGoToConfig={() => setCurrentView('config')} />;
```

### 4. 更新 HelpDocView.tsx

在帮助文档中添加链接指向新的文档中心：
- 在"TShock 中文指令文档"部分
- 或者在"故障排查"部分
- 引导用户访问文档中心获取更完整的信息

### 5. 修复无效链接

将 `HelpDocView.tsx` 中的无效 GitHub Wiki 链接移除或替换为指向新的文档中心

## 预期效果

侧边栏将包含：
1. **命令助手** - 快速发送命令
2. **服务器状态** - 查看服务器状态和玩家列表
3. **帮助文档** - 快速入门指南和故障排查（保留原有的）
4. **文档中心** - 完整的 Markdown 文档系统（新增的）
5. **配置面板** - 服务器配置

用户可以根据需要选择：
- 需要快速帮助 → 使用"帮助文档"
- 需要详细文档 → 使用"文档中心"

## 注意事项

- 保持两个入口的独立性和互补性
- 帮助文档保持简洁和实用
- 文档中心提供更详细和结构化的内容
- 两个入口都可以引导用户到配置面板
