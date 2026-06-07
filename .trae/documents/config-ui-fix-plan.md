# 配置编辑器修复优化计划

## 问题分析

1. 配置结构问题：Token 字段不是 TShock 原生配置，需要移除，改回登录获取
2. UI 优化：字体、边框等需要调小，提升可读性
3. 恢复 SetupWizard 配置逻辑：移除 Token 生成，保持原流程

## 修改内容

### 1. 修改 WizardConfigEditorModal
- 移除 Token 字段和相关逻辑
- 恢复正确的默认配置（不含 Token）
- 简化配置流程

### 2. 优化 ConfigForm UI
- 缩小字体尺寸
- 缩小内边距和边框
- 优化整体布局，更紧凑美观
- 保持良好的可读性

### 3. 修改 SetupWizard
- 恢复原来的配置逻辑，不需要弹出配置窗口
- 或者简化配置流程

## 文件清单

- 修改: `src/components/WizardConfigEditorModal.tsx`
- 修改: `src/components/ConfigForm.tsx`
- 修改: `src/components/SetupWizard.tsx` (可能需要简化流程)
