import React, { useEffect, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { PRIVACY_COPY } from './content/privacy.js';
import { getInitialLang } from './i18n.js';
import './nunito-font.css';
import './index.css';

const PrivacyPage = () => {
  const [lang] = useState(getInitialLang);

  const current = PRIVACY_COPY[lang] ?? PRIVACY_COPY.en;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const enHomePath = `${baseUrl}?lang=en`;
  const zhHomePath = `${baseUrl}?lang=zh`;
  const zhHantHomePath = `${baseUrl}?lang=zh-Hant`;
  const enPrivacyPath = `${baseUrl}privacy.html?lang=en`;
  const zhPrivacyPath = `${baseUrl}privacy.html?lang=zh`;
  const zhHantPrivacyPath = `${baseUrl}privacy.html?lang=zh-Hant`;
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
    <div className="min-h-screen bg-[#0F0F0F] font-sans selection:bg-[#FFE85F] selection:text-black overflow-x-hidden flex flex-col">
      <style>
        {`
          .font-bubble {
            font-family: "SF Pro Rounded", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-weight: 800;
          }
        `}
      </style>

      <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4 flex justify-between items-center mix-blend-difference text-white">
        <a
          href={homePath}
          className="text-2xl font-black tracking-tighter font-bubble flex items-center gap-2"
          aria-label={current.back}
        >
          {current.brand}
        </a>

	        <div className="flex items-center gap-3">
	          <a
	            href={homePath}
	            className="hidden md:block bg-white text-black px-5 py-2 rounded-full font-bold border-2 border-transparent hover:scale-105 transition-transform duration-200"
	          >
	            {current.back}
	          </a>
	        </div>
	      </nav>

      <main className="flex-1 pt-24 pb-16 px-4 md:px-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight font-bubble">
              {current.title}
            </h1>
            <div className="h-2 w-40 bg-[#FFE85F] mt-4" />
            <p className="text-neutral-400 text-lg md:text-xl font-bold mt-6 font-bubble">
              {current.subtitle}
            </p>
          </header>

          <section className="space-y-10">
            <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 md:p-8">
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
            </div>

            <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 md:p-8">
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
            </div>

            <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 md:p-8">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s3}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s3b}</p>
            </div>

            <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 md:p-8">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s4}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s4b}</p>
            </div>

            <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 md:p-8">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s5}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s5b}</p>
            </div>

            <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 md:p-8">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s6}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s6b}</p>
            </div>

            <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 md:p-8">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s7}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s7b}</p>
              <ul className="mt-4 space-y-2 text-neutral-300 font-bold list-disc pl-5">
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
            </div>
          </section>
        </div>
      </main>

	      <footer className="w-screen relative left-1/2 -translate-x-1/2 py-8 border-t border-neutral-900 bg-[#0F0F0F]">
		        <div className="w-full px-4 md:px-6 flex flex-row flex-wrap justify-between items-center text-neutral-600 text-xs md:text-sm gap-x-8 gap-y-4">
		          <div className="font-bold font-bubble">© 2026 CHUGCHUG APP</div>
		          <div className="flex flex-row flex-wrap items-center gap-x-6 gap-y-3 font-bold">
		            <a href={homePath} className="hover:text-[#FFE85F] transition-colors">
		              {current.back}
	            </a>
		            <div className="bg-neutral-800 rounded-full p-1 flex items-center border border-neutral-700">
		              <a
		                href={zhPrivacyPath}
		                aria-current={lang === 'zh' ? 'page' : undefined}
		                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
		                  lang === 'zh'
		                    ? 'bg-[#FFE85F] text-black shadow-sm'
		                    : 'text-neutral-400 hover:text-white'
		                }`}
		              >
		                简
		              </a>
		              <a
		                href={zhHantPrivacyPath}
		                aria-current={lang === 'zh-Hant' ? 'page' : undefined}
		                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
		                  lang === 'zh-Hant'
		                    ? 'bg-[#FFE85F] text-black shadow-sm'
		                    : 'text-neutral-400 hover:text-white'
		                }`}
		              >
		                繁
		              </a>
		              <a
		                href={enPrivacyPath}
	                aria-current={lang === 'en' ? 'page' : undefined}
	                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
	                  lang === 'en'
	                    ? 'bg-[#FFE85F] text-black shadow-sm'
	                    : 'text-neutral-400 hover:text-white'
	                }`}
	              >
	                EN
	              </a>
	            </div>
	          </div>
	        </div>
	      </footer>
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
