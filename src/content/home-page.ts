import { addDays, getUpcomingSabbath, subtractWeeks } from '@/lib/sabbath'
import type { ChurchEvent, HomePageContent, Ministry, SabbathProgram } from '@/types/content'

/**
 * Phase 1 fixtures for the homepage.
 *
 * Shaped exactly like the `homePage` singleton and its referenced documents in
 * docs/CMS-ARCHITECTURE.md, so Phase 2 replaces this module with a GROQ query and
 * changes nothing in any component.
 *
 * The prose here is written in the church's voice and is close to publishable, because
 * placeholder copy hides layout problems that real sentences expose. Names, sermon
 * titles and event details are illustrative and must be replaced with real content
 * before launch.
 */

const upcomingSabbath = getUpcomingSabbath()

export const sabbathProgram: SabbathProgram = {
  date: upcomingSabbath,
  sermonTitle: 'The Long Way Home',
  speakerName: 'London L. Lee',
  speakerRole: 'Senior Pastor',
  scripture: [{ reference: 'Luke 15:11-32', translation: 'NKJV' }],
  sermonSummary:
    'The son who left assumed there was a version of himself his father could no longer welcome. He was wrong about that, and most of us are wrong about it too. A look at what the father was doing while the son was gone.',
  sabbathSchoolTime: '9:30 AM',
  worshipTime: '10:45 AM',
  image: undefined,
}

export const ministries: Ministry[] = [
  {
    name: 'Pathfinders',
    slug: 'pathfinders',
    shortDescription:
      'Camping, hiking, service and skill-building for grades 5 through 12, run by trained and background-checked volunteers.',
    ageRange: 'Grades 5–12',
    meetingSchedule: 'Sundays during the school year',
    tone: 'warm',
    order: 1,
  },
  {
    name: 'Adventurers',
    slug: 'adventurers',
    shortDescription:
      'Younger children and their families learning together, twice a month, with plenty of room to be four years old.',
    ageRange: 'Pre-K–Grade 4, with families',
    meetingSchedule: 'Twice monthly on Sundays',
    tone: 'cool',
    order: 2,
  },
  {
    name: 'Sabbath School',
    slug: 'sabbath-school',
    shortDescription:
      'Bible study in small classes for every age, from the beginner room through adult discussion. Come with questions.',
    ageRange: 'All ages',
    meetingSchedule: 'Saturdays, 9:30–10:35 AM',
    tone: 'neutral',
    order: 3,
  },
  {
    name: 'CARE Group',
    slug: 'care-group',
    shortDescription:
      'A non-denominational young adult Bible study and friendship group. Free to join, and genuinely open to anyone.',
    ageRange: 'Young adults',
    meetingSchedule: 'Weekly',
    tone: 'warm',
    order: 4,
  },
  {
    name: 'Vacation Bible School',
    slug: 'vacation-bible-school',
    shortDescription:
      'A week of summer mornings built entirely for kids — music, stories, crafts and a great deal of noise.',
    ageRange: 'Children',
    meetingSchedule: 'One week each summer',
    tone: 'cool',
    order: 5,
  },
]

/**
 * Builds an event timestamp a given number of days after the upcoming Sabbath.
 *
 * Anchored to the Sabbath rather than to "today" so the fixture list stays internally
 * coherent: a fellowship lunch that follows worship has to fall on a Saturday, and
 * counting forward from `new Date()` in UTC silently pushes it to Sunday whenever the
 * build runs after 5pm Pacific.
 *
 * The fixed -07:00 offset is Pacific Daylight Time. Real events carry a true timestamp
 * from Studio, so this approximation does not survive Phase 2.
 */
function afterSabbath(days: number, time: string): string {
  return `${addDays(upcomingSabbath, days)}T${time}:00-07:00`
}

export const upcomingEvents: ChurchEvent[] = [
  {
    title: 'Fellowship Meal',
    slug: 'fellowship-meal',
    shortDescription:
      'Lunch together after worship. Bring something if you can, come anyway if you cannot.',
    startDateTime: afterSabbath(0, '12:30'),
    locationName: 'Fellowship Hall',
    atChurch: true,
    ministrySlug: 'sabbath-school',
    ministryName: 'All Church',
  },
  {
    title: 'Pathfinder Investiture',
    slug: 'pathfinder-investiture',
    shortDescription: 'Recognizing a year of work by our Pathfinders, with families invited.',
    startDateTime: afterSabbath(7, '15:00'),
    locationName: 'Sanctuary',
    atChurch: true,
    ministrySlug: 'pathfinders',
    ministryName: 'Pathfinders',
  },
  {
    title: 'Community Food Distribution',
    slug: 'community-food-distribution',
    shortDescription:
      'Serving our Clairemont neighbors. Volunteers welcome — no experience needed.',
    startDateTime: afterSabbath(8, '09:00'),
    locationName: '4125 Hathaway St',
    atChurch: true,
    ministryName: 'Community Service',
  },
  {
    title: 'CARE Group Bible Study',
    slug: 'care-group-bible-study',
    shortDescription: 'Young adults, an open Bible, and a low bar for entry.',
    startDateTime: afterSabbath(11, '19:00'),
    atChurch: false,
    locationName: 'Location shared on request',
    ministrySlug: 'care-group',
    ministryName: 'CARE Group',
  },
]

