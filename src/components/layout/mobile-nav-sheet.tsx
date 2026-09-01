'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { NavItem, SiteSettings } from '@/types/content'

interface MobileNavSheetProps {
  navItems: NavItem[]
  settings: Pick<SiteSettings, 'givingUrl' | 'phone' | 'address'>
}

/**
 * The mobile navigation sheet.
 *
 * Built on the native `<dialog>` element with `showModal()`, which gives focus
 * trapping, focus restoration on close, Escape-to-dismiss, inertness of the page
 * behind, and correct `role="dialog"` semantics from the browser. A hand-written focus
 * trap would be more code and would get the edge cases wrong; this gets them right by
 * not implementing them.
 *
 * Deliberately unanimated in Phase 1. The sheet's slide and the staggered link reveal
 * arrive with the motion system in Phase 3.
 */
export function MobileNavSheet({ navItems, settings }: MobileNavSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close on navigation. The dialog would otherwise stay open over the new page.
  useEffect(() => {
    dialogRef.current?.close()
  }, [pathname])

  // `showModal` blocks interaction behind the dialog but does not reliably stop the
  // document from scrolling on iOS Safari.
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
        className="site-header-menu -mr-2 inline-flex min-h-11 items-center gap-2 rounded-xs px-2 font-sans text-eyebrow text-ink uppercase lg:hidden"
        onClick={() => dialogRef.current?.showModal()}
        type="button"
      >
        <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
          <span className="site-header-menu-bar h-px w-full bg-ink" />
          <span className="site-header-menu-bar h-px w-full bg-ink" />
        </span>
        Menu
      </button>

      <dialog
        aria-label="Site navigation"
        className="m-0 h-dvh max-h-dvh w-full max-w-none bg-paper p-0 text-ink backdrop:bg-ink/40"
        onClose={() => setIsOpen(false)}
        // The dialog element does not fire a dedicated open event.
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
        ref={dialogRef}
      >
        <div className="flex h-full flex-col px-5 py-6">
          <div className="flex items-center justify-between">
            <p className="font-serif text-heading-3">Clairemont</p>
            <button
              className="-mr-2 inline-flex min-h-11 items-center rounded-xs px-2 font-sans text-eyebrow text-ink uppercase"
              onClick={() => dialogRef.current?.close()}
              type="button"
            >
              Close
            </button>
          </div>

          <nav aria-label="Primary" className="mt-12 flex-1">
            <ul className="flex flex-col">
              {navItems.map((item) => {
                const isCurrent = pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <li key={item.href} className="border-t border-rule">
                    <Link
                      aria-current={isCurrent ? 'page' : undefined}
                      className="flex min-h-14 items-center font-serif text-heading-1"
                      href={item.href}
                    >
                      {item.label}
                      {isCurrent ? (
                        <span aria-hidden="true" className="ml-3 h-1 w-1 rounded-full bg-dawn" />
                      ) : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="border-t border-rule pt-6">
            <Link
              className="mb-4 inline-flex min-h-11 items-center font-sans text-body-sm text-ink underline decoration-dawn decoration-1 underline-offset-4"
              href="/this-sabbath"
            >
              This Sabbath
            </Link>
            <Link
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xs bg-ink px-6 font-sans text-body-sm font-medium text-paper"
              href="/visit"
            >
              Plan Your Visit
            </Link>
            <div className="mt-6 flex flex-col gap-1 font-sans text-body-sm text-ink-soft">
              <a
                className="underline decoration-rule underline-offset-4"
                href={`tel:${settings.phone}`}
              >
                {settings.phone}
              </a>
              <p>
                {settings.address.street}, {settings.address.city}
              </p>
              <a
                className="mt-2 underline decoration-dawn underline-offset-4"
                href={settings.givingUrl}
                rel="noreferrer noopener"
                target="_blank"
              >
                Give
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
