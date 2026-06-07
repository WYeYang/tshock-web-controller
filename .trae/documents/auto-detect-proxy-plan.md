# 自动检测代理方案分析

## 问题背景

当前 Web 版和桌面版的 REST 请求地址处理方式不一致：
- 桌面版（Electron）：直接请求完整 URL（`http://localhost:7878/v2/server/status`）
- Web 版：请求相对路径（`/api/v2/server/status`）由代理转发

## 解决方案：直接请求 + 失败自动降级

### 核心思路

1. **Web 版直接用完整 URL 请求**（与桌面版一致）
2. **如果请求失败**（特别是 CORS 错误），**自动用代理路径重试一次**
3. **缓存检测结果**，后续请求直接使用成功的方式，不再重试

### 实现细节

#### 1. 缓存机制

- 使用 localStorage 或内存缓存记录检测结果
- 缓存键：`tshock-direct-request-{serverUrl}`
- 缓存值：`'success' | 'failed' | null`

#### 2. 请求流程

```typescript
// 伪代码
async request(endpoint, options) {
  const cacheKey = `tshock-direct-request-${serverUrl}`;
  const cachedResult = localStorage.getItem(cacheKey);
  
  // 根据缓存决定初始策略
  let useDirect = cachedResult !== 'failed';
  
  while (true) {
    try {
      const url = useDirect 
        ? `${serverUrl}${endpoint}`  // 直接请求
        : `/api${endpoint}`;        // 代理路径
      
      const response = await fetch(url, options);
      
      // 成功，更新缓存
      if (useDirect) {
        localStorage.setItem(cacheKey, 'success');
      }
      return response;
      
    } catch (error) {
      // 如果是直接请求失败，尝试代理路径
      if (useDirect && cachedResult !== 'failed') {
        localStorage.setItem(cacheKey, 'failed');
        useDirect = false;
        continue; // 重试
      }
      throw error;
    }
  }
}
```

### 修改文件

- [tshockApi.ts](file:///workspace/src/services/tshockApi.ts)：核心逻辑修改

### 优势

- ✅ 代码逻辑统一，Web 版和桌面版一致
- ✅ 只有在直接请求失败时才会有第二次请求
- ✅ 缓存机制，后续请求无需重试
- ✅ 性能最优：成功时只有一次请求

### 实现步骤

1. 添加缓存机制（localStorage）
2. 修改 `request` 方法支持自动降级重试
3. 移除平台相关的特殊处理逻辑
