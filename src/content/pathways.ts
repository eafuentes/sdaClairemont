import { lifePhotos } from '@/content/life'
import type { BrandGradient } from '@/styles/palette'
import type { ContentImage } from '@/types/content'

export type PathwayTileSurface =
  | { kind: 'photo'; image: ContentImage }
  | { kind: 'gradient'; name: BrandGradient }

export interface PathwayTile {
  href: string
  title: string
  hint: string
  surface: PathwayTileSurface
}

/**
 * Destination tiles — the Awaken-style three-up used as on-page subnav.
 *
 * Copy stays short. Surfaces are either a washed photograph or a named gradient
 * from `src/styles/palette.ts`. Never interpolate a colour class here.
 */

export const homePathways: readonly PathwayTile[] = [
  {
    href: '/visit',
    title: 'I’m new',
    hint: 'What are my next steps?',
    surface: { kind: 'photo', image: lifePhotos.congregation },
  },
  {
    href: '/this-sabbath',
    title: 'This Sabbath',
    hint: 'Who is speaking this week?',
    surface: { kind: 'gradient', name: 'horizon' },
  },
  {
    href: '/events',
    title: 'Events',
    hint: 'What’s coming up?',
    surface: { kind: 'photo', image: lifePhotos.kitchen },
  },
]

export const aboutPathways: readonly PathwayTile[] = [
  {
    href: '/about',
    title: 'About us',
    hint: 'Who we are, in our own words.',
    surface: { kind: 'photo', image: lifePhotos.foyer },
  },
  {
    href: '/about/leadership',
    title: 'Leadership',
    hint: 'The pastors who serve here.',
    surface: { kind: 'gradient', name: 'horizon' },
  },
  {
    href: '/about/beliefs',
    title: 'What we believe',
    hint: 'Sabbath, Scripture, and hope.',
    surface: { kind: 'photo', image: lifePhotos.bible },
  },
]

export const visitPathways: readonly PathwayTile[] = [
  {
    href: '/this-sabbath',
    title: 'This Sabbath',
    hint: 'Times, speaker, and the program.',
    surface: { kind: 'gradient', name: 'horizon' },
  },
  {
    href: '/events',
    title: 'Events',
    hint: 'Lunch, and what gathers us between Sabbaths.',
    surface: { kind: 'photo', image: lifePhotos.kitchen },
  },
  {
    href: '/prayer',
    title: 'Prayer',
    hint: 'It goes to a small team, not this website.',
    surface: { kind: 'photo', image: lifePhotos.flowers },
  },
]

export const sabbathPathways: readonly PathwayTile[] = [
  {
    href: '/visit',
    title: 'Plan your visit',
    hint: 'Parking, times, and what to expect.',
    surface: { kind: 'photo', image: lifePhotos.foyer },
  },
  {
    href: '/watch',
    title: 'Watch',
    hint: 'If you cannot be here, be here anyway.',
    surface: { kind: 'gradient', name: 'ember' },
  },
  {
    href: '/events',
    title: 'Events',
    hint: 'What’s coming up?',
    surface: { kind: 'photo', image: lifePhotos.sanctuary },
  },
]
