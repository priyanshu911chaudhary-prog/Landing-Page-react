import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor({ children }) {
  const outerRef     = useRef(null);
  const innerVeloRef = useRef(null);
  const dotRef       = useRef(null);

  // Tracks whether the ticker should skip the default velocity-stretch
  const isHovering = useRef(false);

  // Smooth cursor position (lerped each frame)
  const mouse   = useRef({ x: 0, y: 0 });
  const delayed = useRef({ x: 0, y: 0 });

  // ─── EFFECT 1: Core Movement, Ticker & Velocity Stretch ───────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    mouse.current   = { x: cx, y: cy };
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
      gsap.to(dotRef.current,       { scale: 0,   duration: 0.15, overwrite: 'auto' });
    };

    const onMouseUp = () => {
      gsap.to(innerVeloRef.current, { scale: 1, duration: 0.3, ease: 'bounce.out', overwrite: 'auto' });
      gsap.to(dotRef.current,       { scale: 1, duration: 0.3,                     overwrite: 'auto' });
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
        const dx   = mouse.current.x - delayed.current.x;
        const dy   = mouse.current.y - delayed.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const stretch = Math.min(dist * 0.006, 0.5);
        const angle   = Math.atan2(dy, dx) * (180 / Math.PI);

        // gsap.set — no tween, ticker fires every frame anyway
        gsap.set(innerVeloRef.current, {
          rotation: angle,
          scaleX:   1 + stretch,
          scaleY:   1 - stretch * 0.4,
        });
      }
    };

    gsap.ticker.add(ticker);

    window.addEventListener('mousemove',  onMouseMove);
    window.addEventListener('mousedown',  onMouseDown);
    window.addEventListener('mouseup',    onMouseUp);

    return () => {
      document.body.style.cursor = 'auto';
      gsap.ticker.remove(ticker);
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('mousedown',  onMouseDown);
      window.removeEventListener('mouseup',    onMouseUp);
    };
  }, []);

  // ─── EFFECT 2: Hover Interactions ─────────────────────────────────────────
  useEffect(() => {
    let activeMagnet = null;
    let activeText   = null;

    // ── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Restore innerVeloRef to its resting state.
     * Explicitly reset every axis that hover effects may have touched so nothing lingers.
     */
    const restoreCursorRing = ({ delay = 0 } = {}) => {
      gsap.to(innerVeloRef.current, {
        width:          '4rem',
        height:         '4rem',
        background:     '#ffffff',
        border:         '0px solid transparent',
        backdropFilter: 'blur(0px)',  // fully clear — prevents blur persisting
        scale:          1,
        rotation:       0,
        scaleX:         1,
        scaleY:         1,
        x:              0,
        y:              0,
        duration:       0.45,
        ease:           'power3.out',
        delay,
        overwrite:      'auto',
      });
    };

    const restoreDot = ({ delay = 0 } = {}) => {
      gsap.to(dotRef.current, { scale: 1, duration: 0.25, delay, overwrite: 'auto' });
    };

    // ── Magnifier enter ──────────────────────────────────────────────────────
    const enterMagnet = (btn) => {
      activeMagnet       = btn;
      isHovering.current = true;

      // Clear velocity-stretch axes before animating to avoid a transform jump
      gsap.set(innerVeloRef.current, { rotation: 0, scaleX: 1, scaleY: 1 });

      gsap.to(innerVeloRef.current, {
        width:          90,
        height:         90,
        background:     'rgba(255,255,255,0.08)',
        border:         '1px solid rgba(255,255,255,0.25)',
        backdropFilter: 'blur(10px)',
        scale:          1,
        duration:       0.35,
        ease:           'power3.out',
        overwrite:      'auto',
      });

      gsap.to(dotRef.current, { scale: 0, duration: 0.2, overwrite: 'auto' });

      /**
       * Animate outerRef (the ring's position anchor) toward the button center.
       * Moving outerRef rather than innerVeloRef keeps position + visual in sync —
       * avoids the ring drifting away from where the ticker thinks it is.
       */
      const onMagnetMove = (e) => {
        const rect    = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width  / 2;
        const centerY = rect.top  + rect.height / 2;

        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;

        const btnPullX = distX * 0.25;
        const btnPullY = distY * 0.25;

        // Button drifts toward cursor
        gsap.to(btn, {
          x:         btnPullX,
          y:         btnPullY,
          scale:     1.06,
          duration:  0.35,
          ease:      'power3.out',
          overwrite: 'auto',
        });

        // Ring position follows button center + a gentle extra nudge
        gsap.to(outerRef.current, {
          x:         centerX + btnPullX * 0.6,
          y:         centerY + btnPullY * 0.6,
          duration:  0.25,
          ease:      'power2.out',
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
        x:         0,
        y:         0,
        scale:     1,
        duration:  0.6,
        ease:      'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
    };

    // ── Text hover enter ─────────────────────────────────────────────────────
    const enterText = (el) => {
      activeText         = el;
      isHovering.current = true;

      gsap.set(innerVeloRef.current, { rotation: 0, scaleX: 1, scaleY: 1 });

      gsap.to(innerVeloRef.current, {
        scale:     1.8,
        duration:  0.3,
        ease:      'back.out(1.5)',
        overwrite: 'auto',
      });

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

    // ── Delegated listeners (single pair on document) ─────────────────────────
    const onMouseOver = (e) => {
      const metallic = e.target.closest('.btn-metallic');
      const textEl   = e.target.closest('h1,h2');

      if (metallic) {
        if (activeText)                leaveText(metallic);
        if (activeMagnet !== metallic) {
          if (activeMagnet) leaveMagnet(activeMagnet);
          enterMagnet(metallic);
        }
      } else if (textEl && !textEl.closest('a')) {
        if (activeText !== textEl) {
          if (activeText) leaveText(textEl);
          enterText(textEl);
        }
      }
    };

    const onMouseOut = (e) => {
      const next = e.relatedTarget;
      if (activeMagnet && !activeMagnet.contains(next)) leaveMagnet(activeMagnet);
      if (activeText   && !activeText.contains(next))   leaveText(next);
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout',  onMouseOut);

    return () => {
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout',  onMouseOut);
    };
  }, []);

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
          className="w-16 h-16 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 will-change-transform"
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