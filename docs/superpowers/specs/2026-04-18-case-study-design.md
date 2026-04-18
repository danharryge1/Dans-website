# Case Study (NextUp) — Design Spec

**Date:** 2026-04-18
**Phase:** Featured Case + Selected Works ledger (design.md §2.5, adapted)
**Depends on:** Layout shell ✅ · Hero section ✅ · Services section ✅
**Owner:** Dan
**Status:** approved — ready for implementation plan

---

## 1. Purpose

The hero writes a cheque — *CASE STUDY 01 · NEXTUP CO.* — that this phase cashes. Two new homepage sections sit below Services, in this order:

1. **`<FeaturedCase />`** — a pinned, scroll-scrubbed block telling the NextUp story in three acts: setup → thinking → outcome. Depth substitutes for portfolio volume.
2. **`<SelectedWorks />`** — a light horizontal ledger below the featured case. Ships today with one real entry (NextUp) plus an honest "NEXT UP →" placeholder. Grows visibly as projects ship.

The narrative frame is **Director's Commentary** — the *decisions* are the star, not the before/after. The hero already owns draft→reality vocabulary; the case study zooms into *why*.

**Positioning (locked):** NextUp is Dan's own company. The spec treats that as a strength: *"My company. I designed it, built it, ship to it."* No "client" fiction.

---

## 2. Composition

### 2.1 Homepage order after this phase

```
<Hero /> → <Services /> → <FeaturedCase /> → <SelectedWorks />
```

### 2.2 File structure (mirrors Hero/Services convention)

```
src/components/sections/
  FeaturedCase/
    FeaturedCase.tsx            ← Server Component (shell, copy, static beats)
    FeaturedCaseClient.tsx      ← single 'use client' (ScrollTrigger pin, beat scrubs, video lifecycle)
    DecisionBeat.tsx            ← one Act 2 beat (numeral + copy + visual proof slot)
    projects.data.ts            ← typed project array; NextUp = featured:true
    index.ts                    ← re-exports
  SelectedWorks/
    SelectedWorks.tsx           ← Server Component
    WorkCard.tsx                ← one ledger entry
    index.ts                    ← re-exports
```

### 2.3 Extensibility contract

- `projects.data.ts` is the single source of truth for all project metadata.
- `<FeaturedCase />` renders `projects.find(p => p.featured)` — today that's NextUp.
- `<SelectedWorks />` renders the full array (including the featured project).
- For **this phase**, Act 2 copy (the three decision beats) is hardcoded inside `FeaturedCase.tsx` — NOT in the data file. Refactor to data-driven when project #2 ships. Keeps scope tight today.

---

## 3. FeaturedCase — section shell

