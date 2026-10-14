import Link from 'next/link'

import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { formatPlainDate } from '@/lib/datetime'
import type { Sermon } from '@/types/content'

interface SermonPosterProps {
  sermon: Sermon
  /** Destination for the poster. Omit for `/watch/[slug]`. Pass `null` to keep it unlinked. */
  href?: string | null
  headingLevel?: 'h2' | 'h3'
  /** Set when the page already used the sermon title as its H1. */
  showTitle?: boolean
}

/**
 * A message as a poster frame, never an iframe.
 *
 * A page listing several sermons must not pay for YouTube's player several times.
 * The poster is a link into `/watch/[slug]` unless `href` is set or explicitly `null`.
 * The YouTube destination is a separate, explicit action when a URL exists.
 */
export function SermonPoster({
  sermon,
  href,
  headingLevel = 'h2',
  showTitle = true,
}: SermonPosterProps) {
  const Title = headingLevel
  const destination = href === undefined ? `/watch/${sermon.slug}` : href
  const scripture = sermon.scripture[0]

  const frame = (
    <>
      <div className="relative">
        <MediaPlaceholder
          className="aspect-video"
          description={`Poster frame for ${sermon.title}: the speaker mid-sentence, or the sanctuary from the balcony.`}
          image={sermon.thumbnail}
          tone="neutral"
        />
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-dawn text-paper"
        >
          <Icon className="text-[1.25rem]" name="play" />
        </span>
      </div>
      {showTitle ? (
        <Title className="mt-6 font-display text-heading-1 text-ink">
          <span className="link-draw">{sermon.title}</span>
        </Title>
      ) : null}
    </>
  )

  return (
    <article>
      {destination ? (
        <Link className="group block" href={destination}>
          {frame}
        </Link>
      ) : (
        <div>{frame}</div>
      )}
      <p className="mt-3 font-sans text-body-sm text-ink-soft">
        {sermon.speakerName}
        <span aria-hidden="true"> · </span>
        <time className="tabular" dateTime={sermon.date}>
          {formatPlainDate(sermon.date)}
        </time>
        {sermon.duration ? (
          <>
            <span aria-hidden="true"> · </span>
            {sermon.duration}
          </>
        ) : null}
      </p>
      {scripture ? (
        <p className="mt-2 font-sans text-eyebrow text-ink-muted uppercase">
          {scripture.reference}
        </p>
      ) : null}
      {sermon.youtubeUrl ? (
        <p className="mt-6">
          <Button external href={sermon.youtubeUrl} variant="secondary">
            Watch on YouTube
          </Button>
        </p>
      ) : null}
    </article>
  )
}
