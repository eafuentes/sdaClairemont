'use client'

import { useEffect, useRef } from 'react'

const SIZE = 420
const EASE = 0.14

/**
 * Golden Hour's sunrise backlight. A soft gold light that drifts after your finger.
 *
 * One fixed element, moved with `translate3d` only, eased toward the last touch point in
 * an animation frame that stops itself once the light has arrived. It never runs in
 * Ink & Brush, under reduced motion, or on devices marked low-power.
 */
export function TouchGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = ref.current
    if (!glow) return
    const root = document.documentElement
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let x = window.innerWidth * 0.7
    let y = window.innerHeight * 0.25
    let targetX = x
    let targetY = y

    const place = () => {
      glow.style.transform = `translate3d(${(x - SIZE / 2).toFixed(1)}px, ${(y - SIZE / 2).toFixed(1)}px, 0)`
    }

    const tick = () => {
      x += (targetX - x) * EASE
      y += (targetY - y) * EASE
      place()
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.5 ? requestAnimationFrame(tick) : 0
    }

    const follow = (event: PointerEvent) => {
      if (root.dataset.mobileTheme !== 'gold' || 'lite' in root.dataset) return
      targetX = event.clientX
      targetY = event.clientY
      if (!frame) frame = requestAnimationFrame(tick)
    }

    place()
    window.addEventListener('pointerdown', follow, { passive: true })
    window.addEventListener('pointermove', follow, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointerdown', follow)
      window.removeEventListener('pointermove', follow)
    }
  }, [])

  return <div ref={ref} aria-hidden="true" className="touch-glow lg:hidden" />
}
