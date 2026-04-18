# Services Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the "Tailored Digital Solutions" services section — three cards (UI/UX, Custom Development, Brand Strategy) that reveal themselves per-card with a gold seam sweep on desktop scroll, a choreographed one-shot reveal on mobile, and a quarter-circle gold arc flourish that strokes itself in on each card. Extends the hero's reveal motif at a smaller per-card scale, without stealing its pin.

**Architecture:** One Server Component (`Services.tsx`) renders the heading + 3-card grid composed of `ServiceCard.tsx` (also Server Component). All motion lives in a single `'use client'` sibling (`ServicesClient.tsx`) that attaches one ScrollTrigger per card on desktop (driving `--sweep-x` on each), an IntersectionObserver one-shot timeline on mobile (hoisted outside `gsap.context()`), and a `prefers-reduced-motion` branch that snaps every card to its lit final state. Hover 3D tilt is implemented with Motion (React) and is mounted/unmounted based on pointer type + reduced-motion preference.

**Tech Stack:** Next.js 16 (App Router, `src/` + `@/*` alias) · React 19 · Tailwind v4 · TypeScript · GSAP 3.15 + ScrollTrigger (Lenis already running from hero) · Motion 12 (React spring for tilt) · Vitest + RTL for TDD · playwright-cli for browser verification.

**Spec:** [docs/superpowers/specs/2026-04-18-services-section-design.md](../specs/2026-04-18-services-section-design.md)

**Skills active during build:** `taste-skill` (visual craft) · `impeccable` (design discipline) · `typeset` (Comico + Permanent Marker tuning) · `layout` (Task 3 composition) · `stitch-skill` (polish pass) · `TDD` (all component tasks) · `verification-before-completion` (Task 9) · `audit` + `polish` (Task 10).

---

## File Map

**Create (components):**
- `src/components/sections/Services/Services.tsx` — Server Component. Header + 3-card grid. Imports data + ServiceCard + ServicesClient.
- `src/components/sections/Services/ServicesClient.tsx` — `'use client'`. ScrollTrigger (desktop) + IO (mobile) + tilt (post-reveal) lifecycle. Renders nothing visible.
- `src/components/sections/Services/ServiceCard.tsx` — Server Component. One card: title, caption, arc SVG, sweep element.
- `src/components/sections/Services/services.data.ts` — The three service entries (`SERVICES` constant).
- `src/components/sections/Services/index.ts` — Re-exports `Services`.
- `src/components/sections/Services/Services.test.tsx`
- `src/components/sections/Services/ServiceCard.test.tsx`
- `src/components/sections/Services/ServicesClient.test.tsx`

**Modify:**
- `src/app/globals.css` — append Services tokens (`--sweep-x`, card surface/border, arc stroke length) + arc-float keyframes + reduced-motion guards.
- `src/app/page.tsx` — add `<Services />` after `<Hero />`.

---

## Task 0: Services design tokens + keyframes in `globals.css`

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/app/globals.css`

**Context:** The hero added its own `:root` token block + keyframes at the bottom of this file. Append a parallel block for Services — `--sweep-x` is the animation channel driven by GSAP per card, the arc stroke length constant (`75.4` = π × 48 / 2 for the quarter arc) drives `stroke-dashoffset`, and the reduced-motion guard snaps cards to lit.

- [ ] **Step 1: Append Services tokens and keyframes to `globals.css`**

Append this block to the end of the file:

```css
/* ---------- SERVICES TOKENS (Phase 3) ---------- */
:root {
  /* card surface */
  --services-card-bg: rgba(245, 245, 240, 0.02);
  --services-card-border: rgba(245, 245, 240, 0.08);
  --services-card-border-hover: rgba(200, 165, 92, 0.3);

  /* scroll-driven sweep channel (0 → 1 across each card) */
  --sweep-x: 0;

  /* arc geometry — quarter-circle r=48, circumference/4 ≈ 75.4 */
  --arc-length: 75.4;
}

/* ---------- SERVICES KEYFRAMES ---------- */
@keyframes services-arc-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-1px); }
}

/* ---------- REDUCED MOTION (SERVICES) ---------- */
@media (prefers-reduced-motion: reduce) {
  [data-services-card]      { --sweep-x: 1 !important; }
  [data-services-arc-float] { animation: none !important; }
}
```

- [ ] **Step 2: Verify dev server still renders without errors**

Run (in another terminal, non-blocking): `npm run dev`

Open `http://localhost:3000`. Expected: hero renders exactly as before — these tokens are inert until a component consumes them.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(style): add services tokens + arc-float keyframes + reduced-motion guards"
git push origin main
```

---

## Task 1: Build `services.data.ts` — the three entries

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Services/services.data.ts`

**Context:** Copy is locked in spec §4.6. `id` doubles as a CSS-safe key for `data-card-id` attribute and test selector.

- [ ] **Step 1: Create the folder**

Run: `mkdir -p "/Users/dangeorge/The Vault/Dans Website/src/components/sections/Services"`

- [ ] **Step 2: Create `services.data.ts`**

```ts
export type ServiceEntry = {
  id: "ui-ux" | "custom-dev" | "brand";
  title: string;
  body: string;
};

export const SERVICES: readonly ServiceEntry[] = [
  {
    id: "ui-ux",
    title: "UI / UX DESIGN",
    body: "Design that behaves. Every click predictable, every edge considered.",
  },
  {
    id: "custom-dev",
    title: "CUSTOM DEVELOPMENT",
    body: "Purpose-built. Not a theme you customised until it almost fit.",
  },
  {
    id: "brand",
    title: "BRAND STRATEGY",
    body: "A voice that's yours. Visuals that prove it.",
  },
] as const;
```

- [ ] **Step 3: Verify tsc clean**

Run: `npx tsc --noEmit`

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Services/services.data.ts
git commit -m "feat(services): add services copy data (UI/UX, Custom Dev, Brand)"
git push origin main
```

---

## Task 2: Build `ServiceCard` (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Services/ServiceCard.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Services/ServiceCard.test.tsx`

**Purpose:** One card — title, caption, architectural arc SVG flourish (gold, aria-hidden), sweep overlay element, `data-services-card` hook for ScrollTrigger, `data-card-id` for identification. Server Component — no state, no refs crossing boundaries.

