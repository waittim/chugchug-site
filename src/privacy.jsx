import React, { useEffect, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { ArrowLeft } from 'lucide-react';
import SiteFooter from './components/SiteFooter.jsx';
import { SUPPORT_EMAIL } from './contact.js';
import { PRIVACY_COPY } from './content/privacy.js';
import { getInitialLang } from './i18n.js';
import './nunito-font.css';
import './index.css';

const PrivacyPage = () => {
  const [lang] = useState(getInitialLang);

  const current = PRIVACY_COPY[lang] ?? PRIVACY_COPY.en;
  const brand = lang === 'zh' ? '吨吨吨 · ChugChug' : 'ChugChug';
  const baseUrl = import.meta.env.BASE_URL || '/';
  const homePathByLang = {
    zh: `${baseUrl}?lang=zh`,
    'zh-Hant': `${baseUrl}?lang=zh-Hant`,
    en: `${baseUrl}?lang=en`,
  };
  const homePath = homePathByLang[lang] ?? homePathByLang.en;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (lang === 'zh') {
      document.title = '隐私政策 - 吨吨吨';
      return;
    }
    if (lang === 'zh-Hant') {
      document.title = '隱私政策 - ChugChug';
      return;
    }
    document.title = 'Privacy Policy - ChugChug';
  }, [lang]);

  return (
    <div className="privacy-shell">
      <a href="#privacy-content" className="skip-link">
        {current.a11y_skip}
      </a>

      <div className="privacy-ambient" aria-hidden="true">
        <span className="privacy-ambient__light privacy-ambient__light--gold" />
        <span className="privacy-ambient__light privacy-ambient__light--pink" />
      </div>

      <nav className="privacy-nav" aria-label={current.a11y_nav}>
        <a href={homePath} className="brand-mark">
          {brand}
        </a>

        <a href={homePath} className="privacy-back glass-pill" aria-label={current.back}>
          <ArrowLeft size={15} aria-hidden="true" />
          <span className="privacy-back__label">{current.back}</span>
        </a>
      </nav>

      <main className="privacy-main" id="privacy-content">
        <div className="privacy-layout">
          <header className="privacy-header">
            <p className="section-kicker">Privacy · ChugChug</p>
            <h1>{current.title}</h1>
            <p>{current.subtitle}</p>
          </header>

          <section className="privacy-content">
            <article className="privacy-card">
              <h2>{current.s1}</h2>
              <p>{current.s1b}</p>
              <ul>
                <li>{current.s1l1}</li>
                <li>{current.s1l2}</li>
                <li>{current.s1l3}</li>
                <li>{current.s1l4}</li>
                <li>{current.s1l5}</li>
              </ul>
              <p>{current.s1c}</p>
            </article>

            <article className="privacy-card">
              <h2>{current.s2}</h2>
              <p>{current.s2b}</p>
              <ul>
                <li>{current.s2l1}</li>
                <li>{current.s2l2}</li>
              </ul>
              <p>{current.s2c}</p>
              <ul>
                <li>{current.s2d1}</li>
                <li>{current.s2d2}</li>
                <li>{current.s2d3}</li>
                <li>{current.s2d4}</li>
                <li>{current.s2d5}</li>
              </ul>
            </article>

            <article className="privacy-card">
              <h2>{current.s3}</h2>
              <p>{current.s3b}</p>
            </article>

            <article className="privacy-card">
              <h2>{current.s4}</h2>
              <p>{current.s4b}</p>
            </article>

            <article className="privacy-card">
              <h2>{current.s5}</h2>
              <p>{current.s5b}</p>
            </article>

            <article className="privacy-card">
              <h2>{current.s6}</h2>
              <p>{current.s6b}</p>
            </article>

            <article className="privacy-card privacy-card--contact">
              <h2>{current.s7}</h2>
              <p>{current.s7b}</p>
              <ul>
                <li>
                  {current.email_label}:{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
                </li>
                <li>
                  {current.website_label}:{' '}
                  <a href={current.website} target="_blank" rel="noreferrer">
                    {current.website}
                  </a>
                </li>
              </ul>
            </article>
          </section>
        </div>
      </main>

      <SiteFooter
        lang={lang}
        brand={brand}
        footerLabel={current.a11y_footer}
        languageLabel={current.a11y_language}
        languageHref={(code) => `${baseUrl}privacy.html?lang=${code}`}
        links={[
          { href: homePath, label: current.back },
          { href: `mailto:${SUPPORT_EMAIL}`, label: current.email_label },
        ]}
      />
    </div>
  );
};

const container = document.getElementById('root');

if (container?.hasChildNodes()) {
  hydrateRoot(
    container,
    <React.StrictMode>
      <PrivacyPage />
    </React.StrictMode>,
  );
} else {
  createRoot(container).render(
    <React.StrictMode>
      <PrivacyPage />
    </React.StrictMode>,
  );
}
