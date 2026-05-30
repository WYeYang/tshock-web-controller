
# Markdown 文档系统实现计划

## 仓库研究结论

经过分析，现有项目已具备以下基础：
- 已有 `docs/` 目录，包含多个 Markdown 文档文件
- 使用 Vite + React + TypeScript + Tailwind CSS 技术栈
- 已有的 `HelpDocView` 组件目前使用硬编码 HTML
- 已有完整的侧边栏和视图切换架构

## 需要修改/创建的文件

### 1. 新增文件
- `src/components/DocView.tsx` - 通用 Markdown 文档查看组件
- `src/components/DocSidebar.tsx` - 文档目录导航组件（可选）
- `src/utils/markdown.ts` - Markdown 解析工具函数
- `src/types/docs.ts` - 文档类型定义
- `docs/01-getting-started.md` - 入门指南
- `docs/02-commands.md` - 命令文档
- `docs/03-rest-api.md` - REST API 文档
- `docs/04-permissions.md` - 权限说明文档

### 2. 修改文件
- `package.json` - 添加 Markdown 解析依赖
- `src/components/Sidebar.tsx` - 添加文档菜单
- `src/types/tshock.ts` - 更新 ViewType 类型
- `src/components/Dashboard.tsx` - 更新路由逻辑
- `src/components/HelpDocView.tsx` - 重构为文档入口或删除

### 3. 可能需要的 Vite 配置
- `vite.config.ts` - 配置 Markdown 导入（如果需要）

## 实现步骤

### 步骤 1：安装依赖
- 安装 `react-markdown` 和相关插件
- 安装 `remark-gfm` 支持 GitHub Flavored Markdown
- 安装 `rehype-highlight` 支持代码高亮（可选）

### 步骤 2：文档结构组织
- 规范化 `docs/` 目录结构
- 整理现有文档文件
- 创建新的 Markdown 文档文件
- 添加文档元数据（标题、描述、排序等）

### 步骤 3：创建类型定义
- 定义文档元数据接口
- 定义文档列表类型
- 更新现有的 ViewType 类型

### 步骤 4：实现 Markdown 解析器
- 创建 Markdown 渲染组件
- 配置样式以匹配现有主题
- 支持代码高亮（可选）
- 处理内部链接和图片

### 步骤 5：更新侧边栏
- 在 Sidebar 中添加文档菜单
- 可能需要子菜单或嵌套导航结构
- 添加文档图标

### 步骤 6：更新路由和组件
- 更新 Dashboard 以支持文档视图
- 创建或重构文档视图组件
- 实现文档切换逻辑

### 步骤 7：测试和优化
- 测试各文档显示
- 优化响应式布局
- 检查性能

## 依赖考虑事项

### 核心依赖
- `react-markdown` - React Markdown 渲染组件
- `remark-gfm` - GitHub Flavored Markdown 支持
- `rehype-raw` - 支持原始 HTML（可选，谨慎使用）
- `rehype-highlight` - 代码高亮（可选）

### 可选依赖
- `@tailwindcss/typography` - 美观的 Markdown 样式预设
- `react-syntax-highlighter` - 更强大的代码高亮

## 风险处理

### 风险 1：Markdown 导入问题
- **解决方案**：使用 Vite 的 `?raw` 导入，或通过 fetch 加载

### 风险 2：性能问题
- **解决方案**：按需加载文档，使用懒加载或分割代码

### 风险 3：样式兼容性
- **解决方案**：使用自定义 CSS 类，确保与现有主题一致

### 风险 4：安全性
- **解决方案**：使用 `rehype-sanitize` 清理内容（如果需要），避免直接使用 `rehype-raw`

## 技术架构建议

### 文档数据结构
```typescript
interface DocMeta {
  id: string;
  title: string;
  description?: string;
  category?: string;
  order?: number;
  icon?: string;
}

interface DocEntry {
  meta: DocMeta;
  content: string;
}
```

### 目录结构
```
docs/
├── 01-getting-started.md
├── 02-commands.md
├── 03-rest-api.md
├── 04-permissions.md
└── index.ts (导出所有文档)
```

### 组件架构
- `DocView` - 主文档查看器
- `DocList` - 文档列表/导航
- `MarkdownRenderer` - 通用 Markdown 渲染器

### 样式方案
- 使用 Tailwind 现有的暗色主题
- 添加 `.prose` 类相关样式（或自定义）
- 保持与现有 UI 风格一致
