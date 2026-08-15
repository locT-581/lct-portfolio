---
project_name: 'portfolio-website'
user_name: 'loct-581'
date: '2026-08-15'
sections_completed:
  ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 34
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Monorepo / Package Manager:** `pnpm` v11 workspaces (`core-fe`, `cms-dashboard`). No npm or yarn.
- **Frontend Framework:** Next.js `16.2.12` (App Router, RSC-first default).
- **UI & Runtime:** React `19.2.4`, TypeScript `5.x` (strict mode).
- **Styling:** Tailwind CSS `v4.x` with `@tailwindcss/typography` & `@tailwindcss/postcss` (CSS variable-driven design tokens).
- **Internationalization:** `next-intl` `^4.13.4` (locale prefix routing `/{locale}/...`, default `vi`, `en`, message catalogs in `/messages/{locale}.json`).
- **HTTP & Data Fetching:** `ky` `^2.0.2` (singleton client at `src/lib/api/_client.ts`), `@tanstack/react-query` `^5.101.4` (client mutation islands).
- **Motion & Animation:** `gsap` `^3.15.0` + `@gsap/react` `^2.1.2` (client-side only, reduced-motion compliant).
- **Content & Sanitization:** `next-mdx-remote` `^6.0.0`, `isomorphic-dompurify` `^3.21.0`, `react-code-blocks` `^0.1.6`, `feed` `^6.0.0`.
- **Validation & Environment:** `zod` `^4.4.3`, `@t3-oss/env-nextjs` `^0.13.11`.
- **CMS Backend:** Em-dash CMS (`^0.30.0`) running on Cloudflare Workers (`@emdash-cms/cloudflare` `^0.30.0`, `wrangler` `^4.99.0`, Astro `7.0.0`).
- **Code Quality & Testing:** Biome `2.2.0` for formatting/linting; Node.js built-in `node:test` + `node:assert/strict` for unit testing.

---

## Critical Implementation Rules

### Language-Specific Rules (TypeScript / JavaScript)

- **Strict Mode & Zero `any` Policy (AD-11):** TypeScript strict mode is enforced. The `any` type is strictly forbidden in application code; use `unknown` with narrow type guards, or declare precise models in `src/types/`.
- **Path Aliasing:** Always use `@/` alias mapped to `src/*` (e.g. `@/components/ui/Button`, `@/lib/api/_client`, `@/types/cms`). Avoid deep relative imports like `../../../../lib/api`.
- **Type-Only Imports:** Always use `import type { ... }` for types, interfaces, and type aliases to keep compiled JavaScript bundles lean.
- **Explicit Return Types & Error Shapes:** Functions in `/lib/` and `/lib/api/` must declare return types. Server errors return structured `{ error: string; status: number }` instead of throwing unchecked runtime exceptions.
- **Environment Variable Access:** Never read raw `process.env` directly in feature components. Access validated env variables via `@/env` (powered by `@t3-oss/env-nextjs` and `zod`).
- **Dates & Number Formatting:** Em-dash provides ISO 8601 strings. Always parse and format dates client-side or during RSC render using `Intl.DateTimeFormat` with the active locale.

### Framework-Specific Rules (Next.js 16, React 19, Tailwind v4)

- **RSC-First Rendering Architecture (AD-1):** React Server Components (RSC) are the default. Add `'use client'` strictly to leaf components that require browser APIs, local interactive state, or TanStack Query mutations. Never convert layouts or entire route trees to client components.
- **Rendering & Cache Strategy (AD-3):** Use ISR (`export const revalidate = N`) for project/blog list and detail pages. Use dynamic RSC for locale-gated or personalized data. Never trigger un-cached bare `fetch()` inside Server Components.
- **CMS Adapter Isolation (AD-4, AD-16):** All communication with the Em-dash CMS must pass through `src/lib/api/` using the singleton Ky client from `src/lib/api/_client.ts`. UI components and pages must never call Ky/Em-dash endpoints directly.
- **State Ownership & TanStack Query (AD-6):** Server-rendered data lives in the RSC + ISR cache and must not be duplicated into client state. Client-side mutations (newsletter, contact form) must use TanStack Query v5. No external state stores (Zustand, Redux, Jotai).
- **Theme Contract (AD-17):** Theme state is driven by the `data-theme` attribute on `<html>` and stored in `localStorage` strictly under the key `'portfolio-theme'`.
- **Design Tokens Single Source of Truth (AD-8):** Tailwind v4 CSS custom properties defined in `src/app/globals.css` are the single source of truth (`brand-orange`, `bg-base-1`, `bg-base-2`, `bg-base-3`, `text-primary`, `text-secondary`, `stroke`, `divider`). Never hardcode raw hex, RGB, or HSL color literals in component code.
- **Internationalization Flow (AD-7):** Managed by `next-intl` v4 with prefix routing `/[locale]/...` (default `vi`, `en`). Translations reside in `/messages/{locale}.json` with `camelCase` dot-notation keys. All Em-dash requests must pass `?locale={locale}`.
- **GSAP Client Boundary (AD-9):** GSAP animations must only run client-side inside `useGSAP()` or client lifecycle hooks. All animation code must check and respect `prefers-reduced-motion`.
- **Content Sanitization (AD-12):** Blog content must be sanitized with `isomorphic-dompurify` prior to rendering HTML (`dangerouslySetInnerHTML`), or rendered via `next-mdx-remote` for MDX.

