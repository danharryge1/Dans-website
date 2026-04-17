# Layout Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the global chrome for DanGeorge.studio — fixed nav with scroll-aware backdrop-blur + mobile full-screen overlay, `max-w-[1400px]` container, thin copyright footer, and Comico/Permanent Marker fonts wired into Tailwind v4.

**Architecture:** Three small, single-responsibility client/server components under `src/components/layout/` — `Container.tsx` (server), `Footer.tsx` (server), `Nav.tsx` (client — owns scroll state + mobile overlay). Fonts declared via `@font-face` in `globals.css` per approved spec, exposed to Tailwind v4 through `@theme inline` font tokens. Color tokens live as CSS custom properties in `:root`.

**Tech Stack:** Next.js 16.2 (App Router, `src/` + `@/*` alias) · React 19.2 · Tailwind v4 · TypeScript · Vitest + React Testing Library for TDD · GSAP + Lenis + Motion + Three (installed here, wired in later phases).

**Spec:** [docs/superpowers/specs/2026-04-17-layout-shell-design.md](../specs/2026-04-17-layout-shell-design.md)

**Skills active during build:** `taste-skill` (visual craft) · `impeccable` (design discipline) · `typeset` (font work in Tasks 2–3) · `layout` (Task 4 Container) · `stitch-skill` (Task 6 Nav polish) · `TDD` (all component tasks).

---

## File Map

**Create:**
- `public/fonts/Comico-Regular.woff2`
- `public/fonts/Comico-Regular.woff`
- `public/fonts/PermanentMarker-Regular.ttf`
- `vitest.config.ts` — Vitest + React plugin + jsdom
- `src/test-setup.ts` — RTL matchers
- `src/components/layout/Container.tsx` — presentational wrapper (server component)
- `src/components/layout/Container.test.tsx`
- `src/components/layout/Footer.tsx` — thin bordered copyright (server component, reads `new Date().getFullYear()`)
- `src/components/layout/Footer.test.tsx`
- `src/components/layout/Nav.tsx` — client component, owns scroll state + mobile overlay toggle
- `src/components/layout/Nav.test.tsx`

**Modify:**
- `package.json` — add deps + `test` script
- `src/app/globals.css` — full rewrite: @font-face blocks, full token set in `:root`, Tailwind v4 `@theme inline` bindings, body defaults
- `src/app/layout.tsx` — strip Geist fonts, add `<Nav />` before `{children}` and `<Footer />` after, set lang + default body font class
- `src/app/page.tsx` — minimal placeholder so dev-server renders

---

## Task 0: Test Infrastructure (Vitest + RTL) ✅ done (commit 7c4ee61)

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/package.json`
- Create: `/Users/dangeorge/The Vault/Dans Website/vitest.config.ts`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/test-setup.ts`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/sanity.test.ts`

- [ ] **Step 1: Install test deps**

Run (from project root):

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/dom @testing-library/user-event jsdom
```

Expected: installs complete with no ERR lines. `package.json` devDependencies gains all 7 packages.

- [ ] **Step 2: Add `test` script to `package.json`**

Edit `package.json` — inside `"scripts"`, after `"lint": "eslint"`, add:

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

(don't forget the trailing comma on the `"lint"` line)

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    css: true,
  },
});
```

- [ ] **Step 4: Create `src/test-setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Write sanity test at `src/sanity.test.ts`**

```ts
import { describe, expect, it } from "vitest";

describe("sanity", () => {
  it("runs a trivial assertion", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run tests**

Run: `npm test`

Expected: `1 passed` in the output, exit code 0.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/test-setup.ts src/sanity.test.ts
git commit -m "chore: add vitest + RTL test infrastructure"
```

(If `git init` has not been run yet, run `git init && git add -A && git commit -m "chore: initial scaffold"` first, then do the commit above as a follow-up.)

---

## Task 1: Install Runtime Build Packages ✅ done (commit 0dfc71d)

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/package.json`

- [ ] **Step 1: Install GSAP, Lenis, Motion, Three**

Run:

```bash
npm install gsap lenis motion three && npm install -D @types/three
```

Expected: all 4 runtime deps + `@types/three` in `package.json`. No errors.

- [ ] **Step 2: Verify typecheck still passes**

Run: `npx tsc --noEmit`

Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install gsap, lenis, motion, three for upcoming scroll work"
```

