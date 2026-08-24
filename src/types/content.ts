/**
 * Content types for the public site.
 *
 * These interfaces mirror the Sanity schemas described in docs/CMS-ARCHITECTURE.md
 * field for field. Phase 1 satisfies them with typed fixtures; Phase 2 satisfies them
 * with GROQ projections. Because the shape is identical, swapping the data source is
 * a change of import rather than a rewrite of every component.
 *
 * Components receive these as props and never fetch their own content.
 */

/** Every image in the system carries required alt text and declared provenance. */
export interface ContentImage {
  src: string
  /** Required. A missing alt is a validation error in Studio, not an audit finding. */
  alt: string
  width: number
  height: number
  caption?: string
  credit?: string
  /**
   * `church-photo` is the only value permitted in production. A build-time check
   * fails the production build if a published page references anything else.
   * See docs/MEDIA-STRATEGY.md.
   */
  provenance: 'church-photo' | 'ai-placeholder' | 'stock-placeholder'
  /** Required unless provenance is `church-photo`. Records the generator or licence. */
  provenanceNote?: string
}

export interface ServiceTime {
  label: string
  /** IANA-independent day name; formatting happens in church-local time. */
  day: string
  startTime: string
  endTime?: string
  note?: string
  isPrimary: boolean
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  latitude: number
  longitude: number
  mapUrl: string
  /** Prose directions, in the church's own words. */
  directions: string
}

export interface NavItem {
  label: string
  href: string
}

export interface SiteSettings {
  name: string
  shortName: string
  tagline: string
  mission: string
  serviceTimes: ServiceTime[]
  address: Address
  phone: string
  email: string
  /** External destinations. Editorial content, not environment configuration. */
  givingUrl: string
  youtubeUrl?: string
  facebookUrl?: string
  /** Manually set by staff. A boolean that always works beats an API that breaks quietly. */
  isLive: boolean
  livestreamUrl?: string
  primaryNav: NavItem[]
}

export interface Person {
  name: string
  slug: string
  role: string
  image?: ContentImage
}

export interface ScriptureRef {
  reference: string
  translation?: string
}

export interface SabbathProgram {
  date: string
  sermonTitle: string
  speakerName: string
  speakerRole?: string
  scripture: ScriptureRef[]
  sermonSummary: string
  sabbathSchoolTime: string
  worshipTime: string
  bulletinUrl?: string
  livestreamUrl?: string
  image?: ContentImage
  isSpecialService?: boolean
  specialServiceLabel?: string
}

export interface ChurchEvent {
  title: string
  slug: string
  shortDescription: string
  startDateTime: string
  endDateTime?: string
  isAllDay?: boolean
  locationName?: string
  atChurch: boolean
  ministrySlug?: string
  ministryName?: string
  image?: ContentImage
  registrationUrl?: string
}

export type MinistryTone = 'dawn' | 'sage' | 'sky'

export interface Ministry {
  name: string
  slug: string
  shortDescription: string
  ageRange: string
  meetingSchedule: string
  heroImage?: ContentImage
  /** Wide atmospheric frame for the discovery switcher, distinct from the hero crop. */
  switcherImage?: ContentImage
  tone: MinistryTone
  order: number
}

export interface Sermon {
  title: string
  slug: string
  date: string
  speakerName: string
  scripture: ScriptureRef[]
  youtubeUrl: string
  thumbnail?: ContentImage
  duration?: string
}

export interface Testimonial {
  quote: string
  personName: string
  personContext: string
  image?: ContentImage
}

/**
 * A photographic slot on the homepage, before the photograph exists.
 *
 * `description` is written as a brief for the photographer and doubles as the alt text
 * once the image is taken, which is why the field survives into the Sanity schema
 * rather than being a Phase 1 scaffold.
 */
export interface MediaSlot {
  description: string
  caption?: string
}

export interface HomePageContent {
  arrival: {
    headline: string
    hero: MediaSlot
  }
  belong: {
    headline: string
    body: string
    plates: MediaSlot[]
    testimonial: Testimonial
  }
  story: {
    plate: MediaSlot
    paragraphs: string[]
    pastor: Person
    pastorPortrait: MediaSlot
  }
  watch: {
    headline: string
    featured: Sermon
    recent: Sermon[]
  }
  prayer: {
    headline: string
    body: string[]
    plate: MediaSlot
  }
  hope: {
    scripture: string
    reference: string
    translation: string
  }
  invitation: {
    headline: string
    whatToExpect: string[]
    parking: string
    entrance: MediaSlot
  }
}
