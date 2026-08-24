# Design System

## 1. Three visual concepts

Each concept below is a complete, buildable direction — not a mood. They differ in what carries the emotion, which is the decision that actually matters.

### Concept A — "Morning Light"

The site is set on warm paper, lit from the east. Backgrounds are bone and cream; text is a warm near-black; the accent is the ochre-gold of early sun on stucco. Photography sits in full-bleed plates with air around them. Structure is drawn with hairline rules and generous space rather than cards and shadows. Atmosphere is built from soft gradient washes and slow light shifts, so the page feels like a room with a window in it.

As the homepage progresses, the light moves. Arrival is dawn. The middle chapters are full daylight. Prayer and Hope drift toward dusk — deep indigo, the last warmth at the horizon. The Invitation returns to morning. This is not a gimmick: in Adventist practice the Sabbath begins and ends at sundown, so a day's arc of light is the congregation's own liturgical rhythm rather than a decorative gradient.

Emotionally: welcoming, peaceful, hopeful, unmistakably a church.
Risk: light-dominant editorial design is unforgiving. Weak photography and sloppy typesetting have nowhere to hide.

### Concept B — "The Clairemont Journal"

The site behaves like a beautifully printed community journal. A visible, disciplined grid. Large numbered chapters. Pull quotes, captions, credits, folios. Near-monochrome with a single accent. Photography as documentary plates with real captions naming real people. Motion is almost entirely restrained to page-turn-like reveals and precise typographic entrances.

Emotionally: literate, calm, credible, deeply human, memorable because so few churches do it.
Risk: reads as cool rather than warm. Requires excellent copywriting and captioning to work — if the words are generic, the whole conceit collapses. Also the least "cinematic" of the three, which sits at odds with the brief.

### Concept C — "Vespers"

Dark-dominant and cinematic. Deep indigo night sky, sunset gradients, photography emerging from darkness with warm light. High drama, strong depth, luminous type.

Emotionally: reverent, awed, atmospheric.
Risk: significant. Dark heroes with glowing gradients are the exact visual language of AI and SaaS landing pages the brief rules out. It reads as less safe and less welcoming for families and older members, is harder to keep accessible in body copy, and misrepresents a congregation whose life happens on Saturday morning. Beautiful for a single scene; wrong as a whole-site register.

---

## 2. Selected direction

**Concept A, "Morning Light", built with Concept B's typographic and grid discipline, using Concept C only as a scoped treatment for the Prayer and Hope chapters and the Watch page.**

The reasoning:

1. **It is true to the church.** This congregation's identity is Sabbath morning — 9:30 study, 10:45 worship. A site lit like morning is the honest one. A dark site would be a costume.
2. **It serves the primary audience.** The person the site most needs to reach is a nervous first-time visitor, and often a parent. Light, warm, and open reads as safe. Dark and dramatic reads as impressive, which is a different and less useful feeling.
3. **It avoids the failure modes by construction.** Warm paper, hairline rules, editorial serif type, and full-bleed photography make it structurally difficult to accidentally produce the SaaS look. Glassmorphism and glowing blobs have nowhere to live in this system. The constraint does the work.
4. **It is accessible by default.** Warm dark ink on bone comfortably exceeds AA at body sizes, and a 274-member congregation includes many readers for whom that matters.
5. **Borrowing B costs nothing and adds rigor.** Numbered chapters, real captions, and a visible grid are what will make the site feel authored rather than assembled — and they reinforce the homepage-as-narrative brief directly.
6. **Keeping C as a scoped register gives the site tonal range.** Two dark chapters in a light site are far more powerful than a uniformly dark site, and the transition into them is the most cinematic moment we can build. The drama is earned rather than constant.

The one-line brief: **morning light on warm paper, set like a well-printed journal, moving toward dusk when it prays.**

---

## 3. Color

Semantic tokens, defined once in `src/styles/globals.css` via Tailwind v4 `@theme`. Components use semantic names only — never a raw hex, never `bg-[#FAF7F2]`.

### Palette

**Paper (light register)**

- `paper` `#FAF7F2` — primary background, warm off-white
- `paper-deep` `#F2EDE4` — alternating sections, subtle inset areas
- `paper-warm` `#EDE3D4` — warmest paper, used sparingly behind pull quotes

