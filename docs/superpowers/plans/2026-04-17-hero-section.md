# Hero Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Draft → Reality scroll-scrub hero — a CSS-built laptop on a 3D perspective grid whose split screen reveals NextUp Co.'s new site from its old one as the user scrolls, crowned by the headline `THE WEB, EARNED.` / *Where ideas become interfaces.*

**Architecture:** One Server Component (`Hero.tsx`) renders the semantic markup (heading, sub, caption, laptop, screen, grid, sparkles, scroll hint). All motion lives in a single `'use client'` sibling (`HeroClient.tsx`) that initialises Lenis, wires GSAP's ticker, and animates CSS custom properties on the `<section id="hero">` via one ScrollTrigger timeline on desktop, a one-shot IntersectionObserver timeline on mobile, and a 600ms snap under `prefers-reduced-motion`. Subcomponents consume those CSS variables as pure visual consumers — no DOM queries, no refs crossing component boundaries.

**Tech Stack:** Next.js 16 (App Router, `src/` + `@/*` alias) · React 19 · Tailwind v4 · TypeScript · GSAP 3.15 + ScrollTrigger · Lenis 1.3 · Vitest + RTL for TDD · playwright-cli for video capture + browser verification.

**Spec:** [docs/superpowers/specs/2026-04-17-hero-section-design.md](../specs/2026-04-17-hero-section-design.md)

**Skills active during build:** `taste-skill` (visual craft) · `impeccable` (design discipline) · `typeset` (Comico + Permanent Marker tuning) · `layout` (Task 7 composition) · `stitch-skill` (polish pass) · `TDD` (all component tasks) · `verification-before-completion` (Task 11) · `audit` + `polish` (Task 12).

---

## File Map

**Create (components):**
- `src/components/sections/Hero/Hero.tsx` — Server Component. Copy, semantics, composition. No `'use client'`.
- `src/components/sections/Hero/HeroClient.tsx` — `'use client'`. GSAP + Lenis + ScrollTrigger lifecycle. Renders nothing visible.
- `src/components/sections/Hero/HeroLaptop.tsx` — CSS laptop frame. Accepts `children` slot for the screen.
- `src/components/sections/Hero/HeroScreen.tsx` — Split screen: `<img>` (draft) + `<video>` (reality) + seam + side labels. Pure CSS, no state.
- `src/components/sections/Hero/PerspectiveGrid.tsx` — Pure-CSS receding grid floor + radial glow.
- `src/components/sections/Hero/HeroSparkles.tsx` — 8 dots, deterministic seeded positions.
- `src/components/sections/Hero/HeroScrollHint.tsx` — Chevron + label, fades via CSS var.
- `src/components/sections/Hero/Hero.test.tsx`
- `src/components/sections/Hero/HeroClient.test.tsx`

**Create (assets):**
- `public/assets/hero/nextup-old.webp` — user-provided old NextUp screenshot, transcoded from PNG.
- `public/assets/hero/nextup-live.mp4` — live nextupco.com hero capture (Task 10).
- `public/assets/hero/nextup-live.webm` — same, VP9 encode.
- `public/assets/hero/nextup-live-poster.webp` — first-frame still for reduced-motion users.

**Modify:**
- `src/app/globals.css` — add hero tokens (`--seam-x`, `--hero-progress`, `--laptop-tilt-*`, `--laptop-perspective`, `--sparkle-core`, `--sparkle-halo`), sparkle/float keyframes, reduced-motion guards.
- `src/app/page.tsx` — replace placeholder with `<Hero />`.

---

## Task 0: Hero-specific design tokens + keyframes in `globals.css`

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/app/globals.css`

- [ ] **Step 1: Append hero tokens and keyframes to `globals.css`**

Append this block to the end of the file:

```css
/* ---------- HERO TOKENS (Phase 2) ---------- */
:root {
  /* sparkle appearance */
  --sparkle-core: #F5F5F0;
  --sparkle-halo: rgba(180, 240, 200, 0.6);

  /* laptop geometry */
  --laptop-tilt-x: 6deg;
  --laptop-tilt-z: -1.5deg;
  --laptop-perspective: 1200px;

  /* scroll-driven animation state (0 → 1 across the hero) */
  --hero-progress: 0;
  --seam-x: 12%;
}

/* ---------- HERO KEYFRAMES ---------- */
@keyframes hero-sparkle {
  0%, 100% { opacity: 0.2; transform: scale(0.9); }
  50%      { opacity: 1;   transform: scale(1.1); }
}

/* ---------- REDUCED MOTION ---------- */
@media (prefers-reduced-motion: reduce) {
  [data-hero-sparkle] { animation: none !important; }
  [data-hero-laptop]  { transform: none !important; }
}
```

- [ ] **Step 2: Verify dev server still renders without errors**

Run (in another terminal, non-blocking): `npm run dev`

Open `http://localhost:3000`. Expected: page renders exactly as before (no visible change — tokens only take effect once components consume them).

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(style): add hero tokens + sparkle keyframes + reduced-motion guards"
git push origin main
```

---

## Task 1: Transcode the NextUp "Draft" asset into `public/assets/hero/`

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/public/assets/hero/nextup-old.webp`

**Context:** The user-provided screenshot lives at `/Users/dangeorge/.claude/image-cache/c6ade703-712c-4a4e-9fed-2d81f76193f7/2.png` (2576×1427 PNG, "BUILT FOR THE BOLD" in lime-on-black). We need it in `public/assets/hero/` as WebP, cropped to 16:10 so it matches the laptop screen aspect without letterboxing.

- [ ] **Step 1: Create the target directory**

Run: `mkdir -p "/Users/dangeorge/The Vault/Dans Website/public/assets/hero"`

- [ ] **Step 2: Convert PNG → WebP at 1120×700 (16:10), centre-cropped**

Use `sips` (macOS built-in) — source aspect is ~1.805, target is 1.6; centre-crop in y keeps headline+CTA intact.

```bash
sips -s format png --resampleHeightWidth 700 1120 --cropToHeightWidth 700 1120 \
  "/Users/dangeorge/.claude/image-cache/c6ade703-712c-4a4e-9fed-2d81f76193f7/2.png" \
  --out /tmp/nextup-old-crop.png && \
sips -s format webp -s formatOptions 82 /tmp/nextup-old-crop.png \
  --out "/Users/dangeorge/The Vault/Dans Website/public/assets/hero/nextup-old.webp" && \
rm /tmp/nextup-old-crop.png
```

