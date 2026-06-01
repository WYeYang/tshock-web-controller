
# 物品选择器横向铺开并保持间距计划

## 需求分析
用户要求：
- 物品网格横向铺开（拉伸填充整个容器宽度）
- 保持物品之间的间距

## 现状问题
- 当前使用 `gridTemplateColumns: 'repeat(10, auto)'` 和 `flex justify-center` 导致物品挤在中间，没有横向铺开
- 物品之间没有明显的间距

## 修改方案
### 文件修改
- **文件路径**：`src/components/ItemSelectorModal.tsx`

### 修改步骤
1. **恢复网格列宽设置**
   - 将 `gridTemplateColumns: 'repeat(10, auto)'` 改回 `repeat(10, minmax(0, 1fr))` 让列拉伸填充宽度
   - 移除外层的 `flex justify-center`

2. **保持物品间距**
   - 保持 `gap-1` 类
   - 让物品在各自单元格内居中（使用 `mx-auto` 或 `justify-center`）

3. **确保横向铺开**
   - 让网格本身填充整个容器宽度
   - 列宽拉伸，让物品均匀分布

## 预期效果
- 物品网格横向铺开，填充整个容器宽度
- 物品之间有清晰的间距
- 物品在各自单元格内居中

## 风险评估
- 低风险，仅修改样式类，不改变功能逻辑
