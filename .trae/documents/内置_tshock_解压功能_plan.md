# 内置 TShock 解压功能实现计划

## 一、需求概述

用户要求：
1. 将 `TShock-6.1.0-for-Terraria-1.4.5.6-win-x64-Release.zip` 内置到项目中
2. 用户可以选择直接使用这个内置版本（无需自己选择路径）
3. 解压前需要删除旧文件夹

## 二、项目结构分析

### 现有功能
- **SetupWizard**：提供 TShock 配置向导
- **config.js**：处理配置文件读写和路径管理
- **tshock.js**：管理 TShock 进程
- **electronBridge**：封装 Electron API
- **package.json**：已有 `adm-zip` 依赖（版本 0.5.16）

### 文件夹规划
```
tshock-web-controller/
├── resources/              # 新增：存放内置资源
│   └── TShock-6.1.0-for-Terraria-1.4.5.6-win-x64-Release.zip
├── electron/
│   └── ipc/
│       ├── config.js       # 修改：添加解压功能
│       └── tshock.js       # 现有功能
└── src/
    ├── components/
    │   └── SetupWizard.tsx # 修改：添加内置版本选项
    └── services/
        └── electronBridge.ts # 修改：添加解压 API
```

## 三、实现步骤

### 1. 资源文件管理
- **创建** `resources/` 文件夹
- **移动** TShock zip 到 `resources/`
- **更新** `package.json` 的 `build.extraResources`，让 zip 文件包含在 Electron 构建中

### 2. Electron 后端实现（config.js）
- **新增** `extractBuiltinTShock` 函数
  - 检测应用数据目录或用户选择的目录
  - 删除旧文件夹（如果存在）
  - 使用 adm-zip 解压内置 zip
  - 返回解压后的路径
  
- **新增** IPC 处理器
  - `app:extract-builtin-tshock`: 执行解压
  - `app:get-builtin-tshock-info`: 获取内置版本信息

### 3. 前端 API 更新（electronBridge.ts）
- **添加** TypeScript 接口
- **实现** `extractBuiltinTShock` 函数
- **实现** `getBuiltinTshockInfo` 函数

### 4. SetupWizard UI 更新
- **新增** 步骤 1 选项
  - "使用内置版本（推荐）" - 按钮
  - "自己选择路径" - 按钮
- **新增** 解压进度显示
- **更新** 后续流程以适应两种选择

### 5. 更新 electron-builder 配置
- 在 `package.json` 中添加 resources 目录到 `extraResources`

## 四、技术细节

### 解压逻辑
1. 确定解压目标位置：
   - 首选：应用程序目录下的 TShock 文件夹（`path.join(app.getAppPath(), '../TShock')` 或使用 `process.cwd()/TShock`）

2. 清理操作：
   - 检查目标文件夹是否存在
   - 递归删除旧文件夹

3. 解压操作：
   - 使用 `adm-zip` 库
   - 显示解压进度

### 文件修改清单

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| `resources/TShock-...zip` | 新增 | 内置资源 |
| `electron/ipc/config.js` | 修改 | 添加解压功能 |
| `src/services/electronBridge.ts` | 修改 | 添加 API |
| `src/components/SetupWizard.tsx` | 修改 | UI 更新 |
| `package.json` | 修改 | 更新 build 配置 |

## 五、风险和注意事项

1. **解压时间**：zip 文件可能较大，需要提示用户耐心等待
2. **权限问题**：解压时可能遇到文件权限问题
3. **旧数据处理**：删除旧文件夹前要确认是否会丢失用户重要数据
4. **磁盘空间**：需要检查解压目录是否有足够空间
5. **跨平台**：目前只考虑 Windows，后续可以扩展支持其他平台

## 六、用户体验

1. 提供清晰的选择界面
2. 解压时有进度反馈
3. 出错时有详细的错误信息
4. 解压完成后自动继续配置流程
