import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { MobileNavSheet } from '@/components/layout/mobile-nav-sheet'
import { PrimaryNav } from '@/components/layout/primary-nav'
import type { SiteSettings } from '@/types/content'

interface SiteHeaderProps {
  settings: SiteSettings
}

/**
 * The site header: wordmark, centered primary navigation, and one call to action.
 *
 * A Server Component. The current-page marker, the contents drawer, and the mobile
 * sheet are the only leaves that need the browser.
 */
export function SiteHeader({ settings }: SiteHeaderProps) {
  return (
    <header className="site-header relative sticky top-0 z-40 border-b border-rule bg-paper">
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-6 lg:min-h-20 lg:justify-start lg:gap-10">
          <Link className="flex shrink-0 flex-col justify-center py-2" href="/">
            <span className="site-header-wordmark font-display text-heading-3 leading-none uppercase">
              Clairemont
            </span>
            <span className="site-header-kicker mt-1 font-sans text-eyebrow text-ink-muted uppercase">
              Seventh-day Adventist Church
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <PrimaryNav />
          </div>

          <div className="hidden shrink-0 items-center gap-6 lg:flex">
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
              className="site-header-link font-sans text-body-sm text-ink-soft underline decoration-transparent underline-offset-8 transition-colors duration-[var(--dur-instant)] ease-out hover:text-ink hover:decoration-dawn"
              href={settings.givingUrl}
              rel="noreferrer noopener"
              target="_blank"
            >
              Give
            </a>
            <Link
              className="site-header-cta bg-grad-cta hover:bg-grad-cta-hover inline-flex min-h-10 items-center rounded-full px-5 font-sans text-body-sm font-medium text-paper transition-[background-image] duration-[var(--dur-instant)] ease-out"
              href="/visit"
            >
              Plan Your Visit
            </Link>
          </div>

          <MobileNavSheet
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
