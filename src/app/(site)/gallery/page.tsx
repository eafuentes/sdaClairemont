import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { PageHeader } from '@/components/layout/page-header'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { fixtureGalleries } from '@/content/galleries'
import { pageMetadata } from '@/lib/page-metadata'

export const metadata = pageMetadata(
  'Photographs',
  'Photographs from the life of San Diego Clairemont Seventh-day Adventist Church — Pathfinders, Adventurers, and the Sundays in between.',
)

export default function GalleryIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="Photographs"
        title="Days the church actually lived."
        intro="Not a stock library. These are the club trips, the lawn, and the families in the room."
      />
      <div className="bg-paper-bloom pb-section">
        <Container>
          <ul className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {fixtureGalleries.map((gallery) => (
              <li key={gallery.slug}>
                <Link className="group block" href={`/gallery/${gallery.slug}`}>
                  <MediaPlaceholder
                    className="aspect-[4/3]"
                    description={gallery.description ?? gallery.title}
                    image={gallery.cover}
                  />
                  <h2 className="mt-5 font-display text-heading-2 text-ink underline decoration-transparent underline-offset-4 group-hover:decoration-dawn">
                    {gallery.title}
                  </h2>
                  {gallery.description ? (
                    <p className="mt-3 max-w-measure font-sans text-body-sm text-ink-soft">
                      {gallery.description}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </>
  )
}
