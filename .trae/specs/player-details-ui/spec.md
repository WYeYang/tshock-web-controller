# 玩家详情UI优化 - 产品需求文档

## Overview
- **Summary**: 优化玩家详情界面，添加背包物品展示、Buff展示、背包编辑功能，以及通过物品/Buff图标链接到Wiki的功能
- **Purpose**: 提升玩家管理体验，让管理员更直观地查看和编辑玩家数据
- **Target Users**: Terraria服务器管理员

## Goals
1. 优化现有玩家详情UI，提升视觉体验
2. 展示玩家背包、装备、时装、保险箱、熔炉等所有物品
3. 展示玩家当前的Buff效果
4. 支持背包物品的基础编辑（通过游戏命令实现）
5. 为物品和Buff添加图标，并支持点击图标跳转到Terraria Wiki

## Non-Goals (Out of Scope)
- 直接修改服务器数据库中的玩家数据（仅通过游戏命令操作）
- 离线玩家数据查看
- 自定义物品图标上传
- 复杂的物品组合编辑功能

## Background & Context
现有的玩家详情界面只以文本形式展示玩家的背包、装备和Buff数据，不够直观。我们将优化这一界面，使用图标展示物品和Buff，并添加编辑功能。

## Functional Requirements
1. **FR-1**: 优化玩家详情界面布局，提升视觉效果
2. **FR-2**: 解析并展示PlayerItems数据（inventory, equipment, dyes, piggy, safe, forge）
3. **FR-3**: 展示玩家Buff列表，包含图标和剩余时间
4. **FR-4**: 为物品和Buff添加图标（使用公开CDN）
5. **FR-5**: 点击物品或Buff图标跳转到Terraria Wiki
6. **FR-6**: 支持背包编辑功能（通过游戏命令实现）

## Non-Functional Requirements
1. **NFR-1**: 界面响应式设计，支持移动端
2. **NFR-2**: 保持现有代码风格一致
3. **NFR-3**: 图标加载失败时有降级处理方案

## Constraints
- **Technical**: 
  - 使用现有的TShock API
  - 仅通过命令与游戏服务器交互
  - 使用React和Tailwind CSS
- **Business**:
  - 优先使用wiki.gg作为Wiki源
  - 使用公开的Terraria精灵图CDN
- **Dependencies**:
  - TShock API提供的玩家数据
  - 公开的Terraria物品图标CDN
  - Terraria Wiki (wiki.gg)

## Assumptions
1. TShock API返回的PlayerItems数据结构正确
2. 公开的Terraria精灵图CDN稳定可用
3. wiki.gg的URL结构稳定
4. 服务器有执行相关游戏命令的权限

## Acceptance Criteria

### AC-1: 玩家详情UI优化
- **Given**: 用户打开玩家详情模态框
- **When**: 界面渲染完成
- **Then**: 
  - 界面布局更加美观
  - 分为清晰的板块展示不同信息
  - 响应式设计在不同屏幕尺寸下正常显示
- **Verification**: human-judgment

### AC-2: 背包物品展示
- **Given**: 玩家详情加载完成且有物品数据
- **When**: 用户查看背包部分
- **Then**:
  - 物品以网格形式展示
  - 每个物品显示图标、名称（如果可能）、数量、前缀
  - 支持查看不同类型的容器（inventory, equipment, dyes, piggy, safe, forge）
- **Verification**: programmatic + human-judgment

### AC-3: Buff展示
- **Given**: 玩家详情加载完成且有Buff数据
- **When**: 用户查看Buff部分
- **Then**:
  - Buff以列表或网格形式展示
  - 每个Buff显示图标、名称、剩余时间
- **Verification**: programmatic + human-judgment

### AC-4: 图标展示
- **Given**: 界面上有物品或Buff
- **When**: 页面加载
- **Then**:
  - 显示对应的物品/Buff图标
  - 图标加载失败时有备用显示
- **Verification**: human-judgment

### AC-5: Wiki链接
- **Given**: 界面上有物品或Buff图标
- **When**: 用户点击图标
- **Then**: 在新标签页中打开对应的Wiki页面
- **Verification**: programmatic

### AC-6: 背包编辑
- **Given**: 用户在查看玩家详情
- **When**: 用户使用编辑功能
- **Then**:
  - 可以通过命令给玩家物品
  - 可以清除玩家背包
  - 可以执行其他基础背包操作
- **Verification**: programmatic + human-judgment

## Open Questions
1. 我们需要一个物品ID到名称的映射表吗？如果需要，数据来源是什么？
2. TShock API返回的Buff数据格式是什么样的？
3. 对于背包编辑，具体支持哪些命令？
