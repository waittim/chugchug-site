import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import {
  HOME_META,
  LOCALES,
  PRIVACY_META,
  buildJsonLd,
  buildLlmsText,
  buildSitemap,
  pageUrl,
} from '../src/seo.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function replaceTag(html, pattern, value) {
  if (!pattern.test(html)) {
    throw new Error(`Missing head slot: ${pattern}`);
  }
  return html.replace(pattern, value);
}

function applyDocument(template, { page, lang, body, jsonLd }) {
  const meta = (page === 'privacy' ? PRIVACY_META : HOME_META)[lang];
  const locale = LOCALES.find((item) => item.code === lang);
  const url = pageUrl(page === 'privacy' ? 'privacy.html' : '', lang);
  let html = template;
  html = replaceTag(
    html,
    /<html lang="[^"]*" data-lang="[^"]*">/,
    `<html lang="${locale.htmlLang}" data-lang="${lang}">`,
  );
  html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${escapeAttr(meta.title)}</title>`);
  html = replaceTag(
    html,
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${escapeAttr(meta.description)}$2`,
  );
  html = replaceTag(
    html,
    /(<meta property="og:title" content=")[^"]*(")/,
    `$1${escapeAttr(meta.title)}$2`,
  );
  html = replaceTag(
    html,
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    `$1${escapeAttr(meta.ogDescription)}$2`,
  );
  html = replaceTag(
    html,
    /(<meta property="og:url" content=")[^"]*(")/,
    `$1${escapeAttr(url)}$2`,
  );
  html = replaceTag(
    html,
    /(<meta property="og:locale" content=")[^"]*(")/,
    `$1${locale.ogLocale}$2`,
  );
  html = replaceTag(
    html,
    /(<meta name="twitter:title" content=")[^"]*(")/,
    `$1${escapeAttr(meta.title)}$2`,
  );
  html = replaceTag(
    html,
    /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
    `$1${escapeAttr(meta.ogDescription)}$2`,
  );
  html = replaceTag(
    html,
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${escapeAttr(url)}$2`,
  );
  const json = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
  html = replaceTag(
    html,
    /<script type="application\/ld\+json" id="structured-data">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="structured-data">${json}</script>`,
  );
  html = replaceTag(html, /<div id="root"><\/div>/, `<div id="root">${body}</div>`);
  return html;
}

function outputPath(page, lang) {
  const locale = LOCALES.find((item) => item.code === lang);
  const directory = resolve(dist, locale.prefix);
  const filename = page === 'privacy' ? 'privacy.html' : 'index.html';
  return resolve(directory, filename);
}

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { render, gameCatalog } = await vite.ssrLoadModule('/src/entry-server.jsx');
  const homeTemplate = await readFile(resolve(dist, 'index.html'), 'utf8');
  const privacyTemplate = await readFile(resolve(dist, 'privacy.html'), 'utf8');
  const catalogs = {};

  for (const locale of LOCALES) {
    catalogs[locale.code] = gameCatalog(locale.code);
    for (const page of ['home', 'privacy']) {
      const body = render(page, locale.code);
      const html = applyDocument(page === 'privacy' ? privacyTemplate : homeTemplate, {
        page,
        lang: locale.code,
        body,
        jsonLd: buildJsonLd({
          page,
          lang: locale.code,
          games: catalogs[locale.code],
        }),
      });
      const file = outputPath(page, locale.code);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, html);
    }
  }

  const lastmod = new Date().toISOString().slice(0, 10);
  await writeFile(resolve(dist, 'sitemap.xml'), buildSitemap(lastmod));
  await writeFile(resolve(dist, 'llms.txt'), buildLlmsText(catalogs));
  console.log('Prerendered home and privacy pages for en, zh, and zh-Hant.');
} finally {
  await vite.close();
}
