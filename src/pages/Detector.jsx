import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DetectorInputPanel from '@/components/detector/DetectorInputPanel';
import DetectorProcessingLoader from '@/components/detector/DetectorProcessingLoader';
import DetectorResultCard from '@/components/detector/DetectorResultCard';

gsap.registerPlugin(ScrollTrigger);

const PHASE = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  RESULT: 'result',
};

function Detector() {
  const [phase, setPhase] = useState(PHASE.IDLE);
  const [formData, setFormData] = useState(null);
  const [result, setResult] = useState(null);

  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const progressBarRef = useRef(null);
  const headingRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* Magnetic Repulsion Effect */
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    // Split text into spans
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

      chars.forEach((char) => {
        const rect = char.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;

        const dx = charX - mouseX;
        const dy = charY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
          const force = (radius - distance) / radius;
          const pushX = (dx / distance) * force * 40;
          const pushY = (dy / distance) * force * 40;
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

  /* Hero entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroEls = heroRef.current?.querySelectorAll('[data-reveal]');
      if (heroEls?.length) {
        gsap.fromTo(
          heroEls,
          { y: 30, opacity: 0, filter: 'blur(8px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            stagger: 0.15,
            ease: 'expo.out',
            delay: 0.1,
          }
        );
      }

      const contentEls = contentRef.current?.querySelectorAll('[data-reveal]');
      if (contentEls?.length) {
        gsap.fromTo(
          contentEls,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.1,
            ease: 'power4.out',
            delay: 0.5,
          }
        );
      }

      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* Animate content panel on phase change */
  useEffect(() => {
    if (!contentRef.current) return;
    const els = contentRef.current.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    gsap.killTweensOf(els);

    gsap.fromTo(
      els,
      {
        y: 40,
        opacity: 0,
        scale: 0.9,
        filter: 'blur(15px)',
        rotateX: -10
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        rotateX: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
        clearProps: 'all'
      }
    );
  }, [phase]);

  const handleAnalyze = useCallback((data) => {
    setFormData(data);
    setPhase(PHASE.PROCESSING);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    if (!formData) return;
    setResult({
      headline: formData.headline || formData.url || 'Untitled Claim',
      classification: 'REAL',
      statusLabel: 'Verified Authentic',
      statusTone: 'positive',
      credibilityScore: 87,
      confidence: 91,
      summary: 'This claim is supported by multiple credible sources with strong corroborating evidence across independent publications.',
    });
    setPhase(PHASE.RESULT);
  }, [formData]);

  const handleReset = useCallback(() => {
    setPhase(PHASE.IDLE);
    setFormData(null);
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const inputPanelRef = useRef(null);

  const handleEnterClaimClick = () => {
    inputPanelRef.current?.focus();
    inputPanelRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-transparent min-h-screen text-slate-300 relative"
    >
      {/* Atmospheric glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[5%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(ellipse at center, #22d3ee 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-15%] right-[0%] w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(ellipse at center, #818cf8 0%, transparent 70%)' }} />
      </div>

      <section
        ref={heroRef}
        id="hero-section"
        className="relative h-[100vh] min-h-[800px] flex items-center bg-transparent pb-10 lg:pb-0 overflow-hidden"
      >
        <div className="relative w-full max-w-[1400px] mx-auto px-6 lg:px-12 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* LEFT — Text Content */}
            <div className="w-full lg:w-1/2 max-w-4xl text-left pt-24 lg:pt-32 pb-16 px-0 -translate-y-[10%]">
              <h1
                ref={headingRef}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-white tracking-[-0.02em] leading-[1.05] mb-6 font-heading [text-shadow:0_12px_40px_rgba(15,23,42,0.62)] relative z-20"
              >
                Verify Before <br />
                <span className="text-metallic inline-block">You Believe.</span>
              </h1>

              <p
                data-reveal
                className="max-w-xl text-base lg:text-lg text-slate-300 mb-8 leading-relaxed font-light"
              >
                Submit any headline, article, or URL for multi-source credibility
                analysis and confidence-scored verification. Our neural engine correlates
                global data signals in real-time.
              </p>

              <div data-reveal className="flex flex-col sm:flex-row items-start gap-4">
                <button
                  onClick={handleEnterClaimClick}
                  className="btn-metallic group relative w-full sm:w-auto text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium text-base lg:text-lg flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98]"
                >
                  Enter Claim
                  <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* RIGHT — Functional Cards */}
            <div
              ref={contentRef}
              className="w-full lg:w-1/2 relative min-h-[450px] flex items-center justify-center -translate-y-[6%]"
            >
              <div className="w-full max-w-[620px] relative z-10" data-reveal>
                {phase === PHASE.IDLE && (
                  <div data-reveal>
                    <DetectorInputPanel
                      ref={inputPanelRef}
                      onAnalyze={handleAnalyze}
                      isProcessing={false}
                    />
                  </div>
                )}

                {phase === PHASE.PROCESSING && (
                  <div data-reveal>
                    <DetectorProcessingLoader
                      headline={formData?.headline || formData?.url || 'Unknown payload'}
                      onComplete={handleLoaderComplete}
                    />
                  </div>
                )}

                {phase === PHASE.RESULT && result && (
                  <div data-reveal>
                    <DetectorResultCard
                      result={result}
                      onReset={handleReset}
                    />
                  </div>
                )}
              </div>

              <div className="absolute -inset-10 bg-gradient-to-tr from-cyan-500/10 via-transparent to-indigo-500/10 rounded-[3rem] blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Detector;
