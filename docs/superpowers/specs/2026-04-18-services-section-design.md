# Services Section — Design Spec

**Date:** 2026-04-18
**Phase:** Services section (design.md §2.3)
**Depends on:** Layout shell ✅ · Hero section ✅
**Owner:** Dan
**Status:** approved — ready for implementation plan

---

## 1. Purpose

Second section below the hero. Answers the question "what does Dan actually do?" with three cards: UI/UX Design, Custom Development, Brand Strategy.

The hero set a high bar with its pinned scroll-reveal. The Services section has to feel of-a-piece with that language — but it also has to stay scannable for repeat visitors. Solution: **continue the reveal motif, but scope it per card, and keep the section inline (no pin)**. The hero owns the pin budget; Services earns its movement by using the same visual grammar (gold seam + unlock + flourish) at a smaller, more-legible scale.

---

## 2. Composition

### 2.1 Section shell

- Tag: `<section id="services" aria-labelledby="services-heading">`
- Width: full viewport
- Background: `#0B2422` (deeper teal — matches hero's recessed surface)
- Vertical padding: `py-32 md:py-40`
- Inner container: `Container` component (`max-w-[1400px]`) — consistent with rest of site
- Content max-width: `max-w-[1200px]` centered within container (per design.md §2.3)

### 2.2 Grid

- Desktop (`lg:` ≥1024px): `grid grid-cols-3 gap-6`
- Tablet (`md:` ≥768px): `grid grid-cols-2 gap-6` — third card spans full width (`lg:col-span-1 md:col-span-2`)
- Mobile: `grid grid-cols-1 gap-5`

---

## 3. Header

- Text: **TAILORED DIGITAL SOLUTIONS**
- Element: `<h2 id="services-heading">`
- Font: Comico
- Size: `48px` desktop, `36px` mobile
- Case: ALL CAPS
- Letter-spacing: `0.05em` (final state)
- Color: `#F5F5F0` (warm off-white)
- Alignment: centered
- Margin-bottom: `48px` desktop, `32px` mobile

**Motion (on section enter):**
- `translateY: 16px → 0`, duration 400ms, `power2.out`
- `opacity: 0 → 1`, duration 400ms
- `letter-spacing: 0.08em → 0.05em` (subtle breath), duration 600ms
- Trigger: ScrollTrigger, `start: "top 75%"`, `once: true`

---

## 4. Cards

### 4.1 Card shell

Each card is an `<article>` (not `<a>` — no detail pages for MVP).

- Background: `rgba(245, 245, 240, 0.02)` (near-invisible surface, reads as "present but dim" on the deep teal)
- Backdrop filter: `blur(12px)` (requires browser support — graceful fallback to solid surface)
- Border: `1px solid rgba(245, 245, 240, 0.08)`
- Border-radius: `12px`
- Padding: `32px`
- Overflow: `hidden` (for sweep mask containment)
- Position: `relative` (for flourish + sweep absolute positioning)
- `role="listitem"`, grid parent has `role="list"`

### 4.2 Card-image panel (top region)

Inside each card, an upper panel that carries the arc flourish + label:

- Structure:
  ```
  <div class="card-image">
    <svg class="card-arc" aria-hidden="true">…</svg>
    <div class="card-image-label">
      <div class="card-title">UI / UX DESIGN</div>
      <div class="card-caption">Design that behaves…</div>
    </div>
  </div>
  ```
- Background: `#0B2422` (matches section bg, creates layered feel)
- Min-height: `180px`
- Padding: `32px`
- Flex column, label bottom-anchored

### 4.3 Title

- Element: `<h3 class="card-title">`
- Font: Comico
- Size: `24px`
- Case: ALL CAPS
- Letter-spacing: `0.05em`
- Color: `#F5F5F0`

### 4.4 Caption (one-line body)

- Font: Permanent Marker
- Size: `15px`
- Color: `var(--text-secondary)` (`rgba(245, 245, 240, 0.65)` per design tokens)
- Line-height: `1.5`
- Margin-top: `8px`

### 4.5 Hover (pointer devices only, post-reveal)

- Border: `1px solid rgba(200, 165, 92, 0.3)` (gold tint)
- Transform: `translateY(-2px) rotateX(…) rotateY(…)`
- 3D tilt: ±3° in both axes, mouse-reactive (damped spring via Motion)
- Transition: 200ms `power2.out` for non-tilt properties
- Disabled under: `(pointer: coarse)`, `prefers-reduced-motion: reduce`

### 4.6 Final card copy (locked)

| # | Title | Body |
|---|---|---|
| 01 | UI / UX DESIGN | Design that behaves. Every click predictable, every edge considered. |
| 02 | CUSTOM DEVELOPMENT | Purpose-built. Not a theme you customised until it almost fit. |
| 03 | BRAND STRATEGY | A voice that's yours. Visuals that prove it. |

---

## 5. Flourish — Architectural arc

Top-right corner of each card-image panel.

- SVG: `48×48` viewport, `position: absolute; top: 16px; right: 16px`
- Arc: `<path d="M 48 0 A 48 48 0 0 0 0 48" stroke="#C8A55C" stroke-width="1.5" fill="none" stroke-linecap="round" />`
- Origin dot: `<circle cx="48" cy="0" r="2" fill="#C8A55C" />`
- `aria-hidden="true"` (decorative)

**Motion (draw-in):**
- Arc: `stroke-dashoffset` from full length (~75px) → 0 over 600ms `power2.out`
- Dot: fades in over 200ms, starting at 400ms into the arc draw
- Trigger: tied to card sweep progress (desktop) or IO fire (mobile) — see §6

---

## 6. Motion — Desktop (scroll-linked, per-card)

**Pattern:** each card owns its own ScrollTrigger. No section pin. Cards reveal as the user scrolls past them, producing a natural cascade without forcing reading pace.

### 6.1 Per-card ScrollTrigger

```
ScrollTrigger.create({
  trigger: card,
  start: "top 80%",
  end: "top 30%",
  scrub: 0.6,
  onUpdate: self => card.style.setProperty('--sweep-x', self.progress)
})
```

### 6.2 CSS channels

Each card exposes CSS custom properties as animation channels:

- `--sweep-x`: 0 → 1 (drives seam position + state unlock)

### 6.3 The sweep

A gold seam (1px, `#C8A55C`, opacity 0.6) sweeps left-to-right across the card-image panel. Implemented as a `::before` pseudo-element with `linear-gradient` mask whose position is keyed to `--sweep-x`:

```css
.card-image::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(200,165,92,0.6) calc(var(--sweep-x) * 100% - 1px),
    rgba(200,165,92,0.6) calc(var(--sweep-x) * 100% + 1px),
    transparent 100%
  );
  pointer-events: none;
}
```

### 6.4 The unlock

Card content starts dimmed; lit as sweep passes:

- `.card-image-label`: `opacity` keyed to `clamp(0, var(--sweep-x) * 2 - 0.4, 1)` — body text fully lit only after sweep passes midpoint
- `.card-image` itself: `opacity` `0.4 → 1` mapped to `--sweep-x` (via `calc(0.4 + var(--sweep-x) * 0.6)`)

### 6.5 Flourish reveal

Arc `stroke-dashoffset` keyed to `--sweep-x`:
- At `--sweep-x < 0.6`: dashoffset = full (hidden)
- At `--sweep-x ≥ 0.6`: dashoffset transitions to 0 over 600ms (GSAP tween triggered once via `onUpdate` threshold)

### 6.6 Hover tilt (post-reveal only)

- Motion (React) spring-damped rotateX/rotateY based on pointer position relative to card center
- Max amplitude: ±3°
- Perspective: `1000px` on grid parent
- Only active after card has fully revealed (`--sweep-x ≥ 0.95`)

---

## 7. Motion — Mobile (one-shot reveal, no scrub)

**Why different:** scroll-scrub on mobile is fidgety and battery-hungry. The reveal is still impressive — it's a choreographed one-shot that fires when the section enters view, then cards settle.

### 7.1 Trigger

- IntersectionObserver on `<section>`, threshold `0.25`
- Fires once (`observer.disconnect()` inside callback)
- Observer hoisted OUTSIDE `gsap.context()` (not cleaned by `ctx.revert()` — lesson from hero)

### 7.2 Header reveal

- Fades up first, as §3 (400ms, `power2.out`)

### 7.3 Card sequence

Staggered 200ms apart:
1. Gold seam sweeps L→R across card-image over 900ms
2. Card scales `0.98 → 1`, opacity `0 → 1` over 700ms (`power2.out`)
3. Arc strokes in at 60% through the sweep (from 540ms into the card's timeline)

All three cards use GSAP timeline with offset labels.

### 7.4 Post-reveal float

After the one-shot completes, arcs float ±1px vertical on a 4s infinite loop (`yoyo: true`, `ease: "sine.inOut"`). Matches hero's tiny always-on motion.

---

## 8. Reduced motion (`prefers-reduced-motion: reduce`)

- **Header:** snap-in, opacity 0 → 1, 200ms, no translate, no letter-spacing breath
- **Cards:** snap to lit state (final `--sweep-x: 1`), no sweep animation, no scale, no float
- **Arc:** drawn instantly at full stroke (no stroke-dashoffset animation)
- **Hover:** CSS-only lift + border tint still active. **No tilt.**
- **Implementation:** check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at mount; branch in ServicesClient; provide CSS fallback for SSR-flash protection.

---

## 9. Accessibility

- Section has `aria-labelledby="services-heading"`
- Grid parent: `role="list"`
- Each card: `<article role="listitem">`
- Flourish SVG: `aria-hidden="true"`
- Sweep element: `aria-hidden="true"`
- Title is `<h3>` (section heading is `<h2>`) — correct hierarchy
- Focus states: if cards become links later, 2px gold outline (`#C8A55C`) with 4px offset
- Color contrast: caption text on card-image bg must meet WCAG AA. `--text-secondary` is pre-verified at the layout-shell audit bump (AA confirmed on `#0B2422`).
- Touch devices (`(pointer: coarse)`): tilt disabled, hover lift disabled, border-brighten disabled

---

## 10. File structure

```
src/components/sections/Services/
├── Services.tsx              Server Component — renders static structure, imports data
├── ServicesClient.tsx        'use client' — ScrollTrigger + IO + tilt lifecycle
├── ServiceCard.tsx           Server Component — one card (title + caption + arc SVG)
├── services.data.ts          The three service entries (title + body)
└── index.ts                  Re-exports Services
```

**Integration:** `src/app/page.tsx` renders `<Hero />` then `<Services />` below. No prop passing needed.

---

## 11. Tech notes

- **GSAP lifecycle:** per-card ScrollTrigger created inside `gsap.context(() => {...}, sectionRef)`. Cleanup via `ctx.revert()` on unmount — handles all ScrollTrigger instances.
- **IntersectionObserver (mobile path):** hoisted to outer `useEffect` scope. Cleanup: `io?.disconnect()` (idempotent). Not tracked by `gsap.context()`.
- **Custom property channel:** `--sweep-x` is the single value GSAP mutates per card. CSS does the visual work (sweep, opacity unlock). Narrow helper type: `type CSSVarTweenVars = gsap.TweenVars & Record<\`--${string}\`, string | number>` (reuse from hero).
- **Hover tilt:** `Motion` (React) for spring damping. Mount-guarded (`useIsomorphicLayoutEffect` or direct `useEffect`) to avoid SSR hydration mismatch.
- **Reduced motion:** detected once at mount + listens for preference change. Branches the entire motion path — desktop scrub, mobile IO, and hover tilt all no-op.
- **SSR-flash protection:** cards render in their "final lit" state by default; JS mounts and sets them to dim just before triggering reveal. This avoids a flash of dim content before hydration on slow networks. (Pattern: inline style `--sweep-x: 1` → ServicesClient sets to 0 on mount, then animates to 1.)

---

## 12. Brand tokens referenced

| Token | Value | Usage |
|---|---|---|
| Deeper teal | `#0B2422` | Section bg + card-image bg |
| Warm off-white | `#F5F5F0` | Headings + titles |
| Text secondary | `rgba(245, 245, 240, 0.65)` | Card captions |
| Gold accent | `#C8A55C` | Arc, sweep, hover border tint |
| Surface | `rgba(245, 245, 240, 0.02)` | Card outer bg |
| Surface border | `rgba(245, 245, 240, 0.08)` | Card border (rest) |
| Comico | Headings font | Header + card titles |
| Permanent Marker | Body font | Card captions |

---

## 13. Out of scope

- Card → detail page navigation (MVP has no detail pages)
- Service pricing or tier information
- Icons within card-image panel (arc is the only decorative element)
- Section-level background imagery or textures
- CMS integration (copy is hardcoded in `services.data.ts`)

---

## 14. Success criteria

- Desktop: each card's gold sweep reveals content as user scrolls past; hover tilt feels subtle and premium
- Mobile: one-shot reveal lands in the first viewport-fill after hero; arc float provides quiet ongoing life
- Reduced motion: content is fully legible with no motion artifacts, hover still enhances (CSS-only)
- Lighthouse: Perf ≥90, A11y 100, BP 100 on prod build with the section wired in
- No CLS from section mount; no hydration warnings; no leaked observers or triggers on route unmount
