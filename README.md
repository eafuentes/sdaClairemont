# San Diego Clairemont Seventh-day Adventist Church

The website and digital experience for the San Diego Clairemont Seventh-day Adventist Church — a congregation of roughly 274 members at 4125 Hathaway St, San Diego, meeting Saturdays for Bible study at 9:30 AM and worship at 10:45 AM.

This is a greenfield project. The previous site at `sdaclairemont.net` was used only as a source of factual information and is not being migrated.

## Stack

| Layer           | Technology                                            |
| --------------- | ----------------------------------------------------- |
| Framework       | Next.js 16 (App Router), React 19, Server Components  |
| Language        | TypeScript, strict                                    |
| Styling         | Tailwind CSS v4, CSS-first configuration via `@theme` |
| Motion          | Motion for React — the only animation dependency      |
| CMS             | Sanity — public editorial content                     |
| Backend         | Supabase — auth, private data, Row Level Security     |
| Validation      | Zod — environment and form input                      |
| Hosting         | Vercel                                                |
| Package manager | pnpm                                                  |

The dependency list is deliberately small. GSAP, Three.js, smooth-scroll libraries, component libraries, icon libraries, date libraries and form libraries are all explicitly out of scope; see `docs/TECHNICAL-ARCHITECTURE.md` for the reasoning behind each exclusion. Adding a dependency requires a line in that document explaining what it does that the existing stack cannot.

## Requirements

- Node 22.19.0 or later (`.nvmrc` pins the expected version)
- pnpm 10.18.0 or later

pnpm is the only supported package manager. Do not create npm or Yarn lockfiles.

## Installation

```bash
git clone <repository-url> sdaClairemont
cd sdaClairemont
pnpm install
```

## Environment

Copy the template and fill in what you have:

```bash
cp .env.example .env.local
```

`.env.local` is gitignored and must never be committed. `.env.example` documents every variable with a description and a safe placeholder.

Environment validation is **lazy and grouped** (`src/env.ts`). Each group is validated on first use rather than at module load, which means:

- The project installs, typechecks, lints and builds with **no `.env.local` at all**, so CI needs no credentials.
- A route that genuinely requires Sanity or Supabase fails immediately with a message naming the missing variable and the phase it belongs to.

Variables, by group:

