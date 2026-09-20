import { Container } from '@/components/layout/container'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { SermonPoster } from '@/components/watch/sermon-poster'
import { SermonRow } from '@/components/watch/sermon-row'
import { YouTubeEmbed } from '@/components/watch/youtube-embed'
import { formatPlainDate } from '@/lib/datetime'
import { pageMetadata } from '@/lib/page-metadata'
import { extractYouTubeId } from '@/lib/youtube'
import { getSermons, getSiteSettings } from '@/sanity/lib/load'

export const metadata = pageMetadata(
  'Watch',
  'Messages from San Diego Clairemont Seventh-day Adventist Church. If you cannot be here, be here anyway.',
)

export default async function WatchPage() {
  const [sermons, settings] = await Promise.all([getSermons(), getSiteSettings()])
  const [featured, ...recent] = sermons
  const featuredVideoId = featured ? extractYouTubeId(featured.youtubeUrl) : null

  return (
    <>
      <PageHeader
        eyebrow="Watch"
        title="If you cannot be here, be here anyway."
        intro="The latest Sabbath message plays here. The player loads only when you ask for it."
      />
      <div className="bg-paper-bloom pb-section">
        <Container>
          {settings.isLive && settings.livestreamUrl ? (
            <p className="mb-12">
              <Button external href={settings.livestreamUrl}>
                We are live now
              </Button>
            </p>
          ) : null}

          {featured && featuredVideoId ? (
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-7">
                <article>
                  <YouTubeEmbed
                    poster={featured.thumbnail}
                    title={featured.title}
                    videoId={featuredVideoId}
                  />
                  <h2 className="mt-6 font-display text-heading-1 text-ink">{featured.title}</h2>
                  <p className="mt-3 font-sans text-body-sm text-ink-soft">
                    {featured.speakerName}
                    <span aria-hidden="true"> · </span>
                    <time className="tabular" dateTime={featured.date}>
                      {formatPlainDate(featured.date)}
                    </time>
                  </p>
                  {featured.scripture[0] ? (
                    <p className="mt-2 font-sans text-eyebrow text-ink-muted uppercase">
                      {featured.scripture[0].reference}
                    </p>
                  ) : null}
                  <p className="mt-6">
                    <Button external href={featured.youtubeUrl} variant="secondary">
                      Watch on YouTube
                    </Button>
                  </p>
                </article>
              </div>
              {recent.length > 0 ? (
                <div className="lg:col-span-4 lg:col-start-9">
                  <h2 className="font-sans text-eyebrow text-ink-muted uppercase">
                    Recent messages
                  </h2>
                  <ul className="mt-6">
                    {recent.map((sermon) => (
                      <li className="border-t border-rule" key={sermon.slug}>
                        <SermonRow headingLevel="h3" sermon={sermon} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : featured ? (
            <SermonPoster sermon={featured} />
          ) : (
            <p className="max-w-measure font-sans text-body text-ink-soft">
              Messages will appear here as they are posted.
              {settings.youtubeUrl ? (
                <>
                  {' '}
                  Until then, the congregation&rsquo;s channel is on{' '}
                  <a
                    className="underline decoration-dawn underline-offset-4"
                    href={settings.youtubeUrl}
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
          <aside className="mt-16 max-w-measure border-t border-rule pt-10">
            <h2 className="font-display text-heading-3 text-ink">If a message left you in Daniel</h2>
            <p className="mt-4 font-sans text-body-sm text-ink-soft">
              The dates are drawn to scale, from a Persian king&rsquo;s decree to 1844.
            </p>
            <p className="mt-6">
              <Button href="/prophecy" variant="tertiary">
                Walk through the years
              </Button>
            </p>
          </aside>
        </Container>
      </div>
    </>
  )
}
