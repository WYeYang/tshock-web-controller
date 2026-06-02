# 实现计划：交互式控制台 - 可点击选项 + 文本输入 + 一键跳过

## 概述
将服务器控制台输出中的选项转换为可点击的按钮，同时支持文本输入（如端口、密码等），并添加"一键跳过"功能使用默认值快速启动（世界选择除外）。

## 核心功能

### 1. 交互式终端
- 实时显示服务器控制台输出
- 选项检测 → 可点击按钮
- 文本输入提示 → 输入框
- "一键跳过"按钮 → 使用默认值快速通过

### 2. 检测规则
```
选项格式：
- [1] [2] [3] → 数字选项按钮
- [Y] [N] → 是/否按钮
- [A] [B] → 字母选项按钮

文本输入格式：
- "Enter port:" → 文本输入框
- "Enter password:" → 密码输入框
- "Enter name:" → 文本输入框
```

### 3. 一键跳过逻辑
- 跳过所有需要用户输入的步骤
- 使用默认值（端口7777、无密码等）
- **但世界选择需要手动** - 因为世界大小影响游戏体验

## 完整流程

```
1. 选择目录
   ↓
2. 配置 REST API
   ↓
3. 启动服务器（交互式终端）
   ├─ 显示控制台输出
   ├─ 检测到选项 → 显示可点击按钮
   ├─ 检测到文本提示 → 显示输入框
   └─ 一键跳过 → 自动填充默认值
   ↓
4. 服务器就绪后 → 创建管理员
   ↓
5. 完成
```

## 文件修改清单

### 1. `src/components/SetupWizard.tsx`

#### 新增状态
```typescript
const [detectedOptions, setDetectedOptions] = useState<string[]>([]);
const [pendingInput, setPendingInput] = useState<{prompt: string, type: 'text' | 'password'} | null>(null);
const [inputValue, setInputValue] = useState('');
const [showSkipButton, setShowSkipButton] = useState(false);
const [skipMode, setSkipMode] = useState(false);
const [currentCommand, setCurrentCommand] = useState('');
```

#### 默认值配置
```typescript
const DEFAULT_VALUES = {
  port: '7777',
  maxPlayers: '8',
  worldName: '',
  password: '',  // 无密码
  autoAccept: 'y'  // Y
};
```

#### 选项检测和显示逻辑
```tsx
// 控制台输出区域
<div className="bg-slate-950 border border-slate-700 rounded-lg p-4 h-64 overflow-y-auto">
  {logs.map((log, index) => (
    <div key={index} className="text-slate-300 text-sm font-mono whitespace-pre-wrap">
      {log}
    </div>
  ))}
</div>

{/* 检测到的选项按钮 */}
{detectedOptions.length > 0 && (
  <div className="mt-3 flex gap-2 flex-wrap">
    <span className="text-slate-400 text-sm">选项:</span>
    {detectedOptions.map((option, index) => (
      <button
        key={index}
        onClick={() => handleOptionClick(option)}
        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-sm"
      >
        {option}
      </button>
    ))}
  </div>
)}

{/* 文本输入提示 */}
{pendingInput && (
  <div className="mt-3 flex gap-2 items-center">
    <span className="text-slate-400 text-sm">{pendingInput.prompt}</span>
    <input
      type={pendingInput.type}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handleSubmitInput()}
      className="flex-1 px-3 py-1 bg-slate-900 border border-slate-600 rounded text-white text-sm"
      placeholder={pendingInput.type === 'password' ? '输入密码...' : '输入...'}
    />
    <button
      onClick={handleSubmitInput}
      className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-sm"
    >
      确定
    </button>
  </div>
)}

{/* 一键跳过按钮 */}
{showSkipButton && (
  <div className="mt-3 flex gap-2">
    <button
      onClick={handleSkipAll}
      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded text-sm"
    >
      ⚡ 一键跳过（使用默认值）
    </button>
    <span className="text-slate-500 text-xs self-center">
      注：世界大小仍需手动选择
    </span>
  </div>
)}

{/* 手动命令输入 */}
<div className="mt-3 flex gap-2">
  <input
    type="text"
    value={currentCommand}
    onChange={(e) => setCurrentCommand(e.target.value)}
    onKeyPress={(e) => e.key === 'Enter' && handleSendCommand(currentCommand)}
    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
    placeholder="输入命令..."
  />
  <button
    onClick={() => handleSendCommand(currentCommand)}
    className="px-4 py-2 bg-cyan-600 text-white rounded"
  >
    发送
  </button>
</div>
```

#### 文本输入检测逻辑
```typescript
const detectTextInput = (text: string): {prompt: string, type: 'text' | 'password'} | null => {
  const lowerText = text.toLowerCase();
  
  // 密码输入检测
  if (lowerText.includes('password') || lowerText.includes('密码')) {
    return { prompt: '请输入:', type: 'password' };
  }
  
  // 端口输入检测
  if (lowerText.includes('port') || lowerText.includes('端口')) {
    return { prompt: '请输入端口:', type: 'text' };
  }
  
  // 名称输入检测
  if (lowerText.includes('name') || lowerText.includes('名称')) {
    return { prompt: '请输入:', type: 'text' };
  }
  
  // 最大玩家数检测
  if (lowerText.includes('players') || lowerText.includes('玩家')) {
    return { prompt: '请输入最大玩家数:', type: 'text' };
  }
  
  return null;
};
```

