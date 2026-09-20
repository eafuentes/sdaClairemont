import type {
  BlockContent,
  HomePageQueryResult,
  SiteSettingsQueryResult,
} from '../../../sanity.types'
import type {
  ChurchEvent,
  HomePageContent,
  Ministry,
  MinistryTone,
  SabbathProgram,
  ScriptureRef,
  Sermon,
  SiteSettings,
} from '@/types/content'
import { flagshipPhotos } from '@/content/flagship'
import { sabbathSpeakerPortrait } from '@/content/home-page'
import { withYouTubePoster } from '@/lib/youtube'

import { mapImage, type ProjectedImage } from './image'

const WEEKDAY_LABEL: Record<string, string> = {
  sunday: 'Sunday',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
}

const FREQUENCY_LABEL: Record<string, string> = {
  weekly: 'Weekly',
  biweekly: 'Every other week',
  'twice-monthly': 'Twice a month',
  monthly: 'Monthly',
  occasional: 'Now and then',
}

const TONES: ReadonlySet<MinistryTone> = new Set(['warm', 'cool', 'neutral'])

function isVisible(value: boolean | null | undefined): boolean {
  return value !== false
}

function weekdayLabel(day: string): string {
  return WEEKDAY_LABEL[day] ?? day
}

function pick<T>(value: T | null | undefined, fallback: T): T {
  if (value == null) return fallback
  if (typeof value === 'string' && value.trim().length === 0) return fallback
  return value
}

export function mapScripture(
  entries:
    | Array<{
        reference: string | null
        translation: ScriptureRef['translation'] | null
        text?: string | null
      }>
    | null
    | undefined,
): ScriptureRef[] {
  if (!entries) return []

  return entries.flatMap((entry) => {
    if (!entry.reference) return []
    return [
      {
        reference: entry.reference,
        translation: entry.translation ?? undefined,
        text: entry.text ?? undefined,
      },
    ]
  })
}

export function portableTextToParagraphs(body: BlockContent | null | undefined): string[] {
  if (!body) return []

  return body.flatMap((block) => {
    if (!('_type' in block) || block._type !== 'block') return []
    const text = (block.children ?? [])
      .map((child) => child.text ?? '')
      .join('')
      .trim()
    return text ? [text] : []
  })
}

export function formatMeetingSchedule(
  schedules:
    | Array<{
        day: string
        startTime: string
        frequency: string
        notes: string | null
      }>
    | null
    | undefined,
): string | undefined {
  if (!schedules || schedules.length === 0) return undefined

  return schedules
    .map((schedule) => {
      const frequency = FREQUENCY_LABEL[schedule.frequency] ?? schedule.frequency
      const day = weekdayLabel(schedule.day)
      const when = `${frequency} on ${day}s at ${schedule.startTime}`
      return schedule.notes ? `${when}. ${schedule.notes}` : when
    })
    .join('; ')
}

function firstSocialUrl(
  links: Array<{ platform: string; url: string }> | null | undefined,
  platform: string,
): string | undefined {
  return links?.find((link) => link.platform === platform)?.url
}

/**
 * Site settings from Sanity, with fixture values filling any field the document has
 * not been given yet.
 *
 * Navigation is not in the schema — it is information architecture, not editorial
 * content — so it always comes from the fixture. Everything else prefers CMS.
 */
export function mapSiteSettings(
  data: SiteSettingsQueryResult,
  fallback: SiteSettings,
): SiteSettings {
  if (!data || !data.name || !data.shortName) return fallback

  const address = data.address?.street
    ? {
        street: data.address.street,
        city: pick(data.address.city, fallback.address.city),
        state: pick(data.address.state, fallback.address.state),
        postalCode: pick(data.address.postalCode, fallback.address.postalCode),
        latitude: data.address.latitude ?? fallback.address.latitude,
        longitude: data.address.longitude ?? fallback.address.longitude,
        mapUrl: pick(data.address.mapUrl, fallback.address.mapUrl),
        directions: pick(data.address.drivingNotes, fallback.address.directions),
      }
    : fallback.address

  const serviceTimes =
    data.serviceTimes && data.serviceTimes.length > 0
      ? data.serviceTimes.map((service) => ({
          label: service.label,
          day: weekdayLabel(service.day),
          startTime: service.startTime,
          endTime: service.endTime ?? undefined,
          note: service.notes ?? undefined,
          isPrimary: service.isPrimary ?? false,
        }))
      : fallback.serviceTimes

  return {
    name: data.name,
    shortName: data.shortName,
    tagline: pick(data.tagline, fallback.tagline),
    mission: pick(data.missionStatement, fallback.mission),
    serviceTimes,
    address,
    phone: pick(data.phone, fallback.phone),
    email: pick(data.email, fallback.email),
    givingUrl: pick(data.givingUrl, fallback.givingUrl),
    youtubeUrl:
      data.youtubeChannelUrl ?? firstSocialUrl(data.socialLinks, 'youtube') ?? fallback.youtubeUrl,
    facebookUrl: firstSocialUrl(data.socialLinks, 'facebook') ?? fallback.facebookUrl,
    isLive: data.isLive ?? false,
    livestreamUrl: data.livestreamUrl ?? fallback.livestreamUrl,
    primaryNav: fallback.primaryNav,
  }
}

