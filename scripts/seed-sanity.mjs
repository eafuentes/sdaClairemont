/**
 * Seeds the Sanity dataset from the Phase 1 fixtures so Studio is not empty.
 *
 * Idempotent: stable document ids, `createOrReplace`. Re-running updates copy and
 * reuses the church-exterior asset if it is already in the dataset.
 *
 * Requires SANITY_API_WRITE_TOKEN (Editor or Admin) plus the public Sanity vars.
 *
 * Sermons are not seeded: the schema requires a real YouTube URL, and inventing one
 * would publish a video that is not this congregation's. Watch stays on fixtures
 * until staff paste a link.
 */

import { createReadStream } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@sanity/client'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-08-23'
const TOKEN = process.env.SANITY_API_WRITE_TOKEN
const TIME_ZONE = 'America/Los_Angeles'

if (!PROJECT_ID || !/^[a-z0-9]+$/.test(PROJECT_ID) || !DATASET || !TOKEN) {
  console.error(
    [
      'Seed needs a configured Sanity project and SANITY_API_WRITE_TOKEN.',
      'Add the write token to .env.local (Editor or Administrator role) and retry.',
    ].join('\n'),
  )
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: TOKEN,
  useCdn: false,
})

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function churchPlainDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function churchWeekday(date) {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'short',
  }).format(date)
  return WEEKDAYS.indexOf(weekday)
}

function upcomingSabbath(from = new Date()) {
  const daysUntilSaturday = (6 - churchWeekday(from) + 7) % 7
  const target = new Date(from)
  target.setDate(from.getDate() + daysUntilSaturday)
  return churchPlainDate(target)
}

function addDays(plainDate, days) {
  const [year, month, day] = plainDate.split('-').map(Number)
  const next = new Date(Date.UTC(year, month - 1, day + days))
  return next.toISOString().slice(0, 10)
}

function afterSabbath(sabbath, days, time) {
  return `${addDays(sabbath, days)}T${time}:00-07:00`
}

function key(prefix, index) {
  return `${prefix}${index}`.replace(/[^a-zA-Z0-9]/g, '').slice(0, 32)
}

function blocks(paragraphs, prefix = 'p') {
  return paragraphs.map((text, index) => ({
    _type: 'block',
    _key: key(prefix, index),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(`${prefix}s`, index), text, marks: [] }],
  }))
}

function bulletList(items, prefix = 'li') {
  return items.map((text, index) => ({
    _type: 'block',
    _key: key(prefix, index),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{ _type: 'span', _key: key(`${prefix}s`, index), text, marks: [] }],
  }))
}

function parseScripture(reference, translation = 'NKJV', text) {
  const match = /^(.+?)\s+(\d+)(?::(.+))?$/.exec(reference)
  if (!match) {
    return { _type: 'scriptureRef', book: reference, chapter: 1, translation, text }
  }

  return {
    _type: 'scriptureRef',
    book: match[1],
    chapter: Number(match[2]),
    verses: match[3],
    translation,
    text,
  }
}

function propheticDate(era, year, display, season) {
  return {
    _type: 'propheticDate',
    era,
    year,
    display,
    ...(season ? { season } : {}),
  }
}

function slugCurrent(value) {
  return { _type: 'slug', current: value }
}

function churchPhoto(assetId, alt) {
  return {
    _type: 'imageWithAlt',
    asset: { _type: 'reference', _ref: assetId },
    alt,
    provenance: 'church-photo',
    depictsIdentifiablePeople: false,
  }
}

function ref(id) {
  return { _type: 'reference', _ref: id }
}

function internalCta(label, documentId, variant = 'primary') {
  return {
    _type: 'cta',
    label,
    variant,
    link: {
      _type: 'link',
      kind: 'internal',
      internalTarget: ref(documentId),
    },
  }
}

