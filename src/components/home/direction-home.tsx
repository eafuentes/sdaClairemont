import Image from 'next/image'
import Link from 'next/link'

import { BrushStroke } from '@/components/immersive/brush-stroke'
import { Marquee } from '@/components/immersive/marquee'
import { StackCard } from '@/components/immersive/stack-card'
import { Container } from '@/components/layout/container'
import { PosterHero } from '@/components/home/poster-home'
import { SermonFrame } from '@/components/home/sermon-frame'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Icon } from '@/components/ui/icon'
import { Rule } from '@/components/ui/rule'
import {
  commissionLine,
  commissionReference,
  coreValues,
  missionAccent,
  missionLine,
  valuesBanner,
  valuesClose,
  visionGloss,
  visionLine,
} from '@/content/direction'
import { sabbathSpeakerPortrait } from '@/content/home-page'
import { formatPlainDate } from '@/lib/datetime'
import { cn } from '@/lib/utils'
import type { HomePageBundle } from '@/sanity/lib/load'

const CHURCH_PHOTO = '/images/church-exterior-golden-hour.png'
const CONGREGATION_PHOTO = {
  src: '/images/life/congregation.webp',
  alt: 'The Clairemont congregation seated in the pews during the service, photographed from behind.',
} as const
const SANCTUARY_PHOTO = {
  src: '/images/life/sanctuary-service.webp',
  alt: 'Pastor London L. Lee preaching from the platform in the Clairemont sanctuary, the congregation in the pews in the foreground.',
} as const

/**
 * The leadership homepage, in one of three designs.
 *
 * Paper is the quiet editorial page: hairlines, the dawn tick, lots of white.
 * Ink is the same chapters with the sermon-slide voice: a brush underline, hard
 * borders, and the paper swipe. Poster sets the same words as one full-screen
 * composition, with the latest message playing inside the type.
 *
 * On a phone the chapters are the card stack. At desktop width the stack lets go
 * and the page reads as one document. The poster itself stays a poster.
 */
