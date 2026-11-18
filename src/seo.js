import { APP_STORE_URL } from './utils/inAppBrowser.js';

export const SITE_ORIGIN = 'https://chugchug.app';

export const LOCALES = [
  { code: 'en', htmlLang: 'en', prefix: '', hreflang: 'en', ogLocale: 'en_US' },
  { code: 'zh', htmlLang: 'zh-Hans', prefix: 'zh/', hreflang: 'zh-Hans', ogLocale: 'zh_CN' },
  { code: 'zh-Hant', htmlLang: 'zh-Hant', prefix: 'zh-Hant/', hreflang: 'zh-Hant', ogLocale: 'zh_TW' },
];

export const HOME_META = {
  en: {
    title: 'ChugChug - Party Drinking Game App',
    description: 'ChugChug is an all-in-one party drinking game app with Truth or Dare, Dice, Kings, Roulette and more. iOS only.',
    ogDescription: 'All-in-one party drinking game app with Truth or Dare, Dice, Kings, Roulette and more.',
  },
  zh: {
    title: '吨吨吨 - 派对游戏 App',
    description: '吨吨吨（ChugChug）是一款 iOS 派对喝酒游戏 App。不带道具，也能玩到散场。15 款游戏，离线可玩，无广告。',
    ogDescription: '不带道具，也能玩到散场。15 款派对游戏，离线可玩，仅 iOS。',
  },
  'zh-Hant': {
    title: 'ChugChug - 派對遊戲 App',
    description: 'ChugChug（噸噸噸）是一款 iOS 派對喝酒遊戲 App。不帶道具，也能玩到散場。15 款遊戲，離線可玩，無廣告。',
    ogDescription: '不帶道具，也能玩到散場。15 款派對遊戲，離線可玩，僅 iOS。',
  },
};

export const PRIVACY_META = {
  en: {
    title: 'Privacy Policy - ChugChug',
    description: 'Privacy policy for ChugChug, the party drinking game app. Local play, no account, no personal data collection.',
    ogDescription: 'Privacy policy for the ChugChug party drinking game app.',
  },
  zh: {
    title: '隐私政策 - 吨吨吨',
    description: '吨吨吨（ChugChug）隐私政策。本地喝酒游戏，无需账号、无需联网、不收集个人信息。',
    ogDescription: '吨吨吨（ChugChug）隐私政策。',
  },
  'zh-Hant': {
    title: '隱私政策 - ChugChug',
    description: 'ChugChug（噸噸噸）隱私政策。本地喝酒遊戲，無需帳號、無需聯網、不收集個人資訊。',
    ogDescription: 'ChugChug（噸噸噸）隱私政策。',
  },
};

export function localeByCode(code) {
  return LOCALES.find((item) => item.code === code) || LOCALES[0];
}

export function pageUrl(page, code) {
  const locale = localeByCode(code);
  const suffix = page ? String(page).replace(/^\//, '') : '';
  const path = `/${locale.prefix}${suffix}`.replace(/\/{2,}/g, '/');
  return path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}

export function buildJsonLd({ page, lang, games = [] }) {
  const meta = (page === 'privacy' ? PRIVACY_META : HOME_META)[lang] || HOME_META.en;
  const locale = localeByCode(lang);
  const url = pageUrl(page === 'privacy' ? 'privacy.html' : '', lang);
  const website = {
    '@type': 'WebSite',
    name: 'ChugChug',
    url: `${SITE_ORIGIN}/`,
  };

  if (page === 'privacy') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: meta.title,
      description: meta.description,
      url,
      inLanguage: locale.htmlLang,
      isPartOf: website,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MobileApplication',
        name: lang === 'zh' ? '吨吨吨' : 'ChugChug',
        alternateName: ['ChugChug', '吨吨吨', '噸噸噸'],
        operatingSystem: 'iOS',
        applicationCategory: 'GameApplication',
        url,
        installUrl: APP_STORE_URL,
        downloadUrl: APP_STORE_URL,
        image: `${SITE_ORIGIN}/og-image.jpg`,
        description: meta.description,
        inLanguage: locale.htmlLang,
        featureList: games.map((game) => game.name),
        isPartOf: website,
      },
      {
        '@type': 'ItemList',
        name: lang === 'zh' ? '游戏' : lang === 'zh-Hant' ? '遊戲' : 'Games',
        itemListElement: games.map((game, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: game.name,
          description: game.tagline,
        })),
      },
    ],
  };
}

export function buildLlmsText(catalogs) {
  const en = catalogs.en || [];
  const lines = [
    '# ChugChug',
    '',
    '> ChugChug（吨吨吨） is an iOS-only party drinking-game app. Rules and props are built in. It plays offline, has no ads, and does not require an account.',
    '',
    `App Store: ${APP_STORE_URL}`,
    '',
    'The app is iOS only. There is no Android version.',
    '',
    '## Pages',
    '',
    `- [English home](${pageUrl('', 'en')}): product overview, screenshots, and the 15 games.`,
    `- [简体中文](${pageUrl('', 'zh')}): 吨吨吨首页。`,
    `- [繁體中文](${pageUrl('', 'zh-Hant')}): 繁體中文首頁。`,
    `- [Privacy policy](${pageUrl('privacy.html', 'en')}): local play, no account, no personal data collection.`,
    `- [隐私政策](${pageUrl('privacy.html', 'zh')})`,
    `- [隱私政策](${pageUrl('privacy.html', 'zh-Hant')})`,
    '',
    '## Games',
    '',
    ...en.map((game) => `- ${game.name}: ${game.tagline}`),
    '',
  ];
  return lines.join('\n');
}

export function buildSitemap(lastmod) {
  const pages = ['', 'privacy.html'];
  const urls = pages.flatMap((page) => LOCALES.map((locale) => ({ page, locale })));
  const body = urls.map(({ page, locale }) => {
    const loc = pageUrl(page, locale.code);
    const alternates = LOCALES.map((item) => (
      `    <xhtml:link rel="alternate" hreflang="${item.hreflang}" href="${pageUrl(page, item.code)}" />`
    )).join('\n');
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(page, 'en')}" />`;
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      alternates,
      xDefault,
      '  </url>',
    ].join('\n');
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    body,
    '</urlset>',
    '',
  ].join('\n');
}
