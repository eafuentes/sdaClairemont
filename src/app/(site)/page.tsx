import { Arrival } from '@/components/sections/arrival'
import { HomeDocument } from '@/components/sections/home-document'
import { getHomePage } from '@/sanity/lib/load'

/**
 * The homepage: ten chapters read as one document.
 *
 * Content is resolved here, once, and passed down as props. No section fetches its own
 * data. Sanity is the source when the singletons exist; Phase 1 fixtures fill any
 * chapter that has not been published yet, and are the whole page when the CMS is
 * unconfigured — which is how CI still builds a readable homepage.
 */
export default async function HomePage() {
  const page = await getHomePage()

  return (
    <HomeDocument
      arrival={<Arrival content={page.content.arrival} settings={page.settings} />}
      page={page}
    />
  )
}