export interface HomePageChapterVisibility {
  thisSabbath: boolean
  belong: boolean
  ministries: boolean
  events: boolean
  story: boolean
  watch: boolean
  prayer: boolean
  hope: boolean
  invitation: boolean
}

export interface MappedHomePage {
  content: HomePageContent
  sabbathProgram: SabbathProgram | null
  ministries: Ministry[]
  upcomingEvents: ChurchEvent[]
  visible: HomePageChapterVisibility
}

function mapSabbathProgram(
  program: NonNullable<NonNullable<NonNullable<HomePageQueryResult>['thisSabbath']>['program']>,
): SabbathProgram {
  return {
    date: program.date,
    sermonTitle: program.sermonTitle,
    speakerName: program.speakerName ?? 'Guest speaker',
    speakerRole: program.speakerRole ?? undefined,
    scripture: mapScripture(program.scripture),
    sermonSummary: program.sermonSummary ?? '',
    sabbathSchoolTime: program.sabbathSchoolTime ?? '9:30 AM',
    worshipTime: program.worshipTime ?? '10:45 AM',
    image: mapImage(program.image) ?? sabbathSpeakerPortrait,
    isSpecialService: program.isSpecialService ?? undefined,
    specialServiceLabel: program.specialServiceLabel ?? undefined,
  }
}

export function mapSermon(sermon: {
  title: string
  slug: string
  date: string
  speakerName: string | null
  youtubeUrl: string
  duration: string | null
  thumbnail: ProjectedImage | null
  scripture?: Array<{
    reference: string | null
    translation: ScriptureRef['translation'] | null
    text?: string | null
  }> | null
}): Sermon {
  return withYouTubePoster({
    title: sermon.title,
    slug: sermon.slug,
    date: sermon.date,
    speakerName: sermon.speakerName ?? 'Guest speaker',
    scripture: mapScripture(sermon.scripture),
    youtubeUrl: sermon.youtubeUrl,
    duration: sermon.duration ?? undefined,
    thumbnail: mapImage(sermon.thumbnail),
  })
}

/**
 * Homepage from Sanity, with fixture copy filling any chapter that has not been
 * written yet.
 *
 * Two rules keep this from becoming a quietly-wrong page:
 *
 * 1. A missing singleton means the whole fixture page. We do not mix a half-published
 *    document with last week's sermon titles.
 * 2. Once the singleton exists, live lists (events, ministries, the Sabbath program)
 *    are whatever the CMS returned — including empty. Inventing a fellowship lunch
 *    that is not on the calendar is worse than showing the weekly rhythm fallback.
 */
