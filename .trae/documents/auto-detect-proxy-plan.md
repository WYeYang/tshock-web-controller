# Web版与桌面版REST请求地址统一方案

## 问题背景

当前 Web 版和桌面版的 REST 请求地址处理方式不一致：
- 桌面版（Electron）：直接请求完整 URL（`http://localhost:7878/v2/server/status`）
- Web 版：请求相对路径（`/api/v2/server/status`）由代理转发

## 解决方案

### 环境变量配置

使用构建时环境变量 `VITE_TSHOCK_USE_PROXY`：
- **未设置或 = false**（Web 版默认）：直接请求用户输入的完整地址，并在 UI 提示跨域问题
- **= true**（Web 版）：请求代理路径 `/api/*`
- **Electron（桌面版）**：始终直接请求完整 URL，不受环境变量影响

### 实现细节

#### 1. 修改 tshockApi.ts

修改判断逻辑：
- `isElectron() → 改成 `isElectron() || !import.meta.env.VITE_TSHOCK_USE_PROXY`（使用直接请求的情况
- 不需要重构方法本身

修改位置：
- `getHeaders` (第 88 行)`：`!isElectron() && tshockUrl` → `!isElectron() && import.meta.env.VITE_TSHOCK_USE_PROXY && tshockUrl`
- `buildUrl (第 103 行)`：`isElectron()` → `isElectron() || !import.meta.env.VITE_TSHOCK_USE_PROXY`
- `getToken (第 145 行)`：`isElectron() ? endpoint : /api${endpoint}` → `(isElectron() || !import.meta.env.VITE_TSHOCK_USE_PROXY) ? endpoint : /api${endpoint}`
- `request (第 183 行)`：`isElectron() ? endpoint : /api${endpoint}` → `(isElectron() || !import.meta.env.VITE_TSHOCK_USE_PROXY) ? endpoint : /api${endpoint}`

#### 2. 添加跨域提示

在 UI 中添加提示信息（如配置面板）：
- 当 Web 版使用直接请求模式时，提示用户可能遇到跨域问题
- 提供解决方案说明

#### 3. 环境变量使用示例

```bash
# 使用代理路径（推荐用于生产部署）
VITE_TSHOCK_USE_PROXY=true npm run build

# 直接请求（默认，开发环境）
npm run build
# 或
VITE_TSHOCK_USE_PROXY=false npm run build
```

### 修改文件

1. [tshockApi.ts](file:///workspace/src/services/tshockApi.ts)：修改判断逻辑
2. 相关 UI 组件（如配置面板）：添加跨域提示

### TShock 跨域配置说明（提示文案）

TShock REST API 本身不支持 CORS 配置。如需在 Web 版直接请求 TShock API，需要使用反向代理添加 CORS 响应头。

**使用反向代理：**
- 使用 Nginx、Cloudflare 或其他反向代理服务
- 在代理服务器上配置添加 CORS 响应头
- Web 前端通过代理访问 TShock API

**Nginx 配置示例：**
```nginx
location /tshock/ {
    proxy_pass http://localhost:7878/;
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type, Authorization";
}
```
