# TShock REST API 文档

## 基础信息

- **REST API端口**: 7878（可在config.json中配置`RestApiPort`）
- **启用REST API**: 在config.json中设置`RestApiEnabled`为`true`
- **记录REST请求**: 设置`LogRest`为`true`

## 认证方式

### 方式1: Token认证（推荐）
在请求中添加`token`参数：
```
http://localhost:7878/v2/server/status?token=你的token
```

### 方式2: 基本认证
使用`Authorization`头：
```
Authorization: Basic base64(username:password)
```

## API端点列表

### 服务器相关

#### ServerStatusV2 - 获取服务器状态
- **端点**: `/v2/server/status`
- **权限**: 无特殊要求
- **参数**: `token` (必填)
- **示例**: `/v2/server/status?token=令牌`

#### ServerInfo - 获取服务器信息
- **端点**: `/v2/server/info`
- **权限**: 无特殊要求
- **参数**: `token` (必填)
- **示例**: `/v2/server/info?token=令牌`

#### ServerBroadcast - 全局广播
- **端点**: `/v2/server/broadcast`
- **权限**: `tshock.rest.broadcast`
- **参数**: `msg` (必填), `token` (必填)
- **示例**: `/v2/server/broadcast?msg=消息内容&token=令牌`

#### ServerReload - 重新加载配置
- **端点**: `/v3/server/reload`
- **权限**: `tshock.rest.cfg`
- **参数**: `token` (必填)
- **示例**: `/v3/server/reload?token=令牌`

#### ServerOff - 关闭服务器
- **端点**: `/v2/server/off`
- **权限**: `tshock.rest.maintenance`
- **参数**: `confirm` (必填，需为true), `message` (可选), `nosave` (可选), `token` (必填)
- **示例**: `/v2/server/off?confirm=true&message=维护中&token=令牌`

#### ServerCommandV3 - 执行命令
- **端点**: `/v3/server/rawcmd`
- **权限**: `tshock.rest.command`
- **参数**: `cmd` (必填), `token` (必填)
- **示例**: `/v3/server/rawcmd?cmd=/say Hello&token=令牌`

#### ServerMotd - 获取MOTD
- **端点**: `/v3/server/motd`
- **权限**: 无特殊要求
- **参数**: `token` (必填)
- **示例**: `/v3/server/motd?token=令牌`

#### ServerRules - 获取服务器规则
- **端点**: `/v3/server/rules`
- **权限**: 无特殊要求
- **参数**: `token` (必填)
- **示例**: `/v3/server/rules?token=令牌`

#### ServerTokenTest - 验证Token
- **端点**: `/tokentest`
- **权限**: 无特殊要求
- **参数**: `token` (必填)
- **示例**: `/tokentest?token=令牌`

### 玩家相关

#### PlayerList - 列出在线玩家
- **端点**: `/lists/players` 或 `/v3/players/list`
- **权限**: 无特殊要求
- **参数**: `token` (必填)
- **示例**: `/v3/players/list?token=令牌`

#### PlayerKickV2 - 踢出玩家
- **端点**: `/v2/players/kick` 或 `/v3/players/kick`
- **权限**: `tshock.rest.kick`
- **参数**: `player` (必填), `reason` (可选), `token` (必填)
- **示例**: `/v3/players/kick?player=玩家名&reason=违规&token=令牌`

#### PlayerMute - 禁言玩家
- **端点**: `/v2/players/mute`
- **权限**: `tshock.rest.mute`
- **参数**: `player` (必填), `token` (必填)
- **示例**: `/v2/players/mute?player=玩家名&token=令牌`

#### PlayerUnMute - 解除禁言
- **端点**: `/v2/players/unmute`
- **权限**: `tshock.rest.mute`
- **参数**: `player` (必填), `token` (必填)
- **示例**: `/v2/players/unmute?player=玩家名&token=令牌`

#### PlayerKill - 杀死玩家
- **端点**: `/v2/players/kill`
- **权限**: `tshock.rest.kill`
- **参数**: `player` (必填), `from` (可选), `token` (必填)
- **示例**: `/v2/players/kill?player=玩家名&from=管理员&token=令牌`

