# Design Spec: In-App Browser App Store Redirect Guidance

## Overview
When users open the ChugChug website inside in-app browsers (such as Instagram, Facebook, TikTok, Line, WeChat, Weibo, Twitter), clicking the "Download on App Store" button often fails to open the App Store directly due to webview sandboxing restrictions. 

This design introduces automatic detection of in-app webview environments and presents an elegant, high-contrast modal overlay pointing users to open the page in Safari or their default browser.

---

## Architecture & Components

### 1. In-App Browser Detection Utility (`src/utils/inAppBrowser.js`)
A lightweight utility function to inspect `navigator.userAgent`:
```javascript
export function isInAppBrowser() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  
  // Specific app WebViews
  const isAppWebView = /Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly|BytedanceWebview|Line|MicroMessenger|Weibo|Twitter/i.test(ua);
  
  // Generic iOS WebView (WebKit without standalone Safari identifier)
  const isIosWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua);
  
  return isAppWebView || isIosWebView;
}
```

### 2. App Store Links & Protocol Handling
- Standard Web URL: `https://apps.apple.com/us/app/chugchug-party-game/id6758532049`
- iOS Direct Protocol URL: `itms-apps://apps.apple.com/us/app/chugchug-party-game/id6758532049`

When the user clicks any App Store download button (`StoreButton`):
1. If `isInAppBrowser()` returns `false`: proceed with standard `https://` navigation.
2. If `isInAppBrowser()` returns `true`:
   - Open the In-App Guidance Overlay Modal (`showInAppGuide = true`).
   - Attempt `window.location.href = ITMS_APP_STORE_URL` as a direct fallback attempt.

---

## UI / UX Design (`InAppGuideModal`)

### Visual Specs & Animations
- **Backdrop**: Fullscreen overlay with dark blur (`backdrop-filter: blur(16px)` & dark background `#09090b / 85% opacity`).
- **Top-Right Arrow Guidance**:
  - Top-right floating indicator with a bouncing curved arrow pointing towards `(top: 16px, right: 24px)` where Instagram's `•••` menu icon is located.
  - Pulsing highlight around the target direction.
- **Guidance Card**:
  - Glassmorphic container with liquid gradient border.
  - Step 1: Tap the menu button **【 ••• 】** in the top right corner.
  - Step 2: Select **「Open in Safari」** (在 Safari 中打开) or **「Open in Browser」** (在默认浏览器中打开).
- **Secondary Actions**:
  - **Copy Link Button**: Copies `window.location.href` to clipboard so users can paste into Safari if needed.
  - **Close Button**: Allows user to close the modal if they want to close it.

---

## i18n Localization (`src/content/home.js`)

Localized strings added for `zh`, `zh-Hant`, and `en`:

| Key | `zh` | `zh-Hant` | `en` |
|---|---|---|---|
| `inapp_title` | 无法直接跳转 App Store？ | 無法直接跳轉 App Store？ | Open in Safari / Browser |
| `inapp_subtitle` | 检测到您正在使用应用内置浏览器 | 檢測到您正在使用應用內置瀏覽器 | In-app browser detected |
| `inapp_step1` | 点击右上角菜单按钮 【 **•••** 】 | 點擊右上角選單按鈕 【 **•••** 】 | Tap the menu 【 **•••** 】 in top-right corner |
| `inapp_step2` | 选择「**在 Safari 中打开**」或「**在默认浏览器中打开**」 | 選擇「**在 Safari 中打開**」或「**在預設瀏覽器中打開**」 | Select **"Open in Safari"** or **"Open in Browser"** |
| `inapp_btn_copy` | 复制网页链接 | 複製網頁連結 | Copy Page Link |
| `inapp_copied` | 链接已复制 | 連結已複製 | Link Copied! |
| `inapp_btn_close` | 我知道了 | 我知道了 | Got It |

---

## File Changes Summary

1. `src/utils/inAppBrowser.js` **[NEW]**: UA detection helper & App Store URL constants.
2. `src/content/home.js` **[MODIFY]**: Add `inapp_*` localized strings for `zh`, `zh-Hant`, and `en`.
3. `src/AppGlass.jsx` **[MODIFY]**:
   - Integrate `isInAppBrowser` check on download button click.
   - Render `InAppGuideModal` component with top-right arrow & copy link functionality.
4. `src/index.css` **[MODIFY]**:
   - Add responsive, glassmorphic styling and keyframe animation for the top-right arrow guide overlay.

---

## Verification Plan

1. **Unit / Environment Test**:
   - Mock `navigator.userAgent` with Instagram, Facebook, WeChat, and standard Mobile Safari UA strings to verify detection logic.
2. **Visual & Interaction Check**:
   - Verify modal appearance, top-right arrow position, copy link clipboard API, and close handlers on mobile viewport widths.
3. **Build Verification**:
   - Run `npm run build` to ensure zero bundle compilation errors.
