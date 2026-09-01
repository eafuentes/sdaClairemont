'use client'

import { m, useReducedMotion, useTransform, type MotionValue } from 'motion/react'

import { ChurchHeroLayer } from '@/components/hero/church-hero-layer'

interface ChurchStillSceneProps {
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  enabled: boolean
}

/**
 * Arrival as a single photograph — the original golden-hour exterior, no plates.
 *
 * A little pan and tilt so the camera can look around without cropping the
 * parking lot and sun off the left.
 */
export function ChurchStillScene({ pointerX, pointerY, enabled }: ChurchStillSceneProps) {
  const prefersReducedMotion = useReducedMotion()
  const canTilt = enabled && !prefersReducedMotion
  const rotateY = useTransform(pointerX, [-1, 1], canTilt ? [-3.2, 3.2] : [0, 0])
  const rotateX = useTransform(pointerY, [-1, 1], canTilt ? [1.6, -1.6] : [0, 0])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-dusk">
      <m.div
        className="absolute inset-0 origin-center will-change-transform [transform-style:preserve-3d]"
        data-motion
        style={canTilt ? { rotateX, rotateY, transformPerspective: 1400 } : undefined}
      >
        <div className="absolute inset-0 origin-center scale-[1.08] lg:scale-[1.12]">
          <ChurchHeroLayer
            fetchPriority="high"
            panX={6}
            panY={3.5}
            pointerX={pointerX}
            pointerY={pointerY}
            priority
            src="/images/church-exterior-golden-hour.png"
          />
        </div>
      </m.div>
    </div>
  )
}
