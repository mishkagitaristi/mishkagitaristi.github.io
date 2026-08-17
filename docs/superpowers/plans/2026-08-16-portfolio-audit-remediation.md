# Portfolio Audit Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the portfolio to a green test/lint/CI baseline, upgrade every dependency to its current supported version, fix the confirmed correctness and SEO defects, and land the accessibility/design refinements the audit identified.

**Architecture:** Four sequential phases. Phase 0 restores a working verification loop (tests currently do not compile), because every later task depends on being able to prove it did not break anything. Phase 1 upgrades the toolchain — Node, TypeScript, Angular 21→22, ngx-translate 17→18, ESLint — in that order, because `angular-eslint@22` requires `@angular/cli >= 22`. Phase 2 fixes confirmed runtime/SEO bugs. Phase 3 lands design and accessibility refinements. Each task ends with a build, a test run, and a commit.

**Tech Stack:** Angular 22 (standalone, zoneless, SSR + prerender via `@angular/ssr`), TypeScript 6.0, SCSS with CSS custom-property theming, `@ngx-translate` for en/ka i18n, Vitest via `@angular/build:unit-test`, Express 5 SSR host.

## Global Constraints

- Node runtime must be `>= 22.22.3` (Angular 22 `engines`: `^22.22.3 || ^24.15.0 || >=26.0.0`). The machine currently runs `v22.13.1`, which is **below** the floor — Task 4 cannot pass until Node is upgraded.
- TypeScript must be `>=6.0 <6.1` (`@angular/compiler-cli@22` peer). Pin `~6.0.3`. **Do not install TypeScript 7.x** even though it is `latest` on npm — Angular 22 rejects it.
- Angular framework packages pin to `^22.1.2`; `@angular/build`, `@angular/cli`, `@angular/ssr` pin to `^22.1.4`.
- `@ngx-translate/core` and `@ngx-translate/http-loader` pin to `^18.0.0`.
- The app is **zoneless**. `zone.js` is not a dependency, is absent from the built bundles, and `@angular/core`'s `zone.js` peer is marked optional. Never add `zone.js`. Never rely on `NgZone` for scheduling.
- Every component uses `ChangeDetectionStrategy.OnPush` and inline `template:`/`styles:` (no separate `.html`/`.scss` files per component). Match that.
- Path aliases in use: `@core/*`, `@shared/*`, `@features/*`, `@layout/*`.
- Prettier config is `printWidth: 100`, `singleQuote: true`. Run `npm run format` before every commit once Task 2 adds it.
- Two locales, `en` and `ka`, each with exactly 279 keys in `src/assets/i18n/*.json`. Any new user-facing string must be added to **both** files or the key count check in Task 2 fails.
- Site canonical origin is `https://mikheilmamniashvili.dev`.

---

## Audit Findings This Plan Addresses

Recorded here so each task's purpose is traceable. Every item below is confirmed by inspection or by a command that was actually run.

### Confirmed defects

| # | Finding | Evidence | Task |
|---|---------|----------|------|
| 1 | `npm test` does not compile | `TS2307: Cannot find module '@layout/app-shell/app-shell.component'` — aliases live only in `tsconfig.app.json`, which `tsconfig.spec.json` does not inherit. Adding them to the spec config makes the suite pass (1/1). | 1 |
| 2 | Work + statistics sections absent from prerendered HTML | `grep -o 'id="work"' dist/portfolio/browser/index.html` → 0 hits; 2 `defer-placeholder` divs instead. `@defer (on idle)` renders only the placeholder during SSR. | 8 |
| 3 | `#work` anchor has no target on first paint | Same root cause as #2. `AnchorScrollService.scrollTo` retries 50×50 ms to paper over it. | 8, 9 |
| 4 | `og:image` is an SVG | `og:image" content=".../og-image.svg"` in prerendered HTML. X, LinkedIn, Facebook and Slack do not rasterize SVG previews — link cards render blank. | 11 |
| 5 | Dark-theme flash for light-mode visitors | `src/index.html:2` hardcodes `data-theme="dark"`; prerendered HTML the same. `ThemeService.init()` only corrects it after bootstrap. `prefers-color-scheme` is never consulted. | 7 |
| 6 | Anchor scroll timer storm | `AnchorScrollService.scheduleScrollTo` queues the same scroll at rAF + 80/200/400 ms (or 100/250/450/700 ms cross-route); `scrollTo` self-retries up to 50 more times. Nothing is cancellable, so a second click or a manual scroll inside ~700 ms is yanked back. | 9 |
| 7 | Unthrottled non-passive scroll handler | `HeaderComponent` uses `@HostListener('window:scroll')`, firing change detection per scroll event, duplicating `SectionScrollService`'s own rAF-throttled listener. | 10 |
| 8 | Body scroll lock never released, no platform guard | `HeaderComponent` constructor `effect()` writes `document.body.style.overflow` with no `isPlatformBrowser` guard and no `DestroyRef` cleanup. | 10 |
| 9 | Soft 404s | `app.routes.ts:36` `path: '**'` redirects to `''`; `app.routes.server.ts` prerenders `**`. Every bad URL returns HTTP 200 with the homepage. | 11 |
| 10 | Contact fallback drops the visitor's email address | `openMailFallback(value: { name; company; message })` — `email` is not in the parameter type and never reaches the `mailto:` body, so a reply is impossible. Status is set to `'sent'` regardless of whether the mail client opened. | 12 |
| 11 | Tap never plucks a string | `BassStringsComponent.onPointerMove` requires a previous pointer sample to detect a crossing (`prev && (prev.y - sy) * (y - sy) < 0`). On touch, `pointerdown` is the first sample, so `prev` is `null` and a tap does nothing. | 14 |
| 12 | Light-theme contrast below WCAG AA | `--accent-from: #c95f02` on `--bg-primary: #faf8f3` = **3.87:1** (used as link/hover *text* colour). `--text-muted: #7c7970` on the same background = **4.10:1**. AA normal text needs 4.5:1. | 14 |

### Best practices not in use

| Finding | Task |
|---------|------|
| No ESLint, no lint script, no format script (Prettier is installed but never invoked) | 2, 6 |
| No CI — no `.github/` directory at all | 2 |
| One test file (`app.spec.ts`), asserting only `toBeTruthy()` | 2, and specs added in 7, 9, 12 |
| Path aliases declared in `tsconfig.app.json` instead of the root `tsconfig.json`, so sibling projects do not inherit them | 1 |
| `standalone: true` written on all 24 components — redundant since Angular 19 | 13 |
| Zoneless is implicit; `provideZonelessChangeDetection()` is not declared | 13 |
| `provideBrowserGlobalErrorListeners()` (recommended since v19) not registered | 13 |
| `NgZone.runOutsideAngular` in `bass-strings.component.ts:85` is dead code — a zoneless app injects `NoopNgZone` | 13 |
| `@angular/platform-browser-dynamic` is a dependency but is imported nowhere | 3 |
| No `engines` field, no `.nvmrc`; `@types/node` pinned to the v20 line while Node 22 is the runtime | 2, 3 |
| `ServicesComponent.getIcon()` is called from the template rather than precomputed | 13 |

### Out of scope — needs its own plan

`hreflang` / locale-prefixed URLs. The language switch mutates a signal but never changes the URL, so the Georgian translation of every page is unreachable and unindexable. Fixing this properly means locale-prefixed routes (`/ka/...`), prerendering both locales, and translated route `title`/`seo` data — a separate subsystem, and per the scope rule it belongs in its own plan rather than bolted onto this one. Task 11 adds `og:locale` only.

### Verified healthy — do not "fix" these

- i18n key parity is exact: 279 keys in both `en.json` and `ka.json`, zero missing on either side. The 45 identical values are proper nouns and technology names (`skills.core.angular`, `experience.syniotec.company`), which is correct.
- `@fontsource` CSS ships `unicode-range` per subset, so the Georgian woff2 files are not downloaded on English pages. The 41 kB styles bundle (4.54 kB gzipped) is component CSS, not fonts. Font loading needs no change.
- `DomSanitizer.bypassSecurityTrustHtml` in `services.component.ts` is fed only from `expertise.icons.ts`, a static in-repo source. Safe, and already commented as such.
- Production build passes today: 450.03 kB initial raw / 114.04 kB transfer, under the 500 kB budget warning.

---

## File Structure

**Created:**

