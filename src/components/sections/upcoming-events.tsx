import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/motion/reveal'
import { EventRow } from '@/components/events/event-row'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import type { ChurchEvent, SiteSettings } from '@/types/content'

interface UpcomingEventsProps {
  events: ChurchEvent[]
  settings: SiteSettings
}

/**
 * Chapter 05 — What's Coming. Rows, not cards.
 *
 * A date-led list scans faster, stacks perfectly on mobile, and avoids the endless-cards
 * failure mode by construction.
 *
 * With no upcoming events the chapter renders the weekly rhythm instead. Telling a
 * first-time visitor that nothing is happening is actively harmful, and it is also
 * untrue — this church meets every week.
 */
export function UpcomingEvents({ events, settings }: UpcomingEventsProps) {
  if (events.length === 0) {
    return <WeeklyRhythmFallback settings={settings} />
  }

  return (
    <section aria-labelledby="events-title" className="bg-paper-deep py-section-lg" id="events">
      <Container>
        <Reveal>
          <Eyebrow index="05">What&rsquo;s coming</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-measure-lead font-display text-display-2" id="events-title">
            Come and be part of it.
          </h2>
        </Reveal>

        <ul className="mt-12">
          {events.map((event, index) => (
            /*
             * The stagger is capped at four steps. Beyond that the last row in a long
             * list waits noticeably for its turn, and a delay the reader can feel while
             * looking straight at an empty row is worse than no stagger at all.
             */
            <Reveal
              key={event.slug}
              as="li"
              className="border-t border-rule"
              delay={Math.min(index, 3) * 0.08}
            >
              <EventRow event={event} />
            </Reveal>
          ))}
        </ul>

        <div className="border-t border-rule pt-6">
          <Button href="/events" variant="tertiary">
            See all events
          </Button>
        </div>
      </Container>
    </section>
  )
}

function WeeklyRhythmFallback({ settings }: { settings: SiteSettings }) {
  return (
    <section className="bg-paper-deep py-section-lg" id="events">
      <Container>
        <Eyebrow index="05">What&rsquo;s coming</Eyebrow>
        <h2 className="mt-6 max-w-measure-lead font-display text-display-2">
          Every week, like this.
        </h2>
        <ul className="mt-12 max-w-measure">
          {settings.serviceTimes.map((service) => (
            <li key={service.label} className="border-t border-rule py-6">
              <p className="font-display text-heading-2 text-ink">{service.label}</p>
              <p className="tabular mt-1 font-sans text-body-sm text-ink-soft">
                {service.day} {service.startTime}
                {service.endTime ? `–${service.endTime}` : ''}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
