# 统一配置读写接口计划

## 问题分析

1. **主配置读取特殊化**：`electronBridge.config.read()` 不传文件名，与其他文件读取不一致
2. **write接口参数混淆**：使用 `filenameOrData` 一个参数兼作两个用途，设计不够清晰

## 需要修改的文件

1. `electron/ipc/config.js`
2. `electron/preload.cjs`
3. `src/services/electronBridge.ts`
4. `src/components/SetupWizard.tsx`（如果有调用）
5. `src/components/WizardConfigEditorModal.tsx`

## 具体修改步骤

### 1. electron/ipc/config.js

- `config:read` handler 强制要求 filename 参数，无默认值
- `config:write` handler 强制两个参数：filename 和 data，无默认值
- 简化，不要做参数兼容处理

### 2. electron/preload.cjs

- 更新 IPC 绑定，明确 read 接受 filename
- 更新 write 接受 filename 和 data 两个参数

### 3. src/services/electronBridge.ts

- 更新类型定义，read 接受 filename 参数（必填）
- write 接受 filename 和 data 两个参数（都必填）
- 移除 filenameOrData 设计

### 4. src/components/SetupWizard.tsx

- 更新所有 read 和 write 调用，统一显式传入 'config.json'

### 5. src/components/WizardConfigEditorModal.tsx

- 更新所有 read 和 write 调用，统一显式传入 filename

## 接口设计原则

- 所有读写都统一接口，不搞特殊
- 参数清晰，不要一个参数当两个用
- 显式传递文件名，无隐式默认值
