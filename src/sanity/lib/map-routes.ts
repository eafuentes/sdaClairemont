import type {
  CurrentSabbathProgramQueryResult,
  EventBySlugQueryResult,
  LeadershipQueryResult,
  LatestPastSabbathProgramQueryResult,
  MinistriesQueryResult,
  MinistryBySlugQueryResult,
  PageBySlugQueryResult,
  RecentSermonsQueryResult,
  SermonBySlugQueryResult,
  UpcomingEventsQueryResult,
} from '../../../sanity.types'
import type {
  ChurchEvent,
  EditorialBlock,
  EditorialPage,
  EventDetail,
  Leader,
  Ministry,
  MinistryDetail,
  MinistryTone,
  SabbathProgram,
  Sermon,
  SermonDetail,
} from '@/types/content'

import { flagshipPhotos } from '@/content/flagship'
import { sabbathSpeakerPortrait } from '@/content/home-page'

import { mapImage, type ProjectedImage } from './image'
import { formatMeetingSchedule, mapScripture, mapSermon, portableTextToParagraphs } from './mappers'

const TONES: ReadonlySet<MinistryTone> = new Set(['warm', 'cool', 'neutral'])

function toneOf(value: string | null | undefined): MinistryTone {
  return TONES.has(value as MinistryTone) ? (value as MinistryTone) : 'neutral'
}

function clubPhotograph(slug: string) {
  if (slug === 'pathfinders') return flagshipPhotos.pathfinders.hero
  if (slug === 'adventurers') return flagshipPhotos.adventurers.hero
  return undefined
}

function hrefFromLink(
  link: { kind?: string; externalUrl?: string | null } | null | undefined,
): string | undefined {
  if (!link) return undefined
  if (link.kind === 'external' && link.externalUrl) return link.externalUrl
  return undefined
}

export function mapEventCard(
  event: UpcomingEventsQueryResult[number] | NonNullable<UpcomingEventsQueryResult>[number],
): ChurchEvent {
  return {
    title: event.title,
    slug: event.slug,
    shortDescription: event.shortDescription,
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime ?? undefined,
    isAllDay: event.isAllDay ?? undefined,
    atChurch: event.atChurch ?? true,
    locationName: event.locationName ?? undefined,
    ministryName: event.ministryName ?? undefined,
    ministrySlug: event.ministrySlug ?? undefined,
    image: mapImage(event.image),
    registrationUrl: event.registrationUrl ?? undefined,
  }
}

export function mapEventDetail(event: NonNullable<EventBySlugQueryResult>): EventDetail {
  return {
    title: event.title,
    slug: event.slug,
    shortDescription: event.shortDescription,
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime ?? undefined,
    isAllDay: event.isAllDay ?? undefined,
    atChurch: event.atChurch ?? true,
    locationName: event.locationName ?? undefined,
    locationAddress: event.locationAddress ?? undefined,
    locationMapUrl: event.locationMapUrl ?? undefined,
    ministryName: event.ministry?.name,
    ministrySlug: event.ministry?.slug,
    image: mapImage(event.image),
    registrationUrl: event.registrationUrl ?? undefined,
    cost: event.cost ?? undefined,
    ageRange: event.ageRange ?? undefined,
    description: portableTextToParagraphs(event.description),
    contact: event.contact
      ? {
          name: event.contact.name,
          role: event.contact.role,
          email: event.contact.email ?? undefined,
          phone: event.contact.phone ?? undefined,
        }
      : undefined,
  }
}

export function mapMinistryCard(
  ministry: MinistriesQueryResult[number],
  index: number,
): Ministry | null {
  if (!ministry.slug) return null

  const switcherImage = mapImage(ministry.switcherImage) ?? clubPhotograph(ministry.slug)

  return {
    name: ministry.name,
    slug: ministry.slug,
    shortDescription: ministry.shortDescription,
    ageRange: ministry.ageRange ?? '',
    meetingSchedule: formatMeetingSchedule(ministry.meetingSchedules) ?? '',
    switcherImage,
    heroImage: switcherImage,
    tone: toneOf(ministry.tone),
    order: ministry.order ?? index + 1,
  }
}

