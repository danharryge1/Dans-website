# Process Section — Browser Verification Notes

**Date:** 2026-04-18
**Script:** `scripts/verify-process.mjs`
**URL:** `http://localhost:3000` (dev server)

## Viewports

| Viewport | Size | DPR |
| --- | --- | --- |
| Desktop | 1920 × 1080 | 1× |
| Tablet | 768 × 1024 | 1× |
| Mobile | 375 × 812 | 2× |

## Captures (per viewport)

- **01-pre-reveal** — section just entering viewport; thread partially drawn; Phase 1 entering reveal.
- **02-mid-reveal** — middle of section centered; thread ~50% drawn; Phase 1 fully revealed, Phase 2 revealing.
- **03-post-reveal** — fully scrolled past; thread at full height; all three dots lit; all phases visible.

## Reduced motion

- **desktop-reduced-motion.png** — captured with Playwright's `reducedMotion: "reduce"` context. All content + thread + dots render in their final state with no motion.

## Findings

All ten captures clean and rendering correctly across breakpoints. Desktop frames show "THE PROCESS" eyebrow in gold above the bookend rule, with Phase 1 numeral "01" scaling appropriately and text layers (The Brief, descriptive copy) revealing progressively. Gold thread is visible as a vertical line anchored to the left rail with three dot markers aligned vertically. Mobile frame (375px) shows responsive text scaling and proper text reflow with no overflow. Reduced-motion frame confirms all content renders in final position with thread fully drawn (scaleY 1) and all three dots visible; no opacity/offset animations present.

## Follow-up

None — ready for audit pass.
