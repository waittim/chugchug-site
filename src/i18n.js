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

export const getPathLang = () => {
  if (typeof window === 'undefined') return null;
  const base = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '');
  let path = window.location.pathname;
  if (base && path.startsWith(base)) path = path.slice(base.length) || '/';
  if (!path.startsWith('/')) path = `/${path}`;
  if (path === '/zh-Hant' || path.startsWith('/zh-Hant/')) return 'zh-Hant';
  if (path === '/zh' || path.startsWith('/zh/')) return 'zh';
  return null;
};

export const getDocumentLang = () => {
  if (typeof document === 'undefined') return null;
  return normalizeLang(document.documentElement.getAttribute('data-lang'));
};

export const getSavedLang = () => {
  if (typeof window === 'undefined') return null;
  try {
    return normalizeLang(localStorage.getItem('preferred_lang'));
  } catch (_) {
    return null;
  }
};

export const setSavedLang = (lang) => {
  if (typeof window === 'undefined') return;
  try {
    if (lang) {
      localStorage.setItem('preferred_lang', lang);
    }
  } catch (_) {}
};

export const getInitialLang = () => {
  if (typeof window !== 'undefined') {
    const forced = normalizeLang(window.__LANG__);
    if (forced) return forced;
    const fromUrl = getUrlLang();
    if (fromUrl) return fromUrl;
    const fromPath = getPathLang();
    if (fromPath) return fromPath;
  }

  const fromDocument = getDocumentLang();
  if (fromDocument) return fromDocument;

  const fromSaved = getSavedLang();
  if (fromSaved) return fromSaved;

  const preferred = getNavigatorLang();
  if (preferred) return preferred;

  return DEFAULT_LANG;
};

export const toHtmlLang = (lang) => {
  if (lang === 'zh-Hant') return 'zh-Hant';
  if (lang === 'zh') return 'zh-Hans';
  return DEFAULT_LANG;
};

const LOCALE_PREFIX = {
  en: '',
  zh: 'zh/',
  'zh-Hant': 'zh-Hant/',
};

export const getLocalizedPath = (page = '', lang = DEFAULT_LANG) => {
  const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
  const prefix = LOCALE_PREFIX[lang] ?? '';
  const cleanPage = page.startsWith('/') ? page.slice(1) : page;
  return `${baseUrl}${prefix}${cleanPage}`;
};

export const getLanguageHref = (page = '', lang = DEFAULT_LANG) => {
  const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
  const prefix = LOCALE_PREFIX[lang] ?? '';
  const cleanPage = page.startsWith('/') ? page.slice(1) : page;
  const suffix = lang === 'en' ? '?lang=en' : '';
  return `${baseUrl}${prefix}${cleanPage}${suffix}`;
};

export const initDocumentLang = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_LANG;
  }

  const lang = getUrlLang() || getPathLang() || getDocumentLang() || getSavedLang() || getNavigatorLang() || DEFAULT_LANG;
  window.__LANG__ = lang;
  document.documentElement.lang = toHtmlLang(lang);
  document.documentElement.setAttribute('data-lang', lang);
  return lang;
};