export function DirectionHome({
  page,
  tone,
}: {
  page: HomePageBundle
  tone: 'paper' | 'ink' | 'poster'
}) {
  const ink = tone === 'ink'
  const poster = tone === 'poster'
  /* Ink & Brush and Poster (and Harbor) use the hard-shadow ink buttons all the way down. */
  const inkButtons = ink || poster
  const id = (name: string) => `${tone}-${name}`
  const primary = page.settings.serviceTimes.filter((service) => service.isPrimary)
  const times = primary.length > 0 ? primary : page.settings.serviceTimes
  const message = latestMessage(page)
  const [missionBefore = '', missionAfter = ''] = missionLine.split(missionAccent)

  return (
    <div className={poster ? 'home-poster' : ink ? 'home-ink' : 'home-paper'}>
      {poster ? <PosterHero page={page} /> : null}
      {ink ? (
        <StackCard className="home-chapter home-chapter-vision" labelledBy={id('vision')}>
          <Container className="home-chapter-inner home-ink-vision">
            <div className="home-ink-words">
              <Eyebrow>Our vision</Eyebrow>
              <h1 aria-label={visionLine} className="home-ink-title" id={id('vision')}>
                <span aria-hidden="true">To make true</span>
                <span aria-hidden="true" className="home-ink-title-accent">
                  disciples.
                  <BrushStroke className="home-ink-brush" delay={0.2} />
                </span>
              </h1>
            </div>

            <div className="home-ink-gather">
              <p className="font-sans text-eyebrow text-ink-muted uppercase">Saturdays</p>
              <p className="home-ink-times">
                {times.map((service, index) => (
                  <span key={service.label}>
                    {index > 0 ? <span className="text-dawn">{' // '}</span> : null}
                    <span className="tabular">{service.startTime}</span>
                  </span>
                ))}
              </p>
              <p className="mt-1 font-sans text-body-sm text-ink-soft">
                {times.map((service) => service.label).join(' · ')}
              </p>
            </div>

            <div className="home-ink-actions">
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

            <SermonFrame className="home-ink-sermon" page={page} priority />

            <p className="home-ink-gloss">{visionGloss}</p>
          </Container>
          <Marquee
            className="home-ink-band border-y-2 border-ink bg-paper text-ink"
            items={['Biblical truth', 'Authentic community', 'Generational discipleship']}
          />
        </StackCard>
      ) : null}
      {poster || ink ? null : (
        <StackCard className="home-chapter home-chapter-vision" labelledBy={id('vision')}>
          <Container className="home-chapter-inner home-paper-vision">
            <div className="home-paper-words">
              <Eyebrow>Our vision</Eyebrow>
              <h1
                aria-label={visionLine}
                className="mt-4 font-display text-[clamp(2.6rem,9vw,6.5rem)] leading-[0.88] text-ink lg:text-[clamp(4.5rem,6.6vw,7.25rem)]"
                id={id('vision')}
              >
                To make true
                <br />
                <span className="text-dawn">disciples.</span>
              </h1>
              <Rule className="mt-6 max-w-sm" mark />
              <p className="mt-6 max-w-measure font-serif text-body-lg text-ink">{visionGloss}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href="/visit">Plan Your Visit</Button>
                <Button href="/watch" icon="play" variant="secondary">
                  Watch the Message
                </Button>
              </div>
            </div>

            <div className="home-paper-times">
              <p className="font-sans text-eyebrow text-ink-muted uppercase">Saturdays</p>
              <dl className="flex flex-wrap gap-x-10 gap-y-4">
                {times.map((service) => (
                  <div key={service.label}>
                    <dt className="font-sans text-body-sm text-ink-soft">{service.label}</dt>
                    <dd className="tabular font-display text-heading-2 text-ink">
                      {service.startTime}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <figure className="home-paper-plate">
              <div className="home-paper-photo">
                <Image
                  alt={CONGREGATION_PHOTO.alt}
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1024px) 30rem, 100vw"
                  src={CONGREGATION_PHOTO.src}
                />
              </div>
              <figcaption className="home-paper-caption">
                <span className="text-dawn">Sabbath morning</span> · the Clairemont sanctuary
              </figcaption>
              {page.content.watch.featured?.thumbnail ? (
                <Link className="home-paper-message" href="/watch">
                  <span className="home-paper-message-thumb">
                    <Image
                      alt=""
                      className="object-cover"
                      fill
                      sizes="6rem"
                      src={page.content.watch.featured.thumbnail.src}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-sans text-eyebrow text-ink-muted uppercase">
                      Latest message
                    </span>
                    <span className="mt-1 block font-display text-heading-3 leading-tight text-ink">
                      {message.title}
                    </span>
                  </span>
                  <Icon className="ml-auto shrink-0 text-dawn" name="arrow-right" />
                </Link>
              ) : null}
            </figure>
          </Container>
        </StackCard>
      )}

      {poster ? null : (
        <StackCard className="home-chapter home-chapter-message" labelledBy={id('message')}>
          <Container className="home-chapter-inner home-message">
            {message.portrait ? (
              <div className="home-message-photo">
                <Image
                  alt={message.portrait.alt}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 24rem, 100vw"
                  src={message.portrait.src}
                />
              </div>
            ) : null}
            <div className="home-message-words">
              <Eyebrow index="02">Latest message</Eyebrow>
              <h2
                className="mt-5 max-w-[16ch] font-display text-display-2 text-ink"
                id={id('message')}
              >
                {message.title}
              </h2>
              {ink ? <BrushStroke className="mt-2 max-w-[12rem]" /> : null}
              <p className="mt-4 font-sans text-body text-ink-soft">
                {message.speaker}
                {message.date ? ` · ${formatPlainDate(message.date)}` : ''}
              </p>
              {message.scripture ? (
                <p className="mt-6 font-serif text-body-lg text-ink italic">{message.scripture}</p>
              ) : null}
              <Button className="mt-8" href="/watch" variant="tertiary">
                Watch the message
              </Button>
            </div>
          </Container>
        </StackCard>
      )}

      <StackCard className="home-chapter home-chapter-values" labelledBy={id('values')}>
        <Container className="home-chapter-inner">
          <Eyebrow index="03">Who we are</Eyebrow>
          <h2 className="mt-5 max-w-[14ch] font-display text-display-2 text-ink" id={id('values')}>
            Our three core values
          </h2>
          <ul className="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-10">
            {coreValues.map((value, index) => (
              <li key={value.name} className={cn('home-value', ink && 'home-value-ink')}>
                <div className="home-value-photo">
                  <Image
                    alt={value.photo.alt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 26rem, 6rem"
                    src={value.photo.src}
                    style={{ objectPosition: value.photo.position }}
                  />
                </div>
                <div className="home-value-words">
                  <p className="font-sans text-eyebrow text-dawn uppercase">0{index + 1}</p>
                  <h3 className="mt-3 font-display text-heading-2 text-ink">{value.name}</h3>
                  <p className="mt-3 font-sans text-body text-ink-soft">{value.line}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-10 font-sans text-body-sm text-ink-muted uppercase">{valuesBanner}</p>
          <p
            className={cn(
              'mt-4',
              ink
                ? 'font-brush text-[1.75rem] text-dawn'
                : 'font-serif text-heading-3 text-ink italic',
            )}
          >
            {valuesClose}
          </p>
        </Container>
      </StackCard>

      <StackCard className="home-chapter home-chapter-mission" labelledBy={id('mission')}>
        <Container className="home-chapter-inner home-mission">
          <div className="home-mission-photo">
            <Image
              alt={SANCTUARY_PHOTO.alt}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 34rem, 100vw"
              src={SANCTUARY_PHOTO.src}
            />
          </div>
          <div className="home-mission-words">
            <Eyebrow index="04">Why we exist</Eyebrow>
            <h2
              className="mt-5 max-w-measure-lead font-display text-heading-1 text-ink"
              id={id('mission')}
            >
              {missionBefore}
              <span className="text-dawn">{missionAccent}</span>
              {missionAfter}
            </h2>
            {ink ? (
              <BrushStroke className="mt-3 max-w-xs" />
            ) : (
              <Rule className="mt-8 max-w-sm" mark />
            )}
            <blockquote className="mt-8 max-w-measure">
              <p className="font-serif text-body-lg text-ink italic">{commissionLine}</p>
              <footer className="mt-3 font-sans text-eyebrow text-ink-muted uppercase">
                {commissionReference}
              </footer>
            </blockquote>
            <Link
              className="mt-8 inline-flex min-h-11 items-center gap-2 font-sans text-body-sm text-ink underline decoration-dawn underline-offset-4"
              href="/about"
            >
              More about us
              <Icon name="arrow-right" />
            </Link>
          </div>
        </Container>
      </StackCard>

      <StackCard className="home-chapter home-chapter-doors" labelledBy={id('doors')} last>
        <Container className="home-chapter-inner">
          <Eyebrow index="05">Come and see</Eyebrow>
          <h2 className="sr-only" id={id('doors')}>
            In person or online
          </h2>
          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="font-display text-heading-1 text-ink">In person</h3>
              <p className="mt-4 font-sans text-body text-ink">
                {page.settings.address.street}, {page.settings.address.city}
              </p>
              <ul className="mt-4 space-y-1 font-sans text-body text-ink-soft">
                {times.map((service) => (
                  <li key={service.label}>
                    {service.label} · <span className="tabular text-ink">{service.startTime}</span>
                  </li>
                ))}
              </ul>
              <div className="home-doors-photo relative mt-6 aspect-[16/9] overflow-hidden">
                <Image
                  alt="The Clairemont church at sunset, its low tiled roof warm in the last light."
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 36rem, 100vw"
                  src={CHURCH_PHOTO}
                />
              </div>
              {inkButtons ? (
                <Link className="ink-button ink-button-primary mt-6" href="/visit">
                  Plan your visit
                </Link>
              ) : (
                <Button className="mt-6" href="/visit">
                  Plan Your Visit
                </Button>
              )}
            </div>
            <div>
              <h3 className="font-display text-heading-1 text-ink">Online</h3>
              <p className="mt-4 max-w-measure font-sans text-body text-ink-soft">
                If you cannot be here, be here anyway. The latest message is {message.title}.
              </p>
              {inkButtons ? (
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link className="ink-button" href="/watch">
                    <span aria-hidden="true" className="text-dawn">
                      ▶
                    </span>
                    Watch the message
                  </Link>
                  {page.settings.youtubeUrl ? (
                    <a
                      className="ink-button"
                      href={page.settings.youtubeUrl}
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      YouTube <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : null}
                </div>
              ) : (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="/watch" icon="play">
                    Watch the Message
                  </Button>
                  {page.settings.youtubeUrl ? (
                    <Button external href={page.settings.youtubeUrl} variant="secondary">
                      YouTube
                    </Button>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </Container>
      </StackCard>
    </div>
  )
}

function latestMessage(page: HomePageBundle) {
  const featured = page.content.watch.featured
  const program = page.sabbathProgram
  if (featured) {
    return {
      // The portrait is Pastor Lee; it appears only beside his messages.
      portrait: /london/i.test(featured.speakerName) ? sabbathSpeakerPortrait : undefined,
      title: featured.title,
      speaker: featured.speakerName,
      date: featured.date,
      scripture: featured.scripture[0]?.reference,
    }
  }
  return {
    portrait: undefined,
    title: program?.sermonTitle ?? 'This Sabbath',
    speaker: program?.speakerName,
    date: program?.date,
    scripture: program?.scripture[0]?.reference,
  }
}
