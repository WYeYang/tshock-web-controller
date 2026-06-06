# 步骤一添加"跳过配置确认"开关

## Summary
在步骤一添加开关，打开后跳过配置编辑弹窗，等于自动点击弹窗的确认按钮。首次默认关闭，确认一次配置后自动打开，更换 TShock 路径后重置为关闭。状态持久化到 localStorage。

## Proposed Changes

### File: `src/components/SetupWizard.tsx`

**1. 添加 `skipConfig` 状态，从 localStorage 读取初始值**

```tsx
const [skipConfig, setSkipConfig] = useState(() => localStorage.getItem('tshock_skip_config') === 'true');
```

**2. 步骤一 UI 添加"跳过配置确认"toggle**

放在世界文件选择区域和确认按钮之间，与"重新安装"toggle 风格一致。切换时同步写入 localStorage。

**3. 修改 `handleAutoRunInstaller` 第252行**

只改 `setShowConfigEditor(true)` 这一行，skipConfig 时读取配置并调用 `handleConfigConfirm`（等于自动点击了弹窗确认）：

```tsx
// 原来
setShowConfigEditor(true);
// 改为
if (skipConfig) {
  const config = await electronBridge.config.read('config.json');
  await handleConfigConfirm(config);
} else {
  setShowConfigEditor(true);
}
```

**4. `handleConfigConfirm` 确认配置后，自动打开 skipConfig 并持久化**

```tsx
setSkipConfig(true);
localStorage.setItem('tshock_skip_config', 'true');
```

**5. 更换 TShock 路径时重置 skipConfig 并持久化**

- "选择已有的版本"按钮选择新路径后：`setSkipConfig(false); localStorage.setItem('tshock_skip_config', 'false');`
- `handleSelectDirectory` 中保存路径后：`setSkipConfig(false); localStorage.setItem('tshock_skip_config', 'false');`
