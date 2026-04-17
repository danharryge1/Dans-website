# Agency Landing Page — Complete Design Specification

> **Purpose:** This document is a pixel-accurate technical specification derived from the Stitch project "Agency Landing Page Variant 3". It is written so that any developer agent (Claude, Cursor, etc.) can scaffold the entire site without needing to view the original screenshots. Every section, colour, font, spacing decision, and interaction pattern is documented below.

---

## 1. Design System & Global Tokens

### 1.1 Colour Palette

> **Source of truth:** PRD.md. Tokens below are derived against PRD's `#0D544C` teal base. Do not introduce forest-green (`#0F2B1E`) derivatives.

| Token | Hex / RGBA | Usage |
|---|---|---|
| `--bg-primary` | `#0D544C` | Main page background — PRD Background (mid-teal) |
| `--bg-darker` | `#0B2422` | Deeper sections, footer, recessed areas — PRD Secondary |
| `--bg-card` | `rgba(11, 36, 34, 0.85)` | Card backgrounds — semi-transparent dark teal with backdrop-blur |
| `--bg-card-border` | `rgba(140, 200, 165, 0.35)` | Card border glow — soft green tint, brightened for teal base |
| `--text-primary` | `#F5F5F0` | All headings, primary body copy — PRD Text / Primary (warm off-white) |
| `--text-secondary` | `#A5B9AD` | Muted descriptions, captions, nav links at rest |
| `--text-accent` | `#F5F0F4` | Active nav items, hover states — PRD Accent (warm off-white with subtle pink) |
| `--grid-line` | `rgba(180, 220, 200, 0.15)` | Background grid lines — light, low α for visibility on teal |
| `--grid-glow` | `rgba(180, 240, 200, 0.10)` | Subtle radial glow behind hero content |
| `--gold-accent` | `#C8A55C` | Used on the 3D gear graphic, metallic accents (bg-independent) |
| `--border-input` | `#F5F5F0` | Form input borders |
| `--btn-primary-bg` | `transparent` | Primary CTA buttons are outlined, not filled |
| `--btn-primary-border` | `#F5F5F0` | Button outline colour |

### 1.2 Typography

> **Source of truth:** PRD.md — **Headings: Comico. Body: Permanent Marker.** Fonts are self-hosted from `/public/fonts/`. Do **not** use Space Grotesk or any Google Font CDN. Comico is the hero/heading face (brand voice). Permanent Marker is used for body and UI per PRD — note this is unconventional for paragraph copy; compensate with generous `line-height` (1.6–1.8), increased `letter-spacing` at small sizes, and shorter paragraph lengths (≤ 50ch) to preserve readability.

| Role | Font Family | Weight | Size (Desktop) | Style Notes |
|---|---|---|---|---|
| Display / Hero Headlines | **Comico** | 400 | 56–72px (`text-5xl` to `text-7xl`) | Brand hero face. Hand-drawn, rounded feel. ALL CAPS. Slight text-shadow for glow. |
| Section Headlines | **Comico** | 400 | 40–48px (`text-4xl` to `text-5xl`) | ALL CAPS |
| Sub-headlines / Labels | **Comico** | 400 | 24–32px (`text-2xl` to `text-3xl`) | Mixed case or ALL CAPS depending on section |
| Body Copy | **Permanent Marker** | 400 | 16–18px (`text-base` to `text-lg`) | Per PRD. `line-height: 1.7`, `letter-spacing: 0.01em`. Keep paragraphs short. |
| Navigation Links | **Permanent Marker** | 400 | 14px (`text-sm`) | Uppercase, `letter-spacing: 0.05em` |
| Button Text | **Permanent Marker** | 400 | 14–16px | Uppercase, `letter-spacing: 0.1em` |
| Captions / Fine Print | **Permanent Marker** | 400 | 12–13px (`text-xs`) | Muted colour, `letter-spacing: 0.02em` |
| Pill Tags / Handwritten Annotations | **Permanent Marker** | 400 | 14–20px | Tags ("No Templates"), angled notes (e.g. `rotate(-5deg)`). |

> **Font files:** `Comico-Regular.woff2` (preferred) and `PermanentMarker-Regular.ttf` live in `/public/fonts/`. Declare with `@font-face` in `globals.css` and expose as CSS variables `--font-comico` and `--font-marker`.

### 1.3 Corner Radii

| Element | Radius |
|---|---|
| Cards (services, portfolio) | `12px` (`rounded-xl`) |
| Form inputs | `12px` (`rounded-xl`) |
| Buttons | `24px` (`rounded-full`) for pill-shaped CTAs |
| Images in case studies | `8px` (`rounded-lg`) |

