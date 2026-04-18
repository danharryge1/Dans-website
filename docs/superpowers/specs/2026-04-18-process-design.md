# Process Section — Design Spec

**Date:** 2026-04-18
**Phase:** Process section (design.md §2.6, rewritten from scratch)
**Depends on:** Layout shell ✅ · Hero ✅ · Services ✅ · Case Study ✅ · Philosophy ✅
**Owner:** Dan
**Status:** approved — ready for implementation plan

---

## 1. Purpose

Fifth content section on the homepage. Sits between `<Philosophy />` (the quiet first-person POV) and the future Contact section. After Philosophy establishes *"here's my point of view,"* Process answers the next question a prospect is carrying into Contact: **"what is it actually like to work with you?"**

Its job in the funnel is to de-risk the transaction. Three short, first-person phases walk the reader from initial brief to live ship, in Dan's voice, without agency-template language. A single set-piece gesture — an animated gold thread connecting three numerals — makes the word "process" literal on the page rather than just asserted in copy.

The original DESIGN.md §2.6 (three numbered steps with generic "Blueprint / Vision / Engine" copy and three template images — "Wireframe sketch", "Design mockup", "Code editor screenshot") is **superseded by this spec**. The numbered-phases visual pattern is retained. The copy, the image requirement, and the template framing are replaced.

---

## 2. Composition

### 2.1 Section shell

- Tag: `<section id="process" aria-labelledby="process-heading">`
- Width: full viewport
- Background: `#0D544C` (primary teal — *not* `#0B2422`). Philosophy sat on the recessed deeper teal as a quiet moment; Process returns to the primary canvas to signal forward motion toward Contact.
- Vertical padding: `py-32 md:py-40`
- Inner container: `max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12`
- Content max-width: `max-w-[1100px]` for the phase stack, centered within the container

### 2.2 Structure

Top to bottom:

