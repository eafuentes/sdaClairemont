import { cookies, draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import { PREVIEW_PERSPECTIVE_COOKIE, previewCookieOptions } from '@/sanity/lib/preview-constants'

export const dynamic = 'force-dynamic'

/**
 * Turns draft mode off and sends the editor back to the page they were previewing.
 *
 * Presentation calls this when leaving preview. The banner on the public site uses
 * it too, so a leftover cookie cannot quietly keep serving drafts after the iframe
 * is gone.
 */
export async function GET(request: Request) {
  ;(await draftMode()).disable()
  ;(await cookies()).delete({ name: PREVIEW_PERSPECTIVE_COOKIE, ...previewCookieOptions() })

  const url = new URL(request.url)
  const next = url.searchParams.get('redirect') ?? '/'
  redirect(next.startsWith('/') ? next : '/')
}
