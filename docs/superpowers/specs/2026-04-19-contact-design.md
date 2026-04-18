# Contact Section Design (DanGeorge.studio §2.7)

**Goal:** Ship the final homepage section — the closer after Process. A working first-person inquiry form that accepts submissions via Resend, anchored by a gold thread drawing down the left gutter so the motif carries through from Process into Contact as one continuous visual spine. Copy leans into the "one person, few projects at a time" honesty posture rather than faking the voice of a larger agency.

**Position in page:** `Hero → Services → FeaturedCase → SelectedWorks → Philosophy → Process → Contact`. Last live section before the footer. Inherits the teal primary canvas (`var(--bg-primary)` = `#0D544C`) from Process so the two threads visually join.

**Brand constants:**
- Palette: deep teal `#0D544C` (primary), deeper teal `#0B2422` (recessed), warm off-white `#F5F5F0` (text), gold accent `#C8A55C`
- Type: Comico headlines, Permanent Marker body
- Motion: GSAP + ScrollTrigger + Motion + Lenis + Three already app-wide
- Copy rule: no em dashes (U+2014), en dashes (U+2013), or hyphens (U+002D) in any user-facing string. Enforced by tests.
- Voice: cinematic, crafted, opinionated, first-person

---

## 1. Architecture

**File layout** (mirrors Services / Process / Philosophy patterns):

```
src/components/sections/Contact/
  Contact.tsx              Server Component. Section shell, headline, left column, <ContactForm />,
                           <ContactThread />, <ContactClient /> mount.
  ContactForm.tsx          'use client'. The form. Handles submit via useActionState.
                           Pending / success / error state. Honeypot.
  ContactThread.tsx        Server Component. Absolute-positioned gold thread overlay.
                           Single 1.5px line, no dots.
  ContactClient.tsx        'use client'. GSAP + ScrollTrigger. Thread scrub + headline /
                           paragraph / field reveal triggers. Returns null.
  contact.data.ts          Typed content: headline, paragraph, field labels + placeholders,
                           submit labels (idle / pending), success copy, error copy.
  index.ts                 Re-exports Contact.
  contact.data.test.ts
  ContactForm.test.tsx
  ContactThread.test.tsx
  Contact.test.tsx
  ContactClient.test.tsx

src/app/api/contact/route.ts   POST handler. Zod validates, honeypot check, Resend send.
src/app/api/contact/route.test.ts

src/lib/contact-schema.ts      Zod schema shared by client + server.
src/lib/contact-schema.test.ts
```

**Modify:**
- `src/app/page.tsx` — mount `<Contact />` after `<Process />`.
- `src/app/globals.css` — append Contact reduced-motion guard block.
- `.env.local.example` — document `RESEND_API_KEY`.

**Backend:**
- Resend via the `resend` Node SDK. One env var, `RESEND_API_KEY`.
- Recipient hardcoded: `danharryge@gmail.com`. Single operator, single inbox — env var for the destination is overkill in v1.
- Route handler at `POST /api/contact`. Validates with the shared Zod schema. If the honeypot field (`website`) is non-empty, returns 200 OK without calling Resend — silent drop. Otherwise calls `resend.emails.send()` with the inquiry as `Reply-To: {visitor email}` and subject `New inquiry from {name}`.
- No database, no rate limiting in v1. Honeypot + Vercel's per-function invocation ceiling + Resend's own abuse controls cover the first-cut threat surface. If actual bot traffic surfaces in logs, add `@upstash/ratelimit` later.

**Client contract:**
- Form uses React 19 `useActionState` + a server action wrapper that calls `/api/contact`. `useFormStatus` drives the pending state on the submit button.
- Server action returns `{ ok: true } | { ok: false, errors: Record<string, string>, networkError?: boolean }`.
- On `ok: true`, the form unmounts and a success block mounts in its place. Focus moves programmatically to the success `<h3>` (`tabIndex="-1"` + `.focus()`) so screen readers announce.
- On `ok: false` with errors, the form stays mounted with errors wired into each field via `aria-describedby`, first failing field gets focus.
- On `ok: false` with `networkError: true`, a single error row appears above the submit button with the mailto fallback, button re-enables.

---

## 2. Copy (locked)

All strings here are final. All dash-free, all ASCII straight quotes only, all first-person.

**Headline:** `TELL ME WHAT YOU WANT`

**Left-column paragraph** (two lines, Permanent Marker):
```
One person. A few projects at a time.
You tell me what you're building. I come back with the shape of it.
```

