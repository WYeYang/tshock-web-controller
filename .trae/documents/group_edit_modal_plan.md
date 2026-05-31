# 用户组弹窗编辑改造计划

## 概述

将用户组编辑从卡片展开形式改为独立弹窗，并将权限编辑改为左右双列表拖拽/点击移动的形式。

## 修改内容

### 1. 修改 [ServerStatusView.tsx](file:///c:/Users/WEN/Documents/project/Tshock Server/tshock-web-controller/src/components/ServerStatusView.tsx)

#### a. 移除展开功能
- 删除 `expandedGroup` 状态
- 删除 `toggleGroupExpansion` 函数
- 移除用户组卡片的展开/收起 UI

#### b. 添加弹窗编辑模式
- 添加 `selectedGroupForEdit` 状态，存储当前选中的用户组
- 添加 `groupEditModalOpen` 状态，控制弹窗显示

#### c. 添加权限双列表状态
- `currentPermissions`: 当前已选权限列表
- `availablePermissions`: 可选权限列表（所有权限减去已选权限）

#### d. 实现权限移动函数
- `addPermission`: 将权限从右侧（可选）移到左侧（已有）
- `removePermission`: 将权限从左侧（已有）移到右侧（可选）
- 每次移动时立即调用 API 更新

#### e. 重构用户组列表卡片
- 移除展开区域
- 添加「编辑」按钮点击打开弹窗
- 保持「删除」按钮
- 卡片点击直接打开编辑弹窗

#### f. 创建用户组编辑弹窗组件
- 弹窗分为两个主要部分：
  - 基本信息编辑（名称、父组、聊天颜色）
  - 权限管理（左右双列表）
  - 成员列表展示
- 添加保存和取消按钮

### 2. 更新相关状态管理
- 保持现有 API 调用方法不变
- 优化权限编辑时的交互反馈（Toast 提示）

## 预期效果

1. 用户组列表更简洁，没有展开区域
2. 点击用户组卡片或「编辑」按钮打开弹窗
3. 权限编辑直观：左边已有权限，右边可选权限
4. 点击权限项在两列表间移动，并同步更新到服务器
5. 用户体验更符合常见的管理后台模式
