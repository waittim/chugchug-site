import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight viewport observer hook for scroll-triggered entrance choreography.
 * Disconnects once triggered to avoid layout thrashing and maintain 60/120fps.
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options.once !== false) {
            observer.disconnect();
          }
        } else if (options.once === false) {
          setIsInView(false);
        }
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? '0px',
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.once, options.rootMargin, options.threshold]);

  return [ref, isInView];
}
