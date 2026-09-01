'use client'

import { m, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'

import { PARALLAX, SPRING } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface ParallaxMediaProps {
  children: React.ReactNode
  className?: string
  /**
   * How far the inner plate travels, as a fraction of its height.
   * Foreground default is 6%; nothing here should reach the 12% background cap.
   */
  rate?: number
  /** Scale drift across the section. Photographic only; never on UI. */
  scaleTo?: number
}

/**
 * A plate whose inner image translates and scale-drifts as the section passes.
 *
 * Overflow is clipped on the outer element so the travel never shoves neighbours.
 * Reduced motion renders the mid-scroll resting frame — the composition we would
 * have chosen if this were a still photograph — and never attaches a listener.
 */
export function ParallaxMedia({
  children,
  className,
  rate = PARALLAX.foreground,
  scaleTo = PARALLAX.photoScale,
}: ParallaxMediaProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={cn('overflow-hidden', className)}>{children}</div>
  }

  return (
    <ParallaxMediaActive className={className} rate={rate} scaleTo={scaleTo}>
      {children}
    </ParallaxMediaActive>
  )
}

function ParallaxMediaActive({
  children,
  className,
  rate,
  scaleTo,
}: Required<Pick<ParallaxMediaProps, 'rate' | 'scaleTo'>> & {
  children: React.ReactNode
  className?: string
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  })
  const progress = useSpring(scrollYProgress, SPRING.lead)
  const travel = `${rate * 50}%`
  const y = useTransform(progress, [0, 1], [`-${travel}`, travel])
  const scale = useTransform(progress, [0, 1], [1, scaleTo])

  return (
    <div className={cn('overflow-hidden', className)} ref={frameRef}>
      <m.div className="h-full w-full" data-motion style={{ y, scale }}>
        {children}
      </m.div>
    </div>
  )
}
