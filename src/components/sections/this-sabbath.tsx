import { Container } from '@/components/layout/container'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { Reveal } from '@/components/motion/reveal'
import { Button } from '@/components/ui/button'
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
    <section aria-labelledby="sabbath-title" className="bg-paper-bloom py-section md:py-section-lg" id="this-sabbath">
      <Container>
        <Reveal>
          <Eyebrow index="02">This Sabbath</Eyebrow>
          <p className="mt-5 font-sans text-eyebrow text-ink-muted uppercase">
            <time dateTime={program.date}>{formatPlainDate(program.date)}</time>
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-6 lg:col-start-1">
            <h2 className="font-display text-heading-1 text-ink" id="sabbath-title">
              {program.sermonTitle}
            </h2>
            <p className="mt-4 font-sans text-body-sm text-ink-soft">
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

            <Button className="mt-8" href="/this-sabbath" variant="tertiary">
              See the full program
            </Button>
          </Reveal>

          <Reveal className="lg:col-span-4 lg:col-start-8" delay={0.08}>
            {/* Times sit above the photograph on mobile: someone checking on Friday
                night wants the time before the picture. */}
            <dl className="divide-y divide-rule border-y border-rule lg:order-2">
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
              className="mt-8 aspect-[4/5] w-full [&_img]:object-top"
              description="Portrait crop of this week's speaker, or the sanctuary in morning light."
              image={program.image}
              tone="neutral"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

function ThisSabbathFallback({ settings }: { settings: SiteSettings }) {
  return (
    <section className="bg-paper-bloom py-section-lg" id="this-sabbath">
      <Container>
        <Eyebrow index="02">This Sabbath</Eyebrow>
        <h2 className="mt-6 max-w-measure-lead font-display text-heading-1">
          We gather every Saturday.
        </h2>
        <dl className="mt-10 max-w-measure divide-y divide-rule border-y border-rule">
          {settings.serviceTimes.map((service) => (
            <div key={service.label} className="flex items-baseline justify-between gap-4 py-4">
              <dt className="font-sans text-body-sm text-ink-soft">{service.label}</dt>
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
