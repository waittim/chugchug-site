import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'motion';
import { useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Clock3 } from 'lucide-react';
import SiteHeader from './components/SiteHeader.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import InAppGuideModal from './components/InAppGuideModal.jsx';
import AppleLogo from './components/AppleLogo.jsx';
import AmbientLights from './components/AmbientLights.jsx';
import WineRating from './components/WineRating.jsx';
import { usePressHandlers } from './hooks/usePressHandlers.js';
import { SUPPORT_EMAIL } from './contact.js';
import { GAMES } from './content/games.jsx';
import { HOME_COPY } from './content/home.js';
import { getInitialLang, getLocalizedPath } from './i18n.js';
import { APP_STORE_URL, ITMS_APP_STORE_URL, isInAppBrowser } from './utils/inAppBrowser.js';

const DRAG_THRESHOLD = 10;
const VELOCITY_SAMPLE_LIMIT = 5;
const FLICK_VELOCITY = 220; // px/s — bounce only for real flicks
const COAST_MIN_VELOCITY = 8; // px/s — keep residual motion until drag commits
const CARD_FLICK_VELOCITY = 480; // deg/s
const CARD_DRAG_SCALE = 0.42; // deg per px

/** Apple Designing Fluid Interfaces projection (px/s → px delta) */
function projectMomentum(initialVelocity, decelerationRate = 0.998) {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}

/** Progressive resistance past a bound (Apple rubber-band) */
function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

function clampRubber(value, min, max, dimension) {
  if (value < min) return min - rubberband(min - value, dimension);
  if (value > max) return max + rubberband(value - max, dimension);
  return value;
}

const DOWNLOAD_ANCHOR = '#download';
const SCREEN_WIDTH = 750;
const SCREEN_HEIGHT = 1630;

const FEATURED_IDS = new Set(['undercover', 'dice']);

/** Homepage marquee: menu + every available game screenshot */
const SCREENSHOT_REEL = [
  { file: 'menu', gameId: null, featured: true },
  { file: 'dice', gameId: 'dice' },
  { file: 'undercover', gameId: 'undercover' },
  { file: 'truthordare', gameId: 'truth' },
  { file: 'buzzcards', gameId: 'buzzcards' },
  { file: 'poker', gameId: 'poker' },
  { file: 'lucky', gameId: 'lucky' },
  { file: 'kingsgame', gameId: 'king' },
  { file: 'mostlikelyto', gameId: 'execution' },
  { file: 'wavelength', gameId: 'wavelength' },
  { file: 'headsupcategory', gameId: 'charades' },
  { file: 'sixone', gameId: 'six' },
];

const StoreButton = ({ label, lead, onClick, className = '' }) => {
  const { isPressed, pressProps } = usePressHandlers();
  return (
    <a
      href={APP_STORE_URL}
      className={`store-button ${isPressed ? 'is-pressed' : ''} ${className}`.trim()}
      aria-label={label}
      onClick={onClick}
      {...pressProps}
    >
      <AppleLogo size={24} />
      <span>
        <small>{lead}</small>
        App Store
      </span>
    </a>
  );
};

const ScreensControl = ({ direction, label, onNudge }) => {
  const { isPressed, pressProps } = usePressHandlers();
  const Icon = direction < 0 ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      className={`screens-control screens-control--${direction < 0 ? 'prev' : 'next'}${isPressed ? ' is-pressed' : ''}`}
      aria-label={label}
      onClick={() => onNudge(direction)}
      {...pressProps}
    >
      <Icon size={20} aria-hidden="true" />
    </button>
  );
};

const GameCardFace = ({
  side,
  game,
  lang,
  drunkLevel,
  duration,
  name,
  currentText,
  isFeatured,
  hidden = false,
}) => (
  <span
    className={`game-card__face game-card__${side}${hidden ? ' game-card__face--hidden' : ''}`}
  >
    {side === 'front' ? (
      <>
        <span className="game-card__icon">
          {React.cloneElement(game.icon, { size: isFeatured ? 34 : 28, className: '' })}
        </span>
        <span className="game-card__spacer" />
        <strong>{name}</strong>
        <span className="game-card__meta">
          <WineRating rating={drunkLevel} />
          <span>
            <Clock3 size={11} aria-hidden="true" />
            {duration}
          </span>
        </span>
        <span className="game-card__hint">{currentText.card_hint_front}</span>
      </>
    ) : (
      <>
        <span className="game-card__back-label">{currentText.rules_title}</span>
        <strong>{name}</strong>
        <span className="game-card__rules">
          {game.rules?.[lang] ?? game.rules?.zh ?? game.rules?.en ?? ''}
        </span>
        <span className="game-card__return">{currentText.card_hint_back}</span>
      </>
    )}
  </span>
);