- [ ] **Step 1: Write the failing test**

`src/components/sections/Services/ServiceCard.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServiceCard } from "./ServiceCard";

describe("<ServiceCard />", () => {
  const entry = {
    id: "ui-ux" as const,
    title: "UI / UX DESIGN",
    body: "Design that behaves. Every click predictable, every edge considered.",
  };

  it("renders title and body copy", () => {
    const { getByText } = render(<ServiceCard entry={entry} index={0} />);
    expect(getByText("UI / UX DESIGN")).toBeInTheDocument();
    expect(
      getByText("Design that behaves. Every click predictable, every edge considered."),
    ).toBeInTheDocument();
  });

  it("tags the root as an article with list-item role and data hooks", () => {
    const { container } = render(<ServiceCard entry={entry} index={0} />);
    const root = container.querySelector("article") as HTMLElement;
    expect(root.getAttribute("role")).toBe("listitem");
    expect(root.getAttribute("data-services-card")).toBe("");
    expect(root.getAttribute("data-card-id")).toBe("ui-ux");
  });

  it("renders an aria-hidden arc SVG with a quarter-circle path and dot", () => {
    const { container } = render(<ServiceCard entry={entry} index={0} />);
    const svg = container.querySelector("svg[aria-hidden='true']") as SVGElement;
    expect(svg).toBeTruthy();
    expect(svg.querySelector("path")).toBeTruthy();
    expect(svg.querySelector("circle")).toBeTruthy();
  });

  it("renders an aria-hidden sweep element", () => {
    const { container } = render(<ServiceCard entry={entry} index={0} />);
    const sweep = container.querySelector('[data-services-sweep]') as HTMLElement;
    expect(sweep).toBeTruthy();
    expect(sweep.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the title as an h3", () => {
    const { container } = render(<ServiceCard entry={entry} index={0} />);
    const h3 = container.querySelector("h3");
    expect(h3?.textContent).toBe("UI / UX DESIGN");
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test -- ServiceCard`

Expected: FAIL — module `./ServiceCard` not found.

- [ ] **Step 3: Implement `ServiceCard.tsx`**

```tsx
import type { ServiceEntry } from "./services.data";

type Props = {
  entry: ServiceEntry;
  index: number;
};

export function ServiceCard({ entry, index }: Props) {
  return (
    <article
      role="listitem"
      data-services-card=""
      data-card-id={entry.id}
      data-card-index={index}
      className="group relative overflow-hidden rounded-[12px] border p-0"
      style={{
        background: "var(--services-card-bg)",
        borderColor: "var(--services-card-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* card-image panel — holds arc, sweep, label */}
      <div
        className="relative flex min-h-[180px] flex-col justify-end p-8"
        style={{ background: "var(--bg-darker)" }}
      >
        {/* arc flourish — top-right */}
        <svg
          aria-hidden="true"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className="absolute right-4 top-4"
          data-services-arc-float
        >
          <path
            d="M 48 0 A 48 48 0 0 0 0 48"
            stroke="var(--gold-accent)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            pathLength="75.4"
            data-services-arc-path
            style={{
              strokeDasharray: "75.4",
              strokeDashoffset: "75.4",
            }}
          />
          <circle
            cx="48"
            cy="0"
            r="2"
            fill="var(--gold-accent)"
            data-services-arc-dot
            style={{ opacity: 0 }}
          />
        </svg>

        {/* sweep overlay — gold seam position keyed to --sweep-x */}
        <div
          aria-hidden="true"
          data-services-sweep
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, " +
              "rgba(200,165,92,0.6) calc(var(--sweep-x) * 100% - 1px), " +
              "rgba(200,165,92,0.6) calc(var(--sweep-x) * 100% + 1px), " +
              "transparent 100%)",
          }}
        />

        {/* label — unlock keyed to --sweep-x */}
        <div
          className="relative"
          data-services-label
          style={{
            opacity: "clamp(0, calc(var(--sweep-x) * 2 - 0.4), 1)",
          }}
        >
          <h3
            className="font-[var(--font-comico)] text-[24px] uppercase tracking-[0.05em]"
            style={{ color: "var(--text-primary)" }}
          >
            {entry.title}
          </h3>
          <p
            className="mt-2 font-[var(--font-marker)] text-[15px] leading-[1.5]"
            style={{ color: "var(--text-secondary)" }}
          >
            {entry.body}
          </p>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm test -- ServiceCard`

Expected: `5 passed`.

- [ ] **Step 5: Type check**

Run: `npx tsc --noEmit`

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Services/ServiceCard.tsx src/components/sections/Services/ServiceCard.test.tsx
git commit -m "feat(services): add ServiceCard — arc flourish + sweep overlay + label"
git push origin main
```

---

## Task 3: Build `Services` Server Component (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Services/Services.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Services/Services.test.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Services/index.ts`

**Purpose:** Section shell + "TAILORED DIGITAL SOLUTIONS" heading + 3-card grid. Imports and maps `SERVICES`. Includes `<ServicesClient />` stub for now — the motion lifecycle goes in later tasks. Server Component. No `'use client'`.

- [x] **Step 1: Write the failing test**

`src/components/sections/Services/Services.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Stub ServicesClient — client-only lifecycle is tested separately.
vi.mock("./ServicesClient", () => ({
  ServicesClient: () => null,
}));

import { Services } from "./Services";

describe("<Services />", () => {
  it("renders a <section> with the expected id and aria-labelledby", () => {
    const { container } = render(<Services />);
    const section = container.querySelector("section") as HTMLElement;
    expect(section.id).toBe("services");
    expect(section.getAttribute("aria-labelledby")).toBe("services-heading");
  });

  it("renders the locked heading text", () => {
    const { getByRole } = render(<Services />);
    const h2 = getByRole("heading", { level: 2 });
    expect(h2.id).toBe("services-heading");
    expect(h2.textContent).toBe("TAILORED DIGITAL SOLUTIONS");
  });

  it("renders a grid marked as a list with three listitems", () => {
    const { container } = render(<Services />);
    const list = container.querySelector('[role="list"]') as HTMLElement;
    expect(list).toBeTruthy();
    const items = list.querySelectorAll('[role="listitem"]');
    expect(items.length).toBe(3);
  });

  it("renders all three locked card titles", () => {
    const { getByText } = render(<Services />);
    expect(getByText("UI / UX DESIGN")).toBeInTheDocument();
    expect(getByText("CUSTOM DEVELOPMENT")).toBeInTheDocument();
    expect(getByText("BRAND STRATEGY")).toBeInTheDocument();
  });
});
```

