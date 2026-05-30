# TShock 命令参考

> 文档来源: [Pryaxis/TShock GitHub Wiki](https://github.com/Pryaxis/TShock/wiki)
> 
> - 中文权限文档: [(中文)权限说明](https://github.com/Pryaxis/TShock/wiki/(%E4%B8%AD%E6%96%87)%E6%9D%83%E9%99%90%E8%AF%B4%E6%98%8E)

## 玩家管理

### /kick
踢出玩家（可重新加入）

```
/kick <玩家名> [原因]
```

- **权限**: `tshock.admin.kick`
- **示例**:
```
/kick 玩家名称 违反规则
```

### /ban
封禁玩家

```
/ban add <玩家名> [原因]
/ban del <玩家名>
/ban list
```

- **权限**: `tshock.admin.ban`
- **示例**:
```
/ban add 玩家名称 使用外挂
/ban del 玩家名称
/ban list
```

### /mute
禁言/解除禁言玩家

```
/mute <玩家名>
/unmute <玩家名>
```

- **权限**: `tshock.admin.mute`
- **示例**:
```
/mute 玩家名称
/unmute 玩家名称
```

### /who
查看当前在线玩家

```
/who
/who -i    （显示玩家ID）
```

- **权限**: 无特殊要求

---

## 物品管理

### /give
给予玩家物品。

```
/give <物品名称或ID> <玩家名> [数量]
```

- **权限**: `tshock.item.give`
- **示例**:
```
/give 铁剑 玩家名称 1
/give 4956 玩家名称 1
/give 天顶剑 玩家名称 1
```

**注意**: 可以输入物品名称或物品ID，物品参数在前，玩家参数在后。

### /item
给自己生成物品

```
/item <物品名称或ID> [数量]
/i <物品名称或ID> [数量]
```

- **权限**: `tshock.item.spawn`

---

## 传送命令

### /tp
传送到玩家

```
/tp <玩家名>
/tp <玩家1> <玩家2>  （传玩家1到玩家2）
```

- **权限**: `tshock.tp.self` / `tshock.tp.others`

### /tphere
将玩家传送到自己身边

```
/tphere <玩家名>
```

- **权限**: `tshock.tp.others`

### /spawn
传送到出生点

```
/spawn
```

- **权限**: `tshock.tp.spawn`

### /home
传送到个人传送点

```
/home
```

- **权限**: `tshock.tp.home`

### /warp
使用传送点

```
/warp <传送点名>
```

- **权限**: `tshock.warp`

### /tppos
传送到指定位置

```
/tppos <x> <y>
```

- **权限**: `tshock.tp.pos`

---

## 世界事件

### /worldevent
触发世界事件

```
/worldevent bloodmoon   （血月）
/worldevent eclipse     （日食）
/worldevent fullmoon    （满月）
/worldevent invasion    （入侵事件）
/worldevent meteor      （陨石）
/worldevent rain        （雨）
/worldevent sandstorm   （沙尘暴）
/worldevent lanternsnight （灯笼之夜）
```

- **权限**: `tshock.world.events`

### /bloodmoon
触发血月

```
/bloodmoon
```

- **权限**: `tshock.world.time.bloodmoon`

### /eclipse
触发日食

```
/eclipse
```

- **权限**: `tshock.world.time.eclipse`

### /butcher
杀死所有敌对NPC

```
/butcher
```

- **权限**: `tshock.npc.butcher`

### /spawnboss
生成Boss

```
/spawnboss <Boss名称>
/spawnboss eye
/sb eye
```

- **权限**: `tshock.npc.spawnboss`

### /spawnmob
生成怪物

```
/spawnmob <怪物名称或ID> [数量]
/sm 史莱姆 10
```

- **权限**: `tshock.npc.spawnmob`

### /invade
开始入侵事件

```
/invade
```

- **权限**: `tshock.npc.invade`

### /worldevent meteor
生成陨石

```
/worldevent meteor
```

- **权限**: `tshock.world.time.dropmeteor`

---

## 用户管理

### /user
用户管理（仅管理员）

```
/user add <用户名> <密码> [用户组]
/user group <用户名> <用户组>
/user password <用户名> <新密码>
```

- **权限**: `tshock.superadmin.user`

### /accountinfo
查看账户信息

```
/accountinfo <用户名>
/ai <用户名>
```

- **权限**: `tshock.accountinfo.check`

---

## 用户组管理

### /group
管理用户组（仅管理员）

```
/group addperm <组名> <权限>
/group delperm <组名> <权限>
```

- **权限**: `tshock.admin.group`

### /tempgroup
临时提升用户组

```
/tempgroup <玩家名> <用户组> [分钟]
```

- **权限**: `tshock.admin.tempgroup`

---

## 服务器管理

### /save
保存世界

```
/save
```

- **权限**: `tshock.world.save`

### /reload
重新加载配置

```
/reload
```

- **权限**: `tshock.cfg.reload`

### /broadcast
广播消息

```
/broadcast <消息>
/bc <消息>
```

- **权限**: `tshock.admin.broadcast`

### /serverpassword
设置服务器密码

```
/serverpassword [密码]
```

- **权限**: `tshock.cfg.password`

### /off
关闭服务器

```
/off
/off-nosave
```

- **权限**: `tshock.cfg.maintenance`

### /checkupdates
检查更新

```
/checkupdates
/version
```

- **权限**: `tshock.cfg.maintenance`

---

## 玩家功能

### /heal
治愈自己

```
/heal
```

- **权限**: `tshock.heal`

### /buff
给自己添加增益

```
/buff <增益名称或ID>
```

- **权限**: `tshock.buff.self`

### /gbuff
给其他玩家添加增益

```
/gbuff <玩家名> <增益名称或ID>
```

- **权限**: `tshock.buff.others`

### /godmode
上帝模式

```
/godmode
/god
```

- **权限**: `tshock.godmode`

### /kill
杀死玩家

```
/kill <玩家名>
/slay <玩家名>
```

- **权限**: `tshock.kill`

### /respawn
复活

```
/respawn
```

- **权限**: `tshock.respawn`

### /slap
打玩家

```
/slap <玩家名> [伤害]
```

- **权限**: `tshock.slap`

---

## 世界管理

### /time
设置时间

```
/time set <时间>
/time sunrise    （日出）
/time noon       （正午）
/time sunset    （日落）
/time midnight  （午夜）
```

- **权限**: `tshock.world.time.set`

### /hardmode
开启困难模式

```
/hardmode
```

- **权限**: `tshock.world.hardmode`

### /evil
转换世界邪恶

```
/evil corrupt    （腐化）
/evil hallow     （神圣）
```

- **权限**: `tshock.world.switchevil`

### /grow
种植植物

```
/grow all        （种植所有）
/grow corrupt    （邪恶植物）
/grow hallow     （神圣植物）
```

- **权限**: `tshock.world.grow` / `tshock.world.growevil`

### /setspawn
设置出生点

```
/setspawn
```

- **权限**: `tshock.world.setspawn`

### /setdungeon
设置地牢位置

```
/setdungeon
```

- **权限**: `tshock.world.setdungeon`

### /rain
控制雨

```
/rain start
/rain stop
```

- **权限**: `tshock.world.rain`

### /wind
设置风速

```
/wind <速度>
```

- **权限**: `tshock.world.wind`

### /forcehalloween
强制万圣节模式

```
/forcehalloween
```

- **权限**: `tshock.world.sethalloween`

### /forcexmas
强制圣诞节模式

```
/forcexmas
```

- **权限**: `tshock.world.setxmas`

---

## 区域管理

### /region
区域管理

```
/region set 1      （设置区域点1）
/region set 2      （设置区域点2）
/region define <名称>   （定义区域）
/region allow <玩家> <区域>   （允许玩家进入）
```

- **权限**: `tshock.admin.region`

### /protectspawn
保护出生点

```
/protectspawn
```

- **权限**: `tshock.world.editspawn`

---

## 传送点管理

### /warp
传送点管理

```
/warp add <名称>     （添加传送点）
/warp delete <名称>  （删除传送点）
/warp list          （列出传送点）
```

- **权限**: `tshock.admin.warp`

---

## 禁令管理

### /itemban
物品禁令

```
/itemban add <物品名>
/itemban remove <物品名>
/itemban list
```

- **权限**: `tshock.admin.itemban`

### /projban
弹幕禁令

```
/projban add <弹幕名或ID>
/projban remove <弹幕名或ID>
/projban list
```

- **权限**: `tshock.admin.projectileban`

### /tileban
物块禁令

```
/tileban add <物块名或ID>
/tileban remove <物块名或ID>
/tileban list
```

- **权限**: `tshock.admin.tileban`

---

## 聊天功能

### /me
第三人称说话

```
/me <消息>
```

- **权限**: `tshock.thirdperson`

### /party
队伍聊天

```
/party <消息>
/p <消息>
```

- **权限**: `tshock.partychat`

### /whisper
私聊

```
/whisper <玩家名> <消息>
/w <玩家名> <消息>
```

- **权限**: `tshock.whisper`

### /reply
回复私聊

```
/reply <消息>
/r <消息>
```

- **权限**: `tshock.whisper`

---

## 常用快捷命令

| 命令 | 别名 | 说明 | 权限 |
|------|------|------|------|
| `/help` | | 显示帮助 | 无 |
| `/serverinfo` | | 服务器信息 | `tshock.info` |
| `/spawn` | | 传送到出生点 | `tshock.tp.spawn` |
| `/home` | | 传送到家 | `tshock.tp.home` |
| `/warp <名>` | | 使用传送点 | `tshock.warp` |
| `/tp <玩家>` | | 传送 | `tshock.tp.self` |
| `/heal` | | 治愈自己 | `tshock.heal` |
| `/buff <增益>` | | 添加增益 | `tshock.buff.self` |
| `/god` | `/godmode` | 上帝模式 | `tshock.godmode` |
| `/clear` | | 清除聊天 | `tshock.clear` |
| `/playing` | | 查看在线玩家 | 无 |
| `/motd` | | 显示今日消息 | 无 |
| `/rules` | | 显示规则 | 无 |

---

## 常见问题

**Q: 命令无法使用？**
A: 检查是否有相应权限，或联系管理员添加权限。

**Q: 传送被阻止？**
A: 使用 `/tpallow` 开启或关闭传送保护。

**Q: 如何添加权限？**
A: 使用 `/group addperm <组名> <权限>` 添加权限。