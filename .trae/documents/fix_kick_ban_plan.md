
# 修复踢人和封禁功能问题修复计划

## 问题描述
当前踢人和封禁功能失败，错误信息显示：
- `/api/v2/players/kick?player=` - player参数为空
- 返回401未授权错误

## 问题根因（已找到）
从API测试返回数据可以看到：
```json
{
  "nickname": "wen23",
  "username": "",  // 这个是空的！
  "group": "guest",
  ...
}
```

**原因**：我们在StatusPage中调用`kickPlayer(confirmDialog.player.username)`，但username字段是空的，应该使用nickname！

## 需要修改的文件

### 1. StatusPage.tsx
- 修改`confirmAction`函数，使用`nickname`而不是`username`来调用API
- 在`handleKick`和`handleBan`中也需要确认参数

## 修复步骤
1. 修改StatusPage.tsx，使用nickname作为API调用参数
2. 测试踢人和封禁功能

## 验证方法
- 确保玩家的nickname正确传递给API
