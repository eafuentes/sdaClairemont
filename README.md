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
| `SANITY_API_READ_TOKEN`                | Phase 2       | Server-only. Drafts for Visual Editing                  |
| `SANITY_REVALIDATE_SECRET`             | Phase 2       | Server-only. Webhook signature                          |
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

| Script              | Purpose                                                       |
| ------------------- | ------------------------------------------------------------- |
| `pnpm dev`          | Start the development server                                  |
| `pnpm build`        | Production build                                              |
| `pnpm start`        | Serve a production build locally                              |
| `pnpm lint`         | ESLint (flat config; `next lint` no longer exists in Next 16) |
| `pnpm lint:fix`     | ESLint with autofix                                           |
| `pnpm typecheck`    | `tsc --noEmit`                                                |
| `pnpm format`       | Write Prettier formatting                                     |
| `pnpm format:check` | Verify formatting without writing                             |
| `pnpm sanity:ping`  | Verify the configured Sanity project is reachable             |

Before opening a pull request, run `pnpm typecheck`, `pnpm lint`, `pnpm format:check` and `pnpm build`. CI runs exactly these four.

## Architecture

The governing principle is that **Sanity and Supabase have different responsibilities and are not competing databases**. If the public should read it, Sanity owns it. If a person submitted it privately, Supabase owns it.

### Sanity — public editorial CMS

Owns everything the public reads: homepage content, Sabbath programs, events, announcements, ministries, Pathfinders and Adventurers content, sermons, leadership, galleries, testimonials, service times, resources, SEO metadata, and external destinations including the AdventistGiving URL and YouTube links.

Sanity exists so that non-technical church staff can publish without a deployment. Studio will be embedded at `/studio` with Presentation and Visual Editing so editors preview and click-to-edit the real site.

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

Real church photography does not exist yet. Phase 1 is designed against AI-generated placeholders used purely to evaluate composition, under a firm policy: atmosphere, interiors, hands, backs and distance only, with **no generated identifiable faces and no generated children**. Every image carries a required `provenance` field, and a build-time check fails production if any published page still references non-`church-photo` media. See `docs/MEDIA-STRATEGY.md`.

## Phase status

| Phase                                               | Status      |
| --------------------------------------------------- | ----------- |
| Planning and architecture                           | Complete    |
| Phase 0 — technical foundation                      | **Current** |
| Phase 1 — design system and static homepage         | Not started |
| Phase 2 — Sanity Studio, schemas and content wiring | Not started |
| Phase 3 — motion system                             | Not started |
| Phase 4 — Pathfinders and the gallery system        | Not started |
| Phase 5 — Supabase, forms and authentication        | Not started |
| Phase 6 — accessibility, SEO, performance, launch   | Not started |
| Phase 7 — handover to church-owned infrastructure   | Not started |
