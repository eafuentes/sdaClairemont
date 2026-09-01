'use client'

import { VisualEditing } from 'next-sanity/visual-editing/client-component'
import { useRouter } from 'next/navigation'

/**
 * Click-to-edit overlays, only mounted in draft preview.
 *
 * Presentation's default handler ignores mutations (it expects Sanity Live).
 * We refresh the route ourselves so a saved draft appears without a reload.
 */
export function VisualEditingOverlay() {
  const router = useRouter()

  return (
    <VisualEditing
      refresh={() => {
        router.refresh()
        return new Promise((resolve) => {
          setTimeout(resolve, 400)
        })
      }}
    />
  )
}
