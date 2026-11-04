import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'

import { BrushStroke } from '@/components/immersive/brush-stroke'
import { Marquee } from '@/components/immersive/marquee'
import { StackCard } from '@/components/immersive/stack-card'
import { type Sticker, Stickers } from '@/components/immersive/stickers'
import { SwipeDeck } from '@/components/immersive/swipe-deck'
import { Icon } from '@/components/ui/icon'
import { homePathways } from '@/content/pathways'
import { formatPlainDate } from '@/lib/datetime'
import type { HomePageBundle } from '@/sanity/lib/load'

const HERO_PHOTO = '/images/church-exterior-golden-hour.png'

const STICKERS: Sticker[] = [
  { label: 'All welcome', tone: 'red', x: 4, y: 8, tilt: -6 },
  { label: 'Hope', tone: 'lime', x: 58, y: 4, tilt: 5 },
  { label: 'Lunch after', tone: 'ink', x: 30, y: 40, tilt: -3 },
  { label: 'Family', tone: 'lime', x: 6, y: 66, tilt: 4 },
  { label: 'Prayer', tone: 'red', x: 62, y: 62, tilt: -8 },
]

/** Splits a headline so its last word can carry the accent, the way the pastor's slides do. */
function accentLast(text: string) {
  const words = text.trim().split(/\s+/)
  const last = words.pop() ?? ''
  return { lead: words.join(' '), last }
}

/**
 * The mobile homepage: the same chapters as desktop, told as a stack of cards.
 *
 * Arrival, this Sabbath, where to start, belonging, then the facts for the car. Each
 * card is short enough to read in one screen, and each one hands off to the page that
 * holds the detail. Desktop renders `HomeDocument` instead; this never ships above `lg`.
 */
