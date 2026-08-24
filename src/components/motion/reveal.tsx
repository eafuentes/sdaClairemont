'use client'

import { m, useReducedMotion } from 'motion/react'

import { DURATION, EASE_OUT, REVEAL_DISTANCE, REVEAL_VIEWPORT } from '@/lib/motion'

/*
 * Only the elements actually used. Every `m.<element>` is a distinct component in the
 * bundle, so a speculative union is a speculative cost — add to this when a call site
 * needs it, not before.
 */
type RevealElement = 'div' | 'li'

interface RevealProps {
  children: React.ReactNode
  /** Seconds. Used to stagger siblings; keep the steps small, around 0.08–0.12. */
  delay?: number
  className?: string
  /** Match the surrounding markup — a reveal must never change the document structure. */
  as?: RevealElement
}

const elements = {
  div: m.div,
  li: m.li,
} as const

/**
 * Reveals its children as they enter the viewport: 20px up, fading in, once.
 *
 * The workhorse for everything below the hero. Three deliberate constraints.
 *
 * **It rises 20px, not 60.** Large travel reads as a lurch and draws attention to the
 * animation rather than to what arrived. The distance should be felt, not watched.
 *
 * **It fires once.** A section that re-animates every time it scrolls past is a section
 * that fights the reader on the way back up.
 *
 * **It accepts server-rendered `children`.** Content stays on the server; only this
 * wrapper hydrates. That is the whole reason it takes `children` rather than props.
 *
 * With reduced motion on, it renders a plain element and never attaches an observer — the
 * animation is skipped at the source rather than played and then suppressed. Because the
 * resting state is simply the finished page, the reduced version is the correct one.
 */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    const Element = as
    return <Element className={className}>{children}</Element>
  }

  const Component = elements[as]

  return (
    <Component
      className={className}
      data-motion
      initial={{ opacity: 0, y: REVEAL_DISTANCE }}
      transition={{ delay, duration: DURATION.slow, ease: EASE_OUT }}
      viewport={REVEAL_VIEWPORT}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </Component>
  )
}
