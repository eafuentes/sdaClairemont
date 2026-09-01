/**
 * Shared names for Presentation's preview perspective.
 *
 * Kept free of `next/headers` so Edge middleware can import them.
 */
export const PREVIEW_PERSPECTIVE_PARAM = 'sanity-preview-perspective'
export const PREVIEW_PERSPECTIVE_COOKIE = 'sanity-preview-perspective'
export const PREVIEW_PERSPECTIVE_HEADER = 'x-sanity-preview-perspective'

export function previewCookieOptions() {
  const secure = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    path: '/',
    secure,
    sameSite: 'lax' as const,
  }
}
