<div align="center">

<img src="assets/dsh-pixel-icon.svg" width="96" height="96" alt="dsh-pixel-skin 鲸鱼图标" />

# dsh-pixel-skin

**DeepSeek Harness Web GUI 的 8-bit / CRT 皮肤。**

这是一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的树外 Web 客户端插件。它不修改宿主，只在内置浅色 / 深色主题之上叠加完整的像素艺术视觉层。

[English](README.md) | [中文](README.zh.md)

</div>

---

## 截图

**新建对话**

<p align="center">
  <img src="assets/screenshots/new-session.png" width="80%" alt="dsh-pixel-skin 新建对话页面" />
</p>

**对话内正在工作**

<p align="center">
  <img src="assets/screenshots/working.png" width="80%" alt="dsh-pixel-skin 对话工作页面" />
</p>

**可切换配色**

<p align="center">
  <img src="assets/screenshots/palettes-light.png" width="80%" alt="dsh-pixel-skin 浅色调色板" />
</p>

<p align="center">
  <img src="assets/screenshots/palettes-dark.png" width="80%" alt="dsh-pixel-skin 深色调色板" />
</p>

顺序：retro green · cyberpunk · sunset arcade · mono terminal。

截图均在启用像素皮肤、字体模式为“纯像素”的状态下截取。

工作页截图展示了带有 Think 与 Bash 工具行的对话流。

---

## 特性

- **完整像素调色板**：同时覆盖浅色与深色模式，通过官方 `ctx.theme.overrideTokens` API 叠加。
- **可读的混合字体方案**
  - 短 UI 文案：`Fusion Pixel 12px Proportional SC`
  - 长文正文：仅拉丁字符的 `Fusion Pixel Latin` 子集 + 现代 CJK 回退（`PingFang SC` / `Microsoft YaHei`）
  - 代码与终端：`Fusion Pixel 12px Monospaced SC`
- **生成式字号补丁层**：扫描相邻的 harness checkout，修正所有仍写死 10–16px 文本的组件规则；选择器使用与 harness 构建相同的 `lightningcss` 选项生成的 CSS Module 哈希。
- **像素文档细节**
  - 硬边框 Markdown 表格、引用块、像素分隔线与复选框
  - 方形代码语言徽标（`bash`、`json`、`ts` 等）
  - 阶梯式骨架屏闪烁
  - 会话列表树形标记
- **可切换配色**
  - `retro` — 绿色 Game Boy / CRT（默认）
  - `cyberpunk` — 霓虹品红 + 青色
  - `sunset` — 温暖落日街机
  - `mono` — 单色终端
- **CRT 氛围**
  - 可调扫描线：关闭 / 轻 / 标准
  - 可选轻微暗角
  - 可选 16×16 像素光标
- **官方 favicon 像素化到 32×32**：由小型 sharp 光栅化器生成；与源图标一致，浅色模式为黑鲸，深色模式为白鲸。
- **设置面板**：位于 *设置 → 通用 → 像素皮肤*，持久化到 `localStorage`；可控制总开关、配色、扫描线、光标、暗角与字体模式。
- **可安全卸载**：插件卸载时会移除自己的样式表、favicon、token 覆盖与 body 属性。
- **响应 `prefers-reduced-motion`**：当操作系统请求减少动态效果时禁用动画。

## 字体模式

| 模式 | UI 文案 | 长文正文 | 代码 |
| --- | --- | --- | --- |
| `hybrid`（默认） | 像素比例 SC | 像素拉丁 + 现代 CJK | 像素等宽 SC |
| `pure` | 像素比例 SC | 像素比例 SC | 像素等宽 SC |

可在 **设置 → 通用 → 像素皮肤 → 字体模式** 中切换。

## 环境要求

- 需要一个 `deepseek-harness` checkout，默认位于本仓库的 `../deepseek-harness`；也可以通过构建时的 `DSH_REPO` 环境变量指定位置。
- 在皮肤构建扫描其 CSS Modules 之前，harness checkout 需要先完成客户端包构建（即 `lib/client.js` 产物）和 Web 前端 bundle（`apps/web/dist/assets/index-*.css`）。实际使用中，在 harness 仓库执行一次普通的 `pnpm run build` 即可。
- Node.js 22+。

