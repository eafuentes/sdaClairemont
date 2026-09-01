import { notFound } from 'next/navigation'

import { AboutContinue } from '@/components/about/about-continue'
import { AboutSubnav } from '@/components/about/about-subnav'
import { EditorialPageView } from '@/components/content/editorial-page-view'
import { pageMetadata } from '@/lib/page-metadata'
import { getPageBySlug } from '@/sanity/lib/load'

const SLUG = 'about'
const EYEBROW = 'About'

export async function generateMetadata() {
  const page = await getPageBySlug(SLUG)
  return pageMetadata(page?.title ?? 'About us', page?.intro)
}

export default async function AboutPage() {
  const page = await getPageBySlug(SLUG)
  if (!page) notFound()

  return (
    <EditorialPageView before={<AboutSubnav />} eyebrow={EYEBROW} page={page}>
      <AboutContinue />
    </EditorialPageView>
  )
}
