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

---

# Task 12 re-measure — 2026-04-18

## Lighthouse (production build, desktop preset, headless)
- **Performance: 97** (was 69 on dev — gap was Turbopack dev-server noise as suspected)
- **Accessibility: 100**
- **Best Practices: 100**

Supporting metrics:
- First Contentful Paint: 0.2 s
- Largest Contentful Paint: 0.8 s
- Total Blocking Time: 140 ms
- Cumulative Layout Shift: 0
- Speed Index: 0.5 s

Report: `lighthouse-prod.report.html` + `lighthouse-prod.report.json`.

## Polished screenshots
Three 1920×1080 captures post-runway-fix to verify the seam sweep:
- `1920-0-polished.png` — Draft (old NextUp "Built For The Bold") fully shown, seam near left.
- `1920-40-polished.png` — seam partway across; Reality (new NextUp "Consultancy Built For What's Next") revealed on the left; sparkles visible.
- `1920-100-polished.png` — Reality fully revealed, footer visible (pin has released), sparkles full-opacity.

Generated via `scripts/verify-hero-polished.mjs` against `next start` on :3000.

## Task 12 outcomes

### Fixed
- **Runway (P0):** desktop ScrollTrigger now pins the hero for `end: "+=100%"` (one viewport of scroll). Seam sweeps 0→100 across the width, independent of page length. Previously saturated at ~40% on desktop/tablet because the hero was the only section. (commit `72009cf`)
- **Reduced-motion sparkle + side-label parity (P1.3):** the reduced-motion short-circuit now also tweens sparkles to `opacity: 1` and side labels to `opacity: 0` in the same 0.6s ramp, so reduced-motion users land in the same end-state as scroll-complete. Previously sparkles stayed at `opacity: 0` (inline) and Draft/Reality labels never faded. (commit `d2382e9`)
- **Image intrinsic dims (P1.13):** `<img src="/assets/hero/nextup-old.webp">` now carries `width={1120}` / `height={700}` (decoded from VP8X header) as an LCP hint. (commit `d2382e9`)

### Verified correct — no change
- P1.1 single top-level `<h1>` on the page.
- P1.2 `<section id="hero" aria-labelledby="hero-heading">` wired.
- P1.4 `<video>` is `aria-hidden="true"`, sr-only context paragraph covers the live preview semantics.
- P1.5 Sub-headline `--text-secondary` (#B3C9BB) on `--bg-primary` (#0D544C) ≈ 4.8:1 — clears WCAG AA.
- P1.6 Scroll hint is `aria-hidden="true"` with no focusable children — not keyboard-reachable.
- P1.7 Float y: -8 subtlety preserved per DoR.
- P1.8 Sparkle stagger (delays 0.0–0.32, 400ms duration with `power2.out`) reads one-by-one.
- P1.9 Reduced-motion snap ease (`power2.out`, 0.6s) stays within "linear(ish)" allowance — no change needed.
- P1.10 Headline wraps to 2 lines max at 375, not 3+.
- P1.11 Laptop content legible at 375 per original mobile captures.
- P1.12 Video `preload="metadata"` + poster=`nextup-live-poster.webp` already set.

### Polish pass
Skipped commit #3 — the requested "1px gold accent at the seam column" is already implemented in `HeroScreen.tsx` lines 89-110 (2px gold-accent rule + 22px knob with gold border and glow). No gaps in micro-interactions on review. Per the "if nothing reads as missing, do nothing" guardrail: no change.

### Deferred / remaining concerns for final phase review
- None of the audit items were deferred.
- Noted for final-phase code review: the hero now pins for +=100%. When Services / subsequent sections are added below, the pin space still works but the scrub will now feel like "section 1 reveals, pin releases, section 2 begins" — the current behaviour is a feature, not a bug, but worth confirming at phase-end once there's real content below.
