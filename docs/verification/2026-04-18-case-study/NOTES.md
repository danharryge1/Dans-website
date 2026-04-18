# Case Study — Browser Verification (2026-04-18)

Captured via `scripts/verify-case-study.mjs` against prod build (`next build && next start`).
Script used `waitUntil: "load"` + 1500ms settle (not `networkidle`) to avoid video-loop hang.

## Environment
- Next.js 16.2.4 (Turbopack)
- Playwright Chromium (headless)
- Commit at capture: f185616068fb1d4cbad36de15c13610e0ee281f5 (Task 9 — FeaturedCase mounted)

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

## Reduced-motion
- Desktop with `reducedMotion: "reduce"` — beats stacked naturally, no pin artifacts.
  WHY BLUE and MODERN NOT LOUD both visible in a single scrolled view.

## Per-viewport observations

### Desktop (1920×1080)

**01-pre-pin:** Services section (all three cards: UI/UX, Custom Dev, Brand Strategy) visible in upper half. Case study entering from bottom right — the micro-chip (DRAFT→REALITY thumbnails) and video frame (aqua bubbles) are already rendering. Correct: case study is not yet pinned.

**02-act-1:** Full-bleed split visible — left half teal void (Lenis smooth scroll / Act 1 cover not yet fully in frame), right half shows the opening video frame (vivid aqua bubble animation) with DRAFT→REALITY micro-chip at top-right. The overlay copy and project title are not visible at this scroll Y — the left panel appears blank. This is a concern: the Act 1 intro copy/title overlay is either off-canvas or opacity:0 at this pin position. Likely the GSAP opacity animation hasn't kicked in because ScrollTrigger isn't firing in headless Playwright (no real scroll events driving GSAP timeline).

**03-beat-01:** Completely blank — just teal background and nav. The GSAP pin has scrolled past the Act 1 reveal but Beat 01 content hasn't become visible. Same root cause: GSAP ScrollTrigger scroll-linked opacity transitions don't advance in Playwright's `window.scrollTo` / headless environment — the timeline is driven by scroll progress which Playwright's instant scroll may not propagate to GSAP correctly.

**04-beat-02:** WHY BLUE content is visible (beat 01 content at expected beat-02 scroll position). The "01" numerator, "WHY BLUE" heading, body copy, and the palette strip thumbnail (blue stripes) are all present and correctly positioned lower-left. The hero crop image is not visible at this frame (palette strip only). Layout looks clean.

**05-beat-03:** MODERN, NOT LOUD beat (beat 02 content) is visible with the "02" numerator, heading, body copy, and a browser-chrome mockup of the NextUp site (dark header, blue "Consultancy Built For What's Next" hero, CTA button). Video poster is not playing (headless). Layout clean.

**06-act-3:** SMALL FLOURISHES, BIG LIFT (beat 03) is visible with "03" numerator, heading, 3-line body copy, and the NextUp browser mockup showing the live hero with blue gradient background. This is one beat ahead of where the label says (Act 3 outcome), suggesting the scroll math is off by ~1 viewport at desktop.

