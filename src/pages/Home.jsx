import { useEffect, useRef } from 'react';

import AITrustScanner from '@/components/background/AITrustScanner';
import { useHomeScrollAnimations } from '@/hooks/useHomeScrollAnimations';
import HeroSection from '@/sections/HeroSection';
import ProblemSection from '@/sections/ProblemSection';
import HowItWorksSection from '@/sections/HowItWorksSection';
import ExampleResultSection from '@/sections/ExampleResultSection';
import AIPipelineSection from '@/sections/AIPipelineSection';
import CTASection from '@/sections/CTASection';

function Home() {
  const containerRef = useRef(null);
  useHomeScrollAnimations(containerRef);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full bg-transparent min-h-screen text-slate-300 relative"
    >
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
        <AITrustScanner />
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