The second sentence is a deliberate echo of Process Phase 01's body copy. Rewards attentive readers; reads confident either way.

**Field labels / placeholders** (label visually hidden, placeholder matches label):
- `Your Name`
- `Your Email`
- `Project Details`

**Submit button:**
- Idle: `SEND IT`
- Pending: `SENDING`

**Success block** (replaces form on `ok: true`):
```
Got it. I'll write back within two days.
```

**Error states:**

Per-field validation errors (inline under each field):
- Empty name: `I'll need a name.`
- Empty / invalid email: `That email looks wrong.`
- Message below minimum: `Say a bit more.`
- Any maximum exceeded: `Tighten it up.`

Network / server failure (inline row above the submit button):
```
Something went sideways. Try again, or email danharryge@gmail.com directly.
```
The email in that string is a real `mailto:` link.

---

## 3. Layout + Visual

**Section shell** (matches Process exactly so the thread-echo reads continuous):
- Background: `var(--bg-primary)` (#0D544C)
- Padding: `py-32 md:py-40`
- Outer wrapper: `max-w-[1400px]` with `px-6 md:px-10 lg:px-12`
- Inner wrapper: `relative mx-auto max-w-[1100px]`
- Top bookend rule: gold, opacity 0.35, 1px, full width — same treatment that opens Process
- No 2D grid overlay. Teal stays flat

**Headline** (`TELL ME WHAT YOU WANT`):
- Comico, left-aligned
- Responsive type scale: `text-[40px] md:text-[72px] lg:text-[96px]`
- `leading-[0.9] tracking-[-0.02em]`
- Color: `var(--text-primary)`
- Sits below the bookend rule, above the two-column grid
- `id="contact-heading"` to anchor `aria-labelledby` on the `<section>`

**Two-column grid** (below headline):
- Mobile + tablet (default + md): stacked, single column. Paragraph above, form below. Vertical gap `gap-16`
- Desktop (lg+): `grid-cols-[1fr_1fr]` with `gap-20`
- Stacking through md so the form never gets squeezed below ~400px

**Left column** — just the paragraph:
- Permanent Marker
- `text-[18px] md:text-[20px] lg:text-[22px]`
- `max-w-[44ch]`
- `leading-[1.55] tracking-[0.01em]`
- `color: var(--text-primary)`
- No sub-heading, no bullet list, no annotation

**Right column — form:**

Wrapper: `<form className="flex flex-col gap-4">`, `noValidate` (we own validation).

Each field is a `div.flex.flex-col.gap-2`:
- `<label className="sr-only" htmlFor={id}>{label}</label>`
- `<input id={id} name={name} placeholder={label} />` or `<textarea />`

Text input + textarea shared classes:
- `w-full rounded-xl border-2 bg-transparent px-4 py-3 text-[16px] transition-colors`
- Border color default: `var(--border-input)` (`#F5F5F0`)
- Text color: `var(--text-primary)`
- Placeholder color: `var(--text-secondary)`
- Focus: border `var(--gold-accent)`, `outline-none ring-2 ring-[var(--gold-accent)]/40`
- `aria-invalid` when error, border shifts to error color `#E8A098`
- `aria-describedby={errorId}` when error

Textarea: `min-h-[120px] resize-y`.

Inline error below each field (when present):
- `<p id={errorId} role="alert" className="text-[14px] text-[#E8A098] font-[var(--font-marker)]">`
- Margin-top `mt-1`

Honeypot (`<input name="website">`):
- Wrapper: `absolute -left-[9999px] w-px h-px overflow-hidden`
- `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden="true"`

Network-error row (above submit button, when present):
- `<p role="alert" className="text-[14px] text-[#E8A098]">` with the error string
- The email is a real `<a href="mailto:danharryge@gmail.com" className="underline">`

Submit button:
- `w-full rounded-xl border-2 border-[var(--border-input)] px-6 py-4`
- `font-[var(--font-marker)] uppercase tracking-[0.08em] text-[16px]`
- Default: transparent bg, text `var(--text-primary)`
- Hover (not disabled): bg `var(--gold-accent)`, text `var(--bg-primary)` — gold fill, not cream. Ties into the thread motif
- Focus: `outline-none ring-2 ring-[var(--gold-accent)]/60`
- Disabled during pending: `opacity-50 cursor-not-allowed`, hover ignored
- `transition-colors duration-200`

Success block (replaces the form on `ok: true`, sits in the same grid cell so the thread doesn't jump):
- `<div role="status" aria-live="polite">`
- `<h3 tabIndex={-1} className="text-[28px] md:text-[32px] lg:text-[36px] font-[var(--font-comico)] tracking-[-0.01em] leading-[1.1]">Got it.</h3>`
- `<p className="text-[18px] md:text-[20px] mt-4 font-[var(--font-marker)]">I'll write back within two days.</p>`
- Minimum height matches a typical filled form so vertical layout stays stable

**Thread** (left gutter):
- `<ContactThread />` is an absolute overlay inside the inner wrapper
- `pointer-events-none absolute top-0 bottom-0 left-[22px] md:left-[28px] lg:left-[40px]` — identical x-positioning to Process, so the two threads sit on the same visual column
- One 1.5px line, `bg-[var(--gold-accent)]`, `opacity-0.9`, `origin-top`, initial `transform: scaleY(0)`
- No dots. Process's dots marked phases; Contact has nothing to mark. The line alone is the continuation
- `aria-hidden="true"`

---

## 4. Form behaviour

**Shared Zod schema** (`src/lib/contact-schema.ts`):

```ts
export const contactInputSchema = z.object({
  name: z.string().trim().min(1, "I'll need a name.").max(80, "Tighten it up."),
  email: z
    .string()
    .trim()
    .max(120, "Tighten it up.")
    .email("That email looks wrong."),
  message: z
    .string()
    .trim()
    .min(15, "Say a bit more.")
    .max(2000, "Tighten it up."),
  website: z.string().max(0).optional(),
});
export type ContactInput = z.infer<typeof contactInputSchema>;
```

**Minimum message length: 15 characters.** Enough to rule out junk like `hi` or `test test`, low enough that a one-sentence ask still gets through.

**Validation timing:** on submit only. No `onBlur` validation. Less nagging.

**On submit:**
1. `useActionState` passes the `FormData` to the server action.
2. Server action `POST`s to `/api/contact`.
3. Route handler: parse with `contactInputSchema`. On failure, return `{ ok: false, errors }` (400). On success, check honeypot — if `website` is non-empty, return `{ ok: true }` without calling Resend (silent drop). Otherwise send via Resend and return `{ ok: true }`.
4. Client renders the returned state: errors go to fields + focus first failing one, success swaps the form for the success block, network/server 5xx renders the error row + keeps the form mounted.

**Honeypot:** `website` input. Hidden off-screen + `tabindex="-1"` + `aria-hidden="true"`. Bots fill it, humans can't see it. Server drops silently on non-empty.

**Rate limiting:** none in v1.

**Keyboard:**
- Tab order: Name → Email → Message → Submit. Honeypot `tabindex="-1"`, skipped.
- Enter on single-line inputs submits the form (native). Enter on textarea inserts newline (native).

**A11y:**
- Section: `aria-labelledby="contact-heading"`.
- Form: implicit labelling via section heading; each field has `<label>` (sr-only) + placeholder (visible).
- Errors: `role="alert"` + `aria-describedby` link, `aria-invalid="true"` on the failing field.
- Success block: `role="status" aria-live="polite"` + focus moved to `<h3>` programmatically.
- Thread + bookend + honeypot all `aria-hidden="true"`.

**Success-state focus management:**
After `ok: true`, an effect mounts, calls `successHeadingRef.current?.focus()` inside `requestAnimationFrame` so the DOM is settled. Screen reader announces "Got it. Heading level 3" and then (via the `aria-live` region) the body line.

---

## 5. Motion

Single `'use client'` `ContactClient.tsx`. `useEffect`, early-return on SSR and on `window.matchMedia('(prefers-reduced-motion: reduce)').matches`. All triggers inside a single `gsap.context(() => {...}, section)` for scoped cleanup.

**Four ScrollTriggers:**

1. **Thread scrub** — mirrors Process's thread scrub exactly:
   - `trigger: section`, `start: "top 80%"`, `end: "bottom 60%"`, `scrub: 0.5`
   - Animates thread line `scaleY: 0 → 1`, `ease: "none"`
   - Two thread segments (Process's + Contact's) therefore draw in the same motion language
2. **Headline reveal** (`start: "top 75%"`, `once: true`): `opacity: 0 → 1`, `y: 16 → 0`, `duration: 0.7`, `ease: "power2.out"`
3. **Paragraph reveal** — same trigger as headline, `delay: 0.12`, same `duration`/`ease`
4. **Form field stagger** — `trigger: form`, `start: "top 80%"`, `once: true`: fades each field `[data-contact-field]` + submit button `[data-contact-submit]` from `opacity: 0, y: 16` with `stagger: 0.08`, `duration: 0.6`, `ease: "power2.out"`

**Thread positioning:**
- A `positionThread()` function measures the thread container's `offsetParent.getBoundingClientRect()` (using the Process offsetParent fix) and sets the thread container's `top`/`bottom`/`height` so the line spans the left gutter of the inner wrapper, not the full section.
- Called once via `requestAnimationFrame(positionThread)` on mount.
- `ResizeObserver` on the section, 150ms debounce, recomputes on layout changes (textarea resize, fonts loading, form unmount after success).

**Cleanup:**
- `ctx.revert()` on unmount
- `observer.disconnect()`
- `clearTimeout(resizeTimer)` if pending

**Reduced-motion CSS fallback** appended to `src/app/globals.css`:

```css
/* ---------- CONTACT ---------- */
@media (prefers-reduced-motion: reduce) {
  [data-contact-thread] { transform: scaleY(1) !important; }
  [data-contact-headline],
  [data-contact-paragraph],
  [data-contact-field],
  [data-contact-submit] {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

JS early-return + CSS fallback together guarantee the full-drawn state if either layer fails.

---

## 6. Testing

- `contact-schema.test.ts` — accepts a canonical valid payload, rejects each failure mode (empty name, invalid email, message below 15 chars, message above 2000, non-empty honeypot). Covers dash/hyphen absence in every error message via regex: `/[\u2014\u2013\u002D]/`.
- `contact.data.test.ts` — all strings dash-free via the same regex, all ASCII straight quotes only (`/[\u2018\u2019\u201C\u201D]/` fails if found), headline matches `TELL ME WHAT YOU WANT`, paragraph contains the exact echo phrase.
- `ContactForm.test.tsx` — renders all fields with sr-only labels, submit triggers the action, pending state disables submit, error state re-enables + shows mailto link, success state unmounts form and mounts success block, honeypot is excluded from a11y tree (`queryByRole("textbox", { name: /website/i })` returns null), first failing field gets focus on validation error.
- `ContactThread.test.tsx` — container + line structure, aria-hidden set, initial `scaleY(0)`.
- `Contact.test.tsx` — section shell, `aria-labelledby="contact-heading"`, bookend rendered, headline rendered, ContactForm + ContactThread mounted.
- `ContactClient.test.tsx` — `vi.hoisted()` GSAP + ScrollTrigger mocks + ResizeObserver stub, 4 ScrollTriggers created, reduced-motion short-circuits (no gsap calls), `ctx.revert` + `observer.disconnect` called on unmount.
- `route.test.ts` — POST handler: valid input calls `resend.emails.send` with expected payload, invalid returns 400 with errors object, filled honeypot returns 200 without sending, exceptions return 500 with generic error.

---

## 7. Verification

- `scripts/verify-contact.mjs` — playwright-cli, 3 viewports (desktop 1920×1080, tablet 768×1024, mobile 375×812 @2x) × 3 scroll positions (0.1, 0.5, 0.95) + desktop reduced-motion = 10 PNGs at `docs/verification/2026-04-19-contact/`.
- Also capture the success state manually: fill the form with dummy input, mock the route handler to return `{ ok: true }`, capture the post-submit state. Save as `desktop-04-success.png`.
- `NOTES.md` alongside covers findings, any defects surfaced + fixed, and follow-ups.

---

## 8. Out of scope (v1)

- Rate limiting (`@upstash/ratelimit`) — defer to post-launch.
- Database persistence of submissions — Resend's email is the system of record.
- Multi-step forms / file uploads / calendar embed — Contact is a single-step inquiry form.
- Analytics events on submit — defer.
- Localization.

---

## 9. Acceptance criteria

1. Real form POSTs to `/api/contact`, which sends via Resend to `danharryge@gmail.com`.
2. Honeypot silently drops bot submissions.
3. 15-char minimum enforced on message server-side AND client-side.
4. Success state replaces form, focus moves to success heading, screen reader announces.
5. Error state preserves typed input and shows mailto fallback.
6. Gold thread draws down left gutter on scroll, aligned with Process's thread x-position.
7. Reduced-motion: content renders in final state, no animation runs.
8. A11y: all fields labelled, all errors announced, section `aria-labelledby` set, honeypot hidden from a11y tree.
9. No dashes or hyphens anywhere in user-facing copy (enforced by tests).
10. 138 + new tests pass. `tsc`, `lint`, `next build` all green.
11. 10 playwright-cli captures + success-state capture + NOTES.md committed to `docs/verification/2026-04-19-contact/`.
