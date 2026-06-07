# 修复自定义命令解析问题

## 问题分析

当前 `sendToShell` 函数存在以下问题：

1. **两种调用模式不兼容**：
   - TerminalUI：逐个字符发送
   - SetupWizard：发送完整命令 + `\r\n`

2. **注册命令被 shell 重复执行**：
   - 当前逻辑：非换行字符立即 `shellProcess.write(data)` → 注册命令也被 shell 执行
   - 应该：注册命令只通过命令处理器执行，不写入 shell

3. **注册命令不显示在终端**：
   - 找到命令处理器时，只执行但不显示命令本身

4. **inputBuffer 未正确清空**：
   - 非注册命令分支中，没有清空 inputBuffer

## 修改计划

### 文件：`electron/ipc/tshock.js`

**目标**：
1. 支持两种调用模式（完整命令模式和逐字符模式）
2. 正确处理注册命令，避免被 shell 重复执行
3. 注册命令要显示在终端
4. 正确清空 inputBuffer

**修改内容**：
```javascript
let inputBuffer = '';

function sendToShell(data) {
  // 首先检查 data 是否是带换行的完整命令
  const hasNewline = data.includes('\r') || data.includes('\n');
  
  if (hasNewline) {
    // 完整命令模式：直接处理整个命令
    const command = data.trim();
    // ... 解析命令 ...
  } else {
    // 逐字符模式
    // ... 缓冲 ...
  }
}
```

**详细修改步骤**：
1. 检测是否是完整命令（包含 `\r` 或 `\n`）
2. 完整命令模式：直接处理整个命令字符串
3. 逐字符模式：缓冲字符，只显示不执行，直到换行
4. 对于注册命令：只通过处理器执行，同时要显示命令
5. 确保所有分支都正确清空 inputBuffer

## 需要修改的文件
- `electron/ipc/tshock.js`