export const homePage: HomePageContent = {
  arrival: {
    headline: 'There’s a place for you here.',
    hero: {
      description:
        'The church exterior at golden hour, shot wide from the sidewalk with the steps and the eucalyptus in frame. Space along the lower edge for type.',
      image: {
        src: '/images/church-exterior-golden-hour.png',
        alt: 'The San Diego Clairemont Seventh-day Adventist church at sunset, its low tiled roof and stucco walls warm in the last light, with steps rising from the sidewalk between clipped hedges and a eucalyptus overhanging from the right.',
        width: 1024,
        height: 576,
        // Supplied and confirmed by the church, 2026-08-23. The site palette is sampled
        // from this frame, so replacing it is a design decision rather than a swap.
        provenance: 'church-photo',
      },
    },
  },

  belong: {
    headline: 'Come as you are. Stay as long as you like.',
    body: 'Most people who walk in on a Saturday morning do not know anyone yet. That is a normal way to arrive. Someone will say hello, nobody will ask you to stand up, and you are welcome to sit near the back and simply watch until you would rather not.',
    plates: [
      {
        description:
          'Two members talking in the foyer after the service, mid-conversation, shot from the side at a respectful distance.',
        caption: 'After the service, in the foyer.',
      },
      {
        description:
          'An older member and a young child walking together down the aisle, photographed from behind.',
        caption: 'Sabbath morning.',
      },
      {
        description:
          'A wide frame of the fellowship hall during lunch, tables full, warm light from the windows.',
        caption: 'Fellowship lunch, first Sabbath of the month.',
      },
    ],
    testimonial: {
      quote:
        'I came for one Sabbath because a coworker asked. That was eleven years ago. I stayed because nobody was performing — they were just glad I came.',
      personName: 'Marisol R.',
      personContext: 'Member since 2015',
    },
  },

  story: {
    plate: {
      description:
        'The sanctuary photographed from the back, empty, in late afternoon light through the windows. Wide and horizontal.',
    },
    paragraphs: [
      'We are a Seventh-day Adventist congregation of about 274 people in Clairemont, and we have been meeting on Hathaway Street, across from the elementary school, for decades.',
      'We belong to the Southeastern California Conference and to a worldwide family of roughly nineteen million Adventists. That connection matters to us, but it is not what you will notice first. What you will notice first is that this is a small enough church that people know when you are missing.',
      'Our aim is the one printed on everything we own: developing a loving relationship with Christ and our community. We do not always manage it. We keep trying.',
    ],
    pastor: {
      name: 'London L. Lee',
      slug: 'london-lee',
      role: 'Senior Pastor',
    },
    pastorPortrait: {
      description:
        'Portrait of Pastor London Lee, natural light, at the church rather than in a studio. Shoulders up, looking at the camera.',
    },
  },

  watch: {
    headline: 'If you cannot be here, be here anyway.',
    // The archive is built backwards from the upcoming Sabbath, so the featured message
    // is always the most recent one that has actually happened. A "watch" chapter
    // offering a sermon dated in the future is a small thing that reads as carelessness.
    featured: {
      title: 'Enough for Today',
      slug: 'enough-for-today',
      date: subtractWeeks(upcomingSabbath, 1),
      speakerName: 'London L. Lee',
      scripture: [{ reference: 'Exodus 16', translation: 'NKJV' }],
      youtubeUrl: '',
      duration: '38 min',
    },
    recent: [
      {
        title: 'What the Sabbath Is For',
        slug: 'what-the-sabbath-is-for',
        date: subtractWeeks(upcomingSabbath, 2),
        speakerName: 'Robert David Berry',
        scripture: [{ reference: 'Mark 2:27' }],
        youtubeUrl: '',
        duration: '34 min',
      },
      {
        title: 'The Neighbor Question',
        slug: 'the-neighbor-question',
        date: subtractWeeks(upcomingSabbath, 3),
        speakerName: 'London L. Lee',
        scripture: [{ reference: 'Luke 10:25-37' }],
        youtubeUrl: '',
        duration: '41 min',
      },
      {
        title: 'Room at the Table',
        slug: 'room-at-the-table',
        date: subtractWeeks(upcomingSabbath, 4),
        speakerName: 'London L. Lee',
        scripture: [{ reference: 'Luke 14:15-24' }],
        youtubeUrl: '',
        duration: '36 min',
      },
    ],
  },

  prayer: {
    headline: 'Is something heavy right now?',
    body: [
      'You can send it to us. Requests go to Pastor Lee and a small prayer team, and nowhere else.',
      'You can leave your name off entirely. We will not add you to a mailing list, and no one will follow up unless you ask us to.',
    ],
    plate: {
      description:
        'A window in the sanctuary in late light, or a pair of hands resting on an open Bible. No faces. Quiet and dark.',
    },
  },

  hope: {
    scripture:
      'Come to Me, all you who labor and are heavy laden, and I will give you rest. Take My yoke upon you and learn from Me, for I am gentle and lowly in heart, and you will find rest for your souls.',
    reference: 'Matthew 11:28-29',
    translation: 'NKJV',
  },

  invitation: {
    headline: 'We’d love to meet you this Sabbath.',
    whatToExpect: [
      'Come as you are. Some people wear a suit, most do not.',
      'There is a class for your kids, and the people running it are trained and background-checked.',
      'Stay for lunch if you can. There is almost always food.',
      'If you need anything, ask anyone wearing a name tag.',
    ],
    parking: 'Free parking in the lot off Hathaway Street, with additional street parking.',
    entrance: {
      description:
        'The church entrance with a greeter holding the door open, warm morning light, shot from the approach so a visitor recognises what they will see.',
    },
  },
}
