export const DEFAULT_LANG = 'en';

export const normalizeLang = (value) => {
  if (!value) return null;
  const normalized = String(value).toLowerCase().replace('_', '-');
  if (
    normalized.startsWith('zh-hant') ||
    normalized.startsWith('zh-tw') ||
    normalized.startsWith('zh-hk') ||
    normalized.startsWith('zh-mo')
  ) {
    return 'zh-Hant';
  }
  if (normalized.startsWith('zh')) return 'zh';
  if (normalized.startsWith('en')) return 'en';
  return null;
};

const getNavigatorLang = () => {
  if (typeof navigator === 'undefined') return null;
  const preferred =
    (navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || '']
    ).map(normalizeLang).find(Boolean);
  return preferred || null;
};

export const getUrlLang = () => {
  if (typeof window === 'undefined') return null;
  return normalizeLang(new URLSearchParams(window.location.search).get('lang'));
};

export const getInitialLang = () => {
  if (typeof window !== 'undefined') {
    const forced = normalizeLang(window.__LANG__);
    if (forced) return forced;
  }

  if (typeof document !== 'undefined') {
    const htmlLang = normalizeLang(document.documentElement.lang);
    if (htmlLang) return htmlLang;
  }

  const preferred = getNavigatorLang();
  if (preferred) return preferred;

  return DEFAULT_LANG;
};

export const toHtmlLang = (lang) => {
  if (lang === 'zh-Hant') return 'zh-Hant';
  if (lang === 'zh') return 'zh-Hans';
  return DEFAULT_LANG;
};

export const getLocalizedPath = (page = '', lang = DEFAULT_LANG) => {
  const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
  const cleanPage = page.startsWith('/') ? page.slice(1) : page;
  return `${baseUrl}${cleanPage}?lang=${lang}`;
};

export const initDocumentLang = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_LANG;
  }

  const lang = getUrlLang() || getNavigatorLang() || DEFAULT_LANG;
  window.__LANG__ = lang;
  document.documentElement.lang = toHtmlLang(lang);
  return lang;
};
