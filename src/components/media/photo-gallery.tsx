'use client'

import Image from 'next/image'
import { useCallback, useId, useRef, useState } from 'react'

import { Lightbox } from '@/components/media/lightbox'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import type { GalleryEntry } from '@/types/content'

interface PhotoGalleryProps {
  items: GalleryEntry[]
  layout: 'masonry' | 'horizontal'
  label: string
}

/**
 * Photographs as a masonry archive or a side-to-side sequence.
 *
 * Layout is CSS: columns for masonry, native overflow + snap for the filmstrip.
 * JavaScript owns the lightbox and the previous/next buttons. Without it the
 * photographs are still there, in order, and still readable.
 */
export function PhotoGallery({ items, layout, label }: PhotoGalleryProps) {
  const scrollerRef = useRef<HTMLUListElement>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const sequenceId = useId()

  const scrollByPage = useCallback((direction: -1 | 1) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    scroller.scrollBy({
      left: direction * Math.min(scroller.clientWidth * 0.8, 560),
      behavior: reduced ? 'auto' : 'smooth',
    })
  }, [])

  if (items.length === 0) return null

  return (
    <div>
      {layout === 'horizontal' ? (
        <div className="mb-6 flex justify-end gap-3 px-5 md:px-8 lg:px-16">
          <button
            aria-controls={sequenceId}
            className="inline-flex min-h-11 items-center border border-ink/25 px-4 font-sans text-eyebrow text-ink uppercase"
            onClick={() => scrollByPage(-1)}
            type="button"
          >
            Previous
          </button>
          <button
            aria-controls={sequenceId}
            className="inline-flex min-h-11 items-center gap-2 border border-ink/25 px-4 font-sans text-eyebrow text-ink uppercase"
            onClick={() => scrollByPage(1)}
            type="button"
          >
            Next
            <Icon name="arrow-right" />
          </button>
        </div>
      ) : null}

      <ul
        aria-label={label}
        className={
          layout === 'horizontal'
            ? 'flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 md:px-8 lg:px-16'
            : 'columns-1 gap-6 md:columns-2 lg:columns-3'
        }
        id={layout === 'horizontal' ? sequenceId : undefined}
        ref={layout === 'horizontal' ? scrollerRef : undefined}
      >
        {items.map((item, index) => (
          <li
            className={
              layout === 'horizontal'
                ? 'w-[min(32rem,85vw)] shrink-0 snap-start'
                : 'mb-6 break-inside-avoid'
            }
            key={item.id}
          >
            <GalleryTile eager={index < 3} item={item} onOpen={() => setActiveIndex(index)} />
          </li>
        ))}
      </ul>

      <Lightbox
        index={activeIndex}
        items={items}
        onClose={() => setActiveIndex(null)}
        onIndex={setActiveIndex}
      />
    </div>
  )
}

function GalleryTile({
  item,
  eager,
  onOpen,
}: {
  item: GalleryEntry
  eager: boolean
  onOpen: () => void
}) {
  return (
    <figure>
      <button
        className="group relative block w-full overflow-hidden bg-paper-deep text-left"
        onClick={onOpen}
        type="button"
      >
        <span className="sr-only">View {item.title ?? item.image.alt}</span>
        <Image
          alt={item.image.alt}
          className="h-auto w-full object-cover"
          height={item.image.height}
          loading={eager ? 'eager' : 'lazy'}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw"
          src={item.image.src}
          width={item.image.width}
        />
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 bg-dawn-soft/0 transition-colors duration-[var(--dur-quick)] ease-out',
            'group-hover:bg-dawn-soft/10 group-focus-visible:bg-dawn-soft/10',
          )}
        />
      </button>
      {item.title || item.date || item.sentence ? (
        <figcaption className="mt-4">
          {item.title ? <p className="font-display text-heading-3 text-ink">{item.title}</p> : null}
          {item.date ? (
            <p className="mt-1 font-sans text-eyebrow text-ink-muted uppercase">{item.date}</p>
          ) : null}
          {item.sentence ? (
            <p className="mt-3 max-w-measure font-sans text-body-sm text-ink-soft">
              {item.sentence}
            </p>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
