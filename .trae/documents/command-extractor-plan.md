
# 命令拦截系统重构计划

## 研究结论

当前的 `sendToShell` 函数中有硬编码的 `unzip` 命令拦截逻辑，需要把它抽取出来，做成一个通用的、可扩展的命令注册和拦截系统。

### 当前架构问题：
- 命令处理逻辑硬编码在 `tshock.js` 中
- 难以添加新命令
- 代码混杂，可读性差
- 没有统一的命令注册和调度机制

## 修改文件

| 文件路径 | 说明 |
| --- | --- |
| `electron/ipc/commands.js` | 创建通用命令系统，替换现有文件 |
| `electron/ipc/tshock.js` | 使用新的命令系统 |
| `electron/ipc/command-handlers/unzip.js` | 创建 unzip 命令处理器 |

## 修改步骤

### 1. 创建通用命令系统 (`commands.js`)
- 创建 `CommandRegistry` 类来管理命令处理器
- 创建 `CommandHandler` 基类或接口
- 提供 `registerCommand(name, handler)` 方法
- 提供 `findCommand(name)` 方法
- 保持向后兼容现有的 `findMatchingScript` 功能

### 2. 创建 unzip 命令处理器
- 新建 `command-handlers` 目录
- 在其中创建 `unzip.js`
- 实现 unzip 命令的处理逻辑
- 接收 `sendOutput`, `store`, `fs`, `path`, `AdmZip` 作为依赖

### 3. 修改 `tshock.js`
- 导入新的命令系统
- 初始化时注册 unzip 命令
- 修改 `sendToShell` 函数，使用新的命令系统
- 移除硬编码的 unzip 逻辑

## 功能设计

```javascript
// 命令处理器接口
interface CommandHandler {
  name: string;
  description?: string;
  execute(args: string[], context: CommandContext): Promise&lt;boolean&gt;;
}

interface CommandContext {
  sendOutput: (data: string) =&gt; void;
  store: any;
  fs: any;
  path: any;
  AdmZip?: any;
}
```

## 优势

- 新增命令只需创建新的 handler 文件并注册
- 代码结构清晰，职责分离
- 易于测试和维护
- 保持向后兼容性
