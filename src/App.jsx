import { useEffect, useState } from 'react';
import Lenis from 'lenis';

import { ScrollTrigger } from '@/animations/gsap';
import MainLayout from '@/components/layout/MainLayout';
import { useReducedMotionPreference } from '@/hooks/useReducedMotion';
import CustomCursor from '@/ui/CustomCursor';
import Preloader from '@/ui/Preloader';

import Home from '@/pages/Home';

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const prefersReducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.1,
      wheelMultiplier: 1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    const syncTrigger = () => {
      ScrollTrigger.update();
    };

    lenis.on('scroll', syncTrigger);

    let rafId = null;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const refreshId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshId);
      if (rafId !== null) cancelAnimationFrame(rafId);
      lenis.off('scroll', syncTrigger);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, [prefersReducedMotion]);

  return (
    <>
      {!preloaderDone && <Preloader onDone={() => setPreloaderDone(true)} />}
      <CustomCursor>
        <MainLayout>
          <Home />
        </MainLayout>
      </CustomCursor>
    </>
  );
}

export default App;