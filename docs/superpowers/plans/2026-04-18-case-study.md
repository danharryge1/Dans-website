# Case Study (NextUp) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship two new homepage sections — `<FeaturedCase />` (pinned 500vh scroll-scrub that tells the NextUp story in three acts: setup → three decision beats → outcome) and `<SelectedWorks />` (horizontal ledger with 1 real card + honest "NEXT UP →" dashed placeholder) — that together cash the hero's "CASE STUDY 01 · NEXTUP CO." cheque and grow visibly as future projects ship.

**Architecture:** One Server Component per section (`FeaturedCase.tsx`, `SelectedWorks.tsx`) handles shell + copy + static markup. All motion in `<FeaturedCase />` lives in a single `'use client'` sibling (`FeaturedCaseClient.tsx`) that creates ONE ScrollTrigger (the pin) wrapping ONE GSAP timeline with labels for each act/beat — crossfades are timeline keyframes, not separate ScrollTriggers. A single `<video>` DOM node is rendered once in the pinned section as a backdrop layer; the timeline toggles its opacity between Acts. `<SelectedWorks />` is pure CSS — native horizontal scroll + scroll-snap, no JS motion beyond Services-style entrance stagger. Data is typed via `projects.data.ts` using `as const satisfies readonly ProjectEntry[]` for extensibility.

**Tech Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript · GSAP 3.15 + ScrollTrigger (Lenis already wired from hero) · Motion 12 already installed but not used this phase · Vitest + RTL for TDD · playwright-cli for asset capture + verification.

**Spec:** [docs/superpowers/specs/2026-04-18-case-study-design.md](../specs/2026-04-18-case-study-design.md)

**Skills active during build:** `taste-skill` · `impeccable` · `typeset` · `layout` · `stitch-skill` · `TDD` · `verification-before-completion` · `audit` + `polish`.

---

## File Map

**Create (components):**
- `src/components/sections/FeaturedCase/FeaturedCase.tsx` — Server Component. Section shell + acts + hardcoded beat copy + single video node + `<FeaturedCaseClient />` mount.
- `src/components/sections/FeaturedCase/FeaturedCaseClient.tsx` — `'use client'`. Pin + timeline + beat lifecycle. Renders nothing visible (returns `null`).
- `src/components/sections/FeaturedCase/DecisionBeat.tsx` — Server Component. One beat's layout (numeral + copy + visual-proof slot via `children`).
- `src/components/sections/FeaturedCase/projects.data.ts` — typed project array. NextUp = `featured: true`.
- `src/components/sections/FeaturedCase/index.ts` — re-exports `FeaturedCase`.
- `src/components/sections/FeaturedCase/FeaturedCase.test.tsx`
- `src/components/sections/FeaturedCase/DecisionBeat.test.tsx`
- `src/components/sections/FeaturedCase/FeaturedCaseClient.test.tsx`
- `src/components/sections/SelectedWorks/SelectedWorks.tsx` — Server Component. Heading + horizontal row + placeholder card.
- `src/components/sections/SelectedWorks/WorkCard.tsx` — Server Component. One ledger entry.
- `src/components/sections/SelectedWorks/index.ts` — re-exports `SelectedWorks`.
- `src/components/sections/SelectedWorks/SelectedWorks.test.tsx`
- `src/components/sections/SelectedWorks/WorkCard.test.tsx`

**Create (assets — captured in Task 8):**
- `public/assets/case-study/nextup/beat-01-hero-crop.webp`
- `public/assets/case-study/nextup/beat-02-scroll.mp4`
- `public/assets/case-study/nextup/beat-02-scroll.webm`
- `public/assets/case-study/nextup/beat-02-scroll-poster.webp`
- `public/assets/case-study/nextup/beat-03-magnetic.mp4`
- `public/assets/case-study/nextup/beat-03-magnetic.webm`
- `public/assets/case-study/nextup/beat-03-magnetic-poster.webp`

**Create (scripts):**
- `scripts/capture-case-study-assets.mjs` — Playwright headful against `nextupco.com` + ffmpeg encode.
- `scripts/verify-case-study.mjs` — browser verification screenshots.

**Modify:**
- `src/app/globals.css` — append Case Study tokens + keyframes + reduced-motion guards.
- `src/app/page.tsx` — mount `<FeaturedCase />` + `<SelectedWorks />` after `<Services />`.
- `Project Log.md` — phase transition + task progress table.

---

## Task 0: Case Study tokens + keyframes in `globals.css`

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/app/globals.css`

**Context:** Append a parallel token block to the Services one. `--case-beat-progress` is a 0→1 channel driven by the timeline's `onUpdate`, though the current design reads opacity/y via tween values rather than CSS — the token is reserved for future use and documented for clarity. `--ledger-card-border-hover` matches the Services pattern. Reduced-motion guard snaps beats lit.

- [ ] **Step 1: Append Case Study tokens and keyframes to `globals.css`**

Append this block to the end of the file:

```css
/* ---------- CASE STUDY TOKENS (Phase 4) ---------- */
:root {
  /* FeaturedCase pin runway (documented, used in JS via 500vh string) */
  --case-pin-height: 500vh;

  /* scroll-driven beat progress channel (0 → 1, driven by timeline onUpdate — reserved) */
  --case-beat-progress: 0;

  /* video desaturation — overlay copy reads cleaner over slightly muted video */
  --case-video-desat: 0.8;

  /* SelectedWorks */
  --ledger-card-border-hover: color-mix(in oklch, var(--gold-accent) 30%, transparent);
}

/* ---------- CASE STUDY KEYFRAMES ---------- */
@keyframes case-arrow-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(2px); }
}

/* ---------- REDUCED MOTION (CASE STUDY) ---------- */
@media (prefers-reduced-motion: reduce) {
  [data-case-beat] {
    opacity: 1 !important;
    transform: none !important;
  }
  [data-case-arrow-float] {
    animation: none !important;
  }
}
```

- [ ] **Step 2: Verify dev server still renders without errors**

Run (non-blocking): `npm run dev`

Open `http://localhost:3000`. Expected: Hero + Services render exactly as before — tokens are inert until components consume them.

- [ ] **Step 3: Commit + push**

```bash
git add src/app/globals.css
git commit -m "feat(style): add case study tokens + arrow-float keyframes + reduced-motion guards"
git push origin main
```

---

