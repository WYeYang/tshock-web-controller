# 重构 TShock API 调用工具类计划

## 问题分析
当前实现存在的问题：
1. API 实例使用 ref 缓存，token 更新后缓存的实例不会自动重新创建
2. 虽然已经添加了 useEffect 监听配置变化，但我们可以做得更简洁
3. 没有提供直接更新 token 的方法

## 重构方案

### 1. 重构 `tshockApi.ts`
**目标**：简化 API 类，添加更新 token 的方法

**修改内容**：
- 添加 `setToken(token: string)` 方法，允许动态更新 token
- 保持类的功能不变，只是增强灵活性

### 2. 简化 `useTShock.ts`
**目标**：移除复杂的缓存逻辑，确保每次获取最新配置

**修改内容**：
- 移除复杂的 ref 缓存机制
- 每次调用 getApi 时创建新实例或更新 token
- 简化代码结构，提高可维护性

### 3. 确保 ConfigPage 更新 token 后立即生效
**目标**：让用户配置后立即可以使用新 token

## 涉及文件
1. `src/services/tshockApi.ts` - 添加 setToken 方法
2. `src/hooks/useTShock.ts` - 简化 API 实例管理

## 风险与注意事项
- 确保不破坏现有功能
- 保持向后兼容性
- 测试所有 API 调用功能正常
