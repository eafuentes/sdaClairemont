'use client'

import { m, useTransform, type MotionValue } from 'motion/react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

interface ChurchHeroLayerProps {
  src: string
  /** Normalized pointer x, −1…1. */
  pointerX: MotionValue<number>
  /** Normalized pointer y, −1…1. */
  pointerY: MotionValue<number>
  /** Peak horizontal travel as a percentage of the plate. */
  panX: number
  /** Peak vertical travel as a percentage of the plate. */
  panY: number
  priority?: boolean
  fetchPriority?: 'high' | 'low' | 'auto'
  /** Slow independent motion for the sky only. */
  ambient?: boolean
}

/**
 * One plate in the church scene.
 *
 * The camera looks toward the pointer, so the plate travels opposite the
 * cursor. Amount is a percentage so the pan scales with the hero.
 */
export function ChurchHeroLayer({
  src,
  pointerX,
  pointerY,
  panX,
  panY,
  priority = false,
  fetchPriority,
  ambient = false,
}: ChurchHeroLayerProps) {
  const x = useTransform(pointerX, (value) => `${-value * panX}%`)
  const y = useTransform(pointerY, (value) => `${-value * panY}%`)

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 will-change-transform"
      data-motion
      style={{ x, y }}
    >
      <div className={cn('relative h-full w-full', ambient && 'church-hero-sky-ambient')}>
        <Image
          alt=""
          className="object-cover object-center"
          fill
          fetchPriority={fetchPriority}
          priority={priority}
          sizes="100vw"
          src={src}
        />
      </div>
    </m.div>
  )
}
