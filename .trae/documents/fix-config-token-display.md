# 修复配置文件：删除所有根级配置字段

## 用户明确要求

**"配置根级的都是不对的删掉"** - 所有位于配置根级（不是 Settings 节点内）的字段都是错误的，需要删除。

## 根本原因

### 错误的根级字段注入
在 [`electron/ipc/config.js`](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/electron/ipc/config.js#L104-L129) 的 `setToken` 函数中：
```javascript
config.Token = token;                              // 根级错误字段
config.EnableTokenLoginAuthentication = true;       // 根级错误字段
config.RestApiEnabled = true;                       // 根级错误字段（应该放在 Settings）
```

这些字段被错误地注入到了配置的**根级**，而不是 `Settings` 节点下。

### 加载时未过滤根级字段
[`src/components/WizardConfigEditorModal.tsx`](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/src/components/WizardConfigEditorModal.tsx#L37-L98) 使用 `...loadedConfig` 展开，没有过滤根级错误字段。

### TShock config.json 真实结构
根据 TShock 官方配置规范，所有配置项都应该在 `Settings` 节点下，不应该有根级配置。

## 修复方案（彻底删除所有根级配置）

### 1. 后端：修复 setToken，不再向根级注入任何字段
**文件**: [`electron/ipc/config.js`](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/electron/ipc/config.js)

修改 `setToken` 函数：
- **删除** `config.Token = token`
- **删除** `config.EnableTokenLoginAuthentication = true`
- **删除** `config.RestApiEnabled = true`（在根级）
- Token 通过应用层（`useConfig` hook）管理，不写入 TShock config.json
- 只在确实需要时才修改 `Settings` 节点下的字段

### 2. 前端加载时：完全过滤根级字段
**文件**: [`src/components/WizardConfigEditorModal.tsx`](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/src/components/WizardConfigEditorModal.tsx)

修改 `loadConfig` 函数：
- 读取配置后，**只保留 `Settings` 节点**作为根级对象
- 丢弃所有根级字段（`Token`, `EnableTokenLoginAuthentication`, `RestApiEnabled` 等）
- 保留 `Settings` 下的所有子项

```javascript
// 核心逻辑
const mergedConfig = {
  Settings: {
    ...DEFAULT_SETTINGS,
    ...(loadedConfig.Settings || {})
  }
};
```

### 3. ConfigForm 渲染时：跳过根级非 Settings 字段
**文件**: [`src/components/ConfigForm.tsx`](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/src/components/ConfigForm.tsx#L249-L283)

修改 `renderConfigFields`：
- 遍历顶级字段时，**只渲染 `Settings` 节点**
- 跳过所有其他根级字段
- 即使有遗留的根级数据也不会显示

### 4. ConfigEditor (旧版本) 同步修复
**文件**: [`src/components/ConfigEditor.tsx`](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/src/components/ConfigEditor.tsx)

- 从 `CONFIG_FIELDS` 中删除 `Token` 和 `EnableTokenLoginAuthentication`
- 从 `TShockConfig` 接口中删除这两个字段
- 删除 Token 相关的所有 UI 代码（`handleGenerateToken`、`newToken`、`showToken`）
- 简化界面

## 实施步骤

### 步骤 1: 修复 setToken 后端逻辑
- 文件: [`electron/ipc/config.js`](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/electron/ipc/config.js#L104-L129)
- 删除根级字段注入代码
- Token 完全由 `useConfig` hook 管理

### 步骤 2: 修复 WizardConfigEditorModal 加载逻辑
- 文件: [`src/components/WizardConfigEditorModal.tsx`](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/src/components/WizardConfigEditorModal.tsx#L37-L98)
- 完全过滤根级字段
- 只保留 `Settings` 节点

### 步骤 3: 修复 ConfigForm 渲染逻辑
- 文件: [`src/components/ConfigForm.tsx`](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/src/components/ConfigForm.tsx#L249-L283)
- 只渲染 `Settings` 节点
- 跳过所有根级字段

### 步骤 4: 修复 ConfigEditor 旧版本
- 文件: [`src/components/ConfigEditor.tsx`](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/src/components/ConfigEditor.tsx)
- 删除 Token 相关字段和 UI

### 步骤 5: 构建测试
- 运行 `npm run build` 确保编译通过

## 预期效果

修复后：
1. **第一次进入**：生成 config，编辑后保存 - 不再有根级字段
2. **第二次进入**：读取 config - 只显示 `Settings` 节点下的内容
3. **遗留的旧 config 文件**：加载时自动过滤根级错误字段
4. **Token 管理**：完全由应用层 `useConfig` hook 管理，不污染 TShock config.json

## 涉及文件

1. [`electron/ipc/config.js`](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/electron/ipc/config.js) - 后端配置 IPC
2. [`src/components/WizardConfigEditorModal.tsx`](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/src/components/WizardConfigEditorModal.tsx) - 引导编辑器
3. [`src/components/ConfigForm.tsx`](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/src/components/ConfigForm.tsx) - 通用配置表单
4. [`src/components/ConfigEditor.tsx`](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/src/components/ConfigEditor.tsx) - 旧版本编辑器
