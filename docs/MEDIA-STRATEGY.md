# Media Strategy

Photography is the emotional engine of this site. The design direction is light, spacious, and typographically restrained precisely so that photographs carry the feeling. That makes this document a dependency of the design, not a supporting detail.

**Current reality:** no usable church photography exists yet. Phase 1 is therefore built against deliberately-chosen placeholders, with a shot list handed to the church so real photography can replace them without any code change.

---

## 1. Ownership

| Media                                                      | System                                     | Why                                                                                                                                                                            |
| ---------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public editorial photography                               | **Sanity assets**                          | Editors upload where they edit. Sanity's CDN handles format negotiation, resizing, focal-point cropping, and LQIP. Building a parallel media system would be pure duplication. |
| Public video                                               | **YouTube**, metadata in Sanity            | Free bandwidth, adaptive streaming, captions, existing subscriber base. We control presentation.                                                                               |
| Private files (member documents, registration attachments) | **Supabase Storage**, private buckets, RLS | Never public, never in Sanity.                                                                                                                                                 |
| Logo, favicons, fonts, static OG fallback                  | **Repository** (`public/`)                 | Immutable, part of the build.                                                                                                                                                  |

No component ever constructs an asset URL. Public images resolve through `sanity/lib/image.ts`; private files resolve through short-lived signed URLs from a Server Action. When the Sanity or Supabase project changes, one file's inputs change and nothing else.

---

## 2. Image pipeline

Every public image renders through a single `<SanityImage>` component wrapping `next/image`:

- **Sanity's image URL builder** for width, height, format, quality, and crop, with `auto('format')` so browsers get AVIF or WebP.
- **Focal point (hotspot/crop)** from Sanity respected in every aspect ratio, so a portrait hero crop and a wide gallery crop both keep the face in frame. Editors set this once per asset by dragging a circle — no per-usage cropping.
- **LQIP blur placeholder** from Sanity's asset metadata, so plates fade in from a color-correct blur rather than a white box.
- **Explicit width and height always**, derived from the asset's own dimensions. This is how CLS stays under 0.05 on a photograph-heavy site.
- **Responsive `sizes` per usage** (full-bleed plate, half-column, gallery thumbnail, portrait). Sizes are declared per component, not guessed globally, because a wrong `sizes` on a full-bleed hero is the single most expensive mistake available on this site.
- **Priority only on the hero image.** Everything else lazy-loads.
- **`alt` is required by TypeScript** and read from the asset's own `alt` field, which is marked required in Sanity. A missing alt should be an editor-visible validation error, not an accessibility audit finding six months later.

Budgets: hero under 250KB after optimization, gallery thumbnails under 60KB, plates under 180KB. Source uploads should be at least 2400px on the long edge so the CDN has room to work.

---

## 3. Photography direction

What the photographs need to be, so that whoever shoots them knows the target:

**Light.** Natural, warm, directional. Morning and late-afternoon light. No on-camera flash, no fluorescent-lit fellowship-hall look, no heavy HDR.
**Distance.** Close enough to see faces and expressions. The most common failure in church photography is the wide shot from the back of the sanctuary, which reads as empty even when the room is full.
**Moment.** Candid over posed. Someone laughing mid-sentence, a child concentrating on a knot, two people talking after service. One or two dignified posed portraits for leadership, and that is all.
**Honesty.** Actual congregation size, actual room, actual diversity. A first-time visitor who arrives to something different from the photographs feels misled, and that is worse than an unglamorous photo.
**Composition.** Room for text. Full-bleed plates need quiet areas for typography — over-shoot with headroom and negative space on one side.

Editing: warm and true. Slightly lifted shadows, restrained saturation, no teal-orange grading, no vignettes, no filters. A consistent, light preset across the library matters more than any single image.

---

## 4. Shot list

Prioritized, so the church can start with 20 photographs and still launch well. Each area needs 3–8 usable frames.

### Priority 1 — needed for launch (about 20 images)

- **Sanctuary during worship:** congregation from a side angle at mid-height; hands holding an open Bible or hymnal; a singer or musician mid-phrase.
- **The building and arrival:** the exterior in morning light, recognizable from the street so a visitor knows they have found it; the entrance with the door open; the parking area; a greeter welcoming someone.
- **People together after service:** two or three adults talking, genuinely; someone laughing; an intergenerational pair — an older member with a child.
- **Children and families:** kids in Sabbath School with a teacher; a family walking in; a child's hands on a craft or activity.
- **Pathfinders:** the club in uniform, outdoors; a hike or campsite; hands tying a knot or building something; a group of teens laughing together. Pathfinders needs its own strong set — it carries the flagship page.
- **Pastor London Lee:** preaching from the pulpit; one warm, informal portrait; one photo talking with a member.

### Priority 2 — deepens the site

Adventurers with families on a Sunday. Sabbath School classes across age divisions. CARE Group young adults around a table with Bibles. VBS activity. A service or community project in progress. Prayer — hands, bowed heads, shot respectfully and never intrusively. Potluck and fellowship meal. Baptism if one occurs. Details: the church sign, hymnal pages, a communion setting, light through a window.

### Priority 3 — atmosphere

Southern California sky and clouds from the church's own neighborhood. Morning light on the building's wall. Nature from a Pathfinder trip — coastline, chaparral, mountains. Golden-hour exteriors. These feed `<AtmosphericBackground>` and the chapter transitions, and they are the shots most likely to be capturable by a volunteer with a phone.

### Practical guidance for the church

Assign one person per event with a real camera or a recent phone, shooting in the highest-quality mode. Take five times more frames than needed. Shoot Pathfinder outings deliberately — they produce the best material by a wide margin. Do not delete anything before we curate.

