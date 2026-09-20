import { Container } from '@/components/layout/container'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import type { HomePageContent, SiteSettings } from '@/types/content'

interface InvitationProps {
  content: HomePageContent['invitation']
  settings: SiteSettings
}

/**
 * Chapter 10 — Come and See. Morning again.
 *
 * The emotional work is done, so what remains is removing friction. Facts first and
 * large, because this is the screen someone will have open in their car.
 *
 * Times, address, phone and directions all come from `siteSettings`, so correcting the
 * church's phone number in one place updates the hero, this chapter and the footer at
 * once.
 */
export function Invitation({ content, settings }: InvitationProps) {
  return (
    <section
      aria-labelledby="invitation-title"
      className="bg-paper-bloom py-section-lg"
      id="visit"
    >
      <Container>
        <Eyebrow index="04">Come and see</Eyebrow>
        <h2 className="mt-6 max-w-measure-lead font-display text-display-2" id="invitation-title">
          {content.headline}
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 lg:col-start-1">
            <dl className="border-t border-rule">
              <div className="border-b border-rule py-6">
                <dt className="font-sans text-eyebrow text-ink-muted uppercase">Saturdays</dt>
                <dd className="mt-3 space-y-1">
                  {settings.serviceTimes
                    .filter((service) => service.isPrimary)
                    .map((service) => (
                      <p key={service.label} className="font-sans text-body text-ink">
                        {service.label}
                        <span aria-hidden="true"> · </span>
                        <span className="tabular">{service.startTime}</span>
                      </p>
                    ))}
                </dd>
              </div>

              <div className="border-b border-rule py-6">
                <dt className="font-sans text-eyebrow text-ink-muted uppercase">Where</dt>
                <dd className="mt-3">
                  <a
                    className="font-sans text-body text-ink underline decoration-rule underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out hover:decoration-dawn"
                    href={settings.address.mapUrl}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {settings.address.street}, {settings.address.city}, {settings.address.state}{' '}
                    {settings.address.postalCode}
                  </a>
                  <p className="mt-3 max-w-measure font-sans text-body-sm text-ink-soft">
                    {settings.address.directions}
                  </p>
                  <p className="mt-3 max-w-measure font-sans text-body-sm text-ink-soft">
                    {content.parking}
                  </p>
                </dd>
              </div>

              <div className="border-b border-rule py-6">
                <dt className="font-sans text-eyebrow text-ink-muted uppercase">What to expect</dt>
                <dd className="mt-3">
                  <ul className="space-y-2">
                    {content.whatToExpect.map((item) => (
                      <li
                        key={item.slice(0, 30)}
                        className="max-w-measure font-sans text-body text-ink-soft"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button href="/visit">Plan Your Visit</Button>
              <a
                className="font-sans text-body-sm text-ink-soft underline decoration-rule underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out hover:text-ink hover:decoration-dawn"
                href={`tel:${settings.phone}`}
              >
                {settings.phone}
              </a>
              <a
                className="font-sans text-body-sm text-ink-soft underline decoration-rule underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out hover:text-ink hover:decoration-dawn"
                href={`mailto:${settings.email}`}
              >
                {settings.email}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <MediaPlaceholder
              className="aspect-[4/3]"
              description={content.entrance.description}
              image={content.entrance.image}
              tone="cool"
            />
            {/* A static map image linking out, never an embedded interactive map:
                nobody pans a map on a phone, and an embed costs several hundred
                kilobytes of third-party JavaScript for the privilege. */}
            <a
              className="mt-6 block"
              href={settings.address.mapUrl}
              rel="noreferrer noopener"
              target="_blank"
            >
              <MediaPlaceholder
                className="aspect-[16/9]"
                description="Static map image of 4125 Hathaway Street, generated at build time and linking to Google Maps."
                tone="warm"
              />
              <span className="mt-3 inline-block font-sans text-body-sm text-ink underline decoration-dawn decoration-1 underline-offset-4">
                Get directions
              </span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
