# 桌面模式启动引导功能实现计划

## 需求描述
在桌面模式（Electron）下启动应用时，弹出引导窗口，指导用户完成 TShock 的启动和配置，并自动保存 token。

## 完整流程
1. **选择 tshock 目录** - 用户选择 TShock 安装目录
2. **生成配置文件** - 运行 TShock.Installer.exe 生成 config.json
3. **自动配置 REST** - 软件自动写入默认 REST API 配置（不需要用户编辑）
4. **启动服务器** - 再次运行 TShock.Installer.exe 启动 TShock
5. **读取 Token** - 自动从 config.json 读取 Token
6. **保存到 localStorage** - 保存 Token 和 localhost url 到 localStorage
7. **完成** - 跳转到命令助手页面

## 实现步骤

### 步骤 1: 创建 SetupWizard 弹窗组件
**文件位置**: `src/components/SetupWizard.tsx`

**重要说明**：UI 组件必须放在 `src/components/` 目录下，因为：
- SetupWizard 是 React UI 组件，运行在渲染进程中
- Electron 目录（`electron/`）只应包含主进程和 preload 脚本代码
- 保持与现有 `src/components/` 目录结构一致

**功能**:
- 选择 tshock 目录
- 运行 TShock.Installer.exe 生成配置文件
- 自动写入默认 REST API 配置（不需要用户编辑）
- 再次运行 TShock.Installer.exe 启动服务器
- 自动从 config.json 读取 token
- 保存 token 和 localhost url 到 localStorage

**组件结构**:
```tsx
export const SetupWizard = () => {
  // 状态管理
  const [step, setStep] = useState(1); // 1-选择目录, 2-生成配置, 3-自动配置, 4-启动服务器, 5-完成
  const [tshockDir, setTshockDir] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  // 回调函数
  const onComplete = () => { /* 整个流程完成 */ };
  
  return (/* 弹窗UI */);
}
```

**UI 设计**:
- 步骤指示器（1. 选择目录 → 2. 生成配置 → 3. 自动配置 → 4. 启动服务器 → 5. 完成）
- 每个步骤对应的操作按钮和说明
- 实时日志显示区域
- 进度显示和状态反馈
- 错误提示

### 步骤 2: 在 Dashboard 中集成引导弹窗
**文件位置**: `src/components/Dashboard.tsx`

**修改内容**:
1. 导入 SetupWizard 组件
2. 添加状态控制: `const [showSetupWizard, setShowSetupWizard] = useState(false);`
3. 在 useEffect 中检测桌面模式且未配置时显示弹窗:
   ```tsx
   useEffect(() => {
     if (isElectron && !isConfigured) {
       setShowSetupWizard(true);
     }
   }, [isElectron, isConfigured]);
   ```
4. 在 Dashboard 中渲染弹窗:
   ```tsx
   {showSetupWizard && isElectron && (
     <SetupWizard 
       onComplete={() => {
         setShowSetupWizard(false);
         setCurrentView('command');
       }}
     />
   )}
   ```

### 步骤 3: 实现 Electron IPC 集成
**文件位置**: `src/components/SetupWizard.tsx` (继续)

**使用的 electronBridge 方法**:
- `electronBridge.app.selectFile()` - 选择 TShock 路径
- `electronBridge.terminal.start()` - 启动 TShock
- `electronBridge.terminal.getStatus()` - 获取服务器状态
- `electronBridge.config.setToken()` - 保存 token 到 config.json
- `electronBridge.app.setStore()` - 保存配置到应用存储

### 步骤 4: 实现业务逻辑
**文件位置**: `src/components/SetupWizard.tsx` (继续)

**步骤 1 - 选择目录**:
- 显示目录选择对话框
- 验证选择的目录是否存在 TShock.Installer.exe
- 保存目录路径到组件状态

**步骤 2 - 生成配置文件**:
- 运行 `tshockDir/TShock.Installer.exe` 生成配置文件
- 等待安装程序完成（可能需要用户交互）
- 显示生成状态的日志
- 完成后进入步骤 3

**步骤 3 - 自动配置 REST**:
- 调用 `electronBridge.config.read()` 读取现有的 config.json
- 自动修改以下配置项：
  - RestApiEnabled: true
  - RestApiPort: 7878
  - Token: [自动生成或使用预设值]
  - EnableTokenLoginAuthentication: true
- 调用 `electronBridge.config.write()` 保存配置
- 显示配置成功的日志

