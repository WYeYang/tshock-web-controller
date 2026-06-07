# 直接启动TShock进程

## 问题分析

通过cmd shell中间层启动TShock导致输入不能正确传递。我们需要直接spawn TShock进程。

## 修改计划

### 修改 `electron/ipc/tshock.js`

1. **移除cmd shell中间层**：直接启动TShock.exe
2. **简化流程**：
   - `startTshock` 直接spawn TShock进程，不通过shell
   - `setupTshock` 直接spawn TShock.Installer.exe
   - `sendToShell` 直接向TShock进程的stdin写入
3. **保留正确的换行符处理**：Windows使用`\r\n`

## 实施步骤

1. 重写 `tshock.js`，移除cmd shell中间层
2. 直接spawn TShock进程
3. 测试输入功能

## 预期结果

- 手动输入"4"等命令能正常被TShock接收
- 所有交互正常工作
