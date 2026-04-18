# Philosophy Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `<Philosophy />` homepage section: three first-person beliefs, asymmetric typographic composition, per-block gold-rule draw-in. A quiet counter-punch after the Case Study's pinned cinematic storytelling.

**Architecture:** One Server Component (`Philosophy.tsx`) owns the section shell, eyebrow, bookend rules, and three `<BeliefBlock />` children. Content is sourced from a typed `beliefs.data.ts` exported `as const satisfies readonly Belief[]`. Motion is isolated to a single `'use client'` sibling (`PhilosophyClient.tsx`) that creates one `ScrollTrigger` per block (three total) plus one for the eyebrow, all inside a `gsap.context(() => {...}, section)` teardown. Reduced-motion short-circuits before any GSAP instance is created.

**Tech Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript · GSAP 3.15 + ScrollTrigger · Vitest + RTL · playwright-cli for verification.

**Spec:** [docs/superpowers/specs/2026-04-18-philosophy-design.md](../specs/2026-04-18-philosophy-design.md)

**Skills active during build:** `taste-skill` · `impeccable` · `typeset` · `layout` · `stitch-skill` · `TDD` · `verification-before-completion` · `audit` + `polish`.

**Site-wide copy rule (enforced by tests):** No em dashes (—), en dashes (–), or hyphens (-) in any user-facing string. `beliefs.data.test.ts` fails on any violation via `/[—–-]/` regex.

---

## File Map

**Create (components):**
- `src/components/sections/Philosophy/Philosophy.tsx` — Server Component. Section shell + eyebrow + bookend rules + three `<BeliefBlock />` + `<PhilosophyClient />` mount.
- `src/components/sections/Philosophy/PhilosophyClient.tsx` — `'use client'`. Per-block entrance triggers. Returns `null`.
- `src/components/sections/Philosophy/BeliefBlock.tsx` — Server Component. One belief's layout (headline + gold rule + body, `data-scale` hook).
- `src/components/sections/Philosophy/beliefs.data.ts` — typed beliefs array.
- `src/components/sections/Philosophy/index.ts` — re-exports `Philosophy`.
- `src/components/sections/Philosophy/beliefs.data.test.ts`
- `src/components/sections/Philosophy/BeliefBlock.test.tsx`
- `src/components/sections/Philosophy/Philosophy.test.tsx`
- `src/components/sections/Philosophy/PhilosophyClient.test.tsx`

**Create (scripts):**
- `scripts/verify-philosophy.mjs` — browser verification screenshots.

**Create (verification output):**
- `docs/verification/2026-04-18-philosophy/` — PNGs + `NOTES.md`.

**Modify:**
- `src/app/globals.css` — append Philosophy token block + reduced-motion guard.
- `src/app/page.tsx` — mount `<Philosophy />` after `<SelectedWorks />`.
- `Project Log.md` — phase transition + task progress table.

---

## Task 0: Philosophy folder scaffolding

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Philosophy/index.ts`

**Context:** Create the folder and a barrel file now so subsequent tasks have a stable import path (`@/components/sections/Philosophy`). The named export points at a file that doesn't exist yet — that's fine; no task imports from `index.ts` until Task 6.

- [ ] **Step 1: Create the folder**

Run: `mkdir -p "/Users/dangeorge/The Vault/Dans Website/src/components/sections/Philosophy"`

- [ ] **Step 2: Create `index.ts`**

File: `src/components/sections/Philosophy/index.ts`

```ts
export { Philosophy } from "./Philosophy";
```

- [ ] **Step 3: Commit + push**

```bash
git add src/components/sections/Philosophy/index.ts
git commit -m "chore(philosophy): scaffold section folder + barrel"
git push origin main
```

Note: `tsc --noEmit` will complain that `./Philosophy` has no exports — expected until Task 3. Do not run `tsc` yet.

---

## Task 1: Build `beliefs.data.ts` with no-dashes regex test

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Philosophy/beliefs.data.ts`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Philosophy/beliefs.data.test.ts`

**Context:** Single source of truth for belief copy. The `as const satisfies readonly Belief[]` pattern matches `projects.data.ts` — gives literal-narrowed types and catches shape drift at compile time. The test file includes a regex guard that bakes the site-wide no-dashes rule into CI.

- [ ] **Step 1: Write the failing test**

File: `src/components/sections/Philosophy/beliefs.data.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { beliefs } from "./beliefs.data";

