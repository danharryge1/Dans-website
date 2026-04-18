# Philosophy — Browser Verification (2026-04-18)

Captured via `scripts/verify-philosophy.mjs` against the live dev server
(`npm run dev`, Turbopack). Script uses `waitUntil: "load"` + 1500ms
initial settle, then 900ms settle per scroll position to let
ScrollTriggers fire and tweens land.

## Environment
- Next.js 16.2.4 (Turbopack)
- Playwright Chromium (headless)
- Autoplay policy override: `no-user-gesture-required` (parity with
  case-study verify script; Philosophy has no video but keeps the flag
  for consistency)

## Viewports
- Desktop: 1920×1080 @ 2× DPR
- Tablet: 768×1024 @ 2× DPR
- Mobile: 375×812 @ 2× DPR

## Scroll positions
- 01 pre-reveal — section top still below viewport, blocks unrevealed
- 02 mid-reveal — middle belief centered, first fully revealed
- 03 post-reveal — all three revealed, bottom bookend rule visible

## Per-viewport observations

### Desktop

**01-pre-reveal:** The section label "Our Philosophy" is visible with a
horizontal separator rule. The first belief ("IF I CAN DO THIS FOR
MYSELF...") is entering the frame — headline on the left in large
handwritten display type, body copy on the right in smaller italic caps.
The two-column grid is clearly established at this scroll position.

**02-mid-reveal:** The first belief's closing lines ("FOR MYSELF,
IMAGINE WHAT I'D DO FOR YOU.") fill the viewport. A short gold underline
rule is drawn beneath the final word "YOU." — confirming the ScrollTrigger
animation has fired. The right column body copy is not visible at this
position (scrolled past), which is expected for a belief this large.

**03-post-reveal:** Two further beliefs are visible. "ONE PERSON. EVERY
DECISION." occupies the upper portion with its gold underline rule drawn
beneath. Below it, "FAST ENOUGH THAT YOU DON'T NOTICE." is fully
revealed with its own gold underline and body copy ("Most sites feel slow
the second you scroll...") visible to the right. Scale asymmetry is
evident — the first belief is noticeably larger display type than the
second and third, matching the intended hierarchy. No layout glitches, no
horizontal overflow, no missing gold rules.

### Tablet

**01-pre-reveal:** Single-column layout confirmed. The Selected Works
section is visible above the teal-to-deep-teal transition. "Our Philosophy"
section label appears with separator rule and the first belief headline
("IF I CAN DO THIS FOR MYSELF, IMAGINE WHAT...") begins at the bottom of
the frame. Readable at this breakpoint.

**02-mid-reveal:** First belief completes ("WHAT I'D DO FOR YOU.") at
the top, gold underline visible beneath the last line. Below it, "ONE
PERSON. EVERY DECISION." is fully revealed with its gold rule, and "FAST
ENOUGH THAT YOU DON'T NOTICE." begins entering the frame at the bottom.
Body copy reads comfortably at approximately 60ch width. All three
beliefs are visible within one viewport, confirming the stacked
single-column layout renders correctly at 768px.

**03-post-reveal:** "ONE PERSON. EVERY DECISION." and "FAST ENOUGH THAT
YOU DON'T NOTICE." both fully visible with gold underlines and their
respective body paragraphs. The footer ("© 2026 DanGeorge.Studio. Every
pixel considered.") is visible at the bottom, confirming the section
ends cleanly. No overflow, no clipping.

### Mobile

**01-pre-reveal:** After the Selected Works card, the section label "Our
Philosophy" appears in gold with a separator line. The first belief
headline begins at the bottom — "IF I CAN DO THIS FOR MYSELF, IMAGINE..."
— with generous line spacing that remains legible at 375px. Hamburger
menu icon visible in the top right (nav collapses correctly).

**02-mid-reveal:** First belief completes ("WHAT I'D DO FOR YOU.") with
its gold underline. Body copy ("NextUp, the case study above, is my own
company...") reads cleanly below it. "ONE PERSON. EVERY DECISION." is
then visible with its gold rule. Text wraps naturally across two lines
with no awkward breaks. No horizontal overflow observed.

**03-post-reveal:** "FAST ENOUGH THAT YOU DON'T NOTICE." displayed as a
two-line headline with gold underline. Body copy ("Most sites feel slow
the second you scroll...") follows beneath, fully legible. Footer is
partially visible at bottom. No layout glitches.

## Reduced motion

`desktop-reduced-motion.png`: The Philosophy section renders immediately
in its final revealed state with no animation artifacts. The "Our
Philosophy" section label and horizontal rule are visible at the top. The
first belief ("IF I CAN DO THIS FOR MYSELF, IMAGINE WHAT I'D...") is
shown fully in two-column layout with body copy on the right — content is
in its fully-revealed end state, consistent with reduced-motion behavior
where tweens skip to completion. Gold rules are at full final widths. No
partial-motion states or invisible text detected. The viewport only
captures the first belief at this scroll position, but the section is
rendering correctly.

## Follow-ups for Task 8 audit

- [ ] Confirm tsc, lint, prod build are all green.
- [ ] Manual a11y check: tab order skips the section cleanly (no
      focusable content); `aria-labelledby` resolves correctly.
- [ ] Manual reflow check at 320px viewport.
- [ ] Confirm no dashes/hyphens in rendered copy (test already enforces
      it at the data layer, but a visual check is cheap).
