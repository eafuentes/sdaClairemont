import { PathwayTiles } from '@/components/brand/pathway-tiles'
import { aboutPathways } from '@/content/pathways'

/**
 * The About family is three pages. These tiles are the trail between them, so
 * Leadership is never a dead end reached only from the homepage sidebar.
 */
export function AboutSubnav() {
  return <PathwayTiles density="contents" label="About pages" tiles={aboutPathways} />
}
