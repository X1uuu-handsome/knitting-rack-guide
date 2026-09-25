# 我的编织架安装助手

手机优先的纯静态 PWA，按 18 个小步骤组装移动式编织收纳架。包含零件清单、结构 SVG、零件说明、常见错误、最终验收和本机进度保存。没有账号、服务器、数据库、付费服务或外部运行依赖。

## 本地打开

请通过本地 HTTP 服务打开；部分浏览器会阻止 `file://` 加载 JavaScript 模块，且不能在 `file://` 注册 Service Worker。在项目目录运行：

```powershell
python -m http.server 8000
```

然后打开 `http://localhost:8000/`。也可把整个目录部署到支持 HTTPS 的免费静态托管。PWA 与离线缓存需要 HTTPS 或 localhost。

## 文件

| 文件 | 用途 |
|---|---|
| `index.html` | 页面入口与导航 |
| `styles.css` | 手机优先样式与 SVG 样式 |
| `data.js` | 尺寸、零件、18 步、验收、说明与错误数据 |
| `diagrams.js` | 原生 SVG 结构图生成器 |
| `app.js` | 页面渲染、导航与 localStorage |
| `manifest.json`, `sw.js` | PWA 安装与基础离线缓存 |
| `assets/icons/` | 本地 SVG / PNG 图标 |
| `assets/photos/` | 到货后放真实照片的位置 |
| `scripts/generate_icons.py` | 用 Python 标准库生成 PNG 图标 |

## 修改内容

- **尺寸：**在 `data.js` 的 `dimensions` 中统一修改。主杆、横杆、篮子、侧梁、iPad 净距和 90mm 导线环组都在这里。部分文字说明同时写了尺寸，改规格时可搜索原数值再核对文案。
- **步骤：**在 `data.js` 的 `steps` 数组修改标题、零件、操作、检查点和图名；仍保持每步一个清晰动作。
- **结构图：**`diagrams.js` 的 `base`、`elevation`、`ringTop` 等函数分别绘制底盘、整机和导线环组。底盘中央梁始终绘在正中线。若变更连接关系，先改实物方案再改图。
- **零件照片：**将真实照片放进 `assets/photos/`，在 `app.js` 的相关页面添加本地 `<img>`。照片用于识别实物；结构关系仍以 SVG 为准。新增图片也应写入 `sw.js` 的 `FILES`，让它离线可用。
- **待实物确认：**`data.js` 的 `pendingDetails` 明确列出硅胶垫/固定环顺序、iPad 支架连接、扳手规格。确认后再更新对应步骤和图。

## 部署与 iPhone 使用

把这些文件原样部署到 [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages) 或 [Cloudflare Pages](https://developers.cloudflare.com/pages/platform/limits/)，无需构建命令。GitHub Free 使用 Pages 时仓库需公开；Cloudflare Pages 提供 Free 计划。此处尚未创建远程仓库或公开项目。打开 HTTPS 地址后，iPhone Safari 点击“分享”→“添加到主屏幕”。首次联网打开并等待页面资源缓存后，基础内容可离线查看。进度存在当前设备浏览器的 `localStorage`；清理 Safari 网站数据会清除进度。

## 装配重点

四角 T 型夹负责侧梁；四个轮子各用另一个十字夹。轮子 M6 螺杆先接外径 Φ10 的圆螺母。中央底梁连接前后横梁正中。先把篮子放到底盘，再让主杆穿过篮底。三个独立导线环内径均为 90mm，集中在主杆约 30～35cm 处，尽量同高并向三个方向展开；夹具干涉时只错开约 1～2cm。