- [x] **Step 2: Run to confirm failure**

Run: `npm test -- Services.test`

Expected: FAIL — module `./Services` not found.

- [x] **Step 3: Create stub `ServicesClient.tsx`**

Stub it so Services.tsx can import it. Real lifecycle goes in Task 4.

`src/components/sections/Services/ServicesClient.tsx`:

```tsx
"use client";

export function ServicesClient() {
  return null;
}
```

- [x] **Step 4: Implement `Services.tsx`**

```tsx
import { SERVICES } from "./services.data";
import { ServiceCard } from "./ServiceCard";
import { ServicesClient } from "./ServicesClient";

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative w-full py-32 md:py-40"
      style={{ background: "var(--bg-darker)" }}
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <h2
            id="services-heading"
            className="mb-8 text-center font-[var(--font-comico)] text-[36px] uppercase tracking-[0.05em] md:mb-12 md:text-[48px]"
            style={{ color: "var(--text-primary)" }}
            data-services-heading
          >
            TAILORED DIGITAL SOLUTIONS
          </h2>

          <div
            role="list"
            className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
            style={{ perspective: "1000px" }}
            data-services-grid
          >
            {SERVICES.map((entry, i) => (
              <div
                key={entry.id}
                className={
                  i === 2
                    ? "md:col-span-2 lg:col-span-1"
                    : undefined
                }
              >
                <ServiceCard entry={entry} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ServicesClient />
    </section>
  );
}
```

- [x] **Step 5: Create barrel `index.ts`**

```ts
export { Services } from "./Services";
```

- [x] **Step 6: Run to confirm pass**

Run: `npm test -- Services.test`

Expected: `4 passed`.

- [x] **Step 7: Type check**

Run: `npx tsc --noEmit`

Expected: no errors.

- [x] **Step 8: Commit** — `124b386`

---

## Task 4: Wire `<Services />` into `page.tsx` + visual check static state

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/app/page.tsx`

**Context:** Cards currently render lit by default (no `ServicesClient` logic yet = `--sweep-x` inherits its `:root` default of 0, BUT we want cards visible so we verify markup + copy before wiring motion). We'll temporarily force `--sweep-x: 1` at the section level via an inline style until Task 5 onwards drives it. Simpler: flip the default in globals.css to `1` so un-mounted / static rendering shows lit cards — Task 5 will override to `0` on mount before animating to `1`. Per spec §11 SSR-flash protection, this matches the designed approach.

- [ ] **Step 1: Update `:root` default for `--sweep-x` to `1` in `globals.css`**

Open `src/app/globals.css`, find the Services tokens block added in Task 0, change:

```css
  --sweep-x: 0;
```

to:

```css
  --sweep-x: 1;
```

(Comment in place so it's clear why:)

```css
  /* default to lit; ServicesClient will set to 0 on mount before animating */
  --sweep-x: 1;
```

- [ ] **Step 2: Modify `page.tsx`**

Replace the entire contents of `src/app/page.tsx` with:

```tsx
import { Hero } from "@/components/sections/Hero/Hero";
import { Services } from "@/components/sections/Services/Services";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
    </>
  );
}
```

- [ ] **Step 3: Start dev server and visual-check**

Run (non-blocking): `npm run dev`

Open `http://localhost:3000`. Scroll past hero. Expected:

- "TAILORED DIGITAL SOLUTIONS" heading centred, Comico, all-caps
- Three cards in a row at desktop width (stack at mobile widths)
- Each card: gold arc in top-right corner of the dark panel, title + body fully lit
- No console errors / React warnings
- Hero still behaves as before (pinned reveal, seam scrub)

- [ ] **Step 4: Run full test suite + type check + lint + build**

```bash
npm test -- --run && npx tsc --noEmit && npm run lint && npm run build
```

Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/globals.css
git commit -m "feat(services): mount <Services /> on home page; default --sweep-x to lit"
git push origin main
```

---

## Task 5: Implement desktop scroll-linked reveal in `ServicesClient` (TDD)

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Services/ServicesClient.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Services/ServicesClient.test.tsx`

**Purpose:** Per-card ScrollTrigger drives `--sweep-x: 0 → 1` on each `[data-services-card]`. Uses `gsap.context()` scoped to a section ref. On mount, every card is reset to `--sweep-x: 0` (so they animate IN rather than flash). Arc stroke draw-in is tweened by GSAP when a per-card progress threshold is crossed (0.6). The header gets its own ScrollTrigger for fade-up + letter-spacing breath.

Desktop-only: gated by `window.matchMedia("(min-width: 768px)").matches` AND `prefers-reduced-motion: no-preference`. The mobile + reduced-motion branches are stubbed — separate tasks implement them. This keeps each task's surface area small.

**Type helper reused from hero:**

```ts
type CSSVarTweenVars = gsap.TweenVars & Record<`--${string}`, string | number>;
```

- [ ] **Step 1: Write the failing test**

`src/components/sections/Services/ServicesClient.test.tsx`:

```tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const scrollTriggerCreate = vi.fn();
const scrollTriggerKill = vi.fn();
const gsapContextRevert = vi.fn();
const gsapSetSpy = vi.fn();
const gsapToSpy = vi.fn();

vi.mock("gsap", () => {
  const gsap = {
    registerPlugin: vi.fn(),
    set: gsapSetSpy,
    to: gsapToSpy,
    context: (fn: () => void) => {
      fn();
      return { revert: gsapContextRevert };
    },
  };
  return { default: gsap, gsap };
});

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: (opts: any) => {
      scrollTriggerCreate(opts);
      return { kill: scrollTriggerKill };
    },
    getAll: () => [],
  },
}));

function Harness() {
  return (
    <section aria-labelledby="services-heading">
      <h2 id="services-heading" data-services-heading>
        TAILORED DIGITAL SOLUTIONS
      </h2>
      <div data-services-grid>
        <article data-services-card data-card-id="ui-ux" data-card-index="0">
          <svg><path data-services-arc-path /><circle data-services-arc-dot /></svg>
        </article>
        <article data-services-card data-card-id="custom-dev" data-card-index="1">
          <svg><path data-services-arc-path /><circle data-services-arc-dot /></svg>
        </article>
        <article data-services-card data-card-id="brand" data-card-index="2">
          <svg><path data-services-arc-path /><circle data-services-arc-dot /></svg>
        </article>
      </div>
    </section>
  );
}

describe("<ServicesClient /> — desktop branch", () => {
  beforeEach(() => {
    scrollTriggerCreate.mockReset();
    scrollTriggerKill.mockReset();
    gsapContextRevert.mockReset();
    gsapSetSpy.mockReset();
    gsapToSpy.mockReset();

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("min-width"), // desktop=true, reduced-motion=false
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("creates one ScrollTrigger per card + one for the heading", async () => {
    const { ServicesClient } = await import("./ServicesClient");
    render(
      <>
        <Harness />
        <ServicesClient />
      </>,
    );
    // 3 cards + 1 heading = 4
    expect(scrollTriggerCreate).toHaveBeenCalledTimes(4);
  });

  it("initialises every card with --sweep-x: 0 before wiring scroll", async () => {
    const { ServicesClient } = await import("./ServicesClient");
    render(
      <>
        <Harness />
        <ServicesClient />
      </>,
    );
    const calls = gsapSetSpy.mock.calls;
    const hasCardReset = calls.some(([target, vars]) => {
      const t = Array.isArray(target) ? target[0] : target;
      return (
        (t as HTMLElement)?.dataset?.servicesCard === "" &&
        (vars as any)["--sweep-x"] === 0
      );
    });
    expect(hasCardReset).toBe(true);
  });

  it("reverts gsap context on unmount", async () => {
    const { ServicesClient } = await import("./ServicesClient");
    const { unmount } = render(
      <>
        <Harness />
        <ServicesClient />
      </>,
    );
    unmount();
    expect(gsapContextRevert).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test -- ServicesClient`

Expected: FAIL — expected 4 ScrollTrigger calls, got 0 (stub still returns null).

- [ ] **Step 3: Implement `ServicesClient.tsx` (desktop branch + stubs)**

Replace the stub:

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type CSSVarTweenVars = gsap.TweenVars & Record<`--${string}`, string | number>;

gsap.registerPlugin(ScrollTrigger);

const ARC_LENGTH = 75.4;

