import { Container } from '@/components/layout/container'
import { PageHeader } from '@/components/layout/page-header'
import { EventRow } from '@/components/events/event-row'
import { pageMetadata } from '@/lib/page-metadata'
import { getPastEvents, getSiteSettings, getUpcomingEvents } from '@/sanity/lib/load'

export const metadata = pageMetadata(
  'Events',
  'What is coming at San Diego Clairemont Seventh-day Adventist Church, and what has already happened.',
)

export default async function EventsPage() {
  const [upcoming, past, settings] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
    getSiteSettings(),
  ])

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Come and be part of it."
        intro="Fellowship lunches, Pathfinder nights, food distributions, and the weekly rhythm of Sabbath."
      />
      <div className="bg-paper-bloom pb-section">
        <Container>
          {upcoming.length > 0 ? (
            <ul>
              {upcoming.map((event) => (
                <li className="border-t border-rule" key={event.slug}>
                  <EventRow event={event} headingLevel="h2" />
                </li>
              ))}
            </ul>
          ) : (
            <section>
              <h2 className="font-display text-heading-1 text-ink">Every week, like this.</h2>
              <ul className="mt-8 max-w-measure">
                {settings.serviceTimes.map((service) => (
                  <li className="border-t border-rule py-6" key={service.label}>
                    <p className="font-display text-heading-2 text-ink">{service.label}</p>
                    <p className="tabular mt-1 font-sans text-body-sm text-ink-soft">
                      {service.day} {service.startTime}
                      {service.endTime ? `–${service.endTime}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {past.length > 0 ? (
            <section className="mt-20">
              <h2 className="font-display text-heading-1 text-ink">Recently</h2>
              <ul className="mt-8">
                {past.map((event) => (
                  <li className="border-t border-rule" key={event.slug}>
                    <EventRow event={event} headingLevel="h2" />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </Container>
      </div>
    </>
  )
}
