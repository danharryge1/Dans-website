# Hero Section — Design Spec

**Status:** Approved 2026-04-17. Ready for `writing-plans`.
**Date:** 2026-04-17
**Project:** DanGeorge.studio
**Phase:** Hero (second phase, follows Layout Shell)
**Stack:** Next.js 16 + React 19 + Tailwind v4 + TS + App Router + `src/` + `@/*` alias. GSAP + ScrollTrigger, Lenis (smooth scroll wired in layout shell), Motion for React (available if needed).

## 1. Context

The hero is the 10-second "wow" — the moment a visitor decides whether DanGeorge.studio is serious. Per PRD: *"I want this person to build my site"* in the first ten seconds. Per `.impeccable.md`: cinematic · crafted · opinionated. The site itself is the portfolio, so the hero has to demonstrate craft, not describe it.

The layout shell is live (commit `8f60d3e`): Nav, Footer, Container, tokens, fonts, Lenis, motion-safe defaults. This spec slots a single hero section between Nav and Footer. No other page sections exist yet — the hero is effectively the whole page post-Nav, then direct-to-Footer.

Source docs: `PRD.md`, `design.md` §2.2, `CLAUDE.md`, `.impeccable.md`.

## 2. Design Brief (from brainstorming)

**Feature summary:** A cinematic hero that shows a real client site, NextUp Co., transforming from its old "Draft" build to its finished "Reality" state via a scroll-driven gold seam scrubbing across a CSS-built laptop on a perspective grid.

**Primary user action:** Scroll. That's it. The scroll itself *earns* the reveal — the interaction demonstrates the headline.

**Direction:** V1 × V3 hybrid (Draft → Reality scrub) per design.md §2.2. Perspective grid and sparkles from V1; laptop artefact from V3; content swapped from a static screenshot to a split-screen "before/after" driven by scroll progress.

## 3. Brainstorming Decisions (all 9 resolved)

| # | Question | Decision |
|---|---|---|
| Q1 | Which design.md §2.2 variant as foundation? | **Hybrid of V1 + V3.** Perspective grid world + laptop artefact. Not V4 (loses grid system). |
| Q2 | Flavour of the hybrid? | **B — Draft → Reality scrub.** Laptop screen is split wireframe/final, gold seam scrubs left→right as the user scrolls. |
| Q3 | Scroll choreography? | **In-place progressive.** Hero is a normal 100vh section; seam progress is tied to how much of the hero is still in view. No pinning. |
| Q4 | What appears on the two sides? | **Option Y — real case study.** Left: NextUp's old build (user-provided screenshot). Right: nextupco.com's current homepage. |
| Q5 | Animated "reality" side — how? | **Recorded video loop** of nextupco.com captured via playwright-cli. Not a live iframe (performance + external dependency risk). |
| Q6 | Copy (headline / sub) | **`THE WEB, EARNED.` / `Where ideas become interfaces.`** Replaces design.md's `CRAFTING DIGITAL MASTERPIECES / No templates…` which violated PRD's no-cliché rule. |
| Q7 | Mobile behaviour | **Autoplay-once on intersect** (1.8s, `power3.out`). No scroll-scrub on <768px — too janky on thumb scroll. |
| Q8 | Scroll indicator | **Tiny chevron + `Scroll to reveal`** bottom-centre, fades out on first scroll event. |
| Q9 | Attribution caption | **`Case Study 01 · NextUp Co.`** in Permanent Marker below the laptop. |

## 4. Consolidated Final Design

### Copy

| Slot | Copy | Type |
|---|---|---|
| Headline (`h1`) | `THE WEB, EARNED.` | Comico 72px desktop / 48px tablet / 40px mobile, ALL CAPS, `text-shadow: 0 0 24px rgba(200,165,92,0.18)` |
| Sub | `Where ideas become interfaces.` | Permanent Marker 18px desktop / 16px mobile, `var(--text-secondary)`, `letter-spacing: 0.02em` |
| Caption | `Case Study 01 · NextUp Co.` | Permanent Marker 13px, `var(--text-secondary)`, `letter-spacing: 0.1em`, `text-transform: uppercase` |
| Scroll hint | `Scroll to reveal` + downward chevron | Permanent Marker 12px, `var(--text-secondary)`, fades to 0 as scroll progress enters 0.05 |
| Side labels (screen) | `Draft` / `Reality` | Permanent Marker 11px pill tags, top-corners of the laptop screen, fade out at progress ≥ 0.9 |

### Layout

Full 100vh hero section, child of `<main>`, sits immediately below the fixed Nav. Direct-to-Footer after hero (no other sections this phase).

```
┌─────────────────────────────────────────────────────────┐
│   (fixed Nav floats over)                               │
│                                                         │
│              THE WEB, EARNED.              ← ~90px top  │
│        Where ideas become interfaces.                   │
│                                                         │
│           ╔═══════════════════════╗                     │
│           ║ [draft img] │ [video] ║     laptop          │
│           ║             ║         ║     rotateX(6deg)   │
│           ║             ║         ║     rotateZ(-1.5deg)│
│           ╚═══════════════════════╝     float ±8px / 4s │
│                                                         │
│           Case Study 01 · NextUp Co.    ← below laptop  │
│                                                         │
│                      ⌄                                  │
│              Scroll to reveal           ← bottom 40px   │
└─────────────────────────────────────────────────────────┘
     (perspective grid floor + radial glow + sparkles)
```

