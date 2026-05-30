# TShock 配置文件说明

本文档详细介绍 TShock 的配置文件选项。

---

## config.json

### 服务器设置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| ServerPassword | String | "" | 加入服务器需要的密码 |
| Port | Int32 | 7777 | 服务器运行端口 |
| MaxPlayers | Int32 | 8 | 最大同时连接玩家数 |
| ReservedSlots | Int32 | 20 | 预留座位数，超过最大玩家数后保留玩家可加入 |
| ServerName | String | "" | 服务器名称 |
| UseServerName | Boolean | false | 是否用 ServerName 替换世界名称 |

### REST API 设置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| RestApiEnabled | Boolean | true | 启用 REST API |
| RestApiPort | Int32 | 7878 | REST API 端口 |
| EnableTokenEndpointAuthentication | Boolean | false | 是否启用 Token 端点认证 |
| LogRest | Boolean | false | 是否记录 REST API 日志 |
| RESTMaximumRequestsPerInterval | Int32 | 5 | 每个时间间隔的最大请求数 |
| RESTRequestBucketDecreaseIntervalMinutes | Int32 | 1 | 请求限制重置间隔（分钟） |

### 自动保存与备份

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| AutoSave | Boolean | true | 启用/禁用自动保存 |
| BackupInterval | Int32 | 0 | 备份间隔（分钟），0 为禁用 |
| BackupKeepFor | Int32 | 60 | 备份保留时间（分钟），2880 = 2天 |
| AnnounceSave | Boolean | true | 是否广播世界保存消息 |
| SaveWorldOnCrash | Boolean | true | 服务器崩溃时是否保存世界 |
| SaveWorldOnLastPlayerExit | Boolean | true | 最后一个玩家退出时是否保存世界 |

### 玩家设置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| SpawnProtectionRadius | Int32 | 10 | 出生点保护半径 |
| spawnProtectionRadius | Int32 | 10 | 防止在出生点保护范围内放置物块 |
| DisableInvasionsWormholeGreeting | Boolean | false | 入侵事件时是否禁用虫洞问候 |
| EnableRPCEP | Boolean | true | 启用 RPC 端点 |
| WhitelistSucks | Boolean | false | 白名单相关设置 |

### 权限与登录

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| DisableLoginBeforeJoin | Boolean | false | 是否禁止在加入前登录 |
| AllowLoginAnyUsername | Boolean | false | 允许任意用户名的登录 |
| AllowRegisterAnyUsername | Boolean | false | 允许注册任意用户名 |
| MinimumPasswordLength | Int32 | 4 | 最小密码长度 |
| HashAlgorithm | String | "sha512" | 密码加密算法，可选: sha512, sha256, md5 |

### 踢出与封禁

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| KickOnDamageThresholdBroken | Boolean | false | 超出伤害阈值时是否踢出玩家 |
| BanOnHardcoreDeath | Boolean | false | 硬核玩家死亡时是否封禁 |
| BanOnMediumcoreDeath | Boolean | false | 中核玩家死亡时是否封禁 |
| KickProxyUsers | Boolean | true | 检测到代理用户时是否踢出 |
| EnableIPBans | Boolean | true | 启用 IP 地址封禁 |
| EnableWhitelist | Boolean | false | 启用白名单 |

### 数据库设置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| StorageType | String | "sqlite" | 数据库类型，可选: sqlite, mysql |
| SqliteDBPath | String | "tshock.sqlite" | SQLite 数据库路径 |
| MySqlHost | String | "localhost:3306" | MySQL 主机地址和端口 |
| MySqlDbName | String | "" | MySQL 数据库名称 |
| MySqlUsername | String | "" | MySQL 用户名 |
| MySqlPassword | String | "" | MySQL 密码 |

### 日志设置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| LogPath | String | "tshock" | 日志目录路径 |
| DebugLogs | Boolean | true | 是否输出调试日志 |
| LogSql | Boolean | false | 是否将日志保存到 SQL 数据库 |

---

## sscconfig.json（服务器端角色配置）

服务器端角色 (SSC) 是一种强制玩家加入时使用新角色的机制，玩家会失去所有物品。这不会影响玩家的单人游戏角色。

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| Enabled | Boolean | false | 是否启用服务器端角色 |
| ServerSideCharacterSave | Int32 | 5 | 保存间隔（分钟），服务器每5分钟备份玩家角色 |
| LogonDiscardThreshold | Int32 | 250 | 登录后禁止丢弃物品的时间（秒） |
| StartingHealth | Int32 | 100 | 初始生命值 |
| StartingMana | Int32 | 20 | 初始魔法值 |
| StartingInventory | Array | 铜工具 | 初始物品清单，通过 netID 指定 |

### 示例配置

```json
{
  "Enabled": false,
  "ServerSideCharacterSave": 5,
  "LogonDiscardThreshold": 250,
  "StartingHealth": 100,
  "StartingMana": 20,
  "StartingInventory": [
    { "netID": -15, "prefix": 0, "stack": 1 },
    { "netID": -13, "prefix": 0, "stack": 1 },
    { "netID": -16, "prefix": 0, "stack": 1 }
  ]
}
```

### 重要提示

- **SuperAdmin 绕过 SSC**：SuperAdmin 账号拥有所有权限，包括忽略 SSC 的权限 (`tshock.ignore.ssc`)
- 如需保留管理员权限但仍强制 SSC，可创建新用户组并授予 `*, !tshock.ignore.ssc` 权限

---

## 参考链接

- [config.json 完整配置项](https://tshock.readme.io/docs/config-settings)
- [Server Side Characters 配置](https://tshock.readme.io/docs/server-side-character-config)
- [命令列表](https://tshock.readme.io/reference/commands)
- [REST API 端点](https://tshock.readme.io/reference/rest)
- [权限系统](https://tshock.readme.io/docs/permissions)

> 文档来源：TShock 官方文档