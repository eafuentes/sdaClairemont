'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

import { Icon } from '@/components/ui/icon'
import type { PathwayTile } from '@/content/pathways'
import { cn } from '@/lib/utils'
import { brandGradient } from '@/styles/palette'

/** Horizontal travel, in pixels, that counts as a swipe rather than a nudge. */
const SWIPE = 72
const FLING_MS = 300

/**
 * The three "start here" pathways as a deck of cards. Swipe the top card away and it
 * tucks in behind the others; tap it to go there.
 *
 * The gesture is optional. The Next button does the same thing, and only the top card is
 * reachable by keyboard or screen reader — the ones behind it are `inert`. Vertical
 * scrolling stays with the browser (`touch-action: pan-y`), so a thumb that meant to
 * scroll the page never gets caught by the deck.
 */
export function SwipeDeck({ tiles }: { tiles: readonly PathwayTile[] }) {
  const [top, setTop] = useState(0)
  const topRef = useRef<HTMLAnchorElement>(null)
  const drag = useRef({ x: 0, dx: 0, active: false, moved: false })
  const count = tiles.length

  function reduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function settle(card: HTMLElement) {
    card.style.transition = ''
    card.style.transform = ''
    card.style.opacity = ''
  }

  function advance(direction: 1 | -1 = 1) {
    const card = topRef.current
    if (!card || reduced()) {
      setTop((value) => (value + 1) % count)
      return
    }
    card.style.transition = `transform ${FLING_MS}ms var(--ease-out), opacity ${FLING_MS}ms var(--ease-out)`
    card.style.transform = `translate3d(${direction * 115}%, -4%, 0) rotate(${direction * 14}deg)`
    card.style.opacity = '0'
    window.setTimeout(() => {
      settle(card)
      setTop((value) => (value + 1) % count)
    }, FLING_MS)
  }

  function onPointerDown(event: React.PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    drag.current = { x: event.clientX, dx: 0, active: true, moved: false }
    event.currentTarget.style.transition = 'none'
  }

  function onPointerMove(event: React.PointerEvent<HTMLAnchorElement>) {
    const state = drag.current
    if (!state.active) return
    state.dx = event.clientX - state.x
    if (!state.moved && Math.abs(state.dx) > 8) {
      state.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    if (!state.moved) return
    event.currentTarget.style.transform = `translate3d(${state.dx}px, 0, 0) rotate(${state.dx / 18}deg)`
  }

  function onPointerEnd(event: React.PointerEvent<HTMLAnchorElement>) {
    const state = drag.current
    if (!state.active) return
    state.active = false
    const card = event.currentTarget
    if (Math.abs(state.dx) > SWIPE) {
      advance(state.dx > 0 ? 1 : -1)
    } else {
      card.style.transition = ''
      card.style.transform = ''
    }
  }

  return (
    <div className="swipe-deck">
      <div className="swipe-deck-stage">
        {tiles.map((tile, index) => {
          const depth = (index - top + count) % count
          const isTop = depth === 0
          return (
            <Link
              key={tile.href}
              ref={isTop ? topRef : undefined}
              className={cn('swipe-card', isTop && 'is-top')}
              draggable={false}
              href={tile.href}
              inert={!isTop}
              onClick={(event) => {
                if (drag.current.moved) {
                  event.preventDefault()
                  drag.current.moved = false
                }
              }}
              onPointerCancel={isTop ? onPointerEnd : undefined}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerEnd : undefined}
              style={{ '--depth': depth, zIndex: count - depth } as React.CSSProperties}
            >
              {tile.surface.kind === 'photo' ? (
                <Image
                  alt=""
                  className="swipe-card-photo"
                  draggable={false}
                  fill
                  sizes="88vw"
                  src={tile.surface.image.src}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className={cn('absolute inset-0', brandGradient[tile.surface.name])}
                />
              )}
              <span aria-hidden="true" className="swipe-card-scrim" />
              <span className="swipe-card-copy">
                <span className="swipe-card-index">
                  {index + 1} / {count}
                </span>
                <span className="swipe-card-title">{tile.title}</span>
                <span className="swipe-card-hint">
                  {tile.hint}
                  <Icon name="arrow-right" />
                </span>
              </span>
            </Link>
          )
        })}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="swipe-deck-hint" aria-hidden="true">
          Swipe the card
        </p>
        <button className="immersive-button press" onClick={() => advance(1)} type="button">
          Next
          <span className="sr-only"> pathway</span>
          <Icon name="arrow-right" />
        </button>
      </div>
    </div>
  )
}
