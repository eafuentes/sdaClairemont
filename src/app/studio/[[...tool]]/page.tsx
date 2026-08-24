import { NextStudio } from 'next-sanity/studio'

import config from '../../../../sanity.config'

/**
 * Sanity Studio, served from this app at /studio.
 *
 * Outside the `(site)` route group on purpose: the Studio brings its own chrome and
 * must not inherit the site header, footer or motion provider.
 *
 * `force-static` because the Studio is a single-page app whose content is fetched at
 * runtime by the client. There is nothing per-request to render, and letting it go
 * dynamic would mean re-rendering the same shell on every editor page load.
 */
export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
