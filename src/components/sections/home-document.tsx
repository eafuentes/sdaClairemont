import type { ReactNode } from 'react'

import { PathwayTiles } from '@/components/brand/pathway-tiles'
import { DirectionHome } from '@/components/home/direction-home'
import { HomeDesignSwitch } from '@/components/home/home-design-switch'
import { DaylightHero } from '@/components/hero/daylight-hero'
import { InlineScript } from '@/components/immersive/inline-script'
import { MobileHome } from '@/components/immersive/mobile-home'
import { ChapterAtmosphere } from '@/components/motion/chapter-atmosphere'
import { Belong } from '@/components/sections/belong'
import { Invitation } from '@/components/sections/invitation'
import { ThisSabbath } from '@/components/sections/this-sabbath'
import { HOME_DESIGN_SCRIPT } from '@/content/direction'
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
 *
 * Paper, Ink & Brush, and Poster are three designs of the same leadership
 * homepage, switched from the review control. Current is the homepage as it
 * stands, kept so the pastors can compare. The choice is stored on this device
 * and in the URL.
 */
export function HomeDocument({ arrival, page }: HomeDocumentProps) {
  const { content, settings, visible } = page

  return (
    <>
      <InlineScript html={HOME_DESIGN_SCRIPT} />
      <div className="home-slot home-slot-paper">
        <DirectionHome page={page} tone="paper" />
      </div>
      <div className="home-slot home-slot-ink">
        <DirectionHome page={page} tone="ink" />
      </div>
      <div className="home-slot home-slot-poster">
        <DirectionHome page={page} tone="poster" />
      </div>
      <div className="home-slot home-slot-current">
        <MobileHome page={page} />
        <div className="hidden lg:block">
          <ChapterAtmosphere>
            <div className="home-arrival-dusk">{arrival}</div>
            <div className="home-arrival-daylight">
              <DaylightHero content={content.arrival} settings={settings} />
            </div>
            {visible.thisSabbath ? (
              <ThisSabbath program={page.sabbathProgram} settings={settings} />
            ) : null}
            <PathwayTiles label="Start here" tiles={homePathways} />
            {visible.belong ? <Belong content={content.belong} /> : null}
            {visible.invitation ? (
              <Invitation content={content.invitation} settings={settings} />
            ) : null}
          </ChapterAtmosphere>
        </div>
      </div>
      <HomeDesignSwitch />
    </>
  )
}
