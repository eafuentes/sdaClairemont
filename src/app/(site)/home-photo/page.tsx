import { Arrival } from '@/components/sections/arrival'
import { HomeDocument } from '@/components/sections/home-document'
import { getHomePage } from '@/sanity/lib/load'

/**
 * Alternate homepage: the four-plate look-around as Arrival.
 *
 * Compare against `/` (the golden-hour scroll photograph) and `/home-video`
 * using the version switcher. This route is for judging heroes, not a public
 * IA item.
 */
export default async function LayersHomePage() {
  const page = await getHomePage()

  return (
    <HomeDocument
      arrival={<Arrival content={page.content.arrival} media="photo" settings={page.settings} />}
      page={page}
    />
  )
}
