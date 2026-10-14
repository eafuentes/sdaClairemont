'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/ui/icon'
import { primaryNav } from '@/content/navigation'
import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/types/content'

interface MobileNavSheetProps {
  settings: Pick<SiteSettings, 'givingUrl' | 'phone' | 'address'>
}

/**
 * The mobile navigation sheet.
 *
 * Built on the native `<dialog>` element with `showModal()`, which gives focus
 * trapping, focus restoration on close, Escape-to-dismiss, inertness of the page
 * behind, and correct `role="dialog"` semantics from the browser.
 */
export function MobileNavSheet({ settings }: MobileNavSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    dialogRef.current?.close()
  }, [pathname])

  useEffect(() => {
    document.documentElement.classList.toggle('nav-drawer-open', isOpen)
    return () => document.documentElement.classList.remove('nav-drawer-open')
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const { style } = document.documentElement
    const previousOverflow = style.overflow
    style.overflow = 'hidden'

    return () => {
      style.overflow = previousOverflow
    }
  }, [isOpen])

  return (
    <>
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={isOpen ? 'Close menu' : 'Menu'}
        className="site-header-menu -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-xs text-ink lg:hidden"
        onClick={() => dialogRef.current?.showModal()}
        type="button"
      >
        <span aria-hidden="true" className="relative block h-3 w-5">
          <span
            className={cn(
              'site-header-menu-bar absolute left-0 h-px w-full bg-ink transition-transform duration-[var(--dur-quick)] ease-out',
              isOpen ? 'top-[5px] rotate-45' : 'top-0',
            )}
          />
          <span
            className={cn(
              'site-header-menu-bar absolute left-0 h-px w-full bg-ink transition-transform duration-[var(--dur-quick)] ease-out',
              isOpen ? 'top-[5px] -rotate-45' : 'bottom-0',
            )}
          />
        </span>
      </button>

      <dialog
        aria-label="Site navigation"
        className="m-0 h-dvh max-h-dvh w-full max-w-none bg-paper p-0 text-ink backdrop:bg-ink/40"
        onClose={() => setIsOpen(false)}
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
        ref={dialogRef}
      >
        <div className="flex h-full flex-col px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between">
            <p className="font-display text-[1.25rem] uppercase">Clairemont</p>
            <button
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-xs text-ink"
              onClick={() => dialogRef.current?.close()}
              type="button"
            >
              <span className="sr-only">Close</span>
              <Icon name="close" className="text-[1.25rem]" />
            </button>
          </div>

          <nav aria-label="Primary" className="mt-10 flex-1 overflow-y-auto">
            <ul className="flex flex-col">
              {primaryNav.map((section) => {
                const isCurrent =
                  pathname === section.href || pathname.startsWith(`${section.href}/`)

                return (
                  <li key={section.href} className="border-t border-rule">
                    <Link
                      aria-current={isCurrent && pathname === section.href ? 'page' : undefined}
                      className="flex min-h-14 items-center font-display text-heading-3"
                      href={section.href}
                    >
                      {section.label}
                      {isCurrent ? (
                        <span aria-hidden="true" className="ml-3 h-1 w-1 rounded-full bg-dawn" />
                      ) : null}
                    </Link>
                    {section.links.length > 0 ? (
                      <ul className="mb-3 flex flex-col">
                        {section.links.map((link) => {
                          const childCurrent = pathname === link.href
                          return (
                            <li key={`${link.href}-${link.label}`}>
                              <Link
                                aria-current={childCurrent ? 'page' : undefined}
                                className="flex min-h-11 items-center justify-between gap-4 py-2 font-sans text-body-sm text-ink-soft"
                                href={link.href}
                              >
                                <span>{link.label}</span>
                                {link.external ? <Icon name="arrow-up-right" /> : null}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="border-t border-rule pt-5">
            <Link
              className="bg-grad-cta inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-6 font-sans text-body-sm font-medium text-paper shadow-cta"
              href="/visit"
            >
              Plan Your Visit
              <Icon name="arrow-right" />
            </Link>
            <div className="mt-5 flex flex-col font-sans text-body-sm text-ink-soft">
              <a
                className="inline-flex min-h-11 items-center gap-3"
                href={`tel:${settings.phone}`}
              >
                <Icon name="phone" />
                {settings.phone}
              </a>
              <p className="inline-flex min-h-11 items-center gap-3">
                <Icon name="map-pin" />
                {settings.address.street}, {settings.address.city}
              </p>
              <a
                className="inline-flex min-h-11 items-center gap-3 text-ink"
                href={settings.givingUrl}
                rel="noreferrer noopener"
                target="_blank"
              >
                Give
                <Icon name="arrow-up-right" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
