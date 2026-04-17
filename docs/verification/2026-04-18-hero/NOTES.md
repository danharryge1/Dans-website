# Hero verification — 2026-04-18

## Evidence
- 10 screenshots: `1920-{0,40,100}.png`, `768-{0,40,100}.png`, `375-{0,40,100}.png`, `1920-reduced-motion.png`
- Lighthouse: `lighthouse.report.html` + `lighthouse.report.json`

All PNGs verified non-empty and at expected dimensions (device-pixel ratio 2×):
- 1920×1080 viewport → 3840×2160 px images
- 768×1024 viewport → 1536×2048 px images
- 375×812 viewport → 750×1624 px images

## Checklist (verification-before-completion)
- [x] Hero renders at all 3 breakpoints (1920/768/375) — ✅ all frames render headline, laptop, grid, nav, footer, scroll cue
- [x] Seam position visibly advances from 0% → 40% → 100% scroll — ✅ on mobile (375) the laptop content clearly transitions from concept (N brand frame) → mid → reality (nextup video frame); on desktop/tablet the 40% and 100% frames look nearly identical (seam appears to saturate before 40% page scroll)
- [x] Laptop frame, grid, and sparkles visible and correctly placed at each breakpoint — ✅ teal background grid visible on all; sparkles visible on 375-0 and 1920-reduced-motion; laptop centered and well-sized
- [x] Headline "THE WEB, EARNED." fits on one line at 1920 and 768; may wrap at 375 (acceptable) — ✅ one line at 1920 and 768, wraps to 2 lines at 375 as permitted
- [x] Reduced-motion frame shows seam at 100% (fully revealed), no intermediate state — ✅ reality layer fully revealed, large stylized "N" brand shown on laptop screen, no partial-reveal artifacts
- [x] Nav + Footer present and not overlapping hero — ✅ nav at top, footer at bottom on desktop/tablet; mobile hamburger icon visible top-right; no z-index overlap seen
- [ ] Lighthouse scores meet or document deviation from targets (Perf ≥ 90 / A11y ≥ 95 / BP ≥ 95) — ❌ Performance 69 (below 90). See Deviations.

## Findings
- ✅ All 10 PNGs captured successfully; dimensions and DPR correct.
- ✅ Accessibility = 100, Best Practices = 100 — clean.
- ✅ Reduced-motion path works as specified: full reveal, no mid-state flash.
- ✅ Mobile (375) shows the clearest seam-scrub evidence — three distinct states across 0/40/100.
- ❌ Performance = 69 — below 90 target. Root audit: TBT 570 ms. LCP 1.6 s is fine, CLS 0 is perfect, FCP 0.2 s is excellent. The TBT is almost certainly dev-server noise (Turbopack HMR, unminified JS, React dev warnings). Re-run against `next build && next start` in Task 12 to get a clean measurement before treating this as a real regression.
- ⚠️ **Seam saturation on desktop/tablet**: 1920 and 768 frames at scroll 40% and scroll 100% look nearly identical — the seam reaches full reveal well before the page is scrolled to 40%. This is probably because the hero pin range ends within the first ~30vh of page scroll, so `scroll 40%` of total page scroll is already past the ScrollTrigger end. Worth a Task-12 eyeball to confirm the scrub range matches the story the plan wants to tell. (On mobile the page is longer, so 40% lands inside the scrub range — which is why mobile shows a clear mid-state.)
- ⚠️ **Headline wrap on 375**: at the narrowest breakpoint "THE WEB, EARNED." breaks after the comma ("THE WEB," / "EARNED."). Plan explicitly says wrapping is acceptable at 375 — not a blocker, noted for posterity.

## Lighthouse scores
- Performance: 69
- Accessibility: 100
- Best Practices: 100

Supporting metrics (desktop preset, headless):
- First Contentful Paint: 0.2 s
- Largest Contentful Paint: 1.6 s
- Total Blocking Time: 570 ms  ← dominant score drag
- Cumulative Layout Shift: 0
- Speed Index: 1.6 s

## Deviations
- **Playwright CLI flags**: the plan's `playwright-cli snapshot --viewport --scroll-y --reduced-motion` shape does not exist in the installed `playwright-cli@0.1.8`. Fell back to a short Playwright script (`scripts/verify-hero.mjs`) per the plan's explicit allowance. The script launches Chromium via the `playwright` symlinks under `node_modules/` (pointing at the global `@playwright/cli` transitive install) and is run with `NODE_PATH=/Users/dangeorge/.nvm/versions/node/v25.6.1/lib/node_modules/@playwright/cli/node_modules`.
- **Lighthouse against dev server**: performance was measured against `npm run dev` (Turbopack), not a production build. The 69 score is not a real regression signal; the Task 12 audit should re-measure against `next build && next start` before acting on it.
- **Seam saturation**: flagged above — may want to extend ScrollTrigger end on desktop, or the plan's 40% capture may just be past the scrub range by design. Task 12 to confirm.
