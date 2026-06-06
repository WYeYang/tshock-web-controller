# 修复主页面终端乱码和历史同步问题

## Summary
修复 TerminalView 组件两个问题：1) ANSI 转义序列显示为乱码；2) 页面切换后之前的输出没有同步过来。

## 问题分析

### 问题1：ANSI 乱码
`TerminalView` 用纯文本渲染 `output.data`（第344-356行），`node-pty` 输出包含 ANSI 颜色码（如 `[38;5;15m`、`[m`），直接显示为乱码。

### 问题2：历史输出没同步
`TerminalView` 只在 `onOutput` 回调中累加输出，没有调用 `sync()` 同步历史 buffer。页面切换后重新挂载时，之前的输出丢失。

## Proposed Changes

### File: `src/components/TerminalView.tsx`

**1. 添加 ANSI 转义序列剥离函数**

在渲染前剥离 ANSI 转义码，避免乱码：

```tsx
const stripAnsi = (str: string): string => {
  return str.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
};
```

在渲染 output.data 时使用：
```tsx
{stripAnsi(output.data)}
```

**2. 组件挂载时同步历史输出**

在 useEffect 中，注册 onOutput 监听器后调用 sync：

```tsx
// 同步历史输出
electronBridge.terminal.sync();
```

但 sync 会重放整个 outputBuffer，onOutput 监听器会收到重复数据。需要避免重复：
- 方案：先注册监听器，再 sync，sync 重放的数据会通过 onOutput 到达，不需要额外处理
- 但如果组件重新挂载，outputs 状态是空的，sync 重放的数据正好填充进去

**3. 处理 sync 重放时的去重**

sync 重放时，onOutput 会收到历史数据。由于组件重新挂载时 outputs 为空数组，直接累加即可，不需要去重。但需要注意：如果用户在同一页面停留期间多次调用 sync，会导致重复。

解决方案：只在组件首次挂载时 sync 一次。

```tsx
useEffect(() => {
  if (!isElectron) return;

  const unsubscribeOutput = electronBridge.terminal.onOutput((data) => {
    setOutputs(prev => [...prev, data]);
  });

  // 首次挂载时同步历史输出
  electronBridge.terminal.sync();

  // ...其他监听器...
}, [isElectron]);
```