const GameCard = ({
  game,
  lang,
  isFlipped,
  isFeatured,
  cardLabel,
  currentText,
  drunkLevel,
  duration,
  name,
  onFlipChange,
  reduceMotion,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const innerRef = useRef(null);
  const rotateRef = useRef(isFlipped ? 180 : 0);
  const springRef = useRef(null);
  const springVelocityRef = useRef(0);
  const settlingRef = useRef(false);
  const pointerRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    startRotate: 0,
    committed: false,
    samples: [],
  });

  const applyRotate = (value, stretch = 0) => {
    rotateRef.current = value;
    const el = innerRef.current;
    if (!el) return;
    const sx = 1 + stretch;
    el.style.transform = stretch
      ? `rotateY(${value}deg) scaleX(${sx})`
      : `rotateY(${value}deg)`;
  };

  const cancelSpring = () => {
    if (springRef.current) {
      springRef.current.stop();
      springRef.current = null;
    }
  };

  const springTo = (target, velocity = 0, onComplete) => {
    cancelSpring();
    const from = rotateRef.current;

    if (reduceMotion) {
      applyRotate(target, 0);
      settlingRef.current = false;
      onComplete?.();
      return;
    }

    let prev = from;
    let prevT = performance.now();
    springVelocityRef.current = velocity;
    settlingRef.current = true;

    springRef.current = animate(from, target, {
      type: 'spring',
      bounce: Math.abs(velocity) > CARD_FLICK_VELOCITY ? 0.18 : 0,
      duration: 0.38,
      velocity,
      onUpdate: (value) => {
        const now = performance.now();
        const dt = (now - prevT) / 1000;
        if (dt > 0.001) springVelocityRef.current = (value - prev) / dt;
        prev = value;
        prevT = now;
        applyRotate(value, 0);
      },
      onComplete: () => {
        springRef.current = null;
        springVelocityRef.current = 0;
        settlingRef.current = false;
        applyRotate(target, 0);
        onComplete?.();
      },
    });
  };

  // Sync when flipped state changes without an in-flight settle
  useEffect(() => {
    if (pointerRef.current.active || settlingRef.current) return undefined;
    const target = isFlipped ? 180 : 0;
    if (Math.abs(rotateRef.current - target) < 0.5) {
      applyRotate(target, 0);
      return undefined;
    }
    springTo(target, 0);
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlipped, reduceMotion]);

  useEffect(() => () => cancelSpring(), []);

  useLayoutEffect(() => {
    applyRotate(rotateRef.current, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addSample = (x) => {
    const samples = pointerRef.current.samples;
    samples.push({ x, t: performance.now() });
    if (samples.length > VELOCITY_SAMPLE_LIMIT) samples.shift();
  };

  const getPointerVelocity = () => {
    const samples = pointerRef.current.samples;
    if (samples.length < 2) return 0;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const dt = (last.t - first.t) / 1000;
    if (dt <= 0) return 0;
    return (last.x - first.x) / dt;
  };

  const handlePointerDown = (event) => {
    if (!event.isPrimary) return;
    cancelSpring();
    settlingRef.current = false;
    pointerRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startRotate: rotateRef.current,
      committed: false,
      samples: [],
    };
    addSample(event.clientX);
    setIsPressed(true);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // capture is best-effort
    }
  };

  const handlePointerMove = (event) => {
    const state = pointerRef.current;
    if (!state.active || event.pointerId !== state.pointerId) return;

    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;

    if (!state.committed) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      if (Math.abs(dy) > Math.abs(dx) * 1.35) {
        state.active = false;
        setIsPressed(false);
        setIsDragging(false);
        return;
      }
      state.committed = true;
      state.startX = event.clientX;
      state.startRotate = rotateRef.current;
      setIsDragging(true);
      setIsPressed(false);
    }

    addSample(event.clientX);
    const raw = state.startRotate + (event.clientX - state.startX) * CARD_DRAG_SCALE;
    const next = clampRubber(raw, 0, 180, 180);
    const stretch = Math.min(0.035, Math.abs(event.clientX - state.startX) * 0.00012);
    applyRotate(next, stretch);
  };

  const settleTo = (target, velocity) => {
    const flipped = target >= 90;
    springTo(target, velocity);
    if (flipped !== isFlipped) onFlipChange(game.id, flipped);
  };

  const handlePointerEnd = (event) => {
    const state = pointerRef.current;
    if (!state.active || (event.pointerId != null && event.pointerId !== state.pointerId)) return;
    state.active = false;
    setIsPressed(false);
    setIsDragging(false);

    if (reduceMotion) {
      if (!state.committed) onFlipChange(game.id, !isFlipped);
      return;
    }

    if (!state.committed) {
      settleTo(isFlipped ? 0 : 180, 0);
      return;
    }

    const pointerVx = getPointerVelocity();
    const angularVelocity = pointerVx * CARD_DRAG_SCALE;
    const projected = rotateRef.current + projectMomentum(angularVelocity);
    let target;
    if (Math.abs(angularVelocity) > CARD_FLICK_VELOCITY) {
      target = angularVelocity > 0 ? 180 : 0;
    } else {
      target = projected >= 90 ? 180 : 0;
    }
    settleTo(target, angularVelocity);
  };

  const cardClass = [
    'game-card',
    isFeatured ? 'game-card--featured' : '',
    isFlipped ? 'is-flipped' : '',
    isPressed ? 'is-pressed' : '',
    isDragging ? 'is-dragging' : '',
    reduceMotion ? 'game-card--reduced-motion' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={cardClass}
      aria-label={cardLabel}
      aria-pressed={isFlipped}
      data-game-key={game.id}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      {reduceMotion ? (
        <span className="game-card__inner game-card__inner--flat">
          <GameCardFace
            side="front"
            hidden={isFlipped}
            game={game}
            lang={lang}
            drunkLevel={drunkLevel}
            duration={duration}
            name={name}
            currentText={currentText}
            isFeatured={isFeatured}
          />
          <GameCardFace
            side="back"
            hidden={!isFlipped}
            game={game}
            lang={lang}
            drunkLevel={drunkLevel}
            duration={duration}
            name={name}
            currentText={currentText}
            isFeatured={isFeatured}
          />
        </span>
      ) : (
        <span
          ref={innerRef}
          className="game-card__inner"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <GameCardFace
            side="front"
            game={game}
            lang={lang}
            drunkLevel={drunkLevel}
            duration={duration}
            name={name}
            currentText={currentText}
            isFeatured={isFeatured}
          />
          <GameCardFace
            side="back"
            game={game}
            lang={lang}
            drunkLevel={drunkLevel}
            duration={duration}
            name={name}
            currentText={currentText}
            isFeatured={isFeatured}
          />
        </span>
      )}
    </button>
  );
};