export function mapMinistryDetail(
  ministry: NonNullable<MinistryBySlugQueryResult>,
): MinistryDetail {
  const switcherImage = mapImage(ministry.switcherImage) ?? clubPhotograph(ministry.slug ?? '')
  const heroImage = mapImage(ministry.heroImage) ?? switcherImage

  return {
    name: ministry.name,
    slug: ministry.slug,
    shortDescription: ministry.shortDescription,
    ageRange: ministry.ageRange ?? '',
    meetingSchedule: formatMeetingSchedule(ministry.meetingSchedules) ?? '',
    tone: toneOf(ministry.tone),
    order: 0,
    switcherImage,
    heroImage,
    description: portableTextToParagraphs(ministry.description),
    registrationUrl: ministry.registrationUrl ?? undefined,
    hasPathfinderDetails: ministry.hasPathfinderDetails ?? undefined,
    leaders: (ministry.leaders ?? []).map((leader) => ({
      name: leader.name,
      slug: leader.slug,
      role: leader.role,
      image: mapImage(leader.image),
    })),
    resources: (ministry.resources ?? []).flatMap((resource) => {
      const href = resource.url ?? resource.fileUrl
      if (!href) return []
      return [
        {
          title: resource.title,
          href,
          description: resource.description ?? undefined,
        },
      ]
    }),
    classes: (ministry.classes ?? []).map((entry) => ({
      name: entry.name,
      ageRange: entry.ageRange,
      description: entry.description ?? undefined,
    })),
    statistics: (ministry.statistics ?? []).map((entry) => ({
      value: entry.value,
      label: entry.label,
      description: entry.description ?? undefined,
    })),
    timeline: (ministry.timeline ?? []).flatMap((entry, index) => {
      const image = mapImage(entry.image)
      if (!image) return []
      return [
        {
          id: `${entry.title}-${entry.date}-${index}`,
          image,
          title: entry.title,
          date: entry.date,
          sentence: entry.description ?? undefined,
        },
      ]
    }),
  }
}

export function mapSermonDetail(sermon: NonNullable<SermonBySlugQueryResult>): SermonDetail {
  return {
    ...mapSermon(sermon),
    speakerRole: sermon.speakerRole ?? undefined,
    speakerImage: mapImage(sermon.speakerImage),
    description: sermon.description ?? undefined,
    notesUrl: sermon.notesUrl ?? undefined,
    ministryName: sermon.ministry?.name,
  }
}

export function mapSermonCards(sermons: RecentSermonsQueryResult): Sermon[] {
  return sermons.map((sermon) => mapSermon(sermon))
}

export function mapSabbathDetail(
  program: NonNullable<CurrentSabbathProgramQueryResult | LatestPastSabbathProgramQueryResult>,
  isPast: boolean,
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
    bulletinUrl: program.bulletinUrl ?? undefined,
    livestreamUrl: program.livestreamUrl ?? undefined,
    isSpecialService: program.isSpecialService ?? undefined,
    specialServiceLabel: program.specialServiceLabel ?? undefined,
    specialMusic: (program.specialMusic ?? [])
      .filter((entry) => entry.title)
      .map((entry) => ({ title: entry.title, performer: entry.performer ?? undefined })),
    announcements: (program.announcements ?? []).map((entry) => ({
      title: entry.title,
      body: portableTextToParagraphs(entry.body),
    })),
    isPast,
  }
}

export function mapLeaders(people: LeadershipQueryResult): Leader[] {
  return people.map((person) => ({
    name: person.name,
    slug: person.slug,
    role: person.role,
    image: mapImage(person.image),
    roleCategory: person.roleCategory ?? undefined,
    bio: portableTextToParagraphs(person.bio),
    email: person.email ?? undefined,
    phone: person.phone ?? undefined,
  }))
}

function typeName(entry: { _type: string }): string {
  return entry._type
}

