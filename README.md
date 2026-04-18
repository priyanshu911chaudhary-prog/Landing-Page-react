
# Verify-X Landing Page

Animation-heavy product landing page built with React, Vite, GSAP, Lenis, and Three.js.

This project is optimized for smooth scroll storytelling, 3D ambient motion, and production deployment.

## Overview

- Stack: React 19 + Vite 5 + Tailwind 4
- Animation: GSAP + ScrollTrigger + Lenis + custom cursor + CSS keyframes
- 3D: React Three Fiber + Drei + Postprocessing Bloom
- State: lightweight shared object animation state in [src/store/dnaState.js](src/store/dnaState.js)

## Key Features

- Cinematic hero intro timeline with split-character motion and scramble effect
- Section-by-section scroll choreography using ScrollTrigger
- Real-time 3D DNA scene with mouse influence and scroll-driven state transitions
- Context-aware custom cursor with magnetic CTA behavior
- Realistic preloader flow that reflects actual readiness tasks (not fake time-only progress)
- Reduced-motion support via [src/hooks/useReducedMotion.js](src/hooks/useReducedMotion.js)

## Project Structure

- App shell: [src/App.jsx](src/App.jsx), [src/main.jsx](src/main.jsx)
- Main page composition: [src/pages/Home.jsx](src/pages/Home.jsx)
- Sections: [src/sections](src/sections)
- Background systems: [src/components/background](src/components/background)
- Animation orchestration: [src/hooks/useHomeScrollAnimations.js](src/hooks/useHomeScrollAnimations.js)
- Global styles: [src/styles/index.css](src/styles/index.css)
- Loader: [src/ui/Preloader.jsx](src/ui/Preloader.jsx)

## Local Development

### Requirements

- Node.js 18+ (recommended: latest LTS)
- npm 9+

### Install

```bash
npm install
```

### Start dev server

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Production build

```bash
npm run build
```

### Preview production build locally

```bash
npm run preview
```

## Deployment

This is a static Vite build. Deploy the generated [dist](dist) directory.

### Vercel

- Framework preset: Vite
- Build command: npm run build
- Output directory: dist

### Netlify

- Build command: npm run build
- Publish directory: dist

### Generic static hosting

1. Run npm run build
2. Upload dist contents to your web root/CDN bucket

## Deployment Checklist

- Lint passes: npm run lint
- Build passes: npm run build
- No local-only docs committed (for example [animation-notes.md](animation-notes.md) is gitignored)
- Verify hashed assets and lazy chunks are loading correctly in preview
- Confirm reduced-motion behavior and mobile rendering


## Troubleshooting

- If npm run dev fails immediately:
  - Ensure dependencies are installed with npm install
  - Confirm Node version is 18+
  - Re-run with clean install if needed:

```bash
rm -rf node_modules package-lock.json
npm install
```

- If scroll animations feel unsynced:
  - Check Lenis initialization in [src/App.jsx](src/App.jsx)
  - Ensure ScrollTrigger update/refresh hooks are active

## Scripts

- npm run dev: start development server
- npm run build: create production bundle in dist
- npm run preview: preview built app
- npm run lint: run ESLint

## License

All rights reserved. Digital Trust Initiative 2026.
