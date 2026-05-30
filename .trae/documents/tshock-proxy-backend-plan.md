# TShock Web Controller 后端代理方案

## 目标
使用Node.js + Express创建后端服务，解决CORS问题，TShock URL由用户配置。

## 技术栈
- **后端**: Express.js + cors中间件 + http-proxy-middleware
- **前端**: React + Vite（现有）
- **代理**: Express代理所有API请求到用户指定的TShock服务器

## 实现步骤

### 1. 创建后端项目结构
```
tshock-web-controller/
├── server/              # 新建后端目录
│   ├── package.json
│   ├── index.js         # Express服务器入口
│   └── proxy.js         # 代理中间件
├── src/
│   └── services/
│       └── tshockApi.ts # 修改为使用相对路径 /api
├── dist/                # 前端构建产物
└── nginx.conf          # Nginx配置（可选）
```

### 2. 创建后端 package.json
- 依赖: express, cors, http-proxy-middleware, dotenv
- 脚本: start(生产), dev(开发)

### 3. 创建 Express 服务器 (server/index.js)
- 配置CORS允许所有来源
- 设置代理中间件
- 从请求参数或header获取目标TShock URL
- 代理所有 /api/* 请求到用户指定的TShock服务器

### 4. 修改前端 API 调用
- 将 baseUrl 改为相对路径 `/api`
- 移除 proxyUrl 配置项
- 前端请求 /api/v2/server/status → 后端代理到用户配置的TShock服务器

### 5. 配置方案
- **开发环境**: 前后端分别运行 (前端5174, 后端3001)
- **生产环境**: 前端构建后由Express静态托管，或Nginx反向代理

## 数据流
```
用户浏览器 → 前端(5174/80) → Express后端(3001) → TShock服务器(用户配置)
                                              ↓
                                    添加CORS响应头
                                    转发请求
```
