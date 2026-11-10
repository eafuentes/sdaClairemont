import Image from 'next/image'
import Link from 'next/link'

import { YouTubeEmbed } from '@/components/watch/youtube-embed'
import { extractYouTubeId } from '@/lib/youtube'
import { cn } from '@/lib/utils'
import type { HomePageBundle } from '@/sanity/lib/load'

/**
 * The latest message as a frame you can press.
 *
 * The poster sits this in the type. Ink & Brush sits it beside the vision.
 * Either way the sermon plays here, and YouTube is not contacted until the press.
 */
export function SermonFrame({
  page,
  className,
  priority = false,
}: {
  page: HomePageBundle
  className?: string
  priority?: boolean
}) {
  const sermon = page.content.watch.featured
  const videoId = sermon ? extractYouTubeId(sermon.youtubeUrl) : null
  const title = sermon?.title ?? 'Watch the message'

  return (
    <figure className={cn('sermon-frame', className)}>
      <div className="sermon-frame-media">
        {sermon && videoId ? (
          <YouTubeEmbed
            poster={sermon.thumbnail}
            priority={priority}
            sizes="(min-width: 1024px) 30rem, 100vw"
            title={title}
            videoId={videoId}
          />
        ) : (
          <Link className="relative block aspect-video bg-ink" href="/watch">
            <Image
              alt="The Clairemont sanctuary during the service."
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 28rem, 100vw"
              src="/images/life/sanctuary-service.webp"
            />
          </Link>
        )}
        <figcaption className="sermon-frame-caption">
          <span>Latest message</span>
          <span className="sermon-frame-title">{title}</span>
        </figcaption>
      </div>
    </figure>
  )
}
