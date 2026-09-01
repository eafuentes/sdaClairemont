import { Studio } from './studio'

/**
 * Sanity Studio, served from this app at /studio.
 *
 * Outside the `(site)` route group on purpose: the Studio brings its own chrome and
 * must not inherit the site header, footer or motion provider.
 *
 * This file stays a Server Component so it can export metadata. The Studio itself is a
 * client-only mount — see `studio.tsx` for why SSR of this tree crashes.
 *
 * `force-static` because the shell is the same for every editor. The documents inside
 * are fetched by the Studio client after it loads.
 */
export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <Studio />
}
