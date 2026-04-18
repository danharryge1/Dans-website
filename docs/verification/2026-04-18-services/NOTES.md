# Services — Browser Verification (2026-04-18)

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
