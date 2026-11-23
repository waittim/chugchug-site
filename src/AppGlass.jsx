import React, { useEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'motion';
import { useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Clock3 } from 'lucide-react';
import SiteHeader from './components/SiteHeader.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import InAppGuideModal from './components/InAppGuideModal.jsx';
import AppleLogo from './components/AppleLogo.jsx';
import AmbientLights from './components/AmbientLights.jsx';
import HeroWordmark from './components/HeroWordmark.jsx';
import AppStoreQRCode from './components/AppStoreQRCode.jsx';
import { usePressHandlers } from './hooks/usePressHandlers.js';
import { useInView } from './hooks/useInView.js';
import { SUPPORT_EMAIL } from './contact.js';
import { GAMES } from './content/games.jsx';
import { HOME_COPY } from './content/home.js';
import { getInitialLang, getLanguageHref, getLocalizedPath } from './i18n.js';
import { HOME_META } from './seo.js';
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

const FEATURED_IDS = new Set(['dice', 'truth']);

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
  duration,
  name,
  currentText,
  isFeatured,
  shot = null,
  hidden = false,
}) => {
  const tagline = game.tagline?.[lang] ?? game.tagline?.zh ?? game.tagline?.en ?? '';
  return (
    <span
      className={`game-card__face game-card__${side}${hidden ? ' game-card__face--hidden' : ''}`}
    >
      {side === 'front' && shot ? (
        <>
          <picture className={`game-card__shot game-card__shot--${shot.focus}`}>
            <source srcSet={shot.srcWebp} type="image/webp" />
            <img
              src={shot.src}
              alt=""
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          </picture>
          <span className="game-card__shot-copy">
            <strong>{name}</strong>
            {tagline && <p className="game-card__tagline">{tagline}</p>}
            <span className="game-card__hint">{currentText.card_hint_front}</span>
          </span>
        </>
      ) : side === 'front' ? (
        <>
          <div className="game-card__top">
            <span className="game-card__icon">
              {React.cloneElement(game.icon, { size: isFeatured ? 22 : 18, className: '' })}
            </span>
            <strong>{name}</strong>
            <span className="game-card__meta">
              <Clock3 size={11} aria-hidden="true" />
              <span>{duration}</span>
            </span>
          </div>
          {tagline && <p className="game-card__tagline">{tagline}</p>}
          <span className="game-card__hint">{currentText.card_hint_front}</span>
        </>
      ) : (
        <>
          {isFeatured ? (
            <span className="game-card__back-label">{currentText.rules_title}</span>
          ) : null}
          <strong>{name}</strong>
          <span className="game-card__rules">
            {game.rules?.[lang] ?? game.rules?.zh ?? game.rules?.en ?? ''}
          </span>
          <span className="game-card__return">{currentText.card_hint_back}</span>
        </>
      )}
    </span>
  );
};

