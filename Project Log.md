---
title: DanGeorge.studio — Project Log
tags:
  - project/dans-website
  - status/in-progress
status: case-study-task-10-complete
started: 2026-04-16
target: 2026-04-23
repo: https://github.com/danharryge1/Dans-website
---

# DanGeorge.studio — Project Log

Live state of the build. Updated after every completed task so [[Dans Website/claude]] sessions can resume cleanly after compaction.

> [!info] Where to look for what
> - Design of record → [[2026-04-17-layout-shell-design]]
> - Implementation plan → [[2026-04-17-layout-shell]]
> - Visual system → [[design]]
> - Brand / voice → [[PRD]]
> - Project conventions → [[claude]]

## Current status

> [!info] Active phase: Case Study (FeaturedCase) — Task 11 next
> Task 10 complete (2184eb6): 22 Playwright screenshots across 3 viewports (desktop/tablet/mobile) × 7 scroll positions + 1 reduced-motion variant at `docs/verification/2026-04-18-case-study/`. Key findings: GSAP ScrollTrigger does not advance in headless Playwright (instant scrollTo doesn't fire scroll events), so early-beat frames show blank panels — content is confirmed present via reduced-motion capture. Two genuine concerns for Task 11: (1) white-box overlap artifact at `desktop-07-selected` (element bleeding outside case study container after pin releases); (2) Act 1 left-panel overlay copy invisible at desktop (z-index or opacity initial-state issue). Reduced-motion desktop capture is clean — stacked beats, no pin artifacts, full asset rendering. Next: Task 11 — audit + polish pass.

> [!success] Services section complete — 2026-04-18
> All 10 tasks (0–9) shipped. Three-card "Tailored Digital Solutions" grid with desktop per-card scroll-scrubbed gold sheen sweep + quarter-arc draw-in, mobile one-shot staggered reveal, Motion-backed ±3° hover tilt (pointer-fine + motion-OK only), and reduced-motion snap state. Audit pass confirms WCAG AAA contrast (body 9.3:1, heading 14.89:1), clean landmarks, no keyboard traps. 63/63 tests · tsc · lint · prod build all green. Next phase: TBD pending PRD review.

> [!success] Hero section complete — 2026-04-18
> All 13 tasks shipped. Prod Lighthouse: Perf 97 / A11y 100 / BP 100. Seam runway pinned at `+=100%`, reduced-motion parity fixed (sparkles + side-labels now resolve), img intrinsic dims set. Next phase: **Services section** (design.md §2.3) — kicks off with `/brainstorming` for the Services spec.

> [!success] Layout shell complete — 2026-04-17
> Nav + Footer + Container wired, tokenised, WCAG-AA, keyboard-accessible, font-preloaded.

> [!note] Tooling added 2026-04-17
> `playwright-cli` (Microsoft) installed globally + mirrored to `~/.claude/skills/playwright-cli/`. Source cloned into `Anti gravity Skills/Advanced_and_Agents/playwright-cli/`. Used for Task 8 breakpoint verification — drives a real Chrome at 1920/768/375, programmatic scroll, snapshot-based click refs. Screenshots committed at `docs/verification/2026-04-17-layout-shell/`.

## Workflow chain

`brainstorming → writing-plans → subagent-driven-development → TDD build (taste-skill · impeccable · typeset · layout · stitch-skill) → verification-before-completion → audit → polish`.

## Task progress — Services Section

Mirror of the plan's checkboxes. Source of truth is still [2026-04-18-services-section](docs/superpowers/plans/2026-04-18-services-section.md).

- [x] **Task 0** — Services design tokens + arc-float keyframes + reduced-motion guards in `globals.css` (commit `0cd9893`)
- [x] **Task 1** — Build `services.data.ts` — three service entries (commit `0cd9893`)
- [x] **Task 2** — Build `ServiceCard` (TDD) — arc flourish + sweep overlay + label (commit `0cd9893`)
- [x] **Task 3** — Build `Services` server component + heading + 3-card grid (TDD, 4/4 tests) (commit `124b386` + refactor `8ece611` — dropped unneeded React cast + wrapper div; `className` now flows to ServiceCard root)
- [x] **Task 4** — Wire `<Services />` into `page.tsx` + flip `--sweep-x` default to lit (commit `a16ecd1`, build: 55/55 tests, prod build green)
- [x] **Task 5** — Desktop scroll-linked reveal in `ServicesClient` (TDD, 3/3 ServicesClient tests, 58/58 total) (commits `b2f1b6e` + `5d36e5d` — dropped unused scopeRef + dead sr-only div)
- [x] **Task 6** — Mobile one-shot reveal branch (TDD, 6/6 ServicesClient tests, 61/61 total) (commits `d19e641` + `b165bcb` — killed infinite arc-float tween leak; tightened `repeat:-1` coverage)
- [x] **Task 7** — 3D hover tilt via Motion (TDD, 7/7 ServiceCard tests, 63/63 total) (commit `6bce332` — used `useSyncExternalStore` for matchMedia gate; spring 200/20/0.5; gated off on pointer-coarse + prefers-reduced-motion)
- [x] **Task 8** — Browser verification via playwright-cli — 10 screenshots (desktop/tablet/mobile × 3 scroll positions + reduced-motion) + NOTES.md at `docs/verification/2026-04-18-services/` (commit `ffbfb95`)
- [x] **Task 9** — `audit` + `polish` passes (commits `512dabc` polish-pass notes · `<pending>` phase transition). No code fixes required — WCAG AAA contrast (body 9.3:1), clean landmarks, Task 8 "orphan" note retracted (tablet third card correctly spans via `md:col-span-2`). Tests/tsc/lint/build all green.

## Task progress — Hero Section

Mirror of the plan's checkboxes. Source of truth is still [2026-04-17-hero-section](docs/superpowers/plans/2026-04-17-hero-section.md).

- [x] **Task 0** — Hero design tokens + sparkle keyframes in `globals.css` (commit `cb82a68`)
- [x] **Task 1** — Transcode NextUp "Draft" asset into `public/assets/hero/nextup-old.webp` (commit `ee95d00`)
- [x] **Task 2** — Build `PerspectiveGrid` (TDD) (commit `ec8ff09`)
- [x] **Task 3** — Build `HeroSparkles` (TDD) (commit `8df2fb1`)
- [x] **Task 4** — Build `HeroScrollHint` (TDD) (commit `7ad5fa3`)
- [x] **Task 5** — Build `HeroLaptop` (TDD) (commit `c05b93f`)
- [x] **Task 6** — Build `HeroScreen` (TDD) (commit `861f2ba`)
- [x] **Task 7** — Build `Hero` Server Component + stub `HeroClient` (TDD, 26/26 tests) (commit `575a51b`)
- [x] **Task 8** — Wire `<Hero />` into `page.tsx` + visual check static state (commit `5e51eef`)
- [x] **Task 9** — Implement `HeroClient` — GSAP + Lenis + ScrollTrigger lifecycle (TDD, 6/6 tests, 45/45 total) (commits `cefe9ea` + fix `85b583e` — mobile IO leak plug + `CSSVarTweenVars` type helper + strengthened reduced-motion/IO tests)
- [x] **Task 10** — Capture nextupco.com live hero + transcode (commits `75292f7` + fix `8c612d7` — 4s loop, CRF 30/38, combined 1.24 MB, settled poster at t=2.5s)
- [x] **Task 11** — Browser verification via playwright-cli (commit `91e62be` — 10 screenshots + Lighthouse + NOTES.md at `docs/verification/2026-04-18-hero/`. Findings for Task 12: seam scrub truncates because hero-only page has ~80px of runway vs 100vh expected — needs `pin: true` + `end: "+=100%"`; Lighthouse dev-build Perf 69 to re-measure on `next build`; A11y/BP both 100)
- [x] **Task 12** — `audit` + `polish` passes (commits `72009cf` runway fix · `d2382e9` reduced-motion parity + img intrinsic dims · `36c105c` prod Lighthouse + polished screenshots). Polish pass skipped: requested gold-accent seam already implemented in `HeroScreen.tsx`. Prod Lighthouse Perf 97 / A11y 100 / BP 100.

## Task progress — Layout Shell

Mirror of the plan's checkboxes. Source of truth is still [[2026-04-17-layout-shell]] — this is a glanceable summary.

- [x] **Task 0** — Vitest + RTL test infrastructure (commit `7c4ee61`)
- [x] **Task 1** — Install gsap / lenis / motion / three (commit `0dfc71d`)
- [x] **Task 2** — Copy fonts to `public/fonts/` (commit `68e68ae`)
- [x] **Task 3** — Rewrite `globals.css` (tokens + `@font-face` + Tailwind theme) (commit `357c837`)
- [x] **Task 4** — Build `Container` component (TDD) (commit `a2baa20`)
- [x] **Task 5** — Build `Footer` component (TDD) (commit `deba0e4`)
- [x] **Task 6** — Build `Nav` component (TDD, client, scroll + mobile overlay) (commit `edd6471`)
- [x] **Task 7** — Wire layout.tsx + page.tsx (commit `d342e7b`)
- [x] **Task 8** — Browser verification via playwright-cli + `verification-before-completion` (5 screenshots, 13/13 tests, tsc/lint/build clean)
- [x] **Task 9** — `audit` + `polish` passes (commit `7b350c2`) — a11y (Esc/focus-trap/focus-return/44×44), `--nav-scrolled-bg` tokenised, `--text-secondary` bumped to WCAG AA, reduced-motion, font preload, 3 post-polish screenshots

## Locked-in decisions (layout shell)

> [!success] Approved 2026-04-17
> - Mobile nav → full-screen overlay (`#0B2422`, Comico 48px stacked, × to close)
> - Nav scroll behaviour → transparent until `scrollY > 100`, then backdrop-blur + `rgba(11,36,34,0.6)` fades in over 250ms
> - Container → `max-w-[1400px]`, gutters `px-6 md:px-10 lg:px-12`
> - Footer copy → `© {year} DanGeorge.studio. Every pixel considered.` (dynamic year)
> - Nav positioning → fixed

## Brand constants (do not drift)

| Token | Value |
| --- | --- |
| Primary teal | `#0D544C` |
| Deeper teal (recessed) | `#0B2422` |
| Warm off-white text | `#F5F5F0` |
| Accent pink-white | `#F5F0F4` |
| Grid line | `rgba(180, 220, 200, 0.15)` |
| Gold accent | `#C8A55C` |
| Headings font | Comico |
| Body font | Permanent Marker |

## Git state

- Local repo initialised on `main` at `~/The Vault/Dans Website/`
- Remote `origin` → `https://github.com/danharryge1/Dans-website.git`
- Initial commit `d1d3be7` pushed 2026-04-17 (scaffold + spec + plan)
- Author auto-configured as `Dan George <dangeorge@Dans-MacBook-Air.local>` — may want to change to `danharryge1@gmail.com` via repo-local `git config`
- Strategy: per-task commits pushed to `origin main` after each successful review

## Skills installed globally

At `~/.claude/skills/`:
- `superpowers` — brainstorming, writing-plans, subagent-driven-development, TDD, verification, audit
- `impeccable` — shape, polish, typeset, layout, audit, critique, distill, delight, harden, optimize, overdrive, bolder, quieter, clarify, colorize, adapt
- `taste-skill` — taste, soft, stitch, minimalist, brutalist, redesign, output
- `webgpu-threejs-tsl` — (deferred, not in use this phase)
- `obsidian-markdown` — installed 2026-04-17 to maintain this log

## Task progress — Case Study (FeaturedCase)

Mirror of the plan's checkboxes. Source of truth is [2026-04-18-case-study](docs/superpowers/plans/2026-04-18-case-study.md).

- [x] **Task 0** — Design tokens for case study section in `globals.css`
- [x] **Task 1** — Build `case-study.data.ts` data file
- [x] **Task 2** — Build `BeatStrip` component (TDD)
- [x] **Task 3** — Build `FeaturedCase` server component (TDD)
- [x] **Task 4** — Build `FeaturedCaseClient` (GSAP scroll orchestration) (TDD)
- [x] **Task 5** — Build `SelectedWorks` + `WorkCard` components (TDD)
- [x] **Task 6** — Build `FeaturedCase` markup + video elements
- [x] **Task 7** — Implement GSAP client logic in `FeaturedCaseClient` (commit `d342e7b`)
- [x] **Task 8** — Capture decision-beat assets via Playwright (commit `67dd39d`) — 7 files in `public/assets/case-study/nextup/`; webm CRF bumped 32→34 to meet ≤400KB budget; used sharp for webp encode (ffmpeg 8.x dropped webp encoder)
- [x] **Task 9** — Wire `<FeaturedCase />` into `page.tsx` (commit `329eefc`) — 90/90 tests · tsc · lint · prod build all green
- [ ] **Task 10** — Browser verification via playwright-cli
- [ ] **Task 11** — `audit` + `polish` passes

## Next phase after hero

Services section — per design.md §2.3. Separate spec + plan. Kicks off with `/brainstorming` to translate the design.md block into a spec.
