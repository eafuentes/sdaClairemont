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
  /** Tiny base64 preview from Sanity. Used as the blur placeholder, never shown as the image. */
  lqip?: string
  caption?: string
  credit?: string
  /**
   * `church-photo` is the only value permitted in production for photography.
   * `youtube-thumbnail` is a video poster constructed at render time from a YouTube
   * id — it is not stored in Sanity and is exempt from the placeholder check.
   * See docs/MEDIA-STRATEGY.md.
   */
  provenance: 'church-photo' | 'ai-placeholder' | 'stock-placeholder' | 'youtube-thumbnail'
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
  /** Passage text, when staff have typed it into Studio. */
  text?: string
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
  specialMusic?: Array<{ title: string; performer?: string }>
  announcements?: Array<{ title: string; body: string[] }>
  isPast?: boolean
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

/**
 * The tonal wash behind a ministry row.
 *
 * Named for the temperature rather than for a colour token, because the palette carries
 * only two hues and an editor choosing "sage" would be choosing something that no longer
 * exists. Temperature survives a repalette; a hue name does not.
 */
export type MinistryTone = 'warm' | 'cool' | 'neutral'

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
  /**
   * The real photograph, once it exists. Slots without one render the written brief in
   * place, so the site can be photographed a frame at a time instead of all at once —
   * and so an unfilled slot is visibly unfinished rather than quietly shipping grey.
   */
  image?: ContentImage
}

export interface HomePageContent {
  arrival: {
    headline: string
    subhead?: string
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
    /** Absent when neither Studio nor the channel feed has a watchable message yet. */
    featured?: Sermon
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

export type EditorialBlock =
  | { type: 'paragraph'; key: string; text: string }
  | { type: 'heading'; key: string; text: string; level: 2 | 3 }
  | { type: 'quote'; key: string; text: string }
  | { type: 'list'; key: string; ordered: boolean; items: string[] }
  | { type: 'image'; key: string; image: ContentImage }
  | { type: 'scripture'; key: string; reference: string; translation?: string; text?: string }
  | { type: 'cta'; key: string; label: string; href: string; external?: boolean }
  | { type: 'video'; key: string; title: string; url: string }
  | { type: 'links'; key: string; heading?: string; links: Array<{ label: string; href: string }> }
  | {
      type: 'accordion'
      key: string
      heading?: string
      items: Array<{ question: string; answer: string[] }>
    }

export interface EditorialPage {
  title: string
  slug: string
  intro?: string
  hero?: ContentImage
  blocks: EditorialBlock[]
}

export interface EventDetail extends ChurchEvent {
  description?: string[]
  locationAddress?: string
  locationMapUrl?: string
  cost?: string
  ageRange?: string
  contact?: { name: string; role: string; email?: string; phone?: string }
}

/** One photograph in a gallery or an adventures sequence. */
export interface GalleryEntry {
  id: string
  image: ContentImage
  title?: string
  date?: string
  sentence?: string
}

export interface PhotoGallery {
  title: string
  slug: string
  description?: string
  date?: string
  layout: 'masonry' | 'horizontal'
  cover?: ContentImage
  items: GalleryEntry[]
  ministrySlug?: string
}

export interface MinistryDetail extends Ministry {
  description?: string[]
  registrationUrl?: string
  leaders?: Person[]
  resources?: Array<{ title: string; href: string; description?: string }>
  hasPathfinderDetails?: boolean
  classes?: Array<{ name: string; ageRange: string; description?: string }>
  statistics?: Array<{ value: string; label: string; description?: string }>
  timeline?: GalleryEntry[]
}

export interface SermonDetail extends Sermon {
  speakerRole?: string
  speakerImage?: ContentImage
  description?: string
  notesUrl?: string
  ministryName?: string
}

export interface Leader extends Person {
  roleCategory?: string
  bio?: string[]
  email?: string
  phone?: string
}

/**
 * A prophetic date is not an ISO day. Several points are seasonal, there is no year
 * zero, and the display string is the thing a reader should see.
 */
export interface PropheticDate {
  era: 'bc' | 'ad'
  year: number
  season?: 'spring' | 'summer' | 'autumn' | 'winter'
  display: string
}

export interface PropheticArithmetic {
  from: string
  plus: string
  result: string
  note: string
}

export interface PropheticObjection {
  title: string
  paragraphs: string[]
}

export interface PropheticEvent {
  id: string
  date: PropheticDate
  title: string
  scripture: ScriptureRef
  summary: string
  explanation: string[]
  arithmetic?: PropheticArithmetic
  objections?: PropheticObjection[]
}

export interface PropheticPeriod {
  id: string
  label: string
  years: number
  start: PropheticDate
  end: PropheticDate
  nestedIn?: string
}

export interface TimelineFold {
  beforeEventId: string
  yearsFolded: number
  label: string
  explanation: string
}

export interface EmpireAlignment {
  empire: string
  span: string
  start: PropheticDate
  end: PropheticDate
  daniel2: string
  daniel7: string
  daniel8: string
  daniel11?: string
  revelation?: string
}

export interface ProphecyPageContent {
  title: string
  eyebrow: string
  lede: string
  scripture: ScriptureRef
  intro: string[]
  periods: PropheticPeriod[]
  spine: PropheticEvent[]
  fold: TimelineFold
  empires: EmpireAlignment[]
  close: { headline: string; body: string }
}
