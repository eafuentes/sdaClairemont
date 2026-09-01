import { Arrival } from '@/components/sections/arrival'
import { HomeDocument } from '@/components/sections/home-document'
import { getHomePage } from '@/sanity/lib/load'

/**
 * Alternate homepage: the same document, with the zoom clip as Arrival.
 *
 * Compare against `/` (the golden-hour scroll photograph) using the version
 * switcher. This route is for judging heroes, not a public IA item.
 */
export default async function VideoHomePage() {
  const page = await getHomePage()

  return (
    <HomeDocument
      arrival={<Arrival content={page.content.arrival} media="video" settings={page.settings} />}
      page={page}
    />
  )
}
