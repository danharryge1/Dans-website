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

All ten captures clean after the thread-alignment fix. Initial captures surfaced a coordinate-space defect: thread container positioned its `top` relative to `section.getBoundingClientRect()` rather than its actual positioned ancestor (`.relative.max-w-[1100px]` wrapper), so the thread sat roughly 200 to 270 pixels below the numerals across every viewport. Fixed in `ProcessClient.tsx` by measuring against `threadContainer.offsetParent.getBoundingClientRect()` instead. Re-captured: dots now land on the vertical centers of numerals 01 / 02 / 03 on desktop, tablet, and mobile. Thread line extends cleanly between dot 1 and dot 3. Reduced-motion frame confirms all content renders in final position with thread fully drawn (scaleY 1) and all three dots visible; no opacity/offset animations present.

## Follow-up

- Reduced-motion dot stacking: `positionThread()` is skipped on `prefers-reduced-motion: reduce`, so all three dots inherit their initial `top: 0` instead of their computed Y-centers. Current reduced-motion capture shows dots stacked at the top of the thread container. Visually harmless (dots remain on the gold rail, no overlap with text), but worth addressing in a later polish pass by running `positionThread()` once even in reduced-motion mode.
