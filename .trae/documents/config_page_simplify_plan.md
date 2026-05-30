# TShock 控制器配置页面简化计划

## 需求概述
修改配置页面，移除账号密码/Token切换选项，改为：
1. 输入用户名和密码
2. 点击"获取Token"按钮
3. 自动保存获取到的Token到配置中
4. 使用保存的Token进行API调用

## 要修改的文件

### 1. `src/components/ConfigPage.tsx`
- 移除 "使用账号密码登录" 复选框
- 移除 Token 输入框的条件显示逻辑
- 改为直接显示用户名、密码输入框
- 添加 "获取Token" 按钮
- 调用 API 获取 Token 后自动保存到配置

### 2. `src/hooks/useTShock.ts`
- 添加获取Token的方法（可能已经有了，需要确认）
- 确保获取到的Token能正确保存到配置中

### 3. `src/services/tshockApi.ts`
- 确保有从用户名密码获取Token的方法（已经有了）

## 修改步骤

### ConfigPage.tsx
1. 移除 `useCredentials` 相关的状态和UI
2. 移除 Token 输入框的条件显示
3. 保留服务器地址、用户名、密码输入框
4. 添加 "获取Token" 按钮
5. 添加获取Token后的保存逻辑
6. 保留 LLM 配置部分

### 简化后的UI结构
1. 服务器地址输入框
2. 用户名输入框
3. 密码输入框
4. "获取Token" 按钮
5. LLM 配置部分
6. 保存配置按钮（可选，获取Token后可以自动保存）

## 配置类型说明
可以保持现有的 `TShockConfig` 类型不变，包括：
- serverUrl
- token
- username
- password
- useCredentials (可以保留但不再使用，或者移除)

## 功能流程
1. 用户输入服务器地址、用户名、密码
2. 点击"获取Token"
3. 调用 `/v2/token/create` 接口
4. 如果成功，将token保存到配置中
5. 后续API调用使用保存的token
