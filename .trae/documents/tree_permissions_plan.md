# 树状权限展示方案

## 现状分析

### 当前权限数据结构
- 权限按点号分隔命名：`tshock.rest.bans.manage`
- 目前分为两大分类：REST API 权限、一般管理权限
- 展示方式：简单双列表（已有权限/可选权限）

### 现有文件
1. `src/constants/permissions.ts` - 权限定义
2. `src/components/GroupEditModal.tsx` - 权限管理UI

## 设计方案

### 1. 数据结构改造
把扁平权限数组转换成嵌套树状结构
```typescript
interface PermissionNode {
  id: string;
  name: string;
  description?: string;
  children?: PermissionNode[];
}
```

### 2. 权限分类结构设计
按权限名称的层级进行树状分类：
```
tshock
├── rest
│   ├── bans.manage (管理封禁)
│   ├── bans.view (查看封禁)
│   ├── groups.manage (管理用户组)
│   └── ...
├── admin
│   ├── noban (防封禁)
│   └── nokick (防踢出)
├── world
│   ├── editspawn (编辑出生点)
│   └── time
│       ├── dawn (黎明)
│       └── dusk (黄昏)
├── command
│   ├── help (帮助命令)
│   └── ...
└── ...
```

### 3. 权限说明定义
为每个权限添加中文说明，新建文件 `src/constants/permissionDescriptions.ts`

### 4. UI改造方案
保留左右双列表布局，但内容改为树状结构：
- 左侧：已选权限树（可选地折叠）
- 右侧：可选权限树（默认展开，带搜索功能）
- 每个节点支持点击切换，父节点可控制子节点（半选状态支持）

### 5. 改造文件列表
1. `src/constants/permissions.ts` - 新增树状权限转换函数和说明映射
2. `src/components/GroupEditModal.tsx` - 重写权限管理UI部分
3. 新增 `src/components/PermissionTree.tsx` - 树状组件

### 6. 技术考虑
- 使用受控组件，保持现有 `currentPermissions` 状态不变
- 权限选择保持单权限粒度，支持批量操作
- 兼容现有的API交互
