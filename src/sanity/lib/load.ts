import { cache } from 'react'
import 'server-only'

import { leadership as fixtureLeadership } from '@/content/leadership'
import {
  homePage as fixtureHomePage,
  ministries as fixtureMinistries,
  sabbathProgram as fixtureSabbathProgram,
  upcomingEvents as fixtureUpcomingEvents,
} from '@/content/home-page'
import { prophecyPage as fixtureProphecyPage } from '@/content/prophecy'
import { getEditorialFixture, RESERVED_PAGE_SLUGS } from '@/content/pages'
import { siteSettings as fixtureSiteSettings } from '@/content/site-settings'
import { getChurchQueryParams } from '@/lib/sabbath'
import {
  getChannelSermonBySlug,
  getChannelSermons,
  mergeSermonArchive,
  resolveWatchChapter,
} from '@/lib/youtube-feed'
import { homePageQuery } from '@/sanity/queries/home'
import { siteSettingsQuery } from '@/sanity/queries/settings'
import {
  eventBySlugQuery,
  eventSlugsQuery,
  pastEventsQuery,
  upcomingEventsQuery,
} from '@/sanity/queries/events'
import {
  ministriesQuery,
  ministryBySlugQuery,
  ministrySlugsQuery,
} from '@/sanity/queries/ministries'
import { currentSabbathProgramQuery, latestPastSabbathProgramQuery } from '@/sanity/queries/sabbath'
import { leadershipQuery, pageBySlugQuery, pageSlugsQuery } from '@/sanity/queries/pages'
import { prophecyPageQuery } from '@/sanity/queries/prophecy'
import { recentSermonsQuery, sermonBySlugQuery, sermonSlugsQuery } from '@/sanity/queries/sermons'
import type {
  ChurchEvent,
  EditorialPage,
  EventDetail,
  Leader,
  Ministry,
  MinistryDetail,
  ProphecyPageContent,
  SabbathProgram,
  Sermon,
  SermonDetail,
  SiteSettings,
} from '@/types/content'
import type {
  CurrentSabbathProgramQueryResult,
  EventBySlugQueryResult,
  EventSlugsQueryResult,
  HomePageQueryResult,
  LatestPastSabbathProgramQueryResult,
  LeadershipQueryResult,
  MinistriesQueryResult,
  MinistryBySlugQueryResult,
  MinistrySlugsQueryResult,
  PageBySlugQueryResult,
  PageSlugsQueryResult,
  PastEventsQueryResult,
  ProphecyPageQueryResult,
  RecentSermonsQueryResult,
  SermonBySlugQueryResult,
  SermonSlugsQueryResult,
  SiteSettingsQueryResult,
  UpcomingEventsQueryResult,
} from '../../../sanity.types'

import { sanityFetch } from './fetch'
import { mapProphecyPage } from './map-prophecy'
import {
  mapEditorialPage,
  mapEventCard,
  mapEventDetail,
  mapLeaders,
  mapMinistryCard,
  mapMinistryDetail,
  mapSabbathDetail,
  mapSermonCards,
  mapSermonDetail,
} from './map-routes'
import { mapHomePage, mapSiteSettings, type MappedHomePage } from './mappers'

export interface HomePageBundle extends MappedHomePage {
  settings: SiteSettings
}

const SETTINGS_TAGS = ['siteSettings']
const HOME_TAGS = [
  'homePage',
  'siteSettings',
  'sabbathProgram',
  'event',
  'ministry',
  'sermon',
  'testimonial',
  'person',
]

const EVENT_LIMIT = 24
const SERMON_LIMIT = 24

/**
 * Site settings for the public shell.
 *
 * Wrapped in React `cache` so the layout and the homepage share one result per
 * request rather than issuing the query twice. Fixtures are the source when Sanity
 * is unconfigured, when the singleton has not been created, or when the request fails.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const data = await sanityFetch<SiteSettingsQueryResult, Record<string, never>>({
    query: siteSettingsQuery,
    tags: SETTINGS_TAGS,
  })

  return mapSiteSettings(data, fixtureSiteSettings)
})

/**
 * The homepage, in one GROQ round trip, mapped onto the shapes the chapters already
 * accept.
 *
 * Components do not call this. The route does, once, and passes the result down —
 * which is what lets a later chapter swap happen without any section learning about
 * Sanity.
 */