#### 一键跳过逻辑
```typescript
const handleSkipAll = async () => {
  setSkipMode(true);
  
  // 模拟发送默认值
  const defaults = [
    { pattern: /port/i, value: '7777' },
    { pattern: /players/i, value: '8' },
    { pattern: /name/i, value: '' },
    { pattern: /password/i, value: '' },
    { pattern: /\[?y\]?/i, value: 'y' },
  ];
  
  // 遍历日志，检测需要跳过的提示
  for (const log of logs) {
    for (const def of defaults) {
      if (def.pattern.test(log) && !def.pattern.test('world')) {
        await sendCommand(def.value);
        await new Promise(resolve => setTimeout(resolve, 500));
        break;
      }
    }
  }
  
  setSkipMode(false);
};
```

### 2. `electron/ipc/tshock.js`

#### 增强选项检测函数
```javascript
function detectOptions(text) {
  const options = [];
  
  // 检测 [Y/N] 格式
  const yesNoMatch = text.match(/\[([YNyn])\]/g);
  if (yesNoMatch) {
    yesNoMatch.forEach(match => {
      const letter = match[1].toUpperCase();
      if (!options.includes(letter)) {
        options.push(letter);
      }
    });
  }
  
  // 检测 [数字] 格式
  const numberMatch = text.match(/\[(\d+)\]/g);
  if (numberMatch) {
    numberMatch.forEach(match => {
      const num = match.slice(1, -1);
      if (!options.includes(num)) {
        options.push(num);
      }
    });
  }
  
  // 检测 [字母] 格式
  const letterMatch = text.match(/\[([A-Za-z])\]/g);
  if (letterMatch) {
    letterMatch.forEach(match => {
      const letter = match[1].toUpperCase();
      if (!options.includes(letter)) {
        options.push(letter);
      }
    });
  }
  
  return options;
}

// 检测是否需要文本输入
function detectTextInput(text) {
  const lowerText = text.toLowerCase();
  
  if (/port|端口/.test(lowerText)) {
    return { prompt: '请输入端口:', type: 'password' };
  }
  
  if (/password|密码/.test(lowerText)) {
    return { prompt: '请输入密码:', type: 'password' };
  }
  
  if (/name|名称/.test(lowerText)) {
    return { prompt: '请输入名称:', type: 'text' };
  }
  
  if (/players|玩家/.test(lowerText)) {
    return { prompt: '请输入:', type: 'text' };
  }
  
  return null;
}

// 修改 sendOutput 函数
function sendOutput(type, data) {
  const text = data.toString();
  
  outputBuffer.push({ type, data: text, timestamp: Date.now() });
  
  // 检测选项
  const options = detectOptions(text);
  const textInput = detectTextInput(text);
  
  if (options.length > 0 || textInput) {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('terminal:options-detected', { 
        options,
        textInput 
      });
    }
  }
  
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('terminal:output', { type, data: text, timestamp: Date.now() });
  }
}
```

### 3. 世界选择处理

世界大小选择需要**手动**进行，因为这是影响游戏体验的重要决策：

```tsx
// 在启动前先让用户选择世界大小
{step === 3 && (
  <div className="space-y-4">
    <h3 className="text-lg font-medium text-white">选择世界大小</h3>
    
    <div className="grid grid-cols-3 gap-3">
      <button
        onClick={() => setWorldSize(1)}
        className={worldSize === 1 ? 'bg-cyan-600' : 'bg-slate-700'}
      >
        <div className="text-lg">🌍</div>
        <div className="text-sm">小型</div>
        <div className="text-xs opacity-75">4208x2400</div>
      </button>
      <button
        onClick={() => setWorldSize(2)}
        className={worldSize === 2 ? 'bg-cyan-600' : 'bg-slate-700'}
      >
        <div className="text-lg">🌎</div>
        <div className="text-sm">中型</div>
        <div className="text-xs opacity-75">6304x3200</div>
      </button>
      <button
        onClick={() => setWorldSize(3)}
        className={worldSize === 3 ? 'bg-cyan-600' : 'bg-slate-700'}
      >
        <div className="text-lg">🌏</div>
        <div className="text-sm">大型</div>
        <div className="text-xs opacity-75">8400x4800</div>
      </button>
    </div>
    
    <p className="text-sm text-slate-400 text-center">
      其他选项可以使用"一键跳过"快速配置
    </p>
    
    <button
      onClick={() => handleStartServer()}
      disabled={!worldSize}
      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50"
    >
      启动服务器
    </button>
  </div>
)}
```

## 交互示例

### 场景1：服务器启动输出
```
TerrariaServer v1.4.4.9
请选择世界:
[1] 小型世界
[2] 中型世界
[3] 大型世界
```

**UI显示**：
- 选项按钮：[1] [2] [3]
- 跳过按钮显示

### 场景2：用户选择世界后
```
请输入服务器端口 (默认7777):
请输入最大玩家数 (默认8):
```

**UI显示**：
- 输入框 + 确定按钮
- 一键跳过按钮

### 场景3：用户点击跳过
- 自动填充默认值
- 服务器继续启动

## 一键跳过默认值

| 选项 | 默认值 |
|------|--------|
| 端口 | 7777 |
| 最大玩家数 | 8 |
| 服务器密码 | (无) |
| 其他确认 | Y |

## 优势

1. **灵活性高** - 支持任何类型的交互式输入
2. **快速启动** - 一键跳过使用默认值
3. **世界手动** - 重要选择由用户决定
4. **实时反馈** - 用户看到所有输出

## 验证清单

- [ ] 控制台输出正确显示
- [ ] 数字/字母选项正确检测
- [ ] 文本输入提示正确检测
- [ ] 一键跳过正常工作
- [ ] 世界大小必须手动选择
- [ ] 管理员创建流程正常
