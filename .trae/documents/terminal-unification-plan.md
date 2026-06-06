# 终端统一计划：合并 CommandAssistantView 到 TerminalView

## 概述

将 CommandAssistantView（REST API 命令执行）和 TerminalView（IPC/pty 终端）合并为一个统一的终端视图。TerminalView 只处理 UI，数据流通过策略模式分两套实现：Electron 用 IPC，Web 用 REST API。同时删除 LLM 相关代码。

## 当前状态

- **TerminalView** → 引用 TerminalPanel → Electron IPC（pty）发送/接收命令，仅桌面端可用
- **CommandAssistantView** → REST API（useTShock）执行命令，Web + Desktop 都可用，聊天气泡 UI
- **LLM** → `llmApi.ts` + `useLLM.ts` + `types/llm.ts`，命令生成辅助，需删除
- **Sidebar** → 有 `command`（命令助手）和 `terminal`（终端）两个入口
- **Dashboard** → 根据 `currentView` 切换渲染不同视图
- **SetupWizard** → 引用了 TerminalPanel

## 改动

### 1. 新建 `src/hooks/useTerminalStream.ts` — 统一终端数据流接口

策略模式，提供统一接口：

```ts
interface TerminalStream {
  send: (command: string) => Promise<void>;
  onOutput: (callback: (data: TerminalOutput) => void) => () => void;
  sync?: () => Promise<void>;
  clear?: () => Promise<void>;
}
```

两个实现：
- **ElectronTerminalStream**：封装 `electronBridge.terminal.*`，send → `terminal.send`，onOutput → `terminal.onOutput`
- **RestTerminalStream**：封装 `useTShock().executeCommand`，send → REST API 执行，onOutput → 将 REST 响应转为 TerminalOutput 格式回调

Hook 根据 `isElectron` 自动选择实现。

### 2. 改造 `src/components/TerminalPanel.tsx` — 接受外部数据流

- 移除内部对 `electronBridge` 的直接依赖
- Props 新增 `stream: TerminalStream`，通过 stream 发送命令和接收输出
- 保留现有的 ANSI 渲染、输出显示、输入框、复制/清除按钮
- 保留 `showInput`/`showActions` props（SetupWizard 仍需要）

### 3. 改造 `src/components/TerminalView.tsx` — 统一入口

- 使用 `useTerminalStream()` 获取 stream
- 传给 TerminalPanel
- Web 环境不再显示"终端功能仅在桌面端可用"，而是正常渲染终端
- 删除服务器控制面板（启动/停止按钮、状态显示、侧边栏），TerminalView 只保留标题栏 + TerminalPanel
- 快捷命令从 CommandAssistantView 迁移过来，放在终端上方

### 4. 删除 `src/components/CommandAssistantView.tsx`

### 5. 删除 LLM 相关文件

- `src/services/llmApi.ts`
- `src/hooks/useLLM.ts`
- `src/types/llm.ts`

### 6. 清理 LLM 配置

- `src/types/config.ts`：删除 `LLMConfig` 接口，从 `AppConfig` 中移除 `llm` 字段
- `src/context/AppContext.tsx`：删除 `updateLLMConfig`
- `src/hooks/useConfig.ts`：删除 `updateLLMConfig` 引用
- `src/components/ConfigPanel.tsx`：删除 LLM API 配置区域（apiUrl/apiKey 输入框）

### 7. 更新 `src/components/Sidebar.tsx`

- 删除 `command` 菜单项（命令助手）
- 保留 `terminal` 菜单项，去掉 `desktopOnly` 限制（Web 也能用）
- `ViewType` 中删除 `'command'`

### 8. 更新 `src/components/Dashboard.tsx`

- 删除 CommandAssistantView 的 import 和渲染
- `currentView === 'command'` 的跳转逻辑改为 `terminal`
- 未配置时不再自动跳转到 command，改为 terminal

### 9. 更新 `src/components/SetupWizard.tsx`

- SetupWizard 中 TerminalPanel 的使用方式需要适配：传入 stream prop
- 创建 ElectronTerminalStream 实例传给 TerminalPanel

## 实现顺序

1. 新建 `useTerminalStream.ts`
2. 改造 `TerminalPanel.tsx`（接受 stream prop）
3. 改造 `TerminalView.tsx`（使用 useTerminalStream）
4. 更新 `SetupWizard.tsx`（适配 TerminalPanel 新接口）
5. 删除 CommandAssistantView
6. 删除 LLM 相关文件和配置
7. 更新 Sidebar、Dashboard、ConfigPanel
8. 清理 types/config.ts、AppContext、useConfig

## 验证

- Electron 桌面端：终端通过 IPC 发送命令，接收 pty 输出，ANSI 颜色正常
- Web 端：终端通过 REST API 执行命令，响应显示在输出区
- SetupWizard 中终端功能不受影响
- 侧边栏只剩一个"终端"入口，Web/Desktop 都可用
- LLM 相关代码完全清除，无残留引用