### Consent, and children in particular

The church needs a written photo-release policy before any photograph of a minor is published. This is both an ethical obligation and consistent with the existing Safe Kid Policy. Concretely: an annual photo-consent line on Pathfinder, Adventurer, and VBS registration forms; a visible notice at events that photography is taking place; a simple opt-out that staff can honor; and no publication of a child's full name alongside their photograph. Sanity's asset fields will include a `consentConfirmed` boolean on people-focused imagery so the editorial workflow makes this explicit rather than assumed.

---

## 5. Placeholder strategy for Phase 1

No church photography exists yet, and the design depends on photography, so Phase 1 is built against **AI-generated placeholders** used purely to evaluate composition. A grey box would make the layout un-evaluable and would hide problems until launch; a composition-accurate placeholder lets us judge crop, focal point, density, and the mobile crop before real photography exists.

### What AI placeholders are for

Approximating the **final aspect ratio, focal point, lighting direction, subject placement, visual density, atmosphere, and mobile crop** of each slot. They are a stand-in for a photograph's geometry and light, nothing more.

### Hard limits on generated people

Generated imagery must never depict or imply actual Clairemont members, actual Pathfinder or Adventurer participants, actual church events, the actual facility, or documentary moments. Enforced as a content rule, not a disclaimer:

- **No generated identifiable faces**, even as placeholders. Compositions use hands, backs, silhouettes, distance, and activity focus instead. This is not squeamishness: a generated face is persuasive enough that stakeholders bond with a family that does not exist, and real photography of 274 actual people then reads as a downgrade. It also means a leaked placeholder cannot misrepresent a person.
- **No generated children at all**, in any composition, for any ministry page. Pathfinders and Adventurers placeholders show gear, trails, campsites, hands on a knot, a trailhead at golden hour — the activity, not the participants.
- **No generated interiors presented as this sanctuary.** Interior placeholders are generic warm rooms and light studies, and the real building's exterior and sanctuary are Priority 1 on the shot list precisely because they cannot be faked.

### Provenance and enforcement

Every image in the system carries a `provenance` field rather than a boolean, because we need to know _what_ a placeholder is, not just that it is one:

- `church-photo` — real, cleared photography of this congregation. The only value permitted in production.
- `ai-placeholder` — generated. Requires `provenanceNote` recording the generator and intent.
- `stock-placeholder` — licensed. Requires a license reference.

Enforcement, so that "identify every remaining placeholder before launch" is a mechanism rather than a memory:

1. Studio shows a persistent warning on any asset whose provenance is not `church-photo`, and a "Needs attention" desk list of every document referencing one.
2. `scripts/check-placeholders.ts` queries Sanity for published documents referencing non-`church-photo` media and **fails a production build** if any exist. Launch cannot proceed with a placeholder on a published page.
3. Placeholders live in the same pipeline as real assets — uploaded into Sanity with hotspots and required alt text — so replacement is an upload in Studio, incrementally, with no code change and no deployment.

### The one permanent exception

The atmospheric sky and cloud textures behind `<AtmosphericBackground>` are generated or illustrated on purpose and are **not** placeholders. They are abstract light and vapor, depict nobody and nowhere, and live in `public/` as permanent design assets. They are exempt from the provenance gate.

---

## 6. Video

**All public video is YouTube.** Sanity stores metadata; YouTube stores bytes.

Metadata per `sermon` or ministry video: title, slug, YouTube URL (validated, ID extracted at query time), description, speaker reference, date, scripture, series, ministry reference, duration, custom thumbnail (optional — falls back to the YouTube thumbnail), and a `featured` flag.

Embedding uses a **facade pattern**: `<YouTubeEmbed>` renders a poster image with a play button and only injects the iframe on click or Enter. A YouTube iframe costs roughly 500KB–1MB and multiple third-party requests; a page listing twelve sermons must not pay that twelve times. It also means `youtube-nocookie.com` is only ever contacted after a deliberate user action, which is the better privacy default.

Rules: never autoplay, never mute-autoplay a background video, always allow fullscreen, always use `youtube-nocookie.com`, always provide a link out to YouTube for anyone who prefers it. The livestream state (live / not live / scheduled) is a field staff set in `siteSettings` — a manual boolean that always works beats a YouTube API polling integration that breaks quietly and requires a key we would rather not manage.

Captions are YouTube's responsibility, but they are a real accessibility obligation: the church should enable auto-captions and correct them on the featured message at minimum.

---

## 7. Galleries

One reusable system, driven by Sanity `gallery` documents, used by Pathfinders, Adventurers, events, and `/gallery`.

- **Masonry** via CSS `columns` with `break-inside: avoid` — no JavaScript layout library, no measurement pass, no reflow jank. Order is editor-controlled and reading order matches visual order.
- **Horizontal sequences** via native scroll-snap for moments that benefit from a filmstrip feel, always with visible controls and full keyboard support.
- **Lightbox** that is a proper dialog: focus-trapped, Escape to close, arrow keys to navigate, focus restored to the trigger, background scroll locked, caption and credit visible, swipe on touch. The image loads at a viewport-appropriate size, not full resolution.
- **Thumbnails** lazy-load below the first row; the first row is eager so a gallery does not appear empty on arrival.
- **Video items** sit in the same grid with a play affordance and open the YouTube facade rather than the image lightbox.

The usability floor, stated plainly: a gallery must be navigable by keyboard, announce itself sensibly to a screen reader, work with motion disabled, and never trap scroll. Any interaction idea that compromises one of those is not used, however good it looks.
