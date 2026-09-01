'use client'

import { useMotionValue, useSpring, type MotionValue } from 'motion/react'
import { useEffect, type RefObject } from 'react'

import { SPRING } from '@/lib/motion'

const FINE_POINTER = '(hover: hover) and (pointer: fine)'

interface PointerParallaxValues {
  /** Normalized pointer x, spring-smoothed, −1 at the left edge through 1 at the right. */
  x: MotionValue<number>
  /** Normalized pointer y, spring-smoothed, −1 at the top edge through 1 at the bottom. */
  y: MotionValue<number>
}

/**
 * Maps pointer position to a spring-smoothed −1…1 look-around coordinate.
 *
 * Fine pointers use the window, so the hero keeps responding as the cursor
 * travels across the header and the type. Touch never drives the scene, so page
 * scrolling stays native.
 */
export function usePointerParallax(
  targetRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): PointerParallaxValues {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING.look)
  const y = useSpring(rawY, SPRING.look)

  useEffect(() => {
    const reset = () => {
      rawX.set(0)
      rawY.set(0)
    }

    if (!enabled) {
      reset()
      return
    }

    const node = targetRef.current
    if (!node) return

    const pointer = window.matchMedia(FINE_POINTER)
    let attached = false

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      if (window.innerWidth === 0 || window.innerHeight === 0) return
      const nx = (event.clientX / window.innerWidth) * 2 - 1
      const ny = (event.clientY / window.innerHeight) * 2 - 1
      rawX.set(Math.max(-1, Math.min(1, nx)))
      rawY.set(Math.max(-1, Math.min(1, ny)))
    }

    const attach = () => {
      if (attached) return
      attached = true
      window.addEventListener('pointermove', onMove, { passive: true })
    }

    const detach = () => {
      if (!attached) return
      attached = false
      window.removeEventListener('pointermove', onMove)
      reset()
    }

    const sync = () => {
      if (pointer.matches) attach()
      else detach()
    }

    sync()
    pointer.addEventListener('change', sync)

    return () => {
      pointer.removeEventListener('change', sync)
      detach()
    }
  }, [enabled, rawX, rawY, targetRef])

  return { x, y }
}
