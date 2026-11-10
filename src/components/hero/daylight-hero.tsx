import Image from 'next/image'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import type { HomePageContent, SiteSettings } from '@/types/content'

interface DaylightHeroProps {
  content: HomePageContent['arrival']
  settings: SiteSettings
}

/**
 * The Current homepage's arrival, in daylight.
 *
 * The pastors found the dusk hero too dark: two scrims (ink rising to 80% over the
 * lower half, a crimson wash over the sky) turn a golden-hour photograph into night.
 * Here the photograph is shown as it was taken, with nothing over it, and the words
 * move off it onto white paper underneath, in ink. Same headline, same times, same
 * two ways in.
 *
 * The photograph is the LCP element and paints at once; the church film plays over it.
 */
export function DaylightHero({ content, settings }: DaylightHeroProps) {
  const services = settings.serviceTimes.filter((service) => service.isPrimary)
  const photograph = {
    src: '/images/church-exterior-golden-hour.png',
    // The image is fixed here, so its description is too (not the CMS hero's alt).
    alt: 'The San Diego Clairemont Seventh-day Adventist church at sunset, its low tiled roof and stucco walls warm in the last light, with steps rising from the sidewalk between clipped hedges.',
  }

  return (
    <section aria-labelledby="daylight-headline" className="daylight-hero">
      <div className="daylight-photo">
        <Image
          alt={photograph.alt}
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src={photograph.src}
        />
        {/* The same film as Current, over its own first frame. Hidden for reduced motion (CSS). */}
        <video
          aria-hidden="true"
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          poster={photograph.src}
          preload="metadata"
        >
          <source src="/video/AnimateChurchVideo.mp4" type="video/mp4" />
        </video>
      </div>

      <Container className="daylight-band">
        <div className="daylight-words">
          <p className="font-sans text-eyebrow text-dawn uppercase">{settings.name}</p>
          <h1 className="daylight-headline" id="daylight-headline">
            {content.headline}
          </h1>
        </div>

        <div className="daylight-gather">
          <p className="font-sans text-eyebrow text-ink-muted uppercase">Saturdays</p>
          <dl className="mt-3 flex flex-wrap gap-x-10 gap-y-3">
            {services.map((service) => (
              <div key={service.label}>
                <dt className="font-sans text-body-sm text-ink-soft">{service.label}</dt>
                <dd className="tabular font-display text-heading-2 text-ink">
                  {service.startTime}
                </dd>
              </div>
            ))}
          </dl>
          <a
            className="mt-3 inline-block font-sans text-body-sm text-ink-soft underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-dawn"
            href={settings.address.mapUrl}
            rel="noreferrer noopener"
            target="_blank"
          >
            {settings.address.street}, {settings.address.city}
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button href="/visit">Plan Your Visit</Button>
            <Button href="/watch" icon="play" variant="secondary">
              Watch Online
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
