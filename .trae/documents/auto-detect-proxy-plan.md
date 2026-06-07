# Web版与桌面版REST请求地址统一方案

## 问题背景

当前 Web 版和桌面版的 REST 请求地址处理方式不一致：
- 桌面版（Electron）：直接请求完整 URL（`http://localhost:7878/v2/server/status`）
- Web 版：请求相对路径（`/api/v2/server/status`）由代理转发

## 解决方案

### 环境变量配置

使用构建时环境变量 `VITE_USE_DIRECT_REQUEST`：
- **未设置或 = false**：直接请求用户输入的完整地址，并在 UI 提示跨域问题
- **= true**：请求代理路径 `/api/*`

### 实现细节

#### 1. 修改 tshockApi.ts

- 移除 `isElectron()` 平台判断逻辑
- 统一使用环境变量 `import.meta.env.VITE_USE_DIRECT_REQUEST` 判断
- 重构 `buildUrl`、`getHeaders`、`request` 等方法

#### 2. 添加跨域提示

在 UI 中添加提示信息（如配置面板）：
- 当使用直接请求模式时，提示用户可能遇到跨域问题
- 提供 TShock 跨域配置的解决方案说明

#### 3. 环境变量使用示例

```bash
# 使用代理路径（推荐用于生产部署）
VITE_USE_DIRECT_REQUEST=true npm run build

# 直接请求（默认，开发环境）
npm run build
# 或
VITE_USE_DIRECT_REQUEST=false npm run build
```

### 修改文件

1. [tshockApi.ts](file:///workspace/src/services/tshockApi.ts)：核心逻辑修改
2. 相关 UI 组件（如配置面板）：添加跨域提示

### TShock 跨域配置说明（提示文案）

如需在 Web 版直接请求 TShock API，需要在 TShock 配置中添加 CORS 头：

1. 编辑 TShock 配置文件（通常在 `tshock/config.json`）
2. 添加或修改 `RestApiOptions` 配置：
   ```json
   "RestApiOptions": {
     "EnableCors": true,
     "CorsOrigins": "*"
   }
   ```
3. 重启 TShock 服务器

或使用 Nginx/Cloudflare 等反向代理添加 CORS 头。
# Web# Web版与桌面版REST请求地址统一方案

## 问题背景

当前 Web 版和# Web版与桌面版REST请求地址统一方案

## 问题背景

当前 Web 版和桌面版的 REST 请求地址处理方式不一致：
- 桌面版（Electron）：# Web版与桌面版REST请求地址统一方案

## 问题背景

当前 Web 版和桌面版的 REST 请求地址处理方式不一致：
- 桌面版（Electron）：直接请求完整 URL（`http://localhost:7878/v2/server/status`）# Web版与桌面版REST请求地址统一方案

## 问题背景

当前 Web 版和桌面版的 REST 请求地址处理方式不一致：
- 桌面版（Electron）：直接请求完整 URL（`http://localhost:7878/v2/server/status`）
- Web 版：请求相对路径（`/api/v2/server/status`）由