### 1.4 Background Pattern — The Grid

The entire site uses a **perspective wireframe grid** as a unifying background texture. There are two variants:

**3D Perspective Grid (Hero sections):**
- A CSS perspective grid that creates a "floor" receding into the distance
- Implemented via a `div` with `perspective: 800px`, child with `rotateX(55deg)` and `translateY(40%)`
- Grid lines: 1px, colour `var(--grid-line)`, spacing ~60px
- Subtle radial gradient glow at the centre (top of the vanishing point)
- Light particles / sparkle dots scattered — use small absolute positioned elements with `box-shadow: 0 0 6px 2px rgba(180,240,180,0.4)` and CSS animation

**Flat 2D Grid (Other sections):**
- Simple `background-image` with `repeating-linear-gradient` for both axes
- Line colour: `var(--grid-line)`, spacing: ~60px
- Grid sits behind all content at low opacity

### 1.5 Elevation & Depth

- **Cards:** Use `backdrop-filter: blur(12px)` with a semi-transparent green-black background and a `1px` border of `var(--bg-card-border)`. Subtle inner glow on top-left edge.
- **No drop shadows.** Depth is achieved through background colour contrast and the translucent card treatment.
- **Images:** Portfolio/case study images sit flat with `rounded-lg` corners. No border. Light subtle shadow if needed: `0 8px 32px rgba(0,0,0,0.3)`.

---

## 2. Page Sections (Scroll Order)

The landing page is a single-page scroll with the following sections in order:

### 2.1 Navigation Bar

**Two navigation variants exist in the project:**

**Variant A — Minimal Centred (Primary):**
- Links centred horizontally at the top of the page
- Links: `PORTFOLIO` · `SERVICES` · `ABOUT` · `CONTACT`
- No logo visible
- Font: Permanent Marker, 14px, uppercase, `letter-spacing: 0.05em`
- Colour: `var(--text-secondary)` at rest, `var(--text-accent)` on hover
- Padding: `24px 0` from top
- No background — fully transparent, content sits directly on the hero

**Variant B — Logo + Right-aligned Nav (Alternative):**
- Left: Logo text — "PREMIUM AGENCY." or "APEX" with a small triangle/mountain icon, in Comico
- Right: `WORK` · `SERVICES` · `ABOUT` · `CONTACT` + hamburger menu icon (☰)
- Active link has underline or bold treatment
- Same typography rules as Variant A

### 2.2 Hero Section

**Three hero variants are designed. Build the primary; others are documented for future A/B testing.**

#### Hero Variant 1 (Primary — "Crafting Digital Masterpieces" with floating tools)
- **Headline:** `CRAFTING DIGITAL MASTERPIECES`
- **Subheadline:** `No templates. Just pure, unadulterated effort.`
- **Hero Image:** A floating 3D composition of design tools — sketchbook, colour palette, brushes, pencils, compass. This should be a high-quality PNG/WebP placed centrally below the text.
- **Animation:** The image should have a gentle floating animation (`translateY` oscillating ±8px over 4s, ease-in-out, infinite).
- **Sparkle effects:** 6–10 small white/light-green dots with blur, positioned absolutely around the image, with staggered fade-in/fade-out animations.
- **Background:** 3D perspective grid (see §1.4).
- **No CTA button** in this variant — the hero is purely atmospheric.

#### Hero Variant 2 ("Crafting Digital Masterpieces" with CTA + Gear)
- Same headline and subheadline as Variant 1
- **CTA Button:** `View Portfolio` — pill-shaped, outlined (`border: 2px solid var(--text-primary)`, `rounded-full`, padding `12px 32px`)
- **Hero Image:** A large 3D golden gear/cog rendered object, floating centrally
- **Scroll indicator:** At bottom centre — a small downward chevron (⌄) with text `Scroll to reveal the process` in small muted type. The chevron should have a gentle bounce animation.
- **Background:** 3D perspective grid

#### Hero Variant 3 ("Design. Develop. Deliver." with laptop mockup)
- **Headline:** `DESIGN. DEVELOP. DELIVER.`
- **Subheadline:** `Premium web design solutions for visionary brands.`
- **Hero Image:** A large laptop/tablet mockup showing a real website screenshot, displayed on a dark slate-coloured device frame. The mockup is slightly tilted/elevated.
- **Badge:** Bottom-right of the hero — a circular stamp/badge reading "Comico" (the brand face) with decorative text around the circumference. Light grey/beige colour, `border-radius: 50%`, rotated slightly.
- **Scroll indicator:** Bottom centre — downward arrow (↓) with text `SCROLL FOR THE NARRATIVE`