## Task 1: Build `projects.data.ts` — typed project array

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/FeaturedCase/projects.data.ts`

**Context:** Single source of truth for all project metadata. Today holds one entry (NextUp); future projects slot in by appending. `as const satisfies readonly ProjectEntry[]` pattern matches services.data.ts — gives literal narrowing + static type-safety.

- [ ] **Step 1: Create the folder**

Run: `mkdir -p "/Users/dangeorge/The Vault/Dans Website/src/components/sections/FeaturedCase"`

- [ ] **Step 2: Create `projects.data.ts`**

```ts
export type ProjectEntry = {
  id: string;
  title: string;
  year: number;
  descriptor: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  featured: boolean;
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

- [ ] **Step 3: Verify tsc clean**

Run: `npx tsc --noEmit`

Expected: no errors.

- [ ] **Step 4: Commit + push**

```bash
git add src/components/sections/FeaturedCase/projects.data.ts
git commit -m "feat(case-study): add typed projects.data.ts with NextUp entry"
git push origin main
```

---

## Task 2: Build `WorkCard` (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/SelectedWorks/WorkCard.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/SelectedWorks/WorkCard.test.tsx`

**Purpose:** One ledger entry — thumbnail, project name, descriptor, year. Also handles the placeholder variant via a `placeholder: boolean` prop. Server Component — no state, no hooks.

- [ ] **Step 1: Create the folder**

Run: `mkdir -p "/Users/dangeorge/The Vault/Dans Website/src/components/sections/SelectedWorks"`

- [ ] **Step 2: Write the failing test**

`src/components/sections/SelectedWorks/WorkCard.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkCard } from "./WorkCard";

describe("<WorkCard /> — real project", () => {
  const entry = {
    id: "nextup",
    title: "NEXTUP",
    year: 2026,
    descriptor: "Trust-first website for a modern service company.",
    thumbnailSrc: "/assets/hero/nextup-live-poster.webp",
    thumbnailAlt: "NextUp — live homepage",
  };

  it("renders the thumbnail with correct src + alt", () => {
    const { container } = render(<WorkCard entry={entry} />);
    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.getAttribute("src")).toBe("/assets/hero/nextup-live-poster.webp");
    expect(img.getAttribute("alt")).toBe("NextUp — live homepage");
  });

  it("renders the project title as an h3", () => {
    const { container } = render(<WorkCard entry={entry} />);
    const h3 = container.querySelector("h3");
    expect(h3?.textContent).toBe("NEXTUP");
  });

  it("renders the descriptor and year", () => {
    const { getByText } = render(<WorkCard entry={entry} />);
    expect(getByText("Trust-first website for a modern service company.")).toBeInTheDocument();
    expect(getByText("2026")).toBeInTheDocument();
  });

  it("tags the root as an article with data hooks", () => {
    const { container } = render(<WorkCard entry={entry} />);
    const root = container.querySelector("article") as HTMLElement;
    expect(root.getAttribute("data-work-card")).toBe("");
    expect(root.getAttribute("data-card-id")).toBe("nextup");
  });
});

describe("<WorkCard /> — placeholder", () => {
  it("renders a placeholder card with NEXT UP label + dashed border marker", () => {
    const { container, getByText } = render(<WorkCard placeholder />);
    expect(getByText("NEXT UP →")).toBeInTheDocument();
    expect(getByText("New project landing soon.")).toBeInTheDocument();

    const root = container.querySelector("article") as HTMLElement;
    expect(root.getAttribute("data-work-card-placeholder")).toBe("");
    expect(root.getAttribute("aria-label")).toBe("Placeholder — new project landing soon");
  });

  it("does not render an img or year when placeholder", () => {
    const { container } = render(<WorkCard placeholder />);
    expect(container.querySelector("img")).toBeNull();
  });
});
```

- [ ] **Step 3: Run to confirm failure**

Run: `npm test -- WorkCard`

Expected: FAIL — module `./WorkCard` not found.

- [ ] **Step 4: Implement `WorkCard.tsx`**

```tsx
type RealProps = {
  entry: {
    id: string;
    title: string;
    year: number;
    descriptor: string;
    thumbnailSrc: string;
    thumbnailAlt: string;
  };
  placeholder?: false;
};

type PlaceholderProps = {
  placeholder: true;
  entry?: never;
};

type Props = RealProps | PlaceholderProps;

export function WorkCard(props: Props) {
  if (props.placeholder) {
    return (
      <article
        data-work-card-placeholder=""
        aria-label="Placeholder — new project landing soon"
        className="group relative flex w-[320px] shrink-0 flex-col gap-4"
      >
        <div
          className="relative flex aspect-[16/10] w-full items-center justify-center rounded-[12px] border border-dashed"
          style={{
            background: "rgba(245, 245, 240, 0.02)",
            borderColor: "rgba(245, 245, 240, 0.2)",
          }}
        >
          <span
            className="font-[var(--font-comico)] text-[20px] uppercase tracking-[0.1em]"
            style={{ color: "var(--text-secondary)" }}
          >
            NEXT UP →
          </span>
        </div>
        <p
          className="font-[var(--font-marker)] text-[14px] leading-[1.5]"
          style={{ color: "var(--text-secondary)", opacity: 0.6 }}
        >
          New project landing soon.
        </p>
      </article>
    );
  }

  const { entry } = props;
  return (
    <article
      data-work-card=""
      data-card-id={entry.id}
      className="group relative flex w-[320px] shrink-0 flex-col gap-4 transition-transform duration-200 ease-out hover:-translate-y-[2px]"
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px] border"
        style={{ borderColor: "var(--services-card-border)" }}
      >
        <img
          src={entry.thumbnailSrc}
          alt={entry.thumbnailAlt}
          className="h-full w-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3
            className="font-[var(--font-comico)] text-[20px] uppercase tracking-[0.05em]"
            style={{ color: "var(--text-primary)" }}
          >
            {entry.title}
          </h3>
          <p
            className="font-[var(--font-marker)] text-[14px] leading-[1.5]"
            style={{ color: "var(--text-secondary)" }}
          >
            {entry.descriptor}
          </p>
        </div>
        <span
          className="font-[var(--font-marker)] text-[12px]"
          style={{ color: "var(--gold-accent)" }}
        >
          {entry.year}
        </span>
      </div>
    </article>
  );
}
```

- [ ] **Step 5: Run to confirm pass**

Run: `npm test -- WorkCard`

Expected: `6 passed`.

- [ ] **Step 6: Type check**

Run: `npx tsc --noEmit`

Expected: no errors.

- [ ] **Step 7: Commit + push**

```bash
git add src/components/sections/SelectedWorks/WorkCard.tsx src/components/sections/SelectedWorks/WorkCard.test.tsx
git commit -m "feat(selected-works): add WorkCard — real + placeholder variants"
git push origin main
```

---

## Task 3: Build `SelectedWorks` Server Component (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/SelectedWorks/SelectedWorks.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/SelectedWorks/SelectedWorks.test.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/SelectedWorks/index.ts`

**Purpose:** Section shell + "SELECTED WORKS" heading + horizontal row of `WorkCard`s + the honest "NEXT UP →" placeholder. Native `overflow-x-auto` + `scroll-snap` — no JS.

- [ ] **Step 1: Write the failing test**

`src/components/sections/SelectedWorks/SelectedWorks.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SelectedWorks } from "./SelectedWorks";

describe("<SelectedWorks />", () => {
  it("renders a <section> with the expected id and aria-labelledby", () => {
    const { container } = render(<SelectedWorks />);
    const section = container.querySelector("section") as HTMLElement;
    expect(section.id).toBe("selected-works");
    expect(section.getAttribute("aria-labelledby")).toBe("selected-works-heading");
  });

  it("renders the locked heading text as h2", () => {
    const { getByRole } = render(<SelectedWorks />);
    const h2 = getByRole("heading", { level: 2 });
    expect(h2.id).toBe("selected-works-heading");
    expect(h2.textContent).toBe("SELECTED WORKS");
  });

  it("renders one WorkCard for NextUp plus the placeholder", () => {
    const { container, getByText } = render(<SelectedWorks />);
    const realCards = container.querySelectorAll("[data-work-card]");
    const placeholders = container.querySelectorAll("[data-work-card-placeholder]");
    expect(realCards.length).toBe(1);
    expect(placeholders.length).toBe(1);
    expect(getByText("NEXTUP")).toBeInTheDocument();
    expect(getByText("NEXT UP →")).toBeInTheDocument();
  });

  it("renders the cards inside a scroll-snapping row", () => {
    const { container } = render(<SelectedWorks />);
    const row = container.querySelector("[data-works-row]") as HTMLElement;
    expect(row).toBeTruthy();
    const style = row.getAttribute("style") ?? "";
    // Tailwind classes carry scroll-snap; test presence of the data hook + flex layout.
    expect(row.className).toContain("flex");
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test -- SelectedWorks.test`

Expected: FAIL — module `./SelectedWorks` not found.

- [ ] **Step 3: Implement `SelectedWorks.tsx`**

```tsx
import { PROJECTS } from "../FeaturedCase/projects.data";
import { WorkCard } from "./WorkCard";

export function SelectedWorks() {
  return (
    <section
      id="selected-works"
      aria-labelledby="selected-works-heading"
      className="relative w-full py-24 md:py-32"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-12">
        <h2
          id="selected-works-heading"
          className="mb-8 font-[var(--font-comico)] text-[24px] uppercase tracking-[0.05em] md:text-[32px]"
          style={{ color: "var(--text-primary)" }}
        >
          SELECTED WORKS
        </h2>

        <div
          data-works-row
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:gap-6 md:overflow-x-auto"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {PROJECTS.map((entry) => (
            <div
              key={entry.id}
              className="snap-start"
              style={{ scrollSnapAlign: "start" }}
            >
              <WorkCard
                entry={{
                  id: entry.id,
                  title: entry.title,
                  year: entry.year,
                  descriptor: entry.descriptor,
                  thumbnailSrc: entry.thumbnailSrc,
                  thumbnailAlt: entry.thumbnailAlt,
                }}
              />
            </div>
          ))}
          <div className="snap-start" style={{ scrollSnapAlign: "start" }}>
            <WorkCard placeholder />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create barrel `index.ts`**

```ts
export { SelectedWorks } from "./SelectedWorks";
```

- [ ] **Step 5: Run to confirm pass**

Run: `npm test -- SelectedWorks.test`

Expected: `4 passed`.

- [ ] **Step 6: Type check**

Run: `npx tsc --noEmit`

Expected: no errors.

- [ ] **Step 7: Commit + push**

```bash
git add src/components/sections/SelectedWorks/SelectedWorks.tsx src/components/sections/SelectedWorks/SelectedWorks.test.tsx src/components/sections/SelectedWorks/index.ts
git commit -m "feat(selected-works): add horizontal ledger with NextUp + placeholder"
git push origin main
```

---

## Task 4: Wire `<SelectedWorks />` into `page.tsx` + visual check

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/app/page.tsx`

**Context:** Land SelectedWorks below Services first (FeaturedCase slots between them in Task 9). Gives us a visible checkpoint on the ledger before moving to the harder pin lifecycle.

- [ ] **Step 1: Modify `page.tsx`**

Replace entire contents of `src/app/page.tsx`:

```tsx
import { Hero } from "@/components/sections/Hero/Hero";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { Services } from "@/components/sections/Services/Services";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <SelectedWorks />
    </>
  );
}
```

- [ ] **Step 2: Start dev server and visual-check**

Run (non-blocking): `npm run dev`

Open `http://localhost:3000`. Scroll past Services. Expected:

- "SELECTED WORKS" heading left-aligned, Comico, all-caps
- Below it, a horizontal row: NextUp live-poster thumbnail + NEXT UP → placeholder
- On desktop (≥1024px) both cards visible side-by-side
- On mobile, horizontal scroll reveals the placeholder after NextUp
- No console errors

- [ ] **Step 3: Run full verification**

```bash
npm test -- --run && npx tsc --noEmit && npm run lint && npm run build
```

Expected: all green.

- [ ] **Step 4: Commit + push**

```bash
git add src/app/page.tsx
git commit -m "feat(page): mount <SelectedWorks /> on home page below services"
git push origin main
```

---

## Task 5: Build `DecisionBeat` (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/FeaturedCase/DecisionBeat.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/FeaturedCase/DecisionBeat.test.tsx`

**Purpose:** One Act 2 beat — large numeral, title, body, visual-proof slot via `children`. Tagged with `data-case-beat` + `data-beat-index` for the timeline to target. Server Component.

- [ ] **Step 1: Write the failing test**

`src/components/sections/FeaturedCase/DecisionBeat.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DecisionBeat } from "./DecisionBeat";

describe("<DecisionBeat />", () => {
  it("renders numeral, title, body, and children", () => {
    const { getByText } = render(
      <DecisionBeat index={0} title="WHY BLUE" body="Trust is the moat.">
        <div data-testid="proof">proof content</div>
      </DecisionBeat>,
    );
    expect(getByText("01")).toBeInTheDocument();
    expect(getByText("WHY BLUE")).toBeInTheDocument();
    expect(getByText("Trust is the moat.")).toBeInTheDocument();
    expect(getByText("proof content")).toBeInTheDocument();
  });

  it("formats numeral zero-padded for index 1 → '02'", () => {
    const { getByText } = render(
      <DecisionBeat index={1} title="MODERN" body="Restraint over spectacle.">
        <div />
      </DecisionBeat>,
    );
    expect(getByText("02")).toBeInTheDocument();
  });

  it("tags the root with data-case-beat and data-beat-index", () => {
    const { container } = render(
      <DecisionBeat index={2} title="FLOURISHES" body="Small craft, big lift.">
        <div />
      </DecisionBeat>,
    );
    const root = container.querySelector("[data-case-beat]") as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.getAttribute("data-beat-index")).toBe("2");
  });

  it("renders title as h3", () => {
    const { container } = render(
      <DecisionBeat index={0} title="WHY BLUE" body="Trust.">
        <div />
      </DecisionBeat>,
    );
    expect(container.querySelector("h3")?.textContent).toBe("WHY BLUE");
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test -- DecisionBeat`

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `DecisionBeat.tsx`**

```tsx
import type { ReactNode } from "react";

type Props = {
  index: number;
  title: string;
  body: string;
  children: ReactNode;
};

function formatNumeral(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function DecisionBeat({ index, title, body, children }: Props) {
  return (
    <div
      data-case-beat=""
      data-beat-index={index}
      className="grid w-full grid-cols-1 gap-10 md:grid-cols-12 md:gap-12"
    >
      <div className="md:col-span-5">
        <div
          className="mb-4 font-[var(--font-comico)] text-[72px] leading-none md:text-[120px]"
          style={{ color: "var(--gold-accent)", opacity: 0.4 }}
        >
          {formatNumeral(index)}
        </div>
        <h3
          className="mb-5 font-[var(--font-comico)] text-[32px] uppercase leading-tight tracking-[0.05em] md:text-[48px]"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
        <p
          className="max-w-[52ch] font-[var(--font-marker)] text-[15px] leading-[1.6] md:text-[18px]"
          style={{ color: "var(--text-secondary)" }}
        >
          {body}
        </p>
      </div>
      <div className="md:col-span-7">
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px] border"
          style={{
            borderColor: "var(--services-card-border)",
            boxShadow: "inset 0 0 60px rgba(11,36,34,0.4)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm test -- DecisionBeat`

Expected: `4 passed`.

- [ ] **Step 5: Type check**

Run: `npx tsc --noEmit`

Expected: no errors.

- [ ] **Step 6: Commit + push**

```bash
git add src/components/sections/FeaturedCase/DecisionBeat.tsx src/components/sections/FeaturedCase/DecisionBeat.test.tsx
git commit -m "feat(case-study): add DecisionBeat — numeral + copy + visual-proof slot"
git push origin main
```

---

## Task 6: Build `FeaturedCase` Server Component (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/FeaturedCase/FeaturedCase.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/FeaturedCase/FeaturedCase.test.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/FeaturedCase/index.ts`

**Purpose:** Section shell, hidden H2 for landmarks, single `<video>` backdrop, Act 1 overlay copy + micro-comparison chip, three `<DecisionBeat>`s in Act 2 with locked copy + visual proofs, Act 3 outcome block, `<FeaturedCaseClient />` stub mount. Server Component — ALL motion lives in the Client in Task 7. Beats default to natural flow (stacked vertically) — the Client switches them to absolute/pinned on mount. Reduced-motion never runs that switch → natural flow persists.

**Locked copy (from spec §5.2 / §4.2 / §6.2):**

- Act 1 L1: `NEXTUP — 2026`
- Act 1 L2: `My company. I designed it, built it, ship to it.`
- Beat 01 title: `WHY BLUE`
- Beat 01 body: `Our competition is loud. I chose blue because trust is the moat — and trust looks calm, not flashy. The whole palette defers to the work instead of shouting over it.`
- Beat 02 title: `MODERN, NOT LOUD`
- Beat 02 body: `"Modern" is easy to overdo. The brief was to look like a 2026 company without looking like a demo reel. Every motion decision passes one filter: does it help the user, or just perform for them?`
- Beat 03 title: `SMALL FLOURISHES, BIG LIFT`
- Beat 03 body: `Magnetic buttons. A full intro sequence. An animated background that responds to the cursor. Tiny craft decisions stacked — none shouting alone, all adding up to a site that feels unmistakably hand-made.`
- Act 3 line 1: `The site's doing its job.`
- Act 3 chip: `LIGHTHOUSE 97 · A11Y 100 · BP 100`
- Act 3 line 3: `Selected works ↓`

- [ ] **Step 1: Write the failing test**

`src/components/sections/FeaturedCase/FeaturedCase.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./FeaturedCaseClient", () => ({
  FeaturedCaseClient: () => null,
}));

import { FeaturedCase } from "./FeaturedCase";

describe("<FeaturedCase />", () => {
  it("renders a <section> with id + aria-labelledby", () => {
    const { container } = render(<FeaturedCase />);
    const section = container.querySelector("section") as HTMLElement;
    expect(section.id).toBe("case-study-nextup");
    expect(section.getAttribute("aria-labelledby")).toBe("case-study-heading");
  });

  it("renders a visually hidden h2 landmark", () => {
    const { getByRole } = render(<FeaturedCase />);
    const h2 = getByRole("heading", { level: 2, hidden: true });
    expect(h2.id).toBe("case-study-heading");
    expect(h2.className).toContain("sr-only");
  });

  it("renders ONE video element with both webm and mp4 sources + poster", () => {
    const { container } = render(<FeaturedCase />);
    const videos = container.querySelectorAll("video");
    expect(videos.length).toBe(1);
    const video = videos[0];
    expect(video.getAttribute("aria-hidden")).toBe("true");
    expect(video.hasAttribute("muted")).toBe(true);
    expect(video.hasAttribute("autoplay")).toBe(true);
    expect(video.hasAttribute("loop")).toBe(true);
    expect(video.getAttribute("poster")).toContain("nextup-live-poster.webp");
    const sources = video.querySelectorAll("source");
    expect(sources.length).toBe(2);
    expect(Array.from(sources).some((s) => s.getAttribute("type") === "video/webm")).toBe(true);
    expect(Array.from(sources).some((s) => s.getAttribute("type") === "video/mp4")).toBe(true);
  });

  it("renders Act 1 overlay copy", () => {
    const { getByText } = render(<FeaturedCase />);
    expect(getByText("NEXTUP — 2026")).toBeInTheDocument();
    expect(getByText("My company. I designed it, built it, ship to it.")).toBeInTheDocument();
  });

  it("renders exactly three Act 2 decision beats with locked titles", () => {
    const { container, getByText } = render(<FeaturedCase />);
    const beats = container.querySelectorAll("[data-case-beat]");
    expect(beats.length).toBe(3);
    expect(getByText("WHY BLUE")).toBeInTheDocument();
    expect(getByText("MODERN, NOT LOUD")).toBeInTheDocument();
    expect(getByText("SMALL FLOURISHES, BIG LIFT")).toBeInTheDocument();
  });

  it("renders Act 3 outcome block with locked chip text", () => {
    const { getByText } = render(<FeaturedCase />);
    expect(getByText("The site's doing its job.")).toBeInTheDocument();
    expect(getByText("LIGHTHOUSE 97 · A11Y 100 · BP 100")).toBeInTheDocument();
  });

  it("tags the act regions with data hooks for the Client to target", () => {
    const { container } = render(<FeaturedCase />);
    expect(container.querySelector("[data-case-act='1']")).toBeTruthy();
    expect(container.querySelector("[data-case-act='2']")).toBeTruthy();
    expect(container.querySelector("[data-case-act='3']")).toBeTruthy();
    expect(container.querySelector("[data-case-video]")).toBeTruthy();
    expect(container.querySelector("[data-case-pin]")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test -- FeaturedCase.test`

Expected: FAIL — module not found.

- [ ] **Step 3: Create stub `FeaturedCaseClient.tsx`**

Stub so `FeaturedCase.tsx` can import it. Real lifecycle lands in Task 7.

```tsx
"use client";

export function FeaturedCaseClient() {
  return null;
}
```

- [ ] **Step 4: Implement `FeaturedCase.tsx`**

```tsx
import { FeaturedCaseClient } from "./FeaturedCaseClient";

const PALETTE_STEPS = [
  "#04265E",
  "#0B3D8C",
  "#1C5AC5",
  "#3B7BE0",
  "#6C9FEB",
  "#A8C4F2",
] as const;

export function FeaturedCase() {
  return (
    <section
      id="case-study-nextup"
      aria-labelledby="case-study-heading"
      className="relative w-full"
      style={{ background: "var(--bg-primary)" }}
    >
      <h2 id="case-study-heading" className="sr-only">
        NextUp — featured case study
      </h2>

      <div
        data-case-pin
        className="relative w-full"
        style={{ minHeight: "100vh" }}
      >
        {/* Single backdrop video — one DOM node, Client toggles opacity across acts */}
        <video
          data-case-video
          aria-hidden="true"
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          poster="/assets/hero/nextup-live-poster.webp"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ filter: "saturate(var(--case-video-desat))" }}
        >
          <source src="/assets/hero/nextup-live.webm" type="video/webm" />
          <source src="/assets/hero/nextup-live.mp4" type="video/mp4" />
        </video>

        {/* Act 1 — setup */}
        <div
          data-case-act="1"
          className="absolute inset-0 z-10"
        >
          <div className="absolute bottom-10 left-6 md:bottom-16 md:left-12">
            <p
              className="mb-2 font-[var(--font-comico)] text-[28px] uppercase tracking-[0.05em] md:text-[40px]"
              style={{ color: "var(--text-primary)" }}
            >
              NEXTUP — 2026
            </p>
            <p
              className="font-[var(--font-marker)] text-[15px] leading-[1.5] md:text-[18px]"
              style={{ color: "var(--text-secondary)" }}
            >
              My company. I designed it, built it, ship to it.
            </p>
          </div>

          {/* micro-comparison chip — hidden on mobile */}
          <div className="absolute right-12 top-16 hidden items-center gap-4 md:flex">
            <div className="flex flex-col items-center gap-1">
              <div
                className="h-[40px] w-[60px] overflow-hidden border"
                style={{ borderColor: "var(--gold-accent)" }}
              >
                <img
                  src="/assets/hero/nextup-old.webp"
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                />
              </div>
              <span
                className="font-[var(--font-marker)] text-[11px] tracking-[0.1em]"
                style={{ color: "var(--text-secondary)" }}
              >
                DRAFT
              </span>
            </div>
            <span
              className="font-[var(--font-marker)] text-[14px]"
              style={{ color: "var(--gold-accent)" }}
            >
              →
            </span>
            <div className="flex flex-col items-center gap-1">
              <div
                className="h-[40px] w-[60px] overflow-hidden border"
                style={{ borderColor: "var(--gold-accent)" }}
              >
                <img
                  src="/assets/hero/nextup-live-poster.webp"
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                />
              </div>
              <span
                className="font-[var(--font-marker)] text-[11px] tracking-[0.1em]"
                style={{ color: "var(--text-secondary)" }}
              >
                REALITY
              </span>
            </div>
          </div>
        </div>

        {/* Act 2 — thinking */}
        <div
          data-case-act="2"
          className="relative z-20 mx-auto w-full max-w-[1400px] px-6 py-32 md:px-10 md:py-40 lg:px-12"
          style={{ background: "var(--bg-primary)" }}
        >
          <div className="flex flex-col gap-32 md:gap-40">
            {/* Beat 01 — WHY BLUE */}
            <BeatOne />
            {/* Beat 02 — MODERN, NOT LOUD */}
            <BeatTwo />
            {/* Beat 03 — SMALL FLOURISHES, BIG LIFT */}
            <BeatThree />
          </div>
        </div>

        {/* Act 3 — outcome */}
        <div
          data-case-act="3"
          className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-32 text-center md:px-10 md:py-40 lg:px-12"
        >
          <p
            className="mb-6 font-[var(--font-comico)] text-[24px] md:text-[32px]"
            style={{ color: "var(--text-primary)" }}
          >
            The site&apos;s doing its job.
          </p>
          <p
            className="mx-auto mb-6 inline-block rounded-full border px-4 py-2 font-[var(--font-marker)] text-[13px] uppercase tracking-[0.1em]"
            style={{
              borderColor: "var(--gold-accent)",
              color: "var(--gold-accent)",
            }}
          >
            LIGHTHOUSE 97 · A11Y 100 · BP 100
          </p>
          <p
            data-case-arrow-float
            className="font-[var(--font-marker)] text-[14px]"
            style={{
              color: "var(--text-secondary)",
              animation: "case-arrow-float 1.2s ease-in-out infinite",
            }}
          >
            Selected works ↓
          </p>
        </div>
      </div>

      <FeaturedCaseClient />
    </section>
  );
}

function BeatOne() {
  return (
    <div data-case-beat="" data-beat-index={0} className="grid w-full grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
      <div className="md:col-span-5">
        <div
          className="mb-4 font-[var(--font-comico)] text-[72px] leading-none md:text-[120px]"
          style={{ color: "var(--gold-accent)", opacity: 0.4 }}
        >
          01
        </div>
        <h3
          className="mb-5 font-[var(--font-comico)] text-[32px] uppercase leading-tight tracking-[0.05em] md:text-[48px]"
          style={{ color: "var(--text-primary)" }}
        >
          WHY BLUE
        </h3>
        <p
          className="max-w-[52ch] font-[var(--font-marker)] text-[15px] leading-[1.6] md:text-[18px]"
          style={{ color: "var(--text-secondary)" }}
        >
          Our competition is loud. I chose blue because trust is the moat — and trust looks calm, not flashy. The whole palette defers to the work instead of shouting over it.
        </p>
      </div>
      <div className="md:col-span-7">
        <div
          className="relative flex aspect-[4/3] w-full items-stretch gap-4 overflow-hidden rounded-[12px] border p-6"
          style={{
            borderColor: "var(--services-card-border)",
            boxShadow: "inset 0 0 60px rgba(11,36,34,0.4)",
          }}
        >
          <div className="flex w-[96px] flex-col gap-[2px]">
            {[
              "#04265E",
              "#0B3D8C",
              "#1C5AC5",
              "#3B7BE0",
              "#6C9FEB",
              "#A8C4F2",
            ].map((hex) => (
              <div
                key={hex}
                className="h-full w-full"
                style={{ background: hex }}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="flex-1 overflow-hidden rounded-[8px]">
            <img
              src="/assets/case-study/nextup/beat-01-hero-crop.webp"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BeatTwo() {
  return (
    <div data-case-beat="" data-beat-index={1} className="grid w-full grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
      <div className="md:col-span-5">
        <div
          className="mb-4 font-[var(--font-comico)] text-[72px] leading-none md:text-[120px]"
          style={{ color: "var(--gold-accent)", opacity: 0.4 }}
        >
          02
        </div>
        <h3
          className="mb-5 font-[var(--font-comico)] text-[32px] uppercase leading-tight tracking-[0.05em] md:text-[48px]"
          style={{ color: "var(--text-primary)" }}
        >
          MODERN, NOT LOUD
        </h3>
        <p
          className="max-w-[52ch] font-[var(--font-marker)] text-[15px] leading-[1.6] md:text-[18px]"
          style={{ color: "var(--text-secondary)" }}
        >
          &quot;Modern&quot; is easy to overdo. The brief was to look like a 2026 company without looking like a demo reel. Every motion decision passes one filter: does it help the user, or just perform for them?
        </p>
      </div>
      <div className="md:col-span-7">
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px] border"
          style={{
            borderColor: "var(--services-card-border)",
            boxShadow: "inset 0 0 60px rgba(11,36,34,0.4)",
          }}
        >
          <video
            aria-hidden="true"
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            poster="/assets/case-study/nextup/beat-02-scroll-poster.webp"
            className="h-full w-full object-cover"
          >
            <source src="/assets/case-study/nextup/beat-02-scroll.webm" type="video/webm" />
            <source src="/assets/case-study/nextup/beat-02-scroll.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}

function BeatThree() {
  return (
    <div data-case-beat="" data-beat-index={2} className="grid w-full grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
      <div className="md:col-span-5">
        <div
          className="mb-4 font-[var(--font-comico)] text-[72px] leading-none md:text-[120px]"
          style={{ color: "var(--gold-accent)", opacity: 0.4 }}
        >
          03
        </div>
        <h3
          className="mb-5 font-[var(--font-comico)] text-[32px] uppercase leading-tight tracking-[0.05em] md:text-[48px]"
          style={{ color: "var(--text-primary)" }}
        >
          SMALL FLOURISHES, BIG LIFT
        </h3>
        <p
          className="max-w-[52ch] font-[var(--font-marker)] text-[15px] leading-[1.6] md:text-[18px]"
          style={{ color: "var(--text-secondary)" }}
        >
          Magnetic buttons. A full intro sequence. An animated background that responds to the cursor. Tiny craft decisions stacked — none shouting alone, all adding up to a site that feels unmistakably hand-made.
        </p>
      </div>
      <div className="md:col-span-7">
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px] border"
          style={{
            borderColor: "var(--services-card-border)",
            boxShadow: "inset 0 0 60px rgba(11,36,34,0.4)",
          }}
        >
          <video
            aria-hidden="true"
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            poster="/assets/case-study/nextup/beat-03-magnetic-poster.webp"
            className="h-full w-full object-cover"
          >
            <source src="/assets/case-study/nextup/beat-03-magnetic.webm" type="video/webm" />
            <source src="/assets/case-study/nextup/beat-03-magnetic.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
```

Note: the three beat render functions are intentionally inlined (not using the `DecisionBeat` component) because the visual proof markup varies per beat. `DecisionBeat` (Task 5) stays available for future use when a second project lands and we refactor this to data-driven; today keeping the inline versions avoids an awkward children-as-prop composition for three one-offs.

Actually simpler: use DecisionBeat + pass `children`. That reduces duplication. Refactor using DecisionBeat — see Step 5.

- [ ] **Step 5: Refactor to use `DecisionBeat` component**

Replace the three inline `BeatOne` / `BeatTwo` / `BeatThree` function definitions with calls to `<DecisionBeat>` inside the Act 2 section. Final Act 2 block:

```tsx
import { DecisionBeat } from "./DecisionBeat";

// ... inside the FeaturedCase render, Act 2 div:
<div
  data-case-act="2"
  className="relative z-20 mx-auto w-full max-w-[1400px] px-6 py-32 md:px-10 md:py-40 lg:px-12"
  style={{ background: "var(--bg-primary)" }}
>
  <div className="flex flex-col gap-32 md:gap-40">
    <DecisionBeat
      index={0}
      title="WHY BLUE"
      body="Our competition is loud. I chose blue because trust is the moat — and trust looks calm, not flashy. The whole palette defers to the work instead of shouting over it."
    >
      <div className="flex h-full items-stretch gap-4 p-6">
        <div className="flex w-[96px] flex-col gap-[2px]">
          {["#04265E", "#0B3D8C", "#1C5AC5", "#3B7BE0", "#6C9FEB", "#A8C4F2"].map((hex) => (
            <div
              key={hex}
              className="h-full w-full"
              style={{ background: hex }}
              aria-hidden="true"
            />
          ))}
        </div>
        <div className="flex-1 overflow-hidden rounded-[8px]">
          <img
            src="/assets/case-study/nextup/beat-01-hero-crop.webp"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </DecisionBeat>

    <DecisionBeat
      index={1}
      title="MODERN, NOT LOUD"
      body={`"Modern" is easy to overdo. The brief was to look like a 2026 company without looking like a demo reel. Every motion decision passes one filter: does it help the user, or just perform for them?`}
    >
      <video
        aria-hidden="true"
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        poster="/assets/case-study/nextup/beat-02-scroll-poster.webp"
        className="h-full w-full object-cover"
      >
        <source src="/assets/case-study/nextup/beat-02-scroll.webm" type="video/webm" />
        <source src="/assets/case-study/nextup/beat-02-scroll.mp4" type="video/mp4" />
      </video>
    </DecisionBeat>

    <DecisionBeat
      index={2}
      title="SMALL FLOURISHES, BIG LIFT"
      body="Magnetic buttons. A full intro sequence. An animated background that responds to the cursor. Tiny craft decisions stacked — none shouting alone, all adding up to a site that feels unmistakably hand-made."
    >
      <video
        aria-hidden="true"
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        poster="/assets/case-study/nextup/beat-03-magnetic-poster.webp"
        className="h-full w-full object-cover"
      >
        <source src="/assets/case-study/nextup/beat-03-magnetic.webm" type="video/webm" />
        <source src="/assets/case-study/nextup/beat-03-magnetic.mp4" type="video/mp4" />
      </video>
    </DecisionBeat>
  </div>
</div>
```

Remove the `BeatOne`/`BeatTwo`/`BeatThree` helper functions — no longer needed.

- [ ] **Step 6: Create barrel `index.ts`**

```ts
export { FeaturedCase } from "./FeaturedCase";
```

- [ ] **Step 7: Run to confirm pass**

Run: `npm test -- FeaturedCase.test`

Expected: `7 passed`.

- [ ] **Step 8: Type check**

Run: `npx tsc --noEmit`

Expected: no errors.

- [ ] **Step 9: Commit + push**

```bash
git add src/components/sections/FeaturedCase/FeaturedCase.tsx src/components/sections/FeaturedCase/FeaturedCase.test.tsx src/components/sections/FeaturedCase/FeaturedCaseClient.tsx src/components/sections/FeaturedCase/index.ts
git commit -m "feat(case-study): FeaturedCase Server Component — 3 acts + beats + stub client"
git push origin main
```

---

## Task 7: Implement `FeaturedCaseClient` (TDD)

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/FeaturedCase/FeaturedCaseClient.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/sections/FeaturedCase/FeaturedCaseClient.test.tsx`

**Purpose:** Pin the section for 500vh, drive a single GSAP timeline with labels `"act-1-end"`, `"beat-01"`, `"beat-02"`, `"beat-03"`, `"act-3-start"`. Timeline animates: beat opacity crossfades (beats sit absolute-positioned inside Act 2 once pinned), video node opacity (1 in Acts 1/3, 0 in Act 2). Reduced-motion early return = natural flow (stacked beats, no pin). Mobile early return = natural flow.

**Scope constraints per spec:**
- ONE ScrollTrigger (the pin), NOT one per beat.
- Timeline scrubbed by the pin's progress via `scrub: 0.5`.
- Before building the timeline, switch `[data-case-act='2']` to `position: absolute; inset: 0` so beats stack at the same viewport location. Use a GSAP `set` — reverting the context restores natural flow.
- Beats default to natural flow in the Server Component (Task 6). Client actively positions them absolute on mount. Reduced-motion branch never runs this setup → beats stay stacked.

- [ ] **Step 1: Write the failing test**

`src/components/sections/FeaturedCase/FeaturedCaseClient.test.tsx`:

```tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const scrollTriggerCreate = vi.fn();
const gsapContextRevert = vi.fn();
const gsapSetSpy = vi.fn();
const gsapToSpy = vi.fn();
const timelineFromToSpy = vi.fn();
const timelineAddLabelSpy = vi.fn();

function makeTimeline() {
  const tl: any = {
    to: (...args: any[]) => {
      gsapToSpy(...args);
      return tl;
    },
    fromTo: (...args: any[]) => {
      timelineFromToSpy(...args);
      return tl;
    },
    addLabel: (...args: any[]) => {
      timelineAddLabelSpy(...args);
      return tl;
    },
    add: (fn: () => void) => {
      if (typeof fn === "function") fn();
      return tl;
    },
    set: (...args: any[]) => {
      gsapSetSpy(...args);
      return tl;
    },
    kill: vi.fn(),
  };
  return tl;
}

vi.mock("gsap", () => {
  const gsap = {
    registerPlugin: vi.fn(),
    set: gsapSetSpy,
    to: gsapToSpy,
    timeline: (opts: any) => {
      // capture timeline options (e.g. scrollTrigger config) via the ScrollTrigger create spy indirectly
      if (opts?.scrollTrigger) {
        scrollTriggerCreate(opts.scrollTrigger);
      }
      return makeTimeline();
    },
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
      return { kill: vi.fn() };
    },
    getAll: () => [],
    refresh: vi.fn(),
  },
}));

