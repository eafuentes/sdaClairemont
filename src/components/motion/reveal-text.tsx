'use client'

import { m, useReducedMotion } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'

import {
  DURATION,
  EASE_OUT,
  REVEAL_DISTANCE,
  REVEAL_TEXT_STAGGER,
  REVEAL_VIEWPORT,
} from '@/lib/motion'

interface RevealTextProps {
  text: string
  className?: string
  /** Seconds before the first line moves. */
  delay?: number
  /** Seconds between lines. Defaults to 50ms; Hope uses a slower 70ms. */
  stagger?: number
}

/**
 * Reveals a passage one line at a time, 50ms apart.
 *
 * Lines, never characters. Per-character animation on a church homepage is decorative
 * typing, and it destroys screen-reader output and text selection. The full sentence
 * lives on `aria-label`; the visual lines are hidden from assistive technology, the
 * same pattern as the hero headline.
 *
 * Line breaks are measured from the rendered words, so they follow the actual wrap
 * rather than a guessed character count. Until that measurement lands, the passage
 * is shown whole — content never waits on motion.
 */
export function RevealText({
  text,
  className,
  delay = 0,
  stagger = REVEAL_TEXT_STAGGER,
}: RevealTextProps) {
  const prefersReducedMotion = useReducedMotion()
  const measureRef = useRef<HTMLSpanElement>(null)
  const [lines, setLines] = useState<string[] | null>(null)

  useLayoutEffect(() => {
    const root = measureRef.current
    if (!root) return

    const words = [...root.querySelectorAll('[data-word]')] as HTMLElement[]
    if (words.length === 0) return

    const grouped: string[][] = []
    let currentTop = words[0]?.offsetTop
    let bucket: string[] = []

    for (const word of words) {
      if (currentTop !== undefined && Math.abs(word.offsetTop - currentTop) > 2) {
        grouped.push(bucket)
        bucket = []
        currentTop = word.offsetTop
      }
      bucket.push(word.dataset.word ?? '')
    }
    if (bucket.length > 0) grouped.push(bucket)

    setLines(grouped.map((line) => line.join(' ')))
  }, [text])

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>
  }

  const words = text.split(/\s+/).filter(Boolean)

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {lines ? (
        lines.map((line, index) => (
          <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]" key={`${line}-${index}`}>
            <m.span
              className="block"
              data-motion
              initial={{ opacity: 0, y: REVEAL_DISTANCE }}
              transition={{
                delay: delay + index * stagger,
                duration: DURATION.slow,
                ease: EASE_OUT,
              }}
              viewport={REVEAL_VIEWPORT}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <span aria-hidden="true">{line}</span>
            </m.span>
          </span>
        ))
      ) : (
        <span aria-hidden="true" ref={measureRef}>
          {words.map((word, index) => (
            <span data-word={word} key={`${word}-${index}`}>
              {word}
              {index < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </span>
      )}
    </span>
  )
}
