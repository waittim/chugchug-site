import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Clock3, Wine } from 'lucide-react';
import SiteFooter from './components/SiteFooter.jsx';
import { SUPPORT_EMAIL } from './contact.js';
import { GAMES } from './content/games.jsx';
import { HOME_COPY } from './content/home.js';
import { getInitialLang } from './i18n.js';

const APP_STORE_URL = 'https://apps.apple.com/us/app/chugchug-party-game/id6758532049';
const DOWNLOAD_ANCHOR = '#download';

const FEATURED_IDS = new Set(['undercover', 'dice']);

const GAME_META = {
  dice: [3, '∞'],
  poker: [3, '∞'],
  buzzcards: [5, '60m'],
  six: [4, '5m'],
  lucky: [4, '2m'],
  truth: [2, '∞'],
  roulette: [4, '1m'],
  king: [1, '2m'],
  charades: [3, '5m'],
  execution: [3, '∞'],
  undercover: [2, '15m'],
  wavelength: [4, '3m'],
  aron36: [1, '45m'],
  angryoldman: [3, '1m'],
};

const GAME_ACCENTS = {
  dice: '#F2CF79',
  poker: '#F4F1EB',
  buzzcards: '#79CBD2',
  six: '#79CBD2',
  lucky: '#DC8BC9',
  truth: '#B082DD',
  roulette: '#79CBD2',
  king: '#F2CF79',
  charades: '#B082DD',
  execution: '#E58B92',
  undercover: '#E9AA6B',
  wavelength: '#DC8BC9',
  aron36: '#DC8BC9',
  angryoldman: '#E9AA6B',
};

const AppleLogo = ({ size = 30 }) => (
  <span aria-hidden="true" className="apple-mark" style={{ fontSize: size }}>
    {'\uf8ff'}
  </span>
);

const AmbientLights = ({ variant = 'default' }) => (
  <div className={`ambient ambient--${variant}`} aria-hidden="true">
    <span className="ambient__light ambient__light--primary" />
    <span className="ambient__light ambient__light--support" />
    <span className="ambient__light ambient__light--accent" />
  </div>
);

const StoreButton = ({ label, lead, onClick, className = '' }) => (
  <a
    href={APP_STORE_URL}
    className={`store-button ${className}`.trim()}
    aria-label={label}
    onClick={onClick}
  >
    <AppleLogo />
    <span>
      <small>{lead}</small>
      App Store
    </span>
  </a>
);

