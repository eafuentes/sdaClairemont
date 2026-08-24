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

The palette is **sampled from the church's own exterior photograph at golden hour**, not invented. Measured off that image, the building sits in warm cream and terracotta with deep olive shadow, and the only cool note anywhere in the frame is a desaturated slate at the top of the sky — `#54616F`, and only about 5% of the sky pixels at that. An invented "sky" scale of clean blues would have been more saturated and more blue than the place actually is.

So the system carries warm neutrals and exactly **two hues**:

| Hue    | Where it comes from              | What it does         |
| ------ | -------------------------------- | -------------------- |
| `dawn` | the sun and the tile roof        | accent, links, marks |
| `dusk` | the shadow side of that same sky | the vespers register |

Everything else is a tint of those two over paper. There is no third hue to reach for, which is what stops a fourth and fifth from arriving later.

**Paper (light register)**

- `paper` `#FAF7F1` — primary background, warm off-white
- `paper-deep` `#F1EBE0` — alternating sections, subtle inset areas
- `paper-warm` `#EFE7DA` — warmest paper, sections that should feel sunlit

**Ink**

- `ink` `#171410` — primary text. Sampled from the deep foliage shadow, which is a warm olive-black rather than the blue-black most systems default to. Against warm paper that difference is most of why the page reads as daylight.
- `ink-soft` `#5B5854` — secondary text, captions
- `ink-muted` `#66635F` — eyebrows, timestamps, metadata
- `rule` `#171410` at 10% — hairline rules and borders. There is one border weight in this system: 1px.

Both subordinate ink tiers clear 4.5:1 on **all three** paper surfaces, not just on `paper`. A metadata tone that is only legible on the page ground is a trap, because sections move between surfaces and the type does not get re-checked when they do.

**Dawn (the accent — sun and tile roof)**

- `dawn` `#8F5624` — links, focus rings, small marks, tags
- `dawn-soft` `#E0A566` — the dusk-register equivalent
- `dawn-glow` `#F2CF9E` — accent type set **over photography**

`dawn` is deliberately dark enough to clear 4.5:1 on every paper surface, so the accent can carry actual words rather than being decoration that always has to be paired with `ink` to stay readable. `dawn-glow` exists because over a photograph the accent has to survive a blown-out highlight directly behind it, where `dawn-soft` reaches only 3.69:1 — fine for a rule or an underline, not for text.

**Dusk (the vespers register)**

- `dusk` `#2A333C` — dark section background
- `dusk-raised` `#39434E`
- `paper-on-dusk` `#F0ECE5` — text on dark

Sunset is when Sabbath begins, so this register is a literal reference rather than a mood.

### Usage rules

- Two hues, and they do not compete. A section is warm or it is cool; tonal variety comes from opacity over paper, not from new colours.
- Gradients are atmospheric only — light washes at low contrast, in backgrounds. Never on text, never on buttons, never as a card fill. No two-color brand gradient anywhere.
- No shadows for elevation. Depth comes from photography, overlap, and scale. A `shadow-sm` may appear on the mobile nav sheet and the lightbox, and nowhere else.
- Dark sections are full-bleed and intentional. Never a dark card on a light page.
- **Translucent text only on solid registers, never over imagery.** Over a photograph the composited result depends on what the camera saw, so opacity stops being a typographic choice and becomes a contrast risk.
- Contrast floors: 4.5:1 body, 3:1 large display text and UI boundaries. Every pair — including composited translucent ones and the hero scrim over a worst-case white highlight — is checked by `pnpm check:contrast` rather than by eye.

### Type over photography

The hero sets type over a photograph, where the background is whatever the camera happened to see. Rather than tune the scrim against this one image, the floor is derived against the **worst case any photograph can present**: a blown-out white highlight sitting directly behind a line of text.

The static base scrim holds at least 85% `dusk` everywhere type is placed, which flattens that worst case to `#4A5259` and gives `paper-on-dusk` 6.75:1. The scroll-driven layer sits on top and only ever adds density. So there is no scroll position, and no interrupted animation, at which the type can become unreadable — the guarantee does not depend on the motion landing anywhere in particular.

---

## 4. Typography

Two variable families loaded through `next/font/google`, which self-hosts them at build time — so there is no request to a third-party font host, and no font files to manage in `public/`. Both are exposed as CSS custom properties (`--font-newsreader`, `--font-instrument-sans`) and wired into Tailwind's theme, with `display: 'swap'` and Latin subsets. Two families, three roles.

**Newsreader** (variable, optical size axis) — display and editorial serif. A warm transitional serif designed for reading on screen. It reads as considered journalism rather than corporate marketing or wedding-invitation script. Used for headings, chapter titles, sermon titles, and — in italic — scripture.

**Instrument Sans** (variable) — interface and body sans. Neutral with slightly humanist detail; carries metadata, navigation, labels, and long body copy without drawing attention.

Explicitly not Inter, and not by accident: Inter is the default voice of software, and this is not software.

This pairing is **decided, not provisional**. Fraunces was the considered alternative for the display face, and it was set aside: its soft and wonk axes add character, but they also add a fashionable quality that will date, and Newsreader's optical-size axis is the more useful property for a site that sets the same family at both 14px captions and 112px display.

### Rejected: heavy grotesk with monospace metadata

This pairing was proposed mid-Phase 1, built out in full — every token, component and chapter migrated to Archivo and IBM Plex Mono — and then reverted. Recording why, so it does not get proposed a third time.

It is a genuinely good system, and it belongs to a different building. Heavy grotesk headlines set tight and uppercase read as a manifesto: confident, editorial, faintly commercial. Monospace metadata reads as instrumentation — a readout, a terminal, a build log. Both are the visual language of software and fashion, and both are _assertive_. The homepage's first line is "There's a place for you here," and set in tight uppercase grotesk it stops sounding like an invitation and starts sounding like a claim.

The specific failure was tone, not craft:

- **Monospace has no warmth to lend.** It signals precision. Service times and addresses are the most human data on the page — the details someone reads while deciding whether to walk in on a Saturday — and monospace makes them look like machine output.
- **Uppercase display type is loud at the exact moment the site should be quiet.** A church's front door is not a headline.
- **A serif carries the one thing a grotesk cannot fake here: continuity.** Scripture set in Newsreader italic looks like it has been read before. Set in a grotesk it looks like it was written for this campaign.

The three-colour discipline from that same proposal was **kept**, and it improved the system: the palette went from six hue families to two. The constraint was right; the typefaces were not.

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
| `body-sm`   | 0.875rem            | Captions, metadata              | Instrument Sans, 400, `ink-soft`                   |
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
