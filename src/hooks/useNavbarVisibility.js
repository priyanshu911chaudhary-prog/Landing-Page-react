import { useEffect, useState } from 'react';

const HERO_SECTION_ID = 'hero-section';
const THRESHOLD = 0.12;

/**
 * Tracks whether the hero section is in view to show/hide the navbar.
 * When hero leaves view, navbar slides up; when hero is visible, navbar is shown.
 * Also closes mobile menu when hero is not visible.
 */
export function useNavbarVisibility() {
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    const hero = document.getElementById(HERO_SECTION_ID);

    if (!hero) {
      setShowNavbar(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowNavbar(entry.isIntersecting);
      },
      { threshold: THRESHOLD }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return { showNavbar };
}
