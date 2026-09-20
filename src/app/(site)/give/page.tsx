import { notFound } from 'next/navigation'

import { GiveView } from '@/components/give/give-view'
import { pageMetadata } from '@/lib/page-metadata'
import { getPageBySlug, getSiteSettings } from '@/sanity/lib/load'

const SLUG = 'give'

export async function generateMetadata() {
  const page = await getPageBySlug(SLUG)
  return pageMetadata(page?.title ?? 'Give', page?.intro)
}

export default async function GivePage() {
  const [page, settings] = await Promise.all([getPageBySlug(SLUG), getSiteSettings()])
  if (!page) notFound()

  return <GiveView page={page} settings={settings} />
}
