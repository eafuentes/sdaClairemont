import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import type { SiteSettings } from '@/types/content'

interface SiteFooterProps {
  settings: SiteSettings
}

const exploreLinks = [
  { label: 'Plan Your Visit', href: '/visit' },
  { label: 'About Us', href: '/about' },
  { label: 'Ministries', href: '/ministries' },
  { label: 'Events', href: '/events' },
  { label: 'Watch & Listen', href: '/watch' },
  { label: 'Prayer Requests', href: '/prayer' },
]

/**
 * The footer, which is also the last chance to answer the practical question.
 *
 * Service times and the address appear here in full rather than as a link to a page
 * that has them, because a visitor who scrolled this far is usually looking for
 * exactly those two facts.
 */
export function SiteFooter({ settings }: SiteFooterProps) {
  const primaryServices = settings.serviceTimes.filter((service) => service.isPrimary)

  return (
    <footer className="register-dusk">
      <Container>
        <div className="grid gap-12 py-section md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-1">
            <p className="font-serif text-heading-2 leading-tight">
              Clairemont
              <span className="block font-sans text-eyebrow text-paper-on-dusk/60 uppercase">
                Seventh-day Adventist Church
              </span>
            </p>
            <p className="mt-6 max-w-measure font-sans text-body-sm text-paper-on-dusk/70">
              {settings.tagline}
            </p>
          </div>

          <div>
            <Eyebrow className="text-dawn-soft">Gather with us</Eyebrow>
            <ul className="mt-5 space-y-3">
              {primaryServices.map((service) => (
                <li key={service.label} className="font-sans text-body-sm">
                  <span className="block text-paper-on-dusk">{service.label}</span>
                  <span className="tabular block text-paper-on-dusk/60">
                    {service.day} {service.startTime}
                    {service.endTime ? `–${service.endTime}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow className="text-dawn-soft">Find us</Eyebrow>
            <address className="mt-5 font-sans text-body-sm text-paper-on-dusk/70 not-italic">
              <a
                className="block underline decoration-paper-on-dusk/25 underline-offset-4 hover:decoration-dawn-soft"
                href={settings.address.mapUrl}
                rel="noreferrer noopener"
                target="_blank"
              >
                {settings.address.street}
                <br />
                {settings.address.city}, {settings.address.state} {settings.address.postalCode}
              </a>
              <a
                className="mt-4 block underline decoration-paper-on-dusk/25 underline-offset-4 hover:decoration-dawn-soft"
                href={`tel:${settings.phone}`}
              >
                {settings.phone}
              </a>
              <a
                className="mt-1 block underline decoration-paper-on-dusk/25 underline-offset-4 hover:decoration-dawn-soft"
                href={`mailto:${settings.email}`}
              >
                {settings.email}
              </a>
            </address>
          </div>

          <div>
            <Eyebrow className="text-dawn-soft">Explore</Eyebrow>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="font-sans text-body-sm text-paper-on-dusk/70 underline decoration-transparent underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out hover:text-paper-on-dusk hover:decoration-dawn-soft"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-paper-on-dusk/15 py-8 font-sans text-body-sm text-paper-on-dusk/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.name}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {settings.facebookUrl ? (
              <a
                className="underline decoration-transparent underline-offset-4 hover:text-paper-on-dusk hover:decoration-dawn-soft"
                href={settings.facebookUrl}
                rel="noreferrer noopener"
                target="_blank"
              >
                Facebook
              </a>
            ) : null}
            <a
              className="underline decoration-transparent underline-offset-4 hover:text-paper-on-dusk hover:decoration-dawn-soft"
              href={settings.givingUrl}
              rel="noreferrer noopener"
              target="_blank"
            >
              AdventistGiving
            </a>
            <span>Southeastern California Conference</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
