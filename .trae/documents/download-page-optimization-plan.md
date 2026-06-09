# 下载页面链接改造与优化计划

## 1. 需求分析

用户提出以下需求：

| 需求 | 说明 |
| --- | --- |
| 下载链接改为 Release 链接 | 将 `./download/TShock-Controller-win-x64.zip` 改为 GitHub Releases 官方下载地址 |
| 去掉 zip 包的 Pages 部署 | 移除 release.yml 中把 zip 复制到 `dist/download/` 的步骤 |
| 优化下载速度 | 为国内用户提供更快的镜像/代理下载渠道 |
| 添加代理下载链接 | 提供多个下载源，用户可选择最快的 |

---

## 2. 当前实现调研结论

### 2.1 下载页面 [DownloadPage.tsx](file:///workspace/src/components/DownloadPage.tsx)

- 下载按钮硬编码链接：`./download/TShock-Controller-win-x64.zip`
- 版本号从 `package.json` 读取：`packageInfo.version`
- 页面其余部分为静态展示（特色、安装说明等）

### 2.2 部署流程 [release.yml](file:///workspace/.github/workflows/release.yml)

当前部署流程同时做了两件重复的事：

1. **GitHub Pages 部署**：把 zip 拷到 `dist/download/` 后作为 Pages 静态文件发布 → 下载速度较慢
2. **GitHub Release**：用 `softprops/action-gh-release@v2` 上传 zip 到 Releases → 这是真正应该使用的下载源

### 2.3 Release URL 结构（关键修正）

根据用户反馈，electron-builder 实际产出的文件名格式为：

```
TShock Controller-1.0.1-win.zip
```

格式说明：`${productName}-${version}-${platform}.zip`

GitHub Release 的下载 URL 格式为：
```
https://github.com/WYeYang/tshock-web-controller/releases/download/v{tag}/TShock Controller-{version}-win.zip
```

**注意**：URL 中的空格会被编码为 `%20`，构造 URL 时需要处理。

---

## 3. 需要修改的文件

| 文件 | 改动方向 |
| --- | --- |
| [DownloadPage.tsx](file:///workspace/src/components/DownloadPage.tsx) | 下载按钮改为动态构造 GitHub Release URL + 代理镜像链接 |
| [release.yml](file:///workspace/.github/workflows/release.yml) | 去掉把 zip 拷到 `dist/download/` 的步骤 |
| [package.json](file:///workspace/package.json) | 确认 productName 和 version 配置正确 |

---

## 4. 详细改动步骤

### 4.1 release.yml 改造

**目标**：zip 文件只上传到 GitHub Releases，不再塞进 Pages 产物中。

改动：在 `build-web` job 中**删除**以下步骤：
- `Create download directory`（`mkdir -p dist/download`）
- `Rename and copy zip file`（拷贝 zip 到 dist/download）

**说明**：无需重命名 zip，因为 electron-builder 已经产出标准文件名 `TShock Controller-{version}-win.zip`，可以直接用 `packageInfo.version` 构造 URL。

### 4.2 DownloadPage.tsx 改造

**目标**：下载按钮动态构造为 GitHub Release 官方链接，同时提供多个代理镜像。

实现要点：

1. 读取 `packageInfo.version`，构造官方 Release URL：
   ```typescript
   const fileName = `TShock Controller-${packageInfo.version}-win.zip`;
   const encodedFileName = encodeURIComponent(fileName);
   const githubUrl = `https://github.com/WYeYang/tshock-web-controller/releases/download/v${packageInfo.version}/${encodedFileName}`;
   ```

2. 提供多个代理镜像链接（供国内用户选择）：
   - **ghproxy 镜像**：`https://ghproxy.com/${githubUrl}`
   - **GitHub 直连**（官方，稳定但国内慢）

3. 把单一下载按钮改为「下载卡片」，包含：
   - 主按钮：GitHub 官方下载（英文/海外用户）
   - 次按钮：国内镜像加速下载（ghproxy）
   - 显示文件名和版本信息
   - 添加「去 Releases 页面查看所有版本」链接

4. 将「进入网页版」和「GitHub」两个次级按钮保留不变。

### 4.3 package.json 检查

确认 `productName: "TShock Controller"` 和 `version: "1.0.1"` 配置正确，确保 electron-builder 产出的文件名与 DownloadPage 中构造的一致。

---

## 5. 依赖与考虑事项

| 事项 | 说明 |
| --- | --- |
| Release tag 必须为 `v{version}` | 构造 URL 时使用，当前 release.yml 的触发条件已经是 `tags: ['v*']`，符合预期 |
| 文件名中的空格需编码 | URL 中的空格必须用 `encodeURIComponent` 编码为 `%20` |
| ghproxy 可用性风险 | 第三方代理可能间歇性不可用，设计为「可点击跳转，不阻塞」，永远提供官方直连作为保底 |
| 文件大小展示 | 简化方案：在页面写「约 150MB」作为提示 |
| 跨平台扩展 | 当前只有 Windows 版本，后续加 macOS/Linux 时可以在 DownloadPage 中按平台检测显示对应按钮 |

---

## 6. 风险与回退

| 风险 | 应对 |
| --- | --- |
| Release 中文件名与页面构造的 URL 不一致 → 404 | 部署前手动确认 Release 页面的文件名；如果文件名格式有变化，调整 DownloadPage 中的构造逻辑 |
| ghproxy 镜像不可用 → 点击失败 | 文案提示「国内加速镜像，如不可用请使用官方下载」；始终保留官方直连 |
| 用户在 Release 未发布前访问下载页 → 404 | 只在 tag 触发 release 流程后才会有可下载文件，属于正常时序 |

---

## 7. 改动清单速览

1. **release.yml**：
   - 从 `build-web` job 中删除「Create download directory」和「Rename and copy zip file」两步
   - `release` job 保持不变（继续上传 zip 到 Releases）

2. **DownloadPage.tsx**：
   - 用 `packageInfo.version` 动态构造 GitHub Release URL（处理空格编码）
   - 新增国内镜像加速下载链接（ghproxy）
   - 按钮重构：官方下载 + 镜像下载 + Releases 页面入口
   - 保留「进入网页版」和「GitHub 主页」按钮

3. **package.json**：
   - 确认 productName 和 version 配置正确，无需改动
