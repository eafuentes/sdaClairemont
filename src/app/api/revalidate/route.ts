import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

import { sanityRevalidateSecret } from '@/env.server'
import { cacheTagsForSanityDocument } from '@/sanity/lib/revalidate-tags'

export const dynamic = 'force-dynamic'

interface SanityWebhookBody {
  _id?: string
  _type?: string
  slug?: string | { current?: string | null } | null
}

/**
 * Sanity webhook receiver.
 *
 * Signature-verified. Reads the document type and slug, then busts only the cache
 * tags those fetches carry — publishing one event regenerates the events routes and
 * the homepage, not the whole site.
 *
 * Configure the webhook in the Sanity project: POST this URL, use
 * `SANITY_REVALIDATE_SECRET` as the secret, trigger on create/update/delete.
 */
export async function POST(request: NextRequest) {
  const secret = sanityRevalidateSecret()
  if (!secret) {
    return NextResponse.json({ message: 'Revalidation is not configured.' }, { status: 501 })
  }

  const { isValidSignature, body } = await parseBody<SanityWebhookBody>(request, secret)

  if (!isValidSignature) {
    return NextResponse.json({ message: 'Invalid signature.' }, { status: 401 })
  }

  if (!body?._type) {
    return NextResponse.json({ message: 'Missing document type.' }, { status: 400 })
  }

  const tags = cacheTagsForSanityDocument(body)
  await Promise.all(tags.map((tag) => revalidateTag(tag, 'max')))

  return NextResponse.json({ revalidated: true, tags })
}