## 构建

```bash
cd dsh-pixel-skin
npm run build

# 如果 harness checkout 位于其他位置：
DSH_REPO=/path/to/deepseek-harness npm run build
```

构建会生成：

- `src/client/font-data.ts` — base64 内嵌 Fusion Pixel 字体
- `src/client/literal-font-patches.ts` — 同时面向当前 harness checkout 的包 CSS Modules 与最终 Web bundle CSS 的哈希作用域可读性补丁
- `src/client/pixel-favicon.ts` — 官方 favicon 光栅化到 32×32 网格
- `src/client/structural-patches.ts` — composer、统计行与上下文环的哈希作用域选择器
- `lib/index.js` — 空宿主插件部分
- `lib/client.js` — 浏览器皮肤 bundle

拉取新版本 harness 或重新构建其 Web 包之后，需要重新构建皮肤。

构建完成后，刷新本地 Web profile 副本：

```bash
npm run refresh
```

这一步是必需的，因为 pnpm 会把 `file:` profile 依赖安装为副本，而不是符号链接。

## 安装到 dsh Web profile

该包是普通插件，不是 bundle。

```bash
dsh plugin --profile web add /absolute/path/to/dsh-pixel-skin
```

然后在 `$DSH_HOME/profiles/web/cordis.patch.yml` 中加入：

```yaml
- insert:
    - id: dsh-pixel-skin
      name: dsh-pixel-skin
```

重启并刷新：

```bash
dsh --profile web
```

### 卸载

从 `cordis.patch.yml` 中删除对应 `insert` 块，然后执行：

```bash
dsh plugin --profile web remove dsh-pixel-skin
```

## 项目结构

```text
dsh-pixel-skin/
├── assets/
│   ├── dsh-pixel-icon.svg          # GitHub / favicon 源图
│   ├── fonts/                      # OFL-1.1 Fusion Pixel woff2 字体文件
│   └── screenshots/                # README 截图
├── scripts/
│   ├── build.mjs                   # 字体内嵌 + CSS Module 补丁生成器
│   └── pixelate-favicon.mjs        # 官方 favicon → 32×32 网格光栅化器
├── src/
│   ├── index.ts                    # 空宿主部分
│   └── client/
│       ├── index.ts                # 插件入口
│       ├── palette.ts              # token 覆盖 + 字体缩放
│       ├── skin-style.ts           # 全局皮肤 CSS
│       ├── pixel-details.ts        # 像素表面 / 细节 CSS
│       ├── settings.ts             # localStorage 设置
│       ├── settings-row.ts         # 设置 → 通用 面板行
│       └── settings-row.module.css
└── lib/                            # 构建产物
```

## 字体与许可证

皮肤内嵌 TakWolf 的 **Fusion Pixel** 字体家族：

- `Fusion Pixel 12px Proportional SC`
- `Fusion Pixel 12px Monospaced SC`
- 生成的仅拉丁字符子集

所有字体文件均以 **SIL Open Font License 1.1** 授权。详见 [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) 与 `assets/fonts/LICENSE.fusion-pixel.txt`。

插件代码以 **MIT** 授权。

## 开发说明

- 皮肤不会修改 `deepseek-harness` 源码树。
- 颜色跟随 harness 的 `--dsw-*` 主题 token；皮肤不会硬编码一套绕过浅色 / 深色解析的调色板。
- 生成补丁表中的 CSS Module 选择器使用哈希作用域，而不是猜测可读类名。
- 设置行基于 harness 的 slot 与 locale 服务编写，与内置 Appearance 行使用同一接缝。

## 已知限制

- 构建必须针对相邻的 `deepseek-harness` checkout 执行（可通过 `DSH_REPO` 覆盖位置）。
- 拉取或重新构建 harness 可能导致包产物或 Web dist 中的 CSS Module 哈希变化；请重新执行 `npm run build` 和 `npm run refresh`。
- 正在运行的 `dsh web` 进程会继续持有旧的插件副本；请在 `npm run refresh` 后重启。
- 字体以 base64 形式内嵌在 `lib/client.js` 中。它们不会发起网络请求，浏览器仅在渲染字形时解码；如需进一步拆分体积，目前技术上可行但暂不必要。