### Testing Rules

- **Native Test Runner:** Use Node.js built-in `node:test` and `node:assert/strict` for unit and logic tests. Avoid introducing heavy test frameworks (Jest/Mocha) without team alignment.
- **Test File Naming & Organization:** Name test files `*.test.ts` (or `*.test.tsx`) co-located next to the module they test (e.g. `src/lib/seo.test.ts`, `src/lib/rss.test.ts`).
- **Environment & State Cleanup:** When testing functions that read `process.env`, always save the initial state and restore it in a `finally` block to prevent test pollution.
- **Mocking Strategy:** Mock network requests and CMS responses at the adapter boundary using fixtures. Never execute live network calls to the CMS in automated test runs.
- **Critical Test Coverage Areas:** Prioritize unit tests for pure utility functions, SEO metadata generators, RSS XML generation, i18n URL construction, rate limiters, and data transform pipelines.

### Code Quality & Style Rules

- **Biome Exclusivity (AD-11):** Use Biome (`biome check`, `biome format --write`) exclusively for linting and formatting. Do not introduce ESLint or Prettier config files.
- **Component Folder & Barrel Pattern (AD-11):** UI components must live in a dedicated folder in `PascalCase` containing `ComponentName.tsx` and an `index.ts` barrel export (e.g. `src/components/ui/Button/Button.tsx` + `index.ts`). Primitives live under `src/components/ui/`, section layouts under `src/components/sections/` or domain feature folders.
- **ClassName Merging (`cn`):** Always use the `cn(...)` helper from `@/lib/utils` (combining `clsx` and `tailwind-merge`) when composing conditional or variant CSS classes.
- **Component Documentation:** Exported UI primitives and utility functions must include JSDoc comments detailing props, default values, and token behaviors.
- **File Length & Granularity:** Keep individual component and module files lean and focused (aim under ~200 lines). Break large monolithic sections into cohesive subcomponents.

### Development Workflow Rules

- **Agent Skill Activation Rule (AD-15):** Every agent session that activates a skill must prepend `🕶️ !! {skill-name}` to its first response per `.agents/AGENTS.md`.
- **Monorepo Execution:** Always run commands with `pnpm` from the monorepo root or use workspace flags (e.g. `pnpm --filter core-fe <cmd>`, `pnpm -r run dev`).
- **Asset Placement & Next Image (AD-14):** All static media assets must reside in `core-fe/public/` (or dedicated subfolders) and must be rendered using `next/image` with explicit `width`, `height`, and accessible `alt` text.
- **Security & Secrets Envelope (AD-10):** CMS API keys, Cloudflare credentials, and database secrets must never be committed to git or exposed under `NEXT_PUBLIC_*` prefixes.
- **Performance Budget (AD-14):** Keep initial JS bundle ≤ 200 kB gzip per route. Never import full heavy animation libraries when modular subpath imports are available.

### Critical Don't-Miss Rules (Anti-Patterns & Edge Cases)

- ❌ **NEVER mark whole pages or layouts with `'use client'`:** Always structure pages as React Server Components (RSC) and isolate interactivity into leaf client islands.
- ❌ **NEVER hardcode raw color hex, RGB, or HSL values:** Always use the design system tokens (`text-brand-orange`, `bg-bg-base-1`, `border-stroke`, etc.) defined in `globals.css`.
- ❌ **NEVER make direct Em-dash API / Ky calls outside `src/lib/api/`:** All CMS queries must go through dedicated adapter methods sharing the singleton client in `_client.ts`.
- ❌ **NEVER duplicate server-rendered data into client-side global stores:** Rely on RSC + ISR caching; use TanStack Query only for client mutations.
- ❌ **NEVER initialize GSAP during SSR:** Run GSAP only inside `useGSAP()` or client lifecycle hooks, and always handle `prefers-reduced-motion`.
- ❌ **NEVER use standard `<img>` tags without dimensions:** Use Next.js `next/image` with explicit `width`, `height`, and localized static assets in `public/`.
- ❌ **NEVER hardcode URLs or domains:** Derive absolute URLs from `NEXT_PUBLIC_SITE_URL` via `@/lib/seo` and `@/env`.
- ❌ **NEVER render unsanitized HTML in blog content:** Always sanitize HTML through `isomorphic-dompurify` before passing to `dangerouslySetInnerHTML`.
- ❌ **NEVER omit locale query parameters in CMS requests:** Always include `?locale={locale}` in Em-dash requests to ensure localized content delivery.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code.
- Follow ALL rules exactly as documented.
- When in doubt, prefer the more restrictive option.
- Update this file if new patterns or architectural decisions emerge.

**For Humans:**

- Keep this file lean and focused on agent needs.
- Update when the technology stack or version dependencies change.
- Review periodically for outdated rules.
- Remove rules that become obvious over time.

Last Updated: 2026-08-15
