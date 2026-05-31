# 数据结构重构计划

## 需求
- 将物品和前缀数据用 JSON 文件保存
- 加载代码与数据分离
- 物品和前缀分别用独立的 JSON 文件

## 当前状态
- 数据和加载逻辑混合在 `src/data/itemData.ts` 中
- 前缀数据目前只硬编码在 `ItemTooltip.tsx` 中

## 重构方案

### 1. 数据文件结构
```
src/data/
├── items.json          # 物品数据
├── prefixes.json       # 前缀数据
└── index.ts            # 加载器和类型定义
```

### 2. 文件内容说明

#### items.json
```json
{
  "1": { "en": "Iron Pickaxe", "zh": "铁镐" },
  "2": { "en": "Dirt Block", "zh": "土块" },
  ...
}
```

#### prefixes.json
```json
{
  "1": { "en": "Legendary", "zh": "传奇" },
  "2": { "en": "Unreal", "zh": "虚幻" },
  ...
}
```

#### index.ts (新)
- 类型定义
- 数据加载函数
- 工具函数 (getItemName, getItemIconUrl, getPrefixName 等)

### 3. 修改的文件
1. 创建 `src/data/items.json`
2. 创建 `src/data/prefixes.json`
3. 创建 `src/data/index.ts` (完全重写)
4. 删除旧的 `src/data/itemData.ts`
5. 更新引用了 `itemData.ts` 的文件:
   - `src/utils/terraria.ts`
   - `src/components/ItemTooltip.tsx`

## 优点
- 数据和逻辑分离
- JSON 文件更容易编辑和版本控制
- 可以独立更新数据而不影响代码逻辑
