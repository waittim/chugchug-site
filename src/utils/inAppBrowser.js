export const APP_STORE_URL = 'https://apps.apple.com/us/app/chugchug-party-game/id6758532049';
export const ITMS_APP_STORE_URL = 'itms-apps://apps.apple.com/us/app/chugchug-party-game/id6758532049';

/**
 * Checks if the current environment is inside a mobile app's embedded webview (In-App Browser).
 * Target apps: Instagram, Facebook, TikTok, Line, WeChat, Weibo, Twitter, generic iOS WebViews.
 */
export function isInAppBrowser() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || (typeof window !== 'undefined' && window.opera) || '';
  
  // App-specific WebView markers in UserAgent
  const isAppWebView = /Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly|BytedanceWebview|Line|MicroMessenger|Weibo|Twitter/i.test(ua);
  
  // Generic iOS WebView (WebKit without standalone Safari identifier)
  const isIosWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua);

  return isAppWebView || isIosWebView;
}
