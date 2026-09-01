import Image from 'next/image'

import { cn } from '@/lib/utils'
import type { ContentImage } from '@/types/content'

type PlaceholderTone = 'warm' | 'cool' | 'neutral' | 'dusk'

interface MediaPlaceholderProps {
  /**
   * The photograph this slot needs, written as a brief.
   *
   * Rendered on screen when no image has been supplied. The composition cannot be
   * judged against grey boxes, and printing the brief in place turns the homepage
   * into a live shot list that church staff can read without opening a document.
   */
  description: string
  className?: string
  tone?: PlaceholderTone
  caption?: string
  /** When present, this is a real photograph and the brief is not shown. */
  image?: ContentImage
}

const toneClasses: Record<PlaceholderTone, string> = {
  warm: 'bg-gradient-to-b from-dawn/25 to-paper-deep text-ink-soft',
  cool: 'bg-gradient-to-b from-dusk/20 to-paper-deep text-ink-soft',
  neutral: 'bg-gradient-to-b from-paper-warm to-paper-deep text-ink-soft',
  dusk: 'bg-gradient-to-b from-dusk-raised to-dusk text-paper-on-dusk/70',
}

/**
 * A photographic slot: the real picture when one exists, otherwise the brief for
 * the one that does not.
 *
 * Deliberately not a grey box and deliberately not an AI image when empty: it reads
 * as a considered tonal surface, and it cannot be mistaken for finished work. See
 * docs/MEDIA-STRATEGY.md.
 */
export function MediaPlaceholder({
  description,
  className,
  tone = 'neutral',
  caption,
  image,
}: MediaPlaceholderProps) {
  const shownCaption = image?.caption ?? caption

  return (
    <figure className={cn('flex flex-col', className)}>
      <div
        className={cn(
          'relative flex h-full w-full items-end overflow-hidden',
          image ? 'bg-paper-deep' : toneClasses[tone],
        )}
        role={image ? undefined : 'img'}
        aria-label={image ? undefined : description}
      >
        {image ? (
          <Image
            alt={image.alt}
            blurDataURL={image.lqip}
            className="object-cover"
            fill
            placeholder={image.lqip ? 'blur' : 'empty'}
            sizes="(min-width: 1024px) 50vw, 100vw"
            src={image.src}
          />
        ) : (
          <div className="w-full p-5 md:p-6">
            <p className="font-sans text-eyebrow uppercase opacity-70">Photograph needed</p>
            <p className="mt-2 max-w-measure font-sans text-body-sm">{description}</p>
          </div>
        )}
      </div>
      {shownCaption ? (
        <figcaption className="mt-3 font-sans text-body-sm text-ink-soft">
          {shownCaption}
        </figcaption>
      ) : null}
    </figure>
  )
}
