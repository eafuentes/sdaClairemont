'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactNode, type RefObject, useCallback, useEffect, useRef, useState } from 'react'

import { LiquidEdge } from '@/components/immersive/liquid-edge'
import { ThemeToggle } from '@/components/immersive/theme-toggle'
import { Icon, type IconName } from '@/components/ui/icon'
import { primaryNav } from '@/content/navigation'
import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/types/content'

type DockSettings = Pick<
  SiteSettings,
  'serviceTimes' | 'address' | 'phone' | 'isLive' | 'livestreamUrl'
>

/** How long the closing animation runs before the dialog is actually closed. */
const CLOSE_MS = 260

/**
 * The mobile navigation: a floating dock in thumb reach, plus a round menu orb.
 *
 * The five actions are the five things a phone visitor comes for — times, directions,
 * the sermon, prayer, giving — each one tap from any page. Everything else lives behind
 * the orb. Both overlays are native `<dialog>`s, so focus trapping, Escape, and inertness
 * of the page come from the browser.
 *
 * Desktop never sees any of this (`lg:hidden`).
 */
export function MobileDock({ settings }: { settings: DockSettings }) {
  const pathname = usePathname()
  const listRef = useRef<HTMLUListElement>(null)
  const timesRef = useRef<HTMLDialogElement>(null)
  const menuRef = useRef<HTMLDialogElement>(null)
  const times = useSheet(timesRef)
  const menu = useSheet(menuRef)

  useDockScrub(listRef)
  usePortalOrigin()

  const liveUrl = settings.isLive ? settings.livestreamUrl : undefined

  return (
    <>
      <div className="mobile-dock-wrap lg:hidden">
        <nav aria-label="Quick actions" className="mobile-dock">
          <ul ref={listRef} className="mobile-dock-list">
            <DockItem icon="clock" label="Times" onClick={times.open} />
            <DockItem external href={settings.address.mapUrl} icon="map-pin" label="Directions" />
            {liveUrl ? (
              <DockItem external href={liveUrl} icon="play" label="Live" live />
            ) : (
              <DockItem
                current={pathname.startsWith('/watch')}
                href="/watch"
                icon="play"
                label="Watch"
              />
            )}
            <DockItem current={pathname === '/prayer'} href="/prayer" icon="flame" label="Pray" />
            <DockItem current={pathname === '/give'} href="/give" icon="heart" label="Give" />
          </ul>
        </nav>

        <button
          aria-expanded={menu.isOpen}
          aria-haspopup="dialog"
          aria-label="Menu"
          className="mobile-dock-orb press"
          onClick={menu.open}
          type="button"
        >
          <span aria-hidden="true" className="mobile-dock-orb-glyph">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <dialog
        ref={timesRef}
        aria-labelledby="times-sheet-title"
        className="times-sheet lg:hidden"
        onClick={times.closeOnBackdrop}
        onClose={times.onClose}
      >
        {times.isOpen ? <LiquidEdge className="times-sheet-edge" /> : null}
        <div className="times-sheet-body">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="immersive-kicker">Every Saturday</p>
              <h2 className="mt-2 font-display text-heading-2" id="times-sheet-title">
                Come <span className="immersive-accent-word">as you are</span>
              </h2>
            </div>
            <CloseButton onClick={times.close} />
          </div>

          <dl className="mt-6 divide-y divide-[var(--im-rule)] border-y border-[var(--im-rule)]">
            {settings.serviceTimes.map((service, index) => (
              <div
                key={service.label}
                className="sheet-row flex items-baseline justify-between gap-4 py-4"
                style={{ '--i': index } as React.CSSProperties}
              >
                <dt className="font-sans text-body-sm">{service.label}</dt>
                <dd className="tabular font-display text-heading-3">{service.startTime}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 font-sans text-body-sm opacity-80">
            {settings.address.street}, {settings.address.city}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <a
              className="immersive-button press"
              href={settings.address.mapUrl}
              rel="noreferrer noopener"
              target="_blank"
            >
              <Icon name="map-pin" />
              Directions
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <Link className="immersive-button immersive-button-primary press" href="/visit">
              Plan a visit
              <Icon name="arrow-right" />
            </Link>
          </div>
        </div>
      </dialog>

      <dialog
        ref={menuRef}
        aria-label="Site navigation"
        className="portal-menu lg:hidden"
        onClose={menu.onClose}
      >
        <div className="portal-menu-inner">
          <div className="flex items-center justify-between">
            <p className="font-display text-[1.25rem] uppercase">Clairemont</p>
            <CloseButton onClick={menu.close} />
          </div>

          <nav aria-label="Primary" className="mt-6 flex-1 overflow-y-auto overscroll-contain">
            <ul>
              {primaryNav.map((section, index) => {
                const isCurrent =
                  pathname === section.href || pathname.startsWith(`${section.href}/`)
                return (
                  <li
                    key={section.href}
                    className="portal-menu-item"
                    style={{ '--i': index } as React.CSSProperties}
                  >
                    <Link
                      aria-current={pathname === section.href ? 'page' : undefined}
                      className="portal-menu-link press"
                      href={section.href}
                    >
                      <span className="portal-menu-index">0{index + 1}</span>
                      <span className={cn(isCurrent && 'immersive-accent-word')}>
                        {section.label}
                      </span>
                    </Link>
                    <ul className="portal-menu-children">
                      {section.links
                        .filter((link) => link.href !== section.href)
                        .map((link) => (
                          <li key={`${link.href}-${link.label}`}>
                            <Link
                              aria-current={pathname === link.href ? 'page' : undefined}
                              className="portal-menu-chip press"
                              href={link.href}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="portal-menu-foot">
            <ThemeToggle withLabel />
            <a
              className="inline-flex min-h-11 items-center gap-2 font-sans text-body-sm"
              href={`tel:${settings.phone}`}
            >
              <Icon name="phone" />
              {settings.phone}
            </a>
          </div>
        </div>
      </dialog>
    </>
  )
}

function DockItem({
  icon,
  label,
  href,
  external,
  onClick,
  current,
  live,
}: {
  icon: IconName
  label: string
  href?: string
  external?: boolean
  onClick?: () => void
  current?: boolean
  live?: boolean
}) {
  const inner: ReactNode = (
    <>
      <span className="mobile-dock-icon">
        <Icon name={icon} />
        {live ? <span aria-hidden="true" className="mobile-dock-live" /> : null}
      </span>
      <span className="mobile-dock-label">{label}</span>
    </>
  )

  const className = 'mobile-dock-item press'

  return (
    <li className="flex-1">
      {onClick ? (
        <button
          aria-haspopup="dialog"
          className={className}
          data-dock-item
          onClick={onClick}
          type="button"
        >
          {inner}
        </button>
      ) : external ? (
        <a
          className={className}
          data-dock-item
          href={href}
          rel="noreferrer noopener"
          target="_blank"
        >
          {inner}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <Link
          aria-current={current ? 'page' : undefined}
          className={className}
          data-dock-item
          href={href ?? '/'}
        >
          {inner}
        </Link>
      )}
    </li>
  )
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="press -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full"
      onClick={onClick}
      type="button"
    >
      <span className="sr-only">Close</span>
      <Icon name="close" className="text-[1.25rem]" />
    </button>
  )
}

/**
 * A native dialog that plays a closing animation before it closes, and closes itself
 * when the route changes underneath it.
 */
function useSheet(ref: RefObject<HTMLDialogElement | null>) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const open = useCallback(() => {
    const dialog = ref.current
    if (!dialog || dialog.open) return
    dialog.removeAttribute('data-closing')
    dialog.showModal()
    setIsOpen(true)
  }, [ref])

  const close = useCallback(() => {
    const dialog = ref.current
    if (!dialog?.open) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialog.close()
      return
    }
    dialog.setAttribute('data-closing', '')
    window.setTimeout(() => dialog.close(), CLOSE_MS)
  }, [ref])

  useEffect(() => {
    ref.current?.close()
  }, [pathname, ref])

  useEffect(() => {
    if (!isOpen) return
    const { style } = document.documentElement
    const previous = style.overflow
    style.overflow = 'hidden'
    return () => {
      style.overflow = previous
    }
  }, [isOpen])

  return {
    isOpen,
    open,
    close,
    onClose: () => {
      ref.current?.removeAttribute('data-closing')
      setIsOpen(false)
    },
    /** A click whose target is the dialog itself landed on the backdrop. */
    closeOnBackdrop: (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target === event.currentTarget) close()
    },
  }
}

/**
 * Records the last touch point as `--portal-x` / `--portal-y`, so Golden Hour's menu and
 * page transitions open as a circle from wherever the finger actually was.
 */
function usePortalOrigin() {
  useEffect(() => {
    const root = document.documentElement.style
    const mark = (event: PointerEvent) => {
      root.setProperty('--portal-x', `${Math.round(event.clientX)}px`)
      root.setProperty('--portal-y', `${Math.round(event.clientY)}px`)
    }
    window.addEventListener('pointerdown', mark, { capture: true, passive: true })
    return () => window.removeEventListener('pointerdown', mark, { capture: true })
  }, [])
}

/**
 * Drag a finger along the dock and the icon under it lifts, like a magnifying dock.
 * Let go over an item and it opens. A plain tap still works exactly as a tap.
 *
 * Writes one CSS variable per item from a single animation frame; React never re-renders.
 */
function useDockScrub(listRef: RefObject<HTMLUListElement | null>) {
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let down = false
    let startX = 0
    let scrubbing = false
    let swallowClick = false
    let nearest: Element | null = null

    const items = () => Array.from(list.querySelectorAll<HTMLElement>('[data-dock-item]'))

    const paint = (x: number | null) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        let best: HTMLElement | null = null
        let bestLift = 0
        for (const item of items()) {
          if (x === null) {
            item.style.removeProperty('--lift')
            continue
          }
          const rect = item.getBoundingClientRect()
          const distance = Math.abs(x - (rect.left + rect.width / 2))
          const lift = Math.max(0, 1 - distance / (rect.width * 1.5))
          item.style.setProperty('--lift', lift.toFixed(3))
          if (lift > bestLift) {
            bestLift = lift
            best = item
          }
        }
        if (scrubbing && best && best !== nearest) {
          nearest = best
          navigator.vibrate?.(6)
        }
      })
    }

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return
      down = true
      scrubbing = false
      nearest = null
      startX = event.clientX
      paint(event.clientX)
    }

    const onMove = (event: PointerEvent) => {
      if (!down) return
      if (Math.abs(event.clientX - startX) > 10) scrubbing = true
      paint(event.clientX)
    }

    const onUp = (event: PointerEvent) => {
      if (!down) return
      down = false
      paint(null)
      if (!scrubbing) return
      swallowClick = true
      window.setTimeout(() => (swallowClick = false), 400)
      const target = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest<HTMLElement>('[data-dock-item]')
      target?.click()
    }

    const onCancel = () => {
      down = false
      paint(null)
    }

    const onClick = (event: MouseEvent) => {
      if (swallowClick && event.isTrusted) {
        event.preventDefault()
        event.stopPropagation()
        swallowClick = false
      }
    }

    list.addEventListener('pointerdown', onDown)
    list.addEventListener('pointermove', onMove)
    list.addEventListener('pointerup', onUp)
    list.addEventListener('pointercancel', onCancel)
    list.addEventListener('click', onClick, true)
    return () => {
      cancelAnimationFrame(frame)
      list.removeEventListener('pointerdown', onDown)
      list.removeEventListener('pointermove', onMove)
      list.removeEventListener('pointerup', onUp)
      list.removeEventListener('pointercancel', onCancel)
      list.removeEventListener('click', onClick, true)
    }
  }, [listRef])
}
