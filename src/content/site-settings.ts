import type { SiteSettings } from '@/types/content'

/**
 * Phase 1 fixture for the `siteSettings` singleton.
 *
 * Every value here was confirmed against the current site and the Adventist
 * Organizational Directory, except those marked NEEDS CONFIRMATION — which are
 * tracked as open questions in docs/PRODUCT-VISION.md and must be verified with
 * staff before launch. They are flagged in code, not only in a document, so they
 * cannot quietly ship as fact.
 *
 * In Phase 2 this is replaced by a GROQ query returning the same shape.
 */
export const siteSettings: SiteSettings = {
  name: 'San Diego Clairemont Seventh-day Adventist Church',
  shortName: 'Clairemont SDA Church',
  tagline: 'Developing a loving relationship with Christ and our community.',
  mission:
    'A Seventh-day Adventist congregation in Clairemont, San Diego. We gather every Saturday for Bible study and worship, and there is a place for you here.',

  serviceTimes: [
    {
      label: 'Sabbath School',
      day: 'Saturday',
      startTime: '9:30 AM',
      endTime: '10:35 AM',
      note: 'Bible study in classes for every age.',
      isPrimary: true,
    },
    {
      label: 'Divine Worship',
      day: 'Saturday',
      startTime: '10:45 AM',
      note: 'The main worship service.',
      isPrimary: true,
    },
    {
      // NEEDS CONFIRMATION — from the Adventist directory; staff must confirm this is
      // still current, and whether it meets in person, on Zoom, or both.
      label: 'Prayer Meeting',
      day: 'Wednesday',
      startTime: '6:30 PM',
      isPrimary: false,
    },
  ],

  address: {
    street: '4125 Hathaway St',
    city: 'San Diego',
    state: 'CA',
    postalCode: '92111',
    latitude: 32.8185,
    longitude: -117.167,
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=4125+Hathaway+St+San+Diego+CA+92111',
    directions:
      'From I-5, take I-805 and exit at Balboa Avenue heading west. Turn south at the first light onto Hathaway. The church is on the left, across from an elementary school.',
  },

  phone: '858-569-6735',
  email: 'info@sdaclairemont.net',

  // NEEDS CONFIRMATION — the congregation's specific AdventistGiving URL. Until staff
  // provide it this points at the portal's own search, which is honest rather than wrong.
  givingUrl: 'https://adventistgiving.org/',
  // NEEDS CONFIRMATION — official channel, required for the Watch experience.
  youtubeUrl: undefined,
  facebookUrl: 'https://www.facebook.com/Clairemont-SDA-Church-201001569921760/',

  // Set by hand by staff before a service. A boolean a person controls is more reliable
  // than an API that fails quietly on the one morning it matters.
  isLive: false,
  livestreamUrl: undefined,

  primaryNav: [
    { label: 'Visit', href: '/visit' },
    { label: 'About', href: '/about' },
    { label: 'Ministries', href: '/ministries' },
    { label: 'Events', href: '/events' },
    { label: 'Watch', href: '/watch' },
  ],
}
