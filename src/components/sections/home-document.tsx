import type { ReactNode } from 'react'

import { ChapterAtmosphere } from '@/components/motion/chapter-atmosphere'
import { Belong } from '@/components/sections/belong'
import { Hope } from '@/components/sections/hope'
import { Invitation } from '@/components/sections/invitation'
import { Ministries } from '@/components/sections/ministries'
import { OurStory } from '@/components/sections/our-story'
import { Prayer } from '@/components/sections/prayer'
import { ThisSabbath } from '@/components/sections/this-sabbath'
import { UpcomingEvents } from '@/components/sections/upcoming-events'
import { Watch } from '@/components/sections/watch'
import type { HomePageBundle } from '@/sanity/lib/load'

interface HomeDocumentProps {
  arrival: ReactNode
  page: HomePageBundle
}

/**
 * Shared homepage chapters after Arrival, so the photo and video heroes can be
 * compared without duplicating the rest of the document.
 */
export function HomeDocument({ arrival, page }: HomeDocumentProps) {
  const { content, settings, visible } = page

  return (
    <ChapterAtmosphere>
      {arrival}
      {visible.thisSabbath ? (
        <ThisSabbath program={page.sabbathProgram} settings={settings} />
      ) : null}
      {visible.belong ? <Belong content={content.belong} /> : null}
      {visible.ministries ? <Ministries ministries={page.ministries} /> : null}
      {visible.events ? <UpcomingEvents events={page.upcomingEvents} settings={settings} /> : null}
      {visible.story ? <OurStory content={content.story} settings={settings} /> : null}
      {visible.watch ? <Watch channelUrl={settings.youtubeUrl} content={content.watch} /> : null}
      {visible.prayer ? <Prayer content={content.prayer} /> : null}
      {visible.hope ? <Hope content={content.hope} /> : null}
      {visible.invitation ? <Invitation content={content.invitation} settings={settings} /> : null}
    </ChapterAtmosphere>
  )
}
