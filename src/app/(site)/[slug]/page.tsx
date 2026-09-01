import { notFound } from 'next/navigation'

import { EditorialPageView } from '@/components/content/editorial-page-view'
import { RESERVED_PAGE_SLUGS } from '@/content/pages'
import { pageMetadata } from '@/lib/page-metadata'
import { getFlexiblePageSlugs, getPageBySlug } from '@/sanity/lib/load'

interface FlexiblePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getFlexiblePageSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: FlexiblePageProps) {
  const { slug } = await params
  if (RESERVED_PAGE_SLUGS.has(slug)) return pageMetadata('Page')
  const page = await getPageBySlug(slug)
  if (!page) return pageMetadata('Page')
  return pageMetadata(page.title, page.intro)
}

export default async function FlexiblePage({ params }: FlexiblePageProps) {
  const { slug } = await params
  if (RESERVED_PAGE_SLUGS.has(slug)) notFound()

  const page = await getPageBySlug(slug)
  if (!page) notFound()

  return <EditorialPageView eyebrow={page.title} page={page} />
}
