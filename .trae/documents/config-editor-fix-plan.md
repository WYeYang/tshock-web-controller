# 配置编辑器修复计划

## 问题分析

1. **配置保存问题**：保存时没有正确合并现有配置，导致重复键和配置结构错误
2. **默认值不全**：需要支持完整的默认配置填充
3. **UI 不完整**：只显示固定的几个字段，不能编辑所有配置项
4. **组件复用**：WizardConfigEditorModal 和 ConfigEditor 有重复代码，需要可复用 UI

## 修改内容

### 1. 创建可复用的动态配置编辑器组件
- 创建 `ConfigForm.tsx`，支持动态渲染所有配置字段
- 自动识别字段类型（boolean/number/string/object/array）
- 支持嵌套对象编辑

### 2. 修改 WizardConfigEditorModal
- 复用 ConfigForm
- 正确合并默认配置与现有配置
- 保存时确保正确替换而不是重复键

### 3. 修改 ConfigEditor
- 复用 ConfigForm
- 同样修复配置保存逻辑

### 4. 默认配置
- 根据用户提供的示例，创建完整的默认配置对象
- 确保包含所有必要字段

## 文件清单

- 新建：`src/components/ConfigForm.tsx`
- 修改：`src/components/WizardConfigEditorModal.tsx`
- 修改：`src/components/ConfigEditor.tsx`

