import type { ContentImage, MinistryDetail } from '@/types/content'

/**
 * Church-supplied club photographs. These are real people, used with the church's
 * knowledge that they will appear on the Pathfinders and Adventurers pages. Alt text
 * names the group, never a child.
 */
export const flagshipPhotos = {
  pathfinders: {
    hero: {
      src: '/media/pathfinders/club-uniform.png',
      alt: 'The Clairemont Pathfinder club in uniform on the church lawn, yellow neckerchiefs and honor sashes, with club flags.',
      width: 1024,
      height: 768,
      provenance: 'church-photo',
    },
    rushmore: {
      src: '/media/pathfinders/rushmore.png',
      alt: 'Clairemont Pathfinders at Mount Rushmore, gathered on the plaza in front of the carved heads.',
      width: 387,
      height: 516,
      provenance: 'church-photo',
      caption: 'Mount Rushmore',
      credit: 'Clairemont Pathfinders',
    },
  },
  adventurers: {
    hero: {
      src: '/media/adventurers/club-banner.png',
      alt: 'Clairemont Adventurers and their families indoors, children holding a San Diego Clairemont banner.',
      width: 1024,
      height: 768,
      provenance: 'church-photo',
    },
  },
} satisfies Record<string, Record<string, ContentImage>>

const pathfinderClasses: NonNullable<MinistryDetail['classes']> = [
  {
    name: 'Friend',
    ageRange: 'Grade 5',
    description: 'The first year. Outdoor skills, friendship, and learning how a club works.',
  },
  {
    name: 'Companion',
    ageRange: 'Grade 6',
    description: 'Camping and honors deepen. The work starts to look like a craft.',
  },
  {
    name: 'Explorer',
    ageRange: 'Grade 7',
    description: 'More independence on the trail, and more responsibility in the unit.',
  },
  {
    name: 'Ranger',
    ageRange: 'Grade 8',
    description: 'Leadership begins. Older Pathfinders start teaching the younger ones.',
  },
  {
    name: 'Voyager',
    ageRange: 'Grade 9',
    description: 'Teen years. Longer trips, harder honors, a clearer sense of the club as theirs.',
  },
  {
    name: 'Guide',
    ageRange: 'Grade 10',
    description: 'Guides hold the unit together. They are already becoming staff.',
  },
  {
    name: 'Pioneer',
    ageRange: 'Grade 11',
    description: 'Advanced classwork and service. The club expects them to lead.',
  },
  {
    name: 'Navigator',
    ageRange: 'Grade 12',
    description: 'The last year. They leave having taken other people somewhere.',
  },
]

const adventurerClasses: NonNullable<MinistryDetail['classes']> = [
  {
    name: 'Little Lamb',
    ageRange: 'Pre-K',
    description: 'The youngest. Short, sensory, and always with a parent nearby.',
  },
  {
    name: 'Eager Beaver',
    ageRange: 'Kindergarten',
    description: 'Songs, simple crafts, and learning how to be in a group.',
  },
  {
    name: 'Busy Bee',
    ageRange: 'Grade 1',
    description: 'First real classwork — still short enough for a six-year-old.',
  },
  {
    name: 'Sunbeam',
    ageRange: 'Grade 2',
    description: 'More outdoors, more helping, still firmly a family club.',
  },
  {
    name: 'Builder',
    ageRange: 'Grade 3',
    description: 'They start making things that last, and taking small jobs seriously.',
  },
  {
    name: 'Helping Hand',
    ageRange: 'Grade 4',
    description: 'The last Adventurer year. Many of them will walk into Pathfinders next.',
  },
]

export interface FlagshipCopy {
  headline: string
  scripture: { text: string; reference: string; translation: string }
  mission: string[]
  safety: string[]
  adventure?: {
    title: string
    date: string
    sentence: string
    image: ContentImage
  }
  classes: NonNullable<MinistryDetail['classes']>
}

export const flagshipCopy: Record<'pathfinders' | 'adventurers', FlagshipCopy> = {
  pathfinders: {
    headline: 'Adventure, on purpose.',
    scripture: {
      text: 'Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.',
      reference: 'Joshua 1:9',
      translation: 'KJV',
    },
    mission: [
      'Pathfinders is a club for grades 5 through 12 that treats the outdoors, skill, and service as a way of growing up. We camp, we hike, we earn honors, we show up for the community, and we do it with screened volunteers who already know these kids by name.',
      'The point is not a packed calendar. It is a group of teenagers who have been somewhere together, and who know how to take care of each other when they get there.',
    ],
    safety: [
      'Every volunteer who works with this club is screened, trained, and background-checked. That is the Safe Kid Policy, stated here because a parent should not have to hunt for it.',
      'If you want to know who is in the room on a Sunday, ask for the director. If something does not feel right, say so — to them, or to the pastor.',
    ],
    adventure: {
      title: 'Mount Rushmore',
      date: 'Club trip',
      sentence:
        'The club on the plaza, the carved heads behind them — a trip that shows a parent this group actually goes places.',
      image: flagshipPhotos.pathfinders.rushmore,
    },
    classes: pathfinderClasses,
  },
  adventurers: {
    headline: 'A club a four-year-old can belong to.',
    scripture: {
      text: 'And he took them up in his arms, put his hands upon them, and blessed them.',
      reference: 'Mark 10:16',
      translation: 'KJV',
    },
    mission: [
      'Adventurers is for pre-K through grade 4, and it is built for families. Children do not get dropped off and collected. Parents stay, help, and learn the same songs.',
      'Twice a month on Sundays. Short enough for a small person, structured enough that they leave knowing they were part of something.',
    ],
    safety: [
      'Every volunteer is screened, trained, and background-checked. A parent is welcome in the room. If you want to know who is leading a Sunday, ask — that question is the point of this paragraph.',
    ],
    classes: adventurerClasses,
  },
}

export function photosFor(slug: 'pathfinders' | 'adventurers'): ContentImage {
  return slug === 'pathfinders' ? flagshipPhotos.pathfinders.hero : flagshipPhotos.adventurers.hero
}
