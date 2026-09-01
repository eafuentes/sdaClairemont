# CMS Architecture (Sanity)

Sanity is the editorial CMS for everything the public reads. The measure of success is not schema elegance — it is whether a church volunteer can update This Sabbath on a Thursday evening without calling anyone.

---

## 1. Editor-first design rules

These constraints shape every schema below.

- **Field groups and clear titles.** Long documents are split into tabs (Content, Media, Details, SEO), so a `sabbathProgram` is not an intimidating wall of 15 inputs.
- **Descriptions on every non-obvious field**, written for a volunteer rather than a developer. "Paste the full YouTube link" beats "videoUrl".
- **Validation that teaches.** Required fields are required in the schema with useful messages. A missing image `alt` blocks publish. A malformed YouTube URL is caught at entry, not at render.
- **Meaningful previews.** Every document type has a `preview` with title, subtitle, and thumbnail, so lists are scannable — a Sabbath program list should read as dates and sermon titles, not "Untitled".
- **Custom desk structure.** Editors see task-oriented groups (This Sabbath, Events, Ministries, Sermons, People, Pages, Site Settings), not an alphabetical list of schema types.
- **Singletons are singletons.** `siteSettings`, `homePage`, and `prophecyPage` are pinned in the structure with document actions restricted so nobody can create a second one or delete the only one.
- **No naked Portable Text everywhere.** Rich text is used where prose belongs; structured fields are used where structure belongs. A "time" is a field, not a sentence inside a paragraph.

---

## 2. Document types

### Singletons

**`siteSettings`** — the facts that appear everywhere.

Groups: _Identity_ (church name, short name, tagline, mission statement, logo) · _Service times_ (repeating list of `serviceTime` objects: label, day, start time, end time, notes, `isPrimary`) · _Contact_ (address object with street/city/state/zip/lat/lng, phone, email, Google Maps URL, driving directions text) · _External destinations_ (AdventistGiving URL, YouTube channel URL, Facebook URL, other social links, Sabbath School lesson resource links) · _Livestream_ (`isLive` boolean, current livestream URL, next stream date, an editor note explaining that `isLive` is manual) · _Navigation_ (primary nav items, footer column configuration) · _SEO defaults_ (default title template, description, OG image).

Putting the AdventistGiving URL and service times here — rather than in code or environment variables — is the difference between a five-second edit and a deployment.

**`homePage`** — chapter-by-chapter control of the narrative.

Rather than a free-form page builder (which invites editors to break a carefully-composed narrative), this is a fixed set of named chapter objects matching the ten homepage chapters, each with the fields that chapter actually needs, and each with an `isVisible` toggle plus an optional order override. Editors can change words, images, and whether a chapter appears — they cannot accidentally produce a homepage with four hero sections. Chapters: arrival (headline, subhead, primary/secondary CTA, background media, atmosphere image), thisSabbath (intro copy only — the program itself is fetched live), belong (headline, body, image set, testimonial references), ministries (headline, intro, ordered ministry references), events (headline, count to show), story (headline, Portable Text, mission emphasis, media plate), watch (headline, featured sermon reference or "latest"), prayer (headline, invitation copy, scripture), hope (scripture, attribution, atmosphere image), invitation (headline, body, what-to-expect bullets, CTA, map emphasis).

**`prophecyPage`** — the prophetic timeline at `/prophecy`.

Staff edit the spine dates, copy, objections, fold, and empire alignments. They never place stars: the constellation is derived from the dates. A `propheticDate` object holds era, year, optional season, and the display string a reader sees.

### Content documents

**`sabbathProgram`** — the most operationally important type.

