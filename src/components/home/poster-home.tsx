import Image from 'next/image'
import Link from 'next/link'

import { SermonFrame } from '@/components/home/sermon-frame'
import { BrushStroke } from '@/components/immersive/brush-stroke'
import { Container } from '@/components/layout/container'
import { visionLine } from '@/content/direction'
import type { HomePageBundle } from '@/sanity/lib/load'

const CONGREGATION = {
  src: '/images/life/congregation.webp',
  alt: 'The Clairemont congregation seated in the sanctuary.',
} as const

/**
 * The poster homepage: our vision set the way a sermon slide fills a screen.
 *
 * The pattern is the one the pastors pointed at on 2819. The black words are
 * really white, blended with `exclusion`: on the page they read as ink, and where a
 * word crosses the photograph the letters carry it in negative. The word stays
 * whole and the picture shows through it.
 *
 * Three things, nothing else: the vision (one photograph, one red word, one brush),
 * the latest message standing at its foot, and one line underneath with when we
 * gather and the two ways in.
 *
 * Harbor is this same composition in a second palette; only the colour tokens change.
 */
export function PosterHero({ page }: { page: HomePageBundle }) {
  const primary = page.settings.serviceTimes.filter((service) => service.isPrimary)
  const times = primary.length > 0 ? primary : page.settings.serviceTimes

  return (
    <section aria-labelledby="poster-vision" className="poster-hero">
      <Container className="poster-hero-inner">
        <div className="poster-stage">
          <h1 aria-label={visionLine} className="poster-title" id="poster-vision">
            <span aria-hidden="true" className="poster-line poster-to">
              To make
            </span>
            <span aria-hidden="true" className="poster-line poster-true">
              true
              <BrushStroke className="poster-brush" delay={0.35} />
            </span>
            <span aria-hidden="true" className="poster-line poster-disciples">
              disciples.
            </span>
          </h1>

          <figure className="poster-cut poster-cut-congregation">
            <Image
              alt={CONGREGATION.alt}
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 26rem, 50vw"
              src={CONGREGATION.src}
            />
          </figure>

          <SermonFrame className="poster-sermon" page={page} priority />

          <div className="poster-foot">
            <div className="poster-gather">
              <p className="poster-gather-label">Saturdays</p>
              <p className="poster-times">
                {times.map((service, index) => (
                  <span key={service.label}>
                    {index > 0 ? <span className="poster-slash">{' // '}</span> : null}
                    <span className="tabular">{service.startTime}</span>
                  </span>
                ))}
              </p>
              <p className="poster-gather-names">
                {times.map((service) => service.label).join(' · ')}
              </p>
            </div>

            <div className="poster-actions">
              <Link className="ink-button ink-button-primary" href="/visit">
                Plan your visit
              </Link>
              <Link className="ink-button" href="/watch">
                <span aria-hidden="true" className="text-dawn">
                  ▶
                </span>
                Watch the message
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
