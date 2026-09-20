import { EventRow } from '@/components/events/event-row'
import { Container } from '@/components/layout/container'
import { PhotoGallery } from '@/components/media/photo-gallery'
import { Reveal } from '@/components/motion/reveal'
import { RevealText } from '@/components/motion/reveal-text'
import { FlagshipLockup, ScrollHero } from '@/components/motion/scroll-hero'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { adventurerPhotos, pathfinderAdventures } from '@/content/galleries'
import { flagshipCopy, photosFor, type FlagshipCopy } from '@/content/flagship'
import type { ChurchEvent, GalleryEntry, MinistryDetail } from '@/types/content'

interface FlagshipMinistryProps {
  ministry: MinistryDetail
  kind: keyof typeof flagshipCopy
  events?: ChurchEvent[]
}

/**
 * Pathfinders and Adventurers: the two pages a parent would actually send.
 *
 * Same type, grid, and restraint as the rest of the site — warmer light, more
 * photography, one scroll-linked hero. The generic ministry template stays for
 * Sabbath School, CARE Group, and VBS.
 */
export function FlagshipMinistry({ ministry, kind, events = [] }: FlagshipMinistryProps) {
  const copy = flagshipCopy[kind]
  const hero = ministry.heroImage ?? photosFor(kind)
  const classes = ministry.classes && ministry.classes.length > 0 ? ministry.classes : copy.classes
  const meta = [ministry.ageRange, ministry.meetingSchedule].filter(Boolean).join(' · ')
  const fixturePhotos = kind === 'pathfinders' ? pathfinderAdventures : adventurerPhotos
  const sequence =
    ministry.timeline && ministry.timeline.length > 0 ? ministry.timeline : fixturePhotos

  return (
    <>
      <ScrollHero
        eyebrow="Ministries"
        image={hero}
        lede={copy.headline}
        meta={meta}
        title={ministry.name}
      >
        {ministry.registrationUrl ? (
          <Button external href={ministry.registrationUrl}>
            Register
          </Button>
        ) : (
          <Button href="/visit">Ask about joining</Button>
        )}
        <Button href="#safety" variant="secondary">
          How we keep kids safe
        </Button>
      </ScrollHero>

      <FlagshipLockup meta={meta} title={ministry.name} />

      <Mission copy={copy} />

      {sequence.length > 0 ? <Adventures items={sequence} kind={kind} /> : null}

      {classes.length > 0 ? <ClassProgression classes={classes} kind={kind} /> : null}

      {events.length > 0 ? <ClubCalendar events={events} /> : null}

      <Safety ministry={ministry} paragraphs={copy.safety} />

      <Close registrationUrl={ministry.registrationUrl} />
    </>
  )
}

