# 用户组选择器改进计划

## 概述
将所有输入用户组的地方从文本输入框改为下拉选择器，提高用户体验和避免输入错误。

## 需要修改的文件

### 1. `src/components/CreateGroupModal.tsx`
**位置**: 第65-71行（父组输入框）

**修改内容**:
- 将父组输入框改为下拉选择器
- 添加 `groups` prop 用于接收用户组列表
- 选项包含所有现有用户组
- 添加"无父组"选项（值为空字符串）

### 2. `src/components/GroupEditModal.tsx`
**位置**: 第180-186行（父组输入框）

**修改内容**:
- 将父组输入框改为下拉选择器
- 添加 `groups` prop 用于接收用户组列表
- 选项包含所有现有用户组（排除当前编辑的用户组，避免循环引用）
- 添加"无父组"选项

### 3. `src/components/ServerStatusView.tsx`
**位置**: 第363-371行（修改玩家用户组时的输入框）

**修改内容**:
- 将用户组输入框改为下拉选择器
- 选项包含所有现有用户组
- 使用已有的 `groups` 状态数据

## 实现方案

### 通用选择器组件样式
```jsx
<select
  value={selectedValue}
  onChange={(e) => setSelectedValue(e.target.value)}
  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
>
  <option value="">无父组</option>
  {groups.map(group => (
    <option key={group.name} value={group.name}>
      {group.name}
    </option>
  ))}
</select>
```

### 具体实现步骤

1. **CreateGroupModal.tsx**
   - 更新 Props 接口，添加 `groups: Group[]`
   - 修改父组输入为 select
   - 渲染所有用户组选项

2. **GroupEditModal.tsx**
   - 更新 Props 接口，添加 `groups: Group[]`
   - 修改父组输入为 select
   - 过滤掉当前编辑的用户组，避免循环引用

3. **ServerStatusView.tsx**
   - 修改确认对话框中的 changeGroup 输入为 select
   - 使用已有的 groups 数据
   - 更新相关状态管理

## 注意事项

- 确保在 GroupEditModal 中排除当前编辑的用户组，避免循环引用
- 保持所有组件的现有功能不受影响
- 保持样式一致性，使用与现有输入框相同的样式类