| Path | Responsibility |
|------|----------------|
| `.nvmrc` | Pins the Node version for contributors and CI |
| `.github/workflows/ci.yml` | Runs format check, lint, test, build on push and PR |
| `eslint.config.js` | Flat ESLint config for TS + Angular templates |
| `scripts/build-og-image.mjs` | Rasterizes the OG SVG to a 1200×630 PNG |
| `src/app/core/services/theme.service.spec.ts` | Covers system-preference resolution and persistence |
| `src/app/core/services/anchor-scroll.service.spec.ts` | Covers cancellation of a superseded scroll request |
| `src/app/features/not-found/not-found.component.ts` | Real 404 page, `noindex`, served with HTTP 404 |
| `src/app/features/contact/contact.component.spec.ts` | Covers the mailto fallback payload |

**Modified:**

| Path | Change |
|------|--------|
| `tsconfig.json` | Gains `baseUrl` + `paths` (Task 1) |
| `tsconfig.app.json` | Loses `baseUrl` + `paths` (Task 1) |
| `package.json` | Scripts, `engines`, all dependency bumps, drop `platform-browser-dynamic` |
| `angular.json` | `lint` target (Task 6) |
| `src/index.html` | Anti-FOUC boot script, static OG tags |
| `src/app/app.config.ts` | `withIncrementalHydration()`, zoneless + error-listener providers |
| `src/app/app.routes.ts` | `**` → `NotFoundComponent` |
| `src/app/app.routes.server.ts` | 404 status for the wildcard route |
| `src/app/features/home/home.component.ts` | `@defer (hydrate on viewport)` |
| `src/app/core/services/theme.service.ts` | System-preference resolution |
| `src/app/core/services/anchor-scroll.service.ts` | Cancellable single-flight scroll |
| `src/app/core/services/seo.service.ts` | `og:url`, `og:locale`, image dimensions, PNG image |
| `src/app/layout/header/header.component.ts` | Passive rAF-throttled listeners, body-lock cleanup |
| `src/app/features/contact/contact.component.ts` | Email in the mailto fallback |
| `src/app/features/home/sections/hero/bass-strings.component.ts` | Tap-to-pluck, drop `NgZone` |
| `src/app/features/home/sections/services/services.component.ts` | Precomputed icons |
| `src/app/shared/components/theme-toggle/theme-toggle.component.ts` | SVG icons |
| `src/app/shared/components/project-card/project-card.component.ts` | Carousel keyboard + live region |
| `src/styles/_themes.scss` | `--accent-text` token, contrast fixes |
| `src/styles.scss` | `overflow-x: clip`, `.section--muted` |
| `public/sitemap.xml` | `lastmod` |
| All 24 component files | Drop `standalone: true` (Task 13) |

---

# Phase 0 — Restore the verification loop

### Task 1: Make the test suite compile

The suite is the safety net for every later task, and it does not currently build. Fix the alias resolution before touching anything else.

**Files:**
- Modify: `tsconfig.json:5-17` (add `baseUrl` and `paths` to `compilerOptions`)
- Modify: `tsconfig.app.json:5-15` (remove the now-inherited `baseUrl` and `paths`)

**Interfaces:**
- Consumes: nothing.
- Produces: working `npm test`. Every later task's verification step depends on it.

- [ ] **Step 1: Run the test suite and watch it fail**

```bash
npm test
```

Expected: FAIL with

```
✘ [ERROR] TS2307: Cannot find module '@layout/app-shell/app-shell.component' or its corresponding type declarations. [plugin angular-compiler]
```

- [ ] **Step 2: Move the aliases into the root tsconfig**

Replace the `compilerOptions` block in `tsconfig.json` with:

```jsonc
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "ES2022",
    "module": "preserve",
    "baseUrl": ".",
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@layout/*": ["src/app/layout/*"]
    }
  },
```

- [ ] **Step 3: Remove the duplicated aliases from the app tsconfig**

Replace the `compilerOptions` block in `tsconfig.app.json` with:

```jsonc
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": ["node"]
  },
```

- [ ] **Step 4: Run the test suite and watch it pass**

```bash
npm test
```

Expected: PASS — `Test Files 1 passed (1)`, `Tests 1 passed (1)`.

- [ ] **Step 5: Confirm the app build still resolves aliases**

```bash
npm run build
```

Expected: `Application bundle generation complete.` and `Prerendered 2 static routes.`

- [ ] **Step 6: Commit**

```bash
git add tsconfig.json tsconfig.app.json
git commit -m "fix: hoist path aliases to root tsconfig so specs compile"
```

---

### Task 2: Scripts, Node pin, and CI

Nothing enforces formatting, and no automation runs the build or the suite. Add all of it in one task — the CI workflow is the deliverable and the scripts are its setup.

**Files:**
- Create: `.nvmrc`
- Create: `.github/workflows/ci.yml`
- Modify: `package.json:3-10` (`scripts`), and add an `engines` field

**Interfaces:**
- Consumes: `npm test` from Task 1.
- Produces: `npm run format`, `npm run format:check`, `npm run test:ci`; a CI job named `verify`. Task 6 adds `npm run lint` to the same workflow.

- [ ] **Step 1: Pin the Node version**

Create `.nvmrc`:

```
22.22.3
```

This is the Angular 22 floor. The current machine is on `v22.13.1`; upgrade before Task 4 (`nvm install 22.22.3 && nvm use`).

- [ ] **Step 2: Add scripts and engines to package.json**

Replace the `scripts` block and add `engines` immediately after `"private": true`:

```jsonc
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "test:ci": "ng test --no-watch",
    "format": "prettier --write \"src/**/*.{ts,html,scss,json}\" \"*.{json,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,html,scss,json}\" \"*.{json,md}\"",
    "serve:ssr:portfolio": "node dist/portfolio/server/server.mjs"
  },
  "private": true,
  "engines": {
    "node": ">=22.22.3"
  },
```

- [ ] **Step 3: Normalize existing formatting in one pass**

```bash
npm run format
```

Expected: a list of rewritten files. This is a one-time reformat so `format:check` can be enforced from now on.

- [ ] **Step 4: Verify the format check is clean**

```bash
npm run format:check
```

Expected: `All matched files use Prettier code style!`

- [ ] **Step 5: Add the CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm

      - run: npm ci

      - name: Format check
        run: npm run format:check

      - name: Unit tests
        run: npm run test:ci

      - name: Production build
        run: npm run build

      - name: Translation key parity
        run: |
          node -e "
          const en = require('./src/assets/i18n/en.json');
          const ka = require('./src/assets/i18n/ka.json');
          const flat = (o, p = '') =>
            Object.entries(o).flatMap(([k, v]) =>
              v && typeof v === 'object' && !Array.isArray(v) ? flat(v, p + k + '.') : [p + k],
            );
          const E = flat(en).sort();
          const K = flat(ka).sort();
          const missingKa = E.filter((k) => !K.includes(k));
          const missingEn = K.filter((k) => !E.includes(k));
          if (missingKa.length || missingEn.length) {
            console.error('missing in ka:', missingKa);
            console.error('missing in en:', missingEn);
            process.exit(1);
          }
          console.log('i18n parity OK —', E.length, 'keys');
          "
