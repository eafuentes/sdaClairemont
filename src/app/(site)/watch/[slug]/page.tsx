import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/container'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { ScriptureQuote } from '@/components/ui/scripture-quote'
import { YouTubeEmbed } from '@/components/watch/youtube-embed'
import { formatPlainDate } from '@/lib/datetime'
import { pageMetadata } from '@/lib/page-metadata'
import { extractYouTubeId } from '@/lib/youtube'
import { getSermonBySlug, getSermonSlugs } from '@/sanity/lib/load'

interface SermonPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getSermonSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: SermonPageProps) {
  const { slug } = await params
  const sermon = await getSermonBySlug(slug)
  if (!sermon) return pageMetadata('Message')
  return pageMetadata(
    sermon.title,
    `${sermon.speakerName}, ${formatPlainDate(sermon.date)}${sermon.scripture[0] ? ` · ${sermon.scripture[0].reference}` : ''}.`,
  )
}

export default async function SermonPage({ params }: SermonPageProps) {
  const { slug } = await params
  const sermon = await getSermonBySlug(slug)
  if (!sermon) notFound()

  const scripture = sermon.scripture[0]
  const videoId = extractYouTubeId(sermon.youtubeUrl)

  return (
    <>
      <PageHeader eyebrow="Watch" title={sermon.title} />
      <div className="bg-paper-bloom pb-section">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              {videoId ? (
                <YouTubeEmbed poster={sermon.thumbnail} title={sermon.title} videoId={videoId} />
              ) : (
                <div className="aspect-video bg-paper-deep" />
              )}
              {sermon.youtubeUrl ? (
                <p className="mt-6">
                  <Button external href={sermon.youtubeUrl} variant="secondary">
                    Watch on YouTube
                  </Button>
                </p>
              ) : null}

              {sermon.description ? (
                <p className="mt-10 max-w-measure font-sans text-body text-ink-soft">
                  {sermon.description}
                </p>
              ) : null}

              {scripture?.text ? (
                <div className="mt-10">
                  <ScriptureQuote
                    reference={scripture.reference}
                    translation={scripture.translation}
                  >
                    {scripture.text}
                  </ScriptureQuote>
                </div>
              ) : null}

              <div className="mt-10 flex flex-wrap items-center gap-4">
                {sermon.notesUrl ? (
                  <Button external href={sermon.notesUrl} variant="secondary">
                    Sermon notes
                  </Button>
                ) : null}
                <Button href="/watch" variant="tertiary">
                  All messages
                </Button>
              </div>
            </div>

            <aside className="lg:col-span-3 lg:col-start-10">
              <p className="font-sans text-body-sm text-ink-soft">
                {sermon.speakerName}
                {sermon.speakerRole ? ` · ${sermon.speakerRole}` : ''}
              </p>
              <p className="mt-2 font-sans text-body-sm text-ink-muted">
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
              {sermon.ministryName ? (
                <p className="mt-4 font-sans text-eyebrow text-dawn uppercase">
                  {sermon.ministryName}
                </p>
              ) : null}
            </aside>
          </div>
        </Container>
      </div>
    </>
  )
}