Expected: `public/assets/hero/nextup-old.webp` created, ≤ 120 KB, 1120×700 px.

- [ ] **Step 3: Spot-check dimensions**

Run: `sips -g pixelWidth -g pixelHeight "public/assets/hero/nextup-old.webp"`

Expected:
```
  pixelWidth: 1120
  pixelHeight: 700
```

If dimensions are off, re-run Step 2.

- [ ] **Step 4: Commit**

```bash
git add public/assets/hero/nextup-old.webp
git commit -m "chore(hero): add NextUp old-build screenshot as draft-side asset"
git push origin main
```

---

## Task 2: Build `PerspectiveGrid` (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Hero/PerspectiveGrid.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Hero/PerspectiveGrid.test.tsx`

**Purpose:** Pure-CSS receding grid floor + soft radial glow centred above the vanishing point. Pointer-events none, aria-hidden, absolute-fill inside the hero section.

- [ ] **Step 1: Create folder**

Run: `mkdir -p "/Users/dangeorge/The Vault/Dans Website/src/components/sections/Hero"`

- [ ] **Step 2: Write failing test**

`src/components/sections/Hero/PerspectiveGrid.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PerspectiveGrid } from "./PerspectiveGrid";

describe("<PerspectiveGrid />", () => {
  it("renders as aria-hidden and pointer-events-none", () => {
    const { container } = render(<PerspectiveGrid />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("aria-hidden")).toBe("true");
    expect(root.className).toContain("pointer-events-none");
  });

  it("absolute-fills its parent", () => {
    const { container } = render(<PerspectiveGrid />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("absolute");
    expect(root.className).toContain("inset-0");
  });

  it("references --grid-line and --grid-glow tokens in its inline styles", () => {
    const { container } = render(<PerspectiveGrid />);
    const html = container.innerHTML;
    expect(html).toContain("--grid-line");
    expect(html).toContain("--grid-glow");
  });
});
```

- [ ] **Step 3: Run to confirm failure**

Run: `npm test -- PerspectiveGrid`

Expected: FAIL — module not found.

- [ ] **Step 4: Implement `PerspectiveGrid.tsx`**

```tsx
export function PerspectiveGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* receding grid floor */}
      <div
        className="absolute left-1/2 top-[55%] -translate-x-1/2 w-[220%] h-[180%]"
        style={{
          transform:
            "translateX(-50%) perspective(800px) rotateX(55deg) translateY(-6%)",
          transformOrigin: "top center",
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--grid-line) 0 1px, transparent 1px 60px), " +
            "repeating-linear-gradient(0deg, var(--grid-line) 0 1px, transparent 1px 60px)",
          maskImage:
            "radial-gradient(ellipse at 50% 30%, #000 40%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 30%, #000 40%, transparent 75%)",
        }}
      />
      {/* radial glow at vanishing point */}
      <div
        className="absolute left-1/2 top-[30%] -translate-x-1/2 w-[60%] h-[40%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--grid-glow), transparent 70%)",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 5: Run to confirm pass**

Run: `npm test -- PerspectiveGrid`

Expected: `3 passed`.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Hero/PerspectiveGrid.tsx src/components/sections/Hero/PerspectiveGrid.test.tsx
git commit -m "feat(hero): add PerspectiveGrid — 3D receding floor + glow"
git push origin main
```

---

## Task 3: Build `HeroSparkles` (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Hero/HeroSparkles.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Hero/HeroSparkles.test.tsx`

**Purpose:** Eight deterministic sparkle dots sprinkled around the hero. Each sparkle has `data-hero-sparkle` so the reduced-motion CSS rule can target it. Opacity is driven by a CSS var (`--hero-progress`) which HeroClient updates — each sparkle's visibility ramps in between progress 0.4 and 0.8 using a per-dot delay.

- [ ] **Step 1: Write failing test**

`src/components/sections/Hero/HeroSparkles.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSparkles } from "./HeroSparkles";

describe("<HeroSparkles />", () => {
  it("renders exactly 8 sparkle elements", () => {
    const { container } = render(<HeroSparkles />);
    expect(container.querySelectorAll("[data-hero-sparkle]").length).toBe(8);
  });

  it("each sparkle carries the aria-hidden + data attribute", () => {
    const { container } = render(<HeroSparkles />);
    const sparkles = container.querySelectorAll("[data-hero-sparkle]");
    sparkles.forEach((s) => {
      expect(s.getAttribute("aria-hidden")).toBe("true");
    });
  });

  it("sparkle colours reference --sparkle-core and --sparkle-halo tokens", () => {
    const { container } = render(<HeroSparkles />);
    expect(container.innerHTML).toContain("--sparkle-core");
    expect(container.innerHTML).toContain("--sparkle-halo");
  });

  it("is pointer-events-none and absolute-filled", () => {
    const { container } = render(<HeroSparkles />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("pointer-events-none");
    expect(root.className).toContain("absolute");
    expect(root.className).toContain("inset-0");
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test -- HeroSparkles`

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `HeroSparkles.tsx`**

```tsx
// Deterministic positions — no randomness so SSR and CSR outputs match.
// Each entry also carries a delay fraction used to stagger the sparkle fade-in
// between --hero-progress 0.4 and 0.8.
const SPARKLES = [
  { top: "18%", left: "12%", delay: 0.00 },
  { top: "28%", left: "82%", delay: 0.08 },
  { top: "62%", left: "8%",  delay: 0.16 },
  { top: "74%", left: "88%", delay: 0.24 },
  { top: "40%", left: "22%", delay: 0.32 },
  { top: "48%", left: "78%", delay: 0.04 },
  { top: "82%", left: "36%", delay: 0.12 },
  { top: "22%", left: "62%", delay: 0.20 },
] as const;

export function HeroSparkles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          data-hero-sparkle
          aria-hidden="true"
          className="absolute block w-[4px] h-[4px] rounded-full"
          style={{
            top: s.top,
            left: s.left,
            backgroundColor: "var(--sparkle-core)",
            boxShadow: "0 0 10px 2px var(--sparkle-halo)",
            // starts hidden; HeroClient animates opacity via progress
            opacity: 0,
            // sparkle-specific delay (read in HeroClient when building the timeline)
            ["--sparkle-delay" as string]: String(s.delay),
          }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm test -- HeroSparkles`

