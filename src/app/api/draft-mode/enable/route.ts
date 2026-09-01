import { cookies, draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { validatePreviewUrl } from '@sanity/preview-url-secret'

import { isSanityConfigured } from '@/env'
import { sanityApiReadToken } from '@/env.server'
import { getSanityClient } from '@/sanity/lib/client'
import { PREVIEW_PERSPECTIVE_COOKIE, previewCookieOptions } from '@/sanity/lib/preview-constants'

export const dynamic = 'force-dynamic'

/**
 * Presentation calls this to turn draft mode on before loading the preview iframe.
 *
 * Same-origin Studio (mounted at /studio) does not need partitioned cross-site
 * cookies. The helper from next-sanity rewrites `__prerender_bypass` for that
 * case and can leave draft mode off on http://localhost, so this route enables
 * the bypass cookie and then stops.
 */
export async function GET(request: Request) {
  const token = sanityApiReadToken()
  if (!isSanityConfigured() || !token) {
    return new Response('Draft preview is not configured.', { status: 501 })
  }

  const client = getSanityClient().withConfig({ token, useCdn: false })
  const {
    isValid,
    redirectTo = '/',
    studioPreviewPerspective,
  } = await validatePreviewUrl(client, request.url)
  if (!isValid) return new Response('Invalid secret', { status: 401 })

  const draft = await draftMode()
  if (!draft.isEnabled) draft.enable()

  const jar = await cookies()
  if (studioPreviewPerspective) {
    jar.set(PREVIEW_PERSPECTIVE_COOKIE, studioPreviewPerspective, previewCookieOptions())
  }

  redirect(redirectTo.startsWith('/') ? redirectTo : '/')
}