- Tag: `<section id="case-study-nextup" aria-labelledby="case-study-heading">`
- Width: full viewport
- Background: `#0D544C` (primary teal — lift from Services' deeper `#0B2422` above; breathing transition between sections)
- Pin runway: `500vh` total (4–5 viewport heights of scroll consumed)
- Inner container: `Container` (`max-w-[1400px]`)
- Hidden H2 for a11y: `<h2 id="case-study-heading" class="sr-only">NextUp — featured case study</h2>`

---

## 4. Act 1 — The setup (first ~0.5vh of scrub)

### 4.1 Background video

- Full-bleed `<video>` element, `aria-hidden="true"`, `muted playsInline autoplay loop`
- Sources: `public/assets/hero/nextup-live.webm` + `nextup-live.mp4` (reuse hero assets)
- Poster: `nextup-live-poster.webp`
- Desaturated by 20% (`filter: saturate(0.8)`) so overlay text reads cleanly

### 4.2 Overlay copy (bottom-left)

- Line 1: **NEXTUP — 2026** — Comico, `40px` desktop / `28px` mobile, `--text-primary`, tracking `0.05em`. Render as `<p>` or `<div>`, **not `<h2>`** — the structural landmark heading lives in §3 as the hidden H2. This is display copy.
- Line 2: *My company. I designed it, built it, ship to it.* — Permanent Marker, `18px` desktop / `15px` mobile, `--text-secondary`
- Positioning: `absolute bottom-16 left-12` (desktop), `bottom-10 left-6` (mobile)

### 4.3 Micro-comparison chip (top-right)

- 60×40px crop of `nextup-old.webp` with a 1px gold border and 12px label *"DRAFT"* in Permanent Marker below
- Next to it (right, with a 16px gap): a hair-line `→` arrow in `--gold-accent`
- Then a 60×40px crop of `nextup-live-poster.webp` with a 12px label *"REALITY"*
- Purpose: one-glance callback to the hero's transformation. Intentionally small. Not the star.
- Positioning: `absolute top-16 right-12` (desktop); hidden on mobile (clutters)

### 4.4 Act 1 motion

- Video plays naturally (no scroll-dependency in Act 1)
- Overlay copy enters on pin-start: `opacity 0→1 + y: 20→0`, 500ms `power2.out`
- Micro-comparison chip: fades in 300ms after overlay copy

---

## 5. Act 2 — The thinking (bulk of pin, ~3vh of scrub)

Three **decision beats**, each pinned for ~1 viewport-height of scroll. Beats crossfade vertically — incoming beat slides up from `y: 40 → 0` as outgoing beat fades + slides up to `y: -40`.

### 5.1 Beat layout (identical structure per beat)

- Two-column on desktop (`grid-cols-12`, 5-col copy / 7-col visual proof pane), single-column stack on mobile
- **Left column — decision copy:**
  - Massive numeral: `01` / `02` / `03` — Comico, `120px` desktop / `72px` mobile, `--gold-accent` at 40% opacity (quiet decorative anchor)
  - Decision title — Comico, `48px` desktop / `32px` mobile, `--text-primary`, uppercase, tracking `0.05em`
  - Body paragraph — Permanent Marker, `18px` desktop / `15px` mobile, `--text-secondary`, max-width `52ch`, line-height `1.6`
- **Right column — visual proof pane:**
  - Fixed aspect-ratio `4:3` frame, `rounded-[12px]`, 1px border `var(--services-card-border)`
  - Contents vary per beat (see 5.2)
  - Subtle inner shadow: `inset 0 0 60px rgba(11,36,34,0.4)` to push content back into the frame

### 5.2 Beat content (locked copy, visual proof captured during build)

**Beat 01 — WHY BLUE**

- Copy: *Our competition is loud. I chose blue because trust is the moat — and trust looks calm, not flashy. The whole palette defers to the work instead of shouting over it.*
- Visual proof: palette swatch strip (6 blue tones, deepest → lightest, stacked vertically as 16px-wide bars) on the left half of the pane; cropped NextUp hero screenshot (350×260px, showing the blue in situ) on the right half.

**Beat 02 — MODERN, NOT LOUD**

- Copy: *"Modern" is easy to overdo. The brief was to look like a 2026 company without looking like a demo reel. Every motion decision passes one filter: does it help the user, or just perform for them?*
- Visual proof: 5-second looping video of a gentle NextUp page scroll — cursor-free, unhurried, no flourishes visible. Shows restraint. Muted, autoplay, loop. `aria-hidden="true"`.

**Beat 03 — SMALL FLOURISHES, BIG LIFT**

- Copy: *Magnetic buttons. A full intro sequence. An animated background that responds to the cursor. Tiny craft decisions stacked — none shouting alone, all adding up to a site that feels unmistakably hand-made.*
- Visual proof: 3-second looping video showing a magnetic button engaging (cursor approaches, button lifts + glows) over the animated background. Muted, autoplay, loop. `aria-hidden="true"`.

### 5.3 Beat transition timing

- Each beat owns `1.0vh` of the ~3vh Act 2 window (0–0.33, 0.33–0.66, 0.66–1.0 of Act 2 progress)
- Crossfade overlap: 15% of each beat's window bleeds into the next, so there's never a blank moment mid-scrub
- Driven via a single GSAP timeline scrubbed by ScrollTrigger, labels `"beat-01"`, `"beat-02"`, `"beat-03"`

### 5.4 Reduced-motion parity

- Pin disabled; all three beats render **stacked vertically** in natural flow, each beat rendered at full opacity, no y-translate
- Beat visual-proof videos replaced with the first frame (poster extraction) rendered as a static image
- Beat 01's palette-swatch static proof renders identically (no motion involved)

---

## 6. Act 3 — The outcome (last ~0.5vh of scrub)

### 6.1 Bookend video

- **One single `<video>` DOM node** is rendered once at the top of the pinned region (conceptually: the video is the section's backdrop layer). It starts visible in Act 1, fades to `opacity: 0` during Act 2 while the beats take focus, then fades back to `opacity: 1` in Act 3. Do NOT mount a second video element — same node throughout the pin.
- Transition back to visible in Act 3: `opacity 0 → 1` over 400ms `power2.out` as beat 03 exits.

### 6.2 Outcome copy (centered)

- Line 1: *The site's doing its job.* — Comico, `32px` desktop / `24px` mobile, `--text-primary`
- Line 2 (small-caps chip, centered below with 24px gap):
  **`LIGHTHOUSE 97 · A11Y 100 · BP 100`** — Permanent Marker, `13px`, letter-spacing `0.1em`, border `1px solid var(--gold-accent)`, padding `8px 16px`, `rounded-full`, `--gold-accent` text color
- Line 3 (24px below the chip): *Selected works ↓* — Permanent Marker, `14px`, `--text-secondary`, center-aligned. The `↓` is a unicode arrow; animates with a 1.2s ease-in-out up/down float (2px amplitude, infinite — paused on reduced-motion).

### 6.3 Pin release

- When Act 3 scrub completes, pin releases and natural scrolling resumes → user scrolls into `<SelectedWorks />` below.

---

## 7. SelectedWorks — ledger

### 7.1 Section shell

- Tag: `<section id="selected-works" aria-labelledby="selected-works-heading">`
- Background: `#0D544C` (continuous with FeaturedCase end — no hard break; transition is compositional, not chromatic)
- Vertical padding: `py-24 md:py-32`
- Inner container: `Container` (`max-w-[1400px]`)

### 7.2 Heading

- Text: **SELECTED WORKS**
- Element: `<h2 id="selected-works-heading">`
- Font: Comico, `32px` desktop / `24px` mobile, `--text-primary`, tracking `0.05em`, uppercase
- Alignment: left (not centered — differentiates from Services heading rhythm)
- Margin-bottom: `32px`

### 7.3 Card row

- Desktop: native horizontal scroll (`overflow-x-auto`, `scroll-snap-type: x mandatory`), each card `scroll-snap-align: start`
- Mobile: vertical stack (`flex-col gap-6`)
- Gap between cards: `24px` desktop / `20px` mobile
- **No custom scroller.** Native behavior is obvious, accessible, and reduced-motion safe.

### 7.4 WorkCard anatomy

- Fixed width `320px` desktop / full-width mobile
- Thumbnail: `16:10` aspect-ratio, `rounded-[12px]`, `object-cover`, 1px border `var(--services-card-border)`
- For NextUp: `src="/assets/hero/nextup-live-poster.webp"` (reuse), `alt="NextUp — live homepage"`
- Below thumbnail (16px gap):
  - Project name — Comico, `20px`, uppercase, tracking `0.05em`, `--text-primary`
  - One-line descriptor — Permanent Marker, `14px`, `--text-secondary`, line-height `1.5`
  - Year row — Permanent Marker, `12px`, `--gold-accent`, right-aligned on the descriptor's baseline

**Hover (pointer-fine + motion-OK only):**
- Card lifts `translateY(-2px)`, transition 200ms `ease-out`
- Border color crossfades to `var(--ledger-card-border-hover)` (gold-tinted)
- Thumbnail `scale(1.02)`, 400ms `ease-out`
- Reuses Services hover vocabulary — consistency, not invention

**Click target:** none yet. `<article>` not `<a>`. Future phase wires detail routes.

### 7.5 "NEXT UP" placeholder card

- Same dimensions as a real WorkCard
- No thumbnail — placeholder area is the same 16:10 frame but with:
  - Background `rgba(245,245,240,0.02)`
  - Border `1px dashed rgba(245,245,240,0.2)` (dashed explicitly — visually distinct from real cards)
  - Centered label: *NEXT UP →* — Comico, `20px`, tracking `0.1em`, `--text-secondary` (dimmer than real project names)
- Descriptor row: *New project landing soon.* — Permanent Marker, `14px`, `--text-secondary`, opacity `0.6`
- No year row
- No hover transforms, no hover border color change — the dashed border + dimmed label is its final visual state regardless of pointer state. (Element remains in the DOM flow and discoverable by screen readers — this is styling only, not `pointer-events: none`.)
- `aria-label="Placeholder — new project landing soon"`

### 7.6 Section motion

- On section entry (`start: "top 80%"`, `once: true`): cards stagger-fade in in DOM order
  - Per card: `opacity 0→1 + y: 16→0`, 400ms `power2.out`
  - Stagger: 150ms between cards
  - On desktop, DOM order = visual left-to-right (horizontal row). On mobile, DOM order = visual top-to-bottom (vertical stack). One animation definition, both layouts.
  - Mirrors the motion vocabulary used by Services cards on mobile

**Reduced-motion parity:** cards render at full opacity/position immediately, no stagger.

---

## 8. Tokens (additions to `globals.css`)

```css
:root {
  /* FeaturedCase */
  --case-pin-height: 500vh;
  --case-beat-progress: 0;              /* 0..1, updated per scroll */
  --case-video-desat: 0.8;              /* filter: saturate() value */

  /* SelectedWorks */
  --ledger-card-border-hover: color-mix(in oklch, var(--gold-accent) 30%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-case-beat] {
    opacity: 1 !important;
    transform: none !important;
  }
}

@keyframes case-arrow-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(2px); }
}
```

---

## 9. Data shape — `projects.data.ts`

```typescript
export type ProjectEntry = {
  id: string;                    // slug-safe, e.g. "nextup"
  title: string;                 // display name
  year: number;                  // e.g. 2026
  descriptor: string;            // one-line for ledger card
  thumbnailSrc: string;          // public path
  thumbnailAlt: string;
  featured: boolean;             // true → promoted to <FeaturedCase />
};

export const PROJECTS = [
  {
    id: "nextup",
    title: "NEXTUP",
    year: 2026,
    descriptor: "Trust-first website for a modern service company.",
    thumbnailSrc: "/assets/hero/nextup-live-poster.webp",
    thumbnailAlt: "NextUp — live homepage",
    featured: true,
  },
] as const satisfies readonly ProjectEntry[];
```

---

## 10. Assets

### 10.1 Reuse (no new capture)

- `public/assets/hero/nextup-live.mp4` (Acts 1 + 3 full-bleed video)
- `public/assets/hero/nextup-live.webm`
- `public/assets/hero/nextup-live-poster.webp` (ledger thumbnail + reduced-motion poster + micro-comparison "REALITY" chip)
- `public/assets/hero/nextup-old.webp` (micro-comparison "DRAFT" chip)

### 10.2 New assets — captured during build (Task N-2 in the plan)

All saved to `public/assets/case-study/nextup/`:

- `palette-strip.svg` (or inline SVG in the component) — 6-step blue palette, 16px wide × 260px tall bars
- `beat-01-hero-crop.webp` — 350×260px crop of NextUp hero showing blue in situ
- `beat-02-scroll.mp4` + `.webm` + `-poster.webp` — 5s looping, muted, 720×540px aspect 4:3
- `beat-03-magnetic.mp4` + `.webm` + `-poster.webp` — 3s looping, muted, 720×540px aspect 4:3

Capture via Playwright headful against live `nextupco.com`. Encode with ffmpeg: CRF 28 for `.mp4`, CRF 32 for `.webm`, target ≤300KB per clip.

---

## 11. Accessibility

- `<h2 id="case-study-heading" class="sr-only">` exists even though Act 1 headline is visually an `<h2>`-weighted line — SR landmark intact
- Hidden H2 for SelectedWorks too
- All decorative videos: `aria-hidden="true"`, `muted`, `playsInline`, `autoplay`, `loop`
- Pinned content contains **no focusable elements** — the pin does not trap keyboard focus
- Tab order: Nav → Hero → Services cards (none focusable today) → FeaturedCase (none focusable) → SelectedWorks cards (none focusable today — future work adds Links) → Footer
- Text contrast — all checked against `#0D544C` (primary teal) and `#0B2422` (deeper teal):
  - `--text-primary` (#F5F5F0) on `#0D544C` = 9.8:1 ✅ AAA
  - `--text-secondary` (#B3C9BB) on `#0D544C` = 6.7:1 ✅ AAA (already existed; no bump needed)
  - `--gold-accent` (#C8A55C) on `#0D544C` = 4.9:1 ✅ AA large text / AAA decorative
- Reduced-motion: pin disabled, beats stacked, videos replaced with static posters, float-arrow frozen
- Prefers-reduced-data (future): out of scope for this phase

---

## 12. Testing strategy (per-task, TDD)

Mirrors Services pattern.

- **Vitest + RTL** for component structure, copy presence, a11y attributes
- **Mock GSAP** with chainable timeline factory (reuse the mock helper built for `ServicesClient.test.tsx` — copy it into a shared `src/test/gsap-mock.ts` if it stays identical; otherwise inline)
- **ScrollTrigger.create** assertions: 1 for pin + 3 for beat progress (or 1 timeline with 3 labels — pick one, test both creation and trigger element)
- **ctx.revert** called on unmount
- **Video elements** assertions: correct sources, `aria-hidden="true"`, `muted playsInline` attributes, poster present
- **Reduced-motion** test: media-match mock returning `true` renders stacked beats, no pin, static posters
- **Pointer-coarse** test: SelectedWorks hover transforms are inert (or skip hover test entirely under coarse)
- **Playwright-cli** final pass: 1920×1080 / 768×1024 / 375×812, scroll positions (pre-pin, Act 1, Beat 01, Beat 02, Beat 03, Act 3, ledger), plus one reduced-motion desktop variant. Save to `docs/verification/2026-04-18-case-study/` with `NOTES.md`.

---

## 13. Phase scope — what ships, what doesn't

**Ships in this phase:**
- `<FeaturedCase />` with NextUp hardcoded
- `<SelectedWorks />` with 1 real card + 1 placeholder
- `projects.data.ts` with NextUp entry (typed for extension)
- 4 new asset captures
- Tokens, keyframes, reduced-motion guards
- Homepage wiring in `page.tsx`
- Playwright verification + audit + polish passes

**Explicitly out-of-scope (deferred):**
- `/work/<slug>` detail routes
- Act 2 copy migrated into data file (refactor when project #2 ships)
- Multi-project ledger (N=1 today is the design, not a limitation)
- Testimonials / quote block in Act 3 (noted in brainstorm; can be added when Dan captures a teammate quote — simple copy/DOM addition)
- Any cursor-reactive interactions (magnetic/animated-bg) — these are *depicted* in Beat 03's proof video, not reproduced live on this page

---

## 14. Risk & mitigation

**Risk:** Pin budget on the homepage gets crowded. Hero already pins; FeaturedCase also pins → user scrolls through two long pinned segments back-to-back separated only by Services.

*Mitigation:* Services section is short and un-pinned — it breathes between the two pins. Keep total pin runway across hero + case under ~10vh. FeaturedCase is the last pin on the homepage for this phase.

**Risk:** Videos autoplay costs mobile battery.

*Mitigation:* Reduced-motion swaps videos for posters (already specced). Plus: `<video preload="metadata">` not `auto`, and lazy-mount Act 1/3 videos via IntersectionObserver.

**Risk:** N=1 ledger reads as placeholder-heavy.

*Mitigation:* Dashed placeholder is honest scaffolding, not filler — it promises momentum rather than hiding the current state. Acceptable per design review.

**Risk:** Act 2 copy tone drift when Dan edits later.

*Mitigation:* Copy is locked in this spec; sharpening later is fine, but the structural constraint (3 beats × one paragraph each, first-person singular, decision → why → proof) is spec-level and should not bend.

---

## 15. Commit cadence

Per-task commits pushed to `origin main`, matching the Services/Hero cadence. Final task = audit + polish + `Project Log.md` status transition to `case-study-complete`.
