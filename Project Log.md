---
title: DanGeorge.studio — Project Log
tags:
  - project/dans-website
  - status/in-progress
status: building-layout-shell
started: 2026-04-16
target: 2026-04-23
repo: https://github.com/danharryge1/Dans-website
---

# DanGeorge.studio — Project Log

Live state of the build. Updated after every completed task so [[Dans Website/claude]] sessions can resume cleanly after compaction.

> [!info] Where to look for what
> - Design of record → [[2026-04-17-layout-shell-design]]
> - Implementation plan → [[2026-04-17-layout-shell]]
> - Visual system → [[design]]
> - Brand / voice → [[PRD]]
> - Project conventions → [[claude]]

## Current status

> [!todo] Active phase
> **`subagent-driven-development`** executing the layout-shell plan.
> Next concrete action: dispatch implementer subagent for **Task 0 — Vitest + RTL test infrastructure**.

## Workflow chain

`brainstorming → writing-plans → subagent-driven-development → TDD build (taste-skill · impeccable · typeset · layout · stitch-skill) → verification-before-completion → audit → polish`.

## Task progress — Layout Shell

Mirror of the plan's checkboxes. Source of truth is still [[2026-04-17-layout-shell]] — this is a glanceable summary.

- [ ] **Task 0** — Vitest + RTL test infrastructure
- [ ] **Task 1** — Install gsap / lenis / motion / three
- [ ] **Task 2** — Copy fonts to `public/fonts/`
- [ ] **Task 3** — Rewrite `globals.css` (tokens + `@font-face` + Tailwind theme)
- [ ] **Task 4** — Build `Container` component (TDD)
- [ ] **Task 5** — Build `Footer` component (TDD)
- [ ] **Task 6** — Build `Nav` component (TDD, client, scroll + mobile overlay)
- [ ] **Task 7** — Wire layout.tsx + page.tsx
- [ ] **Task 8** — Manual browser verification + `verification-before-completion`
- [ ] **Task 9** — `audit` + `polish` passes

## Locked-in decisions (layout shell)

> [!success] Approved 2026-04-17
> - Mobile nav → full-screen overlay (`#0B2422`, Comico 48px stacked, × to close)
> - Nav scroll behaviour → transparent until `scrollY > 100`, then backdrop-blur + `rgba(11,36,34,0.6)` fades in over 250ms
> - Container → `max-w-[1400px]`, gutters `px-6 md:px-10 lg:px-12`
> - Footer copy → `© {year} DanGeorge.studio. Every pixel considered.` (dynamic year)
> - Nav positioning → fixed

## Brand constants (do not drift)

| Token | Value |
| --- | --- |
| Primary teal | `#0D544C` |
| Deeper teal (recessed) | `#0B2422` |
| Warm off-white text | `#F5F5F0` |
| Accent pink-white | `#F5F0F4` |
| Grid line | `rgba(180, 220, 200, 0.15)` |
| Gold accent | `#C8A55C` |
| Headings font | Comico |
| Body font | Permanent Marker |

## Git state

- Local repo initialised on `main` at `~/The Vault/Dans Website/`
- Remote `origin` → `https://github.com/danharryge1/Dans-website.git`
- Initial commit `d1d3be7` pushed 2026-04-17 (scaffold + spec + plan)
- Author auto-configured as `Dan George <dangeorge@Dans-MacBook-Air.local>` — may want to change to `danharryge1@gmail.com` via repo-local `git config`
- Strategy: per-task commits pushed to `origin main` after each successful review

## Skills installed globally

At `~/.claude/skills/`:
- `superpowers` — brainstorming, writing-plans, subagent-driven-development, TDD, verification, audit
- `impeccable` — shape, polish, typeset, layout, audit, critique, distill, delight, harden, optimize, overdrive, bolder, quieter, clarify, colorize, adapt
- `taste-skill` — taste, soft, stitch, minimalist, brutalist, redesign, output
- `webgpu-threejs-tsl` — (deferred, not in use this phase)
- `obsidian-markdown` — installed 2026-04-17 to maintain this log

## Next phase after layout shell

Hero section — perspective grid background, Comico headline, CTA. Separate spec + plan. Will likely want `overdrive` + `animate` + possibly `webgpu-threejs-tsl`.
