# Mikheil Mamniashvili — Portfolio

Premium personal portfolio website built with **Angular 21**, featuring SSR, dark/light themes, English/Georgian i18n, and a modern dark-tech aesthetic.

## Tech Stack

- Angular 21 (standalone components, signals, zoneless)
- TypeScript
- SCSS with CSS custom properties
- Angular SSR + prerendering
- ngx-translate (EN / KA)
- Angular Animations
- Express SSR server

## Prerequisites

- Node.js 20+
- npm 10+

## Getting Started

```bash
# Install dependencies
npm install

# Development server (http://localhost:4200)
npm start

# Production build
npm run build

# Serve SSR production build
npm run serve:ssr:portfolio
```

## Project Structure

```
src/
├── app/
│   ├── core/           # Services, mock data
│   ├── shared/         # Reusable components, directives, animations
│   ├── layout/         # Header, footer, app shell
│   └── features/       # Home sections, contact page
├── assets/
│   ├── i18n/           # Translation files (en.json, ka.json)
│   └── images/         # Project placeholders, OG image
└── styles/             # Global SCSS theme system
```

## Editing Content

### Portfolio data (skills, projects, stats, experience)

Edit [`src/app/core/data/portfolio.data.ts`](src/app/core/data/portfolio.data.ts).

### Translations

All visible text lives in:

- [`src/assets/i18n/en.json`](src/assets/i18n/en.json) — English
- [`src/assets/i18n/ka.json`](src/assets/i18n/ka.json) — Georgian (ქართული)

Translation keys referenced in `portfolio.data.ts` must exist in both JSON files.

### Project images

Replace SVG placeholders in `src/assets/images/projects/` with your own WebP or SVG assets. Update image paths in `portfolio.data.ts`.

### Contact information

Update [`src/app/core/data/portfolio.data.ts`](src/app/core/data/portfolio.data.ts) → `PERSON` constant.

### SEO / domain

Update the base URL in [`src/app/core/services/seo.service.ts`](src/app/core/services/seo.service.ts) and [`public/sitemap.xml`](public/sitemap.xml).

## Features

- **Themes:** Dark (default) and light mode with localStorage persistence
- **Languages:** English and Georgian with localStorage persistence
- **Navigation:** Sticky header, anchor scrolling on home, animated mobile menu
- **Sections:** Hero, About, Experience, Skills, Projects, Expertise, Statistics
- **Contact page:** Info-only (email, phone, LinkedIn, GitHub) — lazy loaded
- **Animations:** Scroll reveals, counters, carousel, page transitions, reduced-motion support
- **Accessibility:** Skip link, ARIA labels, semantic landmarks, focus rings
- **Performance:** Lazy routes, `@defer` for below-fold sections, prerendered static HTML

## Lighthouse Audit

1. Run `npm run build`
2. Serve with `npm run serve:ssr:portfolio`
3. Open Chrome DevTools → Lighthouse → run audit on `http://localhost:4000`

Target: 90+ across Performance, Accessibility, Best Practices, and SEO.

## Deployment

### Node.js SSR

```bash
npm run build
node dist/portfolio/server/server.mjs
```

Deploy the `dist/portfolio` folder to any Node.js hosting (Railway, Render, VPS).

### Static hosting (prerendered)

The build prerenders `/` and `/contact`. For static hosts (Netlify, Vercel static), configure redirects for SPA fallback on unknown routes.

## Environment Variables

None required. The AI chatbot and contact form were intentionally excluded from this version.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server |
| `npm run build` | Production SSR build |
| `npm run serve:ssr:portfolio` | Serve production SSR |
| `npm test` | Unit tests (Vitest) |

## License

Private — © Mikheil Mamniashvili
