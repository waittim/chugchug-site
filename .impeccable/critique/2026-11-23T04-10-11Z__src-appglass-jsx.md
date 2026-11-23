---
target: src/AppGlass.jsx
total_score: 25
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 1
timestamp: 2026-11-23T04-10-11Z
slug: src-appglass-jsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 3 | 跑马灯分页点与交互反馈明确，但移动端卡片水平拖拽缺乏阈值微提示 |
| 2 | Match System / Real World | 4 | 碰杯音效光效、酒吧杯垫翻转、线下派对心理语言（“少解释多尽兴”）高度贴合实景 |
| 3 | User Control and Freedom | 2 | `useSectionSnap.js` 的 JS 滚轮拦截（Scroll-jacking）与 Mac 触控板/高精度滚轮产生激烈对抗 |
| 4 | Consistency and Standards | 3 | Token 存在漂移：硬编码 `#FFD16A`、背景色与 `DESIGN.md` 不完全一致，且混入了洋红背景光 |
| 5 | Error Prevention | 4 | 完善的内嵌浏览器（微信/TikTok/Instagram）弹窗拦截，彻底规避 App Store 重定向失效 |
| 6 | Recognition Rather Than Recall | 3 | 规则前置卡片设计良好，但 12 张游戏卡片全部折叠为均一暗灰底色，缺乏辨识锚点 |
| 7 | Flexibility and Efficiency | n/a | Persuade 营销落地页，非多步专家操作型工具 |
| 8 | Aesthetic and Minimalist Design | 3 | 整体暗黑酒吧微醺格调极高，但背景洋红光晕（`#D88BC5`）与品牌主承诺“暖金”相冲突 |
| 9 | Error Recovery | 3 | 图片加载 fallback 与一键复制浏览器链接流程清晰完整 |
| 10 | Help and Documentation | n/a | 营销落地页；支持邮箱（`support@chugchug.app`）与隐私政策触达路径明确 |
| **Total** | | **25/32** | **Good** |

#### Design Specificity Verdict

**LLM assessment**: 
页面在设计专属度（Specificity）上表现优异，绝非套用常规 SaaS 或通用 App 模板的产物。
1. **仪式感锚点**：Hero 首屏的“碰杯”（Clink）互动字标兼具弧线摆动、光点碰撞火花与液体流动感，极富线下聚会开局的欢快氛围；
2. **证据优先**：直接使用真实 iOS 游戏界面的跑马灯，规避了假大空的抽象矢量插画，快速建立信任；
3. **痛点文案**：“不带道具，也能玩到散场”、“醉酒友好”，直击线下聚会缺少骰子扑克的尴尬。
然而，专属性在以下两处产生严重断层：一是背景意外混入了 `rgba(216, 139, 197, 0.38)` 的洋红霓虹光斑，破坏了原本纯正的高级“夜间暖金酒吧”调性；二是下方的 12 款游戏卡片在 `src/AppGlass.jsx` 中被写死 `isFeatured = false` 且关闭截图，使得大话骰、真心话大冒险等主力游戏全被降级为单一暗灰方块。

**Deterministic scan**:
机械探测器在项目样式依赖树中共捕捉到 **30 项规则命中**（8 项 Warning，22 项 Advisory）：
- **`bounce-easing` (5 处 Warning)**：Hero 碰杯碰撞关键帧中的 `cubic-bezier(0.16, 0.9, 0.3, 1.25)`（使酒杯碰撞产生轻微橡胶反弹感而非坚硬玻璃撞击）以及应用内指引箭头的无限 `inapp-bounce`。
- **`design-system-font` (3 处 Warning)**：`home.css` 与 `nunito-font.css` 中独立声明并前置 `"Nunito"` 字体族，绕过了规范中的 `"ChugChug Rounded"`。
- **`design-system-color` (7 处 Advisory)**：Hero 字标中硬编码了未在调色板登记的 `#FFD16A` 与 `#F8F7F2`，与 `--gold` (`#f2cf79`) 和 `--paper` (`#f4f1eb`) 产生色差。
- **`design-system-font-size` & `design-system-radius` (15 处 Advisory)**：卡片及内层嵌套圆角存在字面值偏移，部分为 `clamp()` 标点切分产生的解析器副作用。

**Visual overlays**:
本地 Vite 开发服务器正常运行于 `http://localhost:5173/`。

#### Overall Impression
整体设计具备出色的质感与极强的派对氛围，特别是真实截图跑马灯与 3D 拟真杯垫卡片翻转效果，交互高级感远超同类营销页。当前最核心的体验断点在于 **JavaScript 强行滚屏拦截（Scroll-jacking）带来的操作对抗**，以及 **游戏卡片缺乏视觉主角导致的均一灰暗感**。

#### What's Working
1. **高度契合派对意象的拟物微交互**：Hero 的碰杯摆动与游戏卡片的 3D 拟真杯垫翻转（带有高光反射与动态景深阴影），让数字屏幕有了物理吧台的触感。
2. **纯粹、诚实的文案与定位**：文案直指聚会痛点（“少解释，多尽兴”、“弱网离线开局”、“防误触设计”），且严格恪守单一下载转化目标，无任何分心干扰。
3. **对社交分享内嵌浏览器的鲁棒防护**：针对聚会链接常通过微信、Instagram 或 TikTok 传播的场景，设计了精准的浮层引导，避免了 App Store 唤起失败的致命流失。

