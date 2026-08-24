import { createClient } from '@sanity/client'

import { sanityEnv } from '@/env'

/**
 * Read-only Sanity client for published content.
 *
 * Phase 0 establishes the boundary: no module outside `src/sanity/` constructs a
 * Sanity client or a Sanity URL, so moving to a church-owned project is a change of
 * environment variables rather than a change to application code.
 *
 * Phase 2 replaces `@sanity/client` here with `next-sanity`, which re-exports the
 * same `createClient` and adds live queries, draft perspectives and Visual Editing.
 * That swap is deliberately deferred: at the time of writing, `next-sanity@13`
 * pins `@sanity/client@^7` while `sanity@6` pulls `@sanity/client@8`, and there is
 * no reason to adopt that conflict before Studio actually needs it.
 */
let cachedClient: ReturnType<typeof createClient> | undefined

export function getSanityClient() {
  if (cachedClient) return cachedClient

  const env = sanityEnv()

  cachedClient = createClient({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
    // Served from Sanity's CDN. Freshness is handled by tag-based revalidation
    // driven from a publish webhook, not by bypassing the cache on every request.
    useCdn: true,
    perspective: 'published',
  })

  return cachedClient
}
