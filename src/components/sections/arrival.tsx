import { Container } from '@/components/layout/container'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import type { HomePageContent, SiteSettings } from '@/types/content'

interface ArrivalProps {
  content: HomePageContent['arrival']
  settings: SiteSettings
}

/**
 * Chapter 01 — Arrival.
 *
 * The headline is plain server-rendered text at first paint because it is the LCP
 * element. Nothing in this chapter animates on entrance, so the motion system costs
 * the first screen nothing at all.
 *
 * Phase 1 renders the composed resting frame: sky, plate and type at the positions the
 * scroll and pointer parallax will later move around. That resting frame is the
 * reduced-motion state, which is why it is the thing built first.
 */
export function Arrival({ content, settings }: ArrivalProps) {
  const primaryServices = settings.serviceTimes.filter((service) => service.isPrimary)

  return (
    <section
      aria-labelledby="arrival-headline"
      className="relative isolate overflow-hidden bg-gradient-to-b from-sky-300 via-sky-100 to-paper"
      id="arrival"
    >
      <Container>
        <div className="grid min-h-[calc(100dvh-4rem)] grid-cols-1 items-center gap-12 py-section-sm lg:min-h-[calc(100dvh-5rem)] lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 lg:col-start-1">
            <h1 className="font-serif text-display-1 text-balance text-ink" id="arrival-headline">
              {content.headline}
            </h1>

            <p className="mt-8 max-w-measure-lead font-sans text-body-lg text-ink-70">
              {settings.name}
            </p>

            <div className="mt-10 border-t border-rule pt-6">
              <Eyebrow>Saturdays</Eyebrow>
              <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
                {primaryServices.map((service) => (
                  <div key={service.label}>
                    <dt className="font-sans text-body-sm text-ink-70">{service.label}</dt>
                    <dd className="tabular font-serif text-heading-2 text-ink">
                      {service.startTime}
                    </dd>
                  </div>
                ))}
              </dl>
              <a
                className="mt-5 inline-block font-sans text-body-sm text-ink-70 underline decoration-rule underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out hover:text-ink hover:decoration-dawn"
                href={settings.address.mapUrl}
                rel="noreferrer noopener"
                target="_blank"
              >
                {settings.address.street}, {settings.address.city}, {settings.address.state}{' '}
                {settings.address.postalCode}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/visit">Plan Your Visit</Button>
              <Button href="/watch" variant="secondary">
                Watch Online
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <MediaPlaceholder
              className="aspect-[4/5] w-full sm:aspect-[3/2] lg:aspect-[4/5]"
              description={content.hero.description}
              tone="sky"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-dawn/40 py-5">
          <Eyebrow index="01">Arrival</Eyebrow>
          <span aria-hidden="true" className="font-sans text-body-sm text-ink-45">
            ↓
          </span>
        </div>
      </Container>
    </section>
  )
}
