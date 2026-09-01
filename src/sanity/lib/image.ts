import type { ContentImage } from '@/types/content'

/**
 * The image shape every GROQ projection returns. Kept structural rather than imported
 * from `sanity.types.ts`, because typegen inlines this object into every query result
 * and those copies are not the same TypeScript type even when they are identical.
 */
export interface ProjectedImage {
  src: string | null
  width: number | null
  height: number | null
  lqip: string | null
  alt: string
  caption: string | null
  credit: string | null
  provenance: ContentImage['provenance']
  provenanceNote: string | null
}

/**
 * A projected image is only renderable once it has a URL, intrinsic dimensions, and
 * alt text. Anything less becomes a placeholder slot rather than a broken `<img>`.
 *
 * Next's `<Image>` needs width and height to reserve space before the file arrives;
 * without them the page reflows as each photograph loads.
 */
export function mapImage(image: ProjectedImage | null | undefined): ContentImage | undefined {
  if (!image?.src || !image.width || !image.height || !image.alt) return undefined

  return {
    src: image.src,
    alt: image.alt,
    width: image.width,
    height: image.height,
    lqip: image.lqip ?? undefined,
    caption: image.caption ?? undefined,
    credit: image.credit ?? undefined,
    provenance: image.provenance,
    provenanceNote: image.provenanceNote ?? undefined,
  }
}
