import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/container'
import { PageHeader } from '@/components/layout/page-header'
import { PhotoGallery } from '@/components/media/photo-gallery'
import { Button } from '@/components/ui/button'
import { fixtureGalleries } from '@/content/galleries'
import { formatPlainDate } from '@/lib/datetime'
import { pageMetadata } from '@/lib/page-metadata'

interface GalleryPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return fixtureGalleries.map((gallery) => ({ slug: gallery.slug }))
}

export async function generateMetadata({ params }: GalleryPageProps) {
  const { slug } = await params
  const gallery = fixtureGalleries.find((entry) => entry.slug === slug)
  if (!gallery) return pageMetadata('Photographs')
  return pageMetadata(gallery.title, gallery.description)
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { slug } = await params
  const gallery = fixtureGalleries.find((entry) => entry.slug === slug)
  if (!gallery) notFound()

  return (
    <>
      <PageHeader eyebrow="Photographs" title={gallery.title} intro={gallery.description} />
      <div className="bg-paper pb-section">
        {gallery.date ? (
          <Container>
            <p className="mb-12 font-sans text-eyebrow text-ink-muted uppercase">
              {formatPlainDate(gallery.date)}
            </p>
          </Container>
        ) : null}

        <div
          className={
            gallery.layout === 'masonry' ? 'mx-auto w-full max-w-page px-5 md:px-8 lg:px-16' : ''
          }
        >
          <PhotoGallery items={gallery.items} label={gallery.title} layout={gallery.layout} />
        </div>

        <Container>
          <p className="mt-16">
            {gallery.ministrySlug ? (
              <Button href={`/ministries/${gallery.ministrySlug}`} variant="tertiary">
                About this ministry
              </Button>
            ) : (
              <Button href="/gallery" variant="tertiary">
                All photographs
              </Button>
            )}
          </p>
        </Container>
      </div>
    </>
  )
}
