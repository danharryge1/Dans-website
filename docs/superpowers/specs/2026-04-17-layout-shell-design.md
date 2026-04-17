# Layout Shell — Design Spec

**Status:** Approved 2026-04-17. Ready for `writing-plans`.
**Date:** 2026-04-17
**Project:** DanGeorge.studio
**Stack:** Next.js 16.2 + React 19.2 + Tailwind v4 + TS + App Router + `src/` + `@/*` alias (scaffold done, package name `dangeorge-studio`)

## 1. Context

Global chrome for the site: nav, footer, page container, responsive breakpoints. Shell is barely there — lets the hero and scroll sections do the talking.

Source docs: `PRD.md`, `design.md`, `CLAUDE.md` in project root.

## 2. Design Brief (from `shape` skill)

**Feature summary:** Global chrome. Nav, footer, container. Premium, quiet, hand-crafted.

**Primary user action:** Let visitor focus on hero within 2s of landing. Nav = wayfinding only. Footer = closure only.

**Direction:** Minimal, confident, atmospheric. Per design.md §2.1 Variant A: transparent nav, centred links, no logo. Typography carries the craft (Permanent Marker uppercase, tight letter-spacing). No shadows on shell. Depth comes from teal bg + perspective grid behind hero.

## 3. Brainstorming Decisions (all 5 resolved)

| # | Question | Decision |
|---|---|---|
| Q1 | Mobile nav pattern (<768px) | **A — Full-screen overlay.** Tap ☰ → viewport fades to `#0B2422`, 4 links huge (Comico 48px, stacked centred), × to close. |
| Q2 | Nav scroll behaviour | **B — Backdrop-blur fades in after 100px.** Starts transparent; `backdrop-filter: blur(12px)` + `rgba(11,36,34,0.6)` overlay fades in over 250ms once scrollY > 100. |
| Q3 | Container max-width | **B — 1400px.** `max-w-[1400px]` centred. Inner sections can cap tighter per design.md (e.g., services grid at 1200). |
| Q4 | Footer copy | **A —** `© 2026 DanGeorge.studio. Every pixel considered.` |
| Q5 | Fixed vs sticky nav | **A — Fixed.** `position: fixed` pinned to viewport top from pixel 0. Pairs cleanly with Q2 backdrop-blur. |

## 4. Consolidated Final Design

### Nav
- Fixed top, centred 4 links: `PORTFOLIO · SERVICES · ABOUT · CONTACT`
- Type: Permanent Marker 14px, uppercase, `letter-spacing: 0.05em`
- Starts transparent; at `scrollY > 100px`, `backdrop-filter: blur(12px)` + `rgba(11,36,34,0.6)` overlay fades in over 250ms
- Link colour: `var(--text-secondary)` rest → `var(--text-accent)` hover (200ms ease-out)
- Padding: `py-6`
- Mobile (<768px): hamburger `☰` on right → tap opens full-screen overlay `#0B2422`, 4 links stacked centred in Comico 48px, `×` close top-right, fade-in 300ms

### Container
- Component: `<Container>`
- `max-w-[1400px]` centred
- Gutters: `px-6 md:px-10 lg:px-12`

### Footer
- Thin `1px` top border (`var(--grid-line)`)
- Centred text, 12px Permanent Marker `var(--text-secondary)`
- Padding: `py-4`
- Copy: `© {currentYear} DanGeorge.studio. Every pixel considered.` (year rendered via `new Date().getFullYear()` so it ages well — initial render will show 2026)

### Breakpoints (Tailwind defaults, consistent with design.md §4)
- Desktop: `≥1024px` (`lg`)
- Tablet: `<1024px` (`md`)
- Mobile: `<768px` (`sm`)

## 5. Design Tokens (from design.md §1.1 — for globals.css)

```css
--bg-primary: #0D544C;
--bg-darker: #0B2422;
--bg-card: rgba(11, 36, 34, 0.85);
--bg-card-border: rgba(140, 200, 165, 0.35);
--text-primary: #F5F5F0;
--text-secondary: #A5B9AD;
--text-accent: #F5F0F4;
--grid-line: rgba(180, 220, 200, 0.15);
--grid-glow: rgba(180, 240, 200, 0.10);
--gold-accent: #C8A55C;
--border-input: #F5F5F0;
--btn-primary-border: #F5F5F0;
```

Fonts: `--font-comico` (headings), `--font-marker` (body). Files at `/Users/dangeorge/The Vault/Dans Website/fonts/` — need to be moved to `public/fonts/` and declared via `@font-face` in `globals.css`.

## 6. Implementation To-Do (for writing-plans)

1. Install `gsap`, `lenis`, `motion`, `three` (build phase — approved in principle earlier)
2. Move/copy fonts into `public/fonts/`, add `@font-face` declarations
3. Add design tokens to `src/app/globals.css`
4. Build `src/components/layout/Container.tsx`
5. Build `src/components/layout/Nav.tsx` (client component — uses scroll + mobile overlay state)
6. Build `src/components/layout/Footer.tsx`
7. Wire Nav + Footer + fonts into `src/app/layout.tsx`
8. Dev server check across 3 breakpoints
9. Run `verification-before-completion` + `audit` + `polish`

## 7. Open questions (none)

All resolved.
