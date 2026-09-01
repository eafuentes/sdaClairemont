'use client'

import { m, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useRef } from 'react'

import { POINTER, SPRING } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface PointerParallaxProps {
  children: React.ReactNode
  className?: string
  /** Maximum displacement in pixels. Cap is 14px for far layers, 6px for plates. */
  max?: number
}

/**
 * Maps pointer position inside this element to a spring-smoothed offset.
 *
 * Listens on the section, not the window. Values flow through MotionValues, so React
 * does not re-render on move. Enabled only for fine pointers with hover; touch is a
 * different composition, and device-orientation is not a substitute.
 */
export function PointerParallax({
  children,
  className,
  max = POINTER.plate,
}: PointerParallaxProps) {
  const prefersReducedMotion = useReducedMotion()
  const frameRef = useRef<HTMLDivElement>(null)
  const x = useSpring(0, SPRING.drift)
  const y = useSpring(0, SPRING.drift)

  useEffect(() => {
    if (prefersReducedMotion) return

    const frame = frameRef.current
    if (!frame) return

    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!pointer.matches) return

    let rect = frame.getBoundingClientRect()
    const refreshRect = () => {
      rect = frame.getBoundingClientRect()
    }

    const onMove = (event: PointerEvent) => {
      const nx = (event.clientX - rect.left) / rect.width - 0.5
      const ny = (event.clientY - rect.top) / rect.height - 0.5
      x.set(nx * max * 2)
      y.set(ny * max * 2)
    }
    const onLeave = () => {
      x.set(0)
      y.set(0)
    }

    frame.addEventListener('pointerenter', refreshRect)
    frame.addEventListener('pointermove', onMove, { passive: true })
    frame.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', refreshRect)

    return () => {
      frame.removeEventListener('pointerenter', refreshRect)
      frame.removeEventListener('pointermove', onMove)
      frame.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', refreshRect)
    }
  }, [max, prefersReducedMotion, x, y])

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={cn('h-full w-full', className)} ref={frameRef}>
      <m.div className="h-full w-full" data-motion style={{ x, y }}>
        {children}
      </m.div>
    </div>
  )
}
