import { notFound } from 'next/navigation'

import { EditorialPageView } from '@/components/content/editorial-page-view'
import { pageMetadata } from '@/lib/page-metadata'
import { getPageBySlug } from '@/sanity/lib/load'

const SLUG = 'give'
const EYEBROW = 'Give'

export async function generateMetadata() {
  const page = await getPageBySlug(SLUG)
  return pageMetadata(page?.title ?? 'Give', page?.intro)
}

export default async function GivePage() {
  const page = await getPageBySlug(SLUG)
  if (!page) notFound()

  return <EditorialPageView eyebrow={EYEBROW} page={page} />
}
