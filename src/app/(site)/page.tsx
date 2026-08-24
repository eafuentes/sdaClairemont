import { Arrival } from '@/components/sections/arrival'
import { Belong } from '@/components/sections/belong'
import { Hope } from '@/components/sections/hope'
import { Invitation } from '@/components/sections/invitation'
import { Ministries } from '@/components/sections/ministries'
import { OurStory } from '@/components/sections/our-story'
import { Prayer } from '@/components/sections/prayer'
import { ThisSabbath } from '@/components/sections/this-sabbath'
import { UpcomingEvents } from '@/components/sections/upcoming-events'
import { Watch } from '@/components/sections/watch'
import { homePage, ministries, sabbathProgram, upcomingEvents } from '@/content/home-page'
import { siteSettings } from '@/content/site-settings'

/**
 * The homepage: ten chapters read as one document.
 *
 * Content is resolved here, once, and passed down as props. No section fetches its own
 * data, which is what lets Phase 2 swap fixtures for GROQ by editing this file alone.
 *
 * Phase 1 is deliberately motionless. Every chapter renders its resting composition —
 * the state a designer would be happy to print, and the exact state a visitor with
 * `prefers-reduced-motion: reduce` will get permanently. Motion is layered on top of
 * this in Phase 3 rather than being the thing that makes the page work.
 */
export default function HomePage() {
  return (
    <>
      <Arrival content={homePage.arrival} settings={siteSettings} />
      <ThisSabbath program={sabbathProgram} settings={siteSettings} />
      <Belong content={homePage.belong} />
      <Ministries ministries={ministries} />
      <UpcomingEvents events={upcomingEvents} settings={siteSettings} />
      <OurStory content={homePage.story} settings={siteSettings} />
      <Watch content={homePage.watch} />
      <Prayer content={homePage.prayer} />
      <Hope content={homePage.hope} />
      <Invitation content={homePage.invitation} settings={siteSettings} />
    </>
  )
}
