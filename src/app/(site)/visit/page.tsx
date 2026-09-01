import { notFound } from 'next/navigation'

import { EditorialPageView } from '@/components/content/editorial-page-view'
import { Button } from '@/components/ui/button'
import { homePage } from '@/content/home-page'
import { pageMetadata } from '@/lib/page-metadata'
import { getPageBySlug, getSiteSettings } from '@/sanity/lib/load'

const SLUG = 'visit'
const EYEBROW = 'Visit'

export async function generateMetadata() {
  const page = await getPageBySlug(SLUG)
  return pageMetadata(page?.title ?? 'Plan your visit', page?.intro)
}

export default async function VisitPage() {
  const [page, settings] = await Promise.all([getPageBySlug(SLUG), getSiteSettings()])
  if (!page) notFound()

  const { address } = settings
  const withBuilding = {
    ...page,
    hero: page.hero ?? homePage.arrival.hero.image,
  }

  return (
    <EditorialPageView eyebrow={EYEBROW} page={withBuilding}>
      <aside className="mt-16 max-w-measure border-t border-rule pt-10">
        <h2 className="font-serif text-heading-2 text-ink">Find us</h2>
        <address className="mt-5 font-sans text-body text-ink-soft not-italic">
          {address.street}
          <br />
          {address.city}, {address.state} {address.postalCode}
        </address>
        <p className="mt-6 flex flex-wrap gap-4">
          <Button external href={address.mapUrl} variant="secondary">
            Open in Maps
          </Button>
          <Button href="/this-sabbath" variant="tertiary">
            This Sabbath
          </Button>
        </p>
        <p className="mt-4 font-sans text-body-sm text-ink-muted">
          <a
            className="underline decoration-dawn underline-offset-4"
            href={`tel:${settings.phone}`}
          >
            {settings.phone}
          </a>
        </p>
      </aside>
    </EditorialPageView>
  )
}
