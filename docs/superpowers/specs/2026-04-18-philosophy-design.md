# Philosophy Section — Design Spec

**Date:** 2026-04-18
**Phase:** Philosophy section (design.md §2.4, rewritten from scratch)
**Depends on:** Layout shell ✅ · Hero ✅ · Services ✅ · Case Study ✅
**Owner:** Dan
**Status:** approved — ready for implementation plan

---

## 1. Purpose

Fourth content section on the homepage. Sits between `<SelectedWorks />` (the Case Study ledger) and the future Process + Contact sections. After 500vh of pinned cinematic storytelling in the Case Study, Philosophy is the **quiet counter-punch**: three opinionated, first-person beliefs that frame the studio's point of view and make the prior proof feel inevitable rather than lucky.

The Case Study earns its weight through motion. Philosophy earns its weight through **typographic scale, asymmetric composition, and voice**. No pin, no numerals, no image, no gimmicks. The copy does 80% of the work; a single crafted entrance motion per block does the rest.

The original DESIGN.md §2.4 (hand-drawn sketch image + generic "bespoke creation" paragraph + two pill badges) is **superseded by this spec** — retained in the design doc as historical context only.

---

## 2. Composition

### 2.1 Section shell

- Tag: `<section id="philosophy" aria-labelledby="philosophy-heading">`
- Width: full viewport
- Background: `#0B2422` (deeper teal — matches Services recessed surface). One colour change versus the `#0D544C` canvas signals "you've entered a different room."
- Vertical padding: `py-32 md:py-40`
- Inner container: `max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12` (matches Services + Case Study pattern)
- Content max-width: `max-w-[1100px]` for the stacked belief blocks, centered within the container

### 2.2 Structure

Top to bottom:

1. **Eyebrow** — small gold label, semantically the `<h2>`
2. **Bookend rule** — thin gold hairline, full container width, directly under the eyebrow
3. **Three stacked `<BeliefBlock />`** components, generous vertical gap between each
4. **Bookend rule** — thin gold hairline, full container width, under the third belief
5. **Bottom padding** that cleanly separates from the next section

No other visual elements. No decorative images. No numerals.

---

## 3. Eyebrow + heading

- Text: **OUR PHILOSOPHY**
- Element: `<h2 id="philosophy-heading">`
- Font: Permanent Marker (not Comico — eyebrow reads as a label, not a statement)
- Size: `14px` desktop, `13px` mobile
- Case: ALL CAPS
- Letter-spacing: `0.12em`
- Color: `#C8A55C` (accent gold)
- Alignment: left (within the container)
- Margin-bottom: `24px` desktop, `20px` mobile

**Motion (on section enter, once):**

- Fade in + translate y `8px → 0`, `0.5s`, `power2.out`
- Fires when the section top crosses the viewport `start: "top 80%"`

---

## 4. Top + bottom bookend rules

- Tag: `<span aria-hidden="true" data-philosophy-bookend>` for each
- Height: `1px`
- Color: `#C8A55C` at `0.35` opacity (subtle — brackets the section without shouting)
- Width: 100% of the inner container
- Position: one directly under the eyebrow (with `margin-bottom: 64px md:96px`), one directly above the bottom padding (with `margin-top: 64px md:96px`)

These are static — they do not animate. The animated gold rule lives **inside each BeliefBlock**, not at the section bookends.

---

## 5. Belief blocks

### 5.1 Count and content (locked)

Three beliefs. Content typed into `beliefs.data.ts`, exported `as const satisfies readonly Belief[]`.

**Belief 1** (scale: `'xl'`, first slot):
- **Headline:** `If I can do this for myself, imagine what I'd do for you.`
- **Body:** `NextUp, the case study above, is my own company. I built the site, the brand, the product. It's proof of capability, not the ceiling of it.`

**Belief 2** (scale: `'lg'`, second slot):
- **Headline:** `One person. Every decision.`
- **Body:** `I don't outsource the taste. Typography, motion, copy, the 200ms on a button press. Those are mine. The standard is "would I ship this on my own site?" That standard doesn't loosen when the logo on the brief changes.`

