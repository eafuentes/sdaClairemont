import { Suspense } from 'react'

import { isSanityDraftPreview } from '@/sanity/lib/preview-state'

/**
 * A persistent notice that this response is a draft preview, not the public site.
 *
 * Presentation's iframe is the main use. The banner also covers the case where an
 * editor opens the preview in its own tab and needs a way out that is not "delete
 * cookies."
 */
export function DraftBanner() {
  return (
    <Suspense fallback={null}>
      <DraftBannerInner />
    </Suspense>
  )
}

async function DraftBannerInner() {
  if (!(await isSanityDraftPreview())) return null

  return (
    <p className="bg-dawn px-5 py-3 text-center font-sans text-body-sm text-paper">
      You are previewing unpublished changes.{' '}
      {/* Full document navigation so the disable route can set the cookie, then redirect. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- API route must run as a document request, not a client transition. */}
      <a className="underline decoration-ink underline-offset-4" href="/api/draft-mode/disable">
        Exit preview
      </a>
    </p>
  )
}