**步骤 4 - 启动服务器**:
- 再次运行 `tshockDir/TShock.Installer.exe` 启动 TShock
- 监听服务器输出日志
- 实时显示启动日志到界面
- 等待服务器完全启动

**步骤 5 - 自动读取 Token 并完成**:
- 调用 `electronBridge.config.read()` 读取 config.json
- 从 config.json 中提取 Token 字段
- 验证 Token 是否存在且有效
- 保存配置到 localStorage:
  ```tsx
  updateTshockConfig({
    serverUrl: 'http://localhost:7878',
    token: tokenFromConfig,
    username: '',
    password: ''
  });
  ```
- 显示成功信息
- 关闭弹窗
- 跳转到命令助手页面

### 步骤 5: 添加主进程支持（如果需要）
**如果需要运行 TShock.Installer.exe**：
- 在 Electron 主进程中添加新的 IPC 处理器
- 使用 `child_process.spawn` 启动 TShock.Installer.exe
- 实时返回程序输出到渲染进程
- 处理程序的退出码

**实现 IPC 处理器**（在 electron/main.js 中）:
```javascript
ipcMain.handle('app:run-installer', async (event, tshockDir) => {
  return new Promise((resolve, reject) => {
    const installerPath = path.join(tshockDir, 'TShock.Installer.exe');
    const child = spawn(installerPath, [], {
      cwd: tshockDir,
      detached: true
    });

    child.stdout.on('data', (data) => {
      mainWindow.webContents.send('installer:output', data.toString());
    });

    child.stderr.on('data', (data) => {
      mainWindow.webContents.send('installer:output', data.toString());
    });

    child.on('close', (code) => {
      resolve({ success: code === 0, exitCode: code });
    });
  });
});
```

## 技术要点

### 1. 状态管理
- 使用 useState 管理向导状态
- 使用 useEffect 监听 TShock 服务器状态
- 使用 electronBridge 与 Electron 主进程通信

### 2. 错误处理
- 每个步骤都有错误捕获和显示
- 提供重试机制
- 显示友好的错误提示

### 3. 用户体验
- 清晰的步骤指示
- 实时状态反馈
- 加载状态指示器
- 自动跳转到下一步

## 样式设计
- 使用与现有应用一致的 UI 风格
- 赛博朋克/霓虹风格
- 玻璃态卡片效果
- 渐变按钮

## 测试要点
- 桌面模式首次启动时显示弹窗
- 各步骤之间的状态流转正确
- TShock.Installer.exe 的正确调用（生成配置和启动服务器）
- 服务器启动日志的实时显示
- 默认 REST API 配置自动写入 config.json
- 从 config.json 成功读取 Token
- Token 正确保存到 localStorage
- 关闭弹窗后跳转到命令助手

## 默认 REST API 配置值
```javascript
const defaultRestConfig = {
  RestApiEnabled: true,
  RestApiPort: 7878,
  Token: crypto.randomBytes(32).toString('hex'), // 自动生成 64 位 Token
  EnableTokenLoginAuthentication: true
};
```

## 技术实现细节

### 1. TShock.Installer.exe 调用方式
由于 TShock.Installer.exe 是交互式程序，需要：
- 使用 `child_process.spawn` 启动程序
- 监听 stdout/stderr 获取输出
- 可能需要处理 Windows 的用户交互窗口

### 2. 目录选择
使用 `electronBridge.app.selectFile()` 选择目录：
```tsx
const result = await selectFile({
  properties: ['openDirectory'],
  title: '选择 TShock 安装目录'
});
```

### 3. 配置编辑器简化版
在弹窗内提供简化的配置表单：
```tsx
interface TShockConfigForm {
  RestApiEnabled: boolean;
  RestApiPort: number;
  Token: string;
  EnableTokenLoginAuthentication: boolean;
}
```

### 4. Token 生成
可以调用 `electronBridge.config.generateToken()` 生成随机 Token。

## 与现有代码的集成

### Dashboard.tsx 集成
```tsx
useEffect(() => {
  if (isElectron && !isConfigured) {
    setShowSetupWizard(true);
  }
}, [isElectron, isConfigured]);
```

### useConfig hook 集成
- 直接调用 `updateTshockConfig()` 保存到 localStorage
- 使用现有的 `save()` 方法

### electronBridge 集成
- `electronBridge.app.selectFile()` - 选择目录
- `electronBridge.config.read()` - 读取 config.json
- `electronBridge.config.write()` - 写入 config.json
- `electronBridge.config.generateToken()` - 生成 Token
- 可能需要新增 `electronBridge.app.runInstaller()` - 运行 TShock.Installer.exe