#### Hero Variant 4 ("Beyond The Pixel" with architectural model)
- **Headline:** `BEYOND THE PIXEL`
- **Subheadline line 1:** `Comico` (the font name, displayed as a creative statement)
- **Subheadline line 2:** `Custom-built for the bold`
- **Layout:** Two-column — text left, image right
- **Hero Image:** A 3D architectural model (a small house/building) sitting on architectural blueprints with pencils and tools — photorealistic
- **CTAs (Two buttons):**
  - `VIEW PROJECTS →` — pill outlined button on the left
  - `READ OUR STORY` — pill outlined button on the right
- **Background:** Dark forest green, no grid, subtle diagonal line texture (very faint)

### 2.3 Services Section ("Tailored Digital Solutions")

- **Section Headline:** `TAILORED DIGITAL SOLUTIONS` — Comico, centred, ~48px
- **Layout:** 3-column grid, centred, `max-width: 1200px`, `gap: 24px`
- **Each Card:**
  - Background: `var(--bg-card)` with `backdrop-filter: blur(12px)`
  - Border: `1px solid var(--bg-card-border)`
  - Border-radius: `12px`
  - Padding: `32px`
  - **Card Title:** Comico, ~24px, ALL CAPS
  - **Card Body:** Permanent Marker, 15px, `var(--text-secondary)`
  - Decorative corner elements: Faint circular arc / tech-looking decorative line in top-right corner of each card (optional flourish)

- **Card Content:**

| Card | Title | Description |
|---|---|---|
| 1 | **UI/UX DESIGN** | Intuitive and beautiful interfaces crafted for high engagement and seamless user journeys. |
| 2 | **CUSTOM DEVELOPMENT** | Clean code, high performance, and scalable architecture built from the ground up. No bloat. |
| 3 | **BRAND STRATEGY** | Compelling narratives and visual identities that resonate and build lasting connections. |

### 2.4 Philosophy Section ("Our Philosophy")

- **Section Headline:** `OUR PHILOSOPHY` — Comico, centred, ~48px
- **Sub-headline:** `Real Effort. Real Results.` — Comico, italic, ~24px
- **Layout:** Two-column — image left, text + badges right
- **Left Column (Image):** A hand-drawn wireframe/sketch photo — someone sketching UI layouts by hand. Corner radius: `8px`. Takes ~45% of container width.
- **Right Column (Text):**
  - Body paragraph: "We believe in the power of bespoke creation. Every project starts with a blank page and dedicated effort, not a pre-made template. Our designs are crafted with intention and code that performs."
  - Font: Permanent Marker, 16px, `var(--text-primary)`
- **Badges (below the text):** Two pill-shaped labels stacked vertically
  - `No Templates` — white bg, dark text, `rounded-full`, padding `8px 24px`
  - `Hand-Coded Excellence` — same styling
  - Font: Permanent Marker, ~18px

### 2.5 Portfolio / Case Study Section ("Selected Works")

**Two portfolio variants exist:**

#### Variant A — "Echo & Co. Redesign" (Featured Case Study)
- **Section Headline:** `ECHO & CO. REDESIGN` — Comico, ~40px
- **Layout:** Two-column header (Challenge / Solution) + centred screenshots + lower process strip
- **Upper columns:**
  - Left: `THE CHALLENGE` — title in Comico, description below in Permanent Marker. "Designer's Note: The old site felt generic and slow. It needed soul."
  - Right: `THE SOLUTION` — "Designer's Note: We built a custom, fluid experience from scratch. Pure craftsmanship."
- **Centre:** 3–4 website screenshots arranged in a slight carousel/overlap showing different pages (DYNAMIC HOMEPAGE, SERVICES, ABOUT)
- **Lower strip — "OUR PROCESS":** 4 cards in a horizontal row:

| Step | Title | Description |
|---|---|---|
| 1 | DISCOVERY | Permaner's Note: The old site felt generic and slow. |
| 2 | CONCEPT | Permaner's Note: Based our site above and... |
| 3 | BUILD | Permaner's Note: We built a custom, fluid... |
| 4 | LAUNCH | Designer's Note: We can craft the same... |

