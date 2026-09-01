import { type NextRequest, NextResponse } from 'next/server'

import {
  PREVIEW_PERSPECTIVE_COOKIE,
  PREVIEW_PERSPECTIVE_HEADER,
  PREVIEW_PERSPECTIVE_PARAM,
  previewCookieOptions,
} from '@/sanity/lib/preview-constants'

/**
 * Presentation loads the site as `/?sanity-preview-perspective=drafts`.
 * Copy that onto the request so Server Components can fetch drafts even if the
 * draft-mode cookie is missing, and persist it as a same-site cookie for the
 * next refresh.
 */
export function middleware(request: NextRequest) {
  const perspective = request.nextUrl.searchParams.get(PREVIEW_PERSPECTIVE_PARAM)
  if (!perspective || perspective === 'published') return NextResponse.next()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(PREVIEW_PERSPECTIVE_HEADER, perspective)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.cookies.set(PREVIEW_PERSPECTIVE_COOKIE, perspective, previewCookieOptions())
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/|studio(?:/|$)|api/).*)'],
}
