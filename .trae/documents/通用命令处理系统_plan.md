# 通用命令处理系统计划

## 1. 需求分析

- 将 IPC 处理改成通用化，不再硬编码特定命令
- 终端输入命令后，先检查 `scripts/` 目录下是否有对应的 `.js` 文件
- 有脚本则用 Node 执行（隐藏 `node` 和 `.js` 后缀）
- 没有脚本则走默认处理（直接发送到 shell）
- 重命名 `extract-tshock.js` 为更通用的名称（如 `extract-tshock.js` 保持不变）

## 2. 实现步骤

### 2.1 创建通用命令处理器模块
**文件**: `electron/ipc/commands.js`
- 负责扫描 scripts 目录，查找匹配的脚本
- 提供统一的执行接口
- 处理脚本路径查找和执行

### 2.2 修改 tshock.js
**文件**: `electron/ipc/tshock.js`
- 修改 `sendToShell` 和 `sendRawToShell` 函数
- 添加拦截逻辑：先检查是否匹配到 scripts 中的命令
- 匹配成功则用 Node 执行，否则走默认处理

### 2.3 修改 preload.cjs
**文件**: `electron/preload.cjs`
- 保持现有 API 不变

### 2.4 修改 electronBridge.ts
**文件**: `src/services/electronBridge.ts`
- 保持现有 API 不变

### 2.5 修改 SetupWizard.tsx
**文件**: `src/components/SetupWizard.tsx`
- 简化解压流程：直接发送简单命令（如 `extract-tshock`）
- 终端会自动匹配到对应的脚本

### 2.6 配置打包
- 确保 scripts 目录已在 package.json 中正确配置（已配置）

## 3. 文件变更清单

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `electron/ipc/commands.js` | 新建 | 通用命令处理器模块 |
| `electron/ipc/tshock.js` | 修改 | 添加通用命令拦截逻辑 |
| `src/components/SetupWizard.tsx` | 修改 | 简化解压命令调用（发送 `unzip` 命令） |
| `scripts/unzip.js` | 重命名 | 将 `extract-tshock.js` 重命名为 `unzip.js` |
| `scripts/extract-tshock.js` | 删除 | 重命名后删除原文件 |

## 4. 实现细节

### 4.1 命令匹配规则
1. 从终端输入获取命令（去掉前后空格）
2. **简单直接匹配**：
   - 脚本文件名：单个单词（如 `unzip.js`）
   - 用户输入：单个单词（如 `unzip`）
   - 精确匹配：`<输入命令>.js`
3. 如果找到匹配的脚本：
   - 用 Node 执行脚本：`node scripts/<脚本文件名>.js`
   - 但在终端只显示用户输入的命令（隐藏 `node` 和 `.js`）
4. 如果没找到：直接发送到 shell 执行

### 4.2 命令示例
- 用户输入：`unzip` → 匹配 `unzip.js`
- 用户输入：`fetch-items` → 匹配 `fetch-items.js`（保留连字符作为一个单词）
- 用户输入：`fetchitems` → 匹配 `fetchitems.js`

### 4.3 脚本重命名
- 将 `extract-tshock.js` 重命名为 `unzip.js`

### 4.3 脚本路径查找
- 开发环境：`process.cwd()/scripts/`
- 打包环境：`process.resourcesPath/app/scripts/`

### 4.4 SetupWizard 修改
- 原来的复杂逻辑简化为发送 `unzip` 命令
- 终端自动匹配并执行
- 保留解压完成的检测逻辑

## 5. 风险和注意事项

- 保持现有的终端行为不变，只增加通用命令处理
- 确保向后兼容
- 处理 Windows 和 Linux 路径的差异
