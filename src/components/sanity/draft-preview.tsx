import { Suspense } from 'react'

import { isSanityDraftPreview } from '@/sanity/lib/preview-state'

/**
 * Draft-only Presentation chrome.
 *
 * Wrapped in `Suspense` so calling `draftMode()` here is a hole in an otherwise
 * static tree rather than a reason to render every public page on demand. The overlay
 * is imported only when draft mode is actually on, so the published site does not
 * download Visual Editing.
 */
export function DraftPreview() {
  return (
    <Suspense fallback={null}>
      <DraftPreviewInner />
    </Suspense>
  )
}

async function DraftPreviewInner() {
  if (!(await isSanityDraftPreview())) return null

  const { VisualEditingOverlay } = await import('@/components/sanity/visual-editing-overlay')
  return <VisualEditingOverlay />
}