const GameCard = ({
  game,
  lang,
  isFlipped,
  isFeatured,
  cardLabel,
  currentText,
  duration,
  name,
  shot = null,
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
    const rad = ((value % 360) * Math.PI) / 180;
    const elevation = Math.abs(Math.sin(rad)) * 28;
    const shadowSpread = Math.abs(Math.sin(rad)) * 36;
    const shadowOpacity = 0.72 - Math.abs(Math.sin(rad)) * 0.35;
    const sheen = Math.min(1, Math.max(0, value / 180));
    const sheenOpacity = Math.abs(Math.sin(rad)) * 0.9;

    const sx = 1 + stretch;
    el.style.transform = stretch
      ? `translate3d(0, 0, ${elevation.toFixed(1)}px) rotateY(${value}deg) scaleX(${sx})`
      : `translate3d(0, 0, ${elevation.toFixed(1)}px) rotateY(${value}deg)`;
    el.style.setProperty('--card-z', `${elevation.toFixed(1)}px`);
    el.style.setProperty('--card-shadow-blur', `${(36 + shadowSpread).toFixed(0)}px`);
    el.style.setProperty('--card-shadow-opacity', shadowOpacity.toFixed(2));
    el.style.setProperty('--card-sheen-x', `${(sheen * 100).toFixed(1)}%`);
    el.style.setProperty('--card-sheen-opacity', sheenOpacity.toFixed(2));
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

  useEffect(() => {
    applyRotate(rotateRef.current, 0);
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
      targetEl: event.currentTarget,
      startX: event.clientX,
      startY: event.clientY,
      startRotate: rotateRef.current,
      committed: false,
      samples: [],
    };
    addSample(event.clientX);
    setIsPressed(true);
    // Defer setPointerCapture until horizontal intent is confirmed to avoid blocking native page scrolling
  };

  const handlePointerMove = (event) => {
    const state = pointerRef.current;
    if (!state.active || event.pointerId !== state.pointerId) return;

    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;

    if (!state.committed) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      // If user is scrolling vertically, immediately release so page scrolls smoothly
      if (Math.abs(dy) > Math.abs(dx) * 1.15) {
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
      try {
        state.targetEl?.setPointerCapture(event.pointerId);
      } catch {
        // capture is best-effort
      }
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
    if (state.committed && state.targetEl && event.pointerId != null) {
      try {
        state.targetEl.releasePointerCapture(event.pointerId);
      } catch {
        // release is best-effort
      }
    }
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
      aria-expanded={isFlipped}
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
            duration={duration}
            name={name}
            currentText={currentText}
            isFeatured={isFeatured}
            shot={shot}
          />
          <GameCardFace
            side="back"
            hidden={!isFlipped}
            game={game}
            lang={lang}
            duration={duration}
            name={name}
            currentText={currentText}
            isFeatured={isFeatured}
            shot={shot}
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
            duration={duration}
            name={name}
            currentText={currentText}
            isFeatured={isFeatured}
            shot={shot}
          />
          <GameCardFace
            side="back"
            game={game}
            lang={lang}
            duration={duration}
            name={name}
            currentText={currentText}
            isFeatured={isFeatured}
            shot={shot}
          />
        </span>
      )}
    </button>
  );
};

