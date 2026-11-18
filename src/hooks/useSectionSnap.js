import { useEffect } from 'react';

const SNAP_QUERY = '[data-snap]';

/**
 * Pick a section start to rest on.
 * One-screen gaps finish the trip once the gesture passes a small threshold.
 * Taller regions, including the game cards, stay where the finger stopped so
 * every card can be scrolled fully on screen and tapped.
 */
export function chooseSnapTarget({ y, dir = 0, vh, points, gamesTop = null, downloadTop = null }) {
  if (!points.length || vh <= 0) return null;

  const first = points[0];
  const last = points[points.length - 1];
  if (y < first - 1) return Math.abs(first - y) < 2 ? null : first;
  if (y > last) {
    if (y - last <= vh * 0.2) return Math.abs(y - last) < 2 ? null : last;
    return null;
  }

  let prev = first;
  let next = last;
  for (let i = 0; i < points.length - 1; i += 1) {
    if (y >= points[i] - 1 && y <= points[i + 1] + 1) {
      prev = points[i];
      next = points[i + 1];
      break;
    }
  }

  const gap = next - prev;
  if (gap <= 0) return null;

  const cardSpan = gamesTop != null
    && downloadTop != null
    && Math.abs(prev - gamesTop) < 2
    && Math.abs(next - downloadTop) < 2;

  let target;
  if (cardSpan || gap > vh * 1.05) {
    if (dir > 0 && next - y <= 64 && next - y >= 2) target = next;
    else if (dir < 0 && y - prev <= 32 && y - prev >= 2) target = prev;
    else return null;
  } else {
    const threshold = Math.min(Math.max(vh * 0.08, 48), gap * 0.35);
    if (dir > 0 && y - prev >= threshold) target = next;
    else if (dir < 0 && next - y >= threshold) target = prev;
    else target = (y - prev) <= (next - y) ? prev : next;
  }

  if (Math.abs(target - y) < 2) return null;
  if (Math.abs(target - y) > vh * 1.2) return null;
  return target;
}

export function useSectionSnap() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.scrollingElement || document.documentElement;
    let dir = 0;
    let lastY = root.scrollTop;
    let lock = false;
    let pointerDown = false;
    let moved = false;
    const hasScrollEnd = 'onscrollend' in window;

    const settle = () => {
      if (lock || pointerDown || reduce.matches) return;
      const nodes = [...document.querySelectorAll(SNAP_QUERY)];
      if (!nodes.length) return;
      const y = root.scrollTop;
      const points = nodes
        .map((el) => el.getBoundingClientRect().top + y)
        .sort((a, b) => a - b);
      const games = document.querySelector('[data-snap="games"]');
      const download = document.querySelector('[data-snap="download"]');
      const target = chooseSnapTarget({
        y,
        dir,
        vh: window.innerHeight,
        points,
        gamesTop: games ? games.getBoundingClientRect().top + y : null,
        downloadTop: download ? download.getBoundingClientRect().top + y : null,
      });
      if (target == null) return;
      lock = true;
      const distance = Math.abs(target - y);
      root.scrollTo({ top: target, behavior: distance > 64 ? 'smooth' : 'auto' });
      window.setTimeout(() => {
        lock = false;
        lastY = root.scrollTop;
        dir = 0;
      }, distance > 64 ? 700 : 40);
    };

    let timer = 0;
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 80);
    };

    const onScroll = () => {
      const y = root.scrollTop;
      if (lock) {
        lastY = y;
        return;
      }
      if (y !== lastY) {
        dir = y > lastY ? 1 : -1;
        moved = true;
      }
      lastY = y;
      if (!hasScrollEnd) schedule();
    };

    const onPointerDown = () => {
      pointerDown = true;
      lock = false;
    };

    const onPointerUp = () => {
      pointerDown = false;
      if (moved) schedule();
      moved = false;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', settle, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', settle);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);
}
