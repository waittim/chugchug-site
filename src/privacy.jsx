import React, { useEffect, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { ArrowLeft } from 'lucide-react';
import SiteHeader from './components/SiteHeader.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import AmbientLights from './components/AmbientLights.jsx';
import { SUPPORT_EMAIL } from './contact.js';
import { PRIVACY_COPY } from './content/privacy.js';
import { getInitialLang, getLocalizedPath } from './i18n.js';
import './nunito-font.css';
import './index.css';

const PrivacyPage = () => {
  const [lang] = useState(getInitialLang);

  const current = PRIVACY_COPY[lang] ?? PRIVACY_COPY.en;
  const brand = lang === 'zh' ? '吨吨吨 · ChugChug' : 'ChugChug';
  const homePath = getLocalizedPath('', lang);

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

      <AmbientLights variant="privacy" />

      <SiteHeader
        brand={brand}
        brandHref={homePath}
        navLabel={current.a11y_nav}
        className="privacy-nav"
      >
        <a href={homePath} className="privacy-back glass-pill" aria-label={current.back}>
          <ArrowLeft size={15} aria-hidden="true" />
          <span className="privacy-back__label">{current.back}</span>
        </a>
      </SiteHeader>

      <main className="privacy-main" id="privacy-content">
        <div className="privacy-layout">
          <header className="privacy-header">
            <p className="section-kicker">{current.kicker}</p>
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
        languageHref={(code) => getLocalizedPath('privacy.html', code)}
        links={[
          { href: homePath, label: current.back },
          { href: `mailto:${SUPPORT_EMAIL}`, label: current.footer_contact },
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