```

- [ ] **Step 6: Run every CI step locally**

```bash
npm run format:check && npm run test:ci && npm run build
```

Expected: format clean, `Tests 1 passed (1)`, `Application bundle generation complete.`

- [ ] **Step 7: Commit**

```bash
git add .nvmrc .github/workflows/ci.yml package.json src
git commit -m "chore: add format/test scripts, node pin, and CI workflow"
```

---

# Phase 1 — Dependencies

### Task 3: Non-Angular dependency refresh

Do the low-risk bumps first so the Angular major in Task 4 lands on an otherwise-current tree, and drop the dependency nothing imports.

**Files:**
- Modify: `package.json` (`dependencies` and `devDependencies`)
- Modify: `package-lock.json` (regenerated by npm)

**Interfaces:**
- Consumes: `npm run test:ci` and `npm run build` from Task 2.
- Produces: a tree where the only remaining outdated packages are the Angular family and `@ngx-translate/*`.

- [ ] **Step 1: Confirm `@angular/platform-browser-dynamic` is genuinely unused**

```bash
grep -rn "platform-browser-dynamic" src/
```

Expected: no output. The app bootstraps via `bootstrapApplication` in `src/main.ts:1`, which needs only `@angular/platform-browser`.

- [ ] **Step 2: Remove it**

```bash
npm uninstall @angular/platform-browser-dynamic
```

- [ ] **Step 3: Bump the non-Angular packages**

```bash
npm install rxjs@~7.8.2 express@^5.2.1 @fontsource/inter@^5.3.0 @fontsource/jetbrains-mono@^5.3.0 @fontsource/noto-sans-georgian@^5.3.0 @fontsource/space-grotesk@^5.3.0
```

```bash
npm install -D @types/node@^22.20.1 prettier@^3.9.6 vitest@^4.1.10 jsdom@^30.0.1
```

`@types/node` stays on the **22** line to match the pinned Node runtime — do not jump to 26.

- [ ] **Step 4: Verify nothing regressed**

```bash
npm run test:ci && npm run build
```

Expected: `Tests 1 passed (1)` and `Application bundle generation complete.`

- [ ] **Step 5: Confirm only the Angular family is left outdated**

```bash
npm outdated
```

Expected: rows only for `@angular/*`, `@ngx-translate/*`, and `typescript`.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): refresh non-Angular dependencies, drop unused platform-browser-dynamic"
```

---

### Task 4: Angular 21 → 22 and TypeScript 6

The framework major. `ng update` rewrites source where APIs moved, so review its diff rather than assuming it is a no-op.

**Files:**
- Modify: `package.json`, `package-lock.json`
- Modify: whatever `ng update` migrations touch under `src/` and `angular.json`

**Interfaces:**
- Consumes: Node `>= 22.22.3` from Task 2's `.nvmrc`.
- Produces: Angular 22 APIs — specifically `withIncrementalHydration` from `@angular/platform-browser`, required by Task 8.

- [ ] **Step 1: Verify the Node runtime clears the floor**

```bash
node -v
```

Expected: `v22.22.3` or newer. If it prints `v22.13.1`, stop and run `nvm install 22.22.3 && nvm use` first — Angular 22's `engines` field is `^22.22.3 || ^24.15.0 || >=26.0.0` and the install will fail otherwise.

- [ ] **Step 2: Confirm the tree is clean so the migration diff is readable**

```bash
git status --porcelain
```

Expected: no output.

- [ ] **Step 3: Run the CLI update**

```bash
npx ng update @angular/core@22 @angular/cli@22
```

Expected: package bumps to `22.1.x`, TypeScript moved into the `>=6.0 <6.1` range, and a list of applied migrations.

- [ ] **Step 4: Update the remaining Angular packages the CLI does not own**

```bash
npm install @angular/ssr@^22.1.4 @angular/animations@^22.1.2 @angular/forms@^22.1.2 @angular/platform-server@^22.1.2
```

- [ ] **Step 5: Pin TypeScript inside the supported range**

```bash
npm install -D typescript@~6.0.3
```

TypeScript 7.0.2 is `latest` on npm but `@angular/compiler-cli@22` declares `"typescript": ">=6.0 <6.1"`. Installing 7 breaks the compiler.

- [ ] **Step 6: Verify the versions actually landed**

```bash
npm ls @angular/core @angular/cli @angular/build @angular/ssr typescript --depth=0
```

Expected: `@angular/core@22.1.x`, `@angular/cli@22.1.x`, `@angular/build@22.1.x`, `@angular/ssr@22.1.x`, `typescript@6.0.x`.

- [ ] **Step 7: Read the migration diff**

```bash
git diff --stat
```

Review every changed file under `src/`. Migrations may rewrite imports or provider calls; confirm each change is intentional before continuing.

- [ ] **Step 8: Verify build, prerender, and tests**

```bash
npm run test:ci && npm run build
```

Expected: `Tests 1 passed (1)`, `Application bundle generation complete.`, `Prerendered 2 static routes.`

- [ ] **Step 9: Confirm zone.js did not sneak back in**

```bash
grep -c "zone.js" package.json; grep -rl "Zone.__load_patch" dist/portfolio/browser/ | head
```

Expected: `0`, and no files listed. The app must stay zoneless.

- [ ] **Step 10: Commit**

```bash
npm run format
git add -A
git commit -m "chore(deps): upgrade to Angular 22 and TypeScript 6"
```

---

### Task 5: ngx-translate 17 → 18

**Files:**
- Modify: `package.json`, `package-lock.json`
- Modify: `src/app/app.config.ts:27-32` and `src/app/app.spec.ts:18-24` only if the v18 provider signature changed

**Interfaces:**
- Consumes: Angular 22 from Task 4 (`@ngx-translate/core@18` peer is `@angular/core >=18`).
- Produces: unchanged public surface — `provideTranslateService`, `provideTranslateHttpLoader`, `TranslateService`, `TranslateModule`, and the `| translate` pipe all keep their current names.

- [ ] **Step 1: Install v18**

```bash
npm install @ngx-translate/core@^18.0.0 @ngx-translate/http-loader@^18.0.0
```

- [ ] **Step 2: Compile and see whether the API moved**

```bash
npm run build
```

If it fails, the failure will name the changed symbol. The two call sites are `src/app/app.config.ts:27-32` and `src/app/app.spec.ts:18-24`; both pass the same shape:

```ts
provideTranslateService({
  loader: provideTranslateHttpLoader({
    prefix: './assets/i18n/',
    suffix: '.json',
  }),
}),
```

Adjust both identically if v18 renamed anything. Expected on a clean upgrade: `Application bundle generation complete.`

- [ ] **Step 3: Verify translations still resolve at runtime**

```bash
grep -o "Senior Frontend Engineer" dist/portfolio/browser/index.html | head -1
```

Expected: one match — the prerendered English copy rendered through the translate pipe.

- [ ] **Step 4: Run the suite**

```bash
npm run test:ci
```

Expected: `Tests 1 passed (1)`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src
git commit -m "chore(deps): upgrade ngx-translate to v18"
```

---

### Task 6: ESLint

`angular-eslint@22` requires `@angular/cli >= 22.0.0`, which is why this lands after Task 4 rather than in Phase 0.

**Files:**
- Create: `eslint.config.js`
- Modify: `package.json` (add `lint` script)
- Modify: `angular.json` (add the `lint` architect target)
- Modify: `.github/workflows/ci.yml` (add the lint step)
- Modify: source files that violate the enabled rules

**Interfaces:**
- Consumes: Angular 22 CLI from Task 4.
- Produces: `npm run lint`, enforced in CI.

- [ ] **Step 1: Add ESLint via the schematic**

```bash
npx ng add angular-eslint@22 --skip-confirmation
```

This installs `angular-eslint`, `eslint`, and `typescript-eslint`, writes a starter `eslint.config.js`, and adds the `lint` target to `angular.json`.

- [ ] **Step 2: Replace the generated config with the project's conventions**

Overwrite `eslint.config.js`:

```js
// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
```

`prefer-on-push-component-change-detection` and the accessibility set are the two that earn their keep here: the first locks in the OnPush convention, the second catches the label/aria regressions Task 14 is about to fix.

- [ ] **Step 3: Add the lint script**

In `package.json`, add after `"test:ci"`:

```jsonc
    "lint": "ng lint",
```

- [ ] **Step 4: Run the linter and read the violations**

```bash
npm run lint
```

Expected: a list of errors. Do not silence rules to make them go away — fix the code. The likely categories are missing explicit return types on a few methods and template accessibility warnings on the project-card carousel buttons (Task 14 covers those properly; if lint blocks here, fix them now and shorten Task 14 accordingly).

- [ ] **Step 5: Fix every violation, then re-run**

```bash
npm run lint
```

Expected: `All files pass linting.`

- [ ] **Step 6: Add lint to CI**

In `.github/workflows/ci.yml`, insert between the "Format check" and "Unit tests" steps:

```yaml
      - name: Lint
        run: npm run lint
```

- [ ] **Step 7: Full verification**

```bash
npm run format:check && npm run lint && npm run test:ci && npm run build
```

Expected: all four clean.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: add angular-eslint with OnPush and a11y rules, wire into CI"
```

---

# Phase 2 — Correctness

### Task 7: Kill the theme flash and respect the OS preference

`src/index.html:2` hardcodes `data-theme="dark"` and the prerendered HTML inherits it, so a visitor whose stored preference is `light` sees a dark flash on every load, and a first-time visitor on a light-mode OS is forced into dark. Fix it with a blocking boot script — the only thing that runs before first paint — and teach `ThemeService` to follow the OS while no explicit choice exists.

**Files:**
- Modify: `src/index.html:2-21`
- Modify: `src/app/core/services/theme.service.ts` (whole file)
- Create: `src/app/core/services/theme.service.spec.ts`

**Interfaces:**
- Consumes: `readStoredValue` / `writeStoredValue` from `@core/utils/storage.util`, unchanged.
- Produces: `ThemeService.theme: Signal<Theme>` (unchanged name and type — `ThemeToggleComponent` keeps working), plus `ThemeService.init()`, `setTheme(theme: Theme)`, `toggleTheme()`. `Theme` stays `'dark' | 'light'` from `@core/models/app.types`.

- [ ] **Step 1: Write the failing spec**

Create `src/app/core/services/theme.service.spec.ts`:

```ts
import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

function mockMatchMedia(lightPreferred: boolean): void {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('light') ? lightPreferred : !lightPreferred,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
  });

  it('falls back to the OS preference when nothing is stored', () => {
    mockMatchMedia(true);

    const service = TestBed.inject(ThemeService);
    service.init();

    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('prefers a stored choice over the OS preference', () => {
    localStorage.setItem('portfolio-theme', 'dark');
    mockMatchMedia(true);

    const service = TestBed.inject(ThemeService);
    service.init();

    expect(service.theme()).toBe('dark');
  });

  it('persists an explicit choice', () => {
    mockMatchMedia(true);

    const service = TestBed.inject(ThemeService);
    service.init();
    service.setTheme('dark');

    expect(localStorage.getItem('portfolio-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
```

- [ ] **Step 2: Run it and watch the first case fail**

```bash
npm test
```

Expected: FAIL — `expected 'dark' to be 'light'`. The current `init()` hardcodes `'dark'` as the fallback and never reads `matchMedia`.

- [ ] **Step 3: Teach the service about the OS preference**

Replace `src/app/core/services/theme.service.ts` entirely:

```ts
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

import { Theme } from '@core/models/app.types';
import { readStoredValue, writeStoredValue } from '@core/utils/storage.util';

const STORAGE_KEY = 'portfolio-theme';
const VALID_THEMES = ['dark', 'light'] as const;
const LIGHT_QUERY = '(prefers-color-scheme: light)';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly theme = signal<Theme>('dark');

  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.applyTheme('dark');
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    const hasExplicitChoice = stored === 'dark' || stored === 'light';

    const resolved: Theme = hasExplicitChoice
      ? readStoredValue(STORAGE_KEY, VALID_THEMES, 'dark', this.platformId)
      : this.systemTheme();

    this.theme.set(resolved);
    this.applyTheme(resolved);

    // Keep following the OS until the visitor makes a choice of their own.
    if (!hasExplicitChoice) {
      this.document.defaultView
        ?.matchMedia(LIGHT_QUERY)
        .addEventListener('change', (event) => {
          if (localStorage.getItem(STORAGE_KEY)) {
            return;
          }
          const next: Theme = event.matches ? 'light' : 'dark';
          this.theme.set(next);
          this.applyTheme(next);
        });
    }
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.applyTheme(theme);
    writeStoredValue(STORAGE_KEY, theme, this.platformId);
  }

  private systemTheme(): Theme {
    return this.document.defaultView?.matchMedia(LIGHT_QUERY).matches ? 'light' : 'dark';
  }

  private applyTheme(theme: Theme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}
```

- [ ] **Step 4: Run the spec and watch it pass**

```bash
npm test
```

Expected: PASS — `Tests 4 passed (4)` (the original app spec plus three theme specs).

- [ ] **Step 5: Add the anti-FOUC boot script**

The service still runs after bootstrap, which is too late for first paint. Add a blocking script in `src/index.html`, immediately after the `<base>` tag and **before** any stylesheet:

```html
    <base href="/" />
    <script>
      (function () {
        try {
          var stored = localStorage.getItem('portfolio-theme');
          var theme =
            stored === 'dark' || stored === 'light'
              ? stored
              : window.matchMedia('(prefers-color-scheme: light)').matches
                ? 'light'
                : 'dark';
          document.documentElement.setAttribute('data-theme', theme);
        } catch (e) {
          /* private mode or storage disabled — the dark default in the markup stands */
        }
      })();
    </script>
