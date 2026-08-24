import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { MobileNavSheet } from '@/components/layout/mobile-nav-sheet'
import { NavLink } from '@/components/layout/nav-link'
import type { SiteSettings } from '@/types/content'

interface SiteHeaderProps {
  settings: SiteSettings
}

/**
 * The site header: wordmark, primary navigation, and a single clear call to action.
 *
 * A Server Component. Only the two leaves that genuinely need the browser — the
 * current-page marker and the mobile sheet — cross the client boundary.
 *
 * Phase 1 renders the header in its resolved, opaque state. The transition where it
 * begins transparent over the hero and settles into paper as the page scrolls belongs
 * to the motion system and arrives in Phase 3.
 */
export function SiteHeader({ settings }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-8 lg:min-h-20">
          <Link className="flex flex-col justify-center py-2" href="/">
            <span className="font-serif text-heading-3 leading-none">Clairemont</span>
            <span className="mt-1 font-sans text-eyebrow text-ink-muted uppercase">
              Seventh-day Adventist Church
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {settings.primaryNav.map((item) => (
                <li key={item.href}>
                  <NavLink
                    activeClassName="text-ink decoration-dawn decoration-2"
                    className="font-sans text-body-sm text-ink-soft underline decoration-transparent decoration-1 underline-offset-8 transition-colors duration-[var(--dur-instant)] ease-out hover:text-ink hover:decoration-dawn"
                    href={item.href}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            {settings.isLive && settings.livestreamUrl ? (
              <a
                className="inline-flex items-center gap-2 font-sans text-eyebrow text-dawn uppercase"
                href={settings.livestreamUrl}
                rel="noreferrer noopener"
                target="_blank"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-dawn" />
                Live now
              </a>
            ) : null}
            <a
              className="font-sans text-body-sm text-ink-soft underline decoration-rule underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out hover:text-ink hover:decoration-dawn"
              href={settings.givingUrl}
              rel="noreferrer noopener"
              target="_blank"
            >
              Give
            </a>
            <Link
              className="inline-flex min-h-11 items-center rounded-xs bg-ink px-5 font-sans text-body-sm font-medium text-paper transition-colors duration-[var(--dur-instant)] ease-out hover:bg-ink-soft"
              href="/visit"
            >
              Plan Your Visit
            </Link>
          </div>

          <MobileNavSheet
            navItems={settings.primaryNav}
            settings={{
              givingUrl: settings.givingUrl,
              phone: settings.phone,
              address: settings.address,
            }}
          />
        </div>
      </Container>
    </header>
  )
}
