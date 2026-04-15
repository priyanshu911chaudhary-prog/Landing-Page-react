import { lazy, Suspense, useEffect, useRef } from 'react';

import { useHomeScrollAnimations } from '@/hooks/useHomeScrollAnimations';
import { useReducedMotionPreference } from '@/hooks/useReducedMotion';
import HeroSection from '@/sections/HeroSection';
import ProblemSection from '@/sections/ProblemSection';
import HowItWorksSection from '@/sections/HowItWorksSection';
import ExampleResultSection from '@/sections/ExampleResultSection';
import AIPipelineSection from '@/sections/AIPipelineSection';
import CTASection from '@/sections/CTASection';

const AITrustScanner = lazy(() => import('@/components/background/AITrustScanner'));

function Home() {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotionPreference();
  useHomeScrollAnimations(containerRef, prefersReducedMotion);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full bg-transparent min-h-screen text-slate-300 relative"
    >
      <div
        data-home-ambient
        className="fixed inset-0 z-0 pointer-events-none opacity-40"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(60% 45% at 18% 22%, rgba(34,211,238,0.13), transparent 70%), radial-gradient(55% 40% at 82% 78%, rgba(129,140,248,0.11), transparent 72%)',
          mixBlendMode: 'screen',
        }}
      />

      <div
        className="fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 xl:flex flex-col items-center gap-3 pointer-events-none"
        aria-hidden="true"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500 [writing-mode:vertical-rl] rotate-180">
          Build Progress
        </span>
        <div className="h-44 w-px overflow-hidden rounded-full bg-slate-800/80">
          <div
            data-scroll-progress
            className="h-full w-full bg-gradient-to-b from-cyan-300 via-blue-400 to-transparent"
          />
        </div>
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <Suspense fallback={null}>
          <AITrustScanner />
        </Suspense>
      </div>

      <div className="relative z-10 w-full">
        <div data-home-section>
          <HeroSection />
        </div>
        <div data-home-section>
          <ProblemSection />
        </div>
        <div data-home-section>
          <HowItWorksSection />
        </div>
        <div data-home-section>
          <ExampleResultSection />
        </div>
        <div data-home-section>
          <AIPipelineSection />
        </div>
        <div data-home-section>
          <CTASection />
        </div>
      </div>
    </div>
  );
}

export default Home;
