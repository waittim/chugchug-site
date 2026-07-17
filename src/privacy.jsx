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
  const brand = lang === 'zh' ? '吨吨吨·ChugChug' : 'ChugChug';
  const baseUrl = import.meta.env.BASE_URL || '/';
  const enHomePath = `${baseUrl}?lang=en`;
  const zhHomePath = `${baseUrl}?lang=zh`;
  const zhHantHomePath = `${baseUrl}?lang=zh-Hant`;
  const homePathByLang = {
    zh: zhHomePath,
    'zh-Hant': zhHantHomePath,
    en: enHomePath,
  };
  const homePath = homePathByLang[lang] ?? enHomePath;

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
      <div className="privacy-ambient" aria-hidden="true">
        <span className="privacy-ambient__light privacy-ambient__light--gold" />
        <span className="privacy-ambient__light privacy-ambient__light--pink" />
      </div>

      <nav className="privacy-nav">
        <a
          href={homePath}
          className="brand-mark"
          aria-label={current.back}
        >
          {brand}
        </a>

        <a href={homePath} className="privacy-back glass-pill">
          <ArrowLeft size={15} aria-hidden="true" />
          {current.back}
        </a>
      </nav>

      <main className="privacy-main">
        <div className="privacy-layout">
          <header className="privacy-header">
            <p className="section-kicker">Privacy · ChugChug</p>
            <h1>{current.title}</h1>
            <p>{current.subtitle}</p>
          </header>

          <section className="privacy-content">
            <article className="privacy-card">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s1}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s1b}</p>
              <ul className="mt-4 space-y-2 text-neutral-300 font-bold list-disc pl-5">
                <li>{current.s1l1}</li>
                <li>{current.s1l2}</li>
                <li>{current.s1l3}</li>
                <li>{current.s1l4}</li>
                <li>{current.s1l5}</li>
              </ul>
              <p className="text-neutral-300 font-bold mt-4 whitespace-pre-line">{current.s1c}</p>
            </article>

            <article className="privacy-card">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s2}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s2b}</p>
              <ul className="mt-4 space-y-2 text-neutral-300 font-bold list-disc pl-5">
                <li>{current.s2l1}</li>
                <li>{current.s2l2}</li>
              </ul>
              <p className="text-neutral-300 font-bold mt-6 whitespace-pre-line">{current.s2c}</p>
              <ul className="mt-4 space-y-2 text-neutral-300 font-bold list-disc pl-5">
                <li>{current.s2d1}</li>
                <li>{current.s2d2}</li>
                <li>{current.s2d3}</li>
                <li>{current.s2d4}</li>
                <li>{current.s2d5}</li>
              </ul>
            </article>

            <article className="privacy-card">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s3}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s3b}</p>
            </article>

            <article className="privacy-card">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s4}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s4b}</p>
            </article>

            <article className="privacy-card">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s5}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s5b}</p>
            </article>

            <article className="privacy-card">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s6}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s6b}</p>
            </article>

            <article className="privacy-card privacy-card--contact">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s7}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s7b}</p>
              <ul className="mt-4 space-y-2 text-neutral-300 font-bold list-disc pl-5">
                <li>
                  {current.email_label}:{' '}
                  <a
                    className="text-[#FFE85F] hover:underline"
                    href={`mailto:${SUPPORT_EMAIL}`}
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </li>
                <li>
                  {current.website_label}:{' '}
                  <a
                    className="text-[#FFE85F] hover:underline"
                    href={current.website}
                    target="_blank"
                    rel="noreferrer"
                  >
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
