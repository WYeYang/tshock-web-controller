
# 优化玩家操作界面计划

## 现状分析

当前代码在 [ServerStatusView.tsx](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/src/components/ServerStatusView.tsx) 中：
- 玩家列表有「踢出」和「封禁」两个按钮
- 点击按钮直接弹出确认对话框
- 封禁确认时会调用 `getPlayerDetails` 获取详细信息

## 优化目标

1. 点击玩家列表项时，先弹出玩家详情弹窗
2. 在详情弹窗中请求玩家详情API
3. 在详情弹窗中添加常用操作按钮
4. 显示背包、装备、染料、增益等数据
5. 操作按钮点击后再弹出确认对话框
6. 避免重复请求玩家详情

## 主要修改

### 1. 新增玩家详情弹窗组件

添加一个新的模态框组件 `PlayerDetailModal`，功能包括：
- 显示玩家详细信息（昵称、用户名、IP、用户组、状态、位置、注册时间等）
- 显示背包数据（物品列表）
- 显示装备数据（装备栏）
- 显示染料数据
- 显示增益效果
- 包含常用操作按钮
- 关闭按钮

### 2. 添加更多操作按钮

根据 TShock 常用功能，添加以下操作按钮：
- 踢出玩家
- 封禁玩家
- 禁言/取消禁言
- 传送玩家到指定位置
- 传送自己到玩家位置
- 修改用户组
- 查看背包（已在详情页显示）
- 查看装备（已在详情页显示）

### 3. 修改玩家列表项

- 移除列表项上的踢出和封禁按钮
- 整个列表项可点击，点击后打开详情弹窗
- 保持状态指示点和玩家基本信息

### 4. 修改状态管理

- 添加 `selectedPlayer` 状态，用于存储当前选中的玩家
- 添加 `playerDetail` 状态，用于存储获取的详细玩家信息
- 添加 `playerDetailModalOpen` 状态，控制详情弹窗的显示
- 修改 `confirmDialog` 的触发逻辑，不再直接从列表项触发

### 5. 修改封禁逻辑

- 封禁时直接使用已获取的 `playerDetail` 信息，不再重复请求
- 保留封禁原因输入框
- 保留多标识符封禁（昵称、账号、IP）

### 6. 添加数据显示组件

为背包、装备、染料、增益等数据添加专门的显示区域：
- 背包：显示物品名称和数量
- 装备：显示装备栏中的物品
- 染料：显示染料信息
- 增益：显示当前增益效果

### 7. 新增必要的 API 调用

在 [tshockApi.ts](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/src/services/tshockApi.ts) 中可能需要添加：
- 禁言/取消禁言 API
- 传送玩家 API
- 修改用户组 API
- 给玩家物品 API（可选）

## 涉及文件

1. [tshock-web-controller/src/components/ServerStatusView.tsx](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/src/components/ServerStatusView.tsx) - 主要修改文件
2. [tshock-web-controller/src/services/tshockApi.ts](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/src/services/tshockApi.ts) - 可能需要添加新的 API 方法
3. [tshock-web-controller/src/types/tshock.ts](file:///c:/Users/WEN/Documents/project/Tshock%20Server/tshock-web-controller/src/types/tshock.ts) - 确保类型定义完整

## 实现步骤

1. 更新 Player 类型定义，确保包含所有需要的字段
2. 添加新的状态变量
3. 创建玩家详情弹窗组件，包含数据显示区域
4. 创建操作按钮区域
5. 修改玩家列表项的渲染和点击事件
6. 修改封禁逻辑，使用已获取的详情
7. 添加其他操作的实现（禁言、传送、修改用户组等）
8. 调整 UI 样式，保持视觉一致性
