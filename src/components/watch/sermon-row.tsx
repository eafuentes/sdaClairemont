import Link from 'next/link'

import { formatPlainDate } from '@/lib/datetime'
import type { Sermon } from '@/types/content'

interface SermonRowProps {
  sermon: Sermon
  headingLevel?: 'h2' | 'h3'
}

/**
 * Compact archive row for the Watch index. The featured poster is a different
 * component; this is the list that sits beside or below it.
 */
export function SermonRow({ sermon, headingLevel = 'h2' }: SermonRowProps) {
  const Title = headingLevel

  return (
    <Link
      className="group flex min-h-11 flex-col justify-center py-5"
      href={`/watch/${sermon.slug}`}
    >
      <Title className="font-display text-heading-3 text-ink underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out group-hover:decoration-dawn">
        {sermon.title}
      </Title>
      <p className="mt-1 font-sans text-body-sm text-ink-muted">
        {sermon.speakerName}
        <span aria-hidden="true"> · </span>
        <time className="tabular" dateTime={sermon.date}>
          {formatPlainDate(sermon.date)}
        </time>
      </p>
    </Link>
  )
}