#### Variant B — "Selected Works: Draft to Reality" (Interactive Before/After)
- **Section Headline:** `SELECTED WORKS: DRAFT TO REALITY` — Comico, ~40px
- **Layout:** Three-column — wireframe left, project info centre, final result right
- **Left:** A hand-drawn wireframe sketch (scanned paper look) with annotations. Shows the "draft" state.
- **Centre:**
  - Label: `PROJECT:` in small caps
  - Title: `APEX URBAN DEVELOPMENT` — Comico, ~28px
  - **Draft / Reality Toggle:** A segmented control / toggle switch with two options: `DRAFT` and `REALITY`. The active state (REALITY) has a filled pill indicator.
  - Description: "Apex Urban Development: From initial concept to a dynamic digital presence. Custom real estate platform with integrated property management."
  - CTA: `VIEW CASE STUDY` — outlined pill button, uppercase
- **Right:** The finished website screenshot showing the polished result
- **Bottom row:** Additional project cards (VELOCITY FINTECH, CULINARY COLLECTIVE) as smaller previews

#### Variant C — "Selected Works" (Portfolio Grid)
- **Section Headline:** `SELECTED WORKS` — Comico, ~48px
- **Layout:** 3-column × 2-row masonry-style grid (6 projects total)
- **Each portfolio item:**
  - Website screenshot thumbnail with `rounded-lg`
  - Project name below in Comico
  - One-line description in muted text
- **Project List:**

| Project | Description |
|---|---|
| Aether — Immersive Digital Platform | 140 hours of custom animation & interactive design. |
| Chronos — Luxury Watch E-commerce | Integrated 3D product viewer with real-time rendering. |
| Nomad — Travel & Adventure Journal | Hand-drawn illustrations & dynamic scroll storytelling. |
| Lumine — Sustainable Energy Initiative | Data visualization dashboard with 50+ interactive charts. |
| Helix — Genomic Research Lab | Complex bioinformatics interface & responsive design. |
| Oasis — Boutique Hotel Booking | Seamless booking flow & personalized user journey. |

- **Nav (on this variant):** Logo "APEX" with triangle icon top-left, `WORK` (underlined/active) · `ABOUT` · `SERVICES` · `CONTACT` top-right

### 2.6 Process Section ("Our Craft Process")

- **Section Headline:** `OUR CRAFT PROCESS` — Comico, ~48px, centred
- **Layout:** Numbered vertical timeline — large numbers on the left, title + description + image on the right
- **Each step has:**
  - A **massive number** (1, 2, 3) in Comico, ~120px, acting as a decorative element on the left
  - **Step title** in Comico, ~28px, right of the number
  - **Step description** in Permanent Marker, 15px, below the title
  - **Associated image** — relevant screenshot or photo on the far right

| Step | Title | Description | Image |
|---|---|---|---|
| 1 | **THE BLUEPRINT PHASE** | We begin with deep discovery, understanding your core goals and audience. No cookie cutter solutions. We map out complete user journeys and information architecture from scratch. | Wireframe sketch |
| 2 | **THE ARTISTIC VISION** | Our designers craft bespoke visuals and interactions aligned with your brand. We emphasize original UI/UX, creating unique visual languages and motion design. | Design mockup / "Custom Vision" label |
| 3 | **BUILDING THE ENGINE** | Our developers bring the vision to life with clean, scalable code. We build performant, scalable websites, focusing on unique interactions and animations, not pre-built themes. | Code editor screenshot |

- **Footer CTA:** Below the process steps — `READY TO START? LET'S TALK.` in centred small text
- **Fine print:** `Copyright © 2024 Apex, Inc. All rights reserved. | Privacy Policy | Terms of Service`

### 2.7 Contact Section ("Let's Start The Craft")

**Two contact section variants:**

#### Variant A (Two-column with "What to Expect")
- **Headline:** `LET'S START THE CRAFT` — Comico, centred, ~48px
- **Layout:** Two-column, `max-width: 900px`, centred
- **Left Column — Form:**
  - Input: `Your Name` — transparent bg, `border: 2px solid var(--border-input)`, `rounded-xl`, padding `12px 16px`
  - Input: `Your Email` — same styling
  - Textarea: `Project Details` — same styling, ~4 rows tall
  - Button: `SUBMIT INQUIRY` — outlined pill, `border: 2px solid var(--border-input)`, `rounded-xl`, full width, padding `14px`, Permanent Marker uppercase
  - Hover state: Background fills to `var(--text-primary)`, text inverts to `var(--bg-primary)`
- **Right Column — "What to Expect":**
  - Subheading: `WHAT TO EXPECT` — Comico, ~24px
  - Bullet list (using white disc markers):
    - 1-on-1 discovery call
    - Zero templates
    - Custom-coded craft
    - Dedicated project manager
    - Regular updates
  - Font: Permanent Marker, 16px, `var(--text-primary)`