function Mission({ copy }: { copy: FlagshipCopy }) {
  return (
    <section className="bg-paper-bloom py-section-lg">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-6 lg:col-start-2">
            <Eyebrow>What this is</Eyebrow>
            <div className="mt-8 space-y-6">
              {copy.mission.map((paragraph) => (
                <p
                  className="max-w-measure font-sans text-body text-ink-soft"
                  key={paragraph.slice(0, 48)}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal className="lg:col-span-4 lg:col-start-8" delay={0.1}>
            <figure>
              <blockquote className="font-serif text-quote text-ink italic">
                <RevealText stagger={0.06} text={copy.scripture.text} />
              </blockquote>
              <figcaption className="mt-6 font-sans text-eyebrow text-ink-muted uppercase">
                {copy.scripture.reference}
                <span aria-hidden="true"> · </span>
                {copy.scripture.translation}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

function Adventures({
  items,
  kind,
}: {
  items: GalleryEntry[]
  kind: 'pathfinders' | 'adventurers'
}) {
  return (
    <section className="bg-paper-warm py-section-lg">
      <Container>
        <Reveal>
          <Eyebrow>Where we have been</Eyebrow>
          <h2 className="mt-6 max-w-measure-lead font-display text-display-2 text-ink">
            {kind === 'pathfinders' ? 'The club actually goes places.' : 'Sundays, together.'}
          </h2>
        </Reveal>
      </Container>

      <div className="mt-16">
        <PhotoGallery
          items={items}
          label={kind === 'pathfinders' ? 'Pathfinder trips' : 'Adventurer photographs'}
          layout="horizontal"
        />
      </div>
      <Container>
        <p className="mt-10">
          <Button href="/gallery" variant="tertiary">
            All photographs
          </Button>
        </p>
      </Container>
    </section>
  )
}

function ClubCalendar({ events }: { events: ChurchEvent[] }) {
  return (
    <section className="bg-paper-bloom py-section-lg">
      <Container>
        <Reveal>
          <Eyebrow>Coming up</Eyebrow>
          <h2 className="mt-6 max-w-measure-lead font-display text-heading-1 text-ink">
            The next time the club gathers.
          </h2>
        </Reveal>
        <ul className="mt-12">
          {events.map((event) => (
            <li className="border-t border-rule" key={event.slug}>
              <EventRow event={event} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function ClassProgression({
  classes,
  kind,
}: {
  classes: NonNullable<MinistryDetail['classes']>
  kind: 'pathfinders' | 'adventurers'
}) {
  return (
    <section className="bg-paper-bloom py-section-lg">
      <Container>
        <Reveal>
          <Eyebrow>{kind === 'pathfinders' ? 'The eight classes' : 'The classes'}</Eyebrow>
          <h2 className="mt-6 max-w-measure-lead font-display text-heading-1 text-ink">
            A progression, not eight identical cards.
          </h2>
        </Reveal>

        <ol className="mt-16 divide-y divide-rule border-y border-rule">
          {classes.map((entry, index) => (
            <Reveal as="li" delay={Math.min(index, 3) * 0.05} key={entry.name}>
              <div className="grid grid-cols-1 gap-4 py-7 lg:grid-cols-12 lg:items-baseline">
                <p className="font-sans text-eyebrow text-ink-muted uppercase lg:col-span-2">
                  <span className="tabular">{String(index + 1).padStart(2, '0')}</span>
                </p>
                <p className="font-display text-heading-2 text-ink lg:col-span-4">{entry.name}</p>
                <p className="font-sans text-eyebrow text-ink-muted uppercase lg:col-span-2">
                  {entry.ageRange}
                </p>
                {entry.description ? (
                  <p className="max-w-measure font-sans text-body-sm text-ink-soft lg:col-span-4">
                    {entry.description}
                  </p>
                ) : null}
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  )
}

function Safety({ ministry, paragraphs }: { ministry: MinistryDetail; paragraphs: string[] }) {
  return (
    <section className="bg-paper-deep py-section-lg" id="safety">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6 lg:col-start-2">
            <Eyebrow>Leadership and safety</Eyebrow>
            <h2 className="mt-6 font-display text-heading-1 text-ink">Who is in the room.</h2>
            <div className="mt-8 space-y-5">
              {paragraphs.map((paragraph) => (
                <p
                  className="max-w-measure font-sans text-body text-ink-soft"
                  key={paragraph.slice(0, 40)}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          {ministry.leaders && ministry.leaders.length > 0 ? (
            <Reveal className="lg:col-span-4 lg:col-start-8" delay={0.08}>
              <ul className="divide-y divide-rule border-y border-rule">
                {ministry.leaders.map((leader) => (
                  <li className="py-5" key={leader.slug}>
                    <p className="font-display text-heading-3 text-ink">{leader.name}</p>
                    <p className="mt-1 font-sans text-body-sm text-ink-soft">{leader.role}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  )
}

function Close({ registrationUrl }: { registrationUrl?: string }) {
  return (
    <section className="bg-paper-bloom py-section-lg">
      <Container>
        <Reveal>
          <h2 className="max-w-measure-lead font-display text-display-2 text-ink">
            If this is your kid, come on a Sunday.
          </h2>
          <div className="mt-10 flex flex-wrap gap-4">
            {registrationUrl ? (
              <Button external href={registrationUrl}>
                Register
              </Button>
            ) : (
              <Button href="/visit">Plan a visit</Button>
            )}
            <Button href="/ministries" variant="tertiary">
              All ministries
            </Button>
            <Button href="/gallery" variant="tertiary">
              Photographs
            </Button>
            <Button href="/events" variant="tertiary">
              Upcoming events
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
