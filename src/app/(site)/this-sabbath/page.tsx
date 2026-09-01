import { Container } from '@/components/layout/container'
import { PageHeader } from '@/components/layout/page-header'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { Button } from '@/components/ui/button'
import { ScriptureQuote } from '@/components/ui/scripture-quote'
import { SermonPoster } from '@/components/watch/sermon-poster'
import { formatPlainDate } from '@/lib/datetime'
import { pageMetadata } from '@/lib/page-metadata'
import { getSabbathProgram, getSermons, getSiteSettings } from '@/sanity/lib/load'

export async function generateMetadata() {
  const program = await getSabbathProgram()
  return pageMetadata(
    'This Sabbath',
    `${program.sermonTitle} — ${program.speakerName}, ${formatPlainDate(program.date)}.`,
  )
}

export default async function ThisSabbathPage() {
  const [program, settings, sermons] = await Promise.all([
    getSabbathProgram(),
    getSiteSettings(),
    getSermons(),
  ])
  const scripture = program.scripture[0]
  const livestreamUrl = program.livestreamUrl ?? settings.livestreamUrl
  const latestMessage = sermons[0]

  return (
    <>
      <PageHeader
        eyebrow="This Sabbath"
        title={program.sermonTitle}
        intro={
          program.isPast
            ? "This is the most recent program we have posted. This week's bulletin has not gone up yet."
            : undefined
        }
      />
      <div className="bg-paper pb-section">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <p className="font-serif text-heading-2 text-ink">
                <time dateTime={program.date}>{formatPlainDate(program.date)}</time>
              </p>
              <p className="mt-3 font-sans text-body-sm text-ink-soft">
                {program.speakerName}
                {program.speakerRole ? ` · ${program.speakerRole}` : ''}
              </p>
              {program.isSpecialService && program.specialServiceLabel ? (
                <p className="mt-4 font-sans text-eyebrow text-dawn uppercase">
                  {program.specialServiceLabel}
                </p>
              ) : null}

              {scripture ? (
                <div className="mt-10">
                  <ScriptureQuote
                    reference={scripture.reference}
                    translation={scripture.translation}
                  >
                    {program.sermonSummary || scripture.reference}
                  </ScriptureQuote>
                </div>
              ) : program.sermonSummary ? (
                <p className="mt-10 max-w-measure font-sans text-body text-ink-soft">
                  {program.sermonSummary}
                </p>
              ) : null}

              {program.specialMusic && program.specialMusic.length > 0 ? (
                <section className="mt-12">
                  <h2 className="font-serif text-heading-2 text-ink">Special music</h2>
                  <ul className="mt-5 divide-y divide-rule border-y border-rule">
                    {program.specialMusic.map((entry) => (
                      <li className="py-4 font-sans text-body text-ink-soft" key={entry.title}>
                        {entry.title}
                        {entry.performer ? (
                          <span className="text-ink-muted"> · {entry.performer}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {program.announcements && program.announcements.length > 0 ? (
                <section className="mt-12">
                  <h2 className="font-serif text-heading-2 text-ink">Announcements</h2>
                  <ul className="mt-5 space-y-8">
                    {program.announcements.map((item) => (
                      <li key={item.title}>
                        <h3 className="font-serif text-heading-3 text-ink">{item.title}</h3>
                        {item.body.map((paragraph, index) => (
                          <p
                            className="mt-3 max-w-measure font-sans text-body text-ink-soft"
                            key={`${item.title}-${index}`}
                          >
                            {paragraph}
                          </p>
                        ))}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <div className="mt-12 flex flex-wrap items-center gap-4">
                {program.bulletinUrl ? (
                  <Button external href={program.bulletinUrl} variant="secondary">
                    Download the bulletin
                  </Button>
                ) : null}
                {livestreamUrl ? (
                  <Button external href={livestreamUrl} variant="secondary">
                    Watch the livestream
                  </Button>
                ) : null}
                <Button href="/visit" variant="tertiary">
                  Plan your visit
                </Button>
              </div>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <dl className="divide-y divide-rule border-y border-rule">
                <div className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="font-sans text-body-sm text-ink-soft">Sabbath School</dt>
                  <dd className="tabular font-sans text-body-sm text-ink">
                    {program.sabbathSchoolTime}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="font-sans text-body-sm text-ink-soft">Divine Worship</dt>
                  <dd className="tabular font-sans text-body-sm text-ink">{program.worshipTime}</dd>
                </div>
              </dl>
              <MediaPlaceholder
                className="mt-8 aspect-[4/5] w-full"
                description="Portrait crop of this week's speaker, or the sanctuary in morning light."
                image={program.image}
              />
              {latestMessage ? (
                <section className="mt-12">
                  <h2 className="font-sans text-eyebrow text-ink-muted uppercase">
                    Latest message
                  </h2>
                  <div className="mt-6">
                    <SermonPoster headingLevel="h3" sermon={latestMessage} />
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