**Ink**

- `ink` `#14181A` — primary text, a warm-cool near-black, never pure `#000`
- `ink-70` `#4A5154` — secondary text, captions, metadata
- `ink-45` `#7C8285` — tertiary, disabled, timestamps
- `rule` `#14181A` at 10% — hairline rules and borders. There is one border weight in this system: 1px.

**Sky (the atmospheric scale)**

- `sky-100` `#E8EFF4`
- `sky-300` `#C3D6E3`
- `sky-500` `#8FB0C7`
- `sky-700` `#4A6A85`
- `sky-900` `#2A3F52`

**Dawn (accent — morning sun)**

- `dawn` `#C08A3E` — primary accent: links, focus rings, small marks
- `dawn-soft` `#E2C08A` — gradient washes, highlight fills
- `dawn-deep` `#8E6224` — accent text on light backgrounds where AA is needed

**Sage (Southern California nature)**

- `sage` `#7F8C77` — secondary accent, tags, ministry differentiation
- `sage-deep` `#4E5A49`

**Dusk (the vespers register)**

- `dusk` `#161D2B` — dark section background
- `dusk-raised` `#1F2739`
- `ember` `#B9705C` — the last warm light at the horizon
- `paper-on-dusk` `#F0EBE3` — text on dark

### Usage rules

- One accent per view. `dawn` and `sage` do not compete in the same section.
- Gradients are atmospheric only — sky and light washes at low contrast, in backgrounds. Never on text, never on buttons, never as a card fill. No two-color brand gradient anywhere.
- No shadows for elevation. Depth comes from photography, overlap, and scale. A `shadow-sm` may appear on the mobile nav sheet and the lightbox, and nowhere else.
- Dark sections are full-bleed and intentional. Never a dark card on a light page.
- Contrast floors: 4.5:1 body, 3:1 large display text and UI boundaries. `dawn` on `paper` passes for UI marks and large text; body links use `dawn-deep` or an underline plus `ink`.

---

## 4. Typography

Two variable families loaded through `next/font/google`, which self-hosts them at build time — so there is no request to a third-party font host, and no font files to manage in `public/`. Both are exposed as CSS custom properties (`--font-newsreader`, `--font-instrument-sans`) and wired into Tailwind's theme, with `display: 'swap'` and Latin subsets. Two families, three roles.

**Newsreader** (variable, optical size axis) — display and editorial serif. A warm transitional serif designed for reading on screen. It reads as considered journalism rather than corporate marketing or wedding-invitation script. Used for headings, chapter titles, sermon titles, and — in italic — scripture.

**Instrument Sans** (variable) — interface and body sans. Neutral with slightly humanist detail; carries metadata, navigation, labels, and long body copy without drawing attention.

Explicitly not Inter, and not by accident: Inter is the default voice of software, and this is not software.

This pairing is **decided, not provisional**. Fraunces was the considered alternative for the display face, and it was set aside: its soft and wonk axes add character, but they also add a fashionable quality that will date, and Newsreader's optical-size axis is the more useful property for a site that sets the same family at both 14px captions and 112px display.

### Scale

Fluid via `clamp()`, tuned so mobile is never a shrunken desktop.

| Token       | Size range          | Use                             | Family                                             |
| ----------- | ------------------- | ------------------------------- | -------------------------------------------------- |
| `display-1` | 3.5rem → 7rem       | Hero statement                  | Newsreader, 300–400 wt, `-0.02em`                  |
| `display-2` | 2.5rem → 4.5rem     | Chapter openers                 | Newsreader, 400                                    |
| `heading-1` | 2rem → 3rem         | Page titles                     | Newsreader, 400                                    |
| `heading-2` | 1.5rem → 2rem       | Section headings                | Newsreader, 500                                    |
| `heading-3` | 1.25rem → 1.5rem    | Sub-headings                    | Instrument Sans, 600                               |
| `body-lg`   | 1.125rem → 1.375rem | Lead paragraphs                 | Instrument Sans, 400, `1.65`                       |
| `body`      | 1rem → 1.0625rem    | Body                            | Instrument Sans, 400, `1.7`                        |
| `body-sm`   | 0.875rem            | Captions, metadata              | Instrument Sans, 400, `ink-70`                     |
| `eyebrow`   | 0.75rem             | Chapter labels, section kickers | Instrument Sans, 500, `0.14em` tracking, uppercase |
| `quote`     | 1.375rem → 2rem     | Scripture                       | Newsreader **italic**, 300, `1.45`                 |

