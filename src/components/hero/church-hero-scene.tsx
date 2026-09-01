'use client'

import { m, useReducedMotion, useTransform, type MotionValue } from 'motion/react'

import { ChurchHeroLayer } from '@/components/hero/church-hero-layer'

const PLATES: ReadonlyArray<{
  id: string
  src: string
  panX: number
  panY: number
  priority: boolean
  fetchPriority?: 'high'
  ambient?: boolean
}> = [
  {
    id: 'sky',
    src: '/images/hero/church-hero-sky.webp',
    panX: 5,
    panY: 3,
    priority: true,
    ambient: true,
  },
  {
    id: 'background',
    src: '/images/hero/church-hero-background.webp',
    panX: 8,
    panY: 4.5,
    priority: true,
  },
  {
    id: 'building',
    src: '/images/hero/church-hero-building.webp',
    panX: 12,
    panY: 6.5,
    priority: true,
  },
  {
    id: 'foreground',
    src: '/images/hero/church-hero-foreground.webp',
    panX: 16,
    panY: 9,
    priority: true,
  },
]

interface ChurchHeroSceneProps {
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  enabled: boolean
}

/**
 * Arrival scene. The wide photograph is what you see. The four plates sit
 * behind it, in depth order, and travel farther so the camera feels like it is
 * looking around the grounds.
 */
export function ChurchHeroScene({ pointerX, pointerY, enabled }: ChurchHeroSceneProps) {
  const prefersReducedMotion = useReducedMotion()
  const canTilt = enabled && !prefersReducedMotion
  const rotateY = useTransform(pointerX, [-1, 1], canTilt ? [-5, 5] : [0, 0])
  const rotateX = useTransform(pointerY, [-1, 1], canTilt ? [2.4, -2.4] : [0, 0])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-dusk">
      <m.div
        className="absolute inset-0 origin-center will-change-transform [transform-style:preserve-3d]"
        data-motion
        style={canTilt ? { rotateX, rotateY, transformPerspective: 1400 } : undefined}
      >
        <div className="absolute inset-0 origin-center scale-[1.14] lg:scale-[1.38]">
          {PLATES.map((layer) => (
            <ChurchHeroLayer
              key={layer.id}
              ambient={layer.ambient}
              fetchPriority={layer.fetchPriority}
              panX={layer.panX}
              panY={layer.panY}
              pointerX={pointerX}
              pointerY={pointerY}
              priority={layer.priority}
              src={layer.src}
            />
          ))}

          <ChurchHeroLayer
            fetchPriority="high"
            panX={10}
            panY={5.5}
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
