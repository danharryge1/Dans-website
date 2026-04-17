# Project: Dans website

## On session start — READ THESE FIRST
This build is staged across multiple sessions. Before doing anything, read in order:
1. **`Project Log.md`** (project root) — `status:` frontmatter and "Active phase" callout give you the current phase and the next concrete action. This is the source of truth for resume.
2. **`.impeccable.md`** (project root) — design context (brand personality, palette, type, anti-refs). Required by all design skills.
3. **`docs/superpowers/plans/`** — pick the plan matching the current phase; checkboxes show task-level progress with commit SHAs.
4. **`docs/superpowers/specs/`** — the spec underlying each plan.

**Workflow chain (per-phase):**
`brainstorming → writing-plans → subagent-driven-development → TDD build (taste-skill · impeccable · typeset · layout · stitch-skill active) → verification-before-completion → audit → polish`.

**Commit cadence:** one commit per task, pushed to `origin main` (`https://github.com/danharryge1/Dans-website.git`) immediately.

**Skill preference:** use the `impeccable` and `taste-skill` packs (shape, polish, typeset, layout, audit, stitch-skill, etc.) — **not** the default `frontend-design` skill. See memory `feedback_design_skills.md`.

**Verification tooling:** `playwright-cli` (Microsoft) is installed globally — drive real Chrome for responsive/scroll/click evidence. Commit screenshots to `docs/verification/<date>-<feature>/`.

**After every completed task:** update (a) the plan checkbox with the commit SHA, (b) `Project Log.md` status and task list, (c) the `dans_website_project.md` memory file if state changed. Compactions are frequent — durable state must stay current.

## Overview
This project is to create a super innovative, extraordinary website for my new premium website company. It is for Me Dan.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui + Aceternity UI
- **Animation:** GSAP with ScrollTrigger, Lenis for smooth scroll, Motion for React animations
- **Deployment:** Vercel via GitHub
- **Language:** TypeScript

## Design System
Refer to `DESIGN.md` for all design tokens including colours, typography, spacing, and component patterns. Never deviate from `DESIGN.md` without explicit instruction.

## Conventions
- Use Server Components by default. Only add `'use client'` when genuinely needed (interactivity, hooks, browser APIs).
- No inline styles. Use Tailwind utility classes or CSS variables defined in `DESIGN.md`.
- All images use `next/image` with proper width, height, and alt text.
- Use CSS variables for theme colours, not hardcoded hex values.
- Component files use `PascalCase`. Utility files use `camelCase`.
- One component per file.
- Keep components under 150 lines. Extract sub-components when larger.

## File Structure
```
src/
  app/           # Pages and layouts (App Router)
  components/    # Reusable UI components
    ui/          # shadcn/ui base components
    sections/    # Page sections (Hero, Features, etc.)
    layout/      # Nav, Footer, Container
  lib/           # Utilities, helpers, config
  styles/        # Global CSS, font imports
  assets/        # Static images, icons
```

## Commands
- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Type check:** `npx tsc --noEmit`

## Animation Guidelines
- Use GSAP + ScrollTrigger for scroll-linked animations.
- Use Lenis for smooth scrolling (initialise in root layout).
- Use Motion for React component animations (hover, enter/exit, layout).
- Every animation must have purpose. No gratuitous movement.
- Prefer ease: `'power2.out'` for natural feeling.
- Stagger delays between `0.05-0.15s` for sequential reveals.

## Brand Voice
Short and punchy, not overly long. Wants to stand out from other websites.

## Do NOT
- Do not use generic placeholder text like 'Lorem ipsum'.
- Do not add features not specified in the PRD.
- Do not change the colour scheme without instruction.
- Do not use inline styles or `!important`.
- Do not install packages without asking.

## Do
- Change the way you go about some of the scroll-linked animations and designs by looking at the skills under **Anti gravity skills**. There is a whole load you should quickly review to see what you should use.