Expected: `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero/HeroSparkles.tsx src/components/sections/Hero/HeroSparkles.test.tsx
git commit -m "feat(hero): add HeroSparkles — 8 deterministic dots, progress-driven fade"
git push origin main
```

---

## Task 4: Build `HeroScrollHint` (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Hero/HeroScrollHint.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Hero/HeroScrollHint.test.tsx`

**Purpose:** Tiny `Scroll to reveal` label + downward chevron at the bottom of the hero. Server-rendered. Fades out when HeroClient advances `--hero-progress`. Under `prefers-reduced-motion` the CSS var is irrelevant — it just stays put (a quick CSS media query hides it to avoid teaching an interaction the user can't trigger).

- [ ] **Step 1: Write failing test**

`src/components/sections/Hero/HeroScrollHint.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroScrollHint } from "./HeroScrollHint";

describe("<HeroScrollHint />", () => {
  it("renders the label text", () => {
    render(<HeroScrollHint />);
    expect(screen.getByText(/scroll to reveal/i)).toBeInTheDocument();
  });

  it("is aria-hidden (decorative)", () => {
    const { container } = render(<HeroScrollHint />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("aria-hidden")).toBe("true");
  });

  it("carries data-hero-scroll-hint so HeroClient can target it", () => {
    const { container } = render(<HeroScrollHint />);
    expect(
      container.querySelector("[data-hero-scroll-hint]"),
    ).not.toBeNull();
  });

  it("renders a chevron glyph", () => {
    const { container } = render(<HeroScrollHint />);
    // Either SVG or Unicode chevron — both are OK. Looking for the downward arrow.
    const html = container.innerHTML;
    expect(html.includes("⌄") || html.includes("<svg")).toBe(true);
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test -- HeroScrollHint`

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `HeroScrollHint.tsx`**

```tsx
export function HeroScrollHint() {
  return (
    <div
      aria-hidden="true"
      data-hero-scroll-hint
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 motion-reduce:hidden"
      style={{
        opacity: "calc(1 - clamp(0, var(--hero-progress) * 20, 1))",
      }}
    >
      <span
        className="text-[12px] uppercase tracking-[0.15em]"
        style={{
          fontFamily: "var(--font-marker)",
          color: "var(--text-secondary)",
        }}
      >
        Scroll to reveal
      </span>
      <span
        className="block text-[18px] leading-none"
        style={{ color: "var(--text-secondary)" }}
      >
        ⌄
      </span>
    </div>
  );
}
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm test -- HeroScrollHint`

Expected: `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero/HeroScrollHint.tsx src/components/sections/Hero/HeroScrollHint.test.tsx
git commit -m "feat(hero): add HeroScrollHint — chevron + fade-on-scroll label"
git push origin main
```

---

## Task 5: Build `HeroLaptop` (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Hero/HeroLaptop.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Hero/HeroLaptop.test.tsx`

**Purpose:** Pure-CSS laptop frame with a screen slot and a decorative deck (keyboard strip). Responsive widths (desktop 560px / tablet 380px / mobile 280px). Gets the `data-hero-laptop` attribute so HeroClient's float tween can target it.

- [ ] **Step 1: Write failing test**

`src/components/sections/Hero/HeroLaptop.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroLaptop } from "./HeroLaptop";

describe("<HeroLaptop />", () => {
  it("renders children inside the screen slot", () => {
    render(
      <HeroLaptop>
        <div data-testid="slot-content">hello</div>
      </HeroLaptop>,
    );
    expect(screen.getByTestId("slot-content")).toBeInTheDocument();
  });

  it("exposes data-hero-laptop on the outer element", () => {
    const { container } = render(
      <HeroLaptop>
        <span />
      </HeroLaptop>,
    );
    expect(
      container.querySelector("[data-hero-laptop]"),
    ).not.toBeNull();
  });

  it("uses laptop-tilt and laptop-perspective tokens in its style", () => {
    const { container } = render(
      <HeroLaptop>
        <span />
      </HeroLaptop>,
    );
    expect(container.innerHTML).toContain("--laptop-tilt-x");
    expect(container.innerHTML).toContain("--laptop-tilt-z");
    expect(container.innerHTML).toContain("--laptop-perspective");
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test -- HeroLaptop`

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `HeroLaptop.tsx`**

```tsx
import type { ReactNode } from "react";

type HeroLaptopProps = { children: ReactNode };

export function HeroLaptop({ children }: HeroLaptopProps) {
  return (
    <div
      className="relative mx-auto"
      style={{ perspective: "var(--laptop-perspective)" }}
    >
      <div
        data-hero-laptop
        className="relative w-[280px] md:w-[380px] lg:w-[560px] mx-auto p-[6px_6px_0] rounded-t-[10px] rounded-b-[6px]"
        style={{
          background: "linear-gradient(180deg, #2a2f2d, #15191a)",
          boxShadow:
            "0 24px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(245,245,240,0.08)",
          transform:
            "rotateX(var(--laptop-tilt-x)) rotateZ(var(--laptop-tilt-z))",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* 16:10 screen slot */}
        <div className="relative w-full rounded-[6px] overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
          {children}
        </div>
        {/* deck / keyboard strip */}
        <div
          aria-hidden="true"
          className="h-[10px] mt-[6px] -mx-[6px] rounded-b-[14px]"
          style={{ background: "linear-gradient(180deg,#1a1e1d,#0c0e0e)" }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm test -- HeroLaptop`

Expected: `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero/HeroLaptop.tsx src/components/sections/Hero/HeroLaptop.test.tsx
git commit -m "feat(hero): add HeroLaptop — CSS frame with 16:10 screen slot + deck"
git push origin main
```

---

## Task 6: Build `HeroScreen` (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Hero/HeroScreen.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Hero/HeroScreen.test.tsx`

**Purpose:** The split-screen content. Takes `draft` (image src/alt) and `reality` (video sources + poster) as props. Renders both sides stacked with `position:absolute inset:0`. The reality side's width is clipped via `clip-path: inset(0 calc(100% - var(--seam-x)) 0 0)` so only the left-of-seam portion is visible. A 2px gold seam + 22px circular knob are rendered at `left: var(--seam-x)`.

Draft/Reality side labels (pill tags, top-corners of the screen) carry `data-hero-side-label` so HeroClient can fade them out at progress ≥ 0.9.

- [ ] **Step 1: Write failing test**

`src/components/sections/Hero/HeroScreen.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroScreen } from "./HeroScreen";

const DEFAULT_PROPS = {
  draftSrc: "/assets/hero/nextup-old.webp",
  draftAlt: "NextUp Co. homepage, pre-redesign",
  videoMp4: "/assets/hero/nextup-live.mp4",
  videoWebm: "/assets/hero/nextup-live.webm",
  videoPoster: "/assets/hero/nextup-live-poster.webp",
};

describe("<HeroScreen />", () => {
  it("renders the draft image with correct src and alt", () => {
    render(<HeroScreen {...DEFAULT_PROPS} />);
    const img = screen.getByAltText(DEFAULT_PROPS.draftAlt) as HTMLImageElement;
    expect(img.src).toContain("nextup-old.webp");
  });

  it("renders a <video> with webm + mp4 sources in that order (webm first for VP9 savings)", () => {
    const { container } = render(<HeroScreen {...DEFAULT_PROPS} />);
    const video = container.querySelector("video") as HTMLVideoElement;
    expect(video).not.toBeNull();
    expect(video.getAttribute("poster")).toContain("nextup-live-poster.webp");
    expect(video.getAttribute("aria-hidden")).toBe("true");
    expect(video.hasAttribute("autoplay")).toBe(true);
    expect(video.hasAttribute("muted")).toBe(true);
    expect(video.hasAttribute("loop")).toBe(true);
    expect(video.hasAttribute("playsinline")).toBe(true);
    const sources = video.querySelectorAll("source");
    expect(sources[0].getAttribute("type")).toBe("video/webm");
    expect(sources[1].getAttribute("type")).toBe("video/mp4");
  });

  it("renders Draft and Reality side labels with the data attribute", () => {
    const { container } = render(<HeroScreen {...DEFAULT_PROPS} />);
    const labels = container.querySelectorAll("[data-hero-side-label]");
    expect(labels.length).toBe(2);
    const texts = Array.from(labels).map((l) => l.textContent);
    expect(texts).toContain("Draft");
    expect(texts).toContain("Reality");
  });

  it("renders a seam element at CSS var --seam-x", () => {
    const { container } = render(<HeroScreen {...DEFAULT_PROPS} />);
    const seam = container.querySelector("[data-hero-seam]") as HTMLElement;
    expect(seam).not.toBeNull();
    expect(seam.getAttribute("style") ?? "").toContain("--seam-x");
  });

  it("reality side is clipped via clip-path referencing --seam-x", () => {
    const { container } = render(<HeroScreen {...DEFAULT_PROPS} />);
    const reality = container.querySelector("[data-hero-reality]") as HTMLElement;
    expect(reality).not.toBeNull();
    expect(reality.getAttribute("style") ?? "").toContain("--seam-x");
    expect(reality.getAttribute("style") ?? "").toContain("clip-path");
  });

  it("provides a screen-reader sentence describing the transformation", () => {
    render(<HeroScreen {...DEFAULT_PROPS} />);
    // sr-only text inside the screen
    expect(
      screen.getByText(/draft.*reality/i, { selector: ".sr-only" }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test -- HeroScreen`

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `HeroScreen.tsx`**

```tsx
type HeroScreenProps = {
  draftSrc: string;
  draftAlt: string;
  videoMp4: string;
  videoWebm: string;
  videoPoster: string;
};

export function HeroScreen({
  draftSrc,
  draftAlt,
  videoMp4,
  videoWebm,
  videoPoster,
}: HeroScreenProps) {
  return (
    <div className="relative w-full h-full">
      {/* screen-reader description of the transformation */}
      <p className="sr-only">
        Animated reveal: NextUp Co.&rsquo;s original site on the left transitions
        to its new site on the right as you scroll (Draft to Reality).
      </p>

      {/* Draft side — full frame underneath */}
      <div data-hero-draft className="absolute inset-0">
        {/* using plain <img> for simplicity; this is inside a fixed-size CSS frame, next/image would fight the aspect-ratio slot */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={draftSrc}
          alt={draftAlt}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <span
          data-hero-side-label
          aria-hidden="true"
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.15em]"
          style={{
            fontFamily: "var(--font-marker)",
            color: "var(--text-primary)",
            backgroundColor: "rgba(11,36,34,0.8)",
            border: "1px solid rgba(11,36,34,0.4)",
          }}
        >
          Draft
        </span>
      </div>

      {/* Reality side — clipped from the right by the seam */}
      <div
        data-hero-reality
        className="absolute inset-0"
        style={{
          clipPath: "inset(0 calc(100% - var(--seam-x)) 0 0)",
          WebkitClipPath: "inset(0 calc(100% - var(--seam-x)) 0 0)",
        }}
      >
        <video
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={videoPoster}
          className="w-full h-full object-cover"
        >
          <source src={videoWebm} type="video/webm" />
          <source src={videoMp4} type="video/mp4" />
        </video>
        <span
          data-hero-side-label
          aria-hidden="true"
          className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.15em]"
          style={{
            fontFamily: "var(--font-marker)",
            color: "var(--text-primary)",
            backgroundColor: "rgba(245,245,240,0.15)",
            border: "1px solid rgba(245,245,240,0.3)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          Reality
        </span>
      </div>

      {/* seam + knob */}
      <div
        data-hero-seam
        aria-hidden="true"
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          left: "var(--seam-x)",
          width: "2px",
          backgroundColor: "var(--gold-accent)",
          boxShadow: "0 0 12px rgba(200,165,92,0.9)",
          transform: "translateX(-1px)",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full"
          style={{
            backgroundColor: "var(--text-primary)",
            border: "2px solid var(--gold-accent)",
            boxShadow: "0 0 14px rgba(200,165,92,0.5)",
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm test -- HeroScreen`

Expected: `6 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero/HeroScreen.tsx src/components/sections/Hero/HeroScreen.test.tsx
git commit -m "feat(hero): add HeroScreen — split draft/reality + scroll-driven seam"
git push origin main
```

---

## Task 7: Build `Hero` Server Component (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Hero/Hero.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Hero/Hero.test.tsx`

**Purpose:** The semantic shell. Composes PerspectiveGrid + HeroSparkles + headline/sub + HeroLaptop(HeroScreen) + caption + HeroScrollHint + HeroClient (the side-effect sibling we build in Task 9 — for now just render an empty placeholder `<HeroClient />` that we'll flesh out next task).

To keep this task TDD-clean without a hard dependency on Task 9's client code, we export a stub `HeroClient` in its own file as part of this task — it returns `null` initially. Task 9 replaces the body.

- [x] **Step 1: Create stub `HeroClient.tsx` (returns null)**

```tsx
"use client";

export function HeroClient() {
  return null;
}
```

- [x] **Step 2: Write failing test for `Hero.tsx`**

`src/components/sections/Hero/Hero.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";

describe("<Hero />", () => {
  it("renders an <h1> with the locked headline copy", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("THE WEB, EARNED.");
    expect(h1.id).toBe("hero-heading");
  });

  it("renders the sub copy", () => {
    render(<Hero />);
    expect(
      screen.getByText("Where ideas become interfaces."),
    ).toBeInTheDocument();
  });

  it("renders the NextUp caption", () => {
    render(<Hero />);
    expect(screen.getByText(/case study 01.*nextup co\./i)).toBeInTheDocument();
  });

  it("is a <section> with aria-labelledby pointing at the heading", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section#hero")!;
    expect(section.getAttribute("aria-labelledby")).toBe("hero-heading");
  });

  it("renders the laptop draft image", () => {
    render(<Hero />);
    expect(
      screen.getByAltText("NextUp Co. homepage, pre-redesign"),
    ).toBeInTheDocument();
  });

  it("renders the scroll hint by default", () => {
    const { container } = render(<Hero />);
    expect(
      container.querySelector("[data-hero-scroll-hint]"),
    ).not.toBeNull();
  });
});
```

- [x] **Step 3: Run to confirm failure**

Run: `npm test -- Hero.test`

Expected: FAIL — `Hero` not found.

- [x] **Step 4: Implement `Hero.tsx`**

```tsx
import { HeroClient } from "./HeroClient";
import { HeroLaptop } from "./HeroLaptop";
import { HeroScreen } from "./HeroScreen";
import { HeroSparkles } from "./HeroSparkles";
import { HeroScrollHint } from "./HeroScrollHint";
import { PerspectiveGrid } from "./PerspectiveGrid";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden"
    >
      <PerspectiveGrid />
      <HeroSparkles />

      <div className="relative z-10 flex flex-col items-center gap-3 md:gap-4 text-center">
        <h1
          id="hero-heading"
          className="text-[40px] md:text-[48px] lg:text-[72px] leading-[1.05] tracking-[0.02em] uppercase"
          style={{
            fontFamily: "var(--font-comico)",
            color: "var(--text-primary)",
            textShadow: "0 0 24px rgba(200,165,92,0.18)",
          }}
        >
          THE WEB, EARNED.
        </h1>
        <p
          className="text-[16px] md:text-[18px] tracking-[0.02em]"
          style={{
            fontFamily: "var(--font-marker)",
            color: "var(--text-secondary)",
          }}
        >
          Where ideas become interfaces.
        </p>
      </div>

      <div className="relative z-10 mt-10 md:mt-12">
        <HeroLaptop>
          <HeroScreen
            draftSrc="/assets/hero/nextup-old.webp"
            draftAlt="NextUp Co. homepage, pre-redesign"
            videoMp4="/assets/hero/nextup-live.mp4"
            videoWebm="/assets/hero/nextup-live.webm"
            videoPoster="/assets/hero/nextup-live-poster.webp"
          />
        </HeroLaptop>
      </div>

      <p
        className="relative z-10 mt-6 text-[13px] uppercase tracking-[0.15em]"
        style={{
          fontFamily: "var(--font-marker)",
          color: "var(--text-secondary)",
        }}
      >
        Case Study 01 &middot; NextUp Co.
      </p>

      <HeroScrollHint />
      <HeroClient />
    </section>
  );
}
```

- [x] **Step 5: Run all Hero tests**

Run: `npm test -- Hero`

Expected: every Hero* suite green. At minimum:
- `PerspectiveGrid.test` 3 passed
- `HeroSparkles.test` 4 passed
- `HeroScrollHint.test` 4 passed
- `HeroLaptop.test` 3 passed
- `HeroScreen.test` 6 passed
- `Hero.test` 6 passed

- [x] **Step 6: Commit** (commit `575a51b`)

```bash
git add src/components/sections/Hero/Hero.tsx src/components/sections/Hero/Hero.test.tsx src/components/sections/Hero/HeroClient.tsx
git commit -m "feat(hero): compose Hero section — headline, laptop, caption, scroll hint"
git push origin main
```

---

## Task 8: Wire `<Hero />` into `page.tsx`, visual check static state

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/app/page.tsx`

- [x] **Step 1: Replace `src/app/page.tsx`**

```tsx
import { Hero } from "@/components/sections/Hero/Hero";

export default function Home() {
  return <Hero />;
}
```

- [x] **Step 2: Typecheck + tests + lint + build**

```bash
npx tsc --noEmit && npm test && npm run lint && npm run build
```

Expected: all green. No TS errors, all vitest suites green, no lint errors, build succeeds.

- [x] **Step 3: Start dev server and eyeball static composition**

Run: `npm run dev`

Open `http://localhost:3000`. Confirm:
- Hero fills viewport
- Comico headline "THE WEB, EARNED." centred, large, with soft gold glow
- Permanent Marker sub "Where ideas become interfaces." beneath
- Laptop centred, tilted, with NextUp old screenshot on BOTH sides of the screen (the reality side shows the video poster — and since we haven't captured the video yet, the `<source>` elements fail gracefully to the `poster` attribute, which we also haven't created yet — so the reality side will appear broken / empty. **This is expected**; Task 10 produces the video and poster. For visual check purposes, swap the reality video element's src temporarily to the old screenshot by editing it in-place in devtools — or skip this visual check and rely on Task 11's automated verification.)
- Perspective grid floor renders behind the laptop
- 8 sparkle dots are invisible (opacity:0 — they come alive once HeroClient animates progress)
- Scroll hint "Scroll to reveal" + chevron at the bottom, centred
- Scrolling the page does NOT yet move the seam — HeroClient lands in Task 9

- [x] **Step 4: Commit** (commit `5e51eef`)

```bash
git add src/app/page.tsx
git commit -m "feat(hero): wire <Hero /> into home page (static composition)"
git push origin main
```

---

## Task 9: Implement `HeroClient` — GSAP + Lenis + ScrollTrigger lifecycle (TDD)

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Hero/HeroClient.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Hero/HeroClient.test.tsx`

**Purpose:** A single side-effect-only client component that owns all Hero motion: Lenis smooth-scroll init, GSAP ticker bind, ScrollTrigger timeline (desktop), IntersectionObserver one-shot (mobile), reduced-motion snap. No visible output — returns `null`. Queries the hero DOM via `document.getElementById("hero")` once in a `useEffect`.

Timeline animates on the section element itself:
- `--hero-progress`: 0 → 1 (master progress)
- `--seam-x`: 12% → 100%
- Sparkle spans: `opacity` 0 → 1 with stagger keyed off `--sparkle-delay`
- Scroll-hint element: `opacity` 1 → 0 between progress 0 → 0.05 (handled by the CSS `calc` already in `HeroScrollHint`, so no additional tween needed)
- Side label spans: `opacity` 1 → 0 between progress 0.9 → 1.0

Float animation is a separate infinite tween on `[data-hero-laptop]`.

- [ ] **Step 1: Write failing test**

`src/components/sections/Hero/HeroClient.test.tsx`:

```tsx
import { render, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock gsap + ScrollTrigger + lenis before the component imports them
const mockScrollTriggerKill = vi.fn();
const mockContextRevert = vi.fn();

vi.mock("gsap", () => {
  const to = vi.fn(() => ({ kill: vi.fn() }));
  const context = vi.fn((fn: () => void) => {
    fn();
    return { revert: mockContextRevert };
  });
  const registerPlugin = vi.fn();
  const ticker = { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() };
  return {
    default: { to, context, registerPlugin, ticker, timeline: vi.fn(() => ({ to, kill: vi.fn() })) },
    gsap: { to, context, registerPlugin, ticker, timeline: vi.fn(() => ({ to, kill: vi.fn() })) },
  };
});

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { update: vi.fn(), kill: mockScrollTriggerKill, getAll: vi.fn(() => []) },
}));