**Laptop sizing:** ~560px wide desktop / ~380px tablet / ~280px mobile. CSS-built frame (no image asset). Screen aspect locked 16:10. `perspective: 1200px` on parent.

**Grid floor:** reuses `--grid-line` token. `perspective: 800px` on container, child `transform: rotateX(55deg) translateY(30%)`. Grid lines via `repeating-linear-gradient` at 60px spacing. Radial mask softens toward top/edges.

**Sparkles:** 8 absolute-positioned 4px dots, `box-shadow: 0 0 10px 2px rgba(180,240,200,0.6)`. Positions seeded deterministically (no randomness on SSR → CSR hydration mismatches).

### Motion choreography

**Desktop (≥768px) — scroll scrub:**
- `gsap.context()` registers a single ScrollTrigger on `#hero`.
- `start: "top top", end: "bottom top", scrub: 0.6`.
- Scroll progress (0 → 1) drives:
  - `--seam-x` CSS variable: `12% → 100%`
  - Reality side `clip-path: inset(0 calc(100% - var(--seam-x)) 0 0)`
  - Sparkle opacity: staggered reveal between 0.4 and 0.8 progress
  - Scroll hint opacity: `1 → 0` across 0 – 0.05
  - Side labels: fade at progress ≥ 0.9
- Laptop float (independent of scroll): `gsap.to({y: -8}, { yoyo: true, repeat: -1, duration: 4, ease: "sine.inOut" })`

**Mobile (<768px) — autoplay once:**
- `IntersectionObserver` with `threshold: 0.3` fires on first entry.
- One-shot GSAP timeline: seam 12% → 100% over 1.8s, `ease: "power3.out"`. Sparkles sync'd.
- No scroll listener on mobile — cheaper, smoother.
- Video `play()` called at timeline start.

**Reduced motion (`prefers-reduced-motion: reduce`) — any breakpoint:**
- Seam snaps to 100% after 600ms mount delay (gentle cross-fade, not instant).
- No float, no sparkle animation (sparkles still render as static dots).
- Video `autoplay` removed — poster frame shown in place.

**Lenis ↔ ScrollTrigger coordination:**
Lenis instance lives in root layout (from layout-shell phase). In `HeroClient.tsx`:
```ts
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### Component architecture

```
src/components/sections/Hero/
  Hero.tsx                   # Server Component. Copy, semantics, layout. No 'use client'.
  HeroClient.tsx             # 'use client'. GSAP context, ScrollTrigger, breakpoint fork.
  HeroLaptop.tsx              # CSS laptop frame. Accepts { children } slot for the screen.
  HeroScreen.tsx              # Split screen: <img> (draft) + <video> (reality) + seam + labels.
                              # Accepts { progress: number } — deterministic, pure.
  PerspectiveGrid.tsx         # Pure-CSS receding grid floor. No props.
  HeroSparkles.tsx            # 8 dots, deterministic positions, respects reduced-motion.
  HeroScrollHint.tsx          # Chevron + label, fades on scroll.
  Hero.test.tsx               # Vitest + RTL. TDD-first.
```

**Boundaries:**
- `Hero.tsx` is the only file that knows about copy and semantics.
- `HeroClient.tsx` is the *only* 'use client' file in this phase — it wraps the visual tree with the motion layer.
- `HeroScreen.tsx` takes `progress` as a prop; all motion state lives upstream. Makes it trivially testable.
- Every subcomponent depends only on CSS variables from `globals.css`. No hardcoded hex, no inline styles.

**Why this shape:** SSRs copy + structure for instant LCP / SEO / a11y, then hydrates the scroll logic as progressive enhancement. Matches the layout-shell pattern.

### Assets

| Asset | Source | Path | Notes |
|---|---|---|---|
| NextUp old build screenshot | User-provided | `public/assets/hero/nextup-old.webp` | `next/image`, `priority`, `sizes="(max-width:768px) 280px, (max-width:1024px) 380px, 560px"`. Alt: `"NextUp Co. homepage, pre-redesign"`. |
| NextUp live hero video | Captured via playwright-cli from `https://nextupco.com` | `public/assets/hero/nextup-live.mp4` + `.webm` | ~5s loop, 1120×700 (2× laptop size for retina), target <800KB combined. `autoplay muted loop playsinline preload="metadata"`. |
| Video poster | First frame of video | `public/assets/hero/nextup-live-poster.webp` | Used when reduced-motion prevents autoplay. |

**Video capture process (playwright-cli):**
1. Navigate to `https://nextupco.com`
2. Set viewport to 1120×700
3. Wait for hero animations to settle (~500ms)
4. Record 5-second video via Playwright's `recordVideo` API
5. Transcode: `ffmpeg -i in.webm -c:v libx264 -crf 24 -pix_fmt yuv420p -movflags +faststart out.mp4` and `ffmpeg -i in.webm -c:v libvpx-vp9 -crf 32 out.webm`
6. Extract poster: `ffmpeg -i out.mp4 -ss 0 -vframes 1 -vf scale=1120:700 poster.webp`

