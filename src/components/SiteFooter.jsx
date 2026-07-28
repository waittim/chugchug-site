import React from 'react';

const LANGUAGES = [
  ['zh', '简'],
  ['zh-Hant', '繁'],
  ['en', 'EN'],
];

const SiteFooter = ({
  lang,
  brand,
  links,
  languageHref,
  copyright = '© 2026 CHUGCHUG APP',
  footerLabel = 'Footer',
  languageLabel = 'Language',
}) => (
  <footer className="unified-footer">
    <div className="unified-footer__brand">
      <div className="brand-mark">{brand}</div>
      <p className="unified-footer__copy">{copyright}</p>
    </div>

    <nav className="unified-footer__links" aria-label={footerLabel}>
      {links.map(({ href, label }) => (
        <a href={href} key={`${href}-${label}`}>{label}</a>
      ))}
    </nav>

    <nav className="language-switcher" aria-label={languageLabel}>
      {LANGUAGES.map(([code, label]) => (
        <a
          key={code}
          href={languageHref(code)}
          className={lang === code ? 'is-active' : ''}
          aria-current={lang === code ? 'page' : undefined}
          lang={code === 'zh' ? 'zh-Hans' : code}
        >
          {label}
        </a>
      ))}
    </nav>
  </footer>
);

export default SiteFooter;
