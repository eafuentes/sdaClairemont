import { ChurchHero, type ChurchHeroMedia } from '@/components/hero/church-hero'
import { ChurchScrollHero } from '@/components/hero/church-scroll-hero'
import type { HomePageContent, SiteSettings } from '@/types/content'

export type ArrivalMedia = 'scroll' | ChurchHeroMedia

interface ArrivalProps {
  content: HomePageContent['arrival']
  settings: SiteSettings
  media?: ArrivalMedia
}

/**
 * Chapter 01 — Arrival.
 *
 * The homepage default is the golden-hour photograph with a dusk layer and a
 * scroll-triggered walk into evening. Alternate media (layered plates, video)
 * stay on the compare routes so those experiments do not replace the chapter.
 */
export function Arrival({ content, settings, media = 'scroll' }: ArrivalProps) {
  if (media === 'scroll') {
    return <ChurchScrollHero content={content} settings={settings} />
  }

  return <ChurchHero content={content} media={media} settings={settings} />
}