const App = () => {
  const [lang] = useState(getInitialLang);
  const [flippedIds, setFlippedIds] = useState(() => new Set());
  const [showInAppGuide, setShowInAppGuide] = useState(false);
  const reduceMotion = useReducedMotion();
  const currentText = HOME_COPY[lang] ?? HOME_COPY.en;
  const isChinese = lang === 'zh' || lang === 'zh-Hant';
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
    const gameById = Object.fromEntries(GAMES.map((game) => [game.id, game]));

    return SCREENSHOT_REEL.map((entry) => {
      const file =
        entry.featured && isChinese ? 'menu-zh.jpeg' : `${entry.file}.jpeg`;
      const webp = file.replace(/\.jpeg$/, '.webp');
      const game = entry.gameId ? gameById[entry.gameId] : null;
      const gameName = game
        ? game.name[lang] ?? game.name.zh ?? game.name.en
        : null;

      return {
        id: entry.file,
        src: `${folder}${file}`,
        srcWebp: `${folder}${webp}`,
        featured: Boolean(entry.featured),
        alt: entry.featured
          ? currentText.a11y_screen_menu
          : (currentText.a11y_screen_game || '{name}').replace(
              '{name}',
              gameName || entry.file,
            ),
      };
    });
  }, [baseUrl, currentText, isChinese, lang]);

  const orderedGames = useMemo(() => {
    const featured = GAMES.filter((game) => FEATURED_IDS.has(game.id));
    const rest = GAMES.filter((game) => !FEATURED_IDS.has(game.id));
    return [...featured, ...rest];
  }, []);

  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const activeScreenIndexRef = useRef(0);
  const marqueeRef = useRef(null);
  const marqueeApiRef = useRef({ nudge: () => {}, goToIndex: () => {} });

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return undefined;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const autoSpeed = 34;
    const resumeDelayMs = 1500;

    let offset = 0;
    let rafId = 0;
    let coastRafId = 0;
    let resumeTimeoutId = 0;
    let lastTime = 0;
    let coastLastTime = 0;
    let activePointerId = null;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let dragMoved = false;
    let dragCommitted = false;
    let resumeAt = 0;
    let springControl = null;
    let springVelocity = 0;
    let coastVelocity = 0;
    const velocitySamples = [];

    const setWillChange = (enabled) => {
      marquee.style.willChange = enabled ? 'transform' : 'auto';
    };

    const setStretch = (value) => {
      marquee.style.setProperty('--marquee-stretch', String(value));
    };

    const getLoopWidth = () => {
      const primary = marquee.querySelector('.screens-group:not(.screens-group--clone)');
      return primary?.offsetWidth || marquee.scrollWidth / 2 || 0;
    };

    const getSnapInterval = () => {
      const group = marquee.querySelector('.screens-group:not(.screens-group--clone)');
      const frame = group?.querySelector('.phone-frame');
      if (!group || !frame) return 0;
      const gap = parseFloat(getComputedStyle(group).columnGap || getComputedStyle(group).gap) || 0;
      return frame.getBoundingClientRect().width + gap;
    };

    const nearestSnapPoint = (position) => {
      const interval = getSnapInterval();
      if (interval <= 0) return position;
      return Math.round(position / interval) * interval;
    };

    const updateActiveIndex = (currentOffset) => {
      const interval = getSnapInterval();
      if (interval <= 0) return;
      const count = screenshots.length;
      if (count <= 0) return;
      const rawIdx = Math.round(currentOffset / interval);
      const normalizedIdx = ((rawIdx % count) + count) % count;
      if (normalizedIdx !== activeScreenIndexRef.current) {
        activeScreenIndexRef.current = normalizedIdx;
        setActiveScreenIndex(normalizedIdx);
      }
    };

    const applyOffset = () => {
      const loopWidth = getLoopWidth();
      if (loopWidth > 0) offset = ((offset % loopWidth) + loopWidth) % loopWidth;
      marquee.style.transform = `translate3d(${-offset}px, 0, 0)`;
      updateActiveIndex(offset);
    };

    const stopCoast = () => {
      if (coastRafId) cancelAnimationFrame(coastRafId);
      coastRafId = 0;
      coastLastTime = 0;
      coastVelocity = 0;
    };

    const cancelSpring = () => {
      const retained = springVelocity;
      if (springControl) {
        springControl.stop();
        springControl = null;
      }
      springVelocity = 0;
      return retained;
    };

    const addVelocitySample = (x, t = performance.now()) => {
      velocitySamples.push({ x, t });
      if (velocitySamples.length > VELOCITY_SAMPLE_LIMIT) velocitySamples.shift();
    };

    const getReleaseVelocity = () => {
      if (velocitySamples.length < 2) return 0;
      const first = velocitySamples[0];
      const last = velocitySamples[velocitySamples.length - 1];
      const dt = (last.t - first.t) / 1000;
      if (dt <= 0) return 0;
      return (last.x - first.x) / dt;
    };

    const springTo = (target, velocity = 0, onComplete) => {
      cancelSpring();
      stopCoast();
      const from = offset;

      if (reduceMotionQuery.matches) {
        offset = target;
        applyOffset();
        setStretch(0);
        onComplete?.();
        return;
      }

      setWillChange(true);
      let prev = from;
      let prevT = performance.now();
      springVelocity = velocity;

      springControl = animate(from, target, {
        type: 'spring',
        bounce: Math.abs(velocity) > FLICK_VELOCITY ? 0.2 : 0,
        duration: 0.4,
        velocity,
        onUpdate: (value) => {
          const now = performance.now();
          const dt = (now - prevT) / 1000;
          if (dt > 0.001) springVelocity = (value - prev) / dt;
          prev = value;
          prevT = now;
          offset = value;
          applyOffset();
        },
        onComplete: () => {
          springControl = null;
          springVelocity = 0;
          setWillChange(false);
          setStretch(0);
          onComplete?.();
        },
      });
    };

    const snapFromRelease = (offsetVelocity) => {
      const projected = offset + projectMomentum(offsetVelocity);
      const target = nearestSnapPoint(projected);
      springTo(target, offsetVelocity, finishInteraction);
    };

    const startCoast = (velocity) => {
      stopCoast();
      if (Math.abs(velocity) < COAST_MIN_VELOCITY || reduceMotionQuery.matches) return;
      coastVelocity = velocity;
      setWillChange(true);

      const step = (time) => {
        if (activePointerId === null || dragCommitted) {
          coastRafId = 0;
          return;
        }
        if (coastLastTime === 0) coastLastTime = time;
        const dt = Math.min((time - coastLastTime) / 1000, 0.1);
        coastLastTime = time;
        offset += coastVelocity * dt;
        coastVelocity *= Math.exp(-3.2 * dt);
        applyOffset();
        if (Math.abs(coastVelocity) < COAST_MIN_VELOCITY) {
          coastRafId = 0;
          coastVelocity = 0;
          return;
        }
        coastRafId = requestAnimationFrame(step);
      };

      coastRafId = requestAnimationFrame(step);
    };

    const stopAuto = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      if (resumeTimeoutId) window.clearTimeout(resumeTimeoutId);
      resumeTimeoutId = 0;
      lastTime = 0;
    };

    const scheduleAutoResume = () => {
      if (reduceMotionQuery.matches || activePointerId !== null) return;
      if (resumeTimeoutId) window.clearTimeout(resumeTimeoutId);
      const delay = Math.max(0, resumeAt - performance.now());
      resumeTimeoutId = window.setTimeout(() => {
        resumeTimeoutId = 0;
        startAuto();
      }, delay);
    };

    const startAuto = () => {
      if (reduceMotionQuery.matches || activePointerId !== null || rafId) return;
      if (performance.now() < resumeAt) {
        scheduleAutoResume();
        return;
      }

      const step = (time) => {
        if (activePointerId !== null || reduceMotionQuery.matches) {
          stopAuto();
          return;
        }
        if (time < resumeAt) {
          stopAuto();
          scheduleAutoResume();
          return;
        }

        if (lastTime === 0) lastTime = time;
        const dt = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;
        setWillChange(true);
        offset += autoSpeed * dt;
        applyOffset();
        rafId = requestAnimationFrame(step);
      };

      rafId = requestAnimationFrame(step);
    };

    const finishInteraction = () => {
      resumeAt = performance.now() + resumeDelayMs;
      scheduleAutoResume();
    };

    const onPointerDown = (event) => {
      if (!event.isPrimary) return;
      const inheritedSpring = cancelSpring();
      const wasAuto = rafId !== 0;
      stopAuto();
      activePointerId = event.pointerId;
      dragStartX = event.clientX;
      dragStartOffset = offset;
      dragMoved = false;
      dragCommitted = false;
      velocitySamples.length = 0;
      addVelocitySample(event.clientX);
      setWillChange(true);
      setStretch(0);
      marquee.classList.add('is-dragging');
      startCoast(inheritedSpring || (wasAuto ? autoSpeed : 0));
      try {
        marquee.setPointerCapture(event.pointerId);
      } catch {
        // capture is best-effort
      }
    };

    const onPointerMove = (event) => {
      if (event.pointerId !== activePointerId) return;
      const delta = event.clientX - dragStartX;

      if (!dragCommitted) {
        if (Math.abs(delta) < DRAG_THRESHOLD) return;
        stopCoast();
        dragCommitted = true;
        dragStartX = event.clientX;
        dragStartOffset = offset;
      }

      dragMoved = true;
      addVelocitySample(event.clientX);
      const fingerDelta = event.clientX - dragStartX;
      offset = dragStartOffset - fingerDelta;
      const stretch = Math.min(0.045, Math.abs(fingerDelta) * 0.00014);
      setStretch(stretch);
      applyOffset();
    };

    const onPointerUp = (event) => {
      if (event.pointerId !== activePointerId) return;
      const leftoverCoast = coastVelocity;
      stopCoast();
      activePointerId = null;
      marquee.classList.remove('is-dragging');
      setStretch(0);

      if (dragCommitted) {
        const pointerVelocity = getReleaseVelocity();
        const offsetVelocity = -pointerVelocity;
        snapFromRelease(offsetVelocity);
      } else if (Math.abs(leftoverCoast) > COAST_MIN_VELOCITY) {
        snapFromRelease(leftoverCoast);
      } else {
        springTo(nearestSnapPoint(offset), 0, finishInteraction);
      }
    };

    const onClickCapture = (event) => {
      if (dragMoved) {
        event.preventDefault();
        event.stopPropagation();
        dragMoved = false;
      }
    };

    const onReduceMotionChange = () => {
      cancelSpring();
      stopCoast();
      stopAuto();
      if (!reduceMotionQuery.matches) scheduleAutoResume();
    };

    marqueeApiRef.current = {
      nudge: (direction) => {
        cancelSpring();
        stopCoast();
        stopAuto();
        const interval = getSnapInterval() || Math.min(window.innerWidth * 0.42, 300);
        const origin = nearestSnapPoint(offset);
        springTo(origin + direction * interval, 0, finishInteraction);
      },
      goToIndex: (targetIdx) => {
        cancelSpring();
        stopCoast();
        stopAuto();
        const interval = getSnapInterval() || Math.min(window.innerWidth * 0.42, 300);
        const count = screenshots.length;
        if (interval <= 0 || count <= 0) return;
        const currentIdx = ((Math.round(offset / interval) % count) + count) % count;
        let diff = targetIdx - currentIdx;
        if (diff > count / 2) diff -= count;
        if (diff < -count / 2) diff += count;
        const targetOffset = offset + diff * interval;
        springTo(targetOffset, 0, finishInteraction);
      },
    };

    if (!reduceMotionQuery.matches) scheduleAutoResume();

    marquee.addEventListener('pointerdown', onPointerDown);
    marquee.addEventListener('pointermove', onPointerMove);
    marquee.addEventListener('pointerup', onPointerUp);
    marquee.addEventListener('pointercancel', onPointerUp);
    marquee.addEventListener('click', onClickCapture, true);
    reduceMotionQuery.addEventListener('change', onReduceMotionChange);

    return () => {
      cancelSpring();
      stopCoast();
      stopAuto();
      marquee.removeEventListener('pointerdown', onPointerDown);
      marquee.removeEventListener('pointermove', onPointerMove);
      marquee.removeEventListener('pointerup', onPointerUp);
      marquee.removeEventListener('pointercancel', onPointerUp);
      marquee.removeEventListener('click', onClickCapture, true);
      reduceMotionQuery.removeEventListener('change', onReduceMotionChange);
      marquee.style.transform = '';
      marquee.style.willChange = 'auto';
      marquee.style.removeProperty('--marquee-stretch');
      marqueeApiRef.current = { nudge: () => {}, goToIndex: () => {} };
    };
  }, [screenshots]);

  const nudgeMarquee = (direction) => {
    marqueeApiRef.current.nudge(direction);
  };

  const onScreensKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      nudgeMarquee(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      nudgeMarquee(1);
    }
  };

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

  const handleDownloadClick = (event) => {
    track('app_store_click', APP_STORE_URL);
    if (isInAppBrowser()) {
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      setShowInAppGuide(true);
      try {
        window.location.href = ITMS_APP_STORE_URL;
      } catch (_) {}
    }
  };

  const setCardFlipped = (id, flipped) => {
    setFlippedIds((previous) => {
      const next = new Set(previous);
      if (flipped) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <div className="site-shell">
      <a href="#main-content" className="skip-link">
        {currentText.a11y_skip}
      </a>

      <SiteHeader brand={brand} brandHref="#top" navLabel={currentText.a11y_nav}>
        <a
          href={DOWNLOAD_ANCHOR}
          className="nav-download"
          onClick={() => track('navbar_download_click', DOWNLOAD_ANCHOR)}
        >
          {currentText.nav_download}
        </a>
      </SiteHeader>

      <main id="main-content">
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
              onClick={handleDownloadClick}
            />
          </div>

          <div
            className="screens-stage"
            role="region"
            aria-label={currentText.a11y_screens}
            tabIndex={0}
            onKeyDown={onScreensKeyDown}
          >
            <ScreensControl
              direction={-1}
              label={currentText.a11y_screens_prev}
              onNudge={nudgeMarquee}
            />
            <div className="screens-track no-scrollbar">
              <div className="screens-marquee" ref={marqueeRef}>
                {[false, true].map((isDuplicate) => (
                  <div
                    className={`screens-group${isDuplicate ? ' screens-group--clone' : ''}`}
                    key={isDuplicate ? 'duplicate' : 'primary'}
                    aria-hidden={isDuplicate || undefined}
                  >
                    {screenshots.map((shot, index) => (
                      <figure
                        key={`${isDuplicate ? 'duplicate' : 'primary'}-${shot.id}`}
                        className={`phone-frame ${shot.featured ? 'phone-frame--featured' : ''}`}
                      >
                        <picture>
                          <source srcSet={shot.srcWebp} type="image/webp" />
                          <img
                            src={shot.src}
                            width={SCREEN_WIDTH}
                            height={SCREEN_HEIGHT}
                            alt={isDuplicate ? '' : shot.alt}
                            loading={isDuplicate || index > 2 ? 'lazy' : 'eager'}
                            decoding="async"
                            fetchpriority={isDuplicate || index > 0 ? 'low' : 'high'}
                            draggable={false}
                            onError={(event) => {
                              event.currentTarget.src = `${baseUrl}placeholder.svg`;
                            }}
                          />
                        </picture>
                      </figure>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <ScreensControl
              direction={1}
              label={currentText.a11y_screens_next}
              onNudge={nudgeMarquee}
            />
            <div
              className="screens-pagination"
              role="group"
              aria-label={currentText.a11y_screens_pagination}
            >
              {screenshots.map((shot, index) => (
                <button
                  key={shot.id}
                  type="button"
                  className={`screens-dot ${index === activeScreenIndex ? 'is-active' : ''}`}
                  aria-label={`${shot.alt} (${index + 1}/${screenshots.length})`}
                  onClick={() => marqueeApiRef.current.goToIndex(index)}
                />
              ))}
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
              const drunkLevel = game.drunkLevel ?? 1;
              const duration = game.duration ?? '∞';
              const isFlipped = flippedIds.has(game.id);
              const isFeatured = FEATURED_IDS.has(game.id);
              const name = game.name[lang] ?? game.name.zh ?? game.name.en;
              const cardLabel = (currentText.a11y_game_card || '{name}, drunk level {level}, duration {duration}')
                .replace('{name}', name)
                .replace('{level}', String(drunkLevel))
                .replace('{duration}', String(duration));
              return (
                <GameCard
                  key={game.id}
                  game={game}
                  lang={lang}
                  isFlipped={isFlipped}
                  isFeatured={isFeatured}
                  cardLabel={cardLabel}
                  currentText={currentText}
                  drunkLevel={drunkLevel}
                  duration={duration}
                  name={name}
                  onFlipChange={setCardFlipped}
                  reduceMotion={reduceMotion}
                />
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
              onClick={handleDownloadClick}
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
        footerLabel={currentText.a11y_footer}
        languageLabel={currentText.a11y_language}
        languageHref={(code) => getLocalizedPath('', code)}
        links={[
          {
            href: getLocalizedPath('privacy.html', lang),
            label: currentText.footer_privacy,
          },
          {
            href: `mailto:${SUPPORT_EMAIL}`,
            label: currentText.footer_contact,
          },
        ]}
      />

      <InAppGuideModal
        isOpen={showInAppGuide}
        onClose={() => setShowInAppGuide(false)}
        currentText={currentText}
      />
    </div>
  );
};

export default App;