#### Priority Issues

##### [P1] JavaScript 强行滚屏拦截与原生滚动对抗
- **What**: `src/hooks/useSectionSnap.js` 在页面滚动时通过 JS 强制调用 `scrollTo({ behavior: 'smooth' })` 实行吸顶对齐。
- **Why it matters**: 在 macOS 触控板或高精度鼠标滚轮上，页面会与用户的惯性手势激烈博弈，导致滑动停滞或突然剧烈跳帧，让原本丝滑的界面产生明显的“劣质感”与失控感。
- **Fix**: 彻底移除 JS 滚动拦截，恢复原生纯净惯性滚动；如需分屏停靠，仅在纯移动端竖屏环境使用纯 CSS `scroll-snap-type: y proximity`。
- **Suggested command**: `$impeccable layout`

##### [P2] 游戏卡片网格均质化：主力游戏视觉淹没
- **What**: 在 `src/AppGlass.jsx`（第 1234 行）中，所有卡片被强制设置 `isFeatured = false` 且不传截图，致使 `game-cards.css` 中原本为核心游戏设计的精美截图大卡全部失效。
- **Why it matters**: 12 款各具特色的派对游戏全部塌陷为 12 个一模一样的小灰盒子，访客如果不逐个点击翻转，根本无法直观感知“大话骰”或“真心话大冒险”在手机上的精致玩法画面。
- **Fix**: 重新激活主力游戏的特色展示（如大话骰、真心话大冒险），为其分配跨列或携带内嵌截图的特色卡片（`game-card--featured`），建立层次分明的网格节奏。
- **Suggested command**: `$impeccable bolder`

##### [P3] 背景光晕渗色：洋红光斑违背品牌规范
- **What**: `src/styles/ambient.css` 中注入了紫红/洋红光斑 `.ambient__light--secondary` (`rgba(216, 139, 197, 0.38)`)。
- **Why it matters**: 直接违背了 `DESIGN.md` 中“拒绝紫色或洋红霓虹、环境光只有一团暖金”的核心视觉承诺，将沉稳微醺的高级吧台风带向了廉价迪厅风。
- **Fix**: 将该光晕调整为极微弱的暖琥珀色或直接停用，保持画面主底色的纯粹夜幕氛围。
- **Suggested command**: `$impeccable polish`

##### [P3] 商业与定价透明度缺失
- **What**: 整个页面没有任何文案说明 ChugChug 是“免费下载”、“一次性买断”还是“包含内购”。
- **Why it matters**: 访客在点击 App Store 按钮前往往会因为担心扣费或订阅陷阱而犹豫，增加转化流失率。
- **Fix**: 在主 CTA 按钮下方或旁边补充微文案：“免费下载 · 无内购无广告” / "Free to download on iOS"。
- **Suggested command**: `$impeccable typeset`

#### Persona Red Flags

**Taylor（忙乱的派对东道主，朋友还有 10 分钟到家，站在厨房急躁选游戏）**:
- *Red Flag*: Taylor 想立刻确认：“这 App 里到底有没有大话骰和真心话？”由于 12 张卡片全是暗灰色且规则全被藏在背面，Taylor 必须在喧闹中反复点击翻转才能确认，无法在 3 秒内一眼扫清。

**Jordan（持怀疑态度的桌面端访客，通过朋友微信转发在电脑上点开）**:
- *Red Flag*: Jordan 用 Mac 触控板滑动页面时遭遇严重的 JS 滚轮拦截乱跳，且未找到任何价格说明，怀疑这是套壳吸金软件，直接关掉网页，拒绝掏出手机扫码。

**Sam（酒吧微弱光线下的醉酒聚会者，手机在嘈杂桌上传阅）**:
- *Red Flag*: 在昏暗光线下，卡片正面 11px 的浅灰操作提示（“点击查看规则”）和翻面后 12px 的规则说明文字（仅 0.72 不透明度）极其难以看清。既然 App 本身号称“醉酒友好”，官网卡片的字体与反差却要求 20/20 的清醒视力。

#### Minor Observations
- **Canvas Token 漂移**：`tokens.css` 中使用了 `--canvas: #0D0C10`（冷黑炭色），而 `DESIGN.md` 原始定义为 `#09090A`（暖深黑），建议统一收拢。
- **卡片翻面内容局促**：卡片维持了 `2.35 / 1` 的扁平宽高比，规则较长的游戏在翻面后垂直滚动区域过窄。
- **指引箭头持续弹跳**：应用内浏览器蒙层的指引箭头采用了无限循环的 `inapp-bounce`，容易引发视觉疲劳，建议改为播放 2~3 次后静止。

#### Questions to Consider
- 既然产品最大的卖点之一是**“醉酒友好（Drunk-Proof）”**与超大触控，为什么官网卡片的字体提示只有 11px，还需要精细点击才能看清规则？
- 为什么在首屏跑马灯投入了大量心血展示 12 张精致的高清游戏截图，却在正下方的游戏卡片网格中把所有截图完全隐藏？