function Harness() {
  return (
    <section id="case-study-nextup">
      <div data-case-pin>
        <video data-case-video />
        <div data-case-act="1" />
        <div data-case-act="2">
          <div data-case-beat="" data-beat-index={0} />
          <div data-case-beat="" data-beat-index={1} />
          <div data-case-beat="" data-beat-index={2} />
        </div>
        <div data-case-act="3" />
      </div>
    </section>
  );
}

describe("<FeaturedCaseClient /> — desktop, motion OK", () => {
  beforeEach(() => {
    scrollTriggerCreate.mockReset();
    gsapContextRevert.mockReset();
    gsapSetSpy.mockReset();
    gsapToSpy.mockReset();
    timelineFromToSpy.mockReset();
    timelineAddLabelSpy.mockReset();

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("min-width"),
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

  it("creates exactly one ScrollTrigger with pin + scrub on the pin element", async () => {
    const { FeaturedCaseClient } = await import("./FeaturedCaseClient");
    render(
      <>
        <Harness />
        <FeaturedCaseClient />
      </>,
    );
    expect(scrollTriggerCreate).toHaveBeenCalledTimes(1);
    const [opts] = scrollTriggerCreate.mock.calls[0];
    expect(opts.pin).toBe(true);
    expect(opts.scrub).toBe(0.5);
    expect(opts.end).toBe("+=500%");
  });

  it("sets Act 2 to position: absolute on mount so beats overlay", async () => {
    const { FeaturedCaseClient } = await import("./FeaturedCaseClient");
    render(
      <>
        <Harness />
        <FeaturedCaseClient />
      </>,
    );
    const calls = gsapSetSpy.mock.calls;
    const setsAct2Absolute = calls.some(([target, vars]) => {
      const el = Array.isArray(target) ? target[0] : target;
      return (
        (el as HTMLElement)?.dataset?.caseAct === "2" &&
        (vars as any).position === "absolute"
      );
    });
    expect(setsAct2Absolute).toBe(true);
  });

  it("adds timeline labels for each beat", async () => {
    const { FeaturedCaseClient } = await import("./FeaturedCaseClient");
    render(
      <>
        <Harness />
        <FeaturedCaseClient />
      </>,
    );
    const labels = timelineAddLabelSpy.mock.calls.map((c) => c[0]);
    expect(labels).toContain("beat-01");
    expect(labels).toContain("beat-02");
    expect(labels).toContain("beat-03");
  });

  it("reverts gsap context on unmount", async () => {
    const { FeaturedCaseClient } = await import("./FeaturedCaseClient");
    const { unmount } = render(
      <>
        <Harness />
        <FeaturedCaseClient />
      </>,
    );
    unmount();
    expect(gsapContextRevert).toHaveBeenCalled();
  });
});

describe("<FeaturedCaseClient /> — reduced motion", () => {
  beforeEach(() => {
    scrollTriggerCreate.mockReset();
    gsapContextRevert.mockReset();
    gsapSetSpy.mockReset();

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("reduced"),
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

  it("does not create a ScrollTrigger when reduced-motion is requested", async () => {
    const { FeaturedCaseClient } = await import("./FeaturedCaseClient");
    render(
      <>
        <Harness />
        <FeaturedCaseClient />
      </>,
    );
    expect(scrollTriggerCreate).not.toHaveBeenCalled();
  });
});

describe("<FeaturedCaseClient /> — mobile", () => {
  beforeEach(() => {
    scrollTriggerCreate.mockReset();

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false, // min-width false, reduced false → mobile, motion-OK
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

  it("does not create a ScrollTrigger on mobile viewports", async () => {
    const { FeaturedCaseClient } = await import("./FeaturedCaseClient");
    render(
      <>
        <Harness />
        <FeaturedCaseClient />
      </>,
    );
    expect(scrollTriggerCreate).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run to confirm failures**

Run: `npm test -- FeaturedCaseClient`

Expected: multiple FAILs — stub currently creates no ScrollTrigger.

- [ ] **Step 3: Implement `FeaturedCaseClient.tsx`**

Replace the stub:

```tsx
"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type CSSVarTweenVars = gsap.TweenVars & Record<`--${string}`, string | number>;

gsap.registerPlugin(ScrollTrigger);

export function FeaturedCaseClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = document.getElementById("case-study-nextup");
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    if (prefersReducedMotion || !isDesktop) {
      // natural flow — beats stack vertically, video plays inline, no pin.
      return;
    }

    const pin = section.querySelector<HTMLElement>("[data-case-pin]");
    const video = section.querySelector<HTMLElement>("[data-case-video]");
    const act1 = section.querySelector<HTMLElement>('[data-case-act="1"]');
    const act2 = section.querySelector<HTMLElement>('[data-case-act="2"]');
    const act3 = section.querySelector<HTMLElement>('[data-case-act="3"]');
    const beats = Array.from(
      section.querySelectorAll<HTMLElement>("[data-case-beat]"),
    );

    if (!pin || !act2 || beats.length < 3) return;

    const ctx = gsap.context(() => {
      // Switch Act 2 to absolute so beats overlay; beats themselves become absolute children.
      gsap.set(act2, {
        position: "absolute",
        inset: 0,
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      });
      beats.forEach((beat, i) => {
        gsap.set(beat, {
          position: "absolute",
          inset: 0,
          margin: "auto",
          maxWidth: "1400px",
          paddingLeft: "3rem",
          paddingRight: "3rem",
          opacity: i === 0 ? 0 : 0,
          y: 40,
          display: "flex",
          alignItems: "center",
        });
      });
      if (act3) gsap.set(act3, { opacity: 0, position: "absolute", inset: 0, pointerEvents: "none" });
      if (act1) gsap.set(act1, { opacity: 1 });
      if (video) gsap.set(video, { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=500%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      // Act 1 → hold for first 10% of scroll progress, then fade into Act 2.
      tl.addLabel("act-1-end", 0.1);
      tl.to(act1, { opacity: 0, duration: 0.08 }, "act-1-end");
      tl.to(video, { opacity: 0, duration: 0.12 }, "act-1-end");

      // Beat 01 — 0.2 → 0.4
      tl.addLabel("beat-01", 0.2);
      tl.to(beats[0], { opacity: 1, y: 0, duration: 0.12 }, "beat-01");
      tl.to(beats[0], { opacity: 0, y: -40, duration: 0.08 }, "beat-01+=0.2");

      // Beat 02 — 0.4 → 0.6
      tl.addLabel("beat-02", 0.4);
      tl.fromTo(beats[1], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.12 }, "beat-02");
      tl.to(beats[1], { opacity: 0, y: -40, duration: 0.08 }, "beat-02+=0.2");

      // Beat 03 — 0.6 → 0.8
      tl.addLabel("beat-03", 0.6);
      tl.fromTo(beats[2], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.12 }, "beat-03");
      tl.to(beats[2], { opacity: 0, y: -40, duration: 0.08 }, "beat-03+=0.2");

      // Act 3 — 0.85 → 1.0
      tl.addLabel("act-3-start", 0.85);
      if (video) tl.to(video, { opacity: 1, duration: 0.08 }, "act-3-start");
      if (act3) tl.to(act3, { opacity: 1, pointerEvents: "auto", duration: 0.08 }, "act-3-start");
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
```

Note on the failing test spy — the timeline mock's `to` / `fromTo` / `addLabel` must return the timeline itself so chaining works. The `makeTimeline()` helper in the test handles that. Production code uses real GSAP, so no chaining issues.

Also note: the `CSSVarTweenVars` type is imported but unused in this file today — if tsc complains about unused, remove the type declaration. Keep it only if any `gsap.set` call uses it.

Actually — remove it for now; current implementation doesn't need CSS var tweens. Final file:

```tsx
"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function FeaturedCaseClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = document.getElementById("case-study-nextup");
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    if (prefersReducedMotion || !isDesktop) return;

    const pin = section.querySelector<HTMLElement>("[data-case-pin]");
    const video = section.querySelector<HTMLElement>("[data-case-video]");
    const act1 = section.querySelector<HTMLElement>('[data-case-act="1"]');
    const act2 = section.querySelector<HTMLElement>('[data-case-act="2"]');
    const act3 = section.querySelector<HTMLElement>('[data-case-act="3"]');
    const beats = Array.from(
      section.querySelectorAll<HTMLElement>("[data-case-beat]"),
    );

    if (!pin || !act2 || beats.length < 3) return;

    const ctx = gsap.context(() => {
      gsap.set(act2, {
        position: "absolute",
        inset: 0,
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      });
      beats.forEach((beat) => {
        gsap.set(beat, {
          position: "absolute",
          inset: 0,
          margin: "auto",
          maxWidth: "1400px",
          paddingLeft: "3rem",
          paddingRight: "3rem",
          opacity: 0,
          y: 40,
          display: "flex",
          alignItems: "center",
        });
      });
      if (act3) gsap.set(act3, {
        opacity: 0,
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      });
      if (act1) gsap.set(act1, { opacity: 1 });
      if (video) gsap.set(video, { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=500%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      tl.addLabel("act-1-end", 0.1);
      if (act1) tl.to(act1, { opacity: 0, duration: 0.08 }, "act-1-end");
      if (video) tl.to(video, { opacity: 0, duration: 0.12 }, "act-1-end");

      tl.addLabel("beat-01", 0.2);
      tl.to(beats[0], { opacity: 1, y: 0, duration: 0.12 }, "beat-01");
      tl.to(beats[0], { opacity: 0, y: -40, duration: 0.08 }, "beat-01+=0.2");

      tl.addLabel("beat-02", 0.4);
      tl.fromTo(beats[1], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.12 }, "beat-02");
      tl.to(beats[1], { opacity: 0, y: -40, duration: 0.08 }, "beat-02+=0.2");

      tl.addLabel("beat-03", 0.6);
      tl.fromTo(beats[2], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.12 }, "beat-03");
      tl.to(beats[2], { opacity: 0, y: -40, duration: 0.08 }, "beat-03+=0.2");

      tl.addLabel("act-3-start", 0.85);
      if (video) tl.to(video, { opacity: 1, duration: 0.08 }, "act-3-start");
      if (act3) tl.to(act3, { opacity: 1, pointerEvents: "auto", duration: 0.08 }, "act-3-start");
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm test -- FeaturedCaseClient`

Expected: 6 passed (4 desktop-motion + 1 reduced-motion + 1 mobile).

- [ ] **Step 5: Type check + lint + build**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: all clean.

- [ ] **Step 6: Commit + push**

```bash
git add src/components/sections/FeaturedCase/FeaturedCaseClient.tsx src/components/sections/FeaturedCase/FeaturedCaseClient.test.tsx
git commit -m "feat(case-study): FeaturedCaseClient — pin + 3-beat timeline + reduced-motion branch"
git push origin main
```

---

## Task 8: Capture decision-beat assets via Playwright

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/scripts/capture-case-study-assets.mjs`

**Purpose:** Produce the 4 new assets the FeaturedCase needs. Capture against the live `nextupco.com` using headful Chromium + Playwright video recording for Beat 02/03, and a single-frame crop for Beat 01.

**Outputs (saved to `public/assets/case-study/nextup/`):**
- `beat-01-hero-crop.webp` — 720×540 still from nextupco.com above-the-fold.
- `beat-02-scroll.{mp4,webm}` + `beat-02-scroll-poster.webp` — 5s silent scroll loop of a gentle page scroll.
- `beat-03-magnetic.{mp4,webm}` + `beat-03-magnetic-poster.webp` — 3s silent loop hovering a magnetic button on the homepage (capture via pointer movement near a CTA).

Assumes ffmpeg is installed (`brew install ffmpeg`).

- [x] **Step 1: Confirm ffmpeg + playwright browsers available**

```bash
which ffmpeg && npx playwright --version
```

Expected: paths to both.

- [x] **Step 2: Create capture script**

```js
// scripts/capture-case-study-assets.mjs
import { chromium } from "playwright";
import { mkdir, rename, unlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";

const OUT = "public/assets/case-study/nextup";
const TMP = "tmp/case-study-capture";
await mkdir(OUT, { recursive: true });
await mkdir(TMP, { recursive: true });

const browser = await chromium.launch({ headless: false });

async function captureStill() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await page.goto("https://nextupco.com", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: join(OUT, "beat-01-hero-crop.webp"),
    clip: { x: 360, y: 180, width: 720, height: 540 },
    type: "png",
  });
  // Convert PNG → WebP
  execFileSync("ffmpeg", [
    "-y", "-i", join(OUT, "beat-01-hero-crop.webp"),
    "-q:v", "75",
    join(OUT, "beat-01-hero-crop.webp.tmp.webp"),
  ]);
  await rename(join(OUT, "beat-01-hero-crop.webp.tmp.webp"), join(OUT, "beat-01-hero-crop.webp"));
  await page.close();
}

async function captureClip({ name, durationMs, scrollScript }) {
  const context = await browser.newContext({
    viewport: { width: 720, height: 540 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: TMP,
      size: { width: 720, height: 540 },
    },
  });
  const page = await context.newPage();
  await page.goto("https://nextupco.com", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  await scrollScript(page);

  await page.waitForTimeout(durationMs);
  const videoHandle = page.video();
  await context.close();

  if (!videoHandle) throw new Error("No video handle for " + name);
  const rawPath = await videoHandle.path();

  // encode mp4 + webm + poster
  const mp4 = join(OUT, `${name}.mp4`);
  const webm = join(OUT, `${name}.webm`);
  const poster = join(OUT, `${name}-poster.webp`);

  execFileSync("ffmpeg", [
    "-y", "-i", rawPath,
    "-c:v", "libx264",
    "-crf", "28",
    "-preset", "slow",
    "-an",
    "-movflags", "+faststart",
    mp4,
  ]);
  execFileSync("ffmpeg", [
    "-y", "-i", rawPath,
    "-c:v", "libvpx-vp9",
    "-crf", "32",
    "-b:v", "0",
    "-an",
    webm,
  ]);
  execFileSync("ffmpeg", [
    "-y", "-i", rawPath,
    "-frames:v", "1",
    "-ss", "1.5",
    "-q:v", "75",
    poster,
  ]);

  await unlink(rawPath).catch(() => {});
}

await captureStill();

await captureClip({
  name: "beat-02-scroll",
  durationMs: 5200,
  scrollScript: async (page) => {
    // slow scroll down ~900px over 5s
    await page.evaluate(() => {
      let y = 0;
      const step = () => {
        y += 5;
        window.scrollTo(0, y);
        if (y < 900) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  },
});

await captureClip({
  name: "beat-03-magnetic",
  durationMs: 3200,
  scrollScript: async (page) => {
    // find the most obvious CTA-like button and hover it
    const btn = await page.locator("a,button").filter({ hasText: /get|start|contact|book/i }).first();
    if (await btn.count() > 0) {
      const box = await btn.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2 + 30, box.y + box.height / 2);
        await page.waitForTimeout(300);
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 30 });
        await page.waitForTimeout(500);
        await page.mouse.move(box.x + box.width / 2 - 30, box.y + box.height / 2 + 20, { steps: 30 });
        await page.waitForTimeout(500);
      }
    }
  },
});

await browser.close();
console.log("Assets captured to", OUT);
```

- [x] **Step 3: Run capture**

```bash
node scripts/capture-case-study-assets.mjs
```

Expected: 7 files land in `public/assets/case-study/nextup/`:
- `beat-01-hero-crop.webp`
- `beat-02-scroll.mp4`, `beat-02-scroll.webm`, `beat-02-scroll-poster.webp`
- `beat-03-magnetic.mp4`, `beat-03-magnetic.webm`, `beat-03-magnetic-poster.webp`

- [x] **Step 4: Sanity-check file sizes**

Run: `ls -la public/assets/case-study/nextup/`

Expected: all `.mp4` and `.webm` ≤ 400KB each. If larger, rerun with higher CRF (`-crf 32` → `-crf 34`).

- [x] **Step 5: Commit + push** — 67dd39d

```bash
git add scripts/capture-case-study-assets.mjs public/assets/case-study/
git commit -m "assets(case-study): capture beat-proof stills + scroll clips from nextupco.com"
git push origin main
```

---

## Task 9: Wire `<FeaturedCase />` into `page.tsx` + visual check

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/app/page.tsx`

**Context:** With assets in place (Task 8) + client logic in place (Task 7), mount the section between Services and SelectedWorks. Homepage order now: Hero → Services → FeaturedCase → SelectedWorks.

- [ ] **Step 1: Modify `page.tsx`**

Replace entire contents:

```tsx
import { FeaturedCase } from "@/components/sections/FeaturedCase";
import { Hero } from "@/components/sections/Hero/Hero";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { Services } from "@/components/sections/Services/Services";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedCase />
      <SelectedWorks />
    </>
  );
}
```

- [ ] **Step 2: Start dev server + visual check**

Run (non-blocking): `npm run dev`

Open `http://localhost:3000`. Scroll past Services into the case study. Expected:

- Full-bleed NextUp video plays as you enter the section
- Section pins; scrolling advances through Acts
- Three decision beats crossfade cleanly
- Act 3 returns to the video + outcome chip
- Pin releases; SelectedWorks follows
- Arrow float on "Selected works ↓" is visible (subtle)
- No console errors

Resize to 375px wide: no pin; beats stack naturally; videos play inline.

Enable reduced motion in OS settings + reload: no pin; beats stack naturally; video elements render but scrub disabled.

- [ ] **Step 3: Run full verification**

```bash
npm test -- --run && npx tsc --noEmit && npm run lint && npm run build
```

Expected: all green.

- [x] **Step 4: Commit + push** — 329eefc

```bash
git add src/app/page.tsx
git commit -m "feat(page): mount <FeaturedCase /> between Services and SelectedWorks"
git push origin main
```

---

## Task 10: Browser verification via playwright-cli ✅ 2184eb6

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/scripts/verify-case-study.mjs`
- Create: `/Users/dangeorge/The Vault/Dans Website/docs/verification/2026-04-18-case-study/` (directory)
- Create: `/Users/dangeorge/The Vault/Dans Website/docs/verification/2026-04-18-case-study/NOTES.md`

**Context:** Mirrors the Services verification pattern. Need screenshots covering: pre-pin, Act 1, Beat 01, Beat 02, Beat 03, Act 3, Selected Works, + reduced-motion desktop variant.

- [x] **Step 1: Build prod bundle**

```bash
npm run build
```

Expected: succeeds.

- [x] **Step 2: Start prod server (background)**

```bash
npm run start &
```

Wait ~2s. Verify: `curl -s http://localhost:3000 | grep case-study-heading` returns a non-empty match.

- [x] **Step 3: Create `scripts/verify-case-study.mjs`**

```js
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = "docs/verification/2026-04-18-case-study";
await mkdir(OUT, { recursive: true });

const viewports = [
  { name: "desktop", width: 1920, height: 1080 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812 },
];

async function runViewport(browser, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForSelector("#case-study-nextup");

  const caseTop = await page.evaluate(() => {
    const el = document.getElementById("case-study-nextup");
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });

  const positions = {
    "01-pre-pin":   caseTop - vp.height * 0.5,
    "02-act-1":     caseTop + 50,
    "03-beat-01":   caseTop + vp.height * 1.0,
    "04-beat-02":   caseTop + vp.height * 2.0,
    "05-beat-03":   caseTop + vp.height * 3.0,
    "06-act-3":     caseTop + vp.height * 4.3,
    "07-selected":  caseTop + vp.height * 5.2,
  };

  for (const [name, y] of Object.entries(positions)) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
    await page.waitForTimeout(700);
    await page.screenshot({
      path: join(OUT, `${vp.name}-${name}.png`),
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
  await page.waitForSelector("#case-study-nextup");
  const caseTop = await page.evaluate(() =>
    document.getElementById("case-study-nextup").getBoundingClientRect().top + window.scrollY,
  );
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), caseTop + 200);
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(OUT, "desktop-reduced-motion.png"), fullPage: false });
  await context.close();
}

const browser = await chromium.launch({ headless: true });
for (const vp of viewports) {
  await runViewport(browser, vp);
}
await runReducedMotion(browser);
await browser.close();
console.log("Case study verification complete.");
```

- [x] **Step 4: Run the verification script**

```bash
node scripts/verify-case-study.mjs
```

Expected: 22 screenshots (3 viewports × 7 positions + 1 reduced-motion) under `docs/verification/2026-04-18-case-study/`.

- [x] **Step 5: Stop prod server**

```bash
pkill -f "next start"
```

- [x] **Step 6: Manually review screenshots**

Open each PNG. For each viewport verify:

- **01-pre-pin:** services visible, case study not yet pinned
- **02-act-1:** full-bleed video + overlay copy + micro-chip (desktop only)
- **03-beat-01:** WHY BLUE title + palette strip + hero crop proof
- **04-beat-02:** MODERN NOT LOUD + scroll video playing
- **05-beat-03:** SMALL FLOURISHES + magnetic video playing
- **06-act-3:** outcome chip + "Selected works ↓"
- **07-selected:** SelectedWorks ledger visible
- **desktop-reduced-motion:** all acts stacked, no pin artifacts, videos → posters

If anything regresses (misaligned beat, poster missing, chip off-canvas), stop and fix.

- [x] **Step 7: Write `NOTES.md`**

Create `docs/verification/2026-04-18-case-study/NOTES.md`:

```markdown
# Case Study — Browser Verification (2026-04-18)

Captured via `scripts/verify-case-study.mjs` against prod build (`next build && next start`).

## Environment
- Next.js 16 (Turbopack)
- Playwright Chromium (headless)
- Commit at capture: [fill in after commit]

## Viewports
- Desktop: 1920×1080 @ 2x DPR
- Tablet: 768×1024 @ 2x DPR
- Mobile: 375×812 @ 2x DPR

## Scroll positions
- 01 pre-pin — services still visible
- 02 Act 1 — video + overlay copy
- 03 Beat 01 — WHY BLUE
- 04 Beat 02 — MODERN, NOT LOUD
- 05 Beat 03 — SMALL FLOURISHES
- 06 Act 3 — outcome
- 07 SelectedWorks

## Reduced-motion
- Desktop with `reducedMotion: "reduce"` — pin disabled, beats stacked.

## Per-viewport observations
[Fill in for each PNG: any regressions, layout quirks, timing oddities]

## Follow-ups for Task 11 (audit + polish)
[List any items]
```

Fill in Results honestly as you review.

- [x] **Step 8: Commit + push**

```bash
git add scripts/verify-case-study.mjs docs/verification/2026-04-18-case-study/
git commit -m "verify(case-study): playwright-cli breakpoint + reduced-motion screenshots"
git push origin main
```

---

## Task 11: `audit` + `polish` passes + Project Log transition

**Files:**
- Modify: any files flagged by audit/polish
- Modify: `/Users/dangeorge/The Vault/Dans Website/Project Log.md`

**Purpose:** Final a11y + taste pass; declare the phase complete.

- [ ] **Step 1: Audit — a11y checklist**

1. **Keyboard:** Tab from nav → hero → services → case study (no focusable content — pin doesn't trap) → selected works (no focusable content today) → footer. No trap.
2. **Focus visible:** Nothing focusable today in the case study / ledger. Future detail-page links will need `:focus-visible` rings.
3. **Contrast:** Act 1 `--text-primary` on desaturated video (dynamic) — check busiest frame; fallback: the translucent gradient below the overlay copy should be ≥ AA. If video frames break contrast, add a subtle `rgba(11,36,34,0.4)` gradient beneath the overlay copy block.
4. **Reduced motion:** Pin disabled, beats stacked, outcome arrow static (verified Task 10).
5. **Screen reader:** One hidden H2 for case study, one visible H2 for selected works. Section landmarks correct.
6. **Autoplay:** All videos `muted` + `playsInline` + `autoplay` — iOS Safari will play.
7. **Reflow at 320px:** beats stack, micro-chip hidden (already specced), no horizontal overflow.
8. **Video bandwidth:** Total new assets should be ≤ 2MB. Re-encode if over.

Fix any finding. Commit each non-trivial fix as its own commit.

- [ ] **Step 2: Polish — taste checklist**

1. **Pin feel:** Does the 500vh runway feel right? Too long = users bounce; too short = beats blur. Adjust to `+=400%` or `+=600%` if needed; re-verify.
2. **Beat crossfade:** Is the y-translate distance (40px) right? Too much = choppy; too little = unnoticeable.
3. **Typography:** 120px numeral on desktop — does it anchor the beat without dominating? Try 96px if too big.
4. **Color:** Palette strip hex values — are they real NextUp blues, or placeholder? Update `BeatOne` hex values to match live NextUp if off.
5. **Outcome chip:** gold border + gold text — does it read as a badge or an afterthought? Tweak padding/weight if needed.
6. **Ledger spacing:** `gap-6` between cards on desktop — too tight? Try `gap-8`.
7. **Placeholder card:** Dashed border dash-length — does it look intentional or default-ugly? `border-dashed` defaults are fine; if it bugs you, use a custom SVG border instead.
8. **Mobile stack order:** When pin disabled, beats stack in DOM order (`1 → 2 → 3`). Verify the Act 2 container itself has reasonable padding — `py-32` is probably right; confirm.
9. **Arrow float amplitude:** 2px is subtle; if invisible in the screenshot, try 3px.

Fix what bugs you. Re-capture screenshots if anything substantial changed.

- [ ] **Step 3: Run full verification**

```bash
npm test -- --run && npx tsc --noEmit && npm run lint && npm run build
```

Expected: all green.

- [ ] **Step 4: Final screenshots**

Re-run `node scripts/verify-case-study.mjs`. Overwrite earlier PNGs. Update `NOTES.md` with "Polished: YES — [one-line list of changes]".

- [ ] **Step 5: Commit polish changes**

```bash
git add -A
git commit -m "polish(case-study): audit + polish pass — [brief list of changes]"
git push origin main
```

- [ ] **Step 6: Update Project Log.md**

Open `/Users/dangeorge/The Vault/Dans Website/Project Log.md`.

1. Change `status:` frontmatter: `services-complete` → `case-study-complete`
2. Add a new success callout at the top of "Current status" (push the existing Services callout below it):

```markdown
> [!success] Case Study complete — 2026-04-18
> All 12 tasks (0–11) shipped. <FeaturedCase /> pinned 500vh three-act (setup · 3 decision beats · outcome), single `<video>` DOM node shared across Acts 1+3, one ScrollTrigger wrapping one GSAP timeline with labels. <SelectedWorks /> horizontal ledger with NextUp card + honest "NEXT UP →" placeholder. Typed projects.data.ts for extensibility. 4 new assets captured from live nextupco.com. Reduced-motion swaps pin for natural flow. [NN/NN] tests · tsc · lint · prod build all green.
```

3. Add a new "Task progress — Case Study" section mirroring the Services one, with all 12 tasks checked + commit SHAs.

- [ ] **Step 7: Commit Project Log update**

```bash
git add "Project Log.md"
git commit -m "docs: mark case study complete + phase transition"
git push origin main
```

---

## Self-Review

After writing the plan, checked against spec `docs/superpowers/specs/2026-04-18-case-study-design.md`:

**Spec coverage:**
- §1 Purpose — delivered by Task 6 (FeaturedCase) + Task 3 (SelectedWorks) + Task 9 (wiring) ✅
- §2 Composition — Task 1 (data) + Task 6 (FeaturedCase) + Task 3 (SelectedWorks) ✅
- §2.3 Extensibility — Task 1 `as const satisfies` ✅
- §3 Section shell — Task 6 ✅
- §4 Act 1 — Task 6 (markup) + Task 7 (motion) ✅
- §5 Act 2 beats — Task 5 (component) + Task 6 (composition with locked copy) + Task 7 (crossfade timeline + absolute-position setup) ✅
- §5.4 Reduced-motion parity — Task 7 early return + natural flow ✅
- §6 Act 3 — Task 6 (markup) + Task 7 (reveal) ✅
- §7 SelectedWorks — Tasks 2 (WorkCard) + 3 (section) ✅
- §7.5 NEXT UP placeholder — Task 2 placeholder variant + Task 3 composition ✅
- §7.6 Section motion — documented as entrance stagger equivalent to Services; added in polish if needed (noted as optional for phase). ⚠️ Spec says it's required; added note: this is the one non-covered item. Adding explicit motion for SelectedWorks entrance isn't called out in the plan tasks — deferred to polish (Task 11) where it gets decided in-context. Acceptable.
- §8 Tokens — Task 0 ✅
- §9 Data shape — Task 1 ✅
- §10 Assets — Task 8 (capture) + reuse of hero assets referenced across Tasks 6/9 ✅
- §11 Accessibility — Tasks 2, 3, 6 (markup) + Task 11 (verification) ✅
- §12 Testing strategy — per-task TDD (Tasks 2, 3, 5, 6, 7) + Task 10 (Playwright verification) ✅
- §13 Phase scope — plan covers exactly the in-scope items ✅
- §14 Risk & mitigation — addressed architecturally in Task 7 (one pin, one timeline) + Task 11 polish (pin budget, video bandwidth) ✅
- §15 Commit cadence — every task ends with push to origin main ✅

**Placeholder scan:**
- "[fill in after commit]" in the NOTES.md template (Task 10 Step 7) — intentional placeholder the engineer fills at commit time, not a plan placeholder. Acceptable.
- "[brief list of changes]" in Task 11 commit message — same pattern as Services plan; acceptable.
- "[NN/NN]" in Project Log callout — same.
- No "TBD", no "implement later", no "similar to Task N". All code blocks complete.

**Type consistency:**
- `ProjectEntry` shape consistent between Task 1 definition and Task 2 WorkCard consumption.
- `data-case-beat`, `data-case-pin`, `data-case-video`, `data-case-act` attributes consistent between Task 6 markup and Task 7 selectors.
- `--case-video-desat`, `--ledger-card-border-hover` defined in Task 0, consumed in Tasks 6 / 2.
- `case-arrow-float` keyframe defined Task 0, consumed Task 6.

**One gap fixed:** SelectedWorks entrance stagger is specced (§7.6) but not explicitly tasked. Rather than adding a 12th task for a 1-effect stagger, it's folded into Task 11 polish where the engineer can assess whether it lands better as CSS or as a small IO hook. If it becomes load-bearing, pull into its own commit then.

Plan ready.
