'use client'

import Image from 'next/image'
import { useState } from 'react'

import { youtubeEmbedUrl, youtubeThumbnail } from '@/lib/youtube'
import type { ContentImage } from '@/types/content'

interface YouTubeEmbedProps {
  videoId: string
  title: string
  poster?: ContentImage
  /** Set when this frame is the first thing on the page, so the poster is not lazy. */
  priority?: boolean
  /** The rendered width, for next/image. Defaults to the watch pages' wide column. */
  sizes?: string
}

/**
 * Facade player: a poster until the visitor asks for the sermon.
 *
 * YouTube's iframe is several hundred kilobytes and a third-party cookie context.
 * A listing of messages must not pay that cost twelve times, and the privacy default
 * is that `youtube-nocookie.com` is contacted only after a click or Enter.
 */
export function YouTubeEmbed({
  videoId,
  title,
  poster,
  priority = false,
  sizes = '(min-width: 1024px) 60vw, 100vw',
}: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const frame = poster ?? youtubeThumbnail(videoId, title)

  if (isPlaying) {
    return (
      <div className="relative aspect-video overflow-hidden bg-ink">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          src={`${youtubeEmbedUrl(videoId)}?autoplay=1&rel=0`}
          title={title}
        />
      </div>
    )
  }

  return (
    <button
      aria-label={`Play ${title}`}
      className="group relative block aspect-video w-full overflow-hidden bg-paper-deep text-left"
      onClick={() => setIsPlaying(true)}
      type="button"
    >
      <Image
        alt={frame.alt}
        className="object-cover"
        fill
        priority={priority}
        sizes={sizes}
        src={frame.src}
      />
      <span
        aria-hidden="true"
        className="sermon-frame-play absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-dawn text-paper"
      >
        ▶
      </span>
    </button>
  )
}
