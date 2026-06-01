# 下载本地物品图片计划

## 问题分析

当前物品图片都是从 Terraria Wiki 在线加载，存在以下问题：
- 图片加载速度慢
- 部分图片可能加载失败
- 没有缓存策略

## 解决方案

将所有物品图片下载到本地，使用 ID 标识，通过本地文件加载。

## 实施步骤

### 1. 创建图片下载脚本
- 在 `scripts/` 目录下创建 `download-item-images.js` 脚本
- 功能：
  - 遍历所有物品 ID，从 Terraria Wiki 下载物品图标
  - 将图片保存到 `public/images/items/` 目录
  - 使用 ID 作为文件名（如 `item_1.png`）
  - 支持断点续传，避免重复下载
  - 处理下载失败的情况

### 2. 修改 `getItemIconUrl` 函数
- 在 `src/data/index.ts` 中修改 `getItemIconUrl` 函数
- 改为返回本地路径：`/images/items/item_${netId}.png`
- 如果本地图片不存在，可以考虑回退到在线加载

### 3. 验证
- 运行下载脚本下载所有图片
- 测试玩家详情弹窗中的物品显示
- 确保图片正确加载

## 文件修改

- **新建**：`scripts/download-item-images.js` - 图片下载脚本
- **修改**：`src/data/index.ts` - 修改 `getItemIconUrl` 函数

## 注意事项

- 下载可能需要较长时间（物品可能有数千个）
- 需要确保有足够的磁盘空间
- 下载失败的图片需要记录，后续可以手动补充
- 可以考虑分批次下载，避免对 Wiki 服务器造成压力