export const getHomePage = cache(async (): Promise<HomePageBundle> => {
  const params = getChurchQueryParams()
  const [settings, data] = await Promise.all([
    getSiteSettings(),
    sanityFetch<HomePageQueryResult, typeof params>({
      query: homePageQuery,
      params,
      tags: HOME_TAGS,
    }),
  ])

  const mapped = mapHomePage(data, {
    content: fixtureHomePage,
    sabbathProgram: fixtureSabbathProgram,
    ministries: fixtureMinistries,
    upcomingEvents: fixtureUpcomingEvents,
  })
  const sermons = await getSermons()

  return {
    settings,
    ...mapped,
    content: {
      ...mapped.content,
      watch: resolveWatchChapter(mapped.content.watch, sermons),
    },
  }
})

export const getSabbathProgram = cache(async (): Promise<SabbathProgram> => {
  const { today } = getChurchQueryParams()
  const params = { today }

  const [current, past] = await Promise.all([
    sanityFetch<CurrentSabbathProgramQueryResult, typeof params>({
      query: currentSabbathProgramQuery,
      params,
      tags: ['sabbathProgram'],
    }),
    sanityFetch<LatestPastSabbathProgramQueryResult, typeof params>({
      query: latestPastSabbathProgramQuery,
      params,
      tags: ['sabbathProgram'],
    }),
  ])

  if (current) return mapSabbathDetail(current, false)
  if (past) return mapSabbathDetail(past, true)
  return fixtureSabbathProgram
})

export const getUpcomingEvents = cache(async (): Promise<ChurchEvent[]> => {
  const params = { ...getChurchQueryParams(), limit: EVENT_LIMIT }
  const data = await sanityFetch<UpcomingEventsQueryResult, typeof params>({
    query: upcomingEventsQuery,
    params,
    tags: ['event'],
  })

  if (data && data.length > 0) return data.map(mapEventCard)
  return fixtureUpcomingEvents
})

export const getPastEvents = cache(async (): Promise<ChurchEvent[]> => {
  const params = { ...getChurchQueryParams(), limit: EVENT_LIMIT }
  const data = await sanityFetch<PastEventsQueryResult, typeof params>({
    query: pastEventsQuery,
    params,
    tags: ['event'],
  })

  return (data ?? []).map(mapEventCard)
})

export const getEventBySlug = cache(async (slug: string): Promise<EventDetail | null> => {
  const data = await sanityFetch<EventBySlugQueryResult, { slug: string }>({
    query: eventBySlugQuery,
    params: { slug },
    tags: ['event', `event:${slug}`],
  })

  if (data) return mapEventDetail(data)

  const fixture = fixtureUpcomingEvents.find((event) => event.slug === slug)
  return fixture ? { ...fixture, description: [fixture.shortDescription] } : null
})

export const getEventSlugs = cache(async (): Promise<string[]> => {
  const data = await sanityFetch<EventSlugsQueryResult, Record<string, never>>({
    query: eventSlugsQuery,
    tags: ['event'],
    publishedOnly: true,
  })

  return unique([...(data ?? []), ...fixtureUpcomingEvents.map((event) => event.slug)])
})

export const getMinistries = cache(async (): Promise<Ministry[]> => {
  const data = await sanityFetch<MinistriesQueryResult, Record<string, never>>({
    query: ministriesQuery,
    tags: ['ministry'],
  })

  const mapped = (data ?? []).flatMap((ministry, index) => {
    const card = mapMinistryCard(ministry, index)
    return card ? [card] : []
  })

  return mapped.length > 0 ? mapped : fixtureMinistries
})

export const getMinistryBySlug = cache(async (slug: string): Promise<MinistryDetail | null> => {
  const data = await sanityFetch<MinistryBySlugQueryResult, { slug: string }>({
    query: ministryBySlugQuery,
    params: { slug },
    tags: ['ministry', `ministry:${slug}`],
  })

  if (data) return mapMinistryDetail(data)

  const fixture = fixtureMinistries.find((ministry) => ministry.slug === slug)
  return fixture ? { ...fixture, description: [fixture.shortDescription] } : null
})

export const getMinistrySlugs = cache(async (): Promise<string[]> => {
  const data = await sanityFetch<MinistrySlugsQueryResult, Record<string, never>>({
    query: ministrySlugsQuery,
    tags: ['ministry'],
    publishedOnly: true,
  })

  return unique([...(data ?? []), ...fixtureMinistries.map((ministry) => ministry.slug)])
})

