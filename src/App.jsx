import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { GAMES } from './content/games.jsx';
import { HOME_COPY } from './content/home.js';
import { getInitialLang } from './i18n.js';

const AppleLogo = ({ size = 36 }) => (
  <span
    aria-hidden="true"
    className="inline-flex items-center justify-center leading-none select-none"
    style={{ width: size, height: size, fontSize: size }}
  >
    {'\uf8ff'}
  </span>
);

const APP_STORE_URL = 'https://apps.apple.com/us/app/chugchug-party-game/id6758532049';
const DOWNLOAD_ANCHOR = '#download';

const App = () => {
  const [lang] = useState(getInitialLang);
  const [flippedIds, setFlippedIds] = useState(() => new Set());

  const trackAppStoreClick = () => {
    if (typeof window === 'undefined') return;
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', 'app_store_click', {
      event_category: 'outbound',
      event_label: 'app_store',
      link_url: APP_STORE_URL,
      language: lang,
      transport_type: 'beacon',
    });
  };

  const trackNavbarDownloadClick = () => {
    if (typeof window === 'undefined') return;
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', 'navbar_download_click', {
      event_category: 'navigation',
      event_label: 'download_anchor',
      link_url: DOWNLOAD_ANCHOR,
      language: lang,
      transport_type: 'beacon',
    });
  };

  const toggleFlip = (id) => {
    setFlippedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const currentText = HOME_COPY[lang] ?? HOME_COPY.en;
  const isChineseLang = lang === 'zh' || lang === 'zh-Hant';
  const isTraditionalChinese = lang === 'zh-Hant';
  const heroPointColors = ['bg-[#FFE85F]', 'bg-[#FB458D]', 'bg-[#22D3EE]'];

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (lang === 'zh') {
      document.title = '吨吨吨 - 派对游戏 App';
      return;
    }
    if (lang === 'zh-Hant') {
      document.title = 'ChugChug - 派對遊戲 App';
      return;
    }
    document.title = 'ChugChug - Party Game App';
  }, [lang]);

  const baseUrl = import.meta.env.BASE_URL || '/';
  const enHomePath = `${baseUrl}?lang=en`;
  const zhHomePath = `${baseUrl}?lang=zh`;
  const zhHantHomePath = `${baseUrl}?lang=zh-Hant`;
  const privacyPath = `${baseUrl}privacy.html?lang=${lang}`;
  const placeholderSrc = `${baseUrl}placeholder.svg`;

  const screenshotList = useMemo(() => {
    const folder = `${baseUrl}screenshot/${isChineseLang ? 'zh' : 'en'}/`;
    const menuFile = isChineseLang ? 'menu-zh.jpeg' : 'menu.jpeg';
    const order = [
      'dice.jpeg',
      'poker.jpeg',
      'buzzcards.jpeg',
      'sixone.jpeg',
      'lucky.jpeg',
      'truthordare.jpeg',
      menuFile,
      'kingsgame.jpeg',
      'mostlikelyto.jpeg',
      'headsupcategory.jpeg',
      'undercover.jpeg',
      'wavelength.jpeg',
    ];

    return order.map((file) => ({
      id: file.replace('.jpeg', ''),
      src: `${folder}${file}`,
      isMenu: file === menuFile,
    }));
  }, [baseUrl, isChineseLang]);


  return (
    <div className="min-h-screen bg-[#0F0F0F] font-sans selection:bg-[#FFE85F] selection:text-black overflow-x-hidden flex flex-col">
      <style>
        {`
          @keyframes slow-sway {
            0% { transform: rotate(-2deg); }
            50% { transform: rotate(2deg); }
            100% { transform: rotate(-2deg); }
          }

          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          @media (prefers-reduced-motion: no-preference) {
            .slow-sway {
              animation: slow-sway 6s ease-in-out infinite;
              will-change: transform;
              transform-origin: center;
            }

            .marquee {
              animation: marquee 40s linear infinite;
              will-change: transform;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .marquee {
              animation: none;
              transform: translateX(0);
            }
          }
        `}
      </style>

      <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4 flex justify-between items-center md:mix-blend-difference text-white">
        <div className="text-2xl font-black tracking-tighter font-bubble flex items-center gap-2">
          {lang === 'en' || isTraditionalChinese ? 'ChugChug' : '吨吨吨'}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={DOWNLOAD_ANCHOR}
            className="bg-white text-black px-4 py-2 md:px-5 rounded-full text-sm md:text-base font-bold border-2 border-transparent hover:scale-105 transition-transform duration-200"
            onClick={trackNavbarDownloadClick}
          >
            {currentText.nav_download}
          </a>
        </div>
      </nav>

      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4">
        <div className="text-center mb-16 z-10">
          <div className="relative inline-block">
            <h1 className="font-bubble text-[5rem] md:text-[10rem] leading-[0.9] text-white select-none transition-transform hover:scale-105 duration-300 cursor-default">
              {lang === 'zh' ? (
                <div className="flex gap-0 whitespace-nowrap tracking-tighter">
                  <div className="title-shadow">
                    {currentText.hero_title_1}
                  </div>
                  <div className="title-shadow">
                    {currentText.hero_title_2}
                  </div>
                  <div className="title-shadow">
                    {currentText.hero_title_3}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col tracking-tight -space-y-1 md:-space-y-3">
                  <div className="title-shadow">
                    {currentText.hero_title_1}
                  </div>
                  <div className="title-shadow">
                    {currentText.hero_title_2}
                  </div>
                </div>
              )}
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-neutral-400 font-bold mt-8 tracking-wide font-bubble">
            {currentText.hero_subtitle}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-neutral-400 text-xs md:text-sm font-black font-bubble">
            {currentText.hero_points.map((point, index) => (
              <span key={point} className="inline-flex items-center gap-2 whitespace-nowrap">
                <span className={`h-2.5 w-2.5 rounded-full ${heroPointColors[index]}`} />
                {point}
              </span>
            ))}
          </div>
        </div>

        <div className="relative w-full mb-12 overflow-x-hidden overflow-y-visible">
          <div className="marquee flex w-max">
            <div className="flex items-center gap-[clamp(18px,4vw,32px)] pr-[clamp(18px,4vw,32px)] py-[clamp(18px,5vw,36px)]">
              {screenshotList.map((shot) => (
                <div key={`a-${shot.id}`} className="relative z-0 isolate shrink-0">
                  <div
                    className={`relative z-10 w-[clamp(210px,32vw,280px)] aspect-[719/1500] bg-black rounded-[clamp(2.1rem,5.8vw,2.9rem)] border-[5px] border-black overflow-hidden ring-1 ring-neutral-700 ${
                      shot.isMenu
                        ? 'shadow-[0_0_32px_rgba(255,232,95,0.22)]'
                        : 'shadow-[0_0_24px_rgba(255,255,255,0.12)]'
                    }`}
                  >
                    <div className="w-full h-full bg-[#1A1A1A] relative">
                      <img
                        src={shot.src}
                        alt={
                          shot.isMenu
                            ? isTraditionalChinese
                              ? '主選單截圖'
                              : isChineseLang
                                ? '主菜单截图'
                              : 'Main menu screenshot'
                            : isTraditionalChinese
                              ? '遊戲截圖'
                              : isChineseLang
                                ? '游戏截图'
                              : 'Game screenshot'
                        }
                        className="w-full h-full object-cover object-top opacity-90 transition-opacity duration-500 hover:opacity-100"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = placeholderSrc;
                        }}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
                  </div>
                </div>
              ))}
            </div>
            <div
              className="flex items-center gap-[clamp(18px,4vw,32px)] pr-[clamp(18px,4vw,32px)] py-[clamp(18px,5vw,36px)]"
              aria-hidden="true"
            >
              {screenshotList.map((shot) => (
                <div key={`b-${shot.id}`} className="relative z-0 isolate shrink-0">
                  <div
                    className={`relative z-10 w-[clamp(210px,32vw,280px)] aspect-[719/1500] bg-black rounded-[clamp(2.1rem,5.8vw,2.9rem)] border-[5px] border-black overflow-hidden ring-1 ring-neutral-700 ${
                      shot.isMenu
                        ? 'shadow-[0_0_32px_rgba(255,232,95,0.22)]'
                        : 'shadow-[0_0_24px_rgba(255,255,255,0.12)]'
                    }`}
                  >
                    <div className="w-full h-full bg-[#1A1A1A] relative">
                      <img
                        src={shot.src}
                        alt={
                          shot.isMenu
                            ? isTraditionalChinese
                              ? '主選單截圖'
                              : isChineseLang
                                ? '主菜单截图'
                              : 'Main menu screenshot'
                            : isTraditionalChinese
                              ? '遊戲截圖'
                              : isChineseLang
                                ? '游戏截图'
                              : 'Game screenshot'
                        }
                        className="w-full h-full object-cover object-top opacity-90 transition-opacity duration-500 hover:opacity-100"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = placeholderSrc;
                        }}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0F0F0F] to-transparent md:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0F0F0F] to-transparent md:hidden" />
        </div>

        <div className="motion-safe:animate-bounce absolute bottom-8 text-neutral-600">
          <ArrowDown size={32} />
        </div>
      </section>

      <section className="min-h-screen py-24 px-4 md:px-12 bg-[#121212] relative">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight font-bubble">
                <span className="block">{currentText.grid_title_prefix}</span>
                <span className="block text-[#FB458D]">{currentText.grid_title_suffix}</span>
              </h2>
              <div className="h-2 w-32 bg-[#FFE85F]" />
            </div>
            <p className="text-neutral-400 text-lg font-bold max-w-md text-right md:text-left whitespace-pre-line">
              {currentText.grid_desc}
            </p>
          </div>

	          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
		            {GAMES.map((game) => (
			              <div
			                key={game.id}
			                role="button"
			                tabIndex={0}
			                aria-label={`${game.name[lang] ?? game.name.zh ?? game.name.en} - ${currentText.rules_title}`}
		                aria-pressed={flippedIds.has(game.id)}
		                onClick={() => toggleFlip(game.id)}
		                onKeyDown={(e) => {
		                  if (e.key === 'Enter' || e.key === ' ') {
		                    e.preventDefault();
		                    toggleFlip(game.id);
		                  }
		                }}
		                className="group cursor-pointer select-none outline-none [perspective:1000px] focus-visible:ring-2 focus-visible:ring-[#FFE85F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
		              >
		                <div className="relative aspect-square rounded-3xl transition-transform duration-200 hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] active:translate-y-0 active:shadow-none">
		                  <div
		                    className={`
		                      absolute inset-0
		                      transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
		                      [transform-style:preserve-3d]
		                      ${flippedIds.has(game.id) ? '[transform:rotateY(180deg)]' : ''}
		                    `}
		                  >
		                  <div
		                    className={`
		                      absolute inset-0
		                      ${game.color}
	                      rounded-3xl border-4 border-black
	                      flex flex-col justify-between p-4 md:p-6
	                      [backface-visibility:hidden]
	                    `}
	                  >
	                    <div className="flex justify-between items-start">
	                      <div className="bg-black/10 p-2 rounded-xl backdrop-blur-sm transition-transform group-hover:scale-110 duration-300">
	                        {game.icon}
	                      </div>
	                    </div>

		                    <div>
		                      <h3 className="text-xl md:text-2xl font-black text-black leading-tight mb-1 font-bubble">
		                        {game.name[lang] ?? game.name.zh ?? game.name.en}
		                      </h3>
		                      <p className="text-black font-bold text-xs md:text-sm opacity-60 uppercase tracking-wide font-bubble">
		                        {isChineseLang ? game.name.en : game.desc.en}
		                      </p>
	                      <p className="mt-2 text-black/70 text-xs md:text-sm font-bold font-bubble">
	                        {currentText.card_hint_front}
	                      </p>
	                    </div>
	                  </div>

		                  <div
		                    className={`
		                      absolute inset-0
		                      bg-black
		                      rounded-3xl border-4 border-neutral-800
		                      p-4 md:p-6
		                      flex flex-col justify-between overflow-hidden
		                      [backface-visibility:hidden]
		                      [transform:rotateY(180deg)]
		                    `}
			                  >
				                    <div className="flex flex-col min-h-0">
				                      <p className="flex-1 min-h-0 text-neutral-200 text-sm md:text-base font-bold whitespace-pre-line font-bubble leading-relaxed overflow-auto">
				                        {game.rules?.[lang] ?? game.rules?.zh ?? game.rules?.en ?? ''}
				                      </p>
				                    </div>

			                  </div>
			                  </div>
			                </div>
		              </div>
		            ))}
		          </div>
        </div>
      </section>

	      <section
	        id="download"
	        className="min-h-screen flex flex-col relative bg-[#0F0F0F]"
	      >
	        <div className="z-10 mx-auto w-full max-w-3xl px-4 text-center flex-grow flex flex-col justify-center py-32">
	          <div className="mb-8 transition-transform duration-300 cursor-default">
	            <div className="slow-sway inline-block">
	              <span className="font-bubble text-[4rem] md:text-[6rem] leading-[0.9] text-white inline-block">
		              {lang === 'zh' ? (
		                <div className="flex gap-0 whitespace-nowrap tracking-tighter justify-center">
	                  <div className="title-shadow">
	                    {currentText.hero_title_1}
	                  </div>
	                  <div className="title-shadow">
	                    {currentText.hero_title_2}
	                  </div>
	                  <div className="title-shadow">
	                    {currentText.hero_title_3}
	                  </div>
	                </div>
	              ) : (
	                <div className="flex flex-col tracking-tight -space-y-1 md:-space-y-2 items-center">
	                  <div className="title-shadow">
	                    {currentText.hero_title_1}
	                  </div>
	                  <div className="title-shadow">
	                    {currentText.hero_title_2}
	                  </div>
	                </div>
	              )}
	              </span>
	            </div>
	          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-white mb-10 leading-relaxed font-bubble">
            {currentText.cta_main}
            <br />
            <span className="bg-[#FFE85F] text-black px-2 mx-1">
              {currentText.cta_highlight}
            </span>{' '}
            {currentText.cta_suffix}
          </h2>

          <div className="relative inline-block">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#FB458D] rounded-full blur-[110px] opacity-15 motion-safe:animate-pulse pointer-events-none -z-10" />
            <a
              className="
                group relative z-10 inline-flex w-full max-w-[355px] items-center justify-center gap-3 md:w-auto md:max-w-none md:gap-4
                bg-white text-black
                px-5 py-5 md:px-12 md:py-6 rounded-[1.25rem] md:rounded-3xl
                text-[clamp(1rem,4.7vw,1.25rem)] md:text-3xl font-black
                border-4 border-black
                shadow-[8px_8px_0px_#FB458D]
                hover:shadow-[12px_12px_0px_#22D3EE] hover:-translate-y-1 hover:-translate-x-1
                transition-all duration-200
                active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_#000]
              "
              href={APP_STORE_URL}
              aria-label={currentText.btn_download}
              onClick={trackAppStoreClick}
            >
              <AppleLogo size={36} />
              <span className="font-bubble whitespace-nowrap">{currentText.btn_download}</span>
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 md:gap-8 text-neutral-500 font-bold text-xs md:text-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FFE85F]" />
              <span>{currentText.feat_ios}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FB458D]" />
              <span>{currentText.feat_ads}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#22D3EE]" />
              <span>{currentText.feat_drunk}</span>
            </div>
	          </div>
	        </div>

	        <footer className="w-full py-8 border-t border-neutral-900 bg-[#0F0F0F] shrink-0">
	          <div className="w-full px-4 md:px-6 flex flex-row flex-wrap justify-between items-center text-neutral-600 text-xs md:text-sm gap-x-8 gap-y-4">
	            <div className="font-bold font-bubble">{currentText.footer_rights}</div>

		            <div className="bg-neutral-800 rounded-full p-1 flex items-center border border-neutral-700">
		              <a
		                href={zhHomePath}
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
		                href={zhHantHomePath}
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
	                href={enHomePath}
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

            <div className="flex flex-row flex-wrap gap-x-6 gap-y-2 font-bold">
              <a href={privacyPath} className="hover:text-[#FFE85F] transition-colors">
                {currentText.footer_privacy}
              </a>
              <a
                href="mailto:support@chugchug.app"
                className="hover:text-[#FB458D] transition-colors"
                aria-label={currentText.footer_contact}
              >
                {currentText.footer_contact}
              </a>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default App;
