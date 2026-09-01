import type { ContentImage } from '@/types/content'

/**
 * Matches the YouTube URL shapes people actually paste: the address bar form, the
 * Share-button short form, the embed form, and Shorts. Captures the eleven-character
 * video id in each.
 *
 * Lives here rather than in a Sanity schema file so server components and the Studio
 * can share one check without the public site importing schema modules.
 */
export const YOUTUBE_URL_PATTERN =
  /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([\w-]{11})/

export const YOUTUBE_VIDEO_ID_PATTERN = /^[\w-]{11}$/

const YOUTUBE_CHANNEL_ID_PATTERN = /UC[\w-]{22}/

/** Slug prefix for sermons that come from the channel feed rather than Studio. */
export const CHANNEL_SERMON_SLUG_PREFIX = 'yt-'

/** Pulls the video id out of any accepted YouTube URL, or `null` if there isn't one. */
export function extractYouTubeId(url: string | undefined): string | null {
  if (!url) return null
  return YOUTUBE_URL_PATTERN.exec(url)?.[1] ?? null
}

export function isYouTubeVideoId(value: string): boolean {
  return YOUTUBE_VIDEO_ID_PATTERN.test(value)
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`
}

export function youtubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export function channelSermonSlug(videoId: string): string {
  return `${CHANNEL_SERMON_SLUG_PREFIX}${videoId}`
}

export function videoIdFromChannelSlug(slug: string): string | null {
  if (!slug.startsWith(CHANNEL_SERMON_SLUG_PREFIX)) return null
  const videoId = slug.slice(CHANNEL_SERMON_SLUG_PREFIX.length)
  return isYouTubeVideoId(videoId) ? videoId : null
}

/**
 * YouTube's own poster, used when Studio has not supplied a custom thumbnail.
 *
 * This is not church photography and is not stored in Sanity, so it does not go
 * through the production placeholder check. The provenance is recorded so a later
 * audit can still tell a pulpit photograph from a video frame.
 */
export function youtubeThumbnail(videoId: string, title: string): ContentImage {
  return {
    src: youtubeThumbnailUrl(videoId),
    alt: `Video poster for ${title}`,
    width: 480,
    height: 360,
    provenance: 'youtube-thumbnail',
    credit: 'YouTube',
  }
}

export function withYouTubePoster<
  T extends { youtubeUrl: string; title: string; thumbnail?: ContentImage },
>(sermon: T): T {
  if (sermon.thumbnail) return sermon
  const videoId = extractYouTubeId(sermon.youtubeUrl)
  if (!videoId) return sermon
  return { ...sermon, thumbnail: youtubeThumbnail(videoId, sermon.title) }
}

/** Channel id (`UC…`) from a channel, handle, or custom URL, when the URL itself carries one. */
export function extractYouTubeChannelId(url: string | undefined): string | null {
  if (!url) return null
  const fromPath = /youtube\.com\/channel\/(UC[\w-]{22})/i.exec(url)
  if (fromPath?.[1]) return fromPath[1]
  const any = YOUTUBE_CHANNEL_ID_PATTERN.exec(url)
  return any?.[0] ?? null
}

export function youtubeHandleFromUrl(url: string | undefined): string | null {
  if (!url) return null
  const match = /youtube\.com\/@([\w.-]+)/i.exec(url)
  return match?.[1] ? `@${match[1]}` : null
}

/**
 * Training, Sabbath School lessons, and club recaps live on the same channel as the
 * divine-hour message. A blind "latest upload" would often be the wrong video.
 */
export function isLikelySabbathSermon(title: string): boolean {
  if (
    /medical missionary|sabbath school|vacation bible|\bvbs\b|pathfinder|adventurer|concert|training/i.test(
      title,
    )
  ) {
    return false
  }

  return /pastor|\bpr\.|sermon|worship|divine hour/i.test(title)
}

/**
 * Channel titles look like `Life In The Spirit | Pastor London Lee | #hashtag`.
 * The first clause is the message; the speaker clause is kept when it is one.
 */
export function parseChannelSermonTitle(rawTitle: string): { title: string; speakerName: string } {
  const cleaned = rawTitle
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
    .replace(/\s*#[\w]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const pipeParts = cleaned
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
  const speakerFromPipe = pipeParts[1]
  if (pipeParts[0] && speakerFromPipe && /pastor|\bpr\./i.test(speakerFromPipe)) {
    return { title: pipeParts[0], speakerName: speakerFromPipe }
  }

  const dashParts = cleaned.split(/\s+-\s+/).map((part) => part.trim())
  const speakerFromDash = dashParts.at(-1)
  if (dashParts.length >= 2 && speakerFromDash && /pastor|\bpr\./i.test(speakerFromDash)) {
    return {
      title: dashParts.slice(0, -1).join(' - '),
      speakerName: speakerFromDash,
    }
  }

  return { title: cleaned || rawTitle, speakerName: 'SD Clairemont SDA' }
}