```

`data-theme` on `<html>` is not part of Angular's hydrated DOM, so rewriting it before bootstrap causes no hydration mismatch.

- [ ] **Step 6: Confirm the script survives into the prerendered output**

```bash
npm run build && grep -c "prefers-color-scheme: light" dist/portfolio/browser/index.html
```

Expected: `1`.

- [ ] **Step 7: Commit**

```bash
npm run format && npm run lint
git add src/index.html src/app/core/services/theme.service.ts src/app/core/services/theme.service.spec.ts
git commit -m "fix: resolve theme before first paint and honour prefers-color-scheme"
```

---

### Task 8: Server-render the deferred sections

`@defer (on idle)` emits only the placeholder during SSR. The prerendered `index.html` contains zero occurrences of `id="work"` and no statistics markup, so the portfolio's most important section is invisible to crawlers and the `#work` anchor has nothing to scroll to on first paint. Incremental hydration server-renders the real content and defers only the JavaScript.

**Files:**
- Modify: `src/app/app.config.ts:4` and `:25`
- Modify: `src/app/features/home/home.component.ts:38-47`

**Interfaces:**
- Consumes: `withIncrementalHydration` from `@angular/platform-browser` (Angular 22, Task 4).
- Produces: prerendered HTML containing `id="work"` and `id="statistics"`. Task 9's scroll rewrite assumes anchor targets exist in the initial document.

- [ ] **Step 1: Record the current, broken state**

```bash
grep -c 'id="work"' dist/portfolio/browser/index.html; grep -c 'defer-placeholder' dist/portfolio/browser/index.html
```

Expected: `0` then `2` — the work section is missing and two placeholders stand in its place.

- [ ] **Step 2: Enable incremental hydration**

In `src/app/app.config.ts`, change the import on line 4:

```ts
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
```

and the provider on line 25:

```ts
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
```

- [ ] **Step 3: Convert the defer blocks to hydrate triggers**

In `src/app/features/home/home.component.ts`, replace lines 38-47 with:

```html
    @defer (hydrate on viewport) {
      <app-projects />
    } @placeholder {
      <div class="defer-placeholder" aria-hidden="true"></div>
    }
    @defer (hydrate on viewport) {
      <app-statistics />
    } @placeholder {
      <div class="defer-placeholder" aria-hidden="true"></div>
    }
```

A `hydrate` trigger tells Angular to render the block's real content on the server and postpone only the client-side JavaScript until the block scrolls into view. The `@placeholder` stays — it is still used for client-side navigations, where there is no server-rendered content to hydrate.

- [ ] **Step 4: Rebuild and verify the sections are now in the HTML**

```bash
npm run build && grep -c 'id="work"' dist/portfolio/browser/index.html && grep -c 'id="statistics"' dist/portfolio/browser/index.html
```

Expected: `1` and `1`.

- [ ] **Step 5: Verify the project copy is crawlable, not just the wrapper**

```bash
grep -o "projects__grid" dist/portfolio/browser/index.html | head -1
```

Expected: one match — the grid and its cards are in the served HTML.

- [ ] **Step 6: Run the suite**

```bash
npm run test:ci
```

Expected: `Tests 4 passed (4)`.

- [ ] **Step 7: Commit**

```bash
npm run format && npm run lint
git add src/app/app.config.ts src/app/features/home/home.component.ts
git commit -m "fix: server-render deferred work and stats sections via incremental hydration"
```

---

### Task 9: Single-flight, cancellable anchor scrolling

`scheduleScrollTo` currently fires the same scroll from a rAF callback plus three or four `setTimeout`s, and `scrollTo` retries itself up to 50 times at 50 ms intervals. None of it is cancellable, so a second nav click or a manual scroll inside the next ~700 ms gets dragged back. With Task 8 landed, the anchor targets exist in the initial document and none of that machinery is needed.

**Files:**
- Modify: `src/app/core/services/anchor-scroll.service.ts:72-97` (replace `scheduleScrollTo` and `scrollTo`), `:23-40` (constructor), `:42-70` (`goTo`)
- Create: `src/app/core/services/anchor-scroll.service.spec.ts`

**Interfaces:**
- Consumes: `SectionScrollService.setActive(navId: string)` and `NAV_ITEMS` — both unchanged.
- Produces: `AnchorScrollService.goTo(route: string, fragment: string): void` — same signature as today, so `AnchorLinkDirective` needs no change.

- [ ] **Step 1: Write the failing spec**

Create `src/app/core/services/anchor-scroll.service.spec.ts`:

