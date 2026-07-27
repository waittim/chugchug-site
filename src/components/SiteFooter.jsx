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
}) => (
  <footer className="unified-footer">
    <div className="unified-footer__top">
      <div className="brand-mark">{brand}</div>
      <nav className="unified-footer__links" aria-label="Footer">
        {links.map(({ href, label }) => (
          <a href={href} key={`${href}-${label}`}>{label}</a>
        ))}
      </nav>
    </div>

    <div className="unified-footer__bottom">
      <p>{copyright}</p>
      <nav className="language-switcher glass-pill" aria-label="Language">
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
    </div>
  </footer>
);

export default SiteFooter;
