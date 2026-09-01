import { homePage } from '@/content/home-page'
import { siteSettings } from '@/content/site-settings'
import type { EditorialPage } from '@/types/content'

function paragraphs(slug: string, texts: string[]) {
  return texts.map((text, index) => ({
    type: 'paragraph' as const,
    key: `${slug}-${index}`,
    text,
  }))
}

/**
 * Fixture copy for the editorial routes, used until the matching `page` documents
 * exist in Sanity. Written in the church's voice so the pages can be judged as pages,
 * not as lorem.
 */
export const editorialPages: EditorialPage[] = [
  {
    title: 'Plan your visit',
    slug: 'visit',
    intro:
      'Most people who walk in on a Saturday morning do not know anyone yet. That is a normal way to arrive.',
    hero: homePage.arrival.hero.image,
    blocks: [
      ...paragraphs('visit', [
        'Come as you are. Some people wear a suit, most do not. Someone will say hello, nobody will ask you to stand up, and you are welcome to sit near the back and simply watch until you would rather not.',
      ]),
      {
        type: 'list',
        key: 'visit-expect',
        ordered: false,
        items: homePage.invitation.whatToExpect,
      },
      {
        type: 'heading',
        key: 'visit-parking-h',
        level: 2,
        text: 'Parking and arriving',
      },
      ...paragraphs('visit-park', [homePage.invitation.parking, siteSettings.address.directions]),
    ],
  },
  {
    title: 'About us',
    slug: 'about',
    intro: siteSettings.tagline,
    blocks: [
      ...paragraphs('about', homePage.story.paragraphs),
      {
        type: 'links',
        key: 'about-links',
        heading: 'More',
        links: [
          { label: 'Our leadership', href: '/about/leadership' },
          { label: 'What we believe', href: '/about/beliefs' },
        ],
      },
    ],
  },
  {
    title: 'What we believe',
    slug: 'about/beliefs',
    intro:
      'We are Seventh-day Adventists. That means we rest on Saturday, we take the whole Bible seriously, and we are waiting for Jesus to return — not as a slogan, but as the thing that shapes how we spend a week.',
    blocks: [
      ...paragraphs('beliefs', [
        'We belong to the Southeastern California Conference and to a worldwide family of roughly nineteen million Adventists. The official statements of belief are published by the General Conference; the short version, in our own words, is this.',
        'God is love. Scripture is how we know Him. The Sabbath is a gift, not a test. Jesus is coming again, and until then we try to be a people who look like Him in Clairemont.',
      ]),
      {
        type: 'cta',
        key: 'beliefs-official',
        label: 'Read the official 28 Fundamental Beliefs',
        href: 'https://www.adventist.org/beliefs/',
        external: true,
      },
      {
        type: 'links',
        key: 'beliefs-prophecy',
        heading: 'The dates, drawn to scale',
        links: [{ label: 'Walk through the years', href: '/prophecy' }],
      },
    ],
  },
  {
    title: 'Give',
    slug: 'give',
    intro:
      'Giving here is how we keep the lights on, feed people, and send our young people to camp. It is not a ticket, and nobody will know whether you did.',
    blocks: [
      ...paragraphs('give', [
        'Tithe and offerings can be given online through AdventistGiving, or in person on Sabbath. If you are visiting, please do not feel any pressure to give. You being here is enough.',
      ]),
      {
        type: 'cta',
        key: 'give-cta',
        label: 'Give through AdventistGiving',
        href: siteSettings.givingUrl,
        external: true,
      },
    ],
  },
  {
    title: 'Share a prayer request',
    slug: 'prayer',
    intro:
      'Requests go to Pastor Lee and a small prayer team. They are not published, and they are not this website’s to keep.',
    blocks: [
      ...paragraphs('prayer', [
        'Until a private form lives here, a call or an email reaches the same people. Say as much or as little as you want. You can leave your name off.',
        'We will not add you to a mailing list. No one will follow up unless you ask us to.',
      ]),
    ],
  },
]

export function getEditorialFixture(slug: string): EditorialPage | undefined {
  return editorialPages.find((page) => page.slug === slug)
}

/** Slugs that have their own App Router files and must not be handled by `/[slug]`. */
export const RESERVED_PAGE_SLUGS = new Set([
  'visit',
  'about',
  'give',
  'this-sabbath',
  'events',
  'ministries',
  'watch',
  'design',
  'gallery',
  'prophecy',
  'prayer',
  'home-video',
  'home-photo',
  'contact',
  'login',
  'studio',
  'dashboard',
])
