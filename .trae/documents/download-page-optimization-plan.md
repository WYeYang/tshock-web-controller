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

### 2.3 Release URL 结构

electron-builder 的 win zip target 默认会产出类似：
```
TShock Controller 1.0.1-win-x64.zip
```

GitHub Release 的下载 URL 格式为：
```
https://github.com/WYeYang/tshock-web-controller/releases/download/v{tag}/{filename}
```

**风险点**：electron-builder 产出的文件名含空格和版本号，不同版本文件名不同，需要确认 electron-builder 的实际输出文件名，或在 release.yml 中重命名为固定文件名（推荐）。

---

## 3. 需要修改的文件

| 文件 | 改动方向 |
| --- | --- |
| [DownloadPage.tsx](file:///workspace/src/components/DownloadPage.tsx) | 下载按钮改为动态构造 GitHub Release URL + 代理镜像链接 |
| [release.yml](file:///workspace/.github/workflows/release.yml) | 去掉把 zip 拷到 `dist/download/` 的步骤；确保 Release 上传的文件名可预测 |
| [package.json](file:///workspace/package.json) | productName 检查，确保打包文件名可控 |

---

## 4. 详细改动步骤

### 4.1 release.yml 改造

**目标**：zip 文件只上传到 GitHub Releases，不再塞进 Pages 产物中。

改动 1：在 `build-electron-win` job 中，给 electron-builder 产出的 zip 一个固定/可预测的文件名（避免 electron-builder 自动加空格和版本号导致构造 URL 困难）。

方案 A（推荐）：在上传 artifact 之前重命名 zip：
```
# 在 build-electron-win job 中，上传 artifact 之前加一步
- name: Rename zip to predictable filename
  run: |
    $file = Get-ChildItem release/*.zip | Select-Object -First 1
    Rename-Item $file.FullName "TShock-Controller-win-x64.zip"
    Get-ChildItem release/
```
（注：Windows PowerShell 语法；如果用 ubuntu runner 则用 bash mv）

改动 2：在 `build-web` job 中**删除**以下步骤：
- `Create download directory`（`mkdir -p dist/download`）
- `Rename and copy zip file`（拷贝 zip 到 dist/download）

改动 3：`release` job 中 `files: release/*.zip` 不变，保持上传到 Releases。

### 4.2 DownloadPage.tsx 改造

**目标**：下载按钮动态构造为 GitHub Release 官方链接，同时提供多个代理镜像。

实现要点：

1. 读取 `packageInfo.version`，构造官方 Release URL：
   ```
   https://github.com/WYeYang/tshock-web-controller/releases/download/v{version}/TShock-Controller-win-x64.zip
   ```

2. 提供多个代理镜像链接（供国内用户选择）：
   - **ghproxy 镜像**：`https://ghproxy.com/https://github.com/WYeYang/tshock-web-controller/releases/download/v{version}/TShock-Controller-win-x64.zip`
   - **GitHub 直连**（官方，稳定但国内慢）
   - （可选）**gh-proxy.com**：`https://gh-proxy.com/https://github.com/...`

3. 把单一下载按钮改为「下载卡片」，包含：
   - 主按钮：GitHub 官方下载（英文/海外用户）
   - 次按钮：国内镜像加速下载（ghproxy）
   - 显示文件名和预计文件大小（可以写死 ~150MB 或从 Release API 拉取，这里先简化为文案提示）
   - 添加「去 Releases 页面查看所有版本」链接

4. 将「进入网页版」和「GitHub」两个次级按钮保留不变。

### 4.3 package.json 检查

检查 `package.json` 中 `build.productName` 和 `name`，确保 electron-builder 产出的文件名与 DownloadPage 中构造的一致。如果不一致，在 release.yml 中强制重命名更安全（不依赖 build 配置）。

---

## 5. 依赖与考虑事项

| 事项 | 说明 |
| --- | --- |
| Release tag 必须为 `v{version}` | 构造 URL 时使用，当前 release.yml 的触发条件已经是 `tags: ['v*']`，符合预期 |
| 文件名必须稳定 | electron-builder 默认输出可能含空格、版本号、平台名，需要在 release.yml 中重命名为固定名 `TShock-Controller-win-x64.zip` |
| ghproxy 可用性风险 | 第三方代理可能间歇性不可用，设计为「可点击跳转，不阻塞」，永远提供官方直连作为保底 |
| 文件大小展示 | 可以通过 `https://api.github.com/repos/WYeYang/tshock-web-controller/releases/latest` 在运行时获取，但需要处理网络失败。简化方案：在页面写「约 150MB」作为提示 |
| 跨平台扩展 | 当前只有 Windows 版本，后续加 macOS/Linux 时可以在 DownloadPage 中按平台检测显示对应按钮，本次计划只改 Windows |

---

## 6. 风险与回退

| 风险 | 应对 |
| --- | --- |
| Release 中文件名与页面构造的 URL 不一致 → 404 | 在 release.yml 中强制重命名；部署前手动确认 Release 页面的文件名 |
| ghproxy 镜像不可用 → 点击失败 | 文案提示「国内加速镜像，如不可用请使用官方下载」；始终保留官方直连 |
| 用户在 Release 未发布前访问下载页 → 404 | 只在 tag 触发 release 流程后才会有可下载文件，属于正常时序 |

---

## 7. 改动清单速览

1. **release.yml**：
   - 在 `build-electron-win` 中新增重命名 zip 的步骤（Windows PowerShell）
   - 从 `build-web` job 中删除「Create download directory」和「Rename and copy zip file」两步
   - `release` job 保持不变

2. **DownloadPage.tsx**：
   - 用 `packageInfo.version` 动态构造 GitHub Release URL
   - 新增国内镜像加速下载链接（ghproxy）
   - 按钮重构：官方下载 + 镜像下载 + Releases 页面入口
   - 保留「进入网页版」和「GitHub 主页」按钮

3. **package.json**：
   - 仅检查 productName，不作为改动项