```ts
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AnchorScrollService } from './anchor-scroll.service';

describe('AnchorScrollService', () => {
  let scrollCalls: number;

  beforeEach(() => {
    scrollCalls = 0;
    window.scrollTo = (() => {
      scrollCalls += 1;
    }) as unknown as typeof window.scrollTo;

    document.body.innerHTML = `
      <div id="services" style="height:2000px"></div>
      <div id="about" style="height:2000px"></div>
    `;

    // A catch-all route so `router.navigate(['/'])` resolves instead of erroring —
    // `scheduleScrollTo` only runs from the navigation's `.then`.
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', children: [] }])],
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('scrolls once per request', async () => {
    const service = TestBed.inject(AnchorScrollService);

    service.goTo('/', 'services');
    await new Promise((resolve) => setTimeout(resolve, 800));

    expect(scrollCalls).toBe(1);
  });

  it('supersedes a pending request instead of stacking scrolls', async () => {
    const service = TestBed.inject(AnchorScrollService);

    service.goTo('/', 'services');
    service.goTo('/', 'about');
    await new Promise((resolve) => setTimeout(resolve, 800));

    expect(scrollCalls).toBe(1);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npm test
```

Expected: FAIL on both cases — `expected 4 to be 1` (or similar), because each `goTo` queues a rAF plus three timeouts.

- [ ] **Step 3: Replace the scheduling with a cancellable single-flight**

In `src/app/core/services/anchor-scroll.service.ts`, delete the `scheduleScrollTo` and `scrollTo` methods (lines 72-97) and add these in their place:

```ts
  /** Cancels the in-flight request, if any, then starts a new one. */
  private scheduleScrollTo(fragment: string): void {
    this.pending?.();
    this.pending = null;

    const deadline = performance.now() + SCROLL_WAIT_MS;
    let rafId = 0;
    let cancelled = false;

    const abortEvents = ['wheel', 'touchstart', 'keydown'] as const;

    const cancel = (): void => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      for (const type of abortEvents) {
        window.removeEventListener(type, cancel);
      }
      this.pending = null;
    };

    const attempt = (): void => {
      if (cancelled) {
        return;
      }

      const el = this.document.getElementById(fragment);
      if (el) {
        for (const type of abortEvents) {
          window.removeEventListener(type, cancel);
        }
        this.pending = null;
        this.scrollElementIntoView(el);
        return;
      }

      if (performance.now() >= deadline) {
        cancel();
        return;
      }

      rafId = requestAnimationFrame(attempt);
    };

    // A visitor who scrolls or types while we are still waiting has taken over.
    for (const type of abortEvents) {
      window.addEventListener(type, cancel, { passive: true, once: true });
    }

    this.pending = cancel;
    rafId = requestAnimationFrame(attempt);
  }
```

Add the field next to the other private members (after line 21):

```ts
  private pending: (() => void) | null = null;
```

and the constant next to the imports:

```ts
/** How long to wait for a lazily-rendered anchor target before giving up. */
const SCROLL_WAIT_MS = 2000;
```

- [ ] **Step 4: Drop the now-meaningless `crossRoute` argument**

Both call sites passed a flag that only chose between two timer schedules; there are no timers left. In the constructor, change line 37:

```ts
          this.scheduleScrollTo(fragment);
```

In `goTo`, change the `afterNavigate` closure (lines 58-60) to:

```ts
    const afterNavigate = (): void => {
      this.scheduleScrollTo(fragment);
    };
```

Then remove `afterNextRender` and `Injector` from the imports and delete the `injector` field — nothing uses them now.

- [ ] **Step 5: Run the spec and watch it pass**

```bash
npm test
```

Expected: PASS — `Tests 6 passed (6)`.

- [ ] **Step 6: Verify the anchors work in the real app**

```bash
npm run build && npm run serve:ssr:portfolio
```

Open `http://localhost:4000`, click each nav pill (Services, Work, About, Experience, Skills) and the hero's "View work" button. Each must scroll once, land with the section heading clear of the header, and not snap back. Then load `http://localhost:4000/#skills` directly and confirm it lands on Skills. Stop the server with `Ctrl+C`.

- [ ] **Step 7: Commit**

```bash
npm run format && npm run lint
git add src/app/core/services/anchor-scroll.service.ts src/app/core/services/anchor-scroll.service.spec.ts
git commit -m "fix: make anchor scrolling single-flight and cancellable"
```

---

### Task 10: Header listeners and body scroll lock

`@HostListener('window:scroll')` runs change detection on every scroll event with no throttle, duplicating work `SectionScrollService` already does behind a rAF gate. The body-lock `effect()` writes `document.body.style.overflow` with no platform guard and never restores it on destroy.

**Files:**
- Modify: `src/app/layout/header/header.component.ts:1-9` (imports), `:266-297` (class body)

**Interfaces:**
- Consumes: nothing new.
- Produces: `HeaderComponent` with the same template and protected `scrolled` / `menuOpen` signals. Purely internal.

- [ ] **Step 1: Replace the imports**

```ts
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  PLATFORM_ID,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
```

- [ ] **Step 2: Replace the class body**

Replace everything from `export class HeaderComponent {` to the closing brace with:

```ts
export class HeaderComponent {
  protected readonly navItems = NAV_ITEMS;
  protected readonly firstName = personFirstName(PERSON.name);

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);

  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private ticking = false;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Lock page scroll behind the open mobile menu, and always release it.
    effect(() => {
      this.document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
    });
    this.destroyRef.onDestroy(() => {
      this.document.body.style.overflow = '';
    });

    const onScroll = (): void => {
      if (this.ticking) {
        return;
      }
      this.ticking = true;
      requestAnimationFrame(() => {
        this.scrolled.set(window.scrollY > 20);
        this.ticking = false;
      });
    };

    const onResize = (): void => {
      if (this.menuOpen() && window.innerWidth >= 1024) {
        this.closeMenu();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    });

    onScroll();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
```

The Escape handler stays a `@HostListener` — it fires once per keypress, so there is nothing to throttle. The scroll and resize handlers become passive listeners registered outside Angular's host-binding machinery, rAF-gated exactly like `SectionScrollService`. `onScroll()` is called once at the end so a page restored mid-scroll gets the right header state immediately.

- [ ] **Step 3: Verify build and tests**

```bash
npm run test:ci && npm run build
```

Expected: `Tests 6 passed (6)` and a clean build.

- [ ] **Step 4: Verify the behaviour in the browser**

```bash
npm run serve:ssr:portfolio
```

At `http://localhost:4000`: scroll down and confirm the header gains its scrolled background; narrow the window below 1024 px, open the mobile menu, confirm the page behind it cannot scroll; close it and confirm scrolling is restored; reopen it and widen past 1024 px and confirm it auto-closes with scrolling restored. Stop with `Ctrl+C`.

- [ ] **Step 5: Commit**

```bash
npm run format && npm run lint
git add src/app/layout/header/header.component.ts
git commit -m "perf: throttle header scroll listener and release the body scroll lock"
```

---

### Task 11: SEO — raster OG image, real 404, complete metadata

Four defects in one surface: the OG image is an SVG that no social crawler will render, `og:url` is missing entirely, every unknown URL returns HTTP 200 with the homepage, and the sitemap has no `lastmod`.

**Files:**
- Create: `scripts/build-og-image.mjs`
- Create: `src/app/features/not-found/not-found.component.ts`
- Modify: `package.json` (add `sharp` devDependency and the `og:image` script)
- Modify: `src/app/core/services/seo.service.ts:9-40`
- Modify: `src/index.html` (static OG tags)
- Modify: `src/app/app.routes.ts:35-38`
- Modify: `src/app/app.routes.server.ts`
- Modify: `public/sitemap.xml`

**Interfaces:**
- Consumes: `SeoConfig { title, description, path? }` from `@core/services/seo.service` — extended below with an optional `noindex`.
- Produces: `SeoConfig` gains `noindex?: boolean`; `NotFoundComponent` is exported from `@features/not-found/not-found.component`. `RouteSeoConfig` in `seo-route.listener.ts` extends `SeoConfig`, so it picks up `noindex` automatically.

- [ ] **Step 1: Add the rasterizer**

```bash
npm install -D sharp
```

Create `scripts/build-og-image.mjs`:

```js
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'src/assets/images/og-image.svg');
const target = join(root, 'public/og-image.png');

await mkdir(dirname(target), { recursive: true });

await sharp(source, { density: 200 })
  .resize(1200, 630, { fit: 'cover' })
  .png({ compressionLevel: 9 })
  .toFile(target);

console.log(`Wrote ${target} (1200x630)`);
```

Add to `package.json` scripts, after `"lint"`:

```jsonc
    "og:image": "node scripts/build-og-image.mjs",
```

- [ ] **Step 2: Generate the PNG and check its dimensions**

```bash
npm run og:image && node -e "import('sharp').then(async ({default: s}) => console.log(await s('public/og-image.png').metadata()))"
```

Expected: `Wrote .../public/og-image.png (1200x630)` and metadata reporting `width: 1200, height: 630, format: 'png'`. 1200×630 is the size X, LinkedIn, Facebook and Slack all accept for a large summary card.

