# 步骤4：添加服主账号并完成设置

## Summary
将步骤4的"完成设置"按钮改为"添加服主账号并完成设置"。点击后通过终端命令添加用户、赋予权限，然后通过 REST API 获取 token 并保存配置。

## Current State
- 步骤4只有一个"✓ 完成设置"按钮
- `handleSetupComplete` 只是调用了旧的 `/auth` 命令（命令不对）然后 `onComplete()`
- 步骤3已有管理员用户名/密码输入框（`adminUsername`, `adminPassword`），但步骤3的输入框在 `step === 3 && !showConfigEditor` 时才显示
- `useTShock` hook 中有 `fetchAndSaveToken` 方法：调用 `TShockApi.getToken(username, password)` 获取 token，然后 `updateTshockConfig({ token, username, password })`
- `TShockApi.getToken` 通过 `/api/v2/token/create?username=...&password=...` 获取 token

## Proposed Changes

### File: `src/components/SetupWizard.tsx`

**1. 修改步骤4 UI**

将步骤3的管理员输入框移到步骤4，和"完成设置"按钮一起显示。步骤3不再显示管理员输入框。

步骤4 UI：
- 管理员用户名/密码输入框（必填）
- "添加服主账号并完成设置"按钮

**2. 修改 `handleSetupComplete` 逻辑**

```tsx
const handleSetupComplete = async () => {
  if (!adminUsername || !adminPassword) {
    setError('请输入服主账号和密码');
    return;
  }

  setSetupComplete(true);
  setLoading(true);

  try {
    // 1. 添加用户
    await electronBridge.terminal.send(`/user add ${adminUsername} ${adminPassword} owner`);
    // 等待命令执行
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. 给 owner 组添加 REST 权限
    await electronBridge.terminal.send(`/group addperm owner tshock.rest.*`);
    // 等待命令执行
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. 通过 REST API 获取 token（和配置面板生成 token 逻辑一样）
    const api = new TShockApi();
    const token = await api.getToken(adminUsername, adminPassword);

    // 4. 保存 url、用户名、密码和 token
    updateTshockConfig({
      serverUrl: 'http://localhost:7878',
      token: token,
      username: adminUsername,
      password: adminPassword
    });

    onComplete();
  } catch (err) {
    setError(err instanceof Error ? err.message : '添加服主账号失败');
    setSetupComplete(false);
  } finally {
    setLoading(false);
  }
};
```

**3. 删除步骤3的管理员输入框**

移除 `step === 3 && !showConfigEditor` 下的管理员输入框区域。

**4. 删除旧的 `handleCreateAdmin` 函数**

不再需要。

**5. 添加 TShockApi import**

```tsx
import { TShockApi } from '../services/tshockApi';
```
