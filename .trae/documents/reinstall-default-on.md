# 内置版本重新安装开关逻辑调整

## Summary
调整"使用内置版本"的重新安装开关：默认打开，关闭时走和"使用上次路径"一样的逻辑（跳过解压，直接检测配置并启动）。

## Current State
- `reinstall` 默认 `false`
- `reinstall=true`：正常解压（删除旧文件再解压）
- `reinstall=false`：发送 `unzip ... --skip-existing`（仍然走解压流程，只是目录非空时跳过）
- `handleSelectDirectory(savedPath!)`：直接保存路径 + 调用 `handleAutoRunInstaller()`（检测配置、执行 Installer、打开配置编辑器）

## Proposed Changes

### File: `src/components/SetupWizard.tsx`

**1. `reinstall` 默认值改为 `true`（第36行）**
```tsx
// before
const [reinstall, setReinstall] = useState(false);
// after
const [reinstall, setReinstall] = useState(true);
```

**2. 修改 `handleUseBuiltinTshock` 函数（第260-287行）**

reinstall=false 时，不走 unzip，改为和 `handleSelectDirectory(savedPath!)` 一样的逻辑：
- 获取内置版本的目标路径
- 保存路径到 savedPath
- 调用 `handleAutoRunInstaller()`

```tsx
const handleUseBuiltinTshock = async () => {
  if (!isElectronAvailable()) return;

  setLoading(true);
  try {
    const paths = await electronBridge.config.getExtractPaths();
    console.log('[SetupWizard] 获取到的路径:', paths);

    // 保存路径到 savedPath
    localStorage.setItem('tshock_last_path', paths.targetDir);
    setSavedPath(paths.targetDir);

    if (reinstall) {
      // 重新安装：正常解压（删除旧文件再解压）
      const command = `unzip "${paths.zipPath}" "${paths.targetDir}"`;
      console.log('[SetupWizard] 发送的命令:', command);
      await electronBridge.terminal.send(command);
    } else {
      // 不重新安装：跳过解压，直接走和"使用上次路径"一样的逻辑
      await handleAutoRunInstaller();
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : '解压 TShock 失败');
    setLoading(false);
  }
};
```

## Verification
- 选择"使用内置版本" + 重新安装打开 → 应该执行 unzip 解压
- 选择"使用内置版本" + 重新安装关闭 → 应该跳过解压，直接检测配置并启动（和"使用上次路径"行为一致）
- 重新安装开关默认为打开状态
