import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { formatDateParts, formatTime } from '@/lib/datetime'
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
        <Eyebrow index="05">What&rsquo;s coming</Eyebrow>
        <h2 className="mt-6 max-w-measure-lead font-serif text-display-2" id="events-title">
          Come and be part of it.
        </h2>

        <ul className="mt-12">
          {events.map((event) => {
            const { weekday, day, month } = formatDateParts(event.startDateTime)

            return (
              <li key={event.slug} className="border-t border-rule">
                <Link
                  className="group flex min-h-11 flex-col gap-4 py-8 sm:flex-row sm:items-baseline sm:gap-10"
                  href={`/events/${event.slug}`}
                >
                  <div className="flex shrink-0 items-baseline gap-3 sm:w-28 sm:flex-col sm:gap-0">
                    <span className="font-sans text-eyebrow text-ink-45 uppercase">{weekday}</span>
                    <span className="tabular font-serif text-heading-1 leading-none text-ink">
                      {day}
                    </span>
                    <span className="font-sans text-eyebrow text-ink-45 uppercase">{month}</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif text-heading-2 text-ink underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out group-hover:decoration-dawn">
                      {event.title}
                    </h3>
                    <p className="mt-2 max-w-measure font-sans text-body-sm text-ink-70">
                      {event.shortDescription}
                    </p>
                    <p className="mt-3 font-sans text-body-sm text-ink-45">
                      <time className="tabular" dateTime={event.startDateTime}>
                        {formatTime(event.startDateTime)}
                      </time>
                      {event.locationName ? (
                        <>
                          <span aria-hidden="true"> · </span>
                          {event.locationName}
                        </>
                      ) : null}
                    </p>
                  </div>

                  {event.ministryName ? (
                    <span className="font-sans text-eyebrow text-sage-deep uppercase sm:shrink-0">
                      {event.ministryName}
                    </span>
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="border-t border-rule pt-8">
          <Link
            className="font-sans text-body-sm text-ink underline decoration-dawn decoration-1 underline-offset-4 transition-all duration-[var(--dur-instant)] ease-out hover:decoration-2"
            href="/events"
          >
            See all events
          </Link>
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
        <h2 className="mt-6 max-w-measure-lead font-serif text-display-2">
          Every week, like this.
        </h2>
        <ul className="mt-12 max-w-measure">
          {settings.serviceTimes.map((service) => (
            <li key={service.label} className="border-t border-rule py-6">
              <p className="font-serif text-heading-2 text-ink">{service.label}</p>
              <p className="tabular mt-1 font-sans text-body-sm text-ink-70">
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
