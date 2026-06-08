# 修复设置向导和终端连接逻辑

## 问题分析

1. **SetupWizard 的跳过按钮行为**：目前点击"已有 TShock 服务器？跳过"会直接进入终端，但应该仅关闭向导，保持未配置状态，让用户看到帮助文档
2. **终端连接逻辑**：不应该简单根据是否是 Electron 环境选择终端，而应该根据配置状态来选择：
   - 如果是通过设置向导完成的内置服务器配置（isConfigured 为 true），使用 ElectronTerminalStream
   - 如果是用户自己配置的外部服务器（isConfigured 为 true），使用 RestTerminalStream
   - 如果未配置（isConfigured 为 false），不显示终端和服务器状态菜单

3. **isConfigured 的判断依据**：`!!(config.tshock.serverUrl && config.tshock.token)`，这个是正确的

## 更好的方案

### 1. 扩展配置类型 (src/types/config.ts)
- 添加 `useBuiltinServer` 字段，明确记录用户选择使用内置服务器还是外部服务器

### 2. 修改 SetupWizard 组件 (src/components/SetupWizard.tsx)
- 添加 `onSkip` 回调，点击跳过时仅关闭设置向导
- `onComplete` 回调保持原样，完成时设置 `useBuiltinServer: true`

### 3. 修改 Dashboard 组件 (src/components/Dashboard.tsx)
- 处理 `onSkip` 事件，仅关闭 SetupWizard
- 保持现有的配置状态判断逻辑不变

### 4. 修改 useTerminalStream Hook (src/hooks/useTerminalStream.ts)
- 改为接受配置作为参数
- 根据 `useBuiltinServer` 字段和是否是 Electron 环境来智能选择终端流

## 实现步骤

1. 修改 config.ts 添加新字段
2. 修改 defaultConfig 包含新字段的默认值
3. 修改 SetupWizard 组件，添加 onSkip 回调，完成时设置 useBuiltinServer
4. 修改 Dashboard 组件，处理 onSkip 事件
5. 修改 useTerminalStream 逻辑，根据配置智能选择终端流
6. 测试验证功能

## 文件列表

- src/types/config.ts
- src/utils/storage.ts
- src/components/SetupWizard.tsx
- src/components/Dashboard.tsx
- src/hooks/useTerminalStream.ts
