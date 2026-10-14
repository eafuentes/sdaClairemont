import { z } from 'zod'

/**
 * Typed, lazily-validated environment access.
 *
 * Two properties are deliberate and load-bearing:
 *
 * 1. Validation is LAZY and GROUPED. A single top-level parse of the whole
 *    environment would make the repository un-installable before Phase 2 (Sanity)
 *    and Phase 5 (Supabase) are configured, and would break CI, which holds no
 *    credentials. Each group is parsed on first use instead, so a clean checkout
 *    with no .env.local still installs, typechecks, lints and builds — while a
 *    route that genuinely needs Sanity fails immediately with a readable message.
 *
 * 2. Every value is read through a STATIC `process.env.X` reference collected into
 *    an object literal. Next.js inlines individual `process.env.NEXT_PUBLIC_*`
 *    references at build time; it does not inline `process.env` as a whole. Passing
 *    `process.env` directly to a schema therefore works on the server and silently
 *    yields undefined in the browser.
 *
 * Server-only secrets live in `env.server.ts`, which is guarded by `server-only`.
 */

const DEV_SITE_URL = 'http://localhost:3000'

/**
 * Dashboard pastes often include quotes, a trailing slash, or a host with no
 * scheme. Treat those as the same intent so Vercel builds do not fail Phase 0.
 */
function asOrigin(value: string | undefined): string | undefined {
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim().replace(/^["']|["']$/g, '').replace(/\/$/, '')
  if (!trimmed) return undefined
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  return `https://${trimmed}`
}

function siteUrl(): string {
  return (
    asOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
    asOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    asOrigin(process.env.VERCEL_URL) ??
    DEV_SITE_URL
  )
}

/** Sanity project IDs are lowercase alphanumeric, typically 8 characters. */
const sanityProjectIdPattern = /^[a-z0-9]+$/

type EnvGroup = {
  /** Human label used in error messages. */
  readonly label: string
  /** Which phase introduces this group, so a failure explains itself. */
  readonly requiredFrom: string
}

function describeFailure(group: EnvGroup, error: z.ZodError): string {
  const problems = error.issues
    .map((issue) => {
      const variable = issue.path.join('.') || '(unknown variable)'
      return `  - ${variable}: ${issue.message}`
    })
    .join('\n')

  return [
    `Invalid or missing ${group.label} environment configuration.`,
    problems,
    '',
    `These variables are required from ${group.requiredFrom}.`,
    'Copy .env.example to .env.local and fill in the values.',
  ].join('\n')
}

/**
 * Builds a memoized accessor. The schema is only evaluated when the accessor is
 * first called, which is what keeps unconfigured services from breaking the build.
 */
function defineEnv<Schema extends z.ZodType>(
  group: EnvGroup,
  schema: Schema,
  read: () => unknown,
): () => z.output<Schema> {
  let cached: z.output<Schema> | undefined

  return () => {
    if (cached !== undefined) return cached

    const result = schema.safeParse(read())
    if (!result.success) {
      throw new Error(describeFailure(group, result.error))
    }

    cached = result.data
    return cached
  }
}

/**
 * Always available. Prefers NEXT_PUBLIC_SITE_URL, then Vercel's production /
 * deployment host, then localhost so `pnpm build` and CI succeed without
 * configuration. Set NEXT_PUBLIC_SITE_URL on the church Vercel project to the
 * public origin (https, no trailing slash, no quotes).
 */
export const appEnv = defineEnv(
  { label: 'application', requiredFrom: 'Phase 0' },
  z.object({
    NEXT_PUBLIC_SITE_URL: z.url(),
  }),
  () => ({
    NEXT_PUBLIC_SITE_URL: siteUrl(),
  }),
)

/**
 * Whether the Sanity group is present and well-formed, without throwing.
 *
 * Used by the fetch layer to decide whether to hit the CMS or stay on fixtures.
 * Calling `sanityEnv()` would throw on a clean CI checkout, which is the opposite
 * of what lazy grouped validation is for: the homepage must still build when
 * credentials are absent.
 *
 * The placeholder value from `.env.example` fails the project-id pattern, so copying
 * the example file does not silently count as configured.
 */
export function isSanityConfigured(): boolean {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION

  return (
    typeof projectId === 'string' &&
    sanityProjectIdPattern.test(projectId) &&
    typeof dataset === 'string' &&
    dataset.length > 0 &&
    typeof apiVersion === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(apiVersion)
  )
}

/** Editorial CMS. Browser-safe: project ID and dataset are public values. */
export const sanityEnv = defineEnv(
  { label: 'Sanity', requiredFrom: 'Phase 2' },
  z.object({
    NEXT_PUBLIC_SANITY_PROJECT_ID: z
      .string()
      .min(1, 'is required')
      .regex(sanityProjectIdPattern, 'must be lowercase alphanumeric'),
    NEXT_PUBLIC_SANITY_DATASET: z.string().min(1, 'is required'),
    NEXT_PUBLIC_SANITY_API_VERSION: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a YYYY-MM-DD date'),
  }),
  () => ({
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  }),
)

/**
 * Application backend. The publishable key is browser-safe by design; it grants
 * only what Row Level Security allows. The secret key lives in `env.server.ts`.
 */
export const supabaseEnv = defineEnv(
  { label: 'Supabase', requiredFrom: 'Phase 5' },
  z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, 'is required'),
  }),
  () => ({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  }),
)
