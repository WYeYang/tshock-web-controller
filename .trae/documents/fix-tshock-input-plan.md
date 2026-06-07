# TShock 输入问题修复计划

## 问题分析

1. **输入无反应** - 用户选择世界时输入 "4"，服务器没有响应
2. **不应该显示的信息** - "TShock server started successfully" 这条信息不应该显示（这是electron端自动发送的）
3. **服务器回显输入** - "4" 显示在日志中，可能造成混淆

## 修复方案

### 1. 移除不应该显示的信息

**文件：electron/ipc/tshock.js**

删除或注释掉第 237 行的 `sendOutput('info', 'TShock server started successfully')` 调用，这是electron端自动发送的信息，不是服务器实际输出的。

### 2. 修改输入发送方式

**文件：electron/ipc/tshock.js**

修改 `sendToShell` 函数，确保输入能正确传递给服务器进程。
- 确保 `shellProcess.stdin.write` 能正确执行
- 可能需要添加 `flush` 操作
- 或者修改为直接启动服务器而不是通过 shell，避免中间层干扰

### 3. 过滤命令类型的输出

**文件：src/components/SetupWizard.tsx**

修改 `onOutput` 监听器，不要显示 'command' 类型的输出（即用户发送的命令），只显示服务器真实输出。

### 4. 改进输入发送机制

考虑直接 spawn 服务器进程而不是通过 cmd.exe 中间层，这样更可靠。

## 修改文件

- electron/ipc/tshock.js
- src/components/SetupWizard.tsx

## 预期结果

- 用户输入后服务器能正常响应
- 日志只显示服务器真实输出
- 不显示 electron 发送的额外信息
