import Link from 'next/link'

import { formatDateParts, formatTime } from '@/lib/datetime'
import type { ChurchEvent } from '@/types/content'

interface EventRowProps {
  event: ChurchEvent
  /** The homepage chapter already has an H2, so rows there are H3. The index page is the opposite. */
  headingLevel?: 'h2' | 'h3'
}

/**
 * One event as a date-led row. Shared by the homepage chapter and the events index
 * so the two surfaces cannot drift.
 */
export function EventRow({ event, headingLevel = 'h3' }: EventRowProps) {
  const { weekday, day, month } = formatDateParts(event.startDateTime)
  const Title = headingLevel

  return (
    <Link
      className="group flex min-h-11 flex-col gap-4 py-8 sm:flex-row sm:items-baseline sm:gap-10"
      href={`/events/${event.slug}`}
    >
      <div className="flex shrink-0 items-baseline gap-3 sm:w-28 sm:flex-col sm:gap-0">
        <span className="font-sans text-eyebrow text-ink-muted uppercase">{weekday}</span>
        <span className="tabular font-serif text-heading-1 leading-none text-ink">{day}</span>
        <span className="font-sans text-eyebrow text-ink-muted uppercase">{month}</span>
      </div>

      <div className="flex-1">
        <Title className="font-serif text-heading-2 text-ink underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out group-hover:decoration-dawn">
          {event.title}
        </Title>
        <p className="mt-2 max-w-measure font-sans text-body-sm text-ink-soft">
          {event.shortDescription}
        </p>
        <p className="mt-3 font-sans text-body-sm text-ink-muted">
          {event.isAllDay ? (
            <span>All day</span>
          ) : (
            <time className="tabular" dateTime={event.startDateTime}>
              {formatTime(event.startDateTime)}
            </time>
          )}
          {event.locationName ? (
            <>
              <span aria-hidden="true"> · </span>
              {event.locationName}
            </>
          ) : null}
        </p>
      </div>

      {event.ministryName ? (
        <span className="font-sans text-eyebrow text-dawn uppercase sm:shrink-0">
          {event.ministryName}
        </span>
      ) : null}
    </Link>
  )
}