---

## Task 2: Copy Font Files to `public/fonts/` ✅ done (commit 68e68ae)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/public/fonts/Comico-Regular.woff2`
- Create: `/Users/dangeorge/The Vault/Dans Website/public/fonts/Comico-Regular.woff`
- Create: `/Users/dangeorge/The Vault/Dans Website/public/fonts/PermanentMarker-Regular.ttf`

- [ ] **Step 1: Create `public/fonts/` and copy files**

Run (from project root):

```bash
mkdir -p public/fonts && \
cp "fonts/Comico_Complete/Fonts/WEB/fonts/Comico-Regular.woff2" public/fonts/ && \
cp "fonts/Comico_Complete/Fonts/WEB/fonts/Comico-Regular.woff" public/fonts/ && \
cp "fonts/Permanent_Marker/PermanentMarker-Regular.ttf" public/fonts/
```

- [ ] **Step 2: Verify files present**

Run: `ls public/fonts/`

Expected output (3 files):

```
Comico-Regular.woff
Comico-Regular.woff2
PermanentMarker-Regular.ttf
```

- [ ] **Step 3: Commit**

```bash
git add public/fonts/
git commit -m "chore: copy Comico + Permanent Marker font files into public/fonts/"
```

---

## Task 3: Rewrite `globals.css` — Tokens + `@font-face` + Tailwind v4 Theme

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/app/globals.css` (full rewrite)

- [ ] **Step 1: Replace `src/app/globals.css` with the full token + font sheet**

```css
@import "tailwindcss";