#### PlayerReadV3/V4 - 获取玩家信息
- **端点**: `/v3/players/read` 或 `/v4/players/read`
- **权限**: `tshock.rest.users.info`
- **参数**: `player` (必填), `token` (必填)
- **示例**: `/v3/players/read?player=玩家名&token=令牌`

### 用户账户相关

#### UserCreateV2 - 创建用户
- **端点**: `/v2/users/create`
- **权限**: `tshock.rest.users.manage`
- **参数**: `user` (必填), `password` (必填), `group` (可选), `token` (必填)
- **示例**: `/v2/users/create?user=用户名&password=密码&group=default&token=令牌`

#### UserDestroyV2 - 删除用户
- **端点**: `/v2/users/destroy`
- **权限**: `tshock.rest.users.manage`
- **参数**: `user` (必填), `type` (必填, name或id), `token` (必填)
- **示例**: `/v2/users/destroy?user=用户名&type=name&token=令牌`

#### UserUpdateV2 - 更新用户
- **端点**: `/v2/users/update`
- **权限**: `tshock.rest.users.manage`
- **参数**: `user` (必填), `type` (必填), `password` (可选), `group` (可选), `token` (必填)
- **示例**: `/v2/users/update?user=用户名&type=name&password=新密码&group=admin&token=令牌`

#### UserListV2 - 列出所有用户
- **端点**: `/v2/users/list`
- **权限**: `tshock.rest.users.view`
- **参数**: `token` (必填)
- **示例**: `/v2/users/list?token=令牌`

#### UserInfoV2 - 获取用户详情
- **端点**: `/v2/users/read`
- **权限**: `tshock.rest.users.view`
- **参数**: `user` (必填), `type` (必填), `token` (必填)
- **示例**: `/v2/users/read?user=用户名&type=name&token=令牌`

#### UserActiveListV2 - 列出活跃用户
- **端点**: `/v2/users/activelist`
- **权限**: `tshock.rest.users.view`
- **参数**: `token` (必填)
- **示例**: `/v2/users/activelist?token=令牌`

### 用户组相关

#### GroupCreate - 创建用户组
- **端点**: `/v2/groups/create`
- **权限**: `tshock.rest.groups.manage`
- **参数**: `group` (必填), `parent` (可选), `permissions` (可选), `chatcolor` (可选), `token` (必填)
- **示例**: `/v2/groups/create?group=新组名&parent=default&permissions=权限1,权限2&token=令牌`

#### GroupDestroy - 删除用户组
- **端点**: `/v2/groups/destroy`
- **权限**: `tshock.rest.groups.manage`
- **参数**: `group` (必填), `token` (必填)
- **示例**: `/v2/groups/destroy?group=组名&token=令牌`

#### GroupList - 列出用户组
- **端点**: `/v2/groups/list`
- **权限**: `tshock.rest.groups.view`
- **参数**: `token` (必填)
- **示例**: `/v2/groups/list?token=令牌`

#### GroupInfo - 获取用户组详情
- **端点**: `/v2/groups/read`
- **权限**: `tshock.rest.groups.view`
- **参数**: `group` (必填), `token` (必填)
- **示例**: `/v2/groups/read?group=组名&token=令牌`

### 封禁相关

#### BanListV3 - 列出所有封禁
- **端点**: `/v3/bans/list`
- **权限**: `tshock.rest.bans.view`
- **参数**: `token` (必填)
- **示例**: `/v3/bans/list?token=令牌`

#### BanCreateV3 - 创建封禁
- **端点**: `/v3/bans/create`
- **权限**: `tshock.rest.bans.manage`
- **参数**: `identifier` (必填), `reason` (可选), `start` (可选), `end` (可选), `token` (必填)
- **示例**: `/v3/bans/create?identifier=玩家名&reason=违规&token=令牌`

#### BanDestroyV3 - 删除封禁
- **端点**: `/v3/bans/destroy`
- **权限**: `tshock.rest.bans.manage`
- **参数**: `ticketNumber` (必填), `fullDelete` (可选), `token` (必填)
- **示例**: `/v3/bans/destroy?ticketNumber=123&fullDelete=true&token=令牌`

#### BanInfoV3 - 获取封禁详情
- **端点**: `/v3/bans/read`
- **权限**: `tshock.rest.bans.view`
- **参数**: `ticketNumber` (必填), `token` (必填)
- **示例**: `/v3/bans/read?ticketNumber=123&token=令牌`

