import { useEffect, useRef } from 'react';

const VAR_CURSOR_X = '--cursor-x';
const VAR_CURSOR_Y = '--cursor-y';

/**
 * Tracks mouse position and writes --cursor-x, --cursor-y to document.documentElement
 * using requestAnimationFrame. No React state updates — avoids re-renders and keeps 60fps.
 * Use for CSS-driven effects (e.g. cursor reveal mask).
 */
export function useCursorPosition(options = {}) {
  const { enabled = true, target = null } = options;
  const pos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const el = target?.current ?? document.documentElement;

    /* Initialize at center so mask has valid position before first mousemove */
    pos.current.x = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    pos.current.y = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
    el.style.setProperty(VAR_CURSOR_X, `${pos.current.x}px`);
    el.style.setProperty(VAR_CURSOR_Y, `${pos.current.y}px`);

    const handleMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const tick = () => {
      el.style.setProperty(VAR_CURSOR_X, `${pos.current.x}px`);
      el.style.setProperty(VAR_CURSOR_Y, `${pos.current.y}px`);
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [enabled, target]);
}
