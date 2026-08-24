# Implementation Plan

---

## 1. Proposed component tree

Server Components unless marked. `[C]` marks a Client Component, and every one of them is justified in one clause — that discipline is what keeps an animated site from becoming a client-side app.

```
app/layout.tsx
└── fonts, <html lang="en">, base metadata, JSON-LD, <SkipToContent>
    │
    └── (site)/layout.tsx
        ├── <SiteHeader>
        │   ├── <Logo>
        │   ├── <PrimaryNav>              Visit · About · Ministries · Events · Watch
        │   ├── <ThisSabbathLink>         quiet text link, always visible
        │   ├── <GiveButton>              url from siteSettings
        │   └── [C] <MobileNavSheet>      focus trap, open state
        │       └── nav + service times + address + phone
        │
        ├── {children}
        │
        └── <SiteFooter>
            └── address · times · nav · ministries · prayer · give · social · SECC · /studio

(site)/page.tsx  — homepage, one GROQ fetch, ten chapters
├── [C] <ChapterAtmosphere>              one scroll listener → CSS custom properties
├── <ArrivalChapter>
│   └── [C] <PointerParallax>            pointer→MotionValue mapping
│       ├── <AtmosphericBackground>      CSS gradients bound to --light-*
│       ├── [C] <CloudParallax>          scroll + drift transforms
│       ├── [C] <ParallaxMedia>          hero plate
│       └── <HeroContent>                server-rendered children: h1, times, CTAs
├── <ThisSabbathChapter>                 + [C] <Reveal>
├── <BelongChapter>                      + [C] <Reveal>, <ParallaxMedia> ×3, <RevealText>
├── <MinistriesChapter>
│   ├── [C] <MinistrySwitcher>           desktop: active index state
│   └── <MinistryList>                   mobile: stacked photographic rows
├── <EventsChapter>                      rows, + [C] <Reveal>
├── <StoryChapter>                       + [C] <ParallaxMedia>, <RevealText>
├── <WatchChapter>
│   ├── [C] <YouTubeEmbed>               facade, iframe on interaction
│   └── <LiveIndicator>
├── <PrayerChapter>                      dusk register, + [C] <Reveal>
├── <HopeChapter>                        + [C] <RevealText>
└── <InvitationChapter>                  facts, static map, JSON-LD

components/ui/
├── Button · Link · Eyebrow · Rule · Field · ScriptureQuote · Prose · Time
└── [C] Dialog                           focus trap, Escape, scroll lock

components/media/
├── SanityImage                          next/image + hotspot + LQIP + required alt
├── MediaPlate                           full-bleed image + caption + credit
├── [C] YouTubeEmbed                     facade
├── Gallery                              masonry via CSS columns
├── [C] HorizontalGallery                native scroll-snap + controls
└── [C] Lightbox                         built on Dialog

components/motion/
├── [C] Reveal · RevealText
├── [C] ParallaxMedia · CloudParallax · PointerParallax
├── [C] AtmosphericBackground · ChapterAtmosphere
└── hooks: usePrefersReducedMotion · useFinePointer · useSectionScroll

components/forms/
├── [C] PrayerForm · ContactForm · RegistrationForm
└── each: real <form> + Server Action + useActionState + shared zod schema

components/ministries/
├── [C] MinistrySwitcher · MinistryList
└── pathfinders/  PathfinderHero · ClassGrid · AdventureTimeline · StatBand
```

Client Component count on the homepage: eleven wrappers, none of which contain content. All copy and imagery is server-rendered and passed through as `children`.

---

## 2. Phases

Each phase ends in something reviewable in a browser, and each has an explicit exit condition. Phases 2 and 3 are ordered deliberately: **the CMS lands before the motion work**, so church staff can begin entering real content and uploading real photography while we build the interactions. Content is the long-lead item on this project, not code.

### Phase 0 — Repository and foundations

Initialize git and the Next.js 16 app in the repository root with strict TypeScript, Tailwind v4, and pnpm, removing the starter boilerplate we will not use. Pin Node and pnpm via `engines`, `packageManager`, and `.nvmrc`. Configure ESLint flat config, Prettier with the Tailwind v4 `tailwindStylesheet` option, and the seven scripts.

Create `src/env.ts` with **lazily-validated grouped** environment accessors, `.env.example` with documented placeholders, and `src/config/site.ts` for non-secret constants. Establish the typography foundation with `next/font/google` for Newsreader and Instrument Sans, exposed as CSS variables. Create a minimal `globals.css`: base reset, body defaults, font variables, text rendering, a visible `:focus-visible` foundation, and the `prefers-reduced-motion` baseline — and nothing else, since the color, space, and section systems belong to Phase 1.

