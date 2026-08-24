import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { Eyebrow } from '@/components/ui/eyebrow'
import { ScriptureQuote } from '@/components/ui/scripture-quote'
import { formatPlainDate } from '@/lib/datetime'
import type { SabbathProgram, SiteSettings } from '@/types/content'

interface ThisSabbathProps {
  program: SabbathProgram | null
  settings: SiteSettings
}

/**
 * Chapter 02 — This Sabbath.
 *
 * Second on the page, above everything atmospheric, because this is the chapter
 * members actually come for and it has to be scannable in about three seconds.
 *
 * When no program is published the chapter falls back to service times rather than
 * disappearing. A section that vanishes when staff are behind is worse than a plain one.
 */
export function ThisSabbath({ program, settings }: ThisSabbathProps) {
  if (!program) {
    return <ThisSabbathFallback settings={settings} />
  }

  const scripture = program.scripture[0]

  return (
    <section aria-labelledby="sabbath-title" className="bg-paper py-section-lg" id="this-sabbath">
      <Container>
        <Eyebrow index="02">This Sabbath</Eyebrow>
        <p className="mt-6 font-serif text-heading-1 text-ink">
          <time dateTime={program.date}>{formatPlainDate(program.date)}</time>
        </p>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 lg:col-start-1">
            <h2 className="font-serif text-heading-1 text-ink" id="sabbath-title">
              {program.sermonTitle}
            </h2>
            <p className="mt-4 font-sans text-body-sm text-ink-70">
              {program.speakerName}
              {program.speakerRole ? ` · ${program.speakerRole}` : ''}
            </p>

            {scripture ? (
              <div className="mt-10">
                <ScriptureQuote reference={scripture.reference} translation={scripture.translation}>
                  {program.sermonSummary}
                </ScriptureQuote>
              </div>
            ) : null}

            <Link
              className="mt-10 inline-block font-sans text-body-sm text-ink underline decoration-dawn decoration-1 underline-offset-4 transition-all duration-[var(--dur-instant)] ease-out hover:decoration-2"
              href="/visit"
            >
              See the full program
            </Link>
          </div>

          <div className="lg:col-span-4 lg:col-start-8">
            {/* Times sit above the photograph on mobile: someone checking on Friday
                night wants the time before the picture. */}
            <dl className="divide-y divide-rule border-y border-rule lg:order-2">
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="font-sans text-body-sm text-ink-70">Sabbath School</dt>
                <dd className="tabular font-sans text-body-sm text-ink">
                  {program.sabbathSchoolTime}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="font-sans text-body-sm text-ink-70">Divine Worship</dt>
                <dd className="tabular font-sans text-body-sm text-ink">{program.worshipTime}</dd>
              </div>
            </dl>

            <MediaPlaceholder
              className="mt-8 aspect-[4/5] w-full"
              description="Portrait crop of this week's speaker, or the sanctuary in morning light."
              tone="paper"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

function ThisSabbathFallback({ settings }: { settings: SiteSettings }) {
  return (
    <section className="bg-paper py-section-lg" id="this-sabbath">
      <Container>
        <Eyebrow index="02">This Sabbath</Eyebrow>
        <h2 className="mt-6 max-w-measure-lead font-serif text-heading-1">
          We gather every Saturday.
        </h2>
        <dl className="mt-10 max-w-measure divide-y divide-rule border-y border-rule">
          {settings.serviceTimes.map((service) => (
            <div key={service.label} className="flex items-baseline justify-between gap-4 py-4">
              <dt className="font-sans text-body-sm text-ink-70">{service.label}</dt>
              <dd className="tabular font-sans text-body-sm text-ink">
                {service.day} {service.startTime}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
