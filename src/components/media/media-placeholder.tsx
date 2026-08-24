import { cn } from '@/lib/utils'

type PlaceholderTone = 'warm' | 'cool' | 'neutral' | 'dusk'

interface MediaPlaceholderProps {
  /**
   * The photograph this slot needs, written as a brief.
   *
   * Rendered on screen on purpose. The composition cannot be judged against grey
   * boxes, and printing the brief in place turns the homepage into a live shot list
   * that church staff can read without opening a document.
   */
  description: string
  className?: string
  tone?: PlaceholderTone
  caption?: string
}

/*
 * Tonal washes rather than distinct hues. The palette carries only dawn and dusk, so
 * variety here comes from opacity over paper — which is also what keeps a shot list of
 * placeholders from quietly introducing a fourth and fifth colour into the system.
 */
const toneClasses: Record<PlaceholderTone, string> = {
  warm: 'bg-gradient-to-b from-dawn/25 to-paper-deep text-ink-soft',
  cool: 'bg-gradient-to-b from-dusk/20 to-paper-deep text-ink-soft',
  neutral: 'bg-gradient-to-b from-paper-warm to-paper-deep text-ink-soft',
  dusk: 'bg-gradient-to-b from-dusk-raised to-dusk text-paper-on-dusk/70',
}

/**
 * Stands in for a photograph that has not been taken yet.
 *
 * Phase 1 composes the entire homepage with these so layout, rhythm and typography can
 * be judged before any imagery exists. Phase 4 replaces this component with
 * `SanityImage`; every call site already passes the alt-text-shaped `description`.
 *
 * Deliberately not a grey box and deliberately not an AI image: it reads as a
 * considered tonal surface, and it cannot be mistaken for finished work or accidentally
 * survive into production as a photograph. See docs/MEDIA-STRATEGY.md.
 */
export function MediaPlaceholder({
  description,
  className,
  tone = 'neutral',
  caption,
}: MediaPlaceholderProps) {
  return (
    <figure className={cn('flex flex-col', className)}>
      <div
        className={cn('relative flex h-full w-full items-end overflow-hidden', toneClasses[tone])}
        role="img"
        aria-label={description}
      >
        <div className="w-full p-5 md:p-6">
          <p className="font-sans text-eyebrow uppercase opacity-70">Photograph needed</p>
          <p className="mt-2 max-w-measure font-sans text-body-sm">{description}</p>
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-3 font-sans text-body-sm text-ink-soft">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
