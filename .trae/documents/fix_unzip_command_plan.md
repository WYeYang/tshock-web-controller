
# 修复 unzip 命令路由计划

## 研究结论

项目有一套完整的指令系统，工作原理如下：

1. **前端通过 `SetupWizard.tsx` 发送 `unzip &lt;zip路径&gt; &lt;目标目录&gt;` 命令到终端
2. `electron/ipc/tshock.js` 中的 `sendToShell` 函数接收命令
3. `findMatchingScript` 函数在 `commands.js` 中查找匹配的脚本（如 `unzip.js`）
4. 如果找到匹配脚本，先显示命令，然后用 node 执行该脚本

## 需要确认的问题

让我检查为什么 `unzip` 命令没有正确找到 `unzip.js`。

## 修改文件

| 文件路径 | 修改内容 |
| --- | --- |
| `electron/ipc/tshock.js` | 保留现有功能，调试/修复脚本查找和执行 |

## 修改步骤

1. 保留现有 `sendToShell` 函数的完整结构不变
2. 添加调试日志，了解为什么没有找到匹配的脚本
3. 确保脚本查找和执行功能正常工作

## 重要原则

- **不要删除现有功能**
- 优先检查有没有对应的脚本，没有再用默认处理
- 保持现有的指令系统架构
