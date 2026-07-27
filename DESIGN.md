---
name: ChugChug
description: Dark glass marketing site for an iOS party drinking-game app
colors:
  canvas: "#09090a"
  canvas-deep: "#080809"
  paper: "#f4f1eb"
  muted: "rgba(244, 241, 235, 0.56)"
  gold: "#f2cf79"
  ambient-warm: "#eeb64d"
  ambient-balance: "#d688c2"
  cta: "#e9d5a3"
  cta-ink: "#171512"
  cta-hover: "#f3e2b8"
  glass-tint: "rgba(255, 255, 255, 0.1)"
  glass-stroke: "rgba(255, 255, 255, 0.11)"
  line: "rgba(255, 255, 255, 0.1)"
  accent-teal: "#79cbd2"
  accent-pink: "#dc8bc9"
  accent-violet: "#b082dd"
  accent-rose: "#e58b92"
  accent-amber: "#e9aa6b"
typography:
  display:
    fontFamily: "ChugChug Rounded, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(64px, 11vw, 148px)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(40px, 5.4vw, 68px)"
    fontWeight: 650
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(22px, 2.4vw, 28px)"
    fontWeight: 620
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  body-xs:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Helvetica Neue, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.4
  meta:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.3
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Helvetica Neue, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.16em"
  brand-nav:
    fontFamily: "ChugChug Rounded, ui-rounded, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 800
    letterSpacing: "-0.04em"
  store:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.1
rounded:
  card: "22px"
  control: "999px"
  download: "28px"
  download-mobile: "20px"
  phone: "44px"
  phone-min: "32px"
spacing:
  section: "clamp(96px, 12vw, 160px)"
  touch-min: "44px"
  cta-height: "60px"
components:
  button-store:
    backgroundColor: "{colors.cta}"
    textColor: "{colors.cta-ink}"
    rounded: "{rounded.control}"
    height: "{spacing.cta-height}"
    padding: "12px 22px"
  button-store-hover:
    backgroundColor: "#f3e2b8"
    textColor: "{colors.cta-ink}"
  nav-pill:
    backgroundColor: "rgba(255, 255, 255, 0.07)"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    height: "{spacing.touch-min}"
  game-card:
    backgroundColor: "rgba(18, 18, 19, 0.88)"
    textColor: "{colors.paper}"
    rounded: "{rounded.card}"
---

# Design System: ChugChug

## Overview

**Creative North Star: "After-Hours Glass Bar"**

深色夜晚画布上的半透明玻璃与暖金高光，像派对后半场的吧台灯光：品牌字要大、截图要真、交互要少而明确。气质偏 iOS 营销页，而不是仪表盘或卡片堆砌的 SaaS 模板。

拒绝：浅色奶油衬线海报风、紫色霓虹 AI 默认、报纸细线排版、首屏塞满统计与徽章。

**Key Characteristics:**
- 深色 canvas + 暖金强调
- 玻璃描边与轻投影，而不是厚重多层阴影
- 品牌展示字（ChugChug Rounded）压过正文
- 真实手机截图作为主视觉证据

## Colors

夜晚派对色板：近黑底、奶油纸色字、暖金 CTA，辅以粉金环境光。

### Primary
- **Warm Gold** (`#f2cf79`): 品牌标记、强调词、焦点环、关键高光
- **CTA Champagne** (`#e9d5a3`): App Store 按钮底色，文字用深墨 `#171512`

### Secondary
- **Ambient Pink** (`#d688c2`): 背景光晕平衡暖金，不作为主按钮色

### Neutral
- **Canvas** (`#09090a` / `#080809`): 页面底
- **Paper** (`#f4f1eb`): 主文字
- **Muted** (`rgba(244,241,235,0.56)`): 次级说明，保持 ≥4.5:1

## Typography

展示层用 ChugChug Rounded；界面层用系统 SF/Helvetica 栈以贴近 iOS。

- Display：hero 品牌名，极大字号、极紧行高
- Headline / Title：分区与功能标题
- Body：说明与规则
- Label：kicker 与卡片提示（大写字距）

## Layout

- 首屏单一构图：品牌 + 一句副文案 + CTA + 全宽截图跑马灯
- 内容最大宽约 920–1120px，左右内边距随断点收紧
- 游戏区：桌面 4 列，平板 3 列，手机 2 列；精选卡跨列
- 断点：`900px`、`680px`

## Elevation & Depth

- 结构深度来自半透明层、细描边与短投影（`--glass-shadow`）
- 环境光用大面积径向模糊，装饰性而非交互层
- 毛玻璃：导航保留轻 blur；卡片/下载区默认用不透明玻璃底，仅在可悬停桌面增强 blur，避免低端机掉帧

## Shapes

- 卡片：`22px`
- 控件/导航：全圆角 pill
- 手机框：大圆角 + 深色边框，像实体设备

## Components

- **Store button**：香槟底、Apple 标记、双行文案，高度 60px
- **Glass nav**：固定居中胶囊，品牌金字 + 下载 pill
- **Game card**：可翻转按钮，`--accent` 按 `data-game-key` 着色；需有 `:focus-visible` 金环
- **Screenshot marquee**：可拖拽、按钮与方向键；克隆组使用 `content-visibility`
- **Language switcher**：≥44px 触控目标

## Do's and Don'ts

**Do**
- 让品牌名成为首屏最强信号
- 用真实截图证明产品，而不是抽象插画
- 保持次级文字对比度 ≥4.5:1
- 尊重 `prefers-reduced-motion`

**Don't**
- 在首屏堆统计、徽章、日程或促销贴纸
- 用低透明度灰字「假装」次级层级
- 引入紫色霓虹或浅色衬线海报默认皮肤
- 让游戏强调色散落在 JS 内联样式（应走 CSS `data-game-key`）
