import { cookies, draftMode, headers } from 'next/headers'
import 'server-only'

import {
  PREVIEW_PERSPECTIVE_COOKIE,
  PREVIEW_PERSPECTIVE_HEADER,
} from '@/sanity/lib/preview-constants'

function isDraftPerspective(value: string | undefined | null): boolean {
  return Boolean(value && value !== 'published')
}

/**
 * Whether this request should read drafts with stega, not the published CDN.
 *
 * `draftMode()` is the only check that keeps published pages static. On localhost
 * HTTP the bypass cookie often fails to stick, so development also reads the
 * perspective header/cookie Presentation puts on the iframe URL.
 */
export async function isSanityDraftPreview(): Promise<boolean> {
  if ((await draftMode()).isEnabled) return true
  if (process.env.NODE_ENV === 'production') return false
  if (isDraftPerspective((await headers()).get(PREVIEW_PERSPECTIVE_HEADER))) return true
  if (isDraftPerspective((await cookies()).get(PREVIEW_PERSPECTIVE_COOKIE)?.value)) return true
  return false
}
