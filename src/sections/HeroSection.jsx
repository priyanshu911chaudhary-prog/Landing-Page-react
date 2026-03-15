import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

function HeroSection() {
    const headingRef = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const heading = headingRef.current;
        if (!heading) return;

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
        };
    }, []);

    return (
        <section id="hero-section" className="relative h-[100vh] min-h-[800px] flex items-center bg-transparent pb-10 lg:pb-0 overflow-hidden">
            <div data-section-panel className="relative w-full max-w-[1400px] mx-auto px-6 lg:px-12 z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                    {/* LEFT — Text Content */}
                    <div className="w-full lg:w-1/2 max-w-4xl text-left pt-24 lg:pt-32 pb-16 px-0 -translate-y-[10%]">
                        <h1
                            ref={headingRef}
                            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-6 font-heading [text-shadow:0_12px_40px_rgba(15,23,42,0.62)] relative z-20"
                        >
                            The <span className="text-metallic inline-block">DNA</span> of Digital <br /><span className="text-metallic inline-block">Trust</span>
                        </h1>

                        <p data-reveal className="max-w-xl text-base lg:text-lg text-slate-300 mb-8 leading-relaxed font-light">
                            Review a claim, inspect cited sources, and see a confidence score with
                            a clear reasoning summary before sharing or publishing.
                        </p>

                        <div data-reveal className="flex flex-col sm:flex-row items-start gap-4">
                            <Link to="/detector" className="btn-metallic group relative w-full sm:w-auto text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium text-base lg:text-lg flex items-center justify-center gap-3">
                                Analyze a Claim
                                <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                            <a href="#how-it-works" className="btn-metallic group relative w-full sm:w-auto text-slate-200 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium text-base lg:text-lg flex items-center justify-center gap-3">
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