export function MobileHome({ page }: { page: HomePageBundle }) {
  const { content, settings, visible } = page
  const program = page.sabbathProgram
  const primary = settings.serviceTimes.filter((service) => service.isPrimary)
  const arrival = accentLast(content.arrival.headline)
  const invitation = accentLast(content.invitation.headline)
  const heroAlt =
    content.arrival.hero.image?.alt ??
    'The Clairemont Seventh-day Adventist church at sunset, warm in the last light.'

  const ticker = [
    ...primary.map((service) => `${service.label} ${service.startTime}`),
    `${settings.address.street}`,
    'All are welcome',
  ]

  return (
    <div className="mobile-home lg:hidden">
      <StackCard className="stack-card-arrival" labelledBy="m-arrival-title">
        <Image
          alt={heroAlt}
          className="arrival-photo"
          fill
          priority
          sizes="100vw"
          src={HERO_PHOTO}
        />
        <div aria-hidden="true" className="arrival-scrim" />
        <Marquee className="arrival-marquee" items={ticker} />

        <div className="card-pad relative flex min-h-[calc(100dvh-7.5rem)] flex-col justify-end">
          <p aria-hidden="true" className="brush-tag">
            Welcome home
          </p>
          <h1 className="kinetic-headline" id="m-arrival-title">
            {arrival.lead.split(' ').map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                <span className="kinetic-word" style={{ '--i': index } as React.CSSProperties}>
                  <span>{word}</span>
                </span>{' '}
              </Fragment>
            ))}
            <span
              className="kinetic-word"
              style={{ '--i': arrival.lead.split(' ').length } as React.CSSProperties}
            >
              <span className="immersive-accent-word">{arrival.last}</span>
            </span>
          </h1>
          <BrushStroke className="mt-1 w-3/4" delay={0.9} />

          <dl className="rise mt-6 flex gap-8" style={{ '--i': 6 } as React.CSSProperties}>
            {primary.map((service) => (
              <div key={service.label}>
                <dt className="font-sans text-body-sm opacity-80">{service.label}</dt>
                <dd className="tabular font-display text-heading-2">{service.startTime}</dd>
              </div>
            ))}
          </dl>

          <div
            className="rise mt-6 flex flex-wrap gap-3"
            style={{ '--i': 7 } as React.CSSProperties}
          >
            <Link className="immersive-button immersive-button-primary press" href="/visit">
              Plan your visit
              <Icon name="arrow-right" />
            </Link>
            <Link className="immersive-button immersive-button-quiet press" href="/watch">
              <Icon name="play" />
              Watch
            </Link>
          </div>

          <p aria-hidden="true" className="swipe-cue">
            <span />
            Scroll
          </p>
        </div>
      </StackCard>

      {visible.thisSabbath ? (
        <StackCard className="stack-card-sabbath" labelledBy="m-sabbath-title">
          <div className="card-pad">
            <p className="immersive-kicker">
              <span className="immersive-index">02</span>
              This Sabbath
              {program ? (
                <>
                  {' · '}
                  <time dateTime={program.date}>{formatPlainDate(program.date)}</time>
                </>
              ) : null}
            </p>
            <h2 className="mt-5 font-display text-display-2" id="m-sabbath-title">
              {program?.sermonTitle ?? 'We gather every Saturday.'}
            </h2>
            {program ? (
              <p className="mt-3 font-sans text-body-sm opacity-80">
                {program.speakerName}
                {program.speakerRole ? ` · ${program.speakerRole}` : ''}
              </p>
            ) : null}
            <BrushStroke className="mt-3 w-1/2" />

            <dl className="mt-8 grid grid-cols-2 gap-3">
              {(program
                ? [
                    { label: 'Sabbath School', time: program.sabbathSchoolTime },
                    { label: 'Divine Worship', time: program.worshipTime },
                  ]
                : primary.map((service) => ({ label: service.label, time: service.startTime }))
              ).map((slot) => (
                <div key={slot.label} className="time-tile">
                  <dt className="font-sans text-eyebrow uppercase">{slot.label}</dt>
                  <dd className="tabular mt-2 font-display text-heading-1">{slot.time}</dd>
                </div>
              ))}
            </dl>

            {program?.sermonSummary ? (
              <blockquote className="mt-8 line-clamp-5 font-serif text-body-lg italic">
                {program.sermonSummary}
              </blockquote>
            ) : null}

            <Link className="immersive-button press mt-8" href="/this-sabbath">
              The full program
              <Icon name="arrow-right" />
            </Link>
          </div>
        </StackCard>
      ) : null}

      <StackCard className="stack-card-start" labelledBy="m-start-title">
        <div className="card-pad">
          <p className="immersive-kicker">
            <span className="immersive-index">03</span>
            Start here
          </p>
          <h2 className="mt-5 font-display text-display-2" id="m-start-title">
            Where do you <span className="immersive-accent-word">begin?</span>
          </h2>
          <div className="mt-8">
            <SwipeDeck tiles={homePathways} />
          </div>
        </div>
      </StackCard>

      {visible.belong ? (
        <StackCard className="stack-card-belong" labelledBy="m-belong-title">
          <div className="card-pad">
            <p className="immersive-kicker">
              <span className="immersive-index">04</span>
              Belong
            </p>
            <h2 className="mt-5 font-display text-display-2" id="m-belong-title">
              {content.belong.headline}
            </h2>
            <p className="mt-4 font-sans text-body">{content.belong.body}</p>

            <Stickers className="mt-6" stickers={STICKERS} />

            <figure className="mt-6 border-t border-[var(--im-rule)] pt-5">
              <blockquote className="font-serif text-body-lg italic">
                {content.belong.testimonial.quote}
              </blockquote>
              <figcaption className="mt-3 font-sans text-body-sm opacity-80">
                {content.belong.testimonial.personName} · {content.belong.testimonial.personContext}
              </figcaption>
            </figure>
          </div>
        </StackCard>
      ) : null}

      {visible.invitation ? (
        <StackCard className="stack-card-invite" labelledBy="m-invite-title" last>
          <div className="card-pad">
            <p className="immersive-kicker">
              <span className="immersive-index">05</span>
              Come and see
            </p>
            <h2 className="mt-5 font-display text-display-2" id="m-invite-title">
              {invitation.lead} <span className="immersive-accent-word">{invitation.last}</span>
            </h2>
            <BrushStroke className="mt-2 w-2/3" />

            <dl className="mt-8 space-y-5">
              <div>
                <dt className="immersive-kicker">
                  <Icon name="clock" />
                  Saturdays
                </dt>
                <dd className="mt-2 space-y-1">
                  {primary.map((service) => (
                    <p key={service.label} className="font-sans text-body">
                      {service.label} · <span className="tabular">{service.startTime}</span>
                    </p>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="immersive-kicker">
                  <Icon name="map-pin" />
                  Where
                </dt>
                <dd className="mt-2 font-sans text-body">
                  {settings.address.street}, {settings.address.city}, {settings.address.state}{' '}
                  {settings.address.postalCode}
                  <span className="mt-1 block text-body-sm opacity-80">
                    {content.invitation.parking}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <a
                className="immersive-button press"
                href={settings.address.mapUrl}
                rel="noreferrer noopener"
                target="_blank"
              >
                <Icon name="map-pin" />
                Directions
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a className="immersive-button press" href={`tel:${settings.phone}`}>
                <Icon name="phone" />
                Call
              </a>
              <Link
                className="immersive-button immersive-button-primary press col-span-2"
                href="/visit"
              >
                Plan your visit
                <Icon name="arrow-right" />
              </Link>
            </div>
          </div>
        </StackCard>
      ) : null}
    </div>
  )
}
