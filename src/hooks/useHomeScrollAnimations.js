import { gsap, ScrollTrigger } from '@/animations/gsap';
import { useGSAP } from '@gsap/react';
import { dnaState } from '@/store/dnaState';

/**
 * Sets up all Home page scroll-driven animations:
 * - Section panel reveal (blur, scale, opacity)
 * - data-reveal stagger (for text and sub-elements)
 * - Scroll progress bar (on the right side)
 * - DNA state timeline (syncing 3D strand movement with scroll)
 * 
 * @param {React.RefObject} containerRef - The ref of the main Home page container.
 * @param {boolean} prefersReducedMotion - User's reduced-motion accessibility preference.
 */
export function useHomeScrollAnimations(containerRef, prefersReducedMotion = false) {
  // useGSAP is a hook that handles GSAP cleanup automatically when the component unmounts.
  useGSAP(
    () => {
      // 1. COLLECT ALL SECTIONS TAGGED FOR ANIMATION
      const sections = gsap.utils.toArray('[data-home-section]');
      const progressBar = document.querySelector('[data-scroll-progress]');
      const ambientLayer = document.querySelector('[data-home-ambient]');

      if (!prefersReducedMotion) {
        gsap.set(sections, {
          transformOrigin: '50% 50%',
          willChange: 'transform, opacity, filter',
        });
      }

      // 2. SETUP PER-SECTION REVEAL ANIMATIONS
      sections.forEach((section, index) => {
        const panel = section.querySelector('[data-section-panel]');
        const revealTargets = section.querySelectorAll('[data-reveal]');
        const cardTargets = section.querySelectorAll('[data-motion="section-card"]');
        const nextSection = sections[index + 1];

        if (prefersReducedMotion) {
          if (panel) {
            gsap.set(panel, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: 'none',
              clearProps: 'clipPath',
            });
          }

          if (revealTargets.length) {
            gsap.set(revealTargets, {
              autoAlpha: 1,
              y: 0,
              clearProps: 'clipPath',
            });
          }

          if (cardTargets.length) {
            gsap.set(cardTargets, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clearProps: 'filter',
            });
          }

          return;
        }

        // --- Panel Reveal ---
        // Animates the main container of each section (Problem, How It Works, etc.)
        if (panel) {
          // Initialize state: slightly transparent, shifted down, blurred, and scaled down
          gsap.set(panel, {
            autoAlpha: 0.55,
            y: 70,
            scale: 0.965,
            filter: 'blur(12px)',
          });

          // Animation: brings panel to full visibility/focus as it enters the viewport
          gsap.to(panel, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%', // Animation starts when section top hit 82% of screen height
              end: 'top 35%',   // Finished by 35%
              scrub: 1,         // Smoothly follows scroll with a 1-second lag/smoothing
            },
          });
        }

        // --- Staggered Content Reveal ---
        // Animates internal elements (titles, paragraphs) with a "pop-up" effect
        if (revealTargets.length) {
          gsap.set(revealTargets, { autoAlpha: 0, y: 28 });
          gsap.to(revealTargets, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,    // 0.08s delay between each element popping up
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 74%',
              toggleActions: 'play none none reverse', // Plays forward on enter, reverses on leave
            },
          });
        }

        // --- Dedicated Card Pop Reveal ---
        if (cardTargets.length) {
          gsap.set(cardTargets, {
            autoAlpha: 0,
            y: 36,
            scale: 0.96,
            filter: 'blur(8px)',
            transformOrigin: '50% 50%',
          });

          gsap.to(cardTargets, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.78,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 72%',
              toggleActions: 'play none none reverse',
            },
          });
        }

        // --- Section Handoff (Narrative Overlap) ---
        if (!prefersReducedMotion && nextSection) {
          gsap.fromTo(
            section,
            {
              autoAlpha: 1,
              scale: 1,
              yPercent: 0,
              filter: 'blur(0px)',
            },
            {
              autoAlpha: 0.8,
              scale: 0.972,
              yPercent: -2.5,
              filter: 'blur(2px)',
              ease: 'none',
              scrollTrigger: {
                trigger: nextSection,
                start: 'top 88%',
                end: 'top 44%',
                scrub: 1,
              },
            }
          );

          gsap.fromTo(
            nextSection,
            {
              autoAlpha: 0.82,
              yPercent: 8,
              scale: 0.985,
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: nextSection,
                start: 'top 90%',
                end: 'top 46%',
                scrub: 1,
              },
            }
          );
        }
      });

      // 3. SCROLL PROGRESS BAR (RIGHT SIDE)
      if (progressBar) {
        if (prefersReducedMotion) {
          gsap.set(progressBar, { scaleY: 1, transformOrigin: 'top center' });
        } else {
        gsap.fromTo(
          progressBar,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            ease: 'none', // Linear progression matching scroll
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          }
        );
        }
      }

      // 3.5 AMBIENT MORPH LAYER
      if (ambientLayer) {
        if (prefersReducedMotion) {
          gsap.set(ambientLayer, { opacity: 0.36, filter: 'none' });
        } else {
          gsap.fromTo(
            ambientLayer,
            { opacity: 0.28, filter: 'hue-rotate(0deg)' },
            {
              opacity: 0.5,
              filter: 'hue-rotate(24deg)',
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
              },
            }
          );
        }
      }

      // Reduced motion keeps DNA static in a stable visual resting pose.
      if (prefersReducedMotion) {
        gsap.set(dnaState, {
          x: 2.6,
          y: -0.35,
          z: 0,
          rotationX: 0.24,
          rotationY: 0.45,
          rotationZ: -0.42,
          scale: 0.78,
        });
        return;
      }

      // 4. DNA STRAND MOVEMENT TIMELINE
      // This timeline orchestrates the 3D strand's position/rotation through the whole page.
      // because 'scrub: true' is used, the whole timeline is mapped to the scroll distance of the page.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Ties timeline progress directly to scrollbar with smooth lag
        },
      });

      // Initial resting state (Hero Section)
      gsap.set(dnaState, {
        x: 3.0,
        y: -0.4,
        z: 0,
        rotationX: 0.4,
        rotationY: 0.6,
        rotationZ: -0.7,
        scale: 0.8,
      });

      // --- STAGE 1: Transition to 'Problem' Section ---
      tl.to(dnaState, {
        x: -0.6,
        y: 0.2,
        rotationX: 0.2,
        rotationY: 0.2,
        rotationZ: -0.8,
        scale: 0.85,
        duration: 0.3,
        ease: 'none',
      })
        // Delay/Hold: Keeps the strand stationary for a moment before moving to stage 2
        // .to(dnaState, {
        //   duration: 0.12,
        //   ease: 'none',
        // })
        // // --- STAGE 2: Transition to 'How It Works' ---
        .to(dnaState, {
          x: -4.2,
          y: -0.2,
          rotationX: 0.1,
          rotationY: 0,
          rotationZ: 0,
          scale: 0.75,
          duration: 0.5,
          ease: 'none',
        })
        .to(dnaState, {
          duration: 0.12,
          ease: 'none',
        })
        // --- STAGE 3: Transition to 'Example Result' ---
        .to(dnaState, {
          x: -1.5,
          y: 0,
          rotationX: 0.7,
          rotationY: -0.2,
          rotationZ: 0.85,
          scale: 0.85,
          duration: 0.5,
          ease: 'none',
        })
        // --- STAGE 4: Final resting position / CTA Section ---
        .to(dnaState, {
          x: 4,
          y: -0.2,
          rotationX: 0.1,
          rotationY: 0,
          rotationZ: 0,
          scale: 0.8,
          duration: 0.4,
          ease: 'none',
        })
        // SPIN EFFECTS: Decorative rotation at the bottom of the page
        .to(dnaState, {
          rotationY: `+=${Math.PI * 2}`,
          duration: 1,
          ease: 'none',
        })
        .to(dnaState, {
          rotationY: `+=${Math.PI * 2}`,
          duration: 1,
          ease: 'none',
        })
        .to(dnaState, {
          rotationY: `+=${Math.PI * 2}`,
          duration: 1.5,
          ease: 'none',
        });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion], revertOnUpdate: true }
  );
}
