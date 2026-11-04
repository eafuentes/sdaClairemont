'use client'

import { m, useReducedMotion } from 'motion/react'

import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/utils'

const MAIN = 'M6 15 C 70 9, 150 7, 294 11'
const BRISTLE_HIGH = 'M14 10 C 90 5, 170 4, 286 7'
const BRISTLE_LOW = 'M10 19 C 80 15, 190 14, 280 15'

/**
 * The swipe under a headline, painted on as it scrolls into view.
 *
 * Ink & Brush renders it as a thick red brush with two dry bristle trails, like the
 * underline on the pastor's "A Lesson from JAPAN" slide. Golden Hour renders only the
 * main path as a single drawn hairline. Same component, the theme picks the stroke.
 */
export function BrushStroke({ className, delay = 0.15 }: { className?: string; delay?: number }) {
  const reduced = useReducedMotion()

  const draw = (extraDelay: number) =>
    reduced
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true, amount: 0.9 },
          transition: { delay: delay + extraDelay, duration: 0.75, ease: EASE_OUT },
        }

  return (
    <svg
      aria-hidden="true"
      className={cn('brush-stroke block h-6 w-full overflow-visible', className)}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 300 24"
    >
      <m.path className="brush-stroke-main" d={MAIN} {...draw(0)} />
      <m.path className="brush-stroke-bristle" d={BRISTLE_HIGH} {...draw(0.08)} />
      <m.path className="brush-stroke-bristle" d={BRISTLE_LOW} {...draw(0.14)} />
    </svg>
  )
}