- [ ] **Step 3: Point the SEO service at the PNG and complete the tag set**

In `src/app/core/services/seo.service.ts`, replace the `SeoConfig` interface and the `defaultImage` field and `update` method (lines 9-40) with:

```ts
export interface SeoConfig {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
}
```

```ts
  private readonly baseUrl = 'https://mikheilmamniashvili.dev';
  private readonly defaultImage = `${this.baseUrl}/og-image.png`;

  update(config: SeoConfig): void {
    const fullTitle = `${config.title} | ${PERSON.name}`;
    const url = config.path ? `${this.baseUrl}${config.path}` : this.baseUrl;

    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:site_name', content: PERSON.name });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });
    this.meta.updateTag({ property: 'og:image', content: this.defaultImage });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({
      property: 'og:image:alt',
      content: `${PERSON.name} — ${PERSON.title}`,
    });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: this.defaultImage });

    if (config.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
    } else {
      this.meta.removeTag("name='robots'");
    }

    if (config.path) {
      this.updateCanonical(url);
    }
  }
```

- [ ] **Step 4: Add static OG tags to index.html**

In `src/index.html`, replace the `og:type` line and add the missing tags so a crawler that does not execute JavaScript still sees a complete card:

```html
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://mikheilmamniashvili.dev/" />
    <meta property="og:site_name" content="Mikheil Mamniashvili" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image" content="https://mikheilmamniashvili.dev/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="https://mikheilmamniashvili.dev/og-image.png" />
```

- [ ] **Step 5: Build the 404 page**

Create `src/app/features/not-found/not-found.component.ts`:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="not-found section" aria-labelledby="not-found-heading">
      <div class="container not-found__inner">
        <p class="not-found__code mono-label">404</p>
        <h1 id="not-found-heading" class="not-found__title">
          {{ 'notFound.title' | translate }}
        </h1>
        <p class="not-found__body">{{ 'notFound.body' | translate }}</p>
        <a routerLink="/" class="not-found__cta">{{ 'notFound.cta' | translate }}</a>
      </div>
    </section>
  `,
  styles: `
    @use 'styles/mixins';

    .not-found__inner {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
      max-width: 640px;
      min-height: 50vh;
      justify-content: center;
    }

    .not-found__code {
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      letter-spacing: 0.08em;
      color: var(--text-muted);
    }

    .not-found__title {
      font-family: var(--font-display);
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      letter-spacing: -0.02em;
    }

    .not-found__body {
      color: var(--text-secondary);
      line-height: 1.7;
    }

    .not-found__cta {
      @include mixins.button-primary;
      margin-top: 0.5rem;
    }
  `,
})
export class NotFoundComponent {}
```

- [ ] **Step 6: Add the translation keys to both locales**

In `src/assets/i18n/en.json`, add a top-level `notFound` object:

```json
  "notFound": {
    "title": "This page doesn't exist",
    "body": "The link may be out of date, or the page may have moved. Head back to the homepage to find what you're after.",
    "cta": "Back to homepage"
  },
```

In `src/assets/i18n/ka.json`, add the same keys:

```json
  "notFound": {
    "title": "ეს გვერდი არ არსებობს",
    "body": "ბმული შესაძლოა მოძველებული იყოს, ან გვერდი გადატანილია. დაბრუნდით მთავარ გვერდზე.",
    "cta": "მთავარ გვერდზე დაბრუნება"
  },
```

Both files must end up with 282 keys.

- [ ] **Step 7: Route the wildcard to the 404 page**

In `src/app/app.routes.ts`, replace lines 35-38:

```ts
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Page not found — Mikheil Mamniashvili',
    data: {
      seo: {
        title: 'Page not found',
        description: 'This page does not exist. Head back to the homepage.',
        noindex: true,
      },
    },
  },
```

and add the import at the top:

```ts
import { NotFoundComponent } from '@features/not-found/not-found.component';
```

- [ ] **Step 8: Return a real 404 status from the server**

Replace `src/app/app.routes.server.ts` entirely:

```ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'contact',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
    status: 404,
    headers: {
      'X-Robots-Tag': 'noindex',
    },
  },
];
```

`RenderMode.Server` rather than `Prerender`, because a prerendered wildcard cannot carry a per-response status code.

- [ ] **Step 9: Add lastmod to the sitemap**

Replace `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mikheilmamniashvili.dev/</loc>
    <lastmod>2026-08-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mikheilmamniashvili.dev/contact</loc>
    <lastmod>2026-08-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

- [ ] **Step 10: Build and verify the metadata**

```bash
npm run build
grep -o 'og:image" content="[^"]*"' dist/portfolio/browser/index.html
grep -o 'og:url" content="[^"]*"' dist/portfolio/browser/index.html
ls -la dist/portfolio/browser/og-image.png
```

Expected: the image URL ends in `.png` (not `.svg`), `og:url` is `https://mikheilmamniashvili.dev/`, and the PNG is present in the build output.

- [ ] **Step 11: Verify the 404 status over HTTP**

```bash
npm run serve:ssr:portfolio
```

In a second shell:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4000/does-not-exist
```

Expected: `404`. Then confirm the page itself renders:

```bash
curl -s http://localhost:4000/does-not-exist | grep -c "not-found__title"
```

Expected: `1`. Stop the server with `Ctrl+C`.

- [ ] **Step 12: Run the full check and commit**

```bash
npm run format && npm run lint && npm run test:ci
git add -A
git commit -m "fix(seo): raster og image, og:url, real 404 status, sitemap lastmod"
```

---

### Task 12: Contact fallback must carry the visitor's email

`openMailFallback`'s parameter type is `{ name; company; message }` — `email` is absent, so the one piece of information needed to reply is dropped from the `mailto:` body. Status is then set to `'sent'` whether or not a mail client exists.

**Files:**
- Modify: `src/app/features/contact/contact.component.ts:389-427`
- Create: `src/app/features/contact/contact.component.spec.ts`

**Interfaces:**
- Consumes: `CONTACT_FORM` from `@core/config/contact.config` (`{ endpoint: string; accessKey: string }`), `PERSON` from `@core/config/person.config`.
- Produces: `ContactComponent.buildMailtoUrl(value): string` — extracted so it is testable without navigating the test runner away from the page.

- [ ] **Step 1: Write the failing spec**

Create `src/app/features/contact/contact.component.spec.ts`:

```ts
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService({
          loader: provideTranslateHttpLoader({
            prefix: './assets/i18n/',
            suffix: '.json',
          }),
        }),
      ],
    }).compileComponents();
  });

  it('includes the sender email in the mailto fallback', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const url = fixture.componentInstance.buildMailtoUrl({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      company: 'Analytical Engines',
      message: 'I need an Angular rescue.',
    });

    expect(decodeURIComponent(url)).toContain('ada@example.com');
    expect(decodeURIComponent(url)).toContain('Ada Lovelace');
    expect(decodeURIComponent(url)).toContain('Analytical Engines');
    expect(decodeURIComponent(url)).toContain('I need an Angular rescue.');
  });

  it('omits the company line when no company was given', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const url = fixture.componentInstance.buildMailtoUrl({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      company: '',
      message: 'Hello.',
    });

    expect(decodeURIComponent(url)).not.toContain('Company:');
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npm test
```

Expected: FAIL — `buildMailtoUrl is not a function`.

- [ ] **Step 3: Extract and fix the fallback**

In `src/app/features/contact/contact.component.ts`, replace the `submit` method and `openMailFallback` (lines 389-427) with:

```ts
  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    if (value.botcheck) {
      return;
    }

    if (!CONTACT_FORM.accessKey) {
      window.location.href = this.buildMailtoUrl(value);
      this.status.set('sent');
      return;
    }

    this.status.set('sending');
    this.http
      .post(CONTACT_FORM.endpoint, {
        access_key: CONTACT_FORM.accessKey,
        subject: `Portfolio inquiry from ${value.name}`,
        name: value.name,
        email: value.email,
        company: value.company || undefined,
        message: value.message,
      })
      .subscribe({
        next: () => this.status.set('sent'),
        error: () => this.status.set('error'),
      });
  }

  /**
   * No delivery key configured yet — hand off to the visitor's mail client.
   * The sender's own address goes in the body so a reply is possible even
   * though `mailto:` gives us no way to set a Reply-To header.
   */
  buildMailtoUrl(value: {
    name: string;
    email: string;
    company: string;
    message: string;
  }): string {
    const subject = encodeURIComponent(`Project inquiry — ${value.name}`);
    const company = value.company ? `\nCompany: ${value.company}` : '';
    const body = encodeURIComponent(
      `${value.message}\n\n— ${value.name}\nEmail: ${value.email}${company}`,
    );
    return `mailto:${PERSON.email}?subject=${subject}&body=${body}`;
  }
