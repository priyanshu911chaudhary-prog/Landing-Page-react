/**
 * GSAP plugin registration. Call once at app init (e.g. main.jsx)
 * so ScrollTrigger and other plugins are available everywhere.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
