# Project: Dans website

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
