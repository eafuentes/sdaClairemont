'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

export interface Sticker {
  label: string
  tone: 'red' | 'lime' | 'ink'
  /** Resting position inside the board, as percentages, and a tilt in degrees. */
  x: number
  y: number
  tilt: number
}

const FRICTION = 0.9
const BOUNCE = 0.45

/**
 * Words you can pick up and throw. Fling one and it glides, slows, and knocks off the
 * edge of the board.
 *
 * Decoration, so the board is `aria-hidden`: the same words are said in the copy around
 * it. Each sticker moves by `transform` only, from its own animation frame, and the frame
 * stops when the sticker does. Under reduced motion they are simply placed.
 */
export function Stickers({ stickers, className }: { stickers: Sticker[]; className?: string }) {
  const boardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const board = boardRef.current
    if (!board) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cleanups = Array.from(board.querySelectorAll<HTMLElement>('[data-sticker]')).map((el) =>
      makeThrowable(el, board),
    )
    return () => cleanups.forEach((cleanup) => cleanup())
  }, [])

  return (
    <div ref={boardRef} aria-hidden="true" className={cn('sticker-board', className)}>
      {stickers.map((sticker) => (
        <span
          key={sticker.label}
          className={cn('sticker', `sticker-${sticker.tone}`)}
          data-sticker
          style={
            {
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              '--tilt': `${sticker.tilt}deg`,
            } as React.CSSProperties
          }
        >
          {sticker.label}
        </span>
      ))}
    </div>
  )
}

function makeThrowable(el: HTMLElement, board: HTMLElement) {
  let x = 0
  let y = 0
  let vx = 0
  let vy = 0
  let lastX = 0
  let lastY = 0
  let lastT = 0
  let frame = 0
  let held = false

  const place = () => {
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(var(--tilt)) scale(${held ? 1.08 : 1})`
  }

  const bounds = () => {
    const b = board.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    return {
      minX: x - (r.left - b.left),
      maxX: x + (b.right - r.right),
      minY: y - (r.top - b.top),
      maxY: y + (b.bottom - r.bottom),
    }
  }

  const glide = () => {
    vx *= FRICTION
    vy *= FRICTION
    x += vx
    y += vy
    const { minX, maxX, minY, maxY } = bounds()
    if (x < minX || x > maxX) {
      x = Math.min(maxX, Math.max(minX, x))
      vx = -vx * BOUNCE
    }
    if (y < minY || y > maxY) {
      y = Math.min(maxY, Math.max(minY, y))
      vy = -vy * BOUNCE
    }
    place()
    frame = Math.abs(vx) + Math.abs(vy) > 0.2 ? requestAnimationFrame(glide) : 0
  }

  const onDown = (event: PointerEvent) => {
    cancelAnimationFrame(frame)
    held = true
    el.setPointerCapture(event.pointerId)
    el.classList.add('is-held')
    lastX = event.clientX
    lastY = event.clientY
    lastT = event.timeStamp
    vx = 0
    vy = 0
    place()
  }

  const onMove = (event: PointerEvent) => {
    if (!held) return
    const dx = event.clientX - lastX
    const dy = event.clientY - lastY
    const dt = Math.max(1, event.timeStamp - lastT)
    x += dx
    y += dy
    vx = (dx / dt) * 16
    vy = (dy / dt) * 16
    lastX = event.clientX
    lastY = event.clientY
    lastT = event.timeStamp
    place()
  }

  const onUp = () => {
    if (!held) return
    held = false
    el.classList.remove('is-held')
    frame = requestAnimationFrame(glide)
  }

  el.addEventListener('pointerdown', onDown)
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerup', onUp)
  el.addEventListener('pointercancel', onUp)
  return () => {
    cancelAnimationFrame(frame)
    el.removeEventListener('pointerdown', onDown)
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerup', onUp)
    el.removeEventListener('pointercancel', onUp)
  }
}