export function mapHomePage(
  data: HomePageQueryResult,
  fallback: {
    content: HomePageContent
    sabbathProgram: SabbathProgram
    ministries: Ministry[]
    upcomingEvents: ChurchEvent[]
  },
): MappedHomePage {
  if (!data) {
    return {
      content: fallback.content,
      sabbathProgram: fallback.sabbathProgram,
      ministries: fallback.ministries,
      upcomingEvents: fallback.upcomingEvents,
      visible: {
        thisSabbath: true,
        belong: true,
        ministries: true,
        events: true,
        story: true,
        watch: true,
        prayer: true,
        hope: true,
        invitation: true,
      },
    }
  }

  const heroImage = mapImage(data.arrival?.heroImage)
  const belongPlates =
    data.belong?.plates && data.belong.plates.length > 0
      ? data.belong.plates.map((plate, index) => {
          const fallbackPlate = fallback.content.belong.plates[index]
          const image = mapImage(plate) ?? fallbackPlate?.image
          return {
            description: image?.alt ?? plate.alt ?? fallbackPlate?.description ?? '',
            caption: image?.caption ?? plate.caption ?? fallbackPlate?.caption,
            image,
          }
        })
      : fallback.content.belong.plates

  const cmsMinistries = (data.ministries?.featured ?? []).flatMap((ministry, index) => {
    if (!ministry.slug) return []
    const tone: MinistryTone = TONES.has(ministry.tone as MinistryTone)
      ? (ministry.tone as MinistryTone)
      : 'neutral'
    const switcherImage =
      mapImage(ministry.switcherImage) ??
      (ministry.slug === 'pathfinders'
        ? flagshipPhotos.pathfinders.hero
        : ministry.slug === 'adventurers'
          ? flagshipPhotos.adventurers.hero
          : undefined)

    return [
      {
        name: ministry.name,
        slug: ministry.slug,
        shortDescription: ministry.shortDescription,
        ageRange: ministry.ageRange ?? '',
        meetingSchedule: formatMeetingSchedule(ministry.meetingSchedules) ?? '',
        switcherImage,
        heroImage: switcherImage,
        tone,
        order: index + 1,
      } satisfies Ministry,
    ]
  })

  const cmsEvents = (data.events?.upcoming ?? []).map((event) => ({
    title: event.title,
    slug: event.slug,
    shortDescription: event.shortDescription,
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime ?? undefined,
    isAllDay: event.isAllDay ?? undefined,
    atChurch: event.atChurch ?? true,
    locationName: event.locationName ?? undefined,
    ministryName: event.ministryName ?? undefined,
    image: mapImage(event.image),
  }))

  const eventCount = data.events?.count ?? 4
  const storyParagraphs = portableTextToParagraphs(data.story?.body)
  const pastorImage = mapImage(data.story?.pastor?.image)
  const featuredSermon = data.watch?.featured
    ? mapSermon(data.watch.featured)
    : fallback.content.watch.featured
  const recentSermons = (data.watch?.recent ?? [])
    .filter((sermon) => sermon.slug !== featuredSermon?.slug)
    .slice(0, 3)
    .map((sermon) => mapSermon(sermon))

  const prayerBody = data.prayer?.invitation
    ? data.prayer.invitation
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : fallback.content.prayer.body

  return {
    visible: {
      thisSabbath: isVisible(data.thisSabbath?.isVisible),
      belong: isVisible(data.belong?.isVisible),
      ministries: isVisible(data.ministries?.isVisible),
      events: isVisible(data.events?.isVisible),
      story: isVisible(data.story?.isVisible),
      watch: isVisible(data.watch?.isVisible),
      prayer: isVisible(data.prayer?.isVisible),
      hope: isVisible(data.hope?.isVisible),
      invitation: isVisible(data.invitation?.isVisible),
    },
    sabbathProgram: data.thisSabbath?.program
      ? mapSabbathProgram(data.thisSabbath.program)
      : data.thisSabbath
        ? null
        : fallback.sabbathProgram,
    ministries: cmsMinistries.length > 0 ? cmsMinistries : fallback.ministries,
    upcomingEvents: data.events ? cmsEvents.slice(0, eventCount) : fallback.upcomingEvents,
    content: {
      arrival: {
        headline: pick(data.arrival?.headline, fallback.content.arrival.headline),
        subhead: pick(data.arrival?.subhead, fallback.content.arrival.subhead),
        hero: {
          description: fallback.content.arrival.hero.description,
          image: heroImage ?? fallback.content.arrival.hero.image,
        },
      },
      belong: {
        headline: pick(data.belong?.headline, fallback.content.belong.headline),
        body: pick(data.belong?.body, fallback.content.belong.body),
        plates: belongPlates,
        testimonial: data.belong?.testimonial
          ? {
              quote: data.belong.testimonial.quote,
              personName: data.belong.testimonial.personName ?? '',
              personContext: data.belong.testimonial.personContext ?? '',
              image: mapImage(data.belong.testimonial.image),
            }
          : fallback.content.belong.testimonial,
      },
      story: {
        plate: {
          description: mapImage(data.story?.plate)?.alt ?? fallback.content.story.plate.description,
          caption: mapImage(data.story?.plate)?.caption,
          image: mapImage(data.story?.plate) ?? fallback.content.story.plate.image,
        },
        paragraphs:
          storyParagraphs.length > 0 ? storyParagraphs : fallback.content.story.paragraphs,
        pastor: data.story?.pastor
          ? {
              name: data.story.pastor.name,
              slug: data.story.pastor.slug,
              role: data.story.pastor.role,
              image: pastorImage,
            }
          : fallback.content.story.pastor,
        pastorPortrait: {
          description: pastorImage?.alt ?? fallback.content.story.pastorPortrait.description,
          image: pastorImage ?? fallback.content.story.pastorPortrait.image,
        },
      },
      watch: {
        headline: pick(data.watch?.headline, fallback.content.watch.headline),
        featured: featuredSermon,
        recent: recentSermons.length > 0 ? recentSermons : fallback.content.watch.recent,
      },
      prayer: {
        headline: pick(data.prayer?.headline, fallback.content.prayer.headline),
        body: prayerBody,
        plate: fallback.content.prayer.plate,
      },
      hope: {
        scripture: pick(data.hope?.scripture.text, fallback.content.hope.scripture),
        reference: pick(data.hope?.scripture.reference, fallback.content.hope.reference),
        translation: pick(data.hope?.scripture.translation, fallback.content.hope.translation),
      },
      invitation: {
        headline: pick(data.invitation?.headline, fallback.content.invitation.headline),
        whatToExpect:
          data.invitation?.whatToExpect && data.invitation.whatToExpect.length > 0
            ? data.invitation.whatToExpect
            : fallback.content.invitation.whatToExpect,
        parking: fallback.content.invitation.parking,
        entrance: fallback.content.invitation.entrance,
      },
    },
  }
}
