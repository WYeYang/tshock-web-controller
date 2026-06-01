# TShock REST API 测试文档

## 📋 概述

本目录包含 TShock REST API 的测试结果和文档。

### 测试信息
- **服务器地址**: http://localhost:7878
- **Token**: F94D0AC988BD92C650C07E4570044B6D8B4859048233E8F4980429405906F724
- **测试日期**: 2026-05-31

### 服务器信息
- **TShock版本**: v6.1.0.0
- **Terraria版本**: v1.4.5.6
- **游戏端口**: 7777
- **最大玩家**: 8
- **当前在线**: 0

---

## 📁 文件列表

### 核心 API 测试

| 文件名 | API 端点 | 描述 | 状态 |
|--------|----------|------|------|
| [01-server-status.json](01-server-status.json) | `/v2/server/status` | 获取服务器状态 | ✅ 成功 |
| [02-users-list.json](02-users-list.json) | `/v2/users/list` | 获取用户列表 | ✅ 成功 |
| [03-users-read.json](03-users-read.json) | `/v2/users/read` | 获取用户详情 | ✅ 成功 |
| [04-users-update.json](04-users-update.json) | `/v2/users/update` | 更新用户信息 | ✅ 成功 |
| [05-groups-list.json](05-groups-list.json) | `/v2/groups/list` | 获取用户组列表 | ✅ 成功 |
| [06-players-read-failed.json](06-players-read-failed.json) | `/v3/players/read` | 获取玩家详细信息 | ⚠️ 需要玩家在线 |

---

## 🔧 API 详情

### 1. 获取服务器状态
**端点**: `GET /v2/server/status`

**参数**:
- `token` (必填): 认证令牌

**返回字段**:
- `playercount`: 在线玩家数量
- `maxplayers`: 最大玩家数量
- `world`: 世界名称
- `uptime`: 服务器运行时间
- `serverpassword`: 是否需要服务器密码

---

### 2. 获取用户列表
**端点**: `GET /v2/users/list`

**参数**:
- `token` (必填): 认证令牌

**返回字段**:
- `name`: 用户名
- `id`: 用户ID
- `group`: 所属用户组

---

### 3. 获取用户详情
**端点**: `GET /v2/users/read`

**参数**:
- `user` (必填): 用户名或用户ID
- `type` (必填): 查询类型 (`name` 或 `id`)
- `token` (必填): 认证令牌

**返回字段**:
- `name`: 用户名
- `id`: 用户ID
- `group`: 所属用户组

---

### 4. 更新用户信息
**端点**: `GET /v2/users/update`

**参数**:
- `user` (必填): 用户名或用户ID
- `type` (必填): 查询类型 (`name` 或 `id`)
- `group` (可选): 要修改的目标用户组
- `password` (可选): 新密码
- `token` (必填): 认证令牌

**测试结果**:
```json
{
  "status": "200",
  "group-response": "Group updated successfully"
}
```

**测试用例**:
- ✅ 成功将用户 `wen` 从 `owner` 组修改为 `admin` 组

---

### 5. 获取用户组列表
**端点**: `GET /v2/groups/list`

**参数**:
- `token` (必填): 认证令牌

**返回字段**:
- `name`: 用户组名称
- `parent`: 父用户组（用于权限继承）
- `chatcolor`: 聊天颜色 RGB 值

**用户组层级**:
```
superadmin (无父级)
  ↓
owner (parent: trustedadmin)
  ↓
trustedadmin (parent: admin)
  ↓
admin (parent: newadmin)
  ↓
newadmin (parent: vip)
  ↓
vip (parent: default)
  ↓
default (parent: guest)
  ↓
guest (无父级)

insecure-guest (无父级，独立组)
```

---

### 6. 获取玩家详细信息 ⚠️
**端点**: `GET /v3/players/read`

**参数**:
- `player` (必填): 玩家名称
- `token` (必填): 认证令牌

**说明**: 此 API 需要玩家在游戏中在线才能获取信息。

**当前状态**: ⚠️ 无法测试（当前在线玩家数为 0）

**预期返回**:
- 玩家当前背包内容
- 玩家位置信息
- 玩家状态信息

---

## 📊 测试结果统计

| 测试项 | 总数 | 成功 | 失败 | 备注 |
|--------|------|------|------|------|
| API 测试 | 6 | 5 | 1 | - |
| 用户管理 | 4 | 4 | 0 | - |
| 服务器状态 | 1 | 1 | 0 | - |
| 玩家信息 | 1 | 0 | 1 | 需要玩家在线 |

---

## 🔍 使用建议

### 正常工作的功能 ✅
1. **服务器状态监控** - 可实时获取服务器状态
2. **用户列表查询** - 可查看所有注册用户
3. **用户详情查询** - 可查看单个用户的详细信息
4. **用户组修改** - 可修改用户的所属组
5. **用户组列表** - 可查看所有用户组及其层级关系

### 需要玩家在线的功能 ⚠️
1. **玩家背包查询** - 需要玩家进入游戏后才能测试

### 测试建议
1. 启动游戏并进入服务器
2. 再次测试 `/v3/players/read` API
3. 记录完整的玩家信息返回数据

---

## 📝 更新日志

### 2026-05-31
- 初始版本
- 测试了 6 个 API 端点
- 5 个成功，1 个需要玩家在线

---

## 🔗 相关资源

- [TShock 官方文档](https://github.com/Pryaxis/TShock)
- [项目 API 文档](../.internal/docs/tshock-rest-api.md)
