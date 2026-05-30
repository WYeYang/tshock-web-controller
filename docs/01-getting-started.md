
# 入门指南

欢迎使用 TShock 控制器！本指南将帮助您快速开始使用。

## 前置要求

在开始之前，请确保您已：

1. 安装并运行 TShock 服务器
2. 启用了 REST API 功能
3. 拥有管理员账户

## 配置步骤

### 步骤 1：配置 TShock

编辑 TShock 目录下的 `config.json` 文件，确保以下配置正确：

```json
{
  "RestApiEnabled": true,
  "RestApiPort": 7878,
  "EnableTokenEndpointAuthentication": false,
  "LogRest": true
}
```

修改完成后重启 TShock 服务器。

### 步骤 2：添加权限

在 TShock 控制台或游戏中执行以下命令：

```
/group addperm owner tshock.rest
```

这将为 `owner` 用户组添加 REST API 访问权限。

### 步骤 3：配置控制器

1. 打开 TShock 控制器
2. 进入「配置面板」
3. 填写服务器地址（例如：`http://localhost:7878`）
4. 输入用户名和密码
5. 点击「获取 Token」
6. 保存配置

## 功能说明

### 命令助手

快速发送常用命令，支持历史记录和自定义命令。

### 服务器状态

查看服务器运行状态、在线玩家列表、封禁记录等。

### 帮助文档

查阅 TShock 文档、命令说明和 API 参考。

## 常见问题

### 获取 Token 失败

- 检查 REST API 是否已启用
- 确认用户名和密码正确
- 验证用户是否拥有 `tshock.rest` 权限
- 检查服务器地址和端口是否正确

### 限流问题

TShock 默认每分钟最多处理 5 个请求。如需调整，请修改 `config.json`：

```json
{
  "RESTMaximumRequestsPerInterval": 50,
  "RESTRequestBucketDecreaseIntervalMinutes": 1
}
```