export function ServicesClient() {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Scope = the nearest services section (our sibling).
    const section = document.getElementById("services");
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    if (prefersReducedMotion) {
      // snap-to-lit — cards already render lit via default token; nothing to do.
      return;
    }

    if (!isDesktop) {
      // mobile path lands in Task 6
      return;
    }

    const cards = Array.from(
      section.querySelectorAll<HTMLElement>("[data-services-card]"),
    );
    const heading = section.querySelector<HTMLElement>(
      "[data-services-heading]",
    );

    const ctx = gsap.context(() => {
      // reset each card to dim before animating in
      cards.forEach((card) => {
        gsap.set(card, { "--sweep-x": 0 } as CSSVarTweenVars);
      });

      // header reveal
      if (heading) {
        gsap.set(heading, {
          y: 16,
          opacity: 0,
          letterSpacing: "0.08em",
        });
        ScrollTrigger.create({
          trigger: heading,
          start: "top 75%",
          once: true,
          onEnter: () => {
            gsap.to(heading, {
              y: 0,
              opacity: 1,
              letterSpacing: "0.05em",
              duration: 0.6,
              ease: "power2.out",
            });
          },
        });
      }

      // per-card scroll-linked sweep
      cards.forEach((card) => {
        const arcPath = card.querySelector<SVGPathElement>(
          "[data-services-arc-path]",
        );
        const arcDot = card.querySelector<SVGCircleElement>(
          "[data-services-arc-dot]",
        );
        let arcDrawn = false;

        ScrollTrigger.create({
          trigger: card,
          start: "top 80%",
          end: "top 30%",
          scrub: 0.6,
          onUpdate: (self) => {
            gsap.set(card, {
              "--sweep-x": self.progress,
            } as CSSVarTweenVars);

            if (!arcDrawn && self.progress >= 0.6) {
              arcDrawn = true;
              if (arcPath) {
                gsap.to(arcPath, {
                  strokeDashoffset: 0,
                  duration: 0.6,
                  ease: "power2.out",
                });
              }
              if (arcDot) {
                gsap.to(arcDot, {
                  opacity: 1,
                  duration: 0.2,
                  delay: 0.4,
                  ease: "power2.out",
                });
              }
            }
          },
        });
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return <div ref={scopeRef} aria-hidden="true" className="sr-only" />;
}
```

- [ ] **Step 4: Run tests to confirm pass**

Run: `npm test -- ServicesClient`

Expected: `3 passed`.

- [ ] **Step 5: Manual visual check in the browser**

Dev server should still be running. Open `http://localhost:3000`. Scroll down. Expected:

- Cards start dim (opacity 0.4 on panels) as they enter viewport
- Gold seam sweeps L→R across each card as you scroll
- Title + caption unlock (dim → lit) as seam passes
- Arc strokes in once seam passes ~60%, dot fades in shortly after
- Heading fades up with tiny letter-spacing settle on first scroll into section

- [ ] **Step 6: Type check + lint + build**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: all clean.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Services/ServicesClient.tsx src/components/sections/Services/ServicesClient.test.tsx
git commit -m "feat(services): desktop scroll-linked reveal — per-card sweep + arc draw-in"
git push origin main
```

---

## Task 6: Add mobile one-shot reveal branch in `ServicesClient` (TDD)

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Services/ServicesClient.tsx`
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Services/ServicesClient.test.tsx`

**Purpose:** On viewports < 768px, replace scrub with an IntersectionObserver one-shot timeline: header fades up, then each card staggers 200ms apart with sweep + scale + arc draw + opacity. After reveal completes, arcs start a tiny ±1px vertical float. Per spec, the IO must be hoisted OUTSIDE `gsap.context()` and its cleanup handled by the outer effect (not by `ctx.revert()`).

- [ ] **Step 1: Extend test file with mobile-branch cases**

Append to `src/components/sections/Services/ServicesClient.test.tsx`:

```tsx
const observeSpy = vi.fn();
const disconnectSpy = vi.fn();

describe("<ServicesClient /> — mobile branch", () => {
  let ioCallback: IntersectionObserverCallback | null = null;

  beforeEach(() => {
    scrollTriggerCreate.mockReset();
    gsapContextRevert.mockReset();
    gsapSetSpy.mockReset();
    gsapToSpy.mockReset();
    observeSpy.mockReset();
    disconnectSpy.mockReset();
    ioCallback = null;

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: !query.includes("min-width") && !query.includes("reduced"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn(function (
        this: IntersectionObserver,
        cb: IntersectionObserverCallback,
      ) {
        ioCallback = cb;
        this.observe = observeSpy;
        this.disconnect = disconnectSpy;
        this.unobserve = vi.fn();
        this.takeRecords = vi.fn(() => []);
        return this;
      }),
    );
  });

  it("observes the services section on mount (mobile)", async () => {
    const mod = await import("./ServicesClient");
    render(
      <>
        <Harness />
        <mod.ServicesClient />
      </>,
    );
    expect(observeSpy).toHaveBeenCalledTimes(1);
    expect(scrollTriggerCreate).not.toHaveBeenCalled();
  });

  it("disconnects the observer on unmount (leak guard)", async () => {
    const mod = await import("./ServicesClient");
    const { unmount } = render(
      <>
        <Harness />
        <mod.ServicesClient />
      </>,
    );
    unmount();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it("fires the one-shot timeline when the section intersects", async () => {
    const mod = await import("./ServicesClient");
    render(
      <>
        <Harness />
        <mod.ServicesClient />
      </>,
    );
    // simulate intersection
    const entry = { isIntersecting: true, intersectionRatio: 0.5 } as IntersectionObserverEntry;
    ioCallback!([entry], {} as IntersectionObserver);
    expect(gsapToSpy).toHaveBeenCalled();
    // should disconnect after firing (one-shot)
    expect(disconnectSpy).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run to confirm new tests fail**

Run: `npm test -- ServicesClient`

Expected: 3 mobile tests FAIL — IO not attached, gsap.to not called, disconnect not called.

- [ ] **Step 3: Implement mobile branch**

Replace the `if (!isDesktop) { return; }` block in `ServicesClient.tsx` with the mobile implementation. Also extend the outer cleanup to disconnect the IO. The full updated `useEffect` body:

```tsx
useEffect(() => {
  if (typeof window === "undefined") return;

  const section = document.getElementById("services");
  if (!section) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  // IO hoisted OUTSIDE gsap.context — raw DOM observers aren't tracked by ctx.revert().
  let io: IntersectionObserver | null = null;

  if (prefersReducedMotion) {
    return () => {
      // nothing to tear down
    };
  }

  const cards = Array.from(
    section.querySelectorAll<HTMLElement>("[data-services-card]"),
  );
  const heading = section.querySelector<HTMLElement>(
    "[data-services-heading]",
  );

  const ctx = gsap.context(() => {
    // reset each card to dim before animating in
    cards.forEach((card) => {
      gsap.set(card, { "--sweep-x": 0 } as CSSVarTweenVars);
    });

    if (isDesktop) {
      // header reveal
      if (heading) {
        gsap.set(heading, {
          y: 16,
          opacity: 0,
          letterSpacing: "0.08em",
        });
        ScrollTrigger.create({
          trigger: heading,
          start: "top 75%",
          once: true,
          onEnter: () => {
            gsap.to(heading, {
              y: 0,
              opacity: 1,
              letterSpacing: "0.05em",
              duration: 0.6,
              ease: "power2.out",
            });
          },
        });
      }

      // per-card scroll-linked sweep
      cards.forEach((card) => {
        const arcPath = card.querySelector<SVGPathElement>(
          "[data-services-arc-path]",
        );
        const arcDot = card.querySelector<SVGCircleElement>(
          "[data-services-arc-dot]",
        );
        let arcDrawn = false;

        ScrollTrigger.create({
          trigger: card,
          start: "top 80%",
          end: "top 30%",
          scrub: 0.6,
          onUpdate: (self) => {
            gsap.set(card, {
              "--sweep-x": self.progress,
            } as CSSVarTweenVars);

            if (!arcDrawn && self.progress >= 0.6) {
              arcDrawn = true;
              if (arcPath) {
                gsap.to(arcPath, {
                  strokeDashoffset: 0,
                  duration: 0.6,
                  ease: "power2.out",
                });
              }
              if (arcDot) {
                gsap.to(arcDot, {
                  opacity: 1,
                  duration: 0.2,
                  delay: 0.4,
                  ease: "power2.out",
                });
              }
            }
          },
        });
      });
    } else {
      // mobile one-shot — scale + opacity initial state; fired by IO below
      if (heading) {
        gsap.set(heading, { y: 12, opacity: 0 });
      }
      cards.forEach((card) => {
        gsap.set(card, { opacity: 0, scale: 0.98 });
      });
    }
  }, section);

  if (!isDesktop) {
    io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;

        const tl = gsap.timeline();

        if (heading) {
          tl.to(heading, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        }

        cards.forEach((card, i) => {
          const arcPath = card.querySelector<SVGPathElement>(
            "[data-services-arc-path]",
          );
          const arcDot = card.querySelector<SVGCircleElement>(
            "[data-services-arc-dot]",
          );

          const cardStart = 0.2 + i * 0.2; // 200ms stagger

          tl.to(
            card,
            {
              opacity: 1,
              scale: 1,
              duration: 0.7,
              ease: "power2.out",
            },
            cardStart,
          );

          tl.to(
            card,
            {
              "--sweep-x": 1,
              duration: 0.9,
              ease: "power2.out",
            } as CSSVarTweenVars,
            cardStart,
          );

          if (arcPath) {
            tl.to(
              arcPath,
              {
                strokeDashoffset: 0,
                duration: 0.6,
                ease: "power2.out",
              },
              cardStart + 0.54,
            );
          }
          if (arcDot) {
            tl.to(
              arcDot,
              {
                opacity: 1,
                duration: 0.2,
                ease: "power2.out",
              },
              cardStart + 0.9,
            );
          }
        });

        // post-reveal arc float
        tl.add(() => {
          cards.forEach((card) => {
            const arcSvg = card.querySelector<SVGElement>(
              "[data-services-arc-float]",
            );
            if (arcSvg) {
              gsap.to(arcSvg, {
                y: -1,
                duration: 2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              });
            }
          });
        });

        // one-shot
        io?.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(section);
  }

  return () => {
    ctx.revert();
    if (io) io.disconnect();
  };
}, []);
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm test -- ServicesClient`

Expected: all 6 tests pass (3 desktop + 3 mobile).

- [ ] **Step 5: Manual visual check on mobile viewport**

In a browser, resize to 375px wide (Chrome devtools device toolbar → iPhone). Refresh. Scroll past hero. Expected:

- Heading fades up when section enters viewport
- Cards reveal staggered 200ms apart with gold sweep + scale + arc
- Arcs continue a tiny float after reveal completes
- Resize to desktop: desktop behaviour resumes on reload

- [ ] **Step 6: Type check + lint + build**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: all clean.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Services/ServicesClient.tsx src/components/sections/Services/ServicesClient.test.tsx
git commit -m "feat(services): mobile one-shot reveal — IO-triggered stagger + post-reveal float"
git push origin main
```

---

## Task 7: Add 3D hover tilt via Motion (TDD)

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Services/ServiceCard.tsx`
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Services/ServiceCard.test.tsx`

**Purpose:** On pointer devices with motion allowed, cards respond to pointer position with a ±3° rotateX/rotateY. Uses Motion's `motion.article` + `useMotionValue` + `useSpring` for damping. Disabled on `(pointer: coarse)` or `prefers-reduced-motion: reduce`.

Note: ServiceCard was a Server Component. Converting the wrapper to a Motion-backed client component means we need to either:
- **Option A:** Make ServiceCard `'use client'` (simplest, single file, since the card needs pointer handlers anyway).
- **Option B:** Extract a `ServiceCardTilt.tsx` client wrapper around the Server Component.

Option A is cleaner — the card *has* client-only behaviour now. Server Components are the default but not a dogma. Convert `ServiceCard` to `'use client'`.

- [ ] **Step 1: Extend test file with tilt tests**

Open `src/components/sections/Services/ServiceCard.test.tsx`. Append:

```tsx
describe("<ServiceCard /> — hover tilt", () => {
  const entry = {
    id: "ui-ux" as const,
    title: "UI / UX DESIGN",
    body: "Design that behaves. Every click predictable, every edge considered.",
  };

  beforeEach(() => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: !query.includes("coarse") && !query.includes("reduced"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("responds to pointermove on pointer-fine devices", () => {
    const { container } = render(<ServiceCard entry={entry} index={0} />);
    const root = container.querySelector("article") as HTMLElement;

    // Set rect so we can compute pointer-relative angles
    root.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        right: 300,
        bottom: 300,
        width: 300,
        height: 300,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    root.dispatchEvent(
      new PointerEvent("pointermove", {
        clientX: 280,
        clientY: 20,
        bubbles: true,
      }),
    );

    // At top-right corner, rotateY should be positive (tilt right) and rotateX negative (tilt up)
    // Motion spring-damps; we just assert transform was applied (non-empty).
    // Note: MotionValue writes via transform via rAF — we read the style directly after flush.
    expect(root.style.transform || "").not.toBe("");
  });

  it("does not wire pointer handlers on pointer-coarse (touch)", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("coarse"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { container } = render(<ServiceCard entry={entry} index={0} />);
    const root = container.querySelector("article") as HTMLElement;
    root.dispatchEvent(
      new PointerEvent("pointermove", { clientX: 100, clientY: 100 }),
    );
    // transform should remain empty / untouched
    expect(root.style.transform || "").toBe("");
  });
});
```

Also add `beforeEach` import at the top:

```tsx
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
```

- [ ] **Step 2: Run to confirm new tests fail**

Run: `npm test -- ServiceCard`

Expected: 2 new tests FAIL — pointer handlers not wired.

- [ ] **Step 3: Convert `ServiceCard.tsx` to client component with Motion tilt**

Replace the full contents of `src/components/sections/Services/ServiceCard.tsx`:

```tsx
"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ServiceEntry } from "./services.data";

type Props = {
  entry: ServiceEntry;
  index: number;
};

const TILT_MAX = 3; // degrees

export function ServiceCard({ entry, index }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [tiltEnabled, setTiltEnabled] = useState(false);

  // Motion values — center at 0, mapped to rotate degrees via useTransform
  const mvX = useMotionValue(0); // -1 → 1 across x
  const mvY = useMotionValue(0); // -1 → 1 across y

  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };
  const smoothX = useSpring(mvX, springConfig);
  const smoothY = useSpring(mvY, springConfig);

  const rotateY = useTransform(smoothX, [-1, 1], [-TILT_MAX, TILT_MAX]);
  const rotateX = useTransform(smoothY, [-1, 1], [TILT_MAX, -TILT_MAX]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTiltEnabled(!coarse && !reduced);
  }, []);

  useEffect(() => {
    if (!tiltEnabled) return;
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0 → 1
      const y = (e.clientY - rect.top) / rect.height; // 0 → 1
      mvX.set(x * 2 - 1);
      mvY.set(y * 2 - 1);
    };
    const handleLeave = () => {
      mvX.set(0);
      mvY.set(0);
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [tiltEnabled, mvX, mvY]);

  return (
    <motion.article
      ref={ref}
      role="listitem"
      data-services-card=""
      data-card-id={entry.id}
      data-card-index={index}
      className="group relative overflow-hidden rounded-[12px] border p-0 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-[2px]"
      style={{
        background: "var(--services-card-bg)",
        borderColor: "var(--services-card-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        rotateX: tiltEnabled ? rotateX : 0,
        rotateY: tiltEnabled ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      whileHover={{
        borderColor: "var(--services-card-border-hover)",
      }}
    >
      <div
        className="relative flex min-h-[180px] flex-col justify-end p-8"
        style={{ background: "var(--bg-darker)" }}
      >
        <svg
          aria-hidden="true"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className="absolute right-4 top-4"
          data-services-arc-float
        >
          <path
            d="M 48 0 A 48 48 0 0 0 0 48"
            stroke="var(--gold-accent)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            pathLength="75.4"
            data-services-arc-path
            style={{
              strokeDasharray: "75.4",
              strokeDashoffset: "75.4",
            }}
          />
          <circle
            cx="48"
            cy="0"
            r="2"
            fill="var(--gold-accent)"
            data-services-arc-dot
            style={{ opacity: 0 }}
          />
        </svg>

        <div
          aria-hidden="true"
          data-services-sweep
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, " +
              "rgba(200,165,92,0.6) calc(var(--sweep-x) * 100% - 1px), " +
              "rgba(200,165,92,0.6) calc(var(--sweep-x) * 100% + 1px), " +
              "transparent 100%)",
          }}
        />

        <div
          className="relative"
          data-services-label
          style={{
            opacity: "clamp(0, calc(var(--sweep-x) * 2 - 0.4), 1)",
          }}
        >
          <h3
            className="font-[var(--font-comico)] text-[24px] uppercase tracking-[0.05em]"
            style={{ color: "var(--text-primary)" }}
          >
            {entry.title}
          </h3>
          <p
            className="mt-2 font-[var(--font-marker)] text-[15px] leading-[1.5]"
            style={{ color: "var(--text-secondary)" }}
          >
            {entry.body}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm test -- ServiceCard`

Expected: 7 passed (5 original + 2 new).

- [ ] **Step 5: Manual check — hover tilt on desktop**

Dev server. Hover a card with the mouse. Expected:

- Card tilts subtly toward pointer (max ±3°)
- Border brightens to gold-tint
- Lift 2px on hover-in, settles back
- Leave card: tilt returns smoothly to flat
- No jank, no jitter

Mobile (pointer-coarse via devtools device emulation): tap cards — no tilt, no hover border.

- [ ] **Step 6: Type check + lint + build**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: all clean.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Services/ServiceCard.tsx src/components/sections/Services/ServiceCard.test.tsx
git commit -m "feat(services): 3D hover tilt on cards via Motion (spring-damped, ±3°)"
git push origin main
```

---

## Task 8: Browser verification via playwright-cli

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/scripts/verify-services.mjs`
- Create: `/Users/dangeorge/The Vault/Dans Website/docs/verification/2026-04-18-services/` (directory)
- Create: `/Users/dangeorge/The Vault/Dans Website/docs/verification/2026-04-18-services/NOTES.md`

**Context:** playwright-cli is session-based (v0.1.8) — `open`/`goto`/`resize`/`screenshot`/`close`. Since we need multiple viewports, multiple scroll positions, reduced-motion variants, and reproducibility, prefer a short Playwright Node script over flag-driven CLI calls. The symlink to global playwright already exists in `node_modules/` from Task 10 of the hero phase.

The script boots `next start` via `npm run build && npm run start`, navigates to `http://localhost:3000`, scrolls into the services section at each viewport, and saves screenshots.

**Expected viewports:** 1920×1080 (desktop) · 768×1024 (tablet) · 375×812 (mobile)

**Expected scroll positions per viewport:**
1. Services section just entering (heading visible, first card dim)
2. Mid-sweep on cards
3. Post-reveal (arcs drawn, all lit)

Plus: reduced-motion variant at desktop width — confirm snap state.

- [ ] **Step 1: Build prod bundle**

```bash
npm run build
```

Expected: build succeeds, no warnings relevant to Services.

- [ ] **Step 2: Start prod server (background)**

```bash
npm run start &
```

Wait ~2s for boot. Verify: `curl -s http://localhost:3000 | grep services-heading` returns a non-empty match.

- [ ] **Step 3: Create `scripts/verify-services.mjs`**

```js
import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = "docs/verification/2026-04-18-services";
await mkdir(OUT, { recursive: true });

const viewports = [
  { name: "desktop", width: 1920, height: 1080 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812 },
];

const SCROLL_POSITIONS = [
  { name: "01-entering", fn: "services-entering" },
  { name: "02-mid-sweep", fn: "services-mid" },
  { name: "03-revealed", fn: "services-revealed" },
];

async function runViewport(browser, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // wait for services section
  await page.waitForSelector("#services");

  const servicesTop = await page.evaluate(() => {
    const el = document.getElementById("services");
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });

  const viewportH = vp.height;

  const positions = [
    servicesTop - viewportH * 0.9, // just entering
    servicesTop - viewportH * 0.3, // mid
    servicesTop + viewportH * 0.5, // revealed
  ];

  for (let i = 0; i < SCROLL_POSITIONS.length; i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), positions[i]);
    await page.waitForTimeout(600); // let scrub/anim settle
    await page.screenshot({
      path: join(OUT, `${vp.name}-${SCROLL_POSITIONS[i].name}.png`),
      fullPage: false,
    });
  }

  await context.close();
}

async function runReducedMotion(browser) {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForSelector("#services");
  const servicesTop = await page.evaluate(() => {
    return document.getElementById("services").getBoundingClientRect().top + window.scrollY;
  });
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), servicesTop - 100);
  await page.waitForTimeout(400);
  await page.screenshot({
    path: join(OUT, "desktop-reduced-motion.png"),
    fullPage: false,
  });
  await context.close();
}

const browser = await chromium.launch({ headless: true });
for (const vp of viewports) {
  await runViewport(browser, vp);
}
await runReducedMotion(browser);
await browser.close();
console.log("Verification complete.");
```

- [ ] **Step 4: Run the verification script**

```bash
node scripts/verify-services.mjs
```

Expected: 10 screenshots saved under `docs/verification/2026-04-18-services/`.

- [ ] **Step 5: Stop the prod server**

```bash
pkill -f "next start"
```

- [ ] **Step 6: Manually review screenshots**

Open each PNG. Verify, for each viewport:

- **01-entering:** cards visible in dim state (panels faded, body copy faint). Heading not yet revealed or mid-reveal.
- **02-mid-sweep:** gold seam visible mid-card on at least one card. Typography partially unlocked.
- **03-revealed:** all three cards fully lit, arcs fully drawn + dot present.
- **desktop-reduced-motion:** all cards lit, no mid-animation artifact.

If any screenshot shows a regression (blank card, arc missing, caption unreadable), stop and fix before continuing.

- [ ] **Step 7: Write `NOTES.md`**

Create `docs/verification/2026-04-18-services/NOTES.md`:

```markdown
# Services — Browser Verification (2026-04-18)

Captured via `scripts/verify-services.mjs` against prod build (`next build && next start`).

## Viewports
- Desktop: 1920×1080
- Tablet: 768×1024
- Mobile: 375×812

## Scroll positions
- 01 entering: services section top at ~10% above fold
- 02 mid-sweep: heading visible + cards mid-reveal
- 03 revealed: post-reveal state

## Reduced-motion
- `reducedMotion: "reduce"` in Playwright context → cards snap lit.

## Results
[fill in observations per screenshot: any regressions, layout oddities, reduced-motion parity issues]

## Follow-ups for Task 9 (audit + polish)
[list items]
```

Fill in the Results section honestly as you review screenshots.

- [ ] **Step 8: Commit**

```bash
git add scripts/verify-services.mjs docs/verification/2026-04-18-services/
git commit -m "verify(services): playwright-cli breakpoint + reduced-motion screenshots"
git push origin main
```

---

## Task 9: `audit` + `polish` passes

**Files:**
- Modify: any files flagged by audit/polish — likely `src/components/sections/Services/*.tsx` and/or `src/app/globals.css`

**Purpose:** One final accessibility + taste pass before declaring the section done. Audit covers a11y (tab order, focus, contrast, aria labels, reduced motion parity). Polish covers micro-details (spacing, typography, border weights, easings).

- [ ] **Step 1: Audit pass — a11y checklist**

Walk through each:

1. **Keyboard:** Tab from nav → hero → services heading → cards (if interactive) → footer. No keyboard trap.
2. **Focus visible:** Cards are `<article>` so no focus today. If the user later makes them links, ensure visible 2px gold focus ring with 4px offset.
3. **Contrast:** Caption text (`--text-secondary` = `#B3C9BB`) on `#0B2422` — run through a checker; must clear WCAG AA (4.5:1). If not, bump token.
4. **Reduced motion:** `prefers-reduced-motion: reduce` → heading static, cards fully lit, arcs drawn, no float, no tilt. (Verified in Task 8 screenshot.)
5. **Screen reader:** Landmark region (`<section aria-labelledby>`), heading at h2, cards as listitems. Run VoiceOver briefly to sanity-check.
6. **Touch targets:** N/A (no tap targets yet; revisit if cards become links).
7. **Reflow at 320px:** no horizontal overflow.
8. **Motion pauses on tab-hidden:** GSAP pauses ScrollTrigger naturally. Nothing to do.

Fix any finding inline. Commit each fix separately if non-trivial.

- [ ] **Step 2: Polish pass — taste checklist**

Walk through each:

1. **Heading:** Does 48px Comico read right? Line-height? Letter-spacing breath noticeable without being showy?
2. **Cards:** 32px padding on image panel — does the title sit comfortably? Caption line-length not too wide?
3. **Arc:** 48px is the spec; does it feel right or too big/too small on real viewports? Adjust if needed.
4. **Sweep colour + opacity:** `rgba(200,165,92,0.6)` — does it read as a seam or as a blur? Tweak opacity if it flattens.
5. **Scrub speed:** `scrub: 0.6` — feels right? Too laggy? Too snappy?
6. **Stagger (mobile):** 200ms feels like a beat — check against the hero's timing for coherence.
7. **Hover tilt amplitude:** ±3° — subtle enough to avoid gimmick? Try ±2° if it feels toy-like.
8. **Post-reveal arc float:** 4s loop, ±1px — barely there is the goal. Check.
9. **Border weight:** 1px vs 1.5px? Does the gold-on-hover transition feel like a lift or a state change?

Fix anything that bugs you. Re-capture screenshots if something substantial changed.

- [ ] **Step 3: Run full verification**

```bash
npm test -- --run && npx tsc --noEmit && npm run lint && npm run build
```

Expected: all green.

- [ ] **Step 4: Take final polished screenshots**

Re-run `node scripts/verify-services.mjs`. Copy any changed screenshots over the originals in `docs/verification/2026-04-18-services/`. Update NOTES.md with "Polished: YES" + final observations.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "polish(services): audit + polish pass — [brief list of changes]"
git push origin main
```

- [ ] **Step 6: Update Project Log.md**

Open `/Users/dangeorge/The Vault/Dans Website/Project Log.md`. Under the "Task progress — Services Section" section (add if not present), check off all tasks 0–9 with their commit SHAs. Update the `status:` frontmatter to `services-complete`. Update the "Current status" callout. Commit:

```bash
git add "Project Log.md"
git commit -m "docs: mark services section complete + phase transition"
git push origin main
```

---

## Self-Review

After writing the plan, checked against spec:

**Spec coverage:**
- §1 Purpose — delivered by section composition (Task 3) + per-card reveal (Task 5) ✅
- §2 Composition — Task 3 (section shell + grid breakpoints) ✅
- §3 Header — Task 3 (markup) + Task 5 (reveal motion) ✅
- §4 Cards — Task 2 (structure) + Task 7 (tilt) ✅
- §4.6 Final copy — Task 1 (services.data.ts) ✅
- §5 Flourish — Task 2 (static SVG) + Task 5 desktop / Task 6 mobile (draw-in) ✅
- §6 Desktop motion — Task 5 ✅
- §7 Mobile motion — Task 6 ✅
- §8 Reduced motion — handled by `:root` default `--sweep-x: 1` (Task 0) + media-query guard (Task 0) + early return in ServicesClient (Tasks 5 + 6) ✅
- §9 Accessibility — Tasks 2, 3 (markup), 9 (verification) ✅
- §10 File structure — matches File Map ✅
- §11 Tech notes — IO hoisted outside ctx (Task 6), `CSSVarTweenVars` helper (Task 5), SSR-flash protection via default-lit tokens (Task 4) ✅
- §12 Tokens — all referenced tokens added in Task 0 or existing in globals.css ✅
- §14 Success criteria — verified by Task 8 + 9 ✅

**Placeholder scan:** No TBDs, all code blocks complete, all commands exact.

**Type consistency:** `ServiceEntry`, `SERVICES`, `CSSVarTweenVars` consistent throughout. `ARC_LENGTH` constant = `75.4` used in both CSS and JS.

Plan ready.
