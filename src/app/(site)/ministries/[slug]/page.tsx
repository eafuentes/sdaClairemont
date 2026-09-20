import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/container'
import { PageHeader } from '@/components/layout/page-header'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { FlagshipMinistry } from '@/components/ministries/flagship-ministry'
import { Button } from '@/components/ui/button'
import { pageMetadata } from '@/lib/page-metadata'
import { getMinistryBySlug, getMinistrySlugs, getUpcomingEvents } from '@/sanity/lib/load'

interface MinistryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getMinistrySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: MinistryPageProps) {
  const { slug } = await params
  const ministry = await getMinistryBySlug(slug)
  if (!ministry) return pageMetadata('Ministry')
  return pageMetadata(ministry.name, ministry.shortDescription)
}

export default async function MinistryPage({ params }: MinistryPageProps) {
  const { slug } = await params
  const ministry = await getMinistryBySlug(slug)
  if (!ministry) notFound()

  if (slug === 'pathfinders' || slug === 'adventurers') {
    const upcoming = await getUpcomingEvents()
    const clubEvents = upcoming.filter((event) => event.ministrySlug === slug)
    return <FlagshipMinistry events={clubEvents} kind={slug} ministry={ministry} />
  }

  return (
    <>
      <PageHeader eyebrow="Ministries" title={ministry.name} intro={ministry.shortDescription} />
      <div className="bg-paper-bloom pb-section">
        <Container>
          <p className="font-sans text-eyebrow text-ink-muted uppercase">
            {ministry.ageRange}
            {ministry.meetingSchedule ? (
              <>
                <span aria-hidden="true"> · </span>
                {ministry.meetingSchedule}
              </>
            ) : null}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              {ministry.description?.map((paragraph, index) => (
                <p
                  className="mt-6 max-w-measure font-sans text-body text-ink-soft first:mt-0"
                  key={`${ministry.slug}-${index}`}
                >
                  {paragraph}
                </p>
              ))}

              {ministry.registrationUrl ? (
                <p className="mt-10">
                  <Button external href={ministry.registrationUrl}>
                    Register
                  </Button>
                </p>
              ) : null}

              {ministry.leaders && ministry.leaders.length > 0 ? (
                <section className="mt-14">
                  <h2 className="font-display text-heading-2 text-ink">Who leads this</h2>
                  <ul className="mt-6 divide-y divide-rule border-y border-rule">
                    {ministry.leaders.map((leader) => (
                      <li className="py-5" key={leader.slug}>
                        <p className="font-display text-heading-3 text-ink">{leader.name}</p>
                        <p className="mt-1 font-sans text-body-sm text-ink-soft">{leader.role}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {ministry.resources && ministry.resources.length > 0 ? (
                <section className="mt-14">
                  <h2 className="font-display text-heading-2 text-ink">Resources</h2>
                  <ul className="mt-6 space-y-3">
                    {ministry.resources.map((resource) => (
                      <li key={resource.href}>
                        <Button
                          external={/^https?:\/\//.test(resource.href)}
                          href={resource.href}
                          variant="tertiary"
                        >
                          {resource.title}
                        </Button>
                        {resource.description ? (
                          <p className="mt-1 font-sans text-body-sm text-ink-muted">
                            {resource.description}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {ministry.classes && ministry.classes.length > 0 ? (
                <section className="mt-14">
                  <h2 className="font-display text-heading-2 text-ink">Classes</h2>
                  <ul className="mt-6 divide-y divide-rule border-y border-rule">
                    {ministry.classes.map((entry) => (
                      <li className="py-5" key={entry.name}>
                        <p className="font-display text-heading-3 text-ink">{entry.name}</p>
                        <p className="mt-1 font-sans text-eyebrow text-ink-muted uppercase">
                          {entry.ageRange}
                        </p>
                        {entry.description ? (
                          <p className="mt-3 max-w-measure font-sans text-body-sm text-ink-soft">
                            {entry.description}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {ministry.statistics && ministry.statistics.length > 0 ? (
                <section className="mt-14">
                  <h2 className="font-display text-heading-2 text-ink">At a glance</h2>
                  <dl className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-3">
                    {ministry.statistics.map((stat) => (
                      <div key={stat.label}>
                        <dt className="font-sans text-eyebrow text-ink-muted uppercase">
                          {stat.label}
                        </dt>
                        <dd className="mt-2 font-display text-heading-1 text-ink">{stat.value}</dd>
                        {stat.description ? (
                          <p className="mt-2 font-sans text-body-sm text-ink-muted">
                            {stat.description}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </dl>
                </section>
              ) : null}

              <p className="mt-14">
                <Button href="/ministries" variant="tertiary">
                  All ministries
                </Button>
              </p>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <MediaPlaceholder
                className="aspect-[4/5] w-full"
                description={`The ${ministry.name} group in the middle of doing the thing, shot from a distance rather than posed.`}
                image={ministry.heroImage}
              />
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
