# 计划：内置版本增加重新安装开关 + 文本修改

## 概要
1. "使用内置版本"选项增加"重新安装"开关，关闭时检查目标目录已有文件则跳过解压，打开时强制重新解压（当前默认行为）
2. 使用内置版本后，将解压路径保存到"上次使用路径"
3. "选择新路径"改为"选择已有的版本"

## 当前状态分析

- `UnzipCommandHandler.execute(args)` 接收 `[zipPath, targetDir]`，默认会先删除目标目录再解压
- `handleUseBuiltinTshock()` 发送 `unzip "zipPath" "targetDir"` 命令
- `savedPath` 目前只在手动选择目录时保存

## 修改计划

### 1. `electron/ipc/command-handlers/unzip.js` - 添加 `--skip-existing` 参数

```js
async execute(args) {
  // 解析参数
  const skipExisting = args.includes('--skip-existing');
  const filteredArgs = args.filter(a => !a.startsWith('--'));
  
  if (filteredArgs.length < 2) { ... }
  
  const zipPath = filteredArgs[0];
  const targetDir = filteredArgs[1];

  // 如果 --skip-existing 且目标目录已存在且非空，跳过解压
  if (skipExisting && this.fs.existsSync(targetDir)) {
    const files = this.fs.readdirSync(targetDir);
    if (files.length > 0) {
      this.sendOutput('Target directory already exists, skipping extraction.\r\n');
      return true;
    }
  }

  // 原有的删除+解压逻辑...
}
```

### 2. `SetupWizard.tsx` - 添加 reinstall 状态

```tsx
const [reinstall, setReinstall] = useState(false);
```

### 3. `SetupWizard.tsx` - 修改 handleUseBuiltinTshock

- `reinstall` 为 false：发送 `unzip "zipPath" "targetDir" --skip-existing`
- `reinstall` 为 true：发送 `unzip "zipPath" "targetDir"`（当前默认行为，删除后解压）
- 解压完成后保存路径到 savedPath 和 localStorage

### 4. `SetupWizard.tsx` - UI：内置版本选项增加重新安装开关

在"使用内置版本"label 内右侧添加 toggle 开关，`onClick` 时 `e.stopPropagation()` 防止触发选项选中。

### 5. `SetupWizard.tsx` - 文本修改

- "选择新路径" → "选择已有的版本"
- "选择一个新的 TShock 安装目录" → "选择一个已有的 TShock 安装目录"

### 6. `SetupWizard.tsx` - 选择已有版本时默认打开 APP 根目录

"选择已有的版本"按钮的 `selectFile` 添加 `defaultPath`，使用 `electronBridge.app.getAppRootPath()` 获取应用根目录。

需要在后端添加 IPC：
- `electron/ipc/config.js`：添加 `app:get-app-root-path` handler，返回 `getTShockRootDir()` 的父目录
- `electron/preload.cjs`：添加 `getAppRootPath` 方法
- `src/services/electronBridge.ts`：添加 `getAppRootPath` 方法和类型

## 验证步骤
1. TypeScript 编译无错误
2. 重新安装开关关闭时，目标已存在则跳过解压
3. 重新安装开关打开时，删除旧文件后重新解压
4. 使用内置版本后，savedPath 自动更新
5. 文本已更新