**Belief 3** (scale: `'lg'`, third slot):
- **Headline:** `Fast enough that you don't notice.`
- **Body:** `Most sites feel slow the second you scroll. Mine don't. Speed isn't a perk. It's the line between "premium" and "pretending."`

**Copy invariant (site-wide rule).** No em dashes, no en dashes, no hyphens anywhere in headline or body strings. Enforced by a `beliefs.data.test.ts` regex guard that fails the test suite if any string in the exported array matches `/[—–-]/`.

### 5.2 Block layout

Each `<BeliefBlock />` renders an `<article>` with:

- **Desktop (≥1024px):** two-column CSS grid, `grid-cols-[1fr_minmax(0,480px)] gap-16`. Headline hangs in the left column, body sits in the right column.
- **Tablet (≥768px):** single column, `grid-cols-1 gap-6`. Headline on top, body below at ~60ch.
- **Mobile (<768px):** single column, `grid-cols-1 gap-4`. Headline on top, body below, full width.

Root element receives `data-philosophy-block` (for ScrollTrigger selection) and `data-scale="lg" | "xl"` (for test assertions + styling hooks).

### 5.3 Headline

- Tag: `<h3>`
- Font: Comico
- Color: `#F5F5F0` (warm off-white)
- Weight: regular (Comico has one weight)
- Line-height: `1.05`
- Letter-spacing: `-0.01em`
- Scale:
  - `scale: 'xl'` → `120px` desktop, `80px` tablet, `48px` mobile
  - `scale: 'lg'` → `96px` desktop, `64px` tablet, `40px` mobile
- Alignment: left
- Margin-bottom: `20px` (gold rule sits beneath via a child `<span>`, not a margin)

### 5.4 Gold rule (inside each block)

- Tag: `<span aria-hidden="true" data-philosophy-rule>` as a direct sibling of the `<h3>` inside the headline column
- Height: `2px`
- Color: `#C8A55C` (accent gold, full opacity)
- Initial width: `0`
- Final width: `160px` desktop, `120px` tablet, `96px` mobile
- Position: block-level, directly beneath the headline, `margin-top: 12px`
- Margin-bottom: `40px lg:0` (adds breathing room below the rule on mobile + tablet single-column layouts; on desktop ≥1024px, the two-column grid gap handles separation)

### 5.5 Body

- Tag: `<p>`
- Font: Permanent Marker
- Size: `22px` desktop, `20px` tablet, `18px` mobile
- Color: `#F5F5F0`
- Line-height: `1.55`
- Letter-spacing: `0.01em`
- Max-width: `480px` (enforced by the grid column, so no utility needed)
- Alignment: left

### 5.6 Vertical rhythm between blocks

- Desktop: `space-y-32` (128px between blocks)
- Tablet: `space-y-24`
- Mobile: `space-y-20`

The rhythm is deliberately generous. These are statements; they need room.

---

## 6. Motion

### 6.1 Per-block entrance

Driven by `PhilosophyClient` via `gsap.registerPlugin(ScrollTrigger)`. One ScrollTrigger per block (three total). Each fires when its block's top crosses 80% of the viewport.

**Headline:** opacity `0 → 1` + translate y `24px → 0`, duration `0.7s`, ease `power2.out`.

**Gold rule:** width `0 → {160|120|96}px`, duration `0.6s`, delay `0.15s`, ease `power2.out`. Width animated via `width` property (not `scaleX`) so the rule draws from left to right.

**Body:** opacity `0 → 1` + translate y `24px → 0`, duration `0.7s`, delay `0.08s`, ease `power2.out`.

Three staggered-ish entries per block, but the stagger is within the block, not across blocks. Blocks themselves fire independently as the reader scrolls through.

### 6.2 Eyebrow + heading (section-level)

One ScrollTrigger for the eyebrow — fade + translate y as specced in §3. No other section-level motion.

### 6.3 Reduced motion

`PhilosophyClient` early-returns if `window.matchMedia('(prefers-reduced-motion: reduce)').matches`. In that state:

- Eyebrow, headlines, body, and gold rules all render in their final state
- Inline styles / CSS ensure `opacity: 1`, `transform: none`, `width: {final}`
- No GSAP instance is created
- Section is fully readable and self-consistent

### 6.4 Cleanup

All GSAP instances live inside `gsap.context(() => {...}, section)`. `PhilosophyClient`'s `useEffect` returns `() => ctx.revert()`, which tears down triggers on unmount.

---

## 7. Accessibility

- **Landmarks.** `<section>` has `aria-labelledby="philosophy-heading"`. The eyebrow is the landmark heading (`<h2>`). Each belief uses `<h3>`.
- **Semantic structure.** `<h2>` → three `<h3>` children, each inside an `<article>` with `<p>` body. Outline is clean in screen readers.
- **Decorative elements.** Both bookend rules and the per-block gold rule carry `aria-hidden="true"`. Screen readers skip them.
- **Contrast.** `#F5F5F0` on `#0B2422` is AAA by a wide margin (≈15:1). Gold `#C8A55C` is used only for the eyebrow and rules — both decorative or landmark labels, both meet AA on the deeper teal.
- **Keyboard.** No focusable content in this section. Tab order flows from Case Study → (Philosophy skipped) → next section. No trap risk.
- **Reflow at 320px.** Tested in implementation: blocks stack, headlines wrap at smaller size, no horizontal overflow.
- **Reduced motion.** Covered in §6.3.

---

## 8. Tokens

No new tokens. Reuses existing:

- `--bg-secondary` (deeper teal `#0B2422`) — section background
- `--text-primary` (warm off-white `#F5F5F0`) — headlines + body
- `--accent-gold` (`#C8A55C`) — eyebrow + rules
- `--font-comico` — headlines
- `--font-marker` — eyebrow + body

No new CSS keyframes. No new utility classes.

---

## 9. Data shape

```ts
// src/components/sections/Philosophy/beliefs.data.ts
export type Belief = {
  readonly id: string;
  readonly headline: string;
  readonly body: string;
  readonly scale?: "lg" | "xl";
};

export const beliefs = [
  {
    id: "proof-not-ceiling",
    headline: "If I can do this for myself, imagine what I'd do for you.",
    body: "NextUp, the case study above, is my own company. I built the site, the brand, the product. It's proof of capability, not the ceiling of it.",
    scale: "xl",
  },
  {
    id: "one-person-every-decision",
    headline: "One person. Every decision.",
    body: "I don't outsource the taste. Typography, motion, copy, the 200ms on a button press. Those are mine. The standard is \"would I ship this on my own site?\" That standard doesn't loosen when the logo on the brief changes.",
    scale: "lg",
  },
  {
    id: "fast-enough",
    headline: "Fast enough that you don't notice.",
    body: "Most sites feel slow the second you scroll. Mine don't. Speed isn't a perk. It's the line between \"premium\" and \"pretending.\"",
    scale: "lg",
  },
] as const satisfies readonly Belief[];
```

The `as const satisfies` pattern preserves string literal types for test assertions and allows future additions without widening.

---

## 10. Assets

**None.** No image captures, no video, no SVG imports. The section is pure type + a gold rule drawn via CSS/GSAP.

---

## 11. Testing strategy

### 11.1 Unit tests (Vitest + RTL)

- **`beliefs.data.test.ts`**
  - Exports an array of exactly three entries
  - Each entry has non-empty `id`, `headline`, `body`
  - IDs are unique
  - `scale` is `undefined`, `"lg"`, or `"xl"`
  - **No entry's `headline` or `body` contains `—`, `–`, or `-`** (regex guard — this is the site-wide copy rule made testable)

- **`BeliefBlock.test.tsx`**
  - Renders `<article>` with `data-philosophy-block` attribute
  - Renders `<h3>` with the headline text
  - Renders `<p>` with the body text
  - Renders a `<span aria-hidden="true" data-philosophy-rule>` inside the headline column
  - Applies `data-scale="lg"` or `data-scale="xl"` to the root when the prop is set
  - Defaults to `data-scale="lg"` when the prop is omitted