1. **Top bookend rule** — thin gold hairline, full container width (matches Philosophy's bookend pattern but only one rule above the eyebrow; the gold thread itself terminates the section visually below)
2. **Eyebrow** — small gold label, semantically the `<h2>`
3. **Three stacked `<PhaseBlock />`** components, with the animated `<GoldThread />` overlay running vertically through all three
4. **Bottom padding** that cleanly separates from the next section

No other visual elements. No images. No card chrome.

---

## 3. Eyebrow + heading

- Text: **THE PROCESS**
- Element: `<h2 id="process-heading">`
- Font: Permanent Marker
- Size: `14px` desktop, `13px` mobile
- Case: ALL CAPS
- Letter-spacing: `0.12em`
- Color: `#C8A55C` (accent gold)
- Alignment: left (within the container)
- Margin-bottom: `64px` desktop, `48px` mobile (generous gap before the first numeral so the eyebrow reads as a label, not a headline)

**Motion (on section enter, once):**

- Fade in + translate y `8px → 0`, `0.5s`, `power2.out`
- Fires when the section top crosses the viewport `start: "top 80%"`

---

## 4. Top bookend rule

- Tag: `<span aria-hidden="true" data-process-bookend>`
- Height: `1px`
- Color: `#C8A55C` at `0.35` opacity
- Width: 100% of the inner container
- Position: directly above the eyebrow (with `margin-bottom: 24px`)

Only one bookend rule here (versus Philosophy's two), because the gold thread terminates the section visually at the bottom — a dedicated bottom bookend would compete with it.

---

## 5. Phase blocks

### 5.1 Count and content (locked)

Three phases. Content typed into `phases.data.ts`, exported `as const satisfies readonly Phase[]`.

**Phase 1** (number: `"01"`, first slot):
- **Title:** `THE BRIEF`
- **Body:** `You tell me what you want. I read between the lines. I come back with the shape of it: three directions, none of them safe.`

**Phase 2** (number: `"02"`, second slot):
- **Title:** `THE BUILD`
- **Body:** `We pick a direction. Could be one, could be a mix. I make it real: typography, motion, copy, every pixel. The floor is this site. Yours goes higher.`

**Phase 3** (number: `"03"`, third slot):
- **Title:** `THE SHIP`
- **Body:** `You see it live before anyone else. When it's right, we push it to your domain.`

**Copy invariant (site-wide rule).** No em dashes, no en dashes, no hyphens anywhere in title or body strings. Enforced by `phases.data.test.ts` regex guard: `/[\u2014\u2013\u002D]/`.

### 5.2 Block layout

Each `<PhaseBlock />` renders an `<article>` with:

- **Desktop (≥1024px):** three-column CSS grid, `grid-cols-[80px_auto_1fr] gap-8 lg:gap-12`. Left column is the thread + dot rail (width 80px, thread inside). Middle column is the massive Comico numeral. Right column is title + body.
- **Tablet (≥768px):** same three-column grid, narrower: `grid-cols-[56px_auto_1fr] gap-6`.
- **Mobile (<768px):** two-column grid, `grid-cols-[44px_1fr] gap-4`. Numeral shrinks and sits inline with the title on the same row; body wraps full-width below. The thread rail stays at 44px from the left edge.

Root element receives `data-process-block` (for ScrollTrigger selection) and `data-phase-number="01"|"02"|"03"`.

### 5.3 Numeral

- Tag: `<span aria-hidden="true">` (decorative — screen readers get the phase content via the title)
- Font: Comico
- Color: `#F5F5F0` (warm off-white)
- Weight: regular
- Line-height: `0.9` (tight — numerals are display-scale)
- Letter-spacing: `-0.02em`
- Scale: `180px` desktop, `140px` tablet, `80px` mobile
- Alignment: left
- Padding-top: `0` (sits on the grid row baseline)

### 5.4 Title

- Tag: `<h3>`
- Font: Comico
- Color: `#F5F5F0`
- Case: UPPERCASE
- Size: `44px` desktop, `36px` tablet, `28px` mobile
- Line-height: `1.1`
- Letter-spacing: `-0.01em`
- Alignment: left
- Margin-bottom: `12px`

### 5.5 Body

- Tag: `<p>`
- Font: Permanent Marker
- Size: `22px` desktop, `20px` tablet, `18px` mobile
- Color: `#F5F5F0`
- Line-height: `1.55`
- Letter-spacing: `0.01em`
- Max-width: `52ch`
- Alignment: left

### 5.6 Vertical rhythm between blocks

- Desktop: `space-y-32` (128px between blocks)
- Tablet: `space-y-24`
- Mobile: `space-y-20`

The thread spans the gaps, so the rhythm becomes visible structure — generous spacing is required for the thread to read as a through-line rather than a crowded stack.

---

## 6. Gold thread + dots (the set-piece gesture)

### 6.1 Anatomy

A single `<GoldThread />` component is rendered as the final child of the `<Process />` section, absolutely positioned over the phase stack.

- **Container:** `<div aria-hidden="true" data-process-thread-container class="absolute top-0 bottom-0 pointer-events-none">`. Positioned so its left edge aligns with the center of the thread rail (40px from container edge at desktop, 28px tablet, 22px mobile — matches the midpoint of the corresponding rail column).
- **Line:** `<span data-process-thread>`. `1.5px` wide, height equal to the distance from the center of the first numeral's baseline to the center of the last numeral's baseline (computed in JS via `getBoundingClientRect`). Color `#C8A55C` at `0.9` opacity.
- **Dots:** three `<span data-process-dot="1"|"2"|"3">` elements. `10px × 10px`, `border-radius: 50%`, solid `#C8A55C` at full opacity. Each is absolutely positioned at the vertical center of its corresponding phase numeral.

### 6.2 Initial state

- Line: `transform: scaleY(0)`, `transform-origin: top`.
- Dots: `transform: scale(0)`, `opacity: 0`.

### 6.3 Reduced-motion state

All rendered in their final state:
- Line: `transform: scaleY(1)`.
- Dots: `transform: scale(1)`, `opacity: 1`.

Enforced by a CSS `@media (prefers-reduced-motion: reduce)` block that sets the above with `!important` (pattern matches Philosophy's fallback).

### 6.4 Geometry measurement

At mount (after layout, inside a `requestAnimationFrame`), `ProcessClient`:
1. Queries the three `[data-process-block]` elements.
2. For each, measures the Y-center of its numeral element.
3. Computes the thread container's `top` and `height` so the line spans center-of-first-numeral to center-of-last-numeral.
4. Positions each dot at its phase's Y-center.

These measurements are re-run on window resize (debounced 150ms) so the thread stays accurate across breakpoint changes.

---

## 7. Motion

### 7.1 Thread draw (scrubbed)

One ScrollTrigger with `scrub: 0.5` (gentle smoothing).

- **Trigger:** the section element itself.
- **Start:** `"top 80%"` (section top enters lower 20% of viewport).
- **End:** `"bottom 60%"` (section bottom leaves lower 40% of viewport — gives plenty of scroll runway for the thread to finish drawing before the last block).
- **Tween:** `scaleY: 0 → 1` on `[data-process-thread]`, `ease: "none"` (scrubbed tweens ignore ease — linear is idiomatic).

The thread draws in sync with scroll. Scrolling back up reverses the draw, which feels correct for a timeline metaphor.

### 7.2 Per-phase reveal (triggered, not scrubbed)

Driven by three independent ScrollTriggers, one per `[data-process-block]`. Each fires when its block's top crosses 75% of the viewport (so the dot + content reveal lands just before the reader's eye reaches the numeral).

Per block, timeline:
- **Dot:** `scale: 0 → 1`, `opacity: 0 → 1`, duration `0.4s`, ease `back.out(1.5)` (tiny overshoot — feels like it "lands").
- **Numeral:** `opacity: 0 → 1`, `translateY: 16px → 0`, duration `0.7s`, delay `0.1s`, ease `power2.out`.
- **Title:** `opacity: 0 → 1`, `translateY: 16px → 0`, duration `0.6s`, delay `0.18s`, ease `power2.out`.
- **Body:** `opacity: 0 → 1`, `translateY: 16px → 0`, duration `0.6s`, delay `0.26s`, ease `power2.out`.

Only triggers `once: true` — no reverse playback on scroll-up. Once revealed, the block stays visible.

### 7.3 Eyebrow + heading (section-level)

One ScrollTrigger for the eyebrow — fade + translate y as specced in §3.

### 7.4 Reduced motion

`ProcessClient` early-returns before `gsap.context` if `window.matchMedia('(prefers-reduced-motion: reduce)').matches`. In that state:

- Eyebrow renders at full opacity, no transform.
- Thread + dots render at their full-drawn state (enforced by CSS `@media` block).
- Numerals, titles, bodies all render at full opacity and no transform (enforced by CSS `@media` block).
- No GSAP instance is created. No ScrollTrigger is registered.

Section is fully readable and self-consistent.

### 7.5 Cleanup

All GSAP instances live inside `gsap.context(() => {...}, section)`. `ProcessClient`'s `useEffect` returns `() => { ctx.revert(); resizeObserver.disconnect(); }`, tearing down triggers and the resize handler on unmount.

---

## 8. Accessibility

- **Landmarks.** `<section>` has `aria-labelledby="process-heading"`. The eyebrow is the landmark heading (`<h2>`). Each phase uses `<h3>` for its title.
- **Semantic structure.** `<h2>` → three `<h3>` children, each inside an `<article>` with `<p>` body. The numeral is decorative (`aria-hidden="true"` via a wrapping span), so screen readers announce the phase structure via title + body without reading "01", "02", "03" twice.
- **Decorative elements.** Bookend rule, thread line, dots, and numeral spans all carry `aria-hidden="true"`.
- **Contrast.** `#F5F5F0` on `#0D544C` is ≈8.3:1 (AAA for normal text, AAA for large). Gold `#C8A55C` on `#0D544C` is decorative-only.
- **Keyboard.** No focusable content in this section. Tab order flows from Philosophy → (Process skipped) → Contact. No trap risk.
- **Reflow at 320px.** Numeral shrinks to 80px and lives inline with the title; body wraps below. No horizontal overflow.
- **Reduced motion.** Covered in §7.4.

---

## 9. Tokens

No new design tokens. Reuses existing:

- `--bg-primary` (`#0D544C`) — section background
- `--text-primary` (`#F5F5F0`) — numerals, titles, body
- `--gold-accent` (`#C8A55C`) — eyebrow, bookend rule, thread, dots
- `--font-comico` — numerals + titles
- `--font-marker` — eyebrow + body

New CSS additions (appended to `globals.css`):

```css
/* ---------- PROCESS (Phase 6) ---------- */
@media (prefers-reduced-motion: reduce) {
  [data-process-thread] {
    transform: scaleY(1) !important;
  }
  [data-process-dot] {
    transform: scale(1) !important;
    opacity: 1 !important;
  }
  [data-process-block] h3,
  [data-process-block] p,
  [data-process-block] [data-process-numeral] {
    opacity: 1 !important;
    transform: none !important;
  }
  [data-process-eyebrow] {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

No new keyframes (all Process motion is GSAP-driven, not CSS `@keyframes`).

---

## 10. Data shape

```ts
// src/components/sections/Process/phases.data.ts
export type Phase = {
  readonly id: string;
  readonly number: "01" | "02" | "03";
  readonly title: string;
  readonly body: string;
};

export const phases = [
  {
    id: "brief",
    number: "01",
    title: "THE BRIEF",
    body: "You tell me what you want. I read between the lines. I come back with the shape of it: three directions, none of them safe.",
  },
  {
    id: "build",
    number: "02",
    title: "THE BUILD",
    body: "We pick a direction. Could be one, could be a mix. I make it real: typography, motion, copy, every pixel. The floor is this site. Yours goes higher.",
  },
  {
    id: "ship",
    number: "03",
    title: "THE SHIP",
    body: "You see it live before anyone else. When it's right, we push it to your domain.",
  },
] as const satisfies readonly Phase[];
```

The `as const satisfies` pattern preserves string literal types and allows future additions without widening.

---

## 11. Assets

**None.** No image captures, no video, no SVG imports. Thread + dots are pure DOM elements styled by Tailwind and animated by GSAP.

---

## 12. Testing strategy

### 12.1 Unit tests (Vitest + RTL)

- **`phases.data.test.ts`**
  - Exports an array of exactly three entries
  - Each entry has non-empty `id`, `number`, `title`, `body`
  - IDs are unique
  - `number` values are `"01"`, `"02"`, `"03"` in that order
  - **No entry's `title` or `body` contains `\u2014`, `\u2013`, or `\u002D`** (site-wide no-dashes rule, regex guard)

- **`PhaseBlock.test.tsx`**
  - Renders `<article>` with `data-process-block` attribute
  - Renders `data-phase-number` matching the prop's number
  - Renders a decorative numeral span with the phase's number and `aria-hidden="true"`
  - Renders `<h3>` with the title text
  - Renders `<p>` with the body text

- **`GoldThread.test.tsx`**
  - Renders a container with `data-process-thread-container`
  - Renders one `[data-process-thread]` child element
  - Renders three `[data-process-dot]` children with `data-process-dot` values `"1"`, `"2"`, `"3"`
  - All thread elements carry `aria-hidden="true"`

- **`Process.test.tsx`**
  - Renders `<section id="process" aria-labelledby="process-heading">`
  - Renders `<h2 id="process-heading">` with text `THE PROCESS`
  - Renders one `[data-process-bookend]` (the top rule)
  - Renders exactly three `<PhaseBlock />` instances in data order
  - Renders the `<GoldThread />` component

- **`ProcessClient.test.tsx`**
  - Early-returns when `prefers-reduced-motion: reduce` matches (no `gsap.context` is created, no ScrollTrigger is registered)
  - Creates one scrubbed ScrollTrigger for the thread when motion is allowed
  - Creates one triggered ScrollTrigger per `[data-process-block]` when motion is allowed
  - Calls `ctx.revert()` and disconnects resize observer on unmount

Mock pattern follows the `vi.hoisted()` pattern established in `HeroClient`, `FeaturedCaseClient`, and `PhilosophyClient` tests.

### 12.2 Browser verification (playwright-cli)

Script: `scripts/verify-process.mjs`. Headless Chromium with the autoplay-policy flag (consistent with `verify-case-study.mjs` and `verify-philosophy.mjs`). Viewports: desktop 1920×1080, tablet 768×1024, mobile 375×812 at 2× DPR. Per viewport, three scroll positions:

- `01-pre-reveal` — section just entering viewport, thread starting to draw
- `02-mid-reveal` — scrolled so Phase 2 is centered, thread partially drawn, Phase 1 revealed
- `03-post-reveal` — scrolled past, thread fully drawn, all dots lit, all phases revealed

Plus one `desktop-reduced-motion.png` with the Playwright context set to `reducedMotion: "reduce"` — all content + thread + dots should render in their final state immediately.

Output: `docs/verification/2026-04-18-process/` + `NOTES.md` summarising findings per viewport.

---

## 13. Phase scope

### In scope

- Everything above: markup, motion, tokens reuse, data file, tests, page integration, browser verification, audit + polish.
- Retroactive update to the Project Log + plan checkboxes on phase completion.

### Explicitly out of scope

- **Contact section (§2.7).** Next phase after Process.
- **Any interactive element in Process** (buttons, links, inquiry form inline). Process is read-only; the Contact CTA lives in the dedicated Contact section.
- **Process timeline commitments** (e.g. "two weeks", "four weeks"). Intentionally absent from Phase 3 copy — scope + timeline are set per engagement.
- **Retroactive dash/hyphen audit of pre-Philosophy sections.** Hero, Services, Case Study, Layout shell copy predate the no-dashes rule. Tracked as a separate follow-up.

---

## 14. Risks + mitigations

| Risk | Mitigation |
|---|---|
| Thread geometry drifts on resize (e.g. laptop rotates to landscape, font loads cause reflow) | `ProcessClient` installs a `ResizeObserver` on the section; thread + dot positions recompute on resize (debounced 150ms). Initial positioning runs inside `requestAnimationFrame` after mount to wait for layout. |
| Thread `scaleY` + numeral `opacity` triggered simultaneously fight for GPU | Only `transform` and `opacity` are animated — both are compositor-promoted in Chrome/Safari/Firefox. No layout-triggering properties. |
| Numerals (180px Comico) push the section to feel cramped on tablet | Numeral scales down to 140px at tablet and 80px at mobile. Vertical rhythm (`space-y-24` tablet) gives breathing room. Verified in §12.2 captures. |
| Gold thread reads as "progress bar for scroll" and gets scrubbed too literally, distracting from copy | `scrub: 0.5` gives gentle smoothing so the thread lags scroll slightly, feeling like a traced line rather than a tracked input. Also the thread only spans the phase-numeral range, not the whole section height, so it reads as a structural element, not a scroll indicator. |
| Phase 3's "You see it live before anyone else" implies a staging link that Dan may not always provide | Copy is a commitment to the client-preview stage of the workflow, not a specific tool. Wording is generic enough to cover whatever staging approach is used per project (Vercel preview, password-protected subdomain, etc.). |
| Future copy edits reintroduce dashes | `phases.data.test.ts` regex guard fails the suite on any violation. |

---

## 15. Commit cadence

Per project convention:

- One commit per completed task.
- Push to `origin main` immediately after each commit.
- Tests, `tsc --noEmit`, `npm run lint`, and (before final phase-complete commit) `npm run build` all green.

---

## 16. Success criteria

- Three phases render in the correct order at the correct scales across all three viewports.
- Gold thread scrubs in sync with scroll and reaches full height by the time the reader reaches Phase 3.
- Each phase's dot pops and its content fades/rises on scroll-into-view, independent of the thread's scrubbed progress.
- `prefers-reduced-motion: reduce` disables all motion; thread + dots + content render fully.
- `phases.data.test.ts` fails if any dash or hyphen is introduced into copy.
- All tests pass; `tsc`, lint, and prod build green.
- Browser verification captures commit cleanly to `docs/verification/2026-04-18-process/`.
- Project Log transitions to `process-complete` with commit SHAs recorded.