const ScreensSection = ({ screenshots, currentText, baseUrl, reduceMotion = false }) => {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const userPausedRef = useRef(false);
  const activeScreenIndexRef = useRef(0);
  const marqueeRef = useRef(null);
  const marqueeApiRef = useRef({ nudge: () => {}, goToIndex: () => {}, setPaused: () => {} });
  const { isPressed: pausePressed, pressProps: pausePressProps } = usePressHandlers();

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return undefined;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const autoSpeed = 34;
    const resumeDelayMs = 1500;

    let offset = 0;
    let inView = typeof IntersectionObserver === 'undefined';
    let viewObserver = null;
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

    let cachedLoopWidth = 0;
    let cachedSnapInterval = 0;

    const measureLayout = () => {
      const primary = marquee.querySelector('.screens-group:not(.screens-group--clone)');
      if (!primary) return;
      cachedLoopWidth = primary.offsetWidth || marquee.scrollWidth / 2 || 0;
      const frame = primary.querySelector('.phone-frame');
      if (frame) {
        const gap = parseFloat(getComputedStyle(primary).columnGap || getComputedStyle(primary).gap) || 0;
        cachedSnapInterval = frame.getBoundingClientRect().width + gap;
      }
    };

    measureLayout();
    window.addEventListener('resize', measureLayout);

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => measureLayout());
      const primary = marquee.querySelector('.screens-group:not(.screens-group--clone)');
      if (primary) resizeObserver.observe(primary);
    }

    const setWillChange = (enabled) => {
      marquee.style.willChange = enabled ? 'transform' : 'auto';
    };

    const setStretch = (value) => {
      marquee.style.setProperty('--marquee-stretch', String(value));
    };

    const getLoopWidth = () => {
      if (cachedLoopWidth > 0) return cachedLoopWidth;
      measureLayout();
      return cachedLoopWidth || marquee.scrollWidth / 2 || 0;
    };

    const getSnapInterval = () => {
      if (cachedSnapInterval > 0) return cachedSnapInterval;
      measureLayout();
      return cachedSnapInterval || 0;
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

    const hold = { pointer: false, focus: false };

    const autoplayBlocked = () => (
      !inView
      || reduceMotionQuery.matches
      || activePointerId !== null
      || userPausedRef.current
      || hold.pointer
      || hold.focus
    );

    const stopAuto = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      if (resumeTimeoutId) window.clearTimeout(resumeTimeoutId);
      resumeTimeoutId = 0;
      lastTime = 0;
    };

    const scheduleAutoResume = () => {
      if (autoplayBlocked()) return;
      if (resumeTimeoutId) window.clearTimeout(resumeTimeoutId);
      const delay = Math.max(0, resumeAt - performance.now());
      resumeTimeoutId = window.setTimeout(() => {
        resumeTimeoutId = 0;
        startAuto();
      }, delay);
    };

    const startAuto = () => {
      if (autoplayBlocked() || rafId) return;
      if (performance.now() < resumeAt) {
        scheduleAutoResume();
        return;
      }

      const step = (time) => {
        if (autoplayBlocked()) {
          stopAuto();
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
      setPaused: (paused) => {
        userPausedRef.current = paused;
        if (paused) {
          stopAuto();
          return;
        }
        hold.focus = false;
        resumeAt = 0;
        startAuto();
      },
    };

    const stage = marquee.closest('.screens-stage');
    const track = marquee.closest('.screens-track');
    const canHoverHold = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const onTrackPointerEnter = () => {
      if (!canHoverHold) return;
      hold.pointer = true;
      stopAuto();
    };

    const onTrackPointerLeave = () => {
      if (!hold.pointer) return;
      hold.pointer = false;
      if (userPausedRef.current || hold.focus) return;
      resumeAt = performance.now() + resumeDelayMs;
      scheduleAutoResume();
    };

    const onStageFocus = () => {
      hold.focus = true;
      stopAuto();
    };

    const onStageBlur = () => {
      hold.focus = false;
      if (userPausedRef.current || hold.pointer) return;
      resumeAt = performance.now() + resumeDelayMs;
      scheduleAutoResume();
    };

    if (track && canHoverHold) {
      track.addEventListener('pointerenter', onTrackPointerEnter);
      track.addEventListener('pointerleave', onTrackPointerLeave);
    }
    if (stage) {
      stage.addEventListener('focus', onStageFocus);
      stage.addEventListener('blur', onStageBlur);
    }

    const viewTarget = marquee.closest('.screens-section') || marquee.parentElement;
    if (viewTarget && typeof IntersectionObserver !== 'undefined') {
      viewObserver = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (!inView) {
          stopAuto();
          if (activePointerId === null) setWillChange(false);
          return;
        }
        if (!reduceMotionQuery.matches && activePointerId === null) scheduleAutoResume();
      }, { threshold: 0.12 });
      viewObserver.observe(viewTarget);
    } else if (!reduceMotionQuery.matches) {
      inView = true;
      scheduleAutoResume();
    }

    marquee.addEventListener('pointerdown', onPointerDown);
    marquee.addEventListener('pointermove', onPointerMove);
    marquee.addEventListener('pointerup', onPointerUp);
    marquee.addEventListener('pointercancel', onPointerUp);
    marquee.addEventListener('click', onClickCapture, true);
    reduceMotionQuery.addEventListener('change', onReduceMotionChange);

    return () => {
      window.removeEventListener('resize', measureLayout);
      resizeObserver?.disconnect();
      viewObserver?.disconnect();
      cancelSpring();
      stopCoast();
      stopAuto();
      marquee.removeEventListener('pointerdown', onPointerDown);
      marquee.removeEventListener('pointermove', onPointerMove);
      marquee.removeEventListener('pointerup', onPointerUp);
      marquee.removeEventListener('pointercancel', onPointerUp);
      marquee.removeEventListener('click', onClickCapture, true);
      if (track && canHoverHold) {
        track.removeEventListener('pointerenter', onTrackPointerEnter);
        track.removeEventListener('pointerleave', onTrackPointerLeave);
      }
      if (stage) {
        stage.removeEventListener('focus', onStageFocus);
        stage.removeEventListener('blur', onStageBlur);
      }
      reduceMotionQuery.removeEventListener('change', onReduceMotionChange);
      marquee.style.transform = '';
      marquee.style.willChange = 'auto';
      marquee.style.removeProperty('--marquee-stretch');
      marqueeApiRef.current = { nudge: () => {}, goToIndex: () => {}, setPaused: () => {} };
    };
  }, [screenshots]);

  const nudgeMarquee = (direction) => {
    marqueeApiRef.current.nudge(direction);
  };

  const togglePause = () => {
    const next = !userPausedRef.current;
    userPausedRef.current = next;
    setUserPaused(next);
    marqueeApiRef.current.setPaused(next);
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

  return (
    <section id="screens" className="screens-section">
      <div
        className="screens-stage"
        role="region"
        aria-label={currentText.a11y_screens}
        tabIndex={0}
        onKeyDown={onScreensKeyDown}
      >
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
                    className="phone-frame"
                  >
                    <picture>
                      <source srcSet={shot.srcWebp} type="image/webp" />
                      <img
                        src={shot.src}
                        width={SCREEN_WIDTH}
                        height={SCREEN_HEIGHT}
                        alt={isDuplicate ? '' : shot.alt}
                        loading="eager"
                        decoding="async"
                        fetchpriority={index === 0 && !isDuplicate ? 'high' : 'auto'}
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
        <div className="screens-toolbar">
          <ScreensControl
            direction={-1}
            label={currentText.a11y_screens_prev}
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
                aria-current={index === activeScreenIndex ? 'true' : undefined}
                onClick={() => marqueeApiRef.current.goToIndex(index)}
              >
                <span className="screens-dot__mark" aria-hidden="true" />
              </button>
            ))}
          </div>
          <ScreensControl
            direction={1}
            label={currentText.a11y_screens_next}
            onNudge={nudgeMarquee}
          />
          {reduceMotion ? null : (
            <button
              type="button"
              className={`screens-pause${pausePressed ? ' is-pressed' : ''}`}
              aria-pressed={userPaused}
              onClick={togglePause}
              {...pausePressProps}
            >
              {userPaused ? currentText.a11y_screens_play : currentText.a11y_screens_pause}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

const App = ({ initialLang } = {}) => {
  const [lang] = useState(() => initialLang || getInitialLang());
  const [flippedIds, setFlippedIds] = useState(() => new Set());
  const [showInAppGuide, setShowInAppGuide] = useState(false);
  const reduceMotion = useReducedMotion();
  const currentText = HOME_COPY[lang] ?? HOME_COPY.en;
  const isChinese = lang === 'zh' || lang === 'zh-Hant';
  const brand = lang === 'zh' ? '吨吨吨 · ChugChug' : 'ChugChug';
  const baseUrl = import.meta.env.BASE_URL || '/';

  useEffect(() => {
    document.title = (HOME_META[lang] || HOME_META.en).title;
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

  const [expRef, expInView] = useInView({ threshold: 0.1 });
  const [gamesRef, gamesInView] = useInView({ threshold: 0.1 });
  const [downloadRef, downloadInView] = useInView({ threshold: 0.12 });

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
      <AmbientLights variant="page" />
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
          <div className="hero-copy">
            <div className={`hero-mark ${lang === 'zh' ? 'hero-mark--compact' : 'hero-mark--stack'}`}>
              <HeroWordmark
                words={
                  lang === 'zh'
                    ? [currentText.hero_title_1, currentText.hero_title_2, currentText.hero_title_3]
                    : [currentText.hero_title_1, currentText.hero_title_2]
                }
                compact={lang === 'zh'}
                label={currentText.a11y_clink}
              />
              <span className="hero-rule" aria-hidden="true" />
            </div>
            <p className="hero-subtitle">{currentText.hero_subtitle}</p>
            <StoreButton
              label={currentText.btn_download}
              lead={currentText.store_badge_lead}
              className="store-button--hero"
              onClick={handleDownloadClick}
            />
          </div>
        </section>

        <ScreensSection
          screenshots={screenshots}
          currentText={currentText}
          baseUrl={baseUrl}
          reduceMotion={reduceMotion}
        />

        <section id="experience" ref={expRef} className={`experience-section ${expInView ? 'is-in-view' : ''}`}>
          <div className="experience-layout">
            <header className="experience-lead">
              <h2>{currentText.highlights_title}</h2>
              <span className="hero-rule" aria-hidden="true" />
              <p>{currentText.highlights_intro}</p>
            </header>
            <ul className="feature-list">
              {currentText.highlights.map(([title, body, label]) => (
                <li className="feature-row" key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                  {label ? <span className="feature-row__label">{label}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section ref={gamesRef} className={`games-section ${gamesInView ? 'is-in-view' : ''}`}>
          <header className="games-header">
            <h2>
              <span>{currentText.grid_title_prefix}</span>{' '}
              <span className="games-title__accent">{currentText.grid_title_suffix}</span>
            </h2>
            <span className="hero-rule" aria-hidden="true" />
            <p>{currentText.grid_desc}</p>
          </header>

          <div className="games-grid">
            {orderedGames.map((game) => {
              const duration = game.duration ?? '∞';
              const isFlipped = flippedIds.has(game.id);
              const isFeatured = false;
              const name = game.name[lang] ?? game.name.zh ?? game.name.en;
              const hintText = isFlipped ? currentText.card_hint_back : currentText.card_hint_front;
              const baseLabel = (currentText.a11y_game_card || '{name}, duration {duration}')
                .replace('{name}', name)
                .replace('{duration}', String(duration));
              const joiner = lang === 'en' ? ', ' : '，';
              const cardLabel = hintText ? `${baseLabel}${joiner}${hintText}` : baseLabel;
              return (
                <GameCard
                  key={game.id}
                  game={game}
                  lang={lang}
                  isFlipped={isFlipped}
                  isFeatured={isFeatured}
                  cardLabel={cardLabel}
                  currentText={currentText}
                  duration={duration}
                  name={name}
                  shot={null}
                  onFlipChange={setCardFlipped}
                  reduceMotion={reduceMotion}
                />
              );
            })}
          </div>
        </section>

        <section id="download" ref={downloadRef} className={`download-section ${downloadInView ? 'is-in-view' : ''}`}>
          <div className="download-card">
            <h2>{currentText.cta_title}</h2>
            <p className="download-card__lead">
              {lang.startsWith('zh')
                ? `${currentText.cta_lead}。${currentText.cta_badge}。`
                : `${currentText.cta_lead}. ${currentText.cta_badge}.`}
            </p>
            <div className="download-actions">
              <StoreButton
                label={currentText.btn_download}
                lead={currentText.store_badge_lead}
                onClick={handleDownloadClick}
              />
              <AppStoreQRCode label={currentText.qr_prompt} />
            </div>
            <ul className="download-facts">
              <li>{currentText.free_download}</li>
              <li>{currentText.feat_ios}</li>
              <li>{currentText.feat_ads}</li>
              <li>{currentText.feat_drunk}</li>
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter
        lang={lang}
        brand={brand}
        copyright={currentText.footer_rights}
        footerLabel={currentText.a11y_footer}
        languageLabel={currentText.a11y_language}
        languageHref={(code) => getLanguageHref('', code)}
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
