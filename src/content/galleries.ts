import { flagshipPhotos } from '@/content/flagship'
import type { GalleryEntry, PhotoGallery } from '@/types/content'

export const pathfinderAdventures: GalleryEntry[] = [
  {
    id: 'rushmore',
    image: flagshipPhotos.pathfinders.rushmore,
    title: 'Mount Rushmore',
    date: 'Club trip',
    sentence:
      'The club on the plaza, the carved heads behind them — a trip that shows a parent this group actually goes places.',
  },
  {
    id: 'home-lawn',
    image: flagshipPhotos.pathfinders.hero,
    title: 'Home, in uniform',
    date: 'Clairemont',
    sentence:
      'A Sunday on the church lawn. This is what the club looks like when it is not on the road.',
  },
]

export const adventurerPhotos: GalleryEntry[] = [
  {
    id: 'banner',
    image: flagshipPhotos.adventurers.hero,
    title: 'Sunday with families',
    date: 'Clairemont',
    sentence: 'Children and parents together, holding the club banner. Nobody gets dropped off.',
  },
]

export const fixtureGalleries: PhotoGallery[] = [
  {
    title: 'Pathfinders on the road',
    slug: 'pathfinders-on-the-road',
    description: 'Trips and Sundays. The photographs a parent would send to another parent.',
    layout: 'horizontal',
    cover: flagshipPhotos.pathfinders.rushmore,
    items: pathfinderAdventures,
    ministrySlug: 'pathfinders',
  },
  {
    title: 'Pathfinders at home',
    slug: 'pathfinders-at-home',
    description: 'The club in uniform on the Clairemont lawn.',
    layout: 'masonry',
    cover: flagshipPhotos.pathfinders.hero,
    items: pathfinderAdventures,
    ministrySlug: 'pathfinders',
  },
  {
    title: 'Adventurers',
    slug: 'adventurers',
    description: 'A family club. Pre-K through grade 4, parents in the room.',
    layout: 'masonry',
    cover: flagshipPhotos.adventurers.hero,
    items: adventurerPhotos,
    ministrySlug: 'adventurers',
  },
]
