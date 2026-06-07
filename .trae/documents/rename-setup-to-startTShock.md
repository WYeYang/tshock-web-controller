# 计划：将 terminal.setup() 重命名为 startTShock 并支持 worldPath 参数

## 概要
将 `terminal.setup()` 重命名为 `terminal.startTShock()`，并支持 `worldPath` 参数，用于在启动 TShock 服务器时附加 `-world` 参数。

## 当前状态分析

当前 `terminal.setup()` 在后端实际执行的是 `setupTshock()` 函数（运行 TShock.Installer.exe 生成配置），而 `startTshock()` 函数（启动服务器）已存在但没有 IPC handler。

前端 `handleConfigConfirm` 中错误地使用了 `terminal.send('start -world ...')` 发送原始命令，导致 Windows 把 `start` 当作系统命令解析。

## 修改计划

### 1. 后端 `electron/ipc/tshock.js`

- **`startTshock(worldPath)`**：已有函数，添加 `worldPath` 参数，在构建命令时追加 `-world` 参数
  ```js
  function startTshock(worldPath) {
    // ... 现有逻辑 ...
    command += ` -config "${getConfigPath()}"`;
    command += ' -port 7777 -maxplayers 8';
    if (worldPath && fs.existsSync(worldPath)) {
      command += ` -world "${worldPath}"`;
    }
    // ...
  }
  ```

- **IPC handler**：将 `terminal:setup` 改为 `terminal:start-tshock`，调用 `startTshock(worldPath)`
  ```js
  ipcMain.handle('terminal:start-tshock', async (event, worldPath) => {
    try {
      return await startTshock(worldPath);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  ```

- 保留 `setupTshock()` 函数和 `terminal:setup` IPC handler 不变（`handleAutoRunInstaller` 中仍在使用它来生成配置）

### 2. Preload `electron/preload.cjs`

- 添加 `startTShock` 方法：
  ```js
  startTShock: (worldPath) => ipcRenderer.invoke('terminal:start-tshock', worldPath),
  ```
- 保留 `setup` 不变

### 3. 前端 Bridge `src/services/electronBridge.ts`

- 类型声明添加 `startTShock`
- 实现添加 `startTShock` 方法
- 保留 `setup` 不变

### 4. 前端 `src/components/SetupWizard.tsx`

- `handleConfigConfirm` 中：将 `terminal.send(startCmd)` 改为 `electronBridge.terminal.startTShock(worldPath || undefined)`
- 删除之前错误的 `start -world` 命令构建逻辑

## 验证步骤

1. TypeScript 编译无错误
2. 步骤1选择世界文件后，确认配置，服务器启动命令包含 `-world` 参数
3. 不选世界文件时，启动命令正常不含 `-world`
