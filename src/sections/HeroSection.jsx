import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useReducedMotionPreference } from '@/hooks/useReducedMotion';

function HeroSection() {
    const headingRef = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const prefersReducedMotion = useReducedMotionPreference();

    useEffect(() => {
        const heading = headingRef.current;
        if (!heading) return;

        const glyphPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

        const randomGlyph = () => glyphPool[Math.floor(Math.random() * glyphPool.length)];

        const scrambleChar = (char, delay = 0) => {
            if (!char?.dataset?.finalChar) return;
            const finalChar = char.dataset.finalChar;
            if (!finalChar.trim()) return;

            gsap.delayedCall(delay, () => {
                char.textContent = randomGlyph();
                gsap.delayedCall(0.08, () => {
                    char.textContent = randomGlyph();
                    gsap.delayedCall(0.08, () => {
                        char.textContent = finalChar;
                    });
                });
            });
        };

        const processNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (!text.trim()) return;

                const fragment = document.createDocumentFragment();
                const parentIsMetallic = node.parentElement && node.parentElement.classList.contains('text-metallic');

                for (let i = 0; i < text.length; i++) {
                    const char = text[i];
                    if (char === ' ') {
                        fragment.appendChild(document.createTextNode(' '));
                    } else {
                        const span = document.createElement('span');
                        span.textContent = char;
                        span.dataset.finalChar = char;
                        if (parentIsMetallic) {
                            span.className = 'inline-block split-char transition-transform duration-75 text-metallic';
                        } else {
                            span.className = 'inline-block split-char transition-transform duration-75';
                        }
                        fragment.appendChild(span);
                    }
                }

                if (parentIsMetallic && node.parentElement) {
                    node.parentElement.classList.remove('text-metallic');
                }
                node.replaceWith(fragment);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName !== 'BR') {
                    Array.from(node.childNodes).forEach(processNode);
                }
            }
        };

        Array.from(heading.childNodes).forEach(processNode);
        const chars = heading.querySelectorAll('.split-char');
        const panel = heading.closest('[data-section-panel]');
        const textBlock = heading.parentElement;
        const subtitle = textBlock?.querySelector('p[data-reveal]');
        const actions = textBlock?.querySelector('div[data-reveal]');
        const ctx = gsap.context(() => {
            if (prefersReducedMotion) {
                gsap.set(chars, { clearProps: 'all' });
                gsap.set([panel, subtitle, actions], { clearProps: 'all' });
                return;
            }

            gsap.set(chars, {
                yPercent: 110,
                autoAlpha: 0,
                rotateX: 12,
                transformOrigin: '50% 100%',
                willChange: 'transform, opacity',
            });

            gsap.set(panel, {
                autoAlpha: 0.72,
                scale: 0.985,
                filter: 'blur(8px)',
                transformOrigin: '50% 50%',
                willChange: 'transform, opacity, filter',
            });

            gsap.set([subtitle, actions], {
                autoAlpha: 0,
                y: 26,
                clipPath: 'inset(0% 0% 100% 0%)',
                willChange: 'transform, opacity, clip-path',
            });

            const introTl = gsap.timeline();

            introTl
                .to(panel, {
                    autoAlpha: 1,
                    scale: 1.02,
                    filter: 'blur(0px)',
                    duration: 0.85,
                    ease: 'power4.out',
                })
                .to(panel, {
                    scale: 1,
                    duration: 0.32,
                    ease: 'back.out(1.4)',
                }, '-=0.12')
                .to(chars, {
                    autoAlpha: 1,
                    yPercent: 0,
                    rotateX: 0,
                    duration: 0.82,
                    stagger: 0.024,
                    ease: 'power4.out',
                    onStart: () => {
                        chars.forEach((char, index) => {
                            scrambleChar(char, index * 0.012 + 0.04);
                        });
                    },
                    onComplete: () => {
                        gsap.set(chars, { willChange: 'auto' });
                    },
                }, '-=0.55')
                .to(subtitle, {
                    autoAlpha: 1,
                    y: 0,
                    clipPath: 'inset(0% 0% 0% 0%)',
                    duration: 0.72,
                    ease: 'power3.out',
                    onComplete: () => {
                        gsap.set(subtitle, { clearProps: 'clipPath' });
                    },
                }, '-=0.34')
                .to(actions, {
                    autoAlpha: 1,
                    y: 0,
                    clipPath: 'inset(0% 0% 0% 0%)',
                    duration: 0.72,
                    ease: 'power3.out',
                    onComplete: () => {
                        gsap.set(actions, { clearProps: 'clipPath' });
                        gsap.set([panel, subtitle, actions], { willChange: 'auto' });
                    },
                }, '-=0.52');
        }, heading);

        if (prefersReducedMotion) {
            return () => ctx.revert();
        }

        const handleMouseMove = (e) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const ticker = () => {
            const { x: mouseX, y: mouseY } = mousePos.current;
            const radius = 120;
            const maxPush = 40;

            chars.forEach((char) => {
                const rect = char.getBoundingClientRect();
                const charX = rect.left + rect.width / 2;
                const charY = rect.top + rect.height / 2;

                const dx = charX - mouseX;
                const dy = charY - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < radius) {
                    const force = (radius - distance) / radius;
                    const pushX = (dx / distance) * force * maxPush;
                    const pushY = (dy / distance) * force * maxPush;
                    const rotate = (dx / distance) * force * 30;

                    gsap.to(char, {
                        x: pushX,
                        y: pushY,
                        rotation: rotate,
                        scale: 1 + (force * 0.2),
                        duration: 0.2,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                } else {
                    if (char.style.transform && char.style.transform !== 'none' && char.style.transform !== 'translate(0px, 0px) rotate(0deg) scale(1, 1)') {
                        gsap.to(char, {
                            x: 0,
                            y: 0,
                            rotation: 0,
                            scale: 1,
                            duration: 0.8,
                            ease: "elastic.out(1, 0.4)",
                            overwrite: "auto"
                        });
                    }
                }
            });
        };

        gsap.ticker.add(ticker);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            gsap.ticker.remove(ticker);
            ctx.revert();
        };
    }, [prefersReducedMotion]);

    return (
        <section id="hero-section" className="relative h-[100vh] min-h-[800px] flex items-center bg-transparent pb-10 lg:pb-0 overflow-hidden">
            <div data-section-panel className="relative w-full max-w-[1400px] mx-auto px-6 lg:px-12 z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                    {/* LEFT — Text Content */}
                    <div className="w-full lg:w-1/2 max-w-4xl text-left pt-24 lg:pt-32 pb-16 px-0 -translate-y-[8%]">
                        <h1
                            ref={headingRef}
                            className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-8 font-heading [text-shadow:0_12px_40px_rgba(15,23,42,0.62)] relative z-20"
                        >
                            The <span className="text-metallic inline-block">DNA</span> of Digital <br /><span className="text-metallic inline-block">Trust</span>
                        </h1>

                        <p data-reveal className="max-w-2xl text-lg sm:text-xl lg:text-2xl text-slate-300 mb-10 leading-relaxed font-light">
                            Review a claim, inspect cited sources, and see a confidence score with
                            a clear reasoning summary before sharing or publishing.
                        </p>

                        <div data-reveal className="flex flex-col sm:flex-row items-start gap-4">
                            <a href="#pipeline" data-cursor="cta" data-cursor-label="ANALYZE" className="btn-metallic group relative w-full sm:w-auto text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium text-base lg:text-lg flex items-center justify-center gap-3">
                                Analyze a Claim
                                <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                            <a href="#how-it-works" data-cursor="cta" data-cursor-label="EXPLORE" className="btn-metallic group relative w-full sm:w-auto text-slate-200 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium text-base lg:text-lg flex items-center justify-center gap-3">
                                Learn more
                                <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default React.memo(HeroSection);