- **Background:** Flat dark green with 2D grid overlay

#### Variant B ("Lets Build Something Real" — Minimal)
- **Headline:** `LETS BUILD SOMETHING REAL` — Comico, ~56px, left-aligned
- **Handwritten annotation:** Top-right area — `We only take 2 projects a month to ensure quality.` in Permanent Marker, smaller (~16px), angled slightly (CSS `rotate(-5deg)`)
- **Layout:** Single column, left-aligned form
- **Form fields:** Same styling as Variant A but stacked full-width
  - `Your Name`
  - `Email Address`
  - `Project Details`
  - `SEND MESSAGE` — outlined button, centred, pill-shaped
- **Logo/Brand:** Top-left — `agency` in italic lowercase, Comico
- **Nav:** Top-right — `Home` · `About` · `Projects` · `Contact` (sentence case, not uppercase)
- **Background:** Deep gradient — dark green with subtle diagonal line texture (45deg repeating thin lines at very low opacity)

### 2.8 Footer

- **Layout:** Full-width bar at the bottom, separated by a thin `1px` horizontal line (`var(--grid-line)`)
- **Content:** `© 2024 Premium Digital Craft. All rights reserved. | Privacy Policy`
- **Alt content (Process page variant):** `Copyright © 2024 Apex, Inc. All rights reserved. | Privacy Policy | Terms of Service`
- **Font:** Permanent Marker, 12px, `var(--text-secondary)`, centred
- **Padding:** `16px 0`

---

## 3. Interactions & Animations

### 3.1 Scroll Behaviour
- Smooth scroll between sections (`scroll-behavior: smooth`)
- Sections should fade in on scroll (use `IntersectionObserver` with a CSS transition: `opacity 0→1`, `translateY(20px)→0` over `0.6s ease-out`)

### 3.2 Hero Animations
- **Floating image:** `@keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }` — `4s ease-in-out infinite`
- **Sparkle particles:** Small dots with `@keyframes sparkle { 0%, 100% { opacity: 0 } 50% { opacity: 1 } }` — staggered delays (0s, 0.5s, 1s, etc.)
- **Scroll indicator bounce:** Chevron with `@keyframes bounce { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(6px) } }` — `2s ease-in-out infinite`

### 3.3 Card Hover
- Services cards: On hover, `border-color` transitions to brighter green (`rgba(120, 200, 140, 0.5)`), very subtle `transform: translateY(-2px)` over `0.3s`
- Portfolio items: On hover, slight scale `1.02` with `0.3s ease`

### 3.4 Button Hover
- Outlined buttons: On hover, fill background to `var(--text-primary)`, text colour to `var(--bg-primary)`, transition `0.25s ease`

### 3.5 Draft/Reality Toggle (Portfolio §2.5 Variant B)
- Slide toggle with animated indicator pill
- Transitioning between states crossfades/slides the wireframe ↔ final screenshot

---

## 4. Responsive Behaviour

- **Desktop:** All layouts as described, maximum content width `1200px`–`1400px`, centred
- **Tablet (< 1024px):**
  - Services cards: stack to 2-column then 1-column
  - Portfolio grid: 2-column
  - Two-column layouts (Philosophy, Contact): stack vertically
  - Process steps: stack number above title
- **Mobile (< 768px):**
  - Nav: Collapse to hamburger menu
  - Hero text: Scale down to `text-3xl`/`text-4xl`
  - All grids: single column
  - Portfolio: Single column cards
  - Form: Full width, stacked

---

## 5. Assets Required

| Asset | Type | Description |
|---|---|---|
| Hero floating tools composition | PNG/WebP | 3D render of sketchbook, brushes, pencils, colour palette, compass — transparent background |
| Golden gear/cog | PNG/WebP | 3D metallic gold gear — transparent background |
| Laptop mockup with website | PNG/WebP | Dark device frame showing a real website screenshot |
| Architectural model photo | JPG/WebP | Photorealistic 3D house model on blueprints |
| Hand-drawn wireframe photo | JPG/WebP | Photo of someone sketching wireframes by hand |
| Portfolio screenshots (6) | JPG/WebP | Cropped website screenshots for the portfolio grid |
| Case study screenshots (3-4) | JPG/WebP | Website page screenshots for the Echo & Co. case study |
| Wireframe sketch (scan) | JPG/WebP | Scanned hand-drawn wireframe for Draft to Reality |

---