```

- [ ] **Step 4: Run the spec and watch it pass**

```bash
npm test
```

Expected: PASS — `Tests 8 passed (8)`.

- [ ] **Step 5: Flag the unconfigured key so it is not forgotten**

`CONTACT_FORM.accessKey` is still `''`, so every submission takes the fallback path. Add a console warning in development so this is visible rather than silent. In `src/app/core/config/contact.config.ts`, append after the export:

```ts
/**
 * True while no delivery key is configured — every submission falls back to
 * the visitor's mail client. Set `accessKey` and this flips to false.
 */
export const CONTACT_FORM_IS_FALLBACK = !CONTACT_FORM.accessKey;
```

Then in `ContactComponent`, add to the constructor area (after the `form` field):

```ts
  constructor() {
    if (CONTACT_FORM_IS_FALLBACK && isDevMode()) {
      console.warn(
        '[contact] No Web3Forms access key configured — submissions open the visitor’s mail client instead of being delivered. See src/app/core/config/contact.config.ts.',
      );
    }
  }
```

adding `isDevMode` to the `@angular/core` import and `CONTACT_FORM_IS_FALLBACK` to the `@core/config/contact.config` import.

- [ ] **Step 6: Verify and commit**

```bash
npm run format && npm run lint && npm run test:ci && npm run build
git add src/app/features/contact src/app/core/config/contact.config.ts
git commit -m "fix(contact): carry the sender email into the mailto fallback"
```

---

# Phase 3 — Hygiene and design

### Task 13: Modern Angular hygiene

Five small conventions, all mechanical, none behaviour-changing. Grouped because each alone is too small to gate a review.

**Files:**
- Modify: `src/app/app.config.ts` (add two providers)
- Modify: all 24 files matching `src/app/**/*.component.ts` and the two directives (remove `standalone: true`)
- Modify: `src/app/features/home/sections/hero/bass-strings.component.ts:6`, `:55`, `:85-119` (drop `NgZone`)
- Modify: `src/app/features/home/sections/services/services.component.ts` (precompute icons)

**Interfaces:**
- Consumes: `provideZonelessChangeDetection` and `provideBrowserGlobalErrorListeners` from `@angular/core`.
- Produces: `ServicesComponent.icons: ReadonlyMap<string, SafeHtml>` replaces the `getIcon(name)` method — the template changes from `getIcon(service.icon)` to `icons.get(service.icon)`.

- [ ] **Step 1: Declare zoneless explicitly and register the error listeners**

In `src/app/app.config.ts`, extend the `@angular/core` import:

```ts
import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  inject,
} from '@angular/core';
```

and add both providers at the top of the `providers` array:

```ts
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
```

The app is already zoneless by default; declaring it makes the contract explicit and prevents a future `zone.js` install from silently flipping the mode.

- [ ] **Step 2: Confirm the app still boots zoneless**

```bash
npm run build && npm run test:ci
```

Expected: clean build, `Prerendered 2 static routes.`, `Tests 8 passed (8)`.

- [ ] **Step 3: Remove the redundant `standalone: true`**

It has been the default since Angular 19, and the `@angular-eslint/prefer-standalone` rule from Task 6 flags the explicit form.

```bash
grep -rln "standalone: true" src/ | xargs sed -i '' '/^  standalone: true,$/d'
```

- [ ] **Step 4: Verify nothing broke**

```bash
npm run lint && npm run test:ci && npm run build
```

Expected: all clean. If any component now fails to compile, it was relying on `standalone` being spelled out — restore that one file and note why.

- [ ] **Step 5: Drop the dead NgZone usage**

`NgZone.runOutsideAngular` is a no-op in a zoneless app (`NoopNgZone`), and leaving it in suggests scheduling that is not actually happening. In `src/app/features/home/sections/hero/bass-strings.component.ts`, remove `NgZone` from the `@angular/core` import on line 6 and delete the field on line 55:

```ts
  private readonly zone = inject(NgZone);
```

and unwrap the `this.zone.runOutsideAngular(() => { ... });` block in `init()` (lines 85-119) so its body executes directly. Keep every listener registration, the `MutationObserver`, and the `destroyRef.onDestroy` teardown exactly as they are — only the wrapper goes.

- [ ] **Step 6: Precompute the service icons**

In `src/app/features/home/sections/services/services.component.ts`, replace the class body with:

```ts
export class ServicesComponent {
  protected readonly services = SERVICES;

  private readonly sanitizer = inject(DomSanitizer);

