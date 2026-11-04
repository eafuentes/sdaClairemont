'use client'

import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

interface StackCardProps {
  children: React.ReactNode
  className?: string
  id?: string
  labelledBy?: string
  /** The last card has nothing sliding over it, so it does not peel. */
  last?: boolean
}

/**
 * One card in the homepage stack. Each card sticks to the top of the screen and the next
 * one slides up over it; as it is covered, the card under it peels back — smaller, tilted,
 * shaded. Scroll is native the whole way: no wheel hijack, no snap, nothing to fight.
 *
 * Progress is written to `--peel` (0 → 1) and the theme decides what peeling looks like in
 * CSS: Ink & Brush tips the card like a page set down, Golden Hour tilts it into depth.
 *
 * A card taller than the screen sticks at a negative offset, so its bottom edge is still
 * readable before the next card arrives.
 */
export function StackCard({ children, className, id, labelledBy, last = false }: StackCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const nextRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: nextRef,
    offset: ['start end', 'start start'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (reduced || last) return
    cardRef.current?.style.setProperty('--peel', value.toFixed(3))
  })

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const fit = () => {
      const overflow = card.offsetHeight - window.innerHeight
      card.style.setProperty('--stick', `${Math.min(0, -overflow)}px`)
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(card)
    window.addEventListener('resize', fit)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [])

  return (
    <>
      <section
        ref={cardRef}
        aria-labelledby={labelledBy}
        className={cn('stack-card', className)}
        id={id}
      >
        <div className="stack-card-face">{children}</div>
        <div aria-hidden="true" className="stack-card-shade" />
      </section>
      <div ref={nextRef} aria-hidden="true" className="h-0" />
    </>
  )
}
