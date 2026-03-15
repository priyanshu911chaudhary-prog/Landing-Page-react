# Refactor Summary — DTI 3.0

Refactor completed **without changing any functionality, UI, or animations**. The app builds successfully and behavior is preserved.

---

## 1. New folder structure

```
src/
├── animations/
│   └── gsap.js                 # GSAP + ScrollTrigger registration (single place)
├── components/
│   ├── background/
│   │   ├── AITrustScanner.jsx  # Three.js DNA canvas (unchanged logic)
│   │   └── AppBackground.jsx    # Starfield background
│   └── layout/
│       ├── MainLayout.jsx      # App shell (navbar, footer, background)
│       ├── Navbar.jsx           # Uses NAV_LINKS + useNavbarVisibility
│       └── Footer.jsx          # Uses NAV_LINKS
├── constants/
│   ├── index.js                # Re-exports all constants
│   ├── nav.js
│   ├── threats.jsx
│   ├── phases.jsx
│   ├── evidence.js
│   ├── pipeline.js
│   ├── features.js
│   └── stats.js
├── hooks/
│   ├── index.js
│   ├── useNavbarVisibility.js  # Hero in view → show/hide navbar
│   └── useHomeScrollAnimations.js  # All Home GSAP scroll + DNA timeline
├── pages/
│   ├── Home.jsx                # Thin: scroll hook + section list
│   └── Detector.jsx
├── sections/
│   ├── HeroSection.jsx
│   ├── ProblemSection.jsx
│   ├── HowItWorksSection.jsx
│   ├── ExampleResultSection.jsx
│   ├── AIPipelineSection.jsx
│   ├── CTASection.jsx
│   ├── FeaturesSection.jsx
│   └── StatsSection.jsx
├── store/
│   └── dnaState.js
├── styles/
│   └── index.css
├── ui/
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Section.jsx
│   ├── Input.jsx
│   ├── CustomCursor.jsx
│   └── Preloader.jsx
├── App.jsx
└── main.jsx
```

**Removed:** `src/layout/MainLayout.jsx` (replaced by `src/components/layout/MainLayout.jsx`).  
**Removed:** `src/components/Navbar.jsx`, `src/components/Footer.jsx` (moved to `src/components/layout/`).

---

## 2. Updated file tree (source only)

```
src/
├── animations/gsap.js
├── App.jsx
├── components/
│   ├── background/
│   │   ├── AITrustScanner.jsx
│   │   └── AppBackground.jsx
│   └── layout/
│       ├── Footer.jsx
│       ├── MainLayout.jsx
│       └── Navbar.jsx
├── constants/
│   ├── evidence.js
│   ├── features.js
│   ├── index.js
│   ├── nav.js
│   ├── phases.jsx
│   ├── pipeline.js
│   ├── stats.js
│   └── threats.jsx
├── hooks/
│   ├── index.js
│   ├── useHomeScrollAnimations.js
│   └── useNavbarVisibility.js
├── main.jsx
├── pages/
│   ├── Detector.jsx
│   └── Home.jsx
├── sections/
│   ├── AIPipelineSection.jsx
│   ├── CTASection.jsx
│   ├── ExampleResultSection.jsx
│   ├── FeaturesSection.jsx
│   ├── HeroSection.jsx
│   ├── HowItWorksSection.jsx
│   ├── ProblemSection.jsx
│   └── StatsSection.jsx
├── store/
│   └── dnaState.js
├── styles/
│   └── index.css
└── ui/
    ├── Button.jsx
    ├── Card.jsx
    ├── CustomCursor.jsx
    ├── Input.jsx
    ├── Preloader.jsx
    └── Section.jsx
```

---

## 3. Major improvements

### 3.1 Scalable structure
- **animations/** — GSAP plugin registration in one place (`gsap.js`). No duplicate `gsap.registerPlugin(ScrollTrigger)` in pages.
- **constants/** — All section data (nav, threats, phases, evidence, pipeline, features, stats) lives in one folder. Sections import from `@/constants` or specific files.
- **hooks/** — Reusable logic: `useNavbarVisibility` (hero intersection → navbar visibility) and `useHomeScrollAnimations` (all Home scroll + DNA timeline). Home no longer holds a large GSAP block.
- **components/layout/** — Navbar, Footer, and MainLayout live under layout; shared `NAV_LINKS` keeps nav and footer in sync.

### 3.2 Code quality
- **No duplicate data** — Nav links, threat cards, phases, evidence, pipeline stages, features, and stats are defined once and imported.
- **Reusable components** — Section, Button, Card, Input wrapped with `React.memo` where it helps.
- **Clear separation** — Layout vs sections vs ui vs background; animation setup in animations + hooks.

### 3.3 Performance
- **Lazy routes** — `Home` and `Detector` are loaded with `React.lazy()`; `Suspense` wraps routes (fallback `null` so preloader still controls first paint).
- **Memoization** — Sections and layout components use `React.memo` to avoid unnecessary re-renders.
- **GSAP scope** — `useHomeScrollAnimations(containerRef)` runs in a scoped context so cleanup on unmount is correct.

### 3.4 Imports
- **Path alias** — `@/` points to `src/` (Vite + `jsconfig.json`). Imports like `@/components/layout/MainLayout`, `@/constants/nav`, `@/hooks/useNavbarVisibility` are consistent and easy to move files.
- **Unused imports removed** — Sections and pages use only what they need.
- **Order** — React first, then libs, then local (`@/...`).

### 3.5 Library usage
- **GSAP** — Registered once in `main.jsx` via `@/animations/gsap`. ScrollTrigger and timeline logic live in `useHomeScrollAnimations`. CustomCursor and HeroSection still use `gsap` for cursor and character effects.
- **Three.js / R3F** — Unchanged in `AITrustScanner.jsx`; still reads `dnaState` from `@/store/dnaState`.
- **Tailwind** — No structural changes; existing classes and `index.css` kept.

### 3.6 Readability
- **Comments** — Kept/added only where useful (e.g. hook purposes, constants).
- **Naming** — Same as before; constants use UPPER_SNAKE (e.g. `NAV_LINKS`, `THREATS`).
- **File size** — Home and sections are smaller; large GSAP block moved to a hook.

---

## 4. What stayed the same

- **UI and layout** — No visual or structural changes.
- **Animations** — Preloader, CustomCursor, Hero character repulsion, scroll reveals, progress bar, DNA timeline and positions are unchanged.
- **Routes** — `/` and `/detector` behave as before.
- **Data** — Same copy and structure; only moved into constants.
- **Styles** — `index.css`, Tailwind, and theme tokens unchanged.

---

## 5. How to run

```bash
npm run dev
npm run build
```

Use `@/` for imports (e.g. `import Section from '@/ui/Section'`). The alias is configured in `vite.config.js` and `jsconfig.json`.