  // Icons are static strings from our own source, so bypassing sanitization
  // is safe — without it Angular strips the <svg> markup. Built once at
  // construction rather than resolved per change-detection pass.
  protected readonly icons: ReadonlyMap<string, SafeHtml> = new Map(
    SERVICES.map((service) => [
      service.icon,
      this.sanitizer.bypassSecurityTrustHtml(getExpertiseIcon(service.icon)),
    ]),
  );
}
```

Field initializers run top-down, so `sanitizer` must be declared above `icons`.

Then update the template call site from `getIcon(service.icon)` to `icons.get(service.icon)`.

- [ ] **Step 7: Verify the icons still render**

```bash
npm run build && grep -c "<svg" dist/portfolio/browser/index.html
```

Expected: a non-zero count — the service icons are present in the prerendered HTML.

- [ ] **Step 8: Commit**

```bash
npm run format && npm run lint && npm run test:ci
git add -A
git commit -m "refactor: declare zoneless, drop redundant standalone flags and dead NgZone"
```

---

### Task 14: Accessibility and design refinements

Six concrete refinements: WCAG-failing colours, emoji standing in for icons, a tap that never plucks, a keyboard-inaccessible carousel, `100vh` on mobile, and `overflow-x: hidden` masking layout bugs while breaking sticky positioning.

**Files:**
- Modify: `src/styles/_themes.scss:59`, `:55`, and both theme blocks (add `--accent-text`)
- Modify: `src/styles.scss:35` (`overflow-x`), and add `.section--muted`
- Modify: `src/app/shared/components/theme-toggle/theme-toggle.component.ts:9-21`
- Modify: `src/app/features/home/sections/hero/hero.component.ts:72` (`dvh`), `:53-64` (sound toggle icon)
- Modify: `src/app/features/home/sections/hero/bass-strings.component.ts` (tap-to-pluck)
- Modify: `src/app/shared/components/project-card/project-card.component.ts` (carousel a11y)
- Modify: `src/app/features/home/sections/{experience,education,skills,interests}/*.component.ts` (section rhythm)

**Interfaces:**
- Consumes: the CSS custom properties defined in `src/styles/_themes.scss`.
- Produces: a new `--accent-text` token, present in **both** theme blocks, to be used wherever the accent colour is applied to text. `--accent-from` keeps its current values and stays the gradient/border colour.

- [ ] **Step 1: Fix the light-theme contrast failures**

`--accent-from: #c95f02` on `--bg-primary: #faf8f3` measures **3.87:1** and `--text-muted: #7c7970` measures **4.10:1**; WCAG AA requires 4.5:1 for normal text. `--accent-from` cannot simply be darkened — it is also the gradient start on filled buttons where the current value is correct. Add a dedicated foreground token instead.

In `src/styles/_themes.scss`, inside the `[data-theme='dark']` block add after `--accent-to`:

```scss
  --accent-text: #ffb454;
```

(10.96:1 on `#0c0d10` — already compliant.)

Inside the `[data-theme='light']` block, change `--text-muted` and add `--accent-text`:

```scss
  --text-muted: #6b6860;
```

```scss
  --accent-text: #b35100;
```

`#6b6860` on `#faf8f3` measures 5.32:1; `#b35100` measures 4.81:1. Both clear AA.

- [ ] **Step 2: Route every accent-as-text usage through the new token**

```bash
grep -rn "color: var(--accent-from)" src/
```

Change each hit to `color: var(--accent-text)`. Leave `background`, `border-color`, `outline`, and `box-shadow` uses of `--accent-from` alone — those are not text and the current value is correct for them. The known text sites are `header.component.ts` (`.header__logo-dot`, `.header__mobile-link` active state and its `::before`), `footer.component.ts` (`.footer__link:hover`), and `contact.component.ts` (`.contact-form__error--global a`).

- [ ] **Step 3: Verify the contrast numerically**

```bash
node -e "
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const f = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return ((x + 0.05) / (y + 0.05)).toFixed(2);
};
console.log('light accent-text on bg:', ratio('#b35100', '#faf8f3'));
console.log('light text-muted on bg :', ratio('#6b6860', '#faf8f3'));
console.log('dark  accent-text on bg:', ratio('#ffb454', '#0c0d10'));
console.log('dark  text-muted on bg :', ratio('#82807a', '#0c0d10'));
"
```

Expected: `4.81`, `5.32`, `10.96`, `4.92` — all at or above 4.5.

- [ ] **Step 4: Replace `overflow-x: hidden` with `clip`**

In `src/styles.scss:35`, change:

```scss
  overflow-x: clip;
```

`hidden` creates a scroll container, which silently breaks `position: sticky` on any descendant; `clip` gives the same visual result without that side effect.

- [ ] **Step 5: Use dynamic viewport units in the hero**

In `src/app/features/home/sections/hero/hero.component.ts:72`, change:

```scss
      min-height: calc(100dvh - var(--header-height));
```

`100vh` on mobile Safari and Chrome measures the viewport *without* browser chrome, pushing the hero's bottom controls off-screen. `dvh` tracks the actual visible height.

- [ ] **Step 6: Replace the emoji icons with SVG**

Emoji render differently per platform and `☏` is not an emoji at all, so it falls back to whatever glyph the system has. Replace the theme toggle's template (`theme-toggle.component.ts:9-21`) with:

```html
    <button
      type="button"
      class="theme-toggle"
      (click)="themeService.toggleTheme()"
      [attr.aria-label]="
        themeService.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      "
    >
      @if (themeService.theme() === 'dark') {
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      } @else {
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      }
    </button>
```

and add `color: var(--text-primary);` to the `.theme-toggle` rule so `currentColor` resolves correctly.

Do the same for the hero's sound toggle. In `hero.component.ts`, replace the `{{ soundOn() ? '🔊' : '🔇' }}` interpolation on line 62 with:

```html
          @if (soundOn()) {
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
            </svg>
          } @else {
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              <path d="m17 9 4 6M21 9l-4 6" />
            </svg>
          }
```

and add `color: var(--text-primary);` to the `.hero__sound-toggle` rule.

Then in `contact.component.ts`, replace the `☏` on line 174 with:

```html
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path
                          d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"
                        />
                      </svg>
```

`.contact-card__social-icon` already sets `color: var(--accent-contrast)`, so `currentColor` resolves correctly there without a style change. Keep every existing `aria-label`, `aria-hidden` and `aria-pressed` binding exactly as it is.

- [ ] **Step 7: Make a tap pluck a string**

`onPointerMove` detects a pluck by comparing the current pointer position to the previous one (`prev && (prev.y - sy) * (y - sy) < 0`). On touch, `pointerdown` is the *first* sample, so `prev` is `null` and a tap does nothing — mobile visitors get an inert decoration next to a hint that tells them to interact with it.

In `src/app/features/home/sections/hero/bass-strings.component.ts`, register `pointerdown` to a dedicated handler instead of reusing `onMove`. Replace the listener registration:

```ts
      const onMove = (e: PointerEvent) => this.onPointerMove(e);
      const onDown = (e: PointerEvent) => this.onPointerDown(e);
      const onLeave = () => this.releaseAll();
```

```ts
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
```

and the matching teardown:

```ts
        window.removeEventListener('pointerdown', onDown);
```

Then add the handler next to `onPointerMove`:

```ts
  /** A tap has no previous sample to cross a string with — pluck the nearest. */
  private onPointerDown(e: PointerEvent): void {
    const rect = this.canvasRef().nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.prevPointer = { x, y };

    if (x < 0 || x > rect.width || y < 0 || y > rect.height || this.reducedMotion) {
      return;
    }

    let nearest: PluckString | null = null;
    let nearestDistance = TAP_RADIUS;

    for (const s of this.strings) {
      const distance = Math.abs(y - s.yRatio * rect.height);
      if (distance < nearestDistance) {
        nearest = s;
        nearestDistance = distance;
      }
    }

    if (nearest) {
      nearest.grabX = x;
      this.release(nearest, Math.max(TAP_AMPLITUDE, MAX_BEND * 0.5));
      this.ensureLoop();
    }
  }
```

and the constants beside `MAX_BEND`:

```ts
/** How close a tap must land to a string, in CSS pixels, to pluck it. */
const TAP_RADIUS = 28;
/** Bend amplitude a tap imparts, since there is no drag distance to measure. */
const TAP_AMPLITUDE = 18;
```

- [ ] **Step 8: Make the carousel keyboard-operable and announced**

The project card's prev/next buttons and dots are mouse-only, and a slide change is silent to a screen reader. In `src/app/shared/components/project-card/project-card.component.ts`, wrap the carousel and add a live region:

```html
      <div
        class="project-card__carousel"
        role="group"
        [attr.aria-roledescription]="'carousel'"
        [attr.aria-label]="titleKey() | translate"
        tabindex="0"
        (keydown.arrowleft)="prev()"
        (keydown.arrowright)="next()"
      >
        <img
          [src]="images()[currentIndex()]"
          [alt]="titleKey() | translate"
          width="600"
          height="340"
          loading="lazy"
          class="project-card__image"
        />
        <p class="sr-only" aria-live="polite">
          {{ 'projects.imageOf' | translate: { current: currentIndex() + 1, total: images().length } }}
        </p>
```

Change each dot's label from the bare index to a positional one:

```html
                  [attr.aria-label]="'Image ' + ($index + 1) + ' of ' + images().length"
                  [attr.aria-current]="$index === currentIndex()"
```

Add a visible focus ring to both control types in the component's styles:

```scss
    .project-card__nav,
    .project-card__dot,
    .project-card__carousel {
      &:focus-visible {
        outline: 2px solid var(--accent-from);
        outline-offset: 2px;
      }
    }
```

Add the translation key to both locale files — `en.json`:

```json
    "imageOf": "Image {{current}} of {{total}}",
```

`ka.json`:

```json
    "imageOf": "სურათი {{current}} / {{total}}",
```

Both go inside the existing `projects` object; the files must end at 283 keys each.

- [ ] **Step 9: Give the page a section rhythm**

Eleven sections stack with identical padding and identical card treatment, so the "sell" half (services, work, testimonials) reads with the same weight as the CV half. Add a muted band to the CV sections.

In `src/styles.scss`, after the `.section` rule:

```scss
.section--muted {
  background: var(--bg-secondary);
}
```

Then add `section--muted` to the class list of the root `<section>` in `experience.component.ts`, `education.component.ts`, `skills.component.ts`, and `interests.component.ts` — e.g. `class="section section--muted experience"`.

- [ ] **Step 10: Verify the full suite and build**

```bash
npm run format && npm run lint && npm run test:ci && npm run build
```

Expected: all clean, `Prerendered 2 static routes.`

- [ ] **Step 11: Verify in the browser, both themes and both viewports**

```bash
npm run serve:ssr:portfolio
```

At `http://localhost:4000`, check: the theme toggle shows an SVG sun/moon and switches without a flash; at 375 px width the hero's bottom controls are visible and a tap on a string plucks it audibly (with sound on) and visibly; tabbing into a project card carousel and pressing ArrowLeft/ArrowRight changes the slide; the muted CV sections are visually distinct from the sell sections in both themes; no horizontal scrollbar appears at 375 px. Stop with `Ctrl+C`.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat(design): WCAG-AA contrast, SVG icons, tap-to-pluck, carousel a11y, section rhythm"
```

---

## Completion checklist

Run before declaring the plan done:

```bash
npm run format:check && npm run lint && npm run test:ci && npm run build
```

```bash
npm outdated
```

Expected: no rows except `typescript` (intentionally pinned below `latest` because Angular 22 requires `>=6.0 <6.1`).

```bash
grep -c 'id="work"' dist/portfolio/browser/index.html
```

Expected: `1`.

```bash
grep -o 'og:image" content="[^"]*"' dist/portfolio/browser/index.html
```

Expected: a URL ending in `.png`.

## Follow-up plans

- **Locale-prefixed routing** — `/ka/...` URLs, both locales prerendered, translated route `title` and `seo` data, and `hreflang` alternates. Today the Georgian translation of every page is unreachable by URL and therefore unindexable. Separate subsystem, separate plan.
- **Contact delivery** — `CONTACT_FORM.accessKey` is empty, so every inquiry routes through the visitor's mail client. Obtaining and configuring a Web3Forms key (or replacing it with an SSR endpoint on the existing Express server) is an operational decision, not a code change.
