import Link from 'next/link'
import { notFound } from 'next/navigation'

import { EditorialPageView } from '@/components/content/editorial-page-view'
import { Button } from '@/components/ui/button'
import { pageMetadata } from '@/lib/page-metadata'
import { getPageBySlug, getSiteSettings } from '@/sanity/lib/load'

const SLUG = 'prayer'
const EYEBROW = 'Prayer'

export async function generateMetadata() {
  const page = await getPageBySlug(SLUG)
  return pageMetadata(page?.title ?? 'Share a prayer request', page?.intro)
}

/**
 * A quiet place to ask. The private form is Phase 5; until then the church
 * phone and email reach Pastor Lee and the prayer team. Nothing typed here
 * is stored.
 */
export default async function PrayerPage() {
  const [page, settings] = await Promise.all([getPageBySlug(SLUG), getSiteSettings()])
  if (!page) notFound()

  const mailHref = `mailto:${settings.email}?subject=${encodeURIComponent('Prayer request')}`

  return (
    <EditorialPageView eyebrow={EYEBROW} page={page}>
      <aside className="mt-16 max-w-measure border-t border-rule pt-10">
        <h2 className="font-display text-heading-2 text-ink">Reach the prayer team</h2>
        <p className="mt-5 font-sans text-body text-ink-soft">
          A short message is enough. If you would rather speak than write, call.
        </p>
        <p className="mt-8 flex flex-wrap gap-4">
          <Button href={`tel:${settings.phone}`} icon="phone">
            Call {settings.phone}
          </Button>
          <Button href={mailHref} icon="mail" variant="secondary">
            Email a request
          </Button>
        </p>
        <p className="mt-6 font-sans text-body-sm text-ink-muted">
          Or ask in person{' '}
          <Link className="underline decoration-dawn underline-offset-4" href="/this-sabbath">
            this Sabbath
          </Link>
          .
        </p>
      </aside>
    </EditorialPageView>
  )
}
