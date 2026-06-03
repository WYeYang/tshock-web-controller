# 使用成熟终端框架 node-pty + xterm.js

## 问题分析
当前通过简单的child_process和自定义UI实现终端，存在输入/输出处理问题。

## 解决方案
使用Electron中最成熟的终端组合：
- **node-pty** - 后端，创建伪终端，处理进程交互
- **xterm.js** - 前端，专业的终端UI组件

## 修改计划

### 1. 安装依赖
```bash
npm install node-pty xterm @xterm/addon-fit
```

### 2. 修改后端 [electron/ipc/tshock.js]
- 使用node-pty创建伪终端
- 处理终端数据事件
- 暴露IPC方法控制终端

### 3. 修改前端 [src/components/SetupWizard.tsx]
- 集成xterm.js组件
- 连接后端终端数据
- 提供专业的终端UI体验

## 优势
- 输入/输出处理更可靠
- 支持完整终端功能
- 专业的终端UI体验
- VS Code同款方案
