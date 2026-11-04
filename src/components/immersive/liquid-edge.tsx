'use client'

import { useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

const WIDTH = 400
const HEIGHT = 28
const BRISTLES = 28

/** Deterministic jitter, so server and client draw the same edge. */
function jitter(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/** A torn, dry-brush top edge. Same point count for every seed, so the shapes morph. */
function brushPath(seed: number) {
  const step = WIDTH / BRISTLES
  let d = `M0 ${HEIGHT} L0 ${(8 + jitter(seed) * 10).toFixed(1)}`
  for (let i = 1; i <= BRISTLES; i += 1) {
    const x = i * step
    const y = 4 + jitter(seed + i * 1.7) * 16
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return `${d} L${WIDTH} ${HEIGHT} Z`
}

const BRUSH = [brushPath(1), brushPath(7), brushPath(13)] as const

const LIQUID = [
  `M0 ${HEIGHT} L0 14 C60 2 130 24 200 12 S330 0 400 14 L400 ${HEIGHT} Z`,
  `M0 ${HEIGHT} L0 10 C70 22 140 2 200 14 S320 24 400 8 L400 ${HEIGHT} Z`,
  `M0 ${HEIGHT} L0 16 C50 8 150 18 200 6 S350 18 400 12 L400 ${HEIGHT} Z`,
] as const

/** There and back again, so the loop has no seam. */
const loop = (shapes: readonly string[]) => [...shapes, ...shapes.slice(0, -1).reverse()].join(';')

/**
 * The organic top edge of a sheet. Ink & Brush draws torn bristles that shiver; Golden
 * Hour draws a slow liquid curve. Both render; CSS shows the one for the current theme.
 *
 * Native SVG `<animate>`, so the morph costs no JavaScript per frame. Only mount this on
 * surfaces that are on screen.
 */
export function LiquidEdge({ className }: { className?: string }) {
  const reduced = useReducedMotion()

  return (
    <svg
      aria-hidden="true"
      className={cn('liquid-edge pointer-events-none block h-7 w-full', className)}
      preserveAspectRatio="none"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    >
      <path className="liquid-edge-ink" d={BRUSH[0]}>
        {reduced ? null : (
          <animate attributeName="d" dur="2.4s" repeatCount="indefinite" values={loop(BRUSH)} />
        )}
      </path>
      <path className="liquid-edge-gold" d={LIQUID[0]}>
        {reduced ? null : (
          <animate attributeName="d" dur="8s" repeatCount="indefinite" values={loop(LIQUID)} />
        )}
      </path>
    </svg>
  )
}
