'use client'

import Link from 'next/link'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'

import { Container } from '@/components/layout/container'
import { primaryNav, type NavLinkItem, type NavSection } from '@/content/navigation'
import { brandGradient } from '@/styles/palette'
import { DURATION, EASE_OUT, SPRING } from '@/lib/motion'
import { cn } from '@/lib/utils'

const CLOSE_DELAY_MS = 160

/**
 * Desktop primary navigation: a journal contents drawer.
 *
 * Hover or focus a section and a full-width panel unfurls from the header — intro
 * on the left, a list of destinations on the right. Moving to a neighbour
 * cross-fades the contents. A dawn tick slides under the open word.
 */
export function PrimaryNav() {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const navRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])
  const closeTimer = useRef<number | null>(null)
  const drawerId = useId()

  const [openHref, setOpenHref] = useState<string | null>(null)
  const [tickX, setTickX] = useState(0)

  const openSection = primaryNav.find((section) => section.href === openHref) ?? null

  function cancelClose() {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  function scheduleClose() {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setOpenHref(null), CLOSE_DELAY_MS)
  }

  function openSectionAt(section: NavSection, index: number) {
    cancelClose()
    setOpenHref(section.href)
    const item = itemRefs.current[index]
    if (!item) return
    setTickX(item.offsetLeft + item.offsetWidth / 2 - 12)
  }

  useEffect(() => {
    setOpenHref(null)
  }, [pathname])

  useEffect(() => {
    document.documentElement.classList.toggle('nav-drawer-open', openHref !== null)
    return () => document.documentElement.classList.remove('nav-drawer-open')
  }, [openHref])

  useEffect(() => {
    if (!openHref) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenHref(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openHref])

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    }
  }, [])

  return (
    <nav
      aria-label="Primary"
      className="hidden lg:block"
      onFocusCapture={cancelClose}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      ref={navRef}
    >
      <ul className="relative flex items-center gap-7">
        <m.span
          aria-hidden="true"
          animate={prefersReducedMotion ? { x: tickX } : { x: tickX, opacity: openSection ? 1 : 0 }}
          className="pointer-events-none absolute -bottom-1 h-px w-6 bg-dawn"
          initial={false}
          transition={{ type: 'spring', ...SPRING.follow }}
        />
        {primaryNav.map((section, index) => {
          const isOpen = section.href === openHref
          const isCurrent =
            pathname === section.href || pathname.startsWith(`${section.href}/`)

          return (
            <li
              key={section.href}
              ref={(node) => {
                itemRefs.current[index] = node
              }}
            >
              <Link
                aria-controls={drawerId}
                aria-current={isCurrent ? 'page' : undefined}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className={cn(
                  'site-header-link cursor-pointer font-sans text-body-sm underline decoration-1 underline-offset-8 transition-colors duration-[var(--dur-instant)] ease-out',
                  isCurrent || isOpen
                    ? 'text-ink decoration-dawn decoration-2'
                    : 'text-ink-soft decoration-transparent hover:text-ink hover:decoration-dawn',
                )}
                href={section.href}
                onFocus={() => openSectionAt(section, index)}
                onMouseEnter={() => openSectionAt(section, index)}
              >
                {section.label}
              </Link>
            </li>
          )
        })}
      </ul>

      <AnimatePresence>
        {openSection ? (
          <m.div
            animate={{ opacity: 1, y: 0 }}
            aria-label={`${openSection.label} pages`}
            className="absolute inset-x-0 top-full z-30 border-b border-rule bg-paper"
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            id={drawerId}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
            key="nav-drawer"
            role="region"
            transition={{ duration: prefersReducedMotion ? 0 : DURATION.base, ease: EASE_OUT }}
          >
            <Container>
              <AnimatePresence mode="wait">
                <m.div
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-12 gap-10 py-8"
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
                  key={openSection.href}
                  transition={{
                    duration: prefersReducedMotion ? 0 : DURATION.quick,
                    ease: EASE_OUT,
                  }}
                >
                  <div className="col-span-5">
                    <p className="font-sans text-eyebrow text-ink-muted uppercase">
                      {openSection.label}
                    </p>
                    <p className="mt-3 max-w-measure font-display text-heading-2 text-ink">
                      {openSection.intro}
                    </p>
                  </div>

                  <ul className="col-span-6 col-start-7 border-y border-rule">
                    {openSection.links.map((link) => (
                      <NavDrawerLink
                        current={
                          pathname === link.href ||
                          (link.href !== openSection.href &&
                            pathname.startsWith(`${link.href}/`))
                        }
                        key={`${link.href}-${link.label}`}
                        link={link}
                      />
                    ))}
                  </ul>
                </m.div>
              </AnimatePresence>
            </Container>
          </m.div>
        ) : null}
      </AnimatePresence>
    </nav>
  )
}

/**
 * One destination in the drawer. Hover (and focus) wipes the brand gradient
 * across the row from the left; type inverts to paper. The cursor is a pointer
 * so the row reads as a hit target, not a line of type.
 */
function NavDrawerLink({ link, current }: { link: NavLinkItem; current: boolean }) {
  return (
    <li className="border-b border-rule last:border-b-0">
      <Link
        aria-current={current ? 'page' : undefined}
        className="group relative flex min-h-12 cursor-pointer items-baseline justify-between gap-6 overflow-hidden px-4 py-3.5"
        href={link.href}
        rel={link.external ? 'noreferrer noopener' : undefined}
        target={link.external ? '_blank' : undefined}
      >
        <span
          aria-hidden="true"
          className={cn(
            brandGradient.horizon,
            'pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-[var(--dur-quick)] ease-out',
            'group-hover:scale-x-100 group-focus-visible:scale-x-100',
          )}
        />
        {current ? (
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 z-10 w-0.5 bg-dawn transition-colors duration-[var(--dur-quick)] ease-out group-hover:bg-paper group-focus-visible:bg-paper"
          />
        ) : null}

        <span
          className={cn(
            'relative font-display text-heading-3 transition-colors duration-[var(--dur-quick)] ease-out',
            'group-hover:text-paper group-focus-visible:text-paper',
            current ? 'text-ink' : 'text-ink-soft',
          )}
        >
          {link.label}
        </span>

        <span className="relative hidden items-baseline gap-3 xl:flex">
          {link.hint ? (
            <span
              className={cn(
                'max-w-[22ch] text-right font-sans text-body-sm text-ink-muted transition-colors duration-[var(--dur-quick)] ease-out',
                'group-hover:text-paper/75 group-focus-visible:text-paper/75',
              )}
            >
              {link.hint}
            </span>
          ) : null}
          <span
            aria-hidden="true"
            className="font-sans text-body-sm text-paper opacity-0 transition-[opacity,transform] duration-[var(--dur-quick)] ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100 -translate-x-1"
          >
            →
          </span>
        </span>
      </Link>
    </li>
  )
}
