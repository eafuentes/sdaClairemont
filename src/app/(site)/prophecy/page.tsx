import { ProphecyPage } from '@/components/prophecy/prophecy-page'
import { pageMetadata } from '@/lib/page-metadata'
import { getProphecyPage } from '@/sanity/lib/load'

export async function generateMetadata() {
  const page = await getProphecyPage()
  return pageMetadata(page.title, page.lede)
}

export default async function ProphecyRoute() {
  const content = await getProphecyPage()
  return <ProphecyPage content={content} />
}