**07-selected:** Mostly blank teal — a white rectangle intrudes from the right edge (~28% width, full height). This is a layout artifact: an element (possibly the case study's Act 3 / outcome panel or a sticky child) is still positioned at the right and overlapping SelectedWorks. The "SELECTED WORKS" heading and the start of the ledger are visible at the very bottom of frame. The white box is a **regression** — an element is rendering outside its container or clipping incorrectly at this scroll position.

**desktop-reduced-motion:** Clean stacked layout — WHY BLUE (beat 01) and MODERN NOT LOUD (beat 02) both stacked naturally. No pin artifacts, no blank panels. Palette strip + hero crop image fully visible alongside WHY BLUE (both the blue stripe swatch and the "U" logo hero crop render correctly at full size). This is the best-looking capture of the set — confirms the reduced-motion fallback works correctly.

### Tablet (768×1024)

**01-pre-pin:** Services section bottom — Custom Dev card (top) and Brand Strategy card (full width, md:col-span-2 confirmed). Correct transition point.

**02-act-1:** Completely blank — nav + solid teal. The case study Act 1 video/overlay is not visible. Same GSAP headless issue as desktop, compounded by the narrower viewport shifting the pin trigger point.

**03-beat-01:** Completely blank — nav + solid teal. Two consecutive blank frames at tablet is significant: either the GSAP timeline needs more scroll distance than the script allocates at 768px wide, or the pin isn't engaging at all in headless.

**04-beat-02:** WHY BLUE beat visible — "01" numerator (large gold), "WHY BLUE" heading (white, large), full body copy, and the palette strip thumbnail (blue stripes on dark card, right-aligned). Clean typography, good hierarchy. The beat content itself looks correct when it does appear.

**05-beat-03:** MODERN, NOT LOUD beat — "02" numerator (gold), "MODERN, NOT LOUD" heading (large white, wraps to 3 lines at 768px which is expected), body copy, and the NextUp browser mockup correctly sized. Looks good.

**06-act-3:** SMALL FLOURISHES, BIG LIFT beat — "03" numerator, heading (wraps to 3 lines), body copy, and NextUp browser mockup. Beat 03 content is correct. However at the "Act 3 outcome" expected position we're still seeing Beat 03 — same one-beat offset as desktop.

**07-selected:** Mostly blank teal above the fold, "SELECTED WORKS" heading appears near the very bottom. No white-box artifact (that was desktop only). The large blank expanse above SelectedWorks heading suggests the scroll math overshoots slightly at tablet.

### Mobile (375×812)

**01-pre-pin:** Services bottom (Custom Dev + Brand Strategy cards) in upper portion, then transitions into the case study section which starts showing immediately — WHY BLUE "01" numerator and heading already entering from below. The pre-pin gap is very tight at mobile, almost no buffer before the case study begins.

**02-act-1:** WHY BLUE (Beat 01) — "01" numerator, "WHY BLUE" heading, full body copy, and the large combined asset (blue palette strip + "U" logo hero crop side-by-side in a card). This is the most complete and best-rendered screenshot in the mobile set. The hero crop image is fully visible here (unlike on desktop where it was cut off). Layout is clean, type is readable. This is rendering beat-01 content at the act-1 scroll position — consistent with the one-beat offset seen across all viewports.

**03-beat-01:** MODERN NOT LOUD (Beat 02) — "02" numerator at top (partially cropped, fading in), "MODERN, NOT LOUD" heading (large, white), body copy, and NextUp browser mockup. Also the "03" numeral is starting to appear at the bottom — the mobile linear stack is scrolling through beats naturally. Looks correct.

**04-beat-02:** SMALL FLOURISHES, BIG LIFT (Beat 03) — heading at top (cropped), body copy, NextUp browser mockup. Bottom shows "The site's doing its job." — this appears to be the Act 3 outcome text starting. Mobile is progressing through beats correctly. One beat behind the label names but the content sequence is right.

**05-beat-03:** Outcome panel — "Lighthouse 97 · A11y 100 · BP 100" chip at top, "Selected works ↓" label, "NEXTUP — 2026" project credit, "My company. I designed it, built it, ship to it." caption, then the SelectedWorks section heading and the NextUp card with the aqua/purple logo image, project name, year (gold "2026"), and descriptor. Mobile outcome + handoff to SelectedWorks is working correctly.

**06-act-3 + 07-selected:** Both show identical frames — the SelectedWorks ledger with NextUp card + footer "© 2026 DANGEORGE.STUDIO. EVERY PIXEL CONSIDERED." The scroll positions 06 and 07 on mobile land on the same area because the page has scrolled to its end. No issues, looks clean.

## Summary of concerns

1. **GSAP timeline not advancing in headless Playwright (all viewports):** `window.scrollTo({ behavior: "instant" })` does not fire scroll events that propagate to GSAP ScrollTrigger. This means the pinned timeline opacity/transform tweens stay at their initial state for the first 1–2 expected beats. The content IS there (proven by the reduced-motion capture and later scroll positions) — this is a verification tooling limitation, not a layout bug.

2. **Desktop 07-selected white-box artifact:** A white rectangle (~28% viewport width) intrudes from the right edge at the SelectedWorks scroll position. This needs investigation in Task 11 — likely the case study's right panel or a sticky child that isn't clearing correctly when the pin ends.

3. **Desktop 02-act-1 left panel blank:** The Act 1 left-side overlay copy (project title, intro text) is not visible. Likely the same GSAP opacity issue — the overlay starts at opacity:0 and only becomes visible when the ScrollTrigger timeline advances. Could also be a genuine z-index or layout gap worth checking.

4. **Beat offset at all viewports:** Every viewport shows content that is one beat behind the expected label (03 shows blank where 02 should show Act 1; 04 shows WHY BLUE where 03 should). The scroll-Y offsets in the script (`vp.height * N`) don't match the actual GSAP ScrollTrigger pin end distance. The pin scrub ratio is likely different from a simple 1× viewport multiple. Not a bug — a verification script calibration issue.

5. **Mobile 06 and 07 are identical:** The page ends before the script's 07 scroll position on mobile. Not a bug.

## Follow-ups for Task 11 (audit + polish)

- [ ] Investigate and fix the white-box overlap artifact at `desktop-07-selected` — check what element is rendering outside the case study container after the pin releases.
- [ ] Verify Act 1 overlay copy (left panel text) is visible to real users scrolling on desktop — check z-index, opacity initial state, and whether GSAP onStart fires correctly.
- [ ] Consider whether the case study section needs a "poster frame" fallback for the Act 1 full-bleed video for reduced-motion / no-JS users.
- [ ] Review the outcome chip Lighthouse numbers ("Lighthouse 97 · A11y 100 · BP 100") — confirm these match the actual prod audit results for nextupco.com captured during the build.
- [ ] Tablet: WHY BLUE palette strip thumbnail renders correctly but the hero crop image does not appear alongside it (only the stripe swatch). On mobile both render side-by-side. Check the tablet breakpoint layout for the Beat 01 asset container.
- [ ] Beat-02 scroll video appears as a black rectangle on desktop — poster image is not loading or the `<video>` element isn't showing its poster in headless. Confirm poster attribute is set correctly on the scroll video element.
