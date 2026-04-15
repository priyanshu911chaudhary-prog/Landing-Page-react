import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useReducedMotionPreference } from '@/hooks/useReducedMotion';

export default function CustomCursor({ children }) {
  const [isFinePointer, setIsFinePointer] = useState(true);
  const prefersReducedMotion = useReducedMotionPreference();
  const enabled = isFinePointer && !prefersReducedMotion;

  const outerRef = useRef(null);
  const innerVeloRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);

  // Tracks whether the ticker should skip the default velocity-stretch
  const isHovering = useRef(false);

  // Smooth cursor position (lerped each frame)
  const mouse = useRef({ x: 0, y: 0 });
  const delayed = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const finePointerQuery = window.matchMedia('(pointer: fine)');

    const syncPointer = () => {
      setIsFinePointer(finePointerQuery.matches);
    };

    syncPointer();

    if (finePointerQuery.addEventListener) {
      finePointerQuery.addEventListener('change', syncPointer);
      return () => {
        finePointerQuery.removeEventListener('change', syncPointer);
      };
    }

    finePointerQuery.addListener(syncPointer);
    return () => {
      finePointerQuery.removeListener(syncPointer);
    };
  }, []);

  // ─── EFFECT 1: Core Movement, Ticker & Velocity Stretch ───────────────────
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mouse.current = { x: cx, y: cy };
    delayed.current = { x: cx, y: cy };

    document.body.style.cursor = 'none';

    // quickSetter is fastest for per-frame position writes
    const setOuterX = gsap.quickSetter(outerRef.current, 'x', 'px');
    const setOuterY = gsap.quickSetter(outerRef.current, 'y', 'px');

    // quickTo gives a short tween so the dot feels snappy but not jarring
    const setDotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.05, ease: 'power3.out' });
    const setDotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.05, ease: 'power3.out' });

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      setDotX(e.clientX);
      setDotY(e.clientY);
    };

    const onMouseDown = () => {
      gsap.to(innerVeloRef.current, { scale: 0.7, duration: 0.15, overwrite: 'auto' });
      gsap.to(dotRef.current, { scale: 0, duration: 0.15, overwrite: 'auto' });
    };

    const onMouseUp = () => {
      gsap.to(innerVeloRef.current, { scale: 1, duration: 0.3, ease: 'bounce.out', overwrite: 'auto' });
      gsap.to(dotRef.current, { scale: 1, duration: 0.3, overwrite: 'auto' });
    };

    const ticker = () => {
      // Exponential smoothing — frame-rate independent
      const dt = 1.0 - Math.pow(1.0 - 0.25, gsap.ticker.deltaRatio());

      delayed.current.x += (mouse.current.x - delayed.current.x) * dt;
      delayed.current.y += (mouse.current.y - delayed.current.y) * dt;

      setOuterX(delayed.current.x);
      setOuterY(delayed.current.y);

      // Skip velocity-stretch while a hover effect owns innerVeloRef transforms
      if (!isHovering.current) {
        const dx = mouse.current.x - delayed.current.x;
        const dy = mouse.current.y - delayed.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const stretch = Math.min(dist * 0.006, 0.5);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // gsap.set — no tween, ticker fires every frame anyway
        gsap.set(innerVeloRef.current, {
          rotation: angle,
          scaleX: 1 + stretch,
          scaleY: 1 - stretch * 0.4,
        });
      }
    };

    gsap.ticker.add(ticker);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      document.body.style.cursor = 'auto';
      gsap.ticker.remove(ticker);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [enabled]);

  // ─── EFFECT 2: Hover Interactions ─────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    let activeMagnet = null;
    let activeText = null;
    let activeModeEl = null;

    // ── Helpers ──────────────────────────────────────────────────────────────

    const setLabel = (text = '') => {
      if (!labelRef.current) return;
      labelRef.current.textContent = text;
      gsap.to(labelRef.current, {
        autoAlpha: text ? 1 : 0,
        y: text ? 0 : 4,
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const setModeVisual = (mode, label = '') => {
      if (!innerVeloRef.current) return;

      const presets = {
        default: {
          width: 64,
          height: 64,
          borderRadius: '9999px',
          background: '#ffffff',
          border: '0px solid transparent',
          backdropFilter: 'blur(0px)',
          scale: 1,
        },
        link: {
          width: 52,
          height: 52,
          borderRadius: '9999px',
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.4)',
          backdropFilter: 'blur(6px)',
          scale: 1,
        },
        inspect: {
          width: 112,
          height: 48,
          borderRadius: '9999px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(148,163,184,0.55)',
          backdropFilter: 'blur(10px)',
          scale: 1,
        },
        drag: {
          width: 122,
          height: 44,
          borderRadius: '9999px',
          background: 'rgba(148,163,184,0.18)',
          border: '1px dashed rgba(226,232,240,0.65)',
          backdropFilter: 'blur(8px)',
          scale: 1,
        },
        cta: {
          width: 90,
          height: 90,
          borderRadius: '9999px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.25)',
          backdropFilter: 'blur(10px)',
          scale: 1,
        },
      };

      gsap.to(innerVeloRef.current, {
        ...presets[mode],
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power3.out',
        overwrite: 'auto',
      });

      setLabel(label);
    };

    /**
     * Restore innerVeloRef to its resting state.
     * Explicitly reset every axis that hover effects may have touched so nothing lingers.
     */
    const restoreCursorRing = ({ delay = 0 } = {}) => {
      if (delay > 0) {
        gsap.delayedCall(delay, () => {
          setModeVisual('default');
        });
        return;
      }
      setModeVisual('default');
    };

    const restoreDot = ({ delay = 0 } = {}) => {
      gsap.to(dotRef.current, { scale: 1, duration: 0.25, delay, overwrite: 'auto' });
    };

    // ── Magnifier enter ──────────────────────────────────────────────────────
    const enterMagnet = (btn) => {
      activeMagnet = btn;
      isHovering.current = true;

      // Clear velocity-stretch axes before animating to avoid a transform jump
      gsap.set(innerVeloRef.current, { rotation: 0, scaleX: 1, scaleY: 1 });

      setModeVisual('cta', btn.dataset.cursorLabel || 'GO');

      gsap.to(dotRef.current, { scale: 0, duration: 0.2, overwrite: 'auto' });

      /**
       * Animate outerRef (the ring's position anchor) toward the button center.
       * Moving outerRef rather than innerVeloRef keeps position + visual in sync —
       * avoids the ring drifting away from where the ticker thinks it is.
       */
      const onMagnetMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;

        const btnPullX = distX * 0.25;
        const btnPullY = distY * 0.25;

        // Button drifts toward cursor
        gsap.to(btn, {
          x: btnPullX,
          y: btnPullY,
          scale: 1.06,
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        });

        // Ring position follows button center + a gentle extra nudge
        gsap.to(outerRef.current, {
          x: centerX + btnPullX * 0.6,
          y: centerY + btnPullY * 0.6,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      btn.addEventListener('mousemove', onMagnetMove);
      btn._magnetMove = onMagnetMove;
    };

    // ── Magnifier leave ──────────────────────────────────────────────────────
    const leaveMagnet = (btn) => {
      btn.removeEventListener('mousemove', btn._magnetMove);
      delete btn._magnetMove;
      activeMagnet = null;

      // Kill any in-flight tween on outerRef so the ticker reclaims it next frame
      gsap.killTweensOf(outerRef.current);
      isHovering.current = false;

      restoreCursorRing();
      restoreDot();

      gsap.to(btn, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
    };

    // ── Text hover enter ─────────────────────────────────────────────────────
    const enterText = (el) => {
      activeText = el;
      isHovering.current = true;

      gsap.set(innerVeloRef.current, { rotation: 0, scaleX: 1, scaleY: 1 });

      gsap.to(innerVeloRef.current, {
        scale: 1.8,
        duration: 0.3,
        ease: 'back.out(1.5)',
        overwrite: 'auto',
      });

      setLabel('READ');

      gsap.to(dotRef.current, { scale: 0, duration: 0.2, overwrite: 'auto' });
    };

    // ── Text hover leave ─────────────────────────────────────────────────────
    const leaveText = (nextTarget) => {
      activeText = null;

      // Don't reset if the cursor is moving straight into a magnet button
      if (nextTarget?.closest?.('.btn-metallic')) return;

      isHovering.current = false;
      restoreCursorRing();
      restoreDot();
    };

    const enterMode = (el) => {
      activeModeEl = el;
      isHovering.current = true;

      const mode = el.dataset.cursor || (el.closest('a,button,[role="button"]') ? 'link' : 'default');
      const fallbackLabel = mode === 'link' ? 'OPEN' : mode === 'inspect' ? 'SCAN' : mode === 'drag' ? 'DRAG' : '';

      setModeVisual(mode, el.dataset.cursorLabel || fallbackLabel);
      gsap.to(dotRef.current, { scale: 0, duration: 0.2, overwrite: 'auto' });
    };

    const leaveMode = (nextTarget, force = false) => {
      if (!force && nextTarget?.closest?.('[data-cursor],a,button,[role="button"],.btn-metallic')) return;

      activeModeEl = null;
      isHovering.current = false;
      restoreCursorRing();
      restoreDot();
    };

    // ── Delegated listeners (single pair on document) ─────────────────────────
    const onMouseOver = (e) => {
      const metallic = e.target.closest('.btn-metallic');
      const modeEl = e.target.closest('[data-cursor],a,button,[role="button"]');
      const textEl = e.target.closest('h1,h2');

      if (metallic) {
        if (activeText) leaveText(metallic);
        if (activeModeEl) leaveMode(metallic, true);
        if (activeMagnet !== metallic) {
          if (activeMagnet) leaveMagnet(activeMagnet);
          enterMagnet(metallic);
        }
      } else if (modeEl) {
        if (activeText) leaveText(modeEl);
        if (activeMagnet) leaveMagnet(activeMagnet);
        if (activeModeEl !== modeEl) {
          enterMode(modeEl);
        }
      } else if (textEl && !textEl.closest('a')) {
        if (activeModeEl) leaveMode(textEl);
        if (activeText !== textEl) {
          if (activeText) leaveText(textEl);
          enterText(textEl);
        }
      }
    };

    const onMouseOut = (e) => {
      const next = e.relatedTarget;
      if (activeMagnet && !activeMagnet.contains(next)) leaveMagnet(activeMagnet);
      if (activeModeEl && !activeModeEl.contains(next)) leaveMode(next);
      if (activeText && !activeText.contains(next)) leaveText(next);
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, [enabled]);

  if (!enabled) return <>{children}</>;

  return (
    <>
      {/* Outer wrapper — controls absolute screen position via the ticker */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference"
      >
        {/* Inner ring — controls visual shape, size, and blend effects */}
        <div
          ref={innerVeloRef}
          className="w-16 h-16 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 will-change-transform flex items-center justify-center"
        />
        <span
          ref={labelRef}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-mono tracking-[0.14em] text-white/90 uppercase opacity-0"
        />
      </div>

      {/* Dot — snappy, leads the ring slightly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2 will-change-transform"
      />

      {children}
    </>
  );
}