const App = () => {
  const [lang] = useState(getInitialLang);
  const [flippedIds, setFlippedIds] = useState(() => new Set());
  const currentText = HOME_COPY[lang] ?? HOME_COPY.en;
  const isChinese = lang === 'zh' || lang === 'zh-Hant';
  const isTraditional = lang === 'zh-Hant';
  const brand = lang === 'zh' ? '吨吨吨 · ChugChug' : 'ChugChug';
  const baseUrl = import.meta.env.BASE_URL || '/';

  useEffect(() => {
    document.title =
      lang === 'zh'
        ? '吨吨吨 - 派对游戏 App'
        : lang === 'zh-Hant'
          ? 'ChugChug - 派對遊戲 App'
          : 'ChugChug - Party Game App';
  }, [lang]);

  const screenshots = useMemo(() => {
    const folder = `${baseUrl}screenshot/${isChinese ? 'zh' : 'en'}/`;
    const menu = isChinese ? 'menu-zh.jpeg' : 'menu.jpeg';
    const files = [
      menu,
      'dice.jpeg',
      'truthordare.jpeg',
      'lucky.jpeg',
      'mostlikelyto.jpeg',
      'wavelength.jpeg',
      'undercover.jpeg',
    ];
    return files.map((file) => ({
      id: file.replace('.jpeg', ''),
      src: `${folder}${file}`,
      featured: file === menu,
    }));
  }, [baseUrl, isChinese]);

  const orderedGames = useMemo(() => {
    const featured = GAMES.filter((game) => FEATURED_IDS.has(game.id));
    const rest = GAMES.filter((game) => !FEATURED_IDS.has(game.id));
    return [...featured, ...rest];
  }, []);

  const marqueeRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return undefined;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const autoSpeed = 34;
    const resumeDelayMs = 1500;

    let offset = 0;
    let rafId = 0;
    let lastTime = 0;
    let activePointerId = null;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let dragMoved = false;
    let resumeAt = 0;

    const applyOffset = () => {
      const loopWidth = marquee.scrollWidth / 2;
      if (loopWidth > 0) offset = ((offset % loopWidth) + loopWidth) % loopWidth;
      marquee.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };

    const step = (time) => {
      if (lastTime === 0) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (activePointerId === null && time >= resumeAt && !reduceMotionQuery.matches) {
        offset += autoSpeed * dt;
        applyOffset();
      }
      rafId = requestAnimationFrame(step);
    };

    const onPointerDown = (event) => {
      if (!event.isPrimary) return;
      activePointerId = event.pointerId;
      dragStartX = event.clientX;
      dragStartOffset = offset;
      dragMoved = false;
      marquee.classList.add('is-dragging');
      try {
        marquee.setPointerCapture(event.pointerId);
      } catch {
        // capture is best-effort
      }
    };

    const onPointerMove = (event) => {
      if (event.pointerId !== activePointerId) return;
      const delta = event.clientX - dragStartX;
      if (Math.abs(delta) > 3) dragMoved = true;
      offset = dragStartOffset - delta;
      applyOffset();
    };

    const endDrag = (event) => {
      if (event.pointerId !== activePointerId) return;
      activePointerId = null;
      marquee.classList.remove('is-dragging');
      resumeAt = performance.now() + resumeDelayMs;
    };

    const onClickCapture = (event) => {
      if (dragMoved) {
        event.preventDefault();
        event.stopPropagation();
        dragMoved = false;
      }
    };

    marquee.addEventListener('pointerdown', onPointerDown);
    marquee.addEventListener('pointermove', onPointerMove);
    marquee.addEventListener('pointerup', endDrag);
    marquee.addEventListener('pointercancel', endDrag);
    marquee.addEventListener('click', onClickCapture, true);
    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      marquee.removeEventListener('pointerdown', onPointerDown);
      marquee.removeEventListener('pointermove', onPointerMove);
      marquee.removeEventListener('pointerup', endDrag);
      marquee.removeEventListener('pointercancel', endDrag);
      marquee.removeEventListener('click', onClickCapture, true);
      marquee.style.transform = '';
    };
  }, [screenshots]);

  const track = (event, url) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', event, {
      event_category: event === 'app_store_click' ? 'outbound' : 'navigation',
      event_label: event === 'app_store_click' ? 'app_store' : 'download_anchor',
      link_url: url,
      language: lang,
      transport_type: 'beacon',
    });
  };

  const toggleCard = (id) => {
    setFlippedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="site-shell">
      <nav className="site-nav" aria-label="Primary">
        <a href="#top" className="brand-mark">{brand}</a>
        <a
          href={DOWNLOAD_ANCHOR}
          className="glass-pill nav-download"
          onClick={() => track('navbar_download_click', DOWNLOAD_ANCHOR)}
        >
          {currentText.nav_download}
        </a>
      </nav>

      <main>
        <section id="top" className="hero-section">
          <AmbientLights />
          <div className="hero-copy">
            <h1 className="hero-title">
              {lang === 'zh' ? (
                <span>吨吨吨</span>
              ) : (
                <>
                  <span>Chug</span>
                  <span className="hero-title__ghost">Chug</span>
                </>
              )}
            </h1>
            <p className="hero-subtitle">{currentText.hero_subtitle}</p>
            <StoreButton
              label={currentText.btn_download}
              lead={currentText.store_badge_lead}
              className="store-button--hero"
              onClick={() => track('app_store_click', APP_STORE_URL)}
            />
          </div>

          <div className="screens-stage" aria-label={isChinese ? 'App 截图' : 'App screenshots'}>
            <div className="screens-track no-scrollbar">
              <div className="screens-marquee" ref={marqueeRef}>
                {[false, true].map((isDuplicate) => (
                  <div
                    className="screens-group"
                    key={isDuplicate ? 'duplicate' : 'primary'}
                    aria-hidden={isDuplicate || undefined}
                  >
                    {screenshots.map((shot, index) => (
                      <figure
                        key={`${isDuplicate ? 'duplicate' : 'primary'}-${shot.id}`}
                        className={`phone-frame ${shot.featured ? 'phone-frame--featured' : ''}`}
                      >
                        <img
                          src={shot.src}
                          alt={
                            isDuplicate
                              ? ''
                              : shot.featured
                                ? isTraditional
                                  ? '主選單截圖'
                                  : isChinese
                                    ? '主菜单截图'
                                    : 'Main menu screenshot'
                                : isTraditional
                                  ? '遊戲截圖'
                                  : isChinese
                                    ? '游戏截图'
                                    : 'Game screenshot'
                          }
                          loading={isDuplicate || index > 2 ? 'lazy' : 'eager'}
                          draggable={false}
                          onError={(event) => {
                            event.currentTarget.src = `${baseUrl}placeholder.svg`;
                          }}
                        />
                      </figure>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="experience-section">
          <AmbientLights variant="soft" />
          <div className="section-stack">
            <header className="section-intro">
              <p className="section-kicker">{currentText.highlights_eyebrow}</p>
              <h2>{currentText.highlights_title}</h2>
              <p>{currentText.highlights_intro}</p>
            </header>
            <div className="feature-list">
              {currentText.highlights.map(([title, body]) => (
                <article className="feature-row" key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="games-section">
          <AmbientLights variant="games" />
          <header className="games-header">
            <h2>
              {currentText.grid_title_prefix}
              <br />
              <em>{currentText.grid_title_suffix}</em>
            </h2>
            <p>{currentText.grid_desc}</p>
          </header>

          <div className="games-grid">
            {orderedGames.map((game) => {
              const [drunkLevel, duration] = GAME_META[game.id] ?? [1, '∞'];
              const isFlipped = flippedIds.has(game.id);
              const isFeatured = FEATURED_IDS.has(game.id);
              const name = game.name[lang] ?? game.name.zh ?? game.name.en;
              const accent = GAME_ACCENTS[game.id] ?? '#F2CF79';
              const cardLabel = (currentText.a11y_game_card || '{name}, drunk level {level}, duration {duration}')
                .replace('{name}', name)
                .replace('{level}', String(drunkLevel))
                .replace('{duration}', String(duration));

              return (
                <button
                  type="button"
                  key={game.id}
                  className={`game-card ${isFeatured ? 'game-card--featured' : ''} ${isFlipped ? 'is-flipped' : ''}`}
                  style={{ '--accent': accent }}
                  aria-label={cardLabel}
                  aria-pressed={isFlipped}
                  data-game-key={game.id}
                  onClick={() => toggleCard(game.id)}
                >
                  <span className="game-card__inner">
                    <span className="game-card__face game-card__front">
                      <span className="game-card__icon">
                        {React.cloneElement(game.icon, { size: isFeatured ? 34 : 28, className: '' })}
                      </span>
                      <span className="game-card__spacer" />
                      <strong>{name}</strong>
                      <span className="game-card__meta">
                        <span className="wine-level" aria-label={`drunk level ${drunkLevel} of 5`}>
                          {Array.from({ length: 5 }, (_, index) => (
                            <Wine
                              key={index}
                              size={10}
                              className={index < drunkLevel ? 'is-full' : ''}
                            />
                          ))}
                        </span>
                        <span>
                          <Clock3 size={11} />
                          {duration}
                        </span>
                      </span>
                      <span className="game-card__hint">{currentText.card_hint_front}</span>
                    </span>
                    <span className="game-card__face game-card__back">
                      <span className="game-card__back-label">{currentText.rules_title}</span>
                      <strong>{name}</strong>
                      <span className="game-card__rules">
                        {game.rules?.[lang] ?? game.rules?.zh ?? game.rules?.en ?? ''}
                      </span>
                      <span className="game-card__return">{currentText.card_hint_back}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section id="download" className="download-section">
          <AmbientLights variant="download" />
          <div className="download-card">
            <p className="download-card__lead">
              {currentText.cta_lead}
              <span aria-hidden="true"> · </span>
              <strong>{currentText.cta_badge}</strong>
            </p>
            <h2>{currentText.cta_title}</h2>
            <StoreButton
              label={currentText.btn_download}
              lead={currentText.store_badge_lead}
              onClick={() => track('app_store_click', APP_STORE_URL)}
            />
            <div className="download-facts">
              <span>{currentText.feat_ios}</span>
              <span>{currentText.feat_ads}</span>
              <span>{currentText.feat_drunk}</span>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter
        lang={lang}
        brand={brand}
        copyright={currentText.footer_rights}
        languageHref={(code) => `${baseUrl}?lang=${code}`}
        links={[
          {
            href: `${baseUrl}privacy.html?lang=${lang}`,
            label: currentText.footer_privacy,
          },
          {
            href: `mailto:${SUPPORT_EMAIL}`,
            label: currentText.footer_contact,
          },
        ]}
      />
    </div>
  );
};

export default App;
