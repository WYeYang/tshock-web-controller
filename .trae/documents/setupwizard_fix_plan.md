# SetupWizard 修复计划

## 问题分析

1. **问题一：SetupWizard 终端输出没有自动滚动**
   - 当前 SetupWizard 组件中的日志输出区域没有自动滚动到底部的功能
   - 而 TerminalView 组件已经实现了这个功能

2. **问题二：配置生成后需要可视化编辑确认**
   - 当前流程是：选择路径 → 生成配置 → 自动配置 REST API → 启动服务器
   - 用户希望在生成配置后，先弹出一个可视化编辑窗口，确认配置后再进行下一步

## 修改内容

### 1. 修复 SetupWizard 自动滚动

- 在 `src/components/SetupWizard.tsx` 中：
  - 添加 `useRef` 引用日志容器
  - 添加 `scrollToBottom` 函数
  - 在 `logs` 变化时调用滚动函数

### 2. 创建可视化配置编辑弹窗组件

- 创建新文件 `src/components/WizardConfigEditorModal.tsx`
- 复用现有 ConfigEditor 组件的逻辑，但设计为模态窗口
- 提供确认和取消按钮
- 编辑完成后继续 SetupWizard 流程

### 3. 修改 SetupWizard 流程

- 调整 Step 3（配置 REST API）的逻辑：
  - 读取现有配置或创建默认配置
  - 弹出 WizardConfigEditorModal 让用户编辑
  - 用户确认后，保存配置并继续下一步

## 具体步骤

1. 修复 SetupWizard 自动滚动功能
2. 创建 WizardConfigEditorModal 组件
3. 集成 WizardConfigEditorModal 到 SetupWizard 流程
4. 测试完整流程

## 文件清单

- 修改: `src/components/SetupWizard.tsx`
- 新建: `src/components/WizardConfigEditorModal.tsx`
