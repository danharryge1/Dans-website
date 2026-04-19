# Contact Section — Browser Verification Notes

**Date:** 2026-04-19
**Script:** `scripts/verify-contact.mjs`
**URL:** `http://localhost:3000` (dev server)

## Viewports

| Viewport | Size | DPR |
| --- | --- | --- |
| Desktop | 1920 x 1080 | 1x |
| Tablet | 768 x 1024 | 1x |
| Mobile | 375 x 812 | 2x |

## Captures (per viewport)

- **01-pre-reveal** — section just entering viewport; thread partially drawn; headline/paragraph entering reveal.
- **02-mid-reveal** — section centred; thread ~50% drawn; headline + paragraph fully revealed; form revealing.
- **03-post-reveal** — fully scrolled past; thread at full height; all content visible.

## Reduced motion

- **desktop-reduced-motion.png** — captured with Playwright's `reducedMotion: "reduce"` context. All content + thread in final state. No motion.

## Success state

- **desktop-04-success.png** — captured after a mocked successful submit (Playwright intercepts `/api/contact` and returns `{ ok: true }`). Form replaced by success block: "Got it." heading + "I'll write back within two days." body. Focus lands on the heading for screen readers.

## Findings

All eleven captures render cleanly. The gold thread sits in the left gutter at every viewport, matching the Process section gutter alignment (desktop ~x=450 in the 1920 frame where the section's content column begins, tablet ~x=60, mobile ~x=50 CSS px). The bookend rule sits above the headline. "TELL ME WHAT YOU WANT" renders in Comico at each breakpoint, with the wrap breaking after "YOU" on desktop and after "WHAT" on tablet/mobile. The paragraph "One person. A few projects at a time. You tell me what you're building. I come back with the shape of it." renders as two Marker lines on desktop and stacks as expected on narrower viewports. The form shows three inputs (Your Name, Your Email, Project Details) plus a SEND IT button on desktop in a right-hand column, and stacked below the paragraph on mobile.

The success-state capture confirms the form unmounts and the success block mounts: "GOT IT." heading + "I'll write back within two days." body replace the three inputs and the submit button. (Note: the initial success-state capture timed the screenshot during the interim "Sending" state because `waitForSelector("h3")` matched unrelated h3s elsewhere on the page; the script was fixed to wait specifically for `div[role="status"] h3` with text "Got it.", and the re-run captured the correct final state.)

The reduced-motion capture shows all Contact content rendered in final state with no fade-in residue and no thread-animation dot — exactly what the `prefers-reduced-motion: reduce` branch should produce.

No visual regressions. Ready for audit pass.

## Follow-up

None — ready for audit pass.
