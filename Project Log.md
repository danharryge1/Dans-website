---
title: DanGeorge.studio — Project Log
tags:
  - project/dans-website
  - status/in-progress
status: auditing-layout-shell
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
> Next concrete action: **Task 9 — `audit` + `polish` passes**.

> [!note] Tooling added 2026-04-17
> `playwright-cli` (Microsoft) installed globally + mirrored to `~/.claude/skills/playwright-cli/`. Source cloned into `Anti gravity Skills/Advanced_and_Agents/playwright-cli/`. Used for Task 8 breakpoint verification — drives a real Chrome at 1920/768/375, programmatic scroll, snapshot-based click refs. Screenshots committed at `docs/verification/2026-04-17-layout-shell/`.

## Workflow chain

`brainstorming → writing-plans → subagent-driven-development → TDD build (taste-skill · impeccable · typeset · layout · stitch-skill) → verification-before-completion → audit → polish`.

## Task progress — Layout Shell

Mirror of the plan's checkboxes. Source of truth is still [[2026-04-17-layout-shell]] — this is a glanceable summary.

- [x] **Task 0** — Vitest + RTL test infrastructure (commit `7c4ee61`)
- [x] **Task 1** — Install gsap / lenis / motion / three (commit `0dfc71d`)
- [x] **Task 2** — Copy fonts to `public/fonts/` (commit `68e68ae`)
- [x] **Task 3** — Rewrite `globals.css` (tokens + `@font-face` + Tailwind theme) (commit `357c837`)
- [x] **Task 4** — Build `Container` component (TDD) (commit `a2baa20`)
- [x] **Task 5** — Build `Footer` component (TDD) (commit `deba0e4`)
- [x] **Task 6** — Build `Nav` component (TDD, client, scroll + mobile overlay) (commit `edd6471`)
- [x] **Task 7** — Wire layout.tsx + page.tsx (commit `d342e7b`)
- [x] **Task 8** — Browser verification via playwright-cli + `verification-before-completion` (5 screenshots, 13/13 tests, tsc/lint/build clean)
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
