# Case Study — Browser Verification (2026-04-18)

Captured via `scripts/verify-case-study.mjs` against the live dev server
(`npm run dev`, Turbopack). Script uses `waitUntil: "load"` + 1500ms settle
(not `networkidle`) to avoid the video-loop hang, and launches Chromium
with `--autoplay-policy=no-user-gesture-required` so the shared `<video>`
plays in headless (otherwise it would stay paused at `currentTime=0` and
render a blank poster area).

## Environment
- Next.js 16.2.4 (Turbopack)
- Playwright Chromium (headless)
- Autoplay policy override: `no-user-gesture-required`
- Captures taken after commit `edf1a59`
  (`fix(FeaturedCase): drop act2 teal bg + maxWidth so video renders full-bleed`)

## Viewports
- Desktop: 1920×1080 @ 2x DPR
- Tablet: 768×1024 @ 2x DPR
- Mobile: 375×812 @ 2x DPR

## Scroll positions
- 01 pre-pin — services still visible, case study entering viewport
- 02 Act 1 — video + overlay copy + micro-chip
- 03 Beat 01 — WHY BLUE + palette strip + hero crop
- 04 Beat 02 — MODERN, NOT LOUD + scroll video
- 05 Beat 03 — SMALL FLOURISHES + magnetic video
- 06 Act 3 — outcome chip + "Selected works ↓"
- 07 SelectedWorks — ledger visible

## The one real regression (fixed)

**`desktop-07-selected` white rectangle** (and its twin, `desktop-02-act-1`
left-panel blank): Act 2's wrapper had both `max-w-[1400px]` and an opaque
teal background. When `gsap.set(act2)` made it `position: absolute; inset: 0;
margin: 0; padding: 0;`, the `margin: 0` killed the Tailwind `mx-auto`
centering but the `max-w-[1400px]` class survived — so act2 became a
1400×1080 teal panel pinned to the left of the 1920px viewport, covering
the video and the Act 1 bottom-left overlay copy.

In headless, the 520px column on the right showed the video paused at
`currentTime=0` (autoplay was blocked), which rendered as a white area —
that's what earlier captures called "the white box". With the fix in
`edf1a59` (remove the inline `background` on act2, add `maxWidth: "none"`
to `gsap.set(act2)`), act2 spans the full width transparently. Beats still
center themselves because their own `maxWidth: "1400px"; margin: auto`
overrides resolve correctly inside a 1920-wide parent.

Re-captured screenshots confirm both are resolved:
- `desktop-07-selected.png`: full-bleed NextUp hero video ("Consultancy
  Built For What's Next") as Act 3 backdrop, no artifact.
- `desktop-02-act-1.png`: NEXTUP — 2026 / "My company. I designed it,
  built it, ship to it." overlay now readable in the bottom-left.

## Verification-tool quirks (not bugs)

These are limitations of the headless capture, not of the page itself.
Listed so a future reader doesn't re-chase them.

1. **Beat offset at the labelled scroll positions.** The pin uses
   `scrub: 0.5`, which means GSAP's timeline progress lags the actual
   scroll by a few frames. At the script's instant `window.scrollTo`, the
   settle time (700ms) usually catches up, but on slower runs frame N may
   still be catching up to frame N+1. Beats always render — just sometimes
   one label ahead of or behind where the filename implies. To force an
   exact progress, drive `ScrollTrigger.getById(...).progress(X)` directly
   rather than scrolling. Left alone because the purpose of these
   captures is "do things render correctly", not "label N lands at exact
   progress X".

2. **Mobile 06-act-3 and 07-selected are the same frame.** The page's
   scrollable height at 375×812 is less than the script's target scrollY
   — scroll gets clamped, both frames land at the page bottom. Expected.

3. **Tablet WHY BLUE palette layout.** At 768px the palette swatch
   renders alone without the hero crop thumbnail (mobile shows them
   side-by-side because the grid stacks to one column). The tablet
   breakpoint renders only the swatch in the reserved asset slot — fine
   visually but an audit follow-up if we want parity.

4. **Beat-02 scroll video poster in headless.** With autoplay enabled
   the video plays; if a future run pauses it, the poster should show
   (not a black rectangle). Nothing to fix now.

## Per-viewport observations

Refer to the individual PNGs in this directory for frame-by-frame detail.
Key takeaways across the set:

- **Desktop** renders all three beats cleanly centered on the 1400px
  content column, over a subtle teal gradient with the video behind.
  Act 3 shows the live NextUp hero full-bleed.
- **Tablet** stacks and wraps gracefully. Beat copy reflows to 2–3 line
  headings as expected.
- **Mobile** shows the linear-stack layout when scrubbed; pin is still
  engaged but the beat cards and outcome panel stack readable-first.
- **Reduced-motion** (`desktop-reduced-motion.png`) cleanly disables the
  pin — beats render as natural-flow stacked cards with the full Beat 01
  asset (palette strip + "U" hero crop side-by-side). This confirms the
  `prefers-reduced-motion` early-return in `FeaturedCaseClient.tsx`
  correctly skips the ScrollTrigger setup.

## Follow-ups for Task 11 audit

- [ ] Tablet: restore the Beat 01 hero-crop thumbnail alongside the
      palette swatch (currently only shows on mobile).
- [ ] Confirm the outcome-chip Lighthouse numbers
      ("Lighthouse 97 · A11y 100 · BP 100") match the live
      nextupco.com audit before final commit.
- [ ] A11y/typography sweep on FeaturedCase + SelectedWorks
      (focus-visible rings for future detail links, reflow at 320px,
      contrast on overlay copy).
