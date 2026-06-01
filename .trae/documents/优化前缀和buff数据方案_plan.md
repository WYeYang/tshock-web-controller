# 优化前缀和Buff数据方案

## 目标
- 正确填充前缀数据（包含中英文）
- 创建buff数据获取脚本
- 优化代码逻辑，减少token消耗

## 当前问题
1. 中文维基前缀获取失败
2. buff数据缺失
3. 需要完整的中英文对照数据

## 实现步骤

### 1. 创建前缀数据填充脚本
- 使用用户提供的完整前缀表格数据
- 自动构建中英文对照的prefixes.json
- 包含所有属性信息

### 2. 创建Buff数据获取脚本
- 从Terraria Wiki获取Buff ID列表
- 构建中英文对照的buffs.json

### 3. 更新数据访问层
- 更新`src/data/index.ts`以支持新的数据结构
- 添加Buff数据访问函数

### 4. 更新组件
- 优化`BuffSlot`组件显示
- 支持悬浮提示显示buff名称

## 技术细节
- 所有数据存储为JSON文件
- 脚本使用Node.js运行
- 保持现有API兼容

## 文件修改列表
1. 新建 `scripts/fill-prefixes.js`
2. 新建 `scripts/fetch-buffs.js`
3. 新建 `src/data/buffs.json`
4. 更新 `src/data/index.ts`
5. 更新 `src/components/BuffSlot.tsx`