Capture is the **last build task** so front-end can ship against a placeholder gradient.

### Accessibility

- `<section aria-labelledby="hero-heading">` with `<h1 id="hero-heading">THE WEB, EARNED.</h1>`.
- Draft image: meaningful `alt`.
- Video: `aria-hidden="true"`, no audio track, decorative.
- Seam, sparkles, scroll hint: `aria-hidden`.
- Side labels (`Draft`/`Reality`): visible sighted-only — `aria-hidden`, their meaning is conveyed by the alt on the image and a `<p class="sr-only">` that describes the transformation.
- No focusable elements inside the hero. Skip-to-content behaviour from layout shell still lands below the hero.
- Reduced-motion: full compliance — no autoplay, no float, no scroll-linked motion. Seam snap-reveal at 100% with a gentle cross-fade.
- Colour contrast: all text on `--bg-primary` — AAA verified in layout-shell phase.

### Testing strategy (TDD)

**Unit — `Hero.test.tsx` (Vitest + RTL):**
- Renders `<h1>` with text `"THE WEB, EARNED."` and correct `id`.
- Renders sub paragraph with `"Where ideas become interfaces."`.
- Renders draft `<img>` with correct `alt` and `src`.
- Renders `<video>` element with mp4 + webm sources and poster attribute.
- Renders caption `Case Study 01 · NextUp Co.`.
- Renders scroll hint when `matchMedia('(prefers-reduced-motion: reduce)').matches === false`.
- Does NOT render scroll hint when reduced-motion is `true`.
- Snapshot of the static tree (pre-hydration) matches.
- Component does not throw on SSR (no `window`/`document` access in Hero.tsx).

**Integration — `HeroClient.test.tsx`:**
- Mounts without error when GSAP and IntersectionObserver are mocked.
- Breakpoint fork: mobile uses IntersectionObserver once; desktop registers ScrollTrigger.
- Cleanup: unmounting revert()s the gsap.context.

**Browser verification — playwright-cli, post-build:**
- 1920, 768, 375 screenshots at scroll progress 0, 40%, 100%.
- Reduced-motion screenshot at desktop.
- Lighthouse run on the built site: LCP < 2.5s, CLS < 0.1, Performance ≥ 90.
- All screenshots committed to `docs/verification/YYYY-MM-DD-hero/` (date is the day verification runs).

**Audit + polish passes** at the end of the phase per workflow chain.

## 5. Design Tokens (additions to globals.css if needed)

Layout-shell already owns `--bg-primary`, `--bg-darker`, `--text-primary`, `--text-secondary`, `--text-accent`, `--grid-line`, `--gold-accent`, `--font-comico`, `--font-marker`. Hero-specific additions:

```css
:root {
  --grid-glow: rgba(180, 240, 200, 0.10);
  --sparkle-core: #F5F5F0;
  --sparkle-halo: rgba(180, 240, 200, 0.6);
  --seam-x: 12%;                  /* driven by GSAP on scroll */
  --laptop-tilt-x: 6deg;
  --laptop-tilt-z: -1.5deg;
  --laptop-perspective: 1200px;
}
```

## 6. Out of Scope (for a future phase)

- Second hero variant (A/B toggle). Out of scope.
- Live iframe of nextupco.com. Explicitly rejected in Q5.
- Portfolio-grid thumbnails inside the laptop. That's the Portfolio section, a later phase.
- Multi-case-study carousel on the laptop. Only NextUp ships this phase.
- GSAP SplitText word-by-word headline reveal. Could be added in a polish pass if it earns its place.

## 7. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Nextupco.com changes design and the video looks stale | Video is a static asset — no auto-refresh. Re-capture is a 5-min task whenever needed. |
| Playwright video capture produces unexpected content | Capture task runs in isolation after component is built — we can re-run until happy without blocking the front-end. |
| GSAP + Lenis setup produces jank | Pattern is proven (Lenis docs). Covered by browser-verification Lighthouse run before merge. |
| Scroll hint "teaches" an interaction mobile users can't perform | Mobile scroll hint is suppressed (autoplay path has no scroll-scrub to teach). |
| Large laptop + video inflates LCP | Video `preload="metadata"` (not `auto`). Draft image has `priority`. Video src swapped to poster under reduced-motion. |
| User's old NextUp screenshot not high-res enough | Spec allows placeholder gradient until real asset lands; component built against placeholder first. |

## 8. Approval checklist (user sign-off before `writing-plans`)

- [ ] Design, copy, and architecture read correct
- [ ] Motion choreography understood and approved (scroll-scrub desktop, autoplay-once mobile, reduced-motion snap)
- [ ] Assets plan approved (user provides NextUp old screenshot; we capture nextupco.com live video via playwright)
- [ ] Testing and verification strategy approved
- [ ] Any wording or framing edits made before plan is written

---

*End of spec. Next step: `writing-plans` to turn this into a task-level implementation plan.*