function flattenBlockText(block: { children?: Array<{ text?: string }> }): string {
  return (block.children ?? [])
    .map((child) => child.text ?? '')
    .join('')
    .trim()
}

export function mapEditorialPage(page: NonNullable<PageBySlugQueryResult>): EditorialPage {
  const blocks: EditorialBlock[] = []
  let listBuffer: Extract<EditorialBlock, { type: 'list' }> | null = null

  const flushList = () => {
    if (listBuffer) {
      blocks.push(listBuffer)
      listBuffer = null
    }
  }

  for (const entry of page.content ?? []) {
    const type = typeName(entry)

    if (entry._type === 'block' && entry.listItem) {
      const text = flattenBlockText(entry)
      if (!text) continue
      const ordered = entry.listItem === 'number'
      if (listBuffer && listBuffer.ordered === ordered) {
        listBuffer.items.push(text)
      } else {
        flushList()
        listBuffer = { type: 'list', key: entry._key, ordered, items: [text] }
      }
      continue
    }

    flushList()

    if (type === 'imagePlate' || type === 'imageWithAlt') {
      const image = mapImage(entry as unknown as ProjectedImage)
      if (!image) continue
      blocks.push({ type: 'image', key: entry._key, image })
      continue
    }

    if (entry._type === 'block') {
      const text = flattenBlockText(entry)
      if (!text) continue
      const style = 'style' in entry ? String(entry.style ?? 'normal') : 'normal'
      if (style === 'h2' || style === 'h3') {
        blocks.push({
          type: 'heading',
          key: entry._key,
          text,
          level: style === 'h2' ? 2 : 3,
        })
      } else if (style === 'blockquote') {
        blocks.push({ type: 'quote', key: entry._key, text })
      } else {
        blocks.push({ type: 'paragraph', key: entry._key, text })
      }
      continue
    }

    if (type === 'scriptureRef' || type === 'scripture') {
      const scripture = entry as {
        _key: string
        reference?: string | null
        translation?: string | null
        text?: string | null
        book?: string
        chapter?: number
        verses?: string | null
      }
      const reference =
        scripture.reference ??
        (scripture.book && scripture.chapter
          ? `${scripture.book} ${scripture.chapter}${scripture.verses ? `:${scripture.verses}` : ''}`
          : undefined)
      if (!reference) continue
      blocks.push({
        type: 'scripture',
        key: scripture._key,
        reference,
        translation: scripture.translation ?? undefined,
        text: scripture.text ?? undefined,
      })
      continue
    }

    if (type === 'cta' || type === 'callToAction') {
      const cta = entry as {
        _key: string
        label: string
        link: { kind?: string; externalUrl?: string | null }
      }
      const href = hrefFromLink(cta.link)
      if (!href) continue
      blocks.push({
        type: 'cta',
        key: cta._key,
        label: cta.label,
        href,
        external: cta.link.kind === 'external',
      })
      continue
    }

    if (type === 'videoRef' || type === 'video') {
      const video = entry as { _key: string; url?: string; title?: string }
      if (!video.url) continue
      blocks.push({
        type: 'video',
        key: video._key,
        title: video.title ?? 'Watch',
        url: video.url,
      })
      continue
    }

    if (entry._type === 'accordion') {
      blocks.push({
        type: 'accordion',
        key: entry._key,
        heading: entry.heading,
        items: (entry.items ?? []).map((item) => ({
          question: item.question,
          answer: portableTextToParagraphs(item.answer),
        })),
      })
      continue
    }

    if (entry._type === 'linkList') {
      blocks.push({
        type: 'links',
        key: entry._key,
        heading: entry.heading,
        links: (entry.links ?? []).flatMap((item) => {
          const href = hrefFromLink(item.link)
          if (!href) return []
          return [{ label: item.label, href }]
        }),
      })
    }
  }

  flushList()

  return {
    title: page.title,
    slug: page.slug,
    intro: page.intro ?? undefined,
    hero: mapImage(page.heroImage),
    blocks,
  }
}