### Typesetting rules

- Body measure capped at 68 characters (`max-w-[34rem]`). Lead paragraphs 60. Full-width body text is the fastest way to look unedited.
- `text-wrap: balance` on headings, `text-wrap: pretty` on body.
- Optical sizing enabled on Newsreader so large display text tightens correctly.
- Scripture always in Newsreader italic with the reference beneath in `eyebrow`. This pairing is the site's most recognizable typographic signature and appears on the homepage, sermon pages, and the Prayer chapter.
- Numerals: tabular for times and dates, proportional in prose.
- One heading level per step. No visual heading that is not a real heading element.

---

## 5. Space, grid, and shape

**Space** on a 4px base, with named steps for section rhythm: `section-sm` 4rem, `section` 6rem, `section-lg` 8rem, `section-xl` 12rem. Chapter breaks use `section-lg` or larger — generous vertical space is most of what makes a page feel intentional.

**Grid** is 12 columns with a 24px gutter. Desktop container `max-w-[88rem]` with 4rem margins; tablet 2rem; mobile 1.25rem. Full-bleed photographic plates break the container deliberately and often. Text blocks are asymmetrically placed within the grid (columns 2–7, or 6–11) rather than always centered — centered-everything is what makes church templates look like church templates.

**Shape** is where we most sharply reject the current default aesthetic:

- Radius scale stops at 4px. Inputs and buttons get 2px; images and photographic plates get 0. There are no rounded cards, because there are almost no cards.
- Structure is expressed with 1px `rule` hairlines, spacing, and typographic hierarchy.
- Where grouping is genuinely needed (an event listing, a leadership entry), it is a **row with a top hairline**, not a card. Rows scan better and stack better on mobile anyway.
- No glass, no blur-behind panels, no inner glows, no gradient borders.

---

## 6. Components

The whole system is small on purpose.

**`ui/`** — `Button` (primary solid `ink`, secondary hairline-outlined, tertiary text-with-underline; one size at 44px min touch target), `Link`, `Eyebrow`, `Rule`, `Field` (label, input, description, error, all wired for screen readers), `Dialog` (focus-trapped, used by the lightbox), `ScriptureQuote`, `Prose` (Portable Text renderer with typographic defaults), `Time` (timezone-correct `<time>`).

**`layout/`** — `SiteHeader` with scroll-state transition, `MobileNavSheet`, `SiteFooter`, `SkipToContent`, `Container`, `Chapter` (the section wrapper that supplies eyebrow number, title, and vertical rhythm).

**`media/`** — `SanityImage` (wraps `next/image` with Sanity's URL builder, LQIP blur placeholder, and a **required** `alt` sourced from the asset), `MediaPlate` (full-bleed image with caption and credit), `YouTubeEmbed` (facade — renders a poster image and only loads the iframe on interaction, so a page with six videos costs one image each), `Gallery`, `Lightbox`.

**`sections/`** — one component per homepage chapter and per reusable page section. Server Components that receive already-fetched content as props.

**`motion/`** — documented separately in `MOTION-SYSTEM.md`.

Component rules: props are typed interfaces, no `any`; no component fetches its own data; no component reads global state it was not given; every interactive element has a visible focus state; every component renders correctly with motion disabled.

---

## 7. Focus, states, and iconography

Focus is visible and consistent everywhere: a 2px `dawn` outline with a 2px offset, via `:focus-visible`. It is never removed, never replaced by a color change alone. On dark sections it becomes `dawn-soft`. Because parts of this site are pointer-expressive, the keyboard experience has to be as considered as the hover one — every hover-driven state also has a focus-driven equivalent.

Hover states are quick (120–200ms) and small: an underline growing, an image warming slightly, a rule extending. No lift, no scale-up on cards, no shadow bloom.

Icons: a small hand-built set of inline SVGs at 1.5px stroke — arrow, external link, play, close, menu, map pin, calendar, chevron. Icons never carry meaning alone; they accompany text. No icon library, and no decorative icons floating in section backgrounds.
