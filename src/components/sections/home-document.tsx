import type { ReactNode } from 'react'

import { PathwayTiles } from '@/components/brand/pathway-tiles'
import { ChapterAtmosphere } from '@/components/motion/chapter-atmosphere'
import { Belong } from '@/components/sections/belong'
import { Invitation } from '@/components/sections/invitation'
import { ThisSabbath } from '@/components/sections/this-sabbath'
import { homePathways } from '@/content/pathways'
import type { HomePageBundle } from '@/sanity/lib/load'

interface HomeDocumentProps {
  arrival: ReactNode
  page: HomePageBundle
}

/**
 * The homepage is a short visit, not the whole church.
 *
 * Arrival, this week, three next steps, belonging, then the facts for the car.
 * Ministries, events, the story, watch, prayer, and hope keep their own pages.
 */
export function HomeDocument({ arrival, page }: HomeDocumentProps) {
  const { content, settings, visible } = page

  return (
    <ChapterAtmosphere>
      {arrival}
      {visible.thisSabbath ? (
        <ThisSabbath program={page.sabbathProgram} settings={settings} />
      ) : null}
      <PathwayTiles label="Start here" tiles={homePathways} />
      {visible.belong ? <Belong content={content.belong} /> : null}
      {visible.invitation ? <Invitation content={content.invitation} settings={settings} /> : null}
    </ChapterAtmosphere>
  )
}
