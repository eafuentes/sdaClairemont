import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/container'
import { PageHeader } from '@/components/layout/page-header'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { PhotoGallery } from '@/components/media/photo-gallery'
import { Button } from '@/components/ui/button'
import { formatEventWhen } from '@/lib/datetime'
import { pageMetadata } from '@/lib/page-metadata'
import { getEventBySlug, getEventSlugs } from '@/sanity/lib/load'

interface EventPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getEventSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: EventPageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return pageMetadata('Event')
  return pageMetadata(event.title, event.shortDescription)
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()

  return (
    <>
      <PageHeader eyebrow="Events" title={event.title} intro={event.shortDescription} />
      <div className="bg-paper pb-section">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <p className="font-sans text-body text-ink">
                <time dateTime={event.startDateTime}>
                  {formatEventWhen(event.startDateTime, event.endDateTime, event.isAllDay)}
                </time>
              </p>
              {event.locationName ? (
                <p className="mt-3 font-sans text-body text-ink-soft">
                  {event.locationName}
                  {event.locationAddress ? ` · ${event.locationAddress}` : null}
                </p>
              ) : null}
              {event.ministryName && event.ministrySlug ? (
                <p className="mt-3 font-sans text-eyebrow text-dawn uppercase">
                  <Link
                    className="underline decoration-transparent hover:decoration-dawn"
                    href={`/ministries/${event.ministrySlug}`}
                  >
                    {event.ministryName}
                  </Link>
                </p>
              ) : event.ministryName ? (
                <p className="mt-3 font-sans text-eyebrow text-dawn uppercase">
                  {event.ministryName}
                </p>
              ) : null}

              {event.cost || event.ageRange ? (
                <p className="mt-6 font-sans text-body-sm text-ink-muted">
                  {event.cost ? <span>{event.cost}</span> : null}
                  {event.cost && event.ageRange ? <span aria-hidden="true"> · </span> : null}
                  {event.ageRange ? <span>{event.ageRange}</span> : null}
                </p>
              ) : null}

              {event.description?.map((paragraph, index) => (
                <p
                  className="mt-8 max-w-measure font-sans text-body text-ink-soft"
                  key={`${event.slug}-${index}`}
                >
                  {paragraph}
                </p>
              ))}

              <div className="mt-10 flex flex-wrap items-center gap-4">
                {event.registrationUrl ? (
                  <Button external href={event.registrationUrl}>
                    Register
                  </Button>
                ) : null}
                {event.locationMapUrl ? (
                  <Button external href={event.locationMapUrl} variant="secondary">
                    Open in Maps
                  </Button>
                ) : null}
                <Button href="/events" variant="tertiary">
                  All events
                </Button>
              </div>

              {event.contact ? (
                <p className="mt-10 font-sans text-body-sm text-ink-muted">
                  {event.contact.name}
                  {event.contact.role ? ` · ${event.contact.role}` : ''}
                  {event.contact.email ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      <a
                        className="underline decoration-dawn underline-offset-4"
                        href={`mailto:${event.contact.email}`}
                      >
                        {event.contact.email}
                      </a>
                    </>
                  ) : null}
                </p>
              ) : null}
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              {event.image ? (
                <PhotoGallery
                  items={[
                    {
                      id: event.slug,
                      image: event.image,
                      title: event.title,
                    },
                  ]}
                  label={event.title}
                  layout="masonry"
                />
              ) : (
                <MediaPlaceholder
                  className="aspect-[4/5] w-full"
                  description={`A photograph from ${event.title}, or the place it happens.`}
                />
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
