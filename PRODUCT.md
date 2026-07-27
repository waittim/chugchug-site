# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

派对场景下的朋友、同学、同事——需要快速开局、少解释、在弱网或离线环境也能玩下去的人。站点访客主要是想确认 App 玩法与下载入口的潜在用户。

## Product Purpose

ChugChug（中文品牌：吨吨吨）是一款 iOS 派对喝酒游戏 App 的官方营销站。站点目标是用真实产品截图与游戏清单说明「不带道具也能玩到散场」，并引导前往 App Store 下载。

成功标准：访客理解产品定位、看到足够玩法证据、完成下载点击。

## Positioning

All-in-one 派对游戏包：规则与道具已内置；强调离线可玩、防误触/醉酒友好、无广告、iOS 独占。这不是通用社交产品页，而是线下聚会工具的落地页。

## Operating Context

- 首页：`/`（`?lang=en|zh|zh-Hant`）
- 隐私政策：`/privacy.html`（同语言参数）
- 主 CTA：App Store（`id6758532049`）
- 支持邮箱：`support@chugchug.app`
- 部署：GitHub Pages，自定义域名 `chugchug.app`
- 本地开发：`npm run dev`（Vite）

## Capabilities

- 三语内容（简体 / 繁体 / 英文）
- 全量 App 截图跑马灯（可拖拽、键盘与按钮浏览）
- 可翻转的游戏规则卡片网格
- 下载区与页脚语言切换
- 隐私政策说明（本地玩法、不收集 PII）

## Constraints

- 视觉与内容需保持派对/喝酒游戏语境；不得暗示收集账号或联网依赖
- 站点为静态营销站，不承载登录或支付
- 仅宣传 iOS；不得声称 Android 可用
- 饮酒相关文案需遵守当地法定年龄语境（隐私政策已声明）

## Evidence

- App Store 链接与截图资源位于 `public/screenshot/{en,zh}/`
- Schema.org `MobileApplication` 与 OG/Twitter 元数据写在 `index.html`
- 隐私政策文案在 `src/content/privacy.js`

## Brand Commitments

- 英文品牌名：ChugChug
- 简体中文品牌名：吨吨吨
- 展示字体：ChugChug Rounded（本地字体）
- 主强调色：暖金 `#F2CF79`，深色画布 `#09090A`

## Accessibility

- 目标：WCAG AA 级可读与键盘可达
- 已落实：skip link、`:focus-visible`、触控 ≥44px、截图区键盘控制、`prefers-reduced-motion` 尊重

## Open Questions

- （推断）是否需要独立繁体截图资源集，还是继续与简体共用 `zh/` 截图
- （推断）是否计划增加定价/评价社会证明模块
