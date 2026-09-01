import 'server-only'

import { isSanityConfigured } from '@/env'
import { sanityRevalidateSecret } from '@/env.server'

import { getDraftSanityClient, getSanityClient } from './client'
import { isSanityDraftPreview } from './preview-state'

/**
 * Until the revalidation webhook is configured, published edits would otherwise sit
 * in the CDN until the next full rebuild. Sixty seconds is short enough that a
 * Thursday-night bulletin change is on the site before Friday. Once
 * `SANITY_REVALIDATE_SECRET` is set, tags are enough and this timer goes away.
 */
const FALLBACK_REVALIDATE_SECONDS = 60

interface SanityFetchOptions<QueryParams extends Record<string, unknown>> {
  query: string
  params?: QueryParams
  tags: string[]
  /**
   * Skip draft-mode detection. `generateStaticParams` has no request, so it cannot
   * call `draftMode()`. Slug lists are published-only on purpose: an unpublished
   * draft is reached on demand when Presentation opens it, not by prerendering it.
   */
  publishedOnly?: boolean
}

/**
 * GROQ with Next cache tags, or drafts when Presentation has turned draft mode on.
 *
 * Returns `null` when Sanity is not configured, when the query matches nothing, or
 * when the request fails. Loaders treat all three as "use the fixture" rather than
 * failing the page: a missing CMS must not take down the public site, and a network
 * blip on Vercel at 4 AM must not either. Failures are logged so they are not silent.
 *
 * Stega encoding is on in draft mode only, so click-to-edit overlays have field
 * paths and public HTML never carries encoded characters.
 */
export async function sanityFetch<Result, QueryParams extends Record<string, unknown>>({
  query,
  params,
  tags,
  publishedOnly = false,
}: SanityFetchOptions<QueryParams>): Promise<Result | null> {
  if (!isSanityConfigured()) return null

  const isDraftMode = publishedOnly ? false : await isSanityDraftPreview()

  try {
    if (isDraftMode) {
      const draftClient = getDraftSanityClient()
      if (!draftClient) {
        console.error('Draft mode is on, but SANITY_API_READ_TOKEN is missing.')
        return null
      }

      return await draftClient.fetch<Result>(query, params ?? {}, {
        cache: 'no-store',
      })
    }

    const next = sanityRevalidateSecret()
      ? { tags }
      : { revalidate: FALLBACK_REVALIDATE_SECONDS, tags }

    return await getSanityClient().fetch<Result>(query, params ?? {}, { next })
  } catch (error) {
    console.error('Sanity fetch failed.', { tags, error })
    return null
  }
}