vi.mock("lenis", () => ({
  default: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    raf: vi.fn(),
    destroy: vi.fn(),
  })),
}));

import { HeroClient } from "./HeroClient";

describe("<HeroClient />", () => {
  beforeEach(() => {
    document.body.innerHTML = '<section id="hero"></section>';
    // default to desktop, motion-allowed
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("min-width: 768px"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as typeof window.matchMedia;
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("returns null (no visible output)", () => {
    const { container } = render(<HeroClient />);
    expect(container.innerHTML).toBe("");
  });

  it("does not throw when mounted with a #hero present in the DOM", () => {
    expect(() => render(<HeroClient />)).not.toThrow();
  });

  it("does not throw when #hero is absent (SSR-safe no-op)", () => {
    document.body.innerHTML = "";
    expect(() => render(<HeroClient />)).not.toThrow();
  });

  it("calls ctx.revert on unmount", () => {
    const { unmount } = render(<HeroClient />);
    unmount();
    expect(mockContextRevert).toHaveBeenCalled();
  });

  it("respects prefers-reduced-motion: reduce", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as typeof window.matchMedia;
    expect(() => render(<HeroClient />)).not.toThrow();
  });
});
```

- [x] **Step 2: Run to confirm failure**

Run: `npm test -- HeroClient`

Expected: FAIL — at least one of the new assertions should fail because the existing stub returns `null` but doesn't handle lifecycle. The `ctx.revert on unmount` case will fail.

- [x] **Step 3: Replace `HeroClient.tsx` with the full implementation**

```tsx
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export function HeroClient() {
  useEffect(() => {
    const section = document.getElementById("hero");
    if (!section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;

    // Reduced motion: skip autoplay, snap reveal, stop here.
    if (reduced) {
      gsap.to(section, {
        duration: 0.6,
        delay: 0.2,
        "--hero-progress": 1,
        "--seam-x": "100%",
        ease: "power2.out",
      });
      return;
    }

    // Float animation (infinite, both breakpoints, non-reduced-motion)
    const laptop = section.querySelector<HTMLElement>("[data-hero-laptop]");
    const floatTween =
      laptop &&
      gsap.to(laptop, {
        y: -8,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

    // Lenis + GSAP ticker coordination (desktop only — mobile uses native scroll)
    let lenis: Lenis | null = null;
    if (desktop) {
      lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);
      const rafHandler = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(rafHandler);
      gsap.ticker.lagSmoothing(0);
    }

    const sparkles = Array.from(
      section.querySelectorAll<HTMLElement>("[data-hero-sparkle]"),
    );
    const sideLabels = Array.from(
      section.querySelectorAll<HTMLElement>("[data-hero-side-label]"),
    );

    const ctx = gsap.context(() => {
      if (desktop) {
        // Build one master scroll-linked timeline.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
        tl.to(
          section,
          { "--hero-progress": 1, "--seam-x": "100%", ease: "none" },
          0,
        );
        sparkles.forEach((sparkle, i) => {
          const delay = Number(
            getComputedStyle(sparkle).getPropertyValue("--sparkle-delay") ||
              i * 0.04,
          );
          tl.to(
            sparkle,
            { opacity: 1, duration: 0.4, ease: "power2.out" },
            0.4 + delay,
          );
        });
        tl.to(sideLabels, { opacity: 0, ease: "none" }, 0.9);
      } else {
        // Mobile: play once on first intersect, no scroll coupling.
        const io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              const tl = gsap.timeline();
              tl.to(
                section,
                {
                  "--hero-progress": 1,
                  "--seam-x": "100%",
                  duration: 1.8,
                  ease: "power3.out",
                },
                0,
              );
              sparkles.forEach((sparkle, i) => {
                tl.to(
                  sparkle,
                  { opacity: 1, duration: 0.4, ease: "power2.out" },
                  0.9 + i * 0.04,
                );
              });
              tl.to(sideLabels, { opacity: 0, duration: 0.3 }, 1.5);
              io.disconnect();
            }
          },
          { threshold: 0.3 },
        );
        io.observe(section);
      }
    }, section);

    return () => {
      ctx.revert();
      floatTween?.kill();
      if (lenis) {
        lenis.destroy();
      }
    };
  }, []);

  return null;
}
```

- [x] **Step 4: Run to confirm pass**

Run: `npm test -- HeroClient`

Expected: `5 passed`.

- [x] **Step 5: Full test suite + typecheck + lint + build**

```bash
npm test && npx tsc --noEmit && npm run lint && npm run build
```

Expected: all green.

- [x] **Step 6: Commit** (commit `cefe9ea`)

```bash
git add src/components/sections/Hero/HeroClient.tsx src/components/sections/Hero/HeroClient.test.tsx
git commit -m "feat(hero): wire HeroClient — GSAP + Lenis + ScrollTrigger / IO fork / reduced-motion snap"
git push origin main
```

- [x] **Step 7: Review fix pass** (commit `85b583e`) — code-quality reviewer flagged a mobile IO leak on unmount-before-intersection (raw `IntersectionObserver` inside `gsap.context` isn't reverted by `ctx.revert()`). Fix hoisted `io` to outer `useEffect` scope and added idempotent `io.disconnect()` to cleanup. Also replaced three broad `as gsap.TweenVars` casts with a narrow `CSSVarTweenVars` alias, tightened the reduced-motion test to assert Lenis + ticker were NOT touched, and added a new mobile IO one-shot test. HeroClient 6/6 · full suite 45/45 · tsc/lint/build clean.

---

## Task 10: Capture nextupco.com live hero via playwright-cli + transcode

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/public/assets/hero/nextup-live.mp4`
- Create: `/Users/dangeorge/The Vault/Dans Website/public/assets/hero/nextup-live.webm`
- Create: `/Users/dangeorge/The Vault/Dans Website/public/assets/hero/nextup-live-poster.webp`

**Context:** playwright-cli is installed globally (per CLAUDE.md). We use it to navigate to `https://nextupco.com`, wait for the hero animations to settle, and record ~6 seconds of the viewport. Then ffmpeg transcodes to MP4 (h264) and WebM (VP9) and extracts the first frame as the poster.

- [ ] **Step 1: Verify ffmpeg is available**

Run: `which ffmpeg && ffmpeg -version | head -1`

Expected: a path and a version line. If missing, install via `brew install ffmpeg` and re-run.

- [ ] **Step 2: Create a playwright capture script**

Create `scripts/capture-nextup-hero.mjs` (project-root):

```js
#!/usr/bin/env node
// One-shot capture of nextupco.com's hero viewport to a webm.
// Usage: node scripts/capture-nextup-hero.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT_DIR = "public/assets/hero";
const WEBM_RAW = `${OUT_DIR}/_raw-nextup.webm`;

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(dirname(WEBM_RAW), { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1120, height: 700 },
  deviceScaleFactor: 2,
  recordVideo: { dir: OUT_DIR, size: { width: 1120, height: 700 } },
});
const page = await ctx.newPage();
await page.goto("https://nextupco.com", { waitUntil: "networkidle" });
// Let the hero animations settle, then record ~6s of life.
await page.waitForTimeout(6000);
await page.close();
await ctx.close();
await browser.close();

// Playwright writes a randomly-named webm into OUT_DIR. Rename the newest file to _raw.
import { readdirSync, renameSync, statSync } from "node:fs";
const files = readdirSync(OUT_DIR)
  .filter((f) => f.endsWith(".webm") && !f.startsWith("_raw"))
  .map((f) => ({ f, t: statSync(`${OUT_DIR}/${f}`).mtimeMs }))
  .sort((a, b) => b.t - a.t);
if (files.length === 0) {
  console.error("No webm produced.");
  process.exit(1);
}
renameSync(`${OUT_DIR}/${files[0].f}`, WEBM_RAW);
console.log(`Raw capture: ${WEBM_RAW}`);
```

- [ ] **Step 3: Run the capture script**

Run: `node scripts/capture-nextup-hero.mjs`

Expected: prints `Raw capture: public/assets/hero/_raw-nextup.webm`. A ~1–3 MB raw webm file exists at that path.

- [ ] **Step 4: Transcode raw → optimised MP4 + WebM + poster**

Run (paste as one block):

```bash
RAW="public/assets/hero/_raw-nextup.webm"
OUT="public/assets/hero"

# Optimised MP4 (h264, web-streamed)
ffmpeg -y -i "$RAW" \
  -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p \
  -movflags +faststart -an \
  "$OUT/nextup-live.mp4"

# Optimised WebM (VP9)
ffmpeg -y -i "$RAW" \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -an \
  "$OUT/nextup-live.webm"

# Poster (first frame as WebP)
ffmpeg -y -i "$RAW" -ss 0 -vframes 1 -vf scale=1120:700 \
  "$OUT/nextup-live-poster.webp"

# Drop the raw file; keep only the three deliverables
rm -f "$RAW"

ls -lh "$OUT"
```

Expected:
- `nextup-live.mp4` present
- `nextup-live.webm` present
- `nextup-live-poster.webp` present
- Combined mp4 + webm size under ~1MB (at this resolution and duration)

- [ ] **Step 5: Visual spot-check**

Run: `npm run dev` and open `http://localhost:3000`.

Expected:
- Reality side of the laptop now plays the nextupco.com hero animation looped and muted
- On first page load, the seam is near the left (12%) so most of the screen shows the old NextUp build
- As you scroll, the seam sweeps right and the new site reveals

- [x] **Step 6: Commit** (commit `75292f7`)

```bash
git add scripts/capture-nextup-hero.mjs public/assets/hero/nextup-live.mp4 public/assets/hero/nextup-live.webm public/assets/hero/nextup-live-poster.webp
git commit -m "feat(hero): capture nextupco.com hero loop + transcode mp4/webm/poster"
git push origin main
```

- [x] **Step 7: Fix pass** (commit `8c612d7`) — first pass landed at 2.4 MB combined (2× plan budget) and a near-black poster (intro frame at t=0). Fix: shortened `waitForTimeout` from 6000 → 4000 ms, raised MP4 CRF 24 → 30 and WebM VP9 CRF 34 → 38, extracted poster at `-ss 2.5` instead of `-ss 0`. Final payload: mp4 580 KB + webm 630 KB = **1.24 MB combined** (under 1.3 MB ceiling), poster brightness 93.5/255. Resolver note: Playwright resolved via project-local `node_modules/` symlinks to the global `@playwright/cli` install — NODE_PATH failed for ESM bare-specifier resolution. No `package.json` changes.

---

## Task 11: Browser verification via playwright-cli

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/docs/verification/<DATE>-hero/*` (where `<DATE>` is today's ISO date, e.g. `2026-04-18-hero`)

**Purpose:** Prove the hero works across breakpoints and scroll states without manual inspection. Screenshots + a Lighthouse pass become the evidence.

- [ ] **Step 1: Start dev build**

Open a second terminal and run: `npm run dev`

Wait until `▲ Next.js ... Ready` appears.

- [ ] **Step 2: Create the verification folder**

Run (in project root, substituting today's actual date):

```bash
DATE=$(date +%Y-%m-%d)
mkdir -p "docs/verification/${DATE}-hero"
```

- [ ] **Step 3: Capture screenshots at 1920 / 768 / 375 at scroll 0%, 40%, 100%**

Use `playwright-cli` (globally installed). From project root, run each of the following and save the image into the verification folder.

```bash
DATE=$(date +%Y-%m-%d)
DIR="docs/verification/${DATE}-hero"

# Viewports to capture
for WIDTH in 1920 768 375; do
  HEIGHT=$((WIDTH == 1920 ? 1080 : (WIDTH == 768 ? 1024 : 812)))
  for SCROLL in 0 40 100; do
    playwright-cli snapshot http://localhost:3000 \
      --viewport ${WIDTH}x${HEIGHT} \
      --scroll-y "${SCROLL}vh" \
      --wait-for-timeout 1200 \
      --output "${DIR}/${WIDTH}-${SCROLL}.png"
  done
done
```

(If `playwright-cli`'s flags differ in this environment, fall back to a short Playwright script — consult `~/.claude/skills/playwright-cli/` for the exact CLI contract.)

Expected: 9 PNGs in the folder, one per viewport × scroll combination.

- [ ] **Step 4: Capture reduced-motion screenshot**

```bash
DATE=$(date +%Y-%m-%d)
DIR="docs/verification/${DATE}-hero"

playwright-cli snapshot http://localhost:3000 \
  --viewport 1920x1080 \
  --color-scheme "no-preference" \
  --reduced-motion "reduce" \
  --wait-for-timeout 2000 \
  --output "${DIR}/1920-reduced-motion.png"
```

Expected: 10th PNG. The seam should be at 100% (reveal snapped).

- [ ] **Step 5: Lighthouse pass**

```bash
DATE=$(date +%Y-%m-%d)
DIR="docs/verification/${DATE}-hero"

npx -y lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices \
  --output=html --output=json \
  --output-path="${DIR}/lighthouse" \
  --preset=desktop \
  --chrome-flags="--headless"
```

Expected: `lighthouse.report.html` + `lighthouse.report.json` in the folder. Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95. If any score is under target, note it in the commit message but do NOT block on it — `audit` + `polish` handle findings in Task 12.

- [ ] **Step 6: Verification checklist — manual pass by invoking `verification-before-completion`**

Invoke the `verification-before-completion` skill and run its checklist against this task. Record any findings inline in `docs/verification/<DATE>-hero/NOTES.md`.

- [x] **Step 7: Commit the evidence** (commit `91e62be`)

```bash
DATE=$(date +%Y-%m-%d)
git add "docs/verification/${DATE}-hero/"
git commit -m "verify(hero): playwright-cli screenshots + lighthouse pass"
git push origin main
```

**Execution notes for Task 11:**
- Installed `playwright-cli` v0.1.8 is session-based (`open`/`goto`/`resize`/`screenshot`/`close`) and lacks the plan's `--viewport`/`--scroll-y`/`--reduced-motion`/`--output` one-shot flags — plan-author fiction. Per the plan's own fallback clause, used `scripts/verify-hero.mjs` (short Playwright script resolving `playwright` via the global `@playwright/cli` transitive install + project-local symlinks from Task 10).
- Lighthouse on dev build: Perf 69 / A11y 100 / BP 100. Perf gap is dev-server Turbopack + unminified; re-measure on `next build && next start` in Task 12.
- **Runway finding:** seam scrub truncates because the hero is the only section on the page. Scrub range `[top top, bottom top]` on a 100vh section with ~80px of page-below-hero gives ~7% progress max. Standard fix = `pin: true, end: "+=100%"`. Falls to Task 12.

---

## Task 12: `audit` + `polish` passes

**Files:** whatever the skills suggest modifying.

- [x] **Step 1: Audit pass** — 13-item P1 checklist worked through (h1 structure, aria-labelledby, reduced-motion parity, video a11y, contrast, focus, motion curves, responsive wrap/legibility, preload, poster, img CLS). Findings recorded in `docs/verification/2026-04-18-hero/NOTES.md` "Task 12 outcomes" section.

- [x] **Step 2: P0 runway fix + P1 fixes applied**
    - P0 — pin `+=100%` on desktop ScrollTrigger so the scrub has a full viewport of runway (commit `72009cf`).
    - P1.3 — reduced-motion branch now also tweens sparkles to `opacity: 1` and side-labels to `opacity: 0` so the end-state matches scroll-complete (commit `d2382e9`).
    - P1.13 — `<img src="/assets/hero/nextup-old.webp">` now carries intrinsic `width={1120}` / `height={700}` as LCP hint (commit `d2382e9`).
    - 10 other audit items verified correct, no change needed.

- [x] **Step 3: Polish pass** — SKIPPED. The requested gold-accent seam rule + knob are already implemented in `HeroScreen.tsx` lines 89-110. Per "if nothing reads as missing, do nothing" guardrail: no change.

- [x] **Step 4: Re-captured screenshots** — `1920-{0,40,100}-polished.png` against `next start` prod build. Seam now visibly sweeps 0→100 (commit `36c105c`).

- [x] **Step 5: Final gates** — `npm test` 46/46, `tsc` 0, `lint` 0, `next build` green.

- [x] **Step 6: Evidence committed** — Lighthouse prod (Perf 97 / A11y 100 / BP 100), 3 polished screenshots, `scripts/verify-hero-polished.mjs`, NOTES.md appended (commit `36c105c`).

---

## Done criteria

- All tasks checked off, each with a commit pushed to `origin main`
- `npm test` — every suite green
- `npx tsc --noEmit` — no errors
- `npm run lint` — no errors
- `npm run build` — production build succeeds
- Hero renders cleanly at 1920 / 768 / 375 desktop / tablet / mobile
- Scroll-scrub reveals the reality side on desktop
- Mobile auto-plays the reveal once on first intersect
- `prefers-reduced-motion: reduce` snaps the reveal with no autoplay / float / sparkle animation
- Verification screenshots + Lighthouse report committed to `docs/verification/<DATE>-hero/`
- `Project Log.md` status updated to `hero-complete`

**Next phase after this plan:** Services section (per design.md §2.3) — separate spec + plan.
