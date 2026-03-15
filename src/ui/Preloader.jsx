import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────
   Preloader — cinematic AI boot screen
   • Counts 0 → 100 over ~2.8s
   • Noise canvas texture + slow radial glow
   • Fades out + slides up when done
───────────────────────────────────────────── */
export default function Preloader({ onDone }) {
    const [count, setCount] = useState(0);
    const [phase, setPhase] = useState('idle'); // idle → counting → fadeOut → done
    const canvasRef = useRef(null);
    const rafRef = useRef(null);

    /* ── Noise texture canvas ── */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const render = () => {
            const { width: w, height: h } = canvas;
            const imageData = ctx.createImageData(w, h);
            for (let i = 0; i < imageData.data.length; i += 4) {
                const v = Math.random() * 18 | 0; // very faint grain
                imageData.data[i] = v;
                imageData.data[i + 1] = v;
                imageData.data[i + 2] = v;
                imageData.data[i + 3] = 40; // subtle opacity
            }
            ctx.putImageData(imageData, 0, 0);
            rafRef.current = requestAnimationFrame(render);
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    /* ── Counter animation ── */
    useEffect(() => {
        // Start after a very short delay so the layout renders first
        const startDelay = setTimeout(() => {
            setPhase('counting');

            const totalDuration = 2800; // ms
            const startTime = performance.now();

            const tick = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / totalDuration, 1);
                // Ease-out curve: fast early, slow near 100
                const eased = 1 - Math.pow(1 - progress, 2.2);
                const value = Math.floor(eased * 100);
                setCount(value);

                if (progress < 1) {
                    rafRef.current = requestAnimationFrame(tick);
                } else {
                    setCount(100);
                    // Hold for a beat then fade out
                    setTimeout(() => setPhase('fadeOut'), 300);
                }
            };

            rafRef.current = requestAnimationFrame(tick);
        }, 200);

        return () => {
            clearTimeout(startDelay);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    /* ── After fade-out completes, tell parent ── */
    useEffect(() => {
        if (phase === 'fadeOut') {
            const t = setTimeout(() => {
                setPhase('done');
                onDone?.();
            }, 900); // matches CSS transition duration
            return () => clearTimeout(t);
        }
    }, [phase, onDone]);

    if (phase === 'done') return null;

    const isOut = phase === 'fadeOut';
    const counterStr = String(count).padStart(3, '0');

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: '#050505',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                // Exit: fade + slide up
                opacity: isOut ? 0 : 1,
                transform: isOut ? 'translateY(-4%)' : 'translateY(0)',
                transition: isOut
                    ? 'opacity 0.85s cubic-bezier(0.4,0,0.2,1), transform 0.85s cubic-bezier(0.4,0,0.2,1)'
                    : 'none',
                pointerEvents: isOut ? 'none' : 'all',
            }}
        >
            {/* Noise canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    mixBlendMode: 'screen',
                    pointerEvents: 'none',
                }}
            />

            {/* Slow radial glow */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(100,120,180,0.07) 0%, transparent 80%)',
                    animation: 'glowPulse 6s ease-in-out infinite',
                    pointerEvents: 'none',
                }}
            />

            {/* Horizontal scan-line */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '1px',
                    background:
                        'linear-gradient(to right, transparent, rgba(200,210,255,0.14) 40%, rgba(200,210,255,0.14) 60%, transparent)',
                    animation: 'scanLine 3s linear infinite',
                    pointerEvents: 'none',
                }}
            />

            {/* ── Center message ── */}
            <div
                style={{
                    textAlign: 'center',
                    opacity: phase === 'counting' || phase === 'fadeOut' ? 1 : 0,
                    transition: 'opacity 1.2s ease',
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                {/* Main message */}
                <p
                    style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 300,
                        fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                        letterSpacing: '0.12em',
                        color: 'rgba(220,228,242,0.62)',
                        maxWidth: '420px',
                        lineHeight: 1.8,
                        margin: '0 auto',
                    }}
                >
                    Increase brightness and dim the lights<br />
                    for a better experience
                </p>

                {/* Thin divider */}
                <div
                    style={{
                        width: '1px',
                        height: '40px',
                        background:
                            'linear-gradient(to bottom, transparent, rgba(160,175,210,0.3), transparent)',
                        margin: '2.5rem auto 0',
                    }}
                />
            </div>

            {/* ── Counter ── */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '40px',
                    right: '44px',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '4px',
                    opacity: phase === 'counting' || phase === 'fadeOut' ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                }}
            >
                <span
                    style={{
                        fontFamily: "'Outfit', 'Courier New', monospace",
                        fontSize: 'clamp(5rem, 12vw, 8rem)', // Increased font size
                        fontWeight: 400,
                        letterSpacing: '-0.02em',
                        color: 'rgba(235,240,252,0.92)',
                        lineHeight: 1,
                        fontVariantNumeric: 'tabular-nums',
                        textShadow: '0 4px 32px rgba(80,120,255,0.18)',
                        transition: 'color 0.2s ease',
                    }}
                >
                    {counterStr}
                </span>
                <span
                    style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
                        letterSpacing: '0.2em',
                        color: 'rgba(160,175,210,0.4)',
                        marginBottom: '6px',
                    }}
                >
                    %
                </span>
            </div>

            {/* ── Progress bar, bottom ── */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'rgba(255,255,255,0.04)',
                    zIndex: 2,
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${count}%`,
                        background:
                            'linear-gradient(to right, rgba(100,120,200,0.4), rgba(180,195,230,0.7))',
                        transition: 'width 0.1s linear',
                    }}
                />
            </div>

            {/* Keyframes via a style tag */}
            <style>{`
                @keyframes scanLine {
                    0%   { top: -2px; }
                    100% { top: 100vh; }
                }
                @keyframes glowPulse {
                    0%, 100% { opacity: 0.6; }
                    50%       { opacity: 1;   }
                }
            `}</style>
        </div>
    );
}
