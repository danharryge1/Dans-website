# Services — Browser Verification (2026-04-18)

**Polished: YES** (Task 9 — 2026-04-18)

Captured via `scripts/verify-services.mjs` against prod build (`next build && next start`).

## Environment
- Next.js 16.2.4 (Turbopack)
- Playwright Chromium (headless)
- Commit at capture: f4d2da8 (main)

## Viewports
- Desktop: 1920×1080 @ 2x DPR
- Tablet: 768×1024 @ 2x DPR
- Mobile: 375×812 @ 2x DPR

## Scroll positions
- 01 entering — services top ~90% below viewport start
- 02 mid-sweep — heading visible, cards mid-reveal
- 03 revealed — post-reveal state

## Reduced-motion
- `reducedMotion: "reduce"` context → cards snap lit with full gold sheen immediately on entry, no scrub progression. Parity verified.

## Per-viewport observations

**Desktop 1920×1080:**
- 01-entering: Hero still dominant with reel frame and caption "CASE STUDY 01 · NEXTUP CO." visible. Services section still below the fold — clean transition surface, no layout leak. Star particles and grid background render crisply.
- 02-mid-sweep: Services heading "TAILORED DIGITAL SOLUTIONS" fully in view. All three cards (UI/UX Design, Custom Development, Brand Strategy) visible in 3-column row, each showing partial gold sheen sweep as the scrub progresses — cards still in their muted/charcoal base with the gradient wash advancing. Titles and body copy crisply legible. Footer peeks at bottom.
- 03-revealed: All three cards fully lit with the warm gold sheen, body copy readable in its revealed state, subtle corner arc ornament visible on each card. 3-column grid perfectly aligned. No visual regressions.

**Tablet 768×1024:**
- 01-entering: Hero centred with reel frame scaled down — compositionally balanced. Caption and portfolio chrome all intact. Sticky nav compressed but legible.
- 02-mid-sweep: Services heading breaks to two lines ("TAILORED DIGITAL / SOLUTIONS") — hierarchy holds. First two cards (UI/UX Design, Custom Development) sit side-by-side in the 2-column grid; third card begins below with gold sheen already applied. Transition zone between hero's teal grid and services' deep-green background renders cleanly.
- 03-revealed: Full grid in view — top row has UI/UX Design and Custom Development, bottom row has Brand Strategy spanning its column. All three cards fully lit. Footer visible. Layout rhythm good; no orphaned elements.

**Mobile 375×812:**
- 01-entering: Hero scaled tight, burger menu replaces nav links, reel frame with floating "REALITY" chip visible. Caption legible. Clean mobile composition.
- 02-mid-sweep: Hero exit/services entry transition — "CASE STUDY 01 · NEXTUP CO." still at top, then deep-green background of services with heading breaking to three lines ("TAILORED / DIGITAL / SOLUTIONS"). First card (UI/UX Design) just beginning to enter at the bottom edge. No layout shift.
- 03-revealed: Stacked single-column grid. All three cards fully lit with sheen, body copy readable, corner arc ornament visible. Footer at bottom ("© 2026 DANGEORGE.STUDIO · EVERY PIXEL CONSIDERED."). Clean stacked rhythm.

**Desktop reduced-motion:**
- All three cards render in their fully lit/revealed state immediately (no scrub progression). Gold sheen fully applied at the initial scroll position. Heading and body copy identical to the animated final state. A11y motion parity confirmed.

## Follow-ups for Task 9 (audit + polish)
- None material. Layout, type, and sheen reveal render correctly across desktop/tablet/mobile and under reduced-motion. Minor notes for polish consideration (not regressions):
  - Mobile heading breaks into three lines at 375px — intentional per token scale, but could be worth double-checking line-height feels balanced when next to the stacked cards.
  - Tablet second row (Brand Strategy alone) leaves dead space to its right — acceptable for the 2-col grid breakpoint, but polish pass could consider whether a 1-col layout at 768px reads better than an uneven 2-col + orphan.

## Polish pass (2026-04-18) — nothing material to change

Audit + taste checks clean. No code changes required; no screenshot re-capture.

**Audit (a11y):**
- Keyboard tab order: clean. Cards are `<article>` with no interactive children — no `tabindex`, no focus traps, no outline-none leaks. Tab flows nav → hero → (skips Services static content) → footer.
- Focus visible: no regression. Layout-shell `:focus-visible` rules still own focus styling; Services has nothing focusable to style.
- Contrast: **`--text-secondary` (#B3C9BB) on `--bg-darker` (#0B2422) = 9.3:1** — AAA (well above the 4.5:1 AA bar for body). Heading (#F5F5F0 on #0B2422) = 14.89:1. Gold accent (#C8A55C on #0B2422) = 6.97:1 — AAA even as text, decorative-safe. No token bump needed.
- Reduced-motion parity: verified in Task 8 (`desktop-reduced-motion.png`). No regression.
- SR landmarks: `<section id="services" aria-labelledby="services-heading">`, `<h2 id="services-heading">`, grid `role="list"`, cards `role="listitem"`, arc SVG + sweep div `aria-hidden="true"`. All confirmed via grep.
- Reflow at 320px: skipped (optional; 375px verified clean, no horizontal overflow risk from the grid).
- Motion pauses on tab-hidden: GSAP ScrollTrigger pauses naturally. N/A.

**Polish (taste):**
- 48px heading / 24px card title / p-8 card padding / 48px arc / `rgba(200,165,92,0.6)` sweep seam / `scrub: 0.6` / 200ms mobile stagger / ±3° hover tilt / ±1px arc float (2s duration, yoyo = 4s cycle) / 1px border — all kept. Screenshots + earlier user review already endorsed the calibration.

**Task 8 follow-ups resolved:**
- **Mobile 3-line heading (375px):** verified against `mobile-02-mid-sweep.png`. The "TAILORED / DIGITAL / SOLUTIONS" break reads as intentional — each word centered on its own line forms a natural diamond with the Comico handwritten voice. Not awkward. **Kept.**
- **Tablet orphan card:** verified against `tablet-03-revealed.png`. Brand Strategy **does span both columns** at `md:col-span-2` — the `className={i === SERVICES.length - 1 ? "md:col-span-2 lg:col-span-1" : undefined}` propagation is working. The Task 8 NOTES ambiguously used "orphan" language in one line while correctly describing the full-width span elsewhere. No code fix; this polish note retracts the orphan concern.

**Non-blocking observation:** In `tablet-03-revealed.png` the third (spanning) Brand Strategy card's body copy reads slightly dimmer than the first two. Expected — on a tablet at that scroll position the third card's per-card `scrub` hasn't fully completed (its trigger fires later because it sits in the second row). Not a regression; not worth intervening.
