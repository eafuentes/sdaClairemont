import { notFound } from 'next/navigation'

import { AboutSubnav } from '@/components/about/about-subnav'
import { EditorialPageView } from '@/components/content/editorial-page-view'
import { pageMetadata } from '@/lib/page-metadata'
import { getPageBySlug } from '@/sanity/lib/load'

const SLUG = 'about/beliefs'
const EYEBROW = 'About'

export async function generateMetadata() {
  const page = await getPageBySlug(SLUG)
  return pageMetadata(page?.title ?? 'What we believe', page?.intro)
}

export default async function BeliefsPage() {
  const page = await getPageBySlug(SLUG)
  if (!page) notFound()

  return <EditorialPageView before={<AboutSubnav />} eyebrow={EYEBROW} page={page} />
}