describe("beliefs.data", () => {
  it("exports exactly three entries", () => {
    expect(beliefs).toHaveLength(3);
  });

  it("has unique ids", () => {
    const ids = beliefs.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every entry has non-empty id, headline, body", () => {
    for (const b of beliefs) {
      expect(b.id.length).toBeGreaterThan(0);
      expect(b.headline.length).toBeGreaterThan(0);
      expect(b.body.length).toBeGreaterThan(0);
    }
  });

  it("scale is undefined, 'lg', or 'xl'", () => {
    for (const b of beliefs) {
      expect(["lg", "xl", undefined]).toContain(b.scale);
    }
  });

  it("contains no em dashes, en dashes, or hyphens in headline or body (site-wide copy rule)", () => {
    const DASH_RE = /[\u2014\u2013\u002D]/;
    for (const b of beliefs) {
      expect(DASH_RE.test(b.headline)).toBe(false);
      expect(DASH_RE.test(b.body)).toBe(false);
    }
  });

  it("marks first belief as scale 'xl'", () => {
    expect(beliefs[0].scale).toBe("xl");
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test -- beliefs.data`

Expected: FAIL — module `./beliefs.data` not found.

- [ ] **Step 3: Implement `beliefs.data.ts`**

File: `src/components/sections/Philosophy/beliefs.data.ts`

```ts
export type Belief = {
  readonly id: string;
  readonly headline: string;
  readonly body: string;
  readonly scale?: "lg" | "xl";
};

export const beliefs = [
  {
    id: "proof-not-ceiling",
    headline: "If I can do this for myself, imagine what I'd do for you.",
    body: "NextUp, the case study above, is my own company. I built the site, the brand, the product. It's proof of capability, not the ceiling of it.",
    scale: "xl",
  },
  {
    id: "one-person-every-decision",
    headline: "One person. Every decision.",
    body: "I don't outsource the taste. Typography, motion, copy, the 200ms on a button press. Those are mine. The standard is \"would I ship this on my own site?\" That standard doesn't loosen when the logo on the brief changes.",
    scale: "lg",
  },
  {
    id: "fast-enough",
    headline: "Fast enough that you don't notice.",
    body: "Most sites feel slow the second you scroll. Mine don't. Speed isn't a perk. It's the line between \"premium\" and \"pretending.\"",
    scale: "lg",
  },
] as const satisfies readonly Belief[];
```

Note on the dash-test regex: `\u2014` is em dash (—), `\u2013` is en dash (–), `\u002D` is the ASCII hyphen-minus (-). Using unicode escapes avoids the linter/formatter ever "auto-correcting" a literal hyphen inside the regex character class.

Note on ids: the regex only inspects `headline` and `body`, NOT `id`. The belief ids use hyphens (`proof-not-ceiling`) as programmatic keys and are intentionally excluded from the copy rule — they are never rendered as user-facing text.

- [ ] **Step 4: Run to confirm pass**

Run: `npm test -- beliefs.data`

Expected: PASS — all six tests green.

- [ ] **Step 5: Verify tsc clean for this file**

Run: `npx tsc --noEmit`

Expected: no errors against `beliefs.data.ts`. (There may still be errors against `index.ts` — that's expected until Task 3.)

- [ ] **Step 6: Commit + push**

```bash
git add src/components/sections/Philosophy/beliefs.data.ts src/components/sections/Philosophy/beliefs.data.test.ts
git commit -m "feat(philosophy): add typed beliefs.data + no-dashes regex test"
git push origin main
```

---

## Task 2: Build `BeliefBlock` (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Philosophy/BeliefBlock.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Philosophy/BeliefBlock.test.tsx`

**Purpose:** One belief's layout. Renders an `<article>` with `<h3>` headline, a `<span>` gold rule, and a `<p>` body. Receives a `Belief` prop. Server Component — no state, no hooks. `data-philosophy-block` is the ScrollTrigger selector; `data-scale` is a test + styling hook.

- [ ] **Step 1: Write the failing test**

File: `src/components/sections/Philosophy/BeliefBlock.test.tsx`

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BeliefBlock } from "./BeliefBlock";

const entry = {
  id: "sample",
  headline: "Headline text.",
  body: "Body text.",
  scale: "lg" as const,
};

describe("<BeliefBlock />", () => {
  it("tags the root as article with data-philosophy-block", () => {
    const { container } = render(<BeliefBlock belief={entry} />);
    const root = container.querySelector("article") as HTMLElement;
    expect(root).not.toBeNull();
    expect(root.getAttribute("data-philosophy-block")).toBe("");
  });

  it("renders the headline as h3", () => {
    const { container } = render(<BeliefBlock belief={entry} />);
    const h3 = container.querySelector("h3");
    expect(h3?.textContent).toBe("Headline text.");
  });

  it("renders the body as p", () => {
    const { getByText } = render(<BeliefBlock belief={entry} />);
    expect(getByText("Body text.").tagName).toBe("P");
  });

  it("renders a gold-rule span with data-philosophy-rule and aria-hidden", () => {
    const { container } = render(<BeliefBlock belief={entry} />);
    const rule = container.querySelector("[data-philosophy-rule]") as HTMLElement;
    expect(rule).not.toBeNull();
    expect(rule.getAttribute("aria-hidden")).toBe("true");
    expect(rule.tagName).toBe("SPAN");
  });

  it("applies data-scale='lg' when scale is 'lg'", () => {
    const { container } = render(<BeliefBlock belief={entry} />);
    const root = container.querySelector("article") as HTMLElement;
    expect(root.getAttribute("data-scale")).toBe("lg");
  });

  it("applies data-scale='xl' when scale is 'xl'", () => {
    const xlEntry = { ...entry, scale: "xl" as const };
    const { container } = render(<BeliefBlock belief={xlEntry} />);
    const root = container.querySelector("article") as HTMLElement;
    expect(root.getAttribute("data-scale")).toBe("xl");
  });

  it("defaults data-scale to 'lg' when scale is undefined", () => {
    const bare = { id: "bare", headline: "h", body: "b" };
    const { container } = render(<BeliefBlock belief={bare} />);
    const root = container.querySelector("article") as HTMLElement;
    expect(root.getAttribute("data-scale")).toBe("lg");
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test -- BeliefBlock`

Expected: FAIL — module `./BeliefBlock` not found.

- [ ] **Step 3: Implement `BeliefBlock.tsx`**

File: `src/components/sections/Philosophy/BeliefBlock.tsx`

```tsx
import type { Belief } from "./beliefs.data";

type Props = {
  belief: Belief;
};

export function BeliefBlock({ belief }: Props) {
  const scale = belief.scale ?? "lg";

  const headlineSizeClass =
    scale === "xl"
      ? "text-[48px] md:text-[80px] lg:text-[120px]"
      : "text-[40px] md:text-[64px] lg:text-[96px]";

  // Rule width is the same at every scale — only the headline scales.
  const ruleWidthClass = "w-[96px] md:w-[120px] lg:w-[160px]";

  return (
    <article
      data-philosophy-block=""
      data-scale={scale}
      className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[1fr_minmax(0,480px)] lg:gap-16"
    >
      <div className="flex flex-col">
        <h3
          className={`${headlineSizeClass} leading-[1.05] tracking-[-0.01em]`}
          style={{
            fontFamily: "var(--font-comico)",
            color: "var(--text-primary)",
          }}
        >
          {belief.headline}
        </h3>
        <span
          aria-hidden="true"
          data-philosophy-rule=""
          className={`mt-3 block h-[2px] ${ruleWidthClass} mb-10 lg:mb-0`}
          style={{ backgroundColor: "var(--gold-accent)" }}
        />
      </div>
      <p
        className="text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] tracking-[0.01em]"
        style={{
          fontFamily: "var(--font-marker)",
          color: "var(--text-primary)",
        }}
      >
        {belief.body}
      </p>
    </article>
  );
}
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm test -- BeliefBlock`

Expected: PASS — all seven tests green.

- [ ] **Step 5: Commit + push**

```bash
git add src/components/sections/Philosophy/BeliefBlock.tsx src/components/sections/Philosophy/BeliefBlock.test.tsx
git commit -m "feat(philosophy): add BeliefBlock with gold rule + data-scale hook"
git push origin main
```

---

## Task 3: Build `Philosophy` Server Component (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Philosophy/Philosophy.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Philosophy/Philosophy.test.tsx`

**Purpose:** Section shell. Owns the eyebrow (semantic `<h2>`), the two decorative bookend rules, the three-belief stack, and the `<PhilosophyClient />` mount point. Reads beliefs from the typed data file — never hard-codes copy here.

Note: At this point `PhilosophyClient` does not exist yet. The test can import `Philosophy` without invoking `PhilosophyClient` behaviour because `PhilosophyClient` will return `null` in Task 4 and does no work during server render (React calls the function but the useEffect body never fires under Vitest's happy-dom). To avoid a "module not found" error before Task 4, we create a minimal placeholder `PhilosophyClient.tsx` inside this task.

- [ ] **Step 1: Create placeholder `PhilosophyClient.tsx`**

File: `src/components/sections/Philosophy/PhilosophyClient.tsx`

```tsx
"use client";

export function PhilosophyClient() {
  return null;
}
```

(Task 4 replaces the body of this file. Creating the placeholder now lets Task 3's tests import `Philosophy` without a module-resolution failure.)

- [ ] **Step 2: Write the failing test**

File: `src/components/sections/Philosophy/Philosophy.test.tsx`

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Philosophy } from "./Philosophy";

describe("<Philosophy />", () => {
  it("renders a section with id='philosophy' and aria-labelledby='philosophy-heading'", () => {
    const { container } = render(<Philosophy />);
    const section = container.querySelector("section#philosophy") as HTMLElement;
    expect(section).not.toBeNull();
    expect(section.getAttribute("aria-labelledby")).toBe("philosophy-heading");
  });

  it("renders an h2 with id='philosophy-heading' and text 'OUR PHILOSOPHY'", () => {
    const { container } = render(<Philosophy />);
    const h2 = container.querySelector("h2#philosophy-heading") as HTMLElement;
    expect(h2).not.toBeNull();
    expect(h2.textContent).toBe("OUR PHILOSOPHY");
  });

  it("marks the eyebrow with data-philosophy-eyebrow (JS hook for entrance motion)", () => {
    const { container } = render(<Philosophy />);
    const eyebrow = container.querySelector("[data-philosophy-eyebrow]");
    expect(eyebrow).not.toBeNull();
    expect(eyebrow?.tagName).toBe("H2");
  });

  it("renders exactly three BeliefBlock articles", () => {
    const { container } = render(<Philosophy />);
    const blocks = container.querySelectorAll("[data-philosophy-block]");
    expect(blocks.length).toBe(3);
  });

  it("renders the first belief at scale 'xl' and the other two at scale 'lg'", () => {
    const { container } = render(<Philosophy />);
    const blocks = Array.from(
      container.querySelectorAll<HTMLElement>("[data-philosophy-block]"),
    );
    expect(blocks[0].getAttribute("data-scale")).toBe("xl");
    expect(blocks[1].getAttribute("data-scale")).toBe("lg");
    expect(blocks[2].getAttribute("data-scale")).toBe("lg");
  });

  it("renders exactly two static bookend rules marked with data-philosophy-bookend", () => {
    const { container } = render(<Philosophy />);
    const bookends = container.querySelectorAll("[data-philosophy-bookend]");
    expect(bookends.length).toBe(2);
    bookends.forEach((el) => {
      expect(el.getAttribute("aria-hidden")).toBe("true");
      expect(el.tagName).toBe("SPAN");
    });
  });
});
```

- [ ] **Step 3: Run to confirm failure**

Run: `npm test -- Philosophy.test`

Expected: FAIL — module `./Philosophy` not found.

- [ ] **Step 4: Implement `Philosophy.tsx`**

File: `src/components/sections/Philosophy/Philosophy.tsx`

```tsx
import { BeliefBlock } from "./BeliefBlock";
import { beliefs } from "./beliefs.data";
import { PhilosophyClient } from "./PhilosophyClient";

export function Philosophy() {
  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-heading"
      className="relative w-full py-32 md:py-40"
      style={{ backgroundColor: "var(--bg-darker)" }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <h2
            id="philosophy-heading"
            data-philosophy-eyebrow=""
            className="text-[13px] md:text-[14px] uppercase tracking-[0.12em]"
            style={{
              fontFamily: "var(--font-marker)",
              color: "var(--gold-accent)",
            }}
          >
            OUR PHILOSOPHY
          </h2>

          <span
            aria-hidden="true"
            data-philosophy-bookend=""
            className="mt-6 block h-px w-full"
            style={{
              backgroundColor: "var(--gold-accent)",
              opacity: 0.35,
            }}
          />

          <div className="mt-16 md:mt-24 space-y-20 md:space-y-24 lg:space-y-32">
            {beliefs.map((belief) => (
              <BeliefBlock key={belief.id} belief={belief} />
            ))}
          </div>

          <span
            aria-hidden="true"
            data-philosophy-bookend=""
            className="mt-16 md:mt-24 block h-px w-full"
            style={{
              backgroundColor: "var(--gold-accent)",
              opacity: 0.35,
            }}
          />
        </div>
      </div>

      <PhilosophyClient />
    </section>
  );
}
```

- [ ] **Step 5: Run to confirm pass**

Run: `npm test -- Philosophy.test`

Expected: PASS — all six tests green.

- [ ] **Step 6: Run full Philosophy test suite**

Run: `npm test -- Philosophy`

Expected: PASS — all Philosophy tests green (beliefs.data + BeliefBlock + Philosophy).

- [ ] **Step 7: Verify tsc clean**

Run: `npx tsc --noEmit`

Expected: no errors.

- [ ] **Step 8: Commit + push**

```bash
git add src/components/sections/Philosophy/Philosophy.tsx src/components/sections/Philosophy/Philosophy.test.tsx src/components/sections/Philosophy/PhilosophyClient.tsx
git commit -m "feat(philosophy): add Philosophy server component shell + placeholder client"
git push origin main
```

---

## Task 4: Implement `PhilosophyClient` (TDD)

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Philosophy/PhilosophyClient.tsx` (replace placeholder body)
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/Philosophy/PhilosophyClient.test.tsx`

**Purpose:** `'use client'` sibling that runs the entrance motion. One ScrollTrigger per `[data-philosophy-block]` + one for the eyebrow. Reduced-motion early-returns before any GSAP instance is created. All triggers tear down via `ctx.revert()`.

**Context:** Follows the Services pattern (`gsap.context` scoped to the section, cleanup in `useEffect` return). The test mocks `gsap` and `ScrollTrigger` because vitest + happy-dom can't run real scroll observers — we verify behavioural contracts: reduced-motion short-circuits the module; in motion-enabled environments we call `gsap.context` and create the expected number of triggers.

- [ ] **Step 1: Write the failing test**

File: `src/components/sections/Philosophy/PhilosophyClient.test.tsx`

```tsx
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const createMock = vi.fn();
const contextMock = vi.fn();
const setMock = vi.fn();
const toMock = vi.fn();
const registerPluginMock = vi.fn();
const revertMock = vi.fn();

vi.mock("gsap", () => ({
  default: {
    registerPlugin: registerPluginMock,
    context: (fn: () => void) => {
      contextMock(fn);
      fn();
      return { revert: revertMock };
    },
    set: setMock,
    to: toMock,
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: createMock,
  },
}));

import { PhilosophyClient } from "./PhilosophyClient";

function mountWithBlocks() {
  document.body.innerHTML = `
    <section id="philosophy">
      <h2 data-philosophy-eyebrow>OUR PHILOSOPHY</h2>
      <article data-philosophy-block data-scale="xl">
        <h3>One</h3>
        <span data-philosophy-rule></span>
        <p>body one</p>
      </article>
      <article data-philosophy-block data-scale="lg">
        <h3>Two</h3>
        <span data-philosophy-rule></span>
        <p>body two</p>
      </article>
      <article data-philosophy-block data-scale="lg">
        <h3>Three</h3>
        <span data-philosophy-rule></span>
        <p>body three</p>
      </article>
    </section>
  `;
}

describe("<PhilosophyClient />", () => {
  beforeEach(() => {
    createMock.mockClear();
    contextMock.mockClear();
    setMock.mockClear();
    toMock.mockClear();
    registerPluginMock.mockClear();
    revertMock.mockClear();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    cleanup();
  });

  it("returns null (renders no DOM)", () => {
    mountWithBlocks();
    const { container } = render(<PhilosophyClient />);
    expect(container.innerHTML).toBe("");
  });

  it("does nothing when prefers-reduced-motion matches", () => {
    mountWithBlocks();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(<PhilosophyClient />);

    expect(contextMock).not.toHaveBeenCalled();
    expect(createMock).not.toHaveBeenCalled();

    window.matchMedia = originalMatchMedia;
  });

  it("creates four ScrollTriggers (one per block + one for eyebrow) when motion is allowed", () => {
    mountWithBlocks();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(<PhilosophyClient />);

    expect(contextMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledTimes(4);

    window.matchMedia = originalMatchMedia;
  });

  it("calls ctx.revert on unmount when motion ran", () => {
    mountWithBlocks();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    const { unmount } = render(<PhilosophyClient />);
    unmount();
    expect(revertMock).toHaveBeenCalledTimes(1);

    window.matchMedia = originalMatchMedia;
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test -- PhilosophyClient`

Expected: FAIL — the placeholder from Task 3 is a no-op, so the motion-allowed test fails (`createMock` called 0 times, expected 4).

- [ ] **Step 3: Replace `PhilosophyClient.tsx` body**

File: `src/components/sections/Philosophy/PhilosophyClient.tsx` (replace entirely)

```tsx
"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function PhilosophyClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = document.getElementById("philosophy");
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const eyebrow = section.querySelector<HTMLElement>(
      "[data-philosophy-eyebrow]",
    );
    const blocks = Array.from(
      section.querySelectorAll<HTMLElement>("[data-philosophy-block]"),
    );

    const ctx = gsap.context(() => {
      // Eyebrow entrance
      if (eyebrow) {
        gsap.set(eyebrow, { opacity: 0, y: 8 });
        ScrollTrigger.create({
          trigger: eyebrow,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(eyebrow, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            });
          },
        });
      }

      // Per-block entrance
      blocks.forEach((block) => {
        const headline = block.querySelector<HTMLElement>("h3");
        const rule = block.querySelector<HTMLElement>(
          "[data-philosophy-rule]",
        );
        const body = block.querySelector<HTMLElement>("p");

        // Capture the rule's final width from the computed style so we can
        // animate from 0 → final without hard-coding breakpoint values.
        const finalRuleWidth = rule
          ? window.getComputedStyle(rule).width
          : "0px";

        if (headline) gsap.set(headline, { opacity: 0, y: 24 });
        if (body) gsap.set(body, { opacity: 0, y: 24 });
        if (rule) gsap.set(rule, { width: 0 });

        ScrollTrigger.create({
          trigger: block,
          start: "top 80%",
          once: true,
          onEnter: () => {
            if (headline) {
              gsap.to(headline, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
              });
            }
            if (body) {
              gsap.to(body, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: 0.08,
                ease: "power2.out",
              });
            }
            if (rule) {
              gsap.to(rule, {
                width: finalRuleWidth,
                duration: 0.6,
                delay: 0.15,
                ease: "power2.out",
              });
            }
          },
        });
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm test -- PhilosophyClient`

Expected: PASS — all four tests green.

- [ ] **Step 5: Run full Philosophy test suite**

Run: `npm test -- Philosophy`

Expected: PASS — all Philosophy tests green.

- [ ] **Step 6: Verify tsc clean**

Run: `npx tsc --noEmit`

Expected: no errors.

- [ ] **Step 7: Commit + push**

```bash
git add src/components/sections/Philosophy/PhilosophyClient.tsx src/components/sections/Philosophy/PhilosophyClient.test.tsx
git commit -m "feat(philosophy): add PhilosophyClient motion with reduced-motion guard"
git push origin main
```

---

## Task 5: Philosophy tokens + reduced-motion guard in `globals.css`

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/app/globals.css`

**Context:** Philosophy reuses existing tokens (`--bg-darker`, `--text-primary`, `--gold-accent`, `--font-comico`, `--font-marker`) — no new colour or family tokens needed. We still append a small block documenting the section's reduced-motion behaviour in CSS: if JS fails or hasn't booted yet, the reduced-motion media query forces headlines/body visible and the gold rule to its final width, so the section is never left in a permanent 0-opacity state. This is the CSS-layer safety net that complements the JS-layer early return in `PhilosophyClient`.

Note: The "final width" for the gold rule in the reduced-motion fallback matches Tailwind breakpoints (96px / 120px / 160px). Because `BeliefBlock` already sets the width via Tailwind utilities (`w-[96px] md:w-[120px] lg:w-[160px]`), the reduced-motion reset just needs to ensure no inline `width: 0` from GSAP persists. In practice GSAP only writes inline styles when JS runs, so the reset is a belt-and-braces guard for future-proofing.

- [ ] **Step 1: Append Philosophy block to `globals.css`**

Append this block to the end of the file:

```css
/* ---------- PHILOSOPHY (Phase 5) ---------- */
/* No new design tokens — reuses --bg-darker / --text-primary / --gold-accent /
   --font-comico / --font-marker. Block below is motion-fallback only. */

@media (prefers-reduced-motion: reduce) {
  [data-philosophy-eyebrow],
  [data-philosophy-block] h3,
  [data-philosophy-block] p {
    opacity: 1 !important;
    transform: none !important;
  }
  [data-philosophy-rule] {
    /* Tailwind utility classes on the span set the correct final width per
       breakpoint; this reset wipes any lingering inline width:0 that GSAP may
       have set before reduced-motion kicked in at run time. */
    width: revert !important;
  }
}
```

- [ ] **Step 2: Verify dev server still renders without errors**

Run (non-blocking): `npm run dev`

Open `http://localhost:3000`. Expected: Hero + Services + Case Study render exactly as before — Philosophy still unmounted (wired in Task 6).

- [ ] **Step 3: Commit + push**

```bash
git add src/app/globals.css
git commit -m "feat(style): add philosophy reduced-motion fallback guard"
git push origin main
```

---

## Task 6: Wire `Philosophy` into `page.tsx`

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/app/page.tsx`

**Context:** Philosophy mounts between `<SelectedWorks />` (the Case Study ledger) and the future Process section. Page order matches the design.md §2 flow: Hero → Services → FeaturedCase → SelectedWorks → Philosophy.

- [ ] **Step 1: Replace `page.tsx`**

File: `src/app/page.tsx`

```tsx
import { FeaturedCase } from "@/components/sections/FeaturedCase";
import { Hero } from "@/components/sections/Hero/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { Services } from "@/components/sections/Services/Services";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedCase />
      <SelectedWorks />
      <Philosophy />
    </>
  );
}
```

- [ ] **Step 2: Run dev server + smoke test**

Run (non-blocking): `npm run dev`

Open `http://localhost:3000`. Scroll past Hero → Services → Case Study → SelectedWorks. Expected:
- Philosophy section appears on `#0B2422` deeper teal background.
- "OUR PHILOSOPHY" eyebrow in gold, followed by a hairline.
- Three stacked beliefs; the first (xl) is noticeably larger than the other two (lg).
- As each block scrolls into view: headline fades + translates up, gold rule draws left-to-right, body fades in shortly after.
- Closing hairline beneath the third belief.

- [ ] **Step 3: Verify tsc + lint clean**

Run: `npx tsc --noEmit && npm run lint`

Expected: no errors.

- [ ] **Step 4: Run full test suite**

Run: `npm test -- --run`

Expected: all Philosophy + Case Study + Services + Hero + Layout tests green.

- [ ] **Step 5: Commit + push**

```bash
git add src/app/page.tsx
git commit -m "feat(page): mount philosophy after selected works"
git push origin main
```

---

## Task 7: Browser verification via `playwright-cli`

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/scripts/verify-philosophy.mjs`
- Create: `/Users/dangeorge/The Vault/Dans Website/docs/verification/2026-04-18-philosophy/NOTES.md` (after run)

**Context:** Same Playwright + autoplay-policy config as `verify-case-study.mjs`. Captures desktop/tablet/mobile × 3 scroll positions + one reduced-motion frame. Commits screenshots + NOTES to the verification folder.

- [ ] **Step 1: Ensure dev server is running on port 3000**

If not already running:

```bash
npm run dev
```

(Leave running in another terminal; the verify script connects to `http://localhost:3000`.)

- [ ] **Step 2: Create `scripts/verify-philosophy.mjs`**

File: `scripts/verify-philosophy.mjs`

```js
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "docs/verification/2026-04-18-philosophy";
mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", width: 1920, height: 1080, dpr: 2 },
  { name: "tablet", width: 768, height: 1024, dpr: 2 },
  { name: "mobile", width: 375, height: 812, dpr: 2 },
];

async function captureScrollPositions(page, viewport) {
  // Find the Philosophy section's top offset.
  const philosophyTop = await page.evaluate(() => {
    const el = document.getElementById("philosophy");
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });

  const positions = [
    { label: "01-pre-reveal", scrollY: philosophyTop - viewport.height * 0.5 },
    { label: "02-mid-reveal", scrollY: philosophyTop + viewport.height * 0.5 },
    { label: "03-post-reveal", scrollY: philosophyTop + viewport.height * 1.4 },
  ];

  for (const pos of positions) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, pos.scrollY));
    await page.waitForTimeout(900); // let ScrollTriggers fire + tweens settle
    const filename = `${viewport.name}-${pos.label}.png`;
    await page.screenshot({ path: join(OUT_DIR, filename), fullPage: false });
    console.log(`captured ${filename}`);
  }
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ["--autoplay-policy=no-user-gesture-required"],
  });

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.dpr,
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000", { waitUntil: "load" });
    await page.waitForTimeout(1500); // initial settle

    await captureScrollPositions(page, viewport);

    await context.close();
  }

  // Reduced-motion capture on desktop only.
  const rmContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const rmPage = await rmContext.newPage();
  await rmPage.goto("http://localhost:3000", { waitUntil: "load" });
  await rmPage.waitForTimeout(1500);
  const philosophyTop = await rmPage.evaluate(() => {
    const el = document.getElementById("philosophy");
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });
  await rmPage.evaluate(
    (y) => window.scrollTo(0, y),
    Math.max(0, philosophyTop),
  );
  await rmPage.waitForTimeout(900);
  await rmPage.screenshot({
    path: join(OUT_DIR, "desktop-reduced-motion.png"),
    fullPage: false,
  });
  console.log("captured desktop-reduced-motion.png");

  await browser.close();
  console.log(`\nAll captures written to ${OUT_DIR}/`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 3: Run the verify script**

Run: `node scripts/verify-philosophy.mjs`

Expected output: 10 PNGs written to `docs/verification/2026-04-18-philosophy/`:
- `desktop-01-pre-reveal.png` · `desktop-02-mid-reveal.png` · `desktop-03-post-reveal.png`
- `tablet-01-pre-reveal.png` · `tablet-02-mid-reveal.png` · `tablet-03-post-reveal.png`
- `mobile-01-pre-reveal.png` · `mobile-02-mid-reveal.png` · `mobile-03-post-reveal.png`
- `desktop-reduced-motion.png`

- [ ] **Step 4: Open each PNG and confirm**

For each viewport set, confirm:
- `01-pre-reveal`: section entering viewport, blocks not yet revealed (some may already be triggered — the start threshold is `top 80%`, so any block whose top is above 80% of the viewport will have fired; that's expected).
- `02-mid-reveal`: middle belief centered, at least one block fully revealed with its gold rule drawn.
- `03-post-reveal`: all three revealed, both bookend rules visible.
- Reduced-motion: all three beliefs visible in their final state, no partial-motion artifacts.

If a frame looks wrong, investigate before writing NOTES.md.

- [ ] **Step 5: Write `NOTES.md`**

File: `docs/verification/2026-04-18-philosophy/NOTES.md`

```markdown
# Philosophy — Browser Verification (2026-04-18)

Captured via `scripts/verify-philosophy.mjs` against the live dev server
(`npm run dev`, Turbopack). Script uses `waitUntil: "load"` + 1500ms
initial settle, then 900ms settle per scroll position to let
ScrollTriggers fire and tweens land.

## Environment
- Next.js 16.2.4 (Turbopack)
- Playwright Chromium (headless)
- Autoplay policy override: `no-user-gesture-required` (parity with
  case-study verify script — Philosophy has no video but keeps the flag
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

[Fill in one paragraph per viewport after reviewing the PNGs:
- desktop: confirm two-column grid (headline left, body right) on the xl
  block and lg blocks; confirm gold rule draws left-to-right under each
  headline; confirm scale asymmetry reads as intentional.
- tablet: confirm single-column layout, headline on top, body below at
  ~60ch; confirm gold rule has 40px margin-bottom before body (the
  md:0 → lg:0 fix from the spec).
- mobile: confirm single-column + full-width body; confirm headline
  wraps gracefully and no horizontal overflow at 375px.
]

## Reduced motion

`desktop-reduced-motion.png`: confirms the JS early-return in
`PhilosophyClient.tsx` skips ScrollTrigger setup. All three beliefs are
visible in their final state — headlines fully opaque, body fully
opaque, gold rules at their final widths (96/120/160px per breakpoint).
No partial-motion artifacts.

## Follow-ups for Task 8 audit

- [ ] Confirm tsc, lint, prod build are all green.
- [ ] Manual a11y check: tab order skips the section cleanly (no
      focusable content); `aria-labelledby` resolves correctly.
- [ ] Manual reflow check at 320px viewport.
- [ ] Confirm no dashes/hyphens in rendered copy (test already enforces
      it at the data layer, but a visual check is cheap).
```

Fill in the per-viewport observations after reviewing the PNGs.

- [ ] **Step 6: Commit + push**

```bash
git add scripts/verify-philosophy.mjs docs/verification/2026-04-18-philosophy/
git commit -m "verify(philosophy): playwright-cli captures + notes"
git push origin main
```

---

## Task 8: Audit + polish + Project Log transition

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/Project Log.md`
- Modify: `/Users/dangeorge/The Vault/Dans Website/docs/superpowers/plans/2026-04-18-philosophy.md` (mark tasks complete)
- Any Philosophy component files where the audit surfaces issues.

**Context:** Final gate before declaring the phase complete. Full test suite, strict typecheck, lint, prod build, and a quick manual pass for a11y + reflow + rendered-copy no-dashes check.

- [ ] **Step 1: Run the full test suite**

Run: `npm test -- --run`

Expected: all tests green across the repo (Hero, Services, Case Study, Philosophy, Layout).

- [ ] **Step 2: Run strict typecheck**

Run: `npx tsc --noEmit`

Expected: no errors.

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: no warnings or errors.

- [ ] **Step 4: Run production build**

Run: `npm run build`

Expected: successful build. Scan output for any Philosophy-related warnings (hydration, missing keys, etc.). Fix inline if found.

- [ ] **Step 5: Manual a11y + reflow pass**

Start dev server (`npm run dev`) if not already running. In the browser:

1. Scroll to Philosophy. Press Tab repeatedly: the focus order should skip the Philosophy section entirely (no focusable elements), moving from SelectedWorks ledger cards straight to whatever follows (currently footer / nothing).
2. Open DevTools → Elements → click the `<section id="philosophy">` and confirm `aria-labelledby="philosophy-heading"` resolves to the `<h2>` with text "OUR PHILOSOPHY".
3. DevTools → Rendering → emulate `prefers-reduced-motion: reduce`. Reload. Scroll to Philosophy: all three blocks should render in their final state immediately, no partial motion.
4. DevTools → Rendering → disable emulation. Resize the viewport to 320px wide. Scroll through Philosophy: no horizontal overflow, headlines wrap but remain readable, gold rules and body copy stay inside the viewport.
5. Visual scan of the rendered copy: no visible em/en dashes or hyphens anywhere. (The data test enforces this but a 10-second eyeball pass is cheap insurance.)

If any check fails, fix and commit the fix before proceeding.

- [ ] **Step 6: Update `Project Log.md`**

Three concrete edits:

**6.1 Frontmatter** — change the `status:` line:

```diff
- status: case-study-complete
+ status: philosophy-complete
```

**6.2 Insert a new `> [!success]` callout** directly under the `## Current status` heading and above the existing "Case Study complete" callout, so the most recent phase is listed first. Template:

```markdown
> [!success] Philosophy complete — 2026-04-18
> All 9 tasks (0–8) shipped. `<Philosophy />` — three first-person beliefs, asymmetric two-column grid (headline left, body right) at ≥1024px, scale asymmetry (first belief xl=120px, others lg=96px on desktop), per-block gold-rule draw-in on scroll-into-view. Single `'use client'` sibling (`PhilosophyClient`) creates one ScrollTrigger per block + one for the eyebrow, all inside a `gsap.context` with `ctx.revert()` teardown. Reduced-motion early-returns before any GSAP instance is created; CSS fallback guards against flash-of-unrevealed. `beliefs.data.test.ts` bakes the site-wide no-dashes rule into CI via `/[—–-]/` regex on headline + body. N/N tests · tsc · lint · prod build all green.
```

(Replace `N/N` with the actual pass-count from Step 1.)

**6.3 Append a new task-progress table** below the existing "Task progress — Case Study" block. Template — one row per task with the commit SHA captured at each push:

```markdown
## Task progress — Philosophy

Mirror of the plan's checkboxes. Source of truth is still [2026-04-18-philosophy](docs/superpowers/plans/2026-04-18-philosophy.md).

- [x] **Task 0** — Philosophy folder scaffolding + barrel (commit `<sha>`)
- [x] **Task 1** — `beliefs.data.ts` with no-dashes regex test (commit `<sha>`)
- [x] **Task 2** — `BeliefBlock` TDD with gold rule + data-scale hook (commit `<sha>`)
- [x] **Task 3** — `Philosophy` server component shell + placeholder client (commit `<sha>`)
- [x] **Task 4** — `PhilosophyClient` motion with reduced-motion guard (commit `<sha>`)
- [x] **Task 5** — Philosophy reduced-motion CSS fallback in `globals.css` (commit `<sha>`)
- [x] **Task 6** — Wire `<Philosophy />` into `page.tsx` (commit `<sha>`)
- [x] **Task 7** — Browser verification via playwright-cli (commit `<sha>`)
- [x] **Task 8** — Audit + polish + Project Log transition (this commit)
```

Fill each `<sha>` with the short SHA from `git log --oneline` for the matching commit.

- [ ] **Step 7: Update plan checkboxes**

Open `docs/superpowers/plans/2026-04-18-philosophy.md`. For each task, mark every `- [ ]` as `- [x]` and append the commit SHA at the end of each task header line, e.g.:

```markdown
## Task 0: Philosophy folder scaffolding (commit: abc1234)
```

- [ ] **Step 8: Commit + push**

```bash
git add "Project Log.md" docs/superpowers/plans/2026-04-18-philosophy.md
git commit -m "docs: mark philosophy complete + phase transition"
git push origin main
```

- [ ] **Step 9: Final confirmation**

Run one more smoke test:

```bash
npm test -- --run
npx tsc --noEmit
npm run build
```

All three green → the Philosophy phase is complete.

---

## Success criteria (recap)

- Three beliefs render in the correct order at the correct scales across desktop, tablet, mobile.
- Entrance motion fires exactly once per block on scroll into view, with the specced timing.
- `prefers-reduced-motion: reduce` disables all motion; section remains fully readable.
- `beliefs.data.test.ts` fails if any dash or hyphen is introduced into copy.
- Full test suite, `tsc`, lint, and prod build all green.
- Browser verification captures committed to `docs/verification/2026-04-18-philosophy/` with NOTES.md.
- `Project Log.md` transitions to `philosophy-complete` with commit SHAs recorded.