`date` (required, unique, validated to a Saturday with a warning rather than a hard error) · `sermonTitle` · `speaker` (reference to `person`, or a free-text `speakerName` + `speakerRole` for visiting speakers — both supported, because guest speakers are common and forcing a `person` document for a one-time visitor is friction) · `scripture` (array of reference strings, e.g. "John 3:16-17") · `sermonSummary` (short text) · `sabbathSchoolTime` and `worshipTime` (defaulting from `siteSettings`, overridable for special Sabbaths) · `specialMusic` (array of objects: title, performer) · `announcements` (array of references to `announcement`, plus inline one-offs) · `bulletin` (file, PDF) · `livestreamUrl` · `image` · `featuredMessage` (Portable Text, short) · `isSpecialService` + `specialServiceLabel` (Communion, Baptism, Youth Sabbath) · `status` (draft/published — Sanity's own draft system covers this, so likely omitted).

The homepage resolves "the appropriate upcoming Sabbath" in GROQ: the program whose `date` is greater than or equal to today, ordered ascending, first result — with a fallback to the most recent past program so the section never renders empty if staff are behind. Date comparison happens in `America/Los_Angeles` (see `src/lib/sabbath.ts`), because a UTC comparison flips over at 4 or 5 PM Pacific and would show next week's program on Saturday afternoon.

**`event`** — `title`, `slug`, `description` (Portable Text), `shortDescription`, `startDateTime` (required), `endDateTime`, `isAllDay`, `location` (either a reference to the church address in settings via an `atChurch` boolean, or a custom location object), `ministry` (reference), `image`, `registrationUrl`, `externalUrl`, `featured`, `recurrence` (a simple object: frequency, interval, day-of-week, until — enough for "second Sunday monthly" without implementing RFC 5545), `cost`, `ageRange`, `contactPerson` (reference).

**`ministry`** — `name`, `slug`, `shortDescription` (one sentence, used in the switcher), `description` (Portable Text), `ageRange`, `meetingSchedule` (structured: array of day/time/frequency/notes — this is how Adventurers' "twice monthly on Sundays during the school year" gets expressed properly), `leaders` (references to `person`), `heroImage`, `switcherImage` (the photograph that appears when a visitor hovers this ministry — deliberately a separate field, since the switcher needs a wide atmospheric frame while the hero needs headroom for type), `gallery` (reference), `videos` (references to `sermon`/video), `registrationUrl`, `externalLinks`, `resources` (references), `order`, `featured`, `accentTone` (dawn / sage / sky — lets each ministry carry a slightly different temperature without an editor picking arbitrary colors), plus optional Pathfinder-specific fields grouped and conditionally shown: `classes` (the eight Pathfinder classes as an array of name/description/ageRange), `statistics` (label/value/description), `timeline` (array of adventure entries: title, date, description, image), `safetyPolicy` (Portable Text — the Safe Kid Policy is a genuine trust asset and deserves a real field).

**`sermon`** — `title`, `slug`, `date`, `speaker` (reference or free text), `scripture` (array), `description`, `youtubeUrl` (validated), `thumbnail` (optional override), `duration`, `series` (reference to a lightweight `series` type, added only when the church actually uses series), `ministry` (reference), `featured`, `sabbathProgram` (optional back-reference), `notesFile`.

**`person`** — `name`, `slug`, `role`, `roleCategory` (pastoral / elder / ministry leader / staff), `bio` (Portable Text), `image`, `email`, `phone`, `showContactPublicly` (boolean — an elder may not want their phone on the internet, and the schema should let them say so), `ministries` (references), `order`.

**`announcement`** — `title`, `body` (Portable Text), `startDate`, `endDate` (auto-expiring so stale announcements disappear without anyone remembering to delete them), `priority`, `link`, `ministry`, `showOnHomepage`.

**`gallery`** — `title`, `slug`, `description`, `date`, `ministry` (reference), `layout` (masonry / horizontal sequence), `items` (array of image objects with caption, credit, and required alt, plus video items), `coverImage`, `featured`.

**`testimonial`** — `quote`, `person` (reference or free text name), `role`, `image`, `ministry`, `featured`. Used in the Belong chapter. Real words from real members are worth more than any amount of design.

**`page`** — flexible editorial pages (`/visit`, `/about`, `/give`, `/about/beliefs`, and anything staff create later). `title`, `slug`, `heroImage`, `intro`, `content` (Portable Text with a constrained set of custom blocks: image plate, scripture quote, CTA, gallery embed, video embed, link list, accordion), `seo`. The block set is deliberately small — an unconstrained page builder is how a considered design becomes an inconsistent one.

**`resource`** — downloadable files and external links: `title`, `description`, `file` or `url`, `category`, `ministry`, `order`.

### Objects (reusable)

`seo` (title, description, ogImage, noIndex) · `imageWithAlt` (see below) · `link` (internal reference or external URL, with label and `opensInNewTab` derived rather than asked) · `cta` (label + link + variant) · `serviceTime` · `address` · `meetingSchedule` · `videoRef` (YouTube URL + title + thumbnail) · `statistic` · `timelineEntry` · `scriptureRef` (book, chapter, verses, translation) · `blockContent` (the standard Portable Text configuration).

**`imageWithAlt`** is used for every image in the system, and carries: the image asset (with hotspot and crop enabled), a **required** `alt`, optional `caption` and `credit`, `provenance` (a required enum — `church-photo` / `ai-placeholder` / `stock-placeholder`, defaulting to nothing so the editor must choose), `provenanceNote` (required unless provenance is `church-photo`, recording the generator or license), and `consentConfirmed` (required to publish when the image depicts identifiable people).

Making alt a required field on a reusable object is the cheapest accessibility win available. Making `provenance` a required enum on the same object is what makes the launch gate in `MEDIA-STRATEGY.md` enforceable: `scripts/check-placeholders.ts` can query for any published document referencing media whose provenance is not `church-photo` and fail the production build. Both requirements are enforced by the CMS rather than by developer discipline, which is the only way they survive contact with a real editing workflow.

---

## 3. Studio configuration

Studio mounts at `/studio` in the same Next.js app, which keeps preview and editing on one origin and means no separate deployment to hand over. A dedicated `studio.` subdomain remains available later without code changes.

- **Structure**: a hand-built desk in `sanity/structure.ts` grouping by editorial task, with `siteSettings`, `homePage`, and `prophecyPage` as pinned singletons, Sabbath Programs sorted by date descending with the upcoming one first, Events split into Upcoming and Past, Ministries in display order, and a "Needs attention" list surfacing documents with placeholder images or missing alt text.
- **Presentation tool** (`presentationTool` from `sanity/presentation`) configured with `previewUrl` pointing at the site and a `resolve` map from document type to route, so an editor opening a `sabbathProgram` sees the actual `/this-sabbath` page beside the form.
- **Visual Editing**: `defineLive`/`sanityFetch` from `next-sanity` with stega encoding enabled in draft mode only, plus `<VisualEditing />` mounted when draft mode is active. Editors click rendered text on the real page and land on the right field. Stega is never enabled in production, so no encoded characters reach public HTML.
- **Draft mode** enabled through a signed route handler that Presentation calls, and disabled by a matching route. Draft content is never cached.
- **Vision plugin** available to developers for GROQ debugging.
- **Roles**: Sanity project roles map to real people — Administrator for the technical owner and one staff lead, Editor for pastors and the office, and Contributor (create/edit drafts, cannot publish) for ministry volunteers. Pathfinder and Adventurer leaders should be able to draft their own content and have someone publish it.

---

## 4. Queries and types

GROQ lives in `sanity/queries/`, one file per domain (`home.ts`, `sabbath.ts`, `events.ts`, `ministries.ts`, `sermons.ts`, `pages.ts`, `settings.ts`), with every query `defineQuery`-wrapped so Sanity typegen can produce result types.

Rules:

- **Projections are explicit.** No `*[_type == "event"]` returning whole documents. Fetch the fields the component needs, which keeps payloads small and makes it obvious when a component's needs change.
- **References are dereferenced in the query**, not in a second request. One round trip per route.
- **Image projections** always include `asset->{_id, url, metadata{dimensions, lqip}}`, `hotspot`, `crop`, and `alt`, because `<SanityImage>` needs all of them for correct cropping and zero-CLS rendering.
- **Typegen output is committed** (`sanity.types.ts`), so a schema change that invalidates a query fails `pnpm typecheck` in CI rather than rendering `undefined` in production.
- **One fetch per route**, high in the tree, passed down as props. No component fetches its own data.

Caching: `sanityFetch` calls carry cache tags per document type and per slug. The Sanity webhook posts to `/api/revalidate`, which verifies the signature, reads the document type and slug from the payload, and calls `revalidateTag` for exactly the affected tags. Publishing one event regenerates the events routes and the homepage, not the whole site.

---

## 5. What Sanity must never hold

Prayer requests, contact submissions, registrations, user accounts, roles, or anything a member submitted privately. Sanity documents are, architecturally, publishable content with a permissive read model — private pastoral information does not belong in that system at any access level. This boundary is absolute and is the reason Supabase exists in this project.