export const getSermons = cache(async (): Promise<Sermon[]> => {
  const params = { limit: SERMON_LIMIT }
  const [data, settings] = await Promise.all([
    sanityFetch<RecentSermonsQueryResult, typeof params>({
      query: recentSermonsQuery,
      params,
      tags: ['sermon'],
    }),
    getSiteSettings(),
  ])

  const fromStudio = mapSermonCards(data ?? [])
  const fromChannel = await getChannelSermons(settings.youtubeUrl)
  return mergeSermonArchive(fromStudio, fromChannel).slice(0, SERMON_LIMIT)
})

export const getSermonBySlug = cache(async (slug: string): Promise<SermonDetail | null> => {
  const data = await sanityFetch<SermonBySlugQueryResult, { slug: string }>({
    query: sermonBySlugQuery,
    params: { slug },
    tags: ['sermon', `sermon:${slug}`],
  })

  if (data) return mapSermonDetail(data)

  const settings = await getSiteSettings()
  return getChannelSermonBySlug(slug, settings.youtubeUrl)
})

export const getSermonSlugs = cache(async (): Promise<string[]> => {
  const [data, settingsData] = await Promise.all([
    sanityFetch<SermonSlugsQueryResult, Record<string, never>>({
      query: sermonSlugsQuery,
      tags: ['sermon'],
      publishedOnly: true,
    }),
    sanityFetch<SiteSettingsQueryResult, Record<string, never>>({
      query: siteSettingsQuery,
      tags: SETTINGS_TAGS,
      publishedOnly: true,
    }),
  ])

  const settings = mapSiteSettings(settingsData, fixtureSiteSettings)
  const fromChannel = await getChannelSermons(settings.youtubeUrl)
  return unique([...(data ?? []), ...fromChannel.map((sermon) => sermon.slug)])
})

export const getPageBySlug = cache(async (slug: string): Promise<EditorialPage | null> => {
  const data = await sanityFetch<PageBySlugQueryResult, { slug: string }>({
    query: pageBySlugQuery,
    params: { slug },
    tags: ['page', `page:${slug}`],
  })

  if (data) return mapEditorialPage(data)
  return getEditorialFixture(slug) ?? null
})

export const getFlexiblePageSlugs = cache(async (): Promise<string[]> => {
  const data = await sanityFetch<PageSlugsQueryResult, Record<string, never>>({
    query: pageSlugsQuery,
    tags: ['page'],
    publishedOnly: true,
  })

  return (data ?? []).filter((slug) => !RESERVED_PAGE_SLUGS.has(slug) && !slug.includes('/'))
})

export const getProphecyPage = cache(async (): Promise<ProphecyPageContent> => {
  const data = await sanityFetch<ProphecyPageQueryResult, Record<string, never>>({
    query: prophecyPageQuery,
    tags: ['prophecyPage'],
  })

  const mapped = data ? mapProphecyPage(data) : null
  return mapped ?? fixtureProphecyPage
})

export const getLeadership = cache(async (): Promise<Leader[]> => {
  const data = await sanityFetch<LeadershipQueryResult, Record<string, never>>({
    query: leadershipQuery,
    tags: ['person'],
  })

  if (data && data.length > 0) return mergeLeadership(mapLeaders(data), fixtureLeadership)
  return fixtureLeadership
})

/**
 * CMS people win when they have a photograph or a written bio. Fixture pastors
 * still appear when Studio has not caught up — so a new associate pastor is on
 * the page as soon as the fixture is, not only after a seed.
 */
function mergeLeadership(fromCms: Leader[], fixtures: Leader[]): Leader[] {
  const bySlug = new Map(fromCms.map((person) => [person.slug, person]))

  for (const fixture of fixtures) {
    const existing = bySlug.get(fixture.slug)
    if (!existing) {
      bySlug.set(fixture.slug, fixture)
      continue
    }

    const fixtureBio = fixture.bio ?? []
    const cmsBio = existing.bio ?? []

    bySlug.set(fixture.slug, {
      ...existing,
      image: existing.image ?? fixture.image,
      bio: fixtureBio.length > cmsBio.length ? fixtureBio : cmsBio.length > 0 ? cmsBio : fixtureBio,
    })
  }

  const fixtureSlugs = fixtures.map((person) => person.slug)
  const extraSlugs = [...bySlug.keys()].filter((slug) => !fixtureSlugs.includes(slug))
  return [...fixtureSlugs, ...extraSlugs]
    .map((slug) => bySlug.get(slug))
    .filter((person): person is Leader => Boolean(person))
}

function unique(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
}
