import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { Eyebrow } from '@/components/ui/eyebrow'
import { formatPlainDate } from '@/lib/datetime'
import type { HomePageContent } from '@/types/content'

interface WatchProps {
  content: HomePageContent['watch']
  channelUrl?: string
}

/**
 * Chapter 07 — Watch. The light begins to go.
 *
 * The homepage keeps a poster rather than an embedded player, so this chapter stays
 * inside the JS budget. The iframe loads on `/watch` and `/watch/[slug]`, after a click.
 */
export function Watch({ content, channelUrl }: WatchProps) {
  const featured = content.featured
  const featuredScripture = featured?.scripture[0]

  return (
    <section aria-labelledby="watch-title" className="bg-paper-deep py-section-lg" id="watch">
      <Container>
        <Eyebrow index="07">Watch</Eyebrow>
        <h2 className="mt-6 max-w-measure-lead font-serif text-display-2" id="watch-title">
          {content.headline}
        </h2>

        {featured ? (
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7 lg:col-start-1">
              <Link className="group block" href={`/watch/${featured.slug}`}>
                <div className="relative">
                  <MediaPlaceholder
                    className="aspect-video"
                    description="Poster frame for the featured message: the speaker mid-sentence, or the sanctuary from the balcony."
                    image={featured.thumbnail}
                    tone="neutral"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-dawn text-paper"
                  >
                    ▶
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-heading-1 text-ink underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out group-hover:decoration-dawn">
                  {featured.title}
                </h3>
              </Link>
              <p className="mt-3 font-sans text-body-sm text-ink-soft">
                {featured.speakerName}
                <span aria-hidden="true"> · </span>
                <time className="tabular" dateTime={featured.date}>
                  {formatPlainDate(featured.date)}
                </time>
                {featured.duration ? (
                  <>
                    <span aria-hidden="true"> · </span>
                    {featured.duration}
                  </>
                ) : null}
              </p>
              {featuredScripture ? (
                <p className="mt-2 font-sans text-eyebrow text-ink-muted uppercase">
                  {featuredScripture.reference}
                </p>
              ) : null}
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <Eyebrow>Recent messages</Eyebrow>
              {content.recent.length > 0 ? (
                <ul className="mt-6">
                  {content.recent.map((sermon) => (
                    <li className="border-t border-rule" key={sermon.slug}>
                      <Link
                        className="group flex min-h-11 flex-col justify-center py-5"
                        href={`/watch/${sermon.slug}`}
                      >
                        <h3 className="font-serif text-heading-3 text-ink underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out group-hover:decoration-dawn">
                          {sermon.title}
                        </h3>
                        <p className="mt-1 font-sans text-body-sm text-ink-muted">
                          {sermon.speakerName}
                          <span aria-hidden="true"> · </span>
                          <time className="tabular" dateTime={sermon.date}>
                            {formatPlainDate(sermon.date)}
                          </time>
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 font-sans text-body-sm text-ink-muted">
                  Earlier messages will collect here as they are posted.
                </p>
              )}
              <div className="border-t border-rule pt-6">
                <Link
                  className="font-sans text-body-sm text-ink underline decoration-dawn decoration-1 underline-offset-4 transition-all duration-[var(--dur-instant)] ease-out hover:decoration-2"
                  href="/watch"
                >
                  All messages
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-12 max-w-measure font-sans text-body text-ink-soft">
            The latest Sabbath message will appear here once it is on YouTube.
            {channelUrl ? (
              <>
                {' '}
                Until then, the congregation&rsquo;s channel is on{' '}
                <a
                  className="underline decoration-dawn underline-offset-4"
                  href={channelUrl}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  YouTube
                </a>
                .
              </>
            ) : null}
          </p>
        )}
      </Container>
    </section>
  )
}