| Variable                               | Required from | Notes                                                   |
| -------------------------------------- | ------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | Phase 0       | Canonical origin. Falls back to `http://localhost:3000` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`        | Phase 2       | Public project identifier                               |
| `NEXT_PUBLIC_SANITY_DATASET`           | Phase 2       | Usually `production`                                    |
| `NEXT_PUBLIC_SANITY_API_VERSION`       | Phase 2       | Pinned `YYYY-MM-DD` date                                |
| `SANITY_API_READ_TOKEN`                | Phase 2       | Server-only. Viewer token for drafts and Presentation   |
| `SANITY_REVALIDATE_SECRET`             | Phase 2       | Server-only. Webhook signature                          |
| `SANITY_API_WRITE_TOKEN`               | Phase 2 seed  | Server-only. Editor token for `pnpm sanity:seed` only   |
| `NEXT_PUBLIC_SUPABASE_URL`             | Phase 5       | Project URL                                             |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Phase 5       | Browser-safe; constrained by Row Level Security         |
| `SUPABASE_SECRET_KEY`                  | Phase 5       | Server-only. **Bypasses Row Level Security**            |

Anything prefixed `NEXT_PUBLIC_` is inlined into the browser bundle. Never put a secret behind that prefix. `SUPABASE_SECRET_KEY` is read only by `src/lib/supabase/admin.ts`, which imports `server-only` so that a mistaken client import fails the build rather than leaking at runtime.

Deployments must set `NEXT_PUBLIC_SITE_URL` explicitly, or canonical URLs, the sitemap and social images will point at localhost.

## Development

```bash
pnpm dev
```

Then open http://localhost:3000.

## Scripts

| Script                    | Purpose                                                                 |
| ------------------------- | ----------------------------------------------------------------------- |
| `pnpm dev`                | Start the development server                                            |
| `pnpm build`              | Production build                                                        |
| `pnpm start`              | Serve a production build locally                                        |
| `pnpm lint`               | ESLint (flat config; `next lint` no longer exists in Next 16)           |
| `pnpm lint:fix`           | ESLint with autofix                                                     |
| `pnpm typecheck`          | Regenerates route types, then `tsc --noEmit`                            |
| `pnpm format`             | Write Prettier formatting                                               |
| `pnpm format:check`       | Verify formatting without writing                                       |
| `pnpm check:contrast`     | Check the palette against WCAG contrast floors                          |
| `pnpm check:classes`      | Check every colour utility compiles to a rule (needs a build)           |
| `pnpm check:bundle`       | Check the homepage JavaScript budget (needs a build)                    |
| `pnpm check:schema`       | Compile and validate the Sanity schema graph                            |
| `pnpm check:types`        | Check the committed Sanity types match the schemas and queries          |
| `pnpm check:placeholders` | Fail a production deploy if published CMS images are still placeholders |
| `pnpm typegen`            | Regenerate `schema.json` and `sanity.types.ts`                          |
| `pnpm sanity:ping`        | Verify the configured Sanity project is reachable                       |
| `pnpm sanity:seed`        | Create or replace starter documents in the Sanity dataset               |

Before opening a pull request, run `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm check:contrast`, `pnpm check:schema`, `pnpm check:types`, `pnpm build`, `pnpm check:classes` and `pnpm check:bundle`. CI runs exactly these nine, in that order — the last two read the build output, so they have to follow the build. `pnpm build` also runs `check:placeholders`, which skips unless `VERCEL_ENV=production` or `CHECK_PLACEHOLDERS=1`.

`check:schema` catches what type checking cannot see. A reference to a document type that does not exist, or a field type that was never registered, compiles and builds without complaint and then fails when the Studio loads — which for an editor means a blank screen and no explanation. It needs no credentials, so it runs in CI like everything else.

`check:types` exists because `sanity.types.ts` is generated and committed, and generated files that are committed drift. If a GROQ projection stops selecting a field and nobody reruns typegen, nothing complains — the stale types still describe a valid shape. That is worse than an ordinary type error, because the compiler goes on confirming that `program.speakerRole` is a string while the query stopped returning it and it is `undefined` at runtime. Typegen's whole value is that the compiler knows what the API returns; a stale file inverts that into a falsehood the compiler now enforces. The check regenerates into a scratch copy and compares rather than rewriting, so the diff reaches review instead of a CI job silently fixing what it was meant to measure. Fix a failure with `pnpm typegen`.

Both generated artefacts are committed so that a clean checkout type-checks without Sanity credentials.

`check:classes` exists because of a failure mode that nothing else catches. Tailwind resolves utilities by scanning source text, so a class naming a token that no longer exists is not an error — it simply produces no rule. `text-sage-deep` after `sage` is deleted looks completely normal in the JSX, typechecks, lints, and builds, and silently renders as inherited colour. The compiled stylesheet is the only place that failure is visible. The same check rejects interpolated class names such as `` `bg-${name}` ``, which cannot resolve for the same reason.

`pnpm typecheck` runs `next typegen` first. Without it, generated route types left over from a previous file layout fail a tree that is actually clean.

## Architecture

The governing principle is that **Sanity and Supabase have different responsibilities and are not competing databases**. If the public should read it, Sanity owns it. If a person submitted it privately, Supabase owns it.

### Sanity — public editorial CMS

Owns everything the public reads: homepage content, Sabbath programs, events, announcements, ministries, Pathfinders and Adventurers content, sermons, leadership, galleries, testimonials, service times, resources, SEO metadata, and external destinations including the AdventistGiving URL and YouTube links.

Sanity exists so that non-technical church staff can publish without a deployment. Studio is embedded at `/studio` with Presentation and Visual Editing so editors preview and click-to-edit the real site.

To fill an empty dataset from the fixture copy:

```bash
pnpm sanity:seed
```

That needs `SANITY_API_WRITE_TOKEN`. Sermons are skipped on purpose — the schema requires a real YouTube URL. After seeding, open `/studio`, edit This Sabbath, and publish. Configure a Sanity webhook to `POST /api/revalidate` with `SANITY_REVALIDATE_SECRET` so the published page updates without waiting for the fallback ISR window.

### Supabase — application backend

Owns authentication, user accounts, profiles, roles, prayer requests, contact submissions, registrations and any protected member or staff data. Row Level Security is enabled on every table with deny-by-default policies; authorization is enforced in Postgres, never only in the UI.

Prayer requests are pastorally confidential and are never stored in or exposed through Sanity.

### Next.js — presentation and application layer

Server Components by default. A Client Component is introduced only where interaction, pointer input or a browser API requires one, and client boundaries sit as low in the tree as possible so animated sections still render their content on the server.

### Vercel — deployment

Deploys from GitHub with preview deployments per pull request. No platform-specific configuration is required; there is deliberately no `vercel.json`.

## Project ownership and portability

Development may begin on developer-owned Sanity, Supabase and Vercel projects. The architecture is built so that migrating to church-owned infrastructure is a credential swap, not a rewrite:

- No project URL, key, project ID, dataset name or storage URL appears anywhere in source. Everything flows through `src/env.ts`.
- Church-specific facts that staff may need to change — service times, address, phone, the AdventistGiving URL — are Sanity content, not environment variables and not constants.
- Supabase schema lives in versioned SQL migrations, so a new project is reproduced by replaying them.
- Sanity content moves by dataset export and import.

The church should ultimately own the GitHub repository, Vercel project and domain, Supabase project, Sanity project, DNS, analytics, and external service accounts, with at least two staff members holding admin on each. Step-by-step runbooks are in `docs/TECHNICAL-ARCHITECTURE.md` and `docs/SUPABASE-ARCHITECTURE.md`.

## Documentation

The documents in `docs/` are the architectural source of truth. Code that contradicts them is either a bug or a decision that should be written down.

| Document                                                        | Covers                                                         |
| --------------------------------------------------------------- | -------------------------------------------------------------- |
| [PRODUCT-VISION.md](docs/PRODUCT-VISION.md)                     | Verified church facts, audiences, non-goals, success criteria  |
| [INFORMATION-ARCHITECTURE.md](docs/INFORMATION-ARCHITECTURE.md) | Sitemap, routes, navigation, content ownership boundary        |
| [TECHNICAL-ARCHITECTURE.md](docs/TECHNICAL-ARCHITECTURE.md)     | Stack, dependencies, rendering, structure, migration runbooks  |
| [CMS-ARCHITECTURE.md](docs/CMS-ARCHITECTURE.md)                 | Sanity schemas, Studio structure, Visual Editing, GROQ         |
| [SUPABASE-ARCHITECTURE.md](docs/SUPABASE-ARCHITECTURE.md)       | Tables, RLS policy matrix, auth patterns, storage              |
| [DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)                       | Visual concepts, colour, typography, grid, components          |
| [MOTION-SYSTEM.md](docs/MOTION-SYSTEM.md)                       | Motion principles, tokens, primitives, reduced motion, budgets |
| [MEDIA-STRATEGY.md](docs/MEDIA-STRATEGY.md)                     | Image pipeline, shot list, placeholder policy, video           |
| [HOMEPAGE-EXPERIENCE.md](docs/HOMEPAGE-EXPERIENCE.md)           | The ten homepage chapters, scene by scene                      |
| [IMPLEMENTATION-PLAN.md](docs/IMPLEMENTATION-PLAN.md)           | Component tree, phases, Pathfinders spec, risks                |

### A note on placeholder imagery

Real church photography does not exist yet, with one exception. Every photographic slot except the hero renders a `MediaPlaceholder`: a tonal surface printing the brief for the shot it is waiting for. This means the homepage doubles as a live shot list — the photography the site needs can be read off the page itself — and a placeholder can never be mistaken for finished work or quietly survive into production as a photograph.

The hero uses `public/images/church-exterior-golden-hour.png` — the building at golden hour, supplied and confirmed by the church on 2026-08-23, and carrying `provenance: 'church-photo'`.

**The site's palette is sampled from this frame**, so it is not an interchangeable asset. Replacing it is a design decision, and a replacement shot in different light will pull the page out of tune with its own colours. See `docs/DESIGN-SYSTEM.md` for the measured values and where each one comes from.

When AI-generated placeholders are used to evaluate composition, they fall under a firm policy: atmosphere, interiors, hands, backs and distance only, with **no generated identifiable faces and no generated children**. Every image carries a required `provenance` field, and a build-time check fails production if any published page still references non-`church-photo` media. See `docs/MEDIA-STRATEGY.md`.

## Phase status

| Phase                                               | Status      |
| --------------------------------------------------- | ----------- |
| Planning and architecture                           | Complete    |
| Phase 0 — technical foundation                      | Complete    |
| Phase 1 — design system and static homepage         | **Current** |
| Phase 2 — Sanity Studio, schemas and content wiring | Not started |
| Phase 3 — motion system                             | Not started |
| Phase 4 — Pathfinders and the gallery system        | Not started |
| Phase 5 — Supabase, forms and authentication        | Not started |
| Phase 6 — accessibility, SEO, performance, launch   | Not started |
| Phase 7 — handover to church-owned infrastructure   | Not started |