### 世界相关

#### WorldRead - 获取世界信息
- **端点**: `/world/read`
- **权限**: 无特殊要求
- **参数**: `token` (必填)
- **示例**: `/world/read?token=令牌`

#### WorldSave - 保存世界
- **端点**: `/v2/world/save`
- **权限**: `tshock.rest.cfg`
- **参数**: `token` (必填)
- **示例**: `/v2/world/save?token=令牌`

#### WorldButcher - 击杀NPC
- **端点**: `/v2/world/butcher`
- **权限**: `tshock.rest.butcher`
- **参数**: `killfriendly` (可选), `token` (必填)
- **示例**: `/v2/world/butcher?killfriendly=true&token=令牌`

#### WorldMeteor - 生成陨石
- **端点**: `/world/meteor`
- **权限**: `tshock.rest.causeevents`
- **参数**: `token` (必填)
- **示例**: `/world/meteor?token=令牌`

#### WorldBloodmoon - 血月控制
- **端点**: `/world/bloodmoon/true` 或 `/world/bloodmoon/false`
- **权限**: `tshock.rest.causeevents`
- **参数**: `token` (必填)
- **示例**: `/world/bloodmoon/true?token=令牌`

### Token端点

#### TokenCreate - 创建Token
- **端点**: `/v2/token/create`
- **方法**: GET
- **参数**: `username` (必填), `password` (必填)
- **示例**: `/v2/token/create?username=admin&password=password`

## Token配置说明

### 动态Token（通过API创建）
使用 `/v2/token/create` 端点动态创建token，每次请求生成新token。

### 静态Token（config.json配置）
在config.json中预配置固定token：
```json
"ApplicationRestTokens": {
  "your-secret-token": {
    "Username": "对应的TShock用户名",
    "Validity": "有效期"
  }
}
```

**Validity字段说明**：
- `"0"` = 永不过期
- 其他数字字符串 = 有效期（分钟），如 `"60"` = 60分钟后过期

### Token使用方式
在API请求中添加token参数：
```
http://localhost:7878/v2/server/status?token=your-token
```

## 响应格式

所有API响应都是JSON格式：

```json
{
  "status": "200",
  "response": { ... },
  "error": null
}
```

或错误响应：

```json
{
  "status": "500",
  "response": null,
  "error": "错误信息"
}
```

## 配置文件示例 (config.json)

```json
{
  "Settings": {
    "RestApiEnabled": true,
    "RestApiPort": 7878,
    "LogRest": true,
    "EnableTokenEndpointAuthentication": false,
    "RESTMaximumRequestsPerInterval": 5,
    "RESTRequestBucketDecreaseIntervalMinutes": 1,
    "ApplicationRestTokens": {
      "your-secret-token-here": {
        "Username": "admin",
        "Validity": "0"
      }
    }
  }
}
```

## 注意事项

1. **CORS问题**: TShock REST API默认不支持CORS。开发环境建议使用Vite代理。
2. **Token过期**: 如果设置了过期时间，过期后需要重新获取。
3. **权限控制**: 某些端点需要特定的REST权限。
4. **请求频率**: 默认限制每分钟5个请求，可通过`RESTMaximumRequestsPerInterval`配置，时间窗口由`RESTRequestBucketDecreaseIntervalMinutes`指定（默认1分钟）。

## 前端代理配置 (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7878',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

使用代理后，前端请求应使用 `/api/v2/server/status` 这样的路径。

## 权限列表

- `tshock.rest.bans.manage` - 管理封禁
- `tshock.rest.bans.view` - 查看封禁
- `tshock.rest.groups.manage` - 管理用户组
- `tshock.rest.groups.view` - 查看用户组
- `tshock.rest.kick` - 踢出玩家
- `tshock.rest.mute` - 禁言玩家
- `tshock.rest.kill` - 杀死玩家
- `tshock.rest.broadcast` - 广播消息
- `tshock.rest.command` - 执行命令
- `tshock.rest.cfg` - 服务器配置
- `tshock.rest.maintenance` - 服务器维护
- `tshock.rest.users.manage` - 管理用户
- `tshock.rest.users.view` - 查看用户
- `tshock.rest.users.info` - 用户信息
- `tshock.rest.butcher` - 击杀NPC
- `tshock.rest.causeevents` - 触发事件