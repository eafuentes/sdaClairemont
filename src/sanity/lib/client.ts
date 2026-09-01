import { createClient, type SanityClient } from 'next-sanity'
import 'server-only'

import { sanityEnv } from '@/env'
import { sanityApiReadToken } from '@/env.server'

/**
 * Read-only Sanity client for published content.
 *
 * No module outside `src/sanity/` constructs a Sanity client or a Sanity URL, so
 * moving to a church-owned project is a change of environment variables rather than
 * a change to application code.
 *
 * Constructed lazily: CI and a clean checkout never call this, because the loaders
 * check `isSanityConfigured()` first. Calling `sanityEnv()` at import time would
 * throw on every build that has no credentials.
 */
let cachedPublishedClient: SanityClient | undefined
let cachedDraftClient: SanityClient | undefined

function baseConfig() {
  const env = sanityEnv()
  return {
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  }
}

export function getSanityClient(): SanityClient {
  if (cachedPublishedClient) return cachedPublishedClient

  cachedPublishedClient = createClient({
    ...baseConfig(),
    // Served from Sanity's CDN. Freshness is tag-based revalidation once the webhook
    // is configured; until then fetches keep a short ISR window in `fetch.ts`.
    useCdn: true,
    perspective: 'published',
  })

  return cachedPublishedClient
}

/**
 * Drafts, with stega encoding so Presentation can overlay click-to-edit.
 *
 * Never cached, never on the CDN, never used for a public request. Returns `null`
 * when the read token is missing so draft mode fails closed rather than leaking
 * an unauthenticated drafts query.
 */
export function getDraftSanityClient(): SanityClient | null {
  const token = sanityApiReadToken()
  if (!token) return null

  if (cachedDraftClient) return cachedDraftClient

  cachedDraftClient = createClient({
    ...baseConfig(),
    useCdn: false,
    token,
    perspective: 'drafts',
    stega: {
      enabled: true,
      studioUrl: '/studio',
    },
  })

  return cachedDraftClient
}
