import 'server-only'

import { cache } from 'react'

import type { HomePageContent, Sermon, SermonDetail } from '@/types/content'

import { getChurchPlainDate, getMostRecentSabbath } from './sabbath'
import {
  channelSermonSlug,
  extractYouTubeChannelId,
  extractYouTubeId,
  isLikelySabbathSermon,
  isYouTubeVideoId,
  parseChannelSermonTitle,
  videoIdFromChannelSlug,
  withYouTubePoster,
  youtubeHandleFromUrl,
  youtubeThumbnail,
  youtubeWatchUrl,
} from './youtube'

const FEED_REVALIDATE_SECONDS = 60 * 60
const FETCH_TIMEOUT_MS = 8_000

/**
 * The @SDClairemontSDA handle resolves to this channel id. YouTube's channel page
 * is too large to cache, so handle URLs are mapped here rather than scraped.
 * A `youtube.com/channel/UC…` URL in site settings always wins.
 */
const KNOWN_CHANNEL_IDS: Record<string, string> = {
  '@sdclairemontsda': 'UC55A732LJnjFVxCBXDwXYhA',
}

const REQUEST_HEADERS = {
  Accept: 'application/atom+xml, application/json, */*;q=0.8',
  'User-Agent':
    'ClairemontSDA-site/1.0 (sermon archive; +https://www.youtube.com/@SDClairemontSDA)',
}

interface ChannelVideo {
  videoId: string
  title: string
  published: string
  authorName: string
}

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
}

async function fetchText(url: string, revalidate: number): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: REQUEST_HEADERS,
      next: { revalidate, tags: ['youtube-feed'] },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!response.ok) return null
    return await response.text()
  } catch (error) {
    console.error('YouTube fetch failed.', { url, error })
    return null
  }
}

export const resolveYouTubeChannelId = cache(async (channelUrl: string): Promise<string | null> => {
  const fromUrl = extractYouTubeChannelId(channelUrl)
  if (fromUrl) return fromUrl

  const handle = youtubeHandleFromUrl(channelUrl)?.toLowerCase()
  return handle ? (KNOWN_CHANNEL_IDS[handle] ?? null) : null
})

function parseFeed(xml: string): ChannelVideo[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? []
  return entries.flatMap((entry) => {
    const videoId = decodeXml(/<yt:videoId>([^<]+)<\/yt:videoId>/.exec(entry)?.[1] ?? '')
    const title = decodeXml(/<title>([^<]+)<\/title>/.exec(entry)?.[1] ?? '')
    const published = /<published>([^<]+)<\/published>/.exec(entry)?.[1] ?? ''
    const authorName = decodeXml(
      /<author>[\s\S]*?<name>([^<]+)<\/name>[\s\S]*?<\/author>/.exec(entry)?.[1] ?? '',
    )
    if (!isYouTubeVideoId(videoId) || !title || !published) return []
    return [{ videoId, title, published, authorName }]
  })
}

function preachedDateFromUpload(published: string): string {
  const uploadDay = getChurchPlainDate(new Date(published))
  return getMostRecentSabbath(uploadDay)
}

function pickLatestSabbathVideos(videos: ChannelVideo[]): ChannelVideo[] {
  const sermons = videos.filter((video) => isLikelySabbathSermon(video.title))
  const first = sermons[0]
  if (!first) return []

  const latestSabbath = preachedDateFromUpload(first.published)
  const sameSabbath = sermons.filter(
    (video) => preachedDateFromUpload(video.published) === latestSabbath,
  )
  const english = sameSabbath.find((video) => /\|/.test(video.title) && /pastor/i.test(video.title))
  return english
    ? [english, ...sermons.filter((video) => video.videoId !== english.videoId)]
    : sermons
}

function sermonFromChannelVideo(video: ChannelVideo): Sermon {
  const parsed = parseChannelSermonTitle(video.title)
  return withYouTubePoster({
    title: parsed.title,
    slug: channelSermonSlug(video.videoId),
    date: preachedDateFromUpload(video.published),
    speakerName: parsed.speakerName,
    scripture: [],
    youtubeUrl: youtubeWatchUrl(video.videoId),
    thumbnail: youtubeThumbnail(video.videoId, parsed.title),
  })
}

export const getChannelSermons = cache(
  async (channelUrl: string | undefined): Promise<Sermon[]> => {
    if (!channelUrl) return []

    const channelId = await resolveYouTubeChannelId(channelUrl)
    if (!channelId) return []

    const xml = await fetchText(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      FEED_REVALIDATE_SECONDS,
    )
    if (!xml) return []

    return pickLatestSabbathVideos(parseFeed(xml)).map(sermonFromChannelVideo)
  },
)

interface YouTubeOEmbed {
  title?: string
  author_name?: string
  thumbnail_url?: string
}

export const getChannelSermonBySlug = cache(
  async (slug: string, channelUrl: string | undefined): Promise<SermonDetail | null> => {
    const fromFeed = (await getChannelSermons(channelUrl)).find((sermon) => sermon.slug === slug)
    if (fromFeed) return fromFeed

    const videoId = videoIdFromChannelSlug(slug)
    if (!videoId) return null

    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeWatchUrl(videoId))}&format=json`,
        {
          headers: REQUEST_HEADERS,
          next: { revalidate: FEED_REVALIDATE_SECONDS, tags: ['youtube-feed'] },
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        },
      )
      if (!response.ok) return null
      const embed = (await response.json()) as YouTubeOEmbed
      if (!embed.title) return null
      const parsed = parseChannelSermonTitle(embed.title)
      return withYouTubePoster({
        title: parsed.title,
        slug,
        date: new Date().toISOString().slice(0, 10),
        speakerName:
          parsed.speakerName === 'SD Clairemont SDA'
            ? (embed.author_name ?? parsed.speakerName)
            : parsed.speakerName,
        scripture: [],
        youtubeUrl: youtubeWatchUrl(videoId),
        thumbnail: youtubeThumbnail(videoId, parsed.title),
      })
    } catch (error) {
      console.error('YouTube oEmbed failed.', { videoId, error })
      return null
    }
  },
)

export function mergeSermonArchive(cms: Sermon[], channel: Sermon[]): Sermon[] {
  const seen = new Set<string>()
  const merged: Sermon[] = []

  for (const sermon of [...cms, ...channel]) {
    const videoId = extractYouTubeId(sermon.youtubeUrl)
    if (!videoId) continue
    if (seen.has(videoId)) continue
    seen.add(videoId)
    merged.push(withYouTubePoster(sermon))
  }

  return merged.sort((left, right) => right.date.localeCompare(left.date))
}

export function resolveWatchChapter(
  chapter: HomePageContent['watch'],
  archive: Sermon[],
): HomePageContent['watch'] {
  const cmsFeatured = extractYouTubeId(chapter.featured?.youtubeUrl) ? chapter.featured : undefined
  const featured = cmsFeatured ?? archive[0]
  if (!featured) {
    return { headline: chapter.headline, recent: [] }
  }

  return {
    headline: chapter.headline,
    featured,
    recent: archive.filter((sermon) => sermon.slug !== featured.slug).slice(0, 3),
  }
}
