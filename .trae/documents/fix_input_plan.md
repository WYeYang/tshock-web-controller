# 修复TShock输入无响应问题

## 问题分析

1. **选项检测问题**：`detectOptions` 函数只检测带方括号的格式（如 `[4]`），但TShock显示的世界列表是纯数字格式（1、2、3、4）
2. **shell中间层可能有问题**：通过cmd shell来运行TShock可能导致输入/输出处理有问题

## 修改计划

### 1. 修改 `src/components/SetupWizard.tsx`
- 更新 `detectOptions` 函数，使其能够检测不带方括号的数字选项
- 添加对世界选择提示的专门检测

### 2. 修改 `electron/ipc/tshock.js`
- 移除cmd shell中间层，直接启动TShock进程
- 直接与TShock进程的stdin/stdout/stderr交互
- 确保正确处理换行符和缓冲

## 实施步骤

1. 更新 `detectOptions` 函数以支持纯数字选项
2. 修改 `tshock.js` 移除shell中间层，直接spawn TShock进程
3. 测试输入功能是否正常工作

## 预期结果

- 输入"4"等数字能够正确被TShock接收
- 所有交互提示都能正常工作