/* ---------- FONTS ---------- */
@font-face {
  font-family: "Comico";
  src: url("/fonts/Comico-Regular.woff2") format("woff2"),
       url("/fonts/Comico-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Permanent Marker";
  src: url("/fonts/PermanentMarker-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* ---------- DESIGN TOKENS ---------- */
:root {
  /* surfaces */
  --bg-primary: #0D544C;
  --bg-darker: #0B2422;
  --bg-card: rgba(11, 36, 34, 0.85);
  --bg-card-border: rgba(140, 200, 165, 0.35);

  /* text */
  --text-primary: #F5F5F0;
  --text-secondary: #A5B9AD;
  --text-accent: #F5F0F4;

  /* grid */
  --grid-line: rgba(180, 220, 200, 0.15);
  --grid-glow: rgba(180, 240, 200, 0.10);

  /* accents + inputs */
  --gold-accent: #C8A55C;
  --border-input: #F5F5F0;
  --btn-primary-border: #F5F5F0;

  /* font families */
  --font-comico: "Comico", cursive;
  --font-marker: "Permanent Marker", cursive;
}

/* ---------- TAILWIND v4 THEME BINDINGS ---------- */
@theme inline {
  --color-bg: var(--bg-primary);
  --color-bg-darker: var(--bg-darker);
  --color-text: var(--text-primary);
  --color-text-muted: var(--text-secondary);
  --color-text-accent: var(--text-accent);
  --color-grid-line: var(--grid-line);
  --color-gold: var(--gold-accent);
  --font-display: var(--font-comico);
  --font-sans: var(--font-marker);
}

/* ---------- BASE ---------- */
html, body { height: 100%; }

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-marker);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 2: Run dev server and eyeball it**

Run (in a separate terminal or background): `npm run dev`

Open `http://localhost:3000`. Expected: page background is teal `#0D544C`, default text colour is warm off-white `#F5F5F0`. Default text is Permanent Marker (will look sketchy/marker — that is correct).

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(style): add design tokens, @font-face declarations, Tailwind v4 theme bindings"
```

---

## Task 4: Build `Container` Component (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/layout/Container.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/layout/Container.test.tsx`

**Purpose:** Centred 1400px-max wrapper with responsive gutters. Server component (no state).

- [ ] **Step 1: Write failing test at `src/components/layout/Container.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./Container";

describe("<Container />", () => {
  it("renders children", () => {
    render(<Container>hello</Container>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("applies max-width and gutter classes to the wrapper", () => {
    const { container } = render(<Container>x</Container>);
    const wrapper = container.firstElementChild!;
    expect(wrapper.className).toContain("max-w-[1400px]");
    expect(wrapper.className).toContain("mx-auto");
    expect(wrapper.className).toContain("px-6");
    expect(wrapper.className).toContain("md:px-10");
    expect(wrapper.className).toContain("lg:px-12");
  });

  it("passes through a custom className", () => {
    const { container } = render(<Container className="py-10">x</Container>);
    expect(container.firstElementChild!.className).toContain("py-10");
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test -- Container`

Expected: FAIL, with error about `Container` not being exported or module not found.

- [ ] **Step 3: Implement `src/components/layout/Container.tsx`**

```tsx
import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main";
};

export function Container({ children, className = "", as: Tag = "div" }: ContainerProps) {
  return (
    <Tag className={`max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 ${className}`.trim()}>
      {children}
    </Tag>
  );
}
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm test -- Container`

Expected: `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Container.tsx src/components/layout/Container.test.tsx
git commit -m "feat(layout): add Container component with 1400px max-width + responsive gutters"
```

---

## Task 5: Build `Footer` Component (TDD)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/layout/Footer.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/layout/Footer.test.tsx`

**Purpose:** Thin 1px-top-border footer, centred copyright in 12px Permanent Marker with dynamic year. Server component.

- [ ] **Step 1: Write failing test at `src/components/layout/Footer.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

describe("<Footer />", () => {
  it("renders the copyright with the current year", () => {
    const year = new Date().getFullYear();
    render(<Footer />);
    expect(
      screen.getByText(`© ${year} DanGeorge.studio. Every pixel considered.`),
    ).toBeInTheDocument();
  });

  it("is a <footer> landmark", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("uses the grid-line token for its top border", () => {
    const { container } = render(<Footer />);
    const el = container.querySelector("footer")!;
    // border colour is applied via inline style referencing the CSS var
    expect(el.getAttribute("style") ?? "").toContain("--grid-line");
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test -- Footer`

Expected: FAIL — `Footer` not found.

- [ ] **Step 3: Implement `src/components/layout/Footer.tsx`**

```tsx
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="border-t py-4 text-center"
      style={{ borderColor: "var(--grid-line)" }}
    >
      <p
        className="text-[12px] uppercase tracking-[0.05em]"
        style={{ fontFamily: "var(--font-marker)", color: "var(--text-secondary)" }}
      >
        © {year} DanGeorge.studio. Every pixel considered.
      </p>
    </footer>
  );
}
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm test -- Footer`

Expected: `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.tsx src/components/layout/Footer.test.tsx
git commit -m "feat(layout): add Footer with dynamic year copyright"
```

---

## Task 6: Build `Nav` Component (TDD, Client)

**Files:**
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/layout/Nav.tsx`
- Create: `/Users/dangeorge/The Vault/Dans Website/src/components/layout/Nav.test.tsx`

**Purpose:** Fixed-top centred nav with 4 links. Transparent at `scrollY <= 100`, applies backdrop-blur + dark teal overlay after. Mobile (<768px): hamburger button opens a full-screen `#0B2422` overlay with 4 stacked links in Comico 48px.

Nav is a single file but internally composed of three concerns. Sub-steps build each in TDD order: static structure → mobile overlay state → scroll state.

### 6A. Static structure

- [ ] **Step 1: Write failing test — nav renders 4 named links**

Append to `src/components/layout/Nav.test.tsx` (create the file):

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Nav } from "./Nav";

describe("<Nav /> — links", () => {
  it("renders 4 named links", () => {
    render(<Nav />);
    ["PORTFOLIO", "SERVICES", "ABOUT", "CONTACT"].forEach((label) => {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    });
  });

  it("renders as a <nav> landmark positioned fixed to top", () => {
    const { container } = render(<Nav />);
    const nav = container.querySelector("nav")!;
    expect(nav.className).toContain("fixed");
    expect(nav.className).toContain("top-0");
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test -- Nav`

Expected: FAIL — `Nav` not found.

- [ ] **Step 3: Implement minimal `src/components/layout/Nav.tsx`**

```tsx
"use client";

const LINKS = [
  { label: "PORTFOLIO", href: "#portfolio" },
  { label: "SERVICES", href: "#services" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
] as const;

export function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 py-6">
      <ul className="hidden md:flex justify-center gap-10 text-[14px] uppercase tracking-[0.05em]"
          style={{ fontFamily: "var(--font-marker)" }}>
        {LINKS.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="transition-colors duration-200 ease-out"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm test -- Nav`

Expected: `2 passed`.

### 6B. Mobile overlay

- [ ] **Step 5: Add failing tests for hamburger + overlay**

Append these `describe` blocks into `src/components/layout/Nav.test.tsx`:

```tsx
describe("<Nav /> — mobile overlay", () => {
  it("shows a hamburger button on mobile that opens the overlay", () => {
    render(<Nav />);
    const btn = screen.getByRole("button", { name: /open menu/i });
    expect(btn).toBeInTheDocument();
    // overlay starts closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(btn);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    // 4 links rendered again inside the overlay
    expect(dialog.querySelectorAll("a")).toHaveLength(4);
  });

  it("close button inside the overlay dismisses it", () => {
    render(<Nav />);
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    fireEvent.click(screen.getByRole("button", { name: /close menu/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run to confirm failure**

Run: `npm test -- Nav`

Expected: FAIL — hamburger button not found.

- [ ] **Step 7: Extend `Nav.tsx` with overlay state**

Replace the entire file with:

```tsx
"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { label: "PORTFOLIO", href: "#portfolio" },
  { label: "SERVICES", href: "#services" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 py-6">
        <ul
          className="hidden md:flex justify-center gap-10 text-[14px] uppercase tracking-[0.05em]"
          style={{ fontFamily: "var(--font-marker)" }}
        >
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="transition-colors duration-200 ease-out"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Open menu"
          className="md:hidden absolute right-6 top-1/2 -translate-y-1/2 text-2xl"
          style={{ color: "var(--text-primary)" }}
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </nav>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-10 transition-opacity duration-300"
          style={{ backgroundColor: "var(--bg-darker)" }}
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute right-6 top-6 text-3xl"
            style={{ color: "var(--text-primary)" }}
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[48px] leading-none"
              style={{ fontFamily: "var(--font-comico)", color: "var(--text-primary)" }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 8: Run to confirm pass**

Run: `npm test -- Nav`

Expected: all (currently 4) tests pass.

### 6C. Scroll state (backdrop-blur past 100px)

- [ ] **Step 9: Add failing test for scroll-driven class**

Append to `src/components/layout/Nav.test.tsx`:

```tsx
describe("<Nav /> — scroll state", () => {
  const originalScrollY = Object.getOwnPropertyDescriptor(window, "scrollY");

  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
  });

  afterEach(() => {
    if (originalScrollY) Object.defineProperty(window, "scrollY", originalScrollY);
  });

  it("starts without the scrolled class", () => {
    const { container } = render(<Nav />);
    expect(container.querySelector("nav")!.getAttribute("data-scrolled")).toBe("false");
  });

  it("applies data-scrolled=\"true\" once scrollY > 100", () => {
    const { container } = render(<Nav />);
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 150, configurable: true, writable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(container.querySelector("nav")!.getAttribute("data-scrolled")).toBe("true");
  });
});
```

- [ ] **Step 10: Run to confirm failure**

Run: `npm test -- Nav`

Expected: FAIL — `data-scrolled` attribute not present.

- [ ] **Step 11: Add scroll listener + data-attribute + blur styles to `Nav.tsx`**

Replace the `<nav>` opening tag and add state + effect. Full updated file:

```tsx
"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { label: "PORTFOLIO", href: "#portfolio" },
  { label: "SERVICES", href: "#services" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <nav
        data-scrolled={scrolled ? "true" : "false"}
        className="fixed top-0 inset-x-0 z-50 py-6 transition-[background-color,backdrop-filter] duration-[250ms] ease-out"
        style={{
          backgroundColor: scrolled ? "rgba(11,36,34,0.6)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <ul
          className="hidden md:flex justify-center gap-10 text-[14px] uppercase tracking-[0.05em]"
          style={{ fontFamily: "var(--font-marker)" }}
        >
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="transition-colors duration-200 ease-out"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Open menu"
          className="md:hidden absolute right-6 top-1/2 -translate-y-1/2 text-2xl"
          style={{ color: "var(--text-primary)" }}
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </nav>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-10 transition-opacity duration-300"
          style={{ backgroundColor: "var(--bg-darker)" }}
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute right-6 top-6 text-3xl"
            style={{ color: "var(--text-primary)" }}
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[48px] leading-none"
              style={{ fontFamily: "var(--font-comico)", color: "var(--text-primary)" }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 12: Run to confirm all Nav tests pass**

Run: `npm test -- Nav`

Expected: 6 tests passing.

- [ ] **Step 13: Commit**

```bash
git add src/components/layout/Nav.tsx src/components/layout/Nav.test.tsx
git commit -m "feat(layout): add Nav with scroll-aware backdrop-blur + mobile overlay"
```

---

## Task 7: Wire `Nav` + `Footer` + `Container` Into Root Layout

**Files:**
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/app/layout.tsx` (full rewrite)
- Modify: `/Users/dangeorge/The Vault/Dans Website/src/app/page.tsx` (minimal placeholder so the shell is visible)

- [ ] **Step 1: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "DanGeorge.studio",
  description: "Premium freelance web development — every pixel considered.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Replace `src/app/page.tsx` with a minimal placeholder**

```tsx
import { Container } from "@/components/layout/Container";

export default function Home() {
  return (
    <Container className="py-40">
      <h1
        className="text-[64px] leading-none"
        style={{ fontFamily: "var(--font-comico)", color: "var(--text-primary)" }}
      >
        DanGeorge.studio
      </h1>
      <p className="mt-6" style={{ color: "var(--text-secondary)" }}>
        Layout shell wired. Hero and subsequent sections land in later phases.
      </p>
      {/* filler so we can scroll past 100px and exercise the Nav state */}
      <div style={{ height: "150vh" }} aria-hidden />
    </Container>
  );
}
```

- [ ] **Step 3: Typecheck + tests still pass**

Run: `npx tsc --noEmit && npm test`

Expected: no TS output (success); all vitest suites green.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx
git commit -m "feat(layout): wire Nav + Footer + Container into root layout"
```

---

## Task 8: Manual Browser Verification

**Files:** none — visual check only.

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

Open `http://localhost:3000`.

- [ ] **Step 2: Desktop (≥1024px)**

Checklist — each must be true:
- Background is teal `#0D544C`
- Heading "DanGeorge.studio" renders in Comico (sketchy hand-drawn look)
- Subtitle renders in Permanent Marker (marker look)
- Nav is at the top, centred, 4 uppercase links
- At top of page the nav is fully transparent (you can see teal bg through it)
- Scroll down ~200px — backdrop-blur + dark teal overlay fades in on the nav over ~250ms
- Scroll back to top — blur fades out
- Hover a nav link — colour transitions from muted `#A5B9AD` to accent `#F5F0F4` in ~200ms
- Footer at bottom, thin top border, 12px centred Permanent Marker with current year

- [ ] **Step 3: Tablet (768–1023px)**

Resize DevTools to width 900. Same checks as desktop — desktop nav links still visible; footer centred; container padding increases.

- [ ] **Step 4: Mobile (<768px)**

Resize DevTools to width 375.
- Desktop nav links hide; hamburger `☰` visible top right
- Tap hamburger → full-screen overlay fades in over 300ms, background `#0B2422`, 4 links stacked centred in Comico 48px, `×` top right
- Body scroll is locked while overlay is open
- Tap a link or `×` — overlay closes, body scroll unlocks

- [ ] **Step 5: Invoke `verification-before-completion` skill**

Run through its checklist against this task. Fix anything it flags before proceeding.

- [ ] **Step 6: Commit only if step 5 produced fixes**

```bash
git add -A
git commit -m "fix(layout): address verification-before-completion findings"
```

---

## Task 9: `audit` + `polish` Passes

**Files:** whatever those skills suggest modifying.

- [ ] **Step 1: Invoke `audit` skill** on the layout shell. It reviews design discipline, a11y, rhythm, consistency. Record findings.

- [ ] **Step 2: Apply any P0/P1 fixes surfaced by audit.** Run `npm test && npx tsc --noEmit` after each fix.

- [ ] **Step 3: Invoke `polish` skill** to refine micro-interactions (hover, focus rings, transition curves). Apply small refinements.

- [ ] **Step 4: Final check**

Run:

```bash
npm test && npx tsc --noEmit && npm run lint
```

Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "polish(layout): audit + polish pass refinements"
```

---

## Done criteria

- All tasks checked off
- `npm test` — all suites green
- `npx tsc --noEmit` — no errors
- `npm run lint` — no errors
- Manual browser pass at desktop / tablet / mobile widths per Task 8
- Commits landed for each task

Next phase after this plan: hero section (perspective grid + headline + CTA) — separate spec + plan.