async function uploadChurchPhoto() {
  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == "church-exterior-golden-hour.png"][0]._id`,
  )
  if (existing) {
    console.log(`  reuse  church photo  ${existing}`)
    return existing
  }

  const filePath = resolve('public/images/church-exterior-golden-hour.png')
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: 'church-exterior-golden-hour.png',
    contentType: 'image/png',
  })
  console.log(`  upload church photo  ${asset._id}`)
  return asset._id
}

async function uploadNamedPhoto(filename, directory = 'public/images/pastor-website-assets') {
  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    { filename },
  )
  if (existing) {
    console.log(`  reuse  ${filename}  ${existing}`)
    return existing
  }

  const filePath = resolve(directory, filename)
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename,
    contentType: 'image/webp',
  })
  console.log(`  upload ${filename}  ${asset._id}`)
  return asset._id
}

function portraitPhoto(assetId, alt) {
  return {
    _type: 'imageWithAlt',
    asset: { _type: 'reference', _ref: assetId },
    alt,
    provenance: 'church-photo',
    depictsIdentifiablePeople: true,
    consentConfirmed: true,
  }
}

const sabbath = upcomingSabbath()
const personId = 'person-london-lee'
const associateId = 'person-robert-berry'
const photoAlt =
  'The San Diego Clairemont Seventh-day Adventist church at sunset, its low tiled roof and stucco walls warm in the last light, with steps rising from the sidewalk between clipped hedges and a eucalyptus overhanging from the right.'

const ministries = [
  {
    _id: 'ministry-pathfinders',
    name: 'Pathfinders',
    slug: 'pathfinders',
    shortDescription:
      'Camping, hiking, service and skill-building for grades 5 through 12, run by trained and background-checked volunteers.',
    ageRange: 'Grades 5–12',
    accentTone: 'warm',
    order: 1,
    meetingSchedules: [
      {
        _type: 'meetingSchedule',
        _key: 'ms1',
        day: 'sunday',
        startTime: '10:00 AM',
        frequency: 'weekly',
        notes: 'During the school year',
      },
    ],
  },
  {
    _id: 'ministry-adventurers',
    name: 'Adventurers',
    slug: 'adventurers',
    shortDescription:
      'Younger children and their families learning together, twice a month, with plenty of room to be four years old.',
    ageRange: 'Pre-K–Grade 4, with families',
    accentTone: 'cool',
    order: 2,
    meetingSchedules: [
      {
        _type: 'meetingSchedule',
        _key: 'ms1',
        day: 'sunday',
        startTime: '10:00 AM',
        frequency: 'twice-monthly',
      },
    ],
  },
  {
    _id: 'ministry-sabbath-school',
    name: 'Sabbath School',
    slug: 'sabbath-school',
    shortDescription:
      'Bible study in small classes for every age, from the beginner room through adult discussion. Come with questions.',
    ageRange: 'All ages',
    accentTone: 'neutral',
    order: 3,
    meetingSchedules: [
      {
        _type: 'meetingSchedule',
        _key: 'ms1',
        day: 'saturday',
        startTime: '9:30 AM',
        endTime: '10:35 AM',
        frequency: 'weekly',
      },
    ],
  },
  {
    _id: 'ministry-care-group',
    name: 'CARE Group',
    slug: 'care-group',
    shortDescription:
      'A non-denominational young adult Bible study and friendship group. Free to join, and genuinely open to anyone.',
    ageRange: 'Young adults',
    accentTone: 'warm',
    order: 4,
    meetingSchedules: [
      {
        _type: 'meetingSchedule',
        _key: 'ms1',
        day: 'wednesday',
        startTime: '7:00 PM',
        frequency: 'weekly',
      },
    ],
  },
  {
    _id: 'ministry-vacation-bible-school',
    name: 'Vacation Bible School',
    slug: 'vacation-bible-school',
    shortDescription:
      'A week of summer mornings built entirely for kids — music, stories, crafts and a great deal of noise.',
    ageRange: 'Children',
    accentTone: 'cool',
    order: 5,
    meetingSchedules: [
      {
        _type: 'meetingSchedule',
        _key: 'ms1',
        day: 'monday',
        startTime: '9:00 AM',
        frequency: 'occasional',
        notes: 'One week each summer',
      },
    ],
  },
]

const events = [
  {
    _id: 'event-fellowship-meal',
    title: 'Fellowship Meal',
    slug: 'fellowship-meal',
    shortDescription:
      'Lunch together after worship. Bring something if you can, come anyway if you cannot.',
    startDateTime: afterSabbath(sabbath, 0, '12:30'),
    locationName: 'Fellowship Hall',
    atChurch: true,
    ministryId: 'ministry-sabbath-school',
  },
  {
    _id: 'event-pathfinder-investiture',
    title: 'Pathfinder Investiture',
    slug: 'pathfinder-investiture',
    shortDescription: 'Recognizing a year of work by our Pathfinders, with families invited.',
    startDateTime: afterSabbath(sabbath, 7, '15:00'),
    locationName: 'Sanctuary',
    atChurch: true,
    ministryId: 'ministry-pathfinders',
  },
  {
    _id: 'event-community-food-distribution',
    title: 'Community Food Distribution',
    slug: 'community-food-distribution',
    shortDescription:
      'Serving our Clairemont neighbors. Volunteers welcome — no experience needed.',
    startDateTime: afterSabbath(sabbath, 8, '09:00'),
    locationName: '4125 Hathaway St',
    atChurch: true,
  },
  {
    _id: 'event-care-group-bible-study',
    title: 'CARE Group Bible Study',
    slug: 'care-group-bible-study',
    shortDescription: 'Young adults, an open Bible, and a low bar for entry.',
    startDateTime: afterSabbath(sabbath, 11, '19:00'),
    atChurch: false,
    locationName: 'Location shared on request',
    ministryId: 'ministry-care-group',
  },
]

const assetId = await uploadChurchPhoto()
const hero = churchPhoto(assetId, photoAlt)
const londonPortraitId = await uploadNamedPhoto('pastor-portrait-London-2.webp')
const berryPortraitId = await uploadNamedPhoto('pastor-portrait-Berry-2.webp')
const speakerPortraitId = await uploadNamedPhoto(
  'speaker-portrait.webp',
  'public/images/sabbath',
)

const documents = [
  {
    _id: personId,
    _type: 'person',
    name: 'London L. Lee',
    slug: { _type: 'slug', current: 'london-lee' },
    role: 'Senior Pastor',
    roleCategory: 'pastoral',
    order: 1,
    showContactPublicly: false,
    image: portraitPhoto(
      londonPortraitId,
      'Pastor London L. Lee in the Clairemont sanctuary, wearing glasses and a grey suit, smiling toward the camera.',
    ),
    bio: blocks([
      'Pastor London L. Lee was born in Loma Linda, California, to God-fearing Christian parents. Although he grew up in a loving Christian home, Pastor Lee experienced what he likes to call “The Prodigal Son Syndrome.” During this season of his life, he became estranged from his Heavenly Father.',
      'Remembering the biblical teachings of his youth and realizing that, no matter what he had done, God would welcome him home, he returned to the loving care of his Heavenly Father, who received him with open arms. Like the prodigal son, Pastor Lee had squandered much of his mental, physical, and spiritual capital. Yet, in spite of it all, God not only accepted him but also placed within him a burning desire to share the matchless love of Christ with all who will listen.',
      'In August 2000, God led Pastor Lee to Osaka, Japan, where he served as a missionary. While in Japan, he met and married his lovely wife, Nikisha, who shares his passion for soul-winning and missionary work. Pastor and Mrs. Lee have been blessed with two children, Selah and Anthony.',
      'Together, the Lee family has had the privilege of traveling to more than 18 countries, teaching and preaching the Everlasting Gospel.',
    ]),
  },
  {
    _id: associateId,
    _type: 'person',
    name: 'Robert Berry',
    slug: { _type: 'slug', current: 'robert-berry' },
    role: 'Associate Pastor',
    roleCategory: 'pastoral',
    order: 2,
    showContactPublicly: false,
    image: portraitPhoto(
      berryPortraitId,
      'Pastor Robert Berry in the Clairemont sanctuary, wearing a grey suit and blue tie, smiling toward the camera.',
    ),
    bio: blocks(
      [
        'Pastor Robert Berry was born and raised in Southern California. From a young age, God placed within him a love for ministry and a desire to help others know Jesus personally. As that calling grew, God led him to Southern Adventist University, where he earned a degree in Theology and prepared for pastoral ministry.',
        'Today, Pastor Berry serves as Associate Pastor of Clairemont Seventh-day Adventist Church. He has a special passion for reaching young adults, teaching the Bible, making disciples, and developing the next generation of Christian leaders. His greatest desire is to help people discover biblical truth, experience an authentic relationship with Christ, and use their lives in service to Him.',
        'Outside of ministry, Pastor Berry enjoys motorcycles, traveling, spending time outdoors, and being with friends and family. He considers it a privilege to serve God’s church and share the hope of Jesus with others.',
      ],
      'rb',
    ),
  },
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: 'San Diego Clairemont Seventh-day Adventist Church',
    shortName: 'Clairemont SDA Church',
    tagline: 'Developing a loving relationship with Christ and our community.',
    missionStatement:
      'A Seventh-day Adventist congregation in Clairemont, San Diego. We gather every Saturday for Bible study and worship, and there is a place for you here.',
    serviceTimes: [
      {
        _type: 'serviceTime',
        _key: 'ss',
        label: 'Sabbath School',
        day: 'saturday',
        startTime: '9:30 AM',
        endTime: '10:35 AM',
        notes: 'Bible study in classes for every age.',
        isPrimary: true,
      },
      {
        _type: 'serviceTime',
        _key: 'dw',
        label: 'Divine Worship',
        day: 'saturday',
        startTime: '10:45 AM',
        notes: 'The main worship service.',
        isPrimary: true,
      },
      {
        _type: 'serviceTime',
        _key: 'pm',
        label: 'Prayer Meeting',
        day: 'wednesday',
        startTime: '6:30 PM',
        isPrimary: false,
      },
    ],
    address: {
      _type: 'address',
      street: '4125 Hathaway St',
      city: 'San Diego',
      state: 'CA',
      postalCode: '92111',
      latitude: 32.8185,
      longitude: -117.167,
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=4125+Hathaway+St+San+Diego+CA+92111',
      drivingNotes:
        'From I-5, take I-805 and exit at Balboa Avenue heading west. Turn south at the first light onto Hathaway. The church is on the left, across from an elementary school.',
    },
    phone: '858-569-6735',
    email: 'info@sdaclairemont.net',
    givingUrl: 'https://adventistgiving.org/',
    youtubeChannelUrl: 'https://www.youtube.com/@SDClairemontSDA',
    socialLinks: [
      {
        _type: 'socialLink',
        _key: 'fb',
        platform: 'facebook',
        url: 'https://www.facebook.com/Clairemont-SDA-Church-201001569921760/',
      },
      {
        _type: 'socialLink',
        _key: 'yt',
        platform: 'youtube',
        url: 'https://www.youtube.com/@SDClairemontSDA',
      },
    ],
    isLive: false,
  },
  ...ministries.map((ministry) => ({
    _id: ministry._id,
    _type: 'ministry',
    name: ministry.name,
    slug: { _type: 'slug', current: ministry.slug },
    shortDescription: ministry.shortDescription,
    description: blocks([ministry.shortDescription]),
    ageRange: ministry.ageRange,
    meetingSchedules: ministry.meetingSchedules,
    accentTone: ministry.accentTone,
    order: ministry.order,
  })),
  ...events.map((event) => ({
    _id: event._id,
    _type: 'event',
    title: event.title,
    slug: { _type: 'slug', current: event.slug },
    shortDescription: event.shortDescription,
    description: blocks([event.shortDescription]),
    startDateTime: event.startDateTime,
    atChurch: event.atChurch,
    locationName: event.locationName,
    featured: false,
    isAllDay: false,
    ministry: event.ministryId ? ref(event.ministryId) : undefined,
  })),
  {
    _id: `sabbathProgram-${sabbath}`,
    _type: 'sabbathProgram',
    date: sabbath,
    sermonTitle: 'The Long Way Home',
    speaker: ref(personId),
    scripture: [parseScripture('Luke 15:11-32', 'NKJV')],
    sermonSummary:
      'The son who left assumed there was a version of himself his father could no longer welcome. He was wrong about that, and most of us are wrong about it too. A look at what the father was doing while the son was gone.',
    isSpecialService: false,
    image: portraitPhoto(
      speakerPortraitId,
      'Pastor London L. Lee preaching from the pulpit in the Clairemont sanctuary, arms open, in a grey suit.',
    ),
  },
  {
    _id: 'page-visit',
    _type: 'page',
    title: 'Plan your visit',
    slug: { _type: 'slug', current: 'visit' },
    intro:
      'Most people who walk in on a Saturday morning do not know anyone yet. That is a normal way to arrive.',
    content: [
      ...blocks([
        'Come as you are. Some people wear a suit, most do not. Someone will say hello, nobody will ask you to stand up, and you are welcome to sit near the back and simply watch until you would rather not.',
      ]),
      ...bulletList([
        'Come as you are. Some people wear a suit, most do not.',
        'There is a class for your kids, and the people running it are trained and background-checked.',
        'Stay for lunch if you can. There is almost always food.',
        'If you need anything, ask anyone wearing a name tag.',
      ]),
    ],
  },
  {
    _id: 'page-about',
    _type: 'page',
    title: 'About us',
    slug: { _type: 'slug', current: 'about' },
    intro: 'Developing a loving relationship with Christ and our community.',
    content: blocks([
      'We are a Seventh-day Adventist congregation of about 274 people in Clairemont, and we have been meeting on Hathaway Street, across from the elementary school, for decades.',
      'We belong to the Southeastern California Conference and to a worldwide family of roughly nineteen million Adventists. That connection matters to us, but it is not what you will notice first. What you will notice first is that this is a small enough church that people know when you are missing.',
      'Our aim is the one printed on everything we own: developing a loving relationship with Christ and our community. We do not always manage it. We keep trying.',
    ]),
  },
  {
    _id: 'page-beliefs',
    _type: 'page',
    title: 'What we believe',
    slug: { _type: 'slug', current: 'about/beliefs' },
    intro:
      'We are Seventh-day Adventists. That means we rest on Saturday, we take the whole Bible seriously, and we are waiting for Jesus to return — not as a slogan, but as the thing that shapes how we spend a week.',
    content: [
      ...blocks([
        'We belong to the Southeastern California Conference and to a worldwide family of roughly nineteen million Adventists. The official statements of belief are published by the General Conference; the short version, in our own words, is this.',
        'God is love. Scripture is how we know Him. The Sabbath is a gift, not a test. Jesus is coming again, and until then we try to be a people who look like Him in Clairemont.',
      ]),
      {
        _type: 'callToAction',
        _key: 'beliefsOfficial',
        label: 'Read the official 28 Fundamental Beliefs',
        variant: 'primary',
        link: {
          _type: 'link',
          kind: 'external',
          externalUrl: 'https://www.adventist.org/beliefs/',
        },
      },
    ],
  },
  {
    _id: 'page-give',
    _type: 'page',
    title: 'Give',
    slug: { _type: 'slug', current: 'give' },
    intro:
      'Giving here is how we keep the lights on, feed people, and send our young people to camp. It is not a ticket, and nobody will know whether you did.',
    content: [
      ...blocks([
        'Tithe and offerings can be given online through AdventistGiving, or in person on Sabbath. If you are visiting, please do not feel any pressure to give. You being here is enough.',
      ]),
      {
        _type: 'callToAction',
        _key: 'giveCta',
        label: 'Give through AdventistGiving',
        variant: 'primary',
        link: {
          _type: 'link',
          kind: 'external',
          externalUrl: 'https://adventistgiving.org/',
        },
      },
    ],
  },
  {
    _id: 'page-prayer',
    _type: 'page',
    title: 'Share a prayer request',
    slug: { _type: 'slug', current: 'prayer' },
    intro:
      'Requests go to Pastor Lee and a small prayer team. They are not published, and they are not this website’s to keep.',
    content: blocks([
      'Until a private form lives here, a call or an email reaches the same people. Say as much or as little as you want. You can leave your name off.',
      'We will not add you to a mailing list. No one will follow up unless you ask us to.',
    ]),
  },
  {
    _id: 'homePage',
    _type: 'homePage',
    arrival: {
      headline: "There's a place for you here.",
      heroImage: hero,
      primaryCta: internalCta('Plan your visit', 'page-visit', 'primary'),
    },
    thisSabbath: { isVisible: true },
    belong: {
      isVisible: true,
      headline: 'Come as you are. Stay as long as you like.',
      body: 'Most people who walk in on a Saturday morning do not know anyone yet. That is a normal way to arrive. Someone will say hello, nobody will ask you to stand up, and you are welcome to sit near the back and simply watch until you would rather not.',
    },
    ministries: {
      isVisible: true,
      headline: 'There is somewhere here for your whole family.',
      featured: ministries.map((ministry, index) => ({
        _key: key('min', index),
        ...ref(ministry._id),
      })),
    },
    events: { isVisible: true },
    story: {
      isVisible: true,
      body: blocks([
        'We are a Seventh-day Adventist congregation of about 274 people in Clairemont, and we have been meeting on Hathaway Street, across from the elementary school, for decades.',
        'We belong to the Southeastern California Conference and to a worldwide family of roughly nineteen million Adventists. That connection matters to us, but it is not what you will notice first. What you will notice first is that this is a small enough church that people know when you are missing.',
        'Our aim is the one printed on everything we own: developing a loving relationship with Christ and our community. We do not always manage it. We keep trying.',
      ]),
      pastor: ref(personId),
    },
    watch: { isVisible: true, headline: 'If you cannot be here, be here anyway.' },
    prayer: {
      isVisible: true,
      headline: 'Is something heavy right now?',
      invitation:
        'You can send it to us. Requests go to Pastor Lee and a small prayer team, and nowhere else. You can leave your name off entirely.',
    },
    hope: {
      isVisible: true,
      scripture: parseScripture(
        'Matthew 11:28-29',
        'NKJV',
        'Come to Me, all you who labor and are heavy laden, and I will give you rest. Take My yoke upon you and learn from Me, for I am gentle and lowly in heart, and you will find rest for your souls.',
      ),
    },
    invitation: {
      isVisible: true,
      headline: "We'd love to meet you this Sabbath.",
      whatToExpect: [
        'Come as you are. Some people wear a suit, most do not.',
        'There is a class for your kids, and the people running it are trained and background-checked.',
        'Stay for lunch if you can. There is almost always food.',
        'If you need anything, ask anyone wearing a name tag.',
      ],
      cta: internalCta('Plan your visit', 'page-visit', 'primary'),
    },
  },
  {
    _id: 'prophecyPage',
    _type: 'prophecyPage',
    title: 'Unto two thousand and three hundred days.',
    eyebrow: 'Daniel 8:14',
    lede: 'An angel named a length of time. This page draws that length to scale — from a Persian king’s decree to 1844 — so you can see the proportion rather than only read it.',
    scripture: parseScripture(
      'Daniel 8:14',
      'KJV',
      'And he said unto me, Unto two thousand and three hundred days; then shall the sanctuary be cleansed.',
    ),
    intro: [
      'A first-time reader does not need the whole chart of Daniel and Revelation. They need one thread they can follow. That thread is here: seventy weeks cut from the start of twenty-three hundred years, ending when the Messiah appears, and the longer period ending in 1844.',
      'This is the historicist reading this congregation holds. The dates are treated as exact, so the drawing is too. Where the page has to fold empty centuries, the fold is labeled. The two prophetic periods themselves are never folded.',
    ],
    periods: [
      {
        key: '2300',
        label: '2,300 years',
        years: 2300,
        start: propheticDate('bc', 457, '457 BC', 'autumn'),
        end: propheticDate('ad', 1844, '1844', 'autumn'),
      },
      {
        key: '490',
        label: '490 years',
        years: 490,
        start: propheticDate('bc', 457, '457 BC', 'autumn'),
        end: propheticDate('ad', 34, 'Autumn AD 34', 'autumn'),
        nestedIn: '2300',
      },
    ],
    spine: [
      {
        key: slugCurrent('decree'),
        date: propheticDate('bc', 457, '457 BC', 'autumn'),
        title: 'The decree that starts the clock',
        scripture: parseScripture('Ezra 7', 'KJV'),
        summary:
          'Artaxerxes I sends Ezra to restore Jerusalem. Adventists read this autumn 457 BC decree as the beginning of both the 2,300 years and the 70 weeks cut from them.',
        explanation: [
          'Daniel 9 says the seventy weeks begin with “the going forth of the commandment to restore and to build Jerusalem.” Three Persian decrees touch that work. The one that actually funds and authorizes the restoration of the city and its worship is Ezra 7, issued in the seventh year of Artaxerxes — 457 BC.',
          'From this autumn the two periods run together: 2,300 years to 1844, and 490 years — seventy weeks of years — to the Messiah.',
        ],
      },
      {
        key: slugCurrent('rebuilt'),
        date: propheticDate('bc', 408, '408 BC'),
        title: 'Jerusalem rebuilt — seven weeks',
        scripture: parseScripture('Daniel 9:25', 'KJV'),
        summary:
          'Seven weeks, forty-nine years, from the decree to a rebuilt city. 457 BC plus 49 years is 408 BC.',
        arithmetic: {
          from: '457 BC',
          plus: '49 years',
          result: '408 BC',
          note: 'Seven weeks of years. The street and the wall are rebuilt, even in troublous times.',
        },
        explanation: [
          'Gabriel splits the sixty-nine weeks that reach the Messiah: seven, then sixty-two. The first seven are the rebuilding. They are not a metaphor for a later age. They are forty-nine years on the same clock that started in 457.',
        ],
      },
      {
        key: slugCurrent('baptism'),
        date: propheticDate('ad', 27, 'Autumn AD 27', 'autumn'),
        title: 'The baptism of Jesus — sixty-nine weeks',
        scripture: parseScripture('Daniel 9:25', 'KJV'),
        summary:
          'Sixty-nine weeks, 483 years, from the decree reach the Anointed One. There is no year zero: 457 plus 483 is autumn AD 27.',
        arithmetic: {
          from: '457 BC',
          plus: '483 years',
          result: 'Autumn AD 27',
          note: 'Sixty-nine weeks of years. No year zero, so the sum lands on 27, not 26.',
        },
        explanation: [
          '“Unto the Messiah the Prince shall be seven weeks, and threescore and two weeks.” Four hundred and eighty-three years from autumn 457 BC is autumn AD 27. That is the year this church reads as Jesus’ baptism in the Jordan, when He was anointed by the Spirit and the seventy-first week of years began.',
          'The question a seeker can test is not a slogan. The angel said 483 years would reach the Messiah. Did they? The arithmetic says yes.',
        ],
      },
      {
        key: slugCurrent('crucifixion'),
        date: propheticDate('ad', 31, 'Spring AD 31', 'spring'),
        title: 'The crucifixion — in the midst of the week',
        scripture: parseScripture('Daniel 9:26-27', 'KJV'),
        summary:
          'Three and a half years after the baptism, in the midst of the seventieth week, Messiah is cut off. Spring AD 31.',
        arithmetic: {
          from: 'Autumn AD 27',
          plus: '3½ years',
          result: 'Spring AD 31',
          note: '“In the midst of the week he shall cause the sacrifice and the oblation to cease.”',
        },
        explanation: [
          'The seventieth week is seven years. Its midpoint is three and a half years after the baptism — the spring of AD 31, at Passover. This church reads the crucifixion there: the true sacrifice ends the meaning of the temple offerings, not by a later antichrist, but by Christ Himself.',
        ],
        objections: [
          {
            title: 'What about a gap before a future seven-year tribulation?',
            paragraphs: [
              'A common reading inserts a gap of two thousand years between the sixty-ninth week and the seventieth, and places that last week at the end of time. Gabriel does not mention a gap. The seventy weeks are “determined” — cut off as one period — from the same decree that starts the 2,300 years.',
              'If the seventieth week is delayed, the crucifixion leaves the prophecy, and the “midst of the week” has to be reassigned to someone else. This church keeps the week intact: AD 27 to AD 34, with the cross in the middle, because that is where the arithmetic already points.',
            ],
          },
        ],
      },
      {
        key: slugCurrent('stephen'),
        date: propheticDate('ad', 34, 'Autumn AD 34', 'autumn'),
        title: 'The gospel goes to the nations',
        scripture: parseScripture('Daniel 9:24', 'KJV'),
        summary:
          'The seventieth week closes in autumn AD 34. Stephen is stoned; the exclusive work for Israel ends; the remaining 1,810 years of the 2,300 continue.',
        arithmetic: {
          from: 'Autumn AD 27',
          plus: '7 years',
          result: 'Autumn AD 34',
          note: 'The seventy weeks, 490 years, are complete. 2,300 − 490 leaves 1,810.',
        },
        explanation: [
          'Seventy weeks were given “to finish the transgression” for Daniel’s people. This church reads the stoning of Stephen and the gospel’s turn to the nations as that close. The shorter period is finished. The longer one is not. From this autumn, 1,810 years remain.',
        ],
      },
      {
        key: slugCurrent('sanctuary'),
        date: propheticDate('ad', 1844, '1844', 'autumn'),
        title: 'The sanctuary cleansed',
        scripture: parseScripture('Daniel 8:14', 'KJV'),
        summary:
          'Autumn 457 BC plus 2,300 years is autumn 1844. The remaining 1,810 years after AD 34 end here.',
        arithmetic: {
          from: '457 BC',
          plus: '2,300 years',
          result: '1844',
          note: 'The same clock. No year zero. The 490 were cut from the beginning, not added on at the end.',
        },
        explanation: [
          'Daniel 8 asked how long the little horn would trample the sanctuary. The answer was 2,300 evenings and mornings, then the sanctuary would be cleansed. Using the day-for-a-year reading this church holds with the rest of Daniel 8 and 9, that span runs from the 457 BC decree to 1844.',
          'Adventists do not read 1844 as the end of the world. They read it as the beginning of a work in heaven — the cleansing of the heavenly sanctuary, the judgment that precedes Christ’s return. The disappointment of those who expected Jesus to appear on earth that year is part of our own story. The date was right. The event was larger than a sky they could see.',
        ],
        objections: [
          {
            title: 'Was the little horn only Antiochus Epiphanes?',
            paragraphs: [
              'A careful preterist reading applies Daniel 8’s little horn to Antiochus IV, who desecrated the Jerusalem temple in the 160s BC. He is a real tyrant, and he belongs in the Greek story. This church does not think he exhausts the vision.',
              'The ram and the goat are named as Medo-Persia and Greece. The little horn comes out of their aftermath and becomes “exceeding great” toward the south, the east, and the pleasant land — greater than Alexander, which Antiochus was not. The 2,300 days, if they are ordinary days, do not match his roughly three-year persecution. The vision is said to belong to “the time of the end.”',
              'So the historicist reading continues the horn through pagan Rome and then the medieval papacy, and lets the 2,300 years run their full length to 1844. Antiochus is a type. He is not the whole.',
            ],
          },
        ],
      },
    ],
    fold: {
      beforeEventKey: 'sanctuary',
      yearsFolded: 1810,
      label: '1,810 years folded here',
      explanation:
        'From autumn AD 34 to autumn 1844 the spine has no event. Drawn linearly, those years would leave this page. They are folded, and the fold is marked, because a page that argues from exact dates cannot quietly change scale.',
    },
    empires: [
      {
        empire: 'Babylon',
        span: '605–539 BC',
        start: propheticDate('bc', 605, '605 BC'),
        end: propheticDate('bc', 539, '539 BC'),
        daniel2: 'Head of gold',
        daniel7: 'Lion with eagle’s wings',
        daniel8: '—',
        daniel11: 'The first king',
        revelation: '—',
      },
      {
        empire: 'Medo-Persia',
        span: '539–331 BC',
        start: propheticDate('bc', 539, '539 BC'),
        end: propheticDate('bc', 331, '331 BC'),
        daniel2: 'Chest of silver',
        daniel7: 'Bear raised on one side',
        daniel8: 'Ram with two horns',
        daniel11: 'Three more kings, then a richer fourth',
        revelation: '—',
      },
      {
        empire: 'Greece',
        span: '331–168 BC',
        start: propheticDate('bc', 331, '331 BC'),
        end: propheticDate('bc', 168, '168 BC'),
        daniel2: 'Belly of brass',
        daniel7: 'Leopard with four wings',
        daniel8: 'Goat with one horn, then four',
        daniel11: 'A mighty king, then four toward the winds',
        revelation: '—',
      },
      {
        empire: 'Rome',
        span: '168 BC–AD 476',
        start: propheticDate('bc', 168, '168 BC'),
        end: propheticDate('ad', 476, 'AD 476'),
        daniel2: 'Legs of iron',
        daniel7: 'Dreadful beast, ten horns',
        daniel8: 'The little horn',
        daniel11: 'The king who magnifies himself',
        revelation: 'The sea beast',
      },
    ],
    close: {
      headline: 'The angel said it would reach. It did.',
      body: 'That is the whole case, offered without heat. If you want to hear it preached rather than drawn, come on Saturday, or watch a message. Questions are welcome. A page is not a conversation.',
    },
  },
]

const transaction = client.transaction()
for (const document of documents) {
  transaction.createOrReplace(document)
}

await transaction.commit({ autoGenerateArrayKeys: true })

console.log(`  wrote  ${documents.length} documents to ${PROJECT_ID}/${DATASET}`)
console.log('  next   Open /studio, edit This Sabbath, and publish. That is the staff test.')