- **`Philosophy.test.tsx`**
  - Renders `<section id="philosophy" aria-labelledby="philosophy-heading">`
  - Renders `<h2 id="philosophy-heading">` with text `OUR PHILOSOPHY`
  - Renders exactly three `<BeliefBlock />` instances
  - Renders the two static bookend rules (by `data-philosophy-bookend` attribute)

- **`PhilosophyClient.test.tsx`**
  - Early-returns when `prefers-reduced-motion: reduce` matches (no `gsap.context` is created)
  - Creates one ScrollTrigger per `[data-philosophy-block]` when motion is allowed
  - Calls `ctx.revert()` on unmount

### 11.2 Browser verification (playwright-cli)

Script: `scripts/verify-philosophy.mjs`. Headless Chromium with the autoplay-policy flag (consistent with `verify-case-study.mjs`). Viewports: desktop 1920×1080, tablet 768×1024, mobile 375×812 at 2× DPR. Per viewport, three scroll positions:

- `01-pre-reveal` — section just entering viewport, blocks still hidden
- `02-mid-reveal` — scrolled so the second belief is centered, first revealed and third unrevealed
- `03-post-reveal` — scrolled past, all three revealed

Plus one `desktop-reduced-motion.png` with the Playwright context set to `reducedMotion: "reduce"`.

Output: `docs/verification/2026-04-18-philosophy/` + `NOTES.md` summarising findings per viewport.

---

## 12. Phase scope

### In scope

- Everything above: markup, motion, tokens reuse, data file, tests, page integration, browser verification, audit + polish.
- Retroactive update to the Project Log + plan checkboxes on phase completion.

### Explicitly out of scope

- **Retroactive dash/hyphen audit of existing sections.** Hero, Services, Case Study, Layout shell copy all predate the no-dashes rule and likely contain violations. This is a separate cleanup phase, tracked as a follow-up. Not bundled here.
- **Process section (§2.6).** Next phase after Philosophy.
- **Contact section (§2.7).** Phase after Process.
- **Any interactive element in Philosophy** (buttons, links, toggles). Philosophy is read-only.
- **A separate image asset** for Philosophy. Copy and type carry the full weight.

---

## 13. Risks + mitigations

| Risk | Mitigation |
|---|---|
| Philosophy reads boring after the cinematic Case Study | Scale asymmetry (xl first belief) + asymmetric two-column composition + one crafted gold-rule draw per block. Type carries the load; quiet is the feature, not the bug. |
| Future copy edits accidentally reintroduce dashes | `beliefs.data.test.ts` regex guard fails the suite on any violation. Can be extended to other sections as part of the follow-up audit. |
| Per-block ScrollTrigger count (three here, plus one for eyebrow) adds to pin-budget concerns | Philosophy has no pin. Four non-pinned ScrollTrigger instances are cheap (each is a single fade/translate). No performance risk. |
| Gold rule width animation vs `scaleX` — width triggers layout | Only 2px tall, ≤160px wide, animated on entrance (not continuously). Layout cost is one-time per block. If it's a problem in audit, swap to `transform: scaleX` + `transform-origin: left`. |
| Copy doesn't land for visitors who skipped the Case Study | Belief 1 assumes the reader has seen NextUp above. If analytics show skip behaviour, the phrase "the case study above" can be swapped to "my company NextUp" in a later copy pass. Low risk — natural scroll order puts Case Study first. |

---

## 14. Commit cadence

Per project convention:

- One commit per completed task.
- Push to `origin main` immediately after each commit.
- Tests, `tsc --noEmit`, `npm run lint`, and (before final phase-complete commit) `npm run build` all green.

---

## 15. Success criteria

- Three beliefs render in the correct order at the correct scales across all three viewports.
- Entrance motion fires exactly once per block, on scroll into view, with the specced timing.
- `prefers-reduced-motion: reduce` disables all motion; section remains fully readable.
- `beliefs.data.test.ts` fails if any dash or hyphen is introduced into copy.
- All tests pass; `tsc`, lint, and prod build green.
- Browser verification captures commit cleanly to `docs/verification/2026-04-18-philosophy/`.
- Project Log transitions to `philosophy-complete` with commit SHAs recorded.