Establish the two service boundaries without implementing either service: the three Supabase clients (`client.ts`, `server.ts`, and a `server-only` `admin.ts` carrying an explicit warning that it bypasses RLS), and the Sanity client via `next-sanity` plus a `pnpm sanity:ping` script that runs one trivial GROQ query to prove the configuration works end to end. No tables, no migrations, no RLS, no auth UI, no middleware, no schemas, no Studio.

Write the GitHub Actions workflow (install, typecheck, lint, format:check, build) and the README. Ship the smallest valid application shell — enough to prove Next renders, fonts load, Tailwind compiles, and the production build succeeds.

_Exit:_ `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, and `pnpm build` all pass on a clean checkout **with no `.env.local` present**, with no suppressed errors, no `@ts-ignore`, and no weakened strict mode.

Two deliberate limitations to report rather than hide: the CI workflow is unverified until a git remote exists, and Vercel is not connected, since nothing is pushed in this phase.

### Phase 1 — Design system and static homepage

Building on the Phase 0 typography foundation, define every color, type, space, and motion token in `globals.css` via `@theme`. Build `components/ui/` and `components/layout/` — header with its scroll state, mobile sheet, footer, container, chapter wrapper. Build `SanityImage` and `MediaPlate` against AI-generated placeholder images produced under the policy in `MEDIA-STRATEGY.md`: composition-accurate for aspect ratio, focal point, light, and density, with no generated identifiable faces and no generated children. Then compose all ten homepage chapters **with no motion at all**, using typed fixture objects whose shapes match the planned Sanity schemas exactly, so Phase 2 is a data-source swap rather than a rewrite. Build a `/design` route showing every token, type specimen, and component state for review.

_Exit:_ the full homepage renders, statically and motionlessly, and looks like a finished editorial page. This is the most important review gate in the project — if the still page is not beautiful, no amount of motion will save it, and we would rather learn that in week two.

**As built.** Three deviations, all deliberate:

- **The `--color-*`, `--text-*` and `--radius-*` theme namespaces are reset, not extended.** Tailwind's defaults do not exist alongside the bespoke scale, so `bg-red-500`, `text-3xl` and `rounded-xl` emit no rule at all. The design system is upheld by the build rather than by review discipline. `rounded-full` survives, since it is a static utility rather than a scale value, and genuinely circular elements need it.
- **Photographic slots render `MediaPlaceholder` rather than AI-generated imagery.** A tonal surface printing the brief for the shot it awaits. This keeps the homepage readable as a live shot list and makes it impossible for a placeholder to be mistaken for finished work. Generating placeholder imagery to evaluate composition remains available and is unblocked.
- **The ministries chapter ships its stacked composition at every width.** The pointer-driven desktop switcher is motion and belongs to Phase 3. The stacked version is the reduced-motion state, the no-JavaScript state, and the final mobile design, so Phase 3 layers the switcher over something that already works rather than being the only thing that does.

Two contrast defects in the specified palette were found by measurement and corrected at the token level: `dawn` failed the 3:1 non-text floor while serving as the focus ring colour, and `ink-45` was below 4.5:1 for the 12–14px text it carries. The focus ring is now two-tone, so it holds against photographs and sky gradients where no single colour can be guaranteed. `pnpm check:contrast` reads the palette out of `globals.css` and runs in CI, so this class of defect cannot return silently.

### Phase 2 — Sanity Studio and content wiring

Author every schema type and object from `CMS-ARCHITECTURE.md`, with field groups, descriptions, validation, and previews. Build the desk structure with pinned singletons. Mount Studio at `/studio`. Write the GROQ queries with explicit projections and run typegen. Replace Phase 1 fixtures with real fetches, one chapter at a time. Build `/this-sabbath`, `/events`, `/events/[slug]`, `/ministries`, `/ministries/[slug]`, `/watch`, `/watch/[slug]`, `/about`, `/visit`, `/give`, and `/[slug]`. Wire the Presentation tool with route resolution, draft mode, and Visual Editing. Build `/api/revalidate` with signature verification and tag-based revalidation. Build `scripts/check-placeholders.ts` and wire it into the production build so a published page referencing non-`church-photo` media fails the build. Seed placeholder content for every type, upload placeholder assets with hotspots and alt text, then **sit with church staff and have them update a Sabbath program themselves** — that session, not our own testing, is what proves the CMS works.

_Exit:_ every public route renders from Sanity; a staff member has published a change and seen it live; `pnpm typecheck` catches a deliberately broken query.

### Phase 3 — Motion system

Build the primitives in `components/motion/`, in order of leverage: `Reveal`, then `ParallaxMedia`, then `ChapterAtmosphere`, then `CloudParallax` and `PointerParallax`, then `RevealText`. Wire `LazyMotion` with `domAnimation` and the `m` component. Apply motion chapter by chapter following `HOMEPAGE-EXPERIENCE.md`. Build the ministry switcher and its mobile counterpart. Verify each primitive in four modes — full motion, reduced motion, keyboard-only, touch — before moving to the next. Add Lighthouse CI with the budgets from `MOTION-SYSTEM.md`.

_Exit:_ the homepage motion matches the specification; the reduced-motion homepage is identical to the Phase 1 static page; homepage client JavaScript is under 120KB gzipped; Lighthouse mobile performance is 90+.

### Phase 4 — Pathfinders and the gallery system

Build the reusable gallery system — masonry, horizontal scroll-snap sequences, and the lightbox — then the flagship Pathfinders page and the Adventurers page on top of it. Backfill the same gallery system into `/gallery` and event detail pages.

_Exit:_ the Pathfinders page is the page a parent would send to another parent; the gallery is fully keyboard-navigable and works with motion disabled.

### Phase 5 — Supabase, forms, and authentication

Write and apply the migrations: enums, tables, triggers, RLS policies, `has_role` and `has_min_role`, and the custom access token hook. Build the three Supabase clients and the session-refresh middleware. Build `/prayer` and `/contact` with Server Actions, zod validation, honeypot and timing checks, and rate limiting. Build `/login`, `/forgot-password`, `/reset-password`, and `/auth/confirm`, with signups disabled at the project level. Build the minimum viable `/dashboard`: prayer queue with status and assignment, contact submissions, and admin-only role management. Then **test RLS adversarially** — attempt every read and write as `anon`, as a bare `member`, and as a `ministry_leader`, and confirm each is refused at the database rather than in the UI.

_Exit:_ a prayer request submitted by a signed-out visitor is invisible to every role below `staff`, verified by direct query, not by the interface.

### Phase 6 — Polish, accessibility, performance, launch

Full accessibility pass: automated `axe`, then a manual keyboard-only walkthrough of every route, a screen-reader pass over the homepage, ministry switcher, and lightbox, and contrast verification on the dusk register. SEO: metadata on every route, JSON-LD for `Church`, `Event`, and `VideoObject`, `sitemap.xml` from Sanity, `robots.txt`. Designed 404 and error states. Performance: image budget audit, bundle analysis, Core Web Vitals against a real mid-tier phone on throttled 4G. Add analytics with a privacy-respecting configuration and no tracking of prayer request content. Apply the CSP with a nonce. Replace every Priority 1 placeholder with real photography and confirm the placeholder report is empty. Verify the DNS cutover plan.

_Exit:_ WCAG 2.1 AA, LCP under 2.5s on a real device, zero Priority 1 placeholders, launch approved.

### Phase 7 — Handover

Rehearse the Sanity and Supabase migrations against throwaway projects, then execute the real transfers. Transfer the GitHub repository and Vercel project. Move the domain. Write and record a short staff guide: how to update This Sabbath, add an event, add a sermon, upload photos, and read the prayer queue. Ensure at least two staff members hold admin on every service and that credentials live in a shared password manager. Then a training session, in person, with staff doing the tasks themselves.

_Exit:_ the church owns everything, and two people who are not us can run the site.

---

## 3. The Pathfinders page

The flagship. Specified here because it is the largest single build in Phase 4, and because it needs more energy than the rest of the site without breaking the church's visual identity. The rule: same typography, same grid, same restraint — more movement, more photography, warmer light.

**Hero.** Full-bleed outdoor photography of the club, ideally in uniform, in real landscape. Newsreader `display-1`: "Adventure, on purpose." Beneath it, grades 5–12, meeting time, and two actions — Register and Contact the director. Scroll and pointer parallax as in the homepage hero, tuned slightly warmer.

**Mission.** Short first-person prose about what Pathfinders is for, adapted from the club's existing description, at a proper measure. A scripture in Newsreader italic.

**What we do.** Not an icon grid. Four to six full-bleed photographic plates alternating with short text — camping, hiking, honors and crafts, service in the community, drill and ceremony, friendship. Each plate captioned with a real place and date.

**Adventures timeline.** A horizontal, scroll-snapping sequence of past and upcoming trips, each with an image, title, date, and one sentence. Native scroll with buttons and full keyboard support. This is the single most persuasive element on the page for a parent, because it shows a club that actually goes places.

**Statistics band.** Three or four numbers, set in Newsreader at display size with the label beneath — members, honors earned, years running, service hours. Numbers count up only once, only on first entry, over 800ms, and render at their final value under reduced motion. Real numbers from Sanity, or the band is omitted; invented statistics on a children's ministry page would be indefensible.

**Photo and video story.** Gallery in masonry, plus one or two YouTube recap videos through the facade embed.

**The eight classes.** Friend, Companion, Explorer, Ranger, Voyager, Guide, Pioneer, Navigator — as a hairline-ruled list with age range and a one-line description each, reading as a progression rather than eight identical cards, because a progression is what it is.

**Calendar and upcoming meeting.** The next meeting date and time prominently, then upcoming club events as rows from Sanity.

**Leadership and safety.** The director and staff with photographs and names, followed by the Safe Kid Policy stated plainly: every volunteer is screened, trained, and background-checked. This is placed immediately after the faces on purpose — it is the thing a parent most needs to read, and burying it would be a mistake.

**Registration.** Clear, single action. External form initially; a Supabase-backed `ministry_registrations` form later if staff want it, with `photo_consent` as a required checkbox.

**Reduced motion and mobile** follow the same rules as the homepage: no pointer effects, parallax reduced, horizontal sequences become native swipe carousels, counters render final values, reveals collapse to the finished page.

---

## 4. Risks

**Content, not code, is the critical path.** The site's quality is bounded by its photography, and there is none yet. Mitigation: the shot list ships in Phase 0, Phase 1 is built against composition-accurate placeholders, and the placeholder report makes the gap visible every week rather than at launch.

**The Sabbath program going stale.** The most valuable feature is the one that requires weekly human effort. If it is not updated by week three, it will never be. Mitigation: make the edit genuinely fast, have staff do it themselves in Phase 2, build the graceful fallback to the last published program, and name a specific person responsible before launch rather than "the office."

**Motion overreach.** The natural failure mode of a brief like this is a beautiful demo that is exhausting to use. Mitigation: the Phase 1 gate requires the motionless page to be excellent, the motion budget in `HOMEPAGE-EXPERIENCE.md` is a ceiling rather than a target, and reduced motion is tested continuously rather than at the end.

**Unverified facts.** Several items in `PRODUCT-VISION.md` are marked _needs confirmation_, including the AdventistGiving URL, the YouTube channel, the Wednesday prayer meeting, and the current ministry directors. Publishing a wrong service time or a dead giving link is worse than publishing nothing. Mitigation: a single confirmation pass with staff in Phase 0, and no launch with an unconfirmed fact on the page.

**Scope drift toward a custom admin.** Once a dashboard exists, someone will ask for event editing in it. Mitigation: the boundary in `INFORMATION-ARCHITECTURE.md` is the standing answer — if the public reads it, it lives in Studio.

**Photography of minors.** Publishing children's photographs without a written consent policy is both an ethical and a liability problem. Mitigation: the policy is established before any such image is published, and `photo_consent` is a database column rather than an assumption.

**AI placeholder imagery reaching production.** A church's central asset is honesty, and a single generated image surviving to launch does damage out of proportion to the convenience it bought. There is also a subtler failure: generated imagery is persuasive enough that reviewers bond with scenes that do not exist, and real photography of 274 actual people then reads as a downgrade. Mitigation, in three layers: no generated identifiable faces and no generated children at all, so a leaked placeholder cannot misrepresent a person; a required `provenance` enum on every image so the state of the library is always knowable; and a build-time gate that fails production if any published page references non-`church-photo` media.

---

## 5. Definition of done, for every phase

- Typecheck, lint, and build pass; CI green.
- Every route renders correctly at 375px, 768px, 1280px, and 1920px.
- Every route is fully usable with keyboard only, with visible focus throughout.
- Every route is correct and complete with `prefers-reduced-motion: reduce`.
- Every image has meaningful alt text and explicit dimensions.
- No hardcoded project ID, URL, key, or church-specific fact in source.
- No new dependency without a line in `TECHNICAL-ARCHITECTURE.md` explaining it.
- No `"use client"` without a one-sentence justification.
