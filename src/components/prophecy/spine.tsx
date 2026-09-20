import { Container } from '@/components/layout/container'
import { PropheticTime } from '@/components/prophecy/prophetic-time'
import { Eyebrow } from '@/components/ui/eyebrow'
import type { ProphecyPageContent, PropheticEvent } from '@/types/content'

interface SpineProps {
  content: ProphecyPageContent
}

/**
 * The story a first-time reader can follow without opening anything: six dated
 * events from the decree to 1844. Each year docks as you read. The fold before
 * 1844 is part of the document, not a decoration on top of it.
 */
export function Spine({ content }: SpineProps) {
  return (
    <section className="bg-paper py-section-lg" id="chronology">
      <Container>
        <Eyebrow>The spine</Eyebrow>
        <h2 className="mt-6 max-w-measure-lead font-display text-heading-1 text-ink">
          One thread, six dates.
        </h2>
        <p className="mt-6 max-w-measure font-sans text-body text-ink-soft">
          Read this as a chronology. The visualization positions the same markup. A screen reader, a
          printed page, and a browser with JavaScript off all receive the same six events, in this
          order, with the arithmetic written as text.
        </p>

        <ol className="prophecy-spine mt-16">
          {content.spine.map((event, index) => (
            <li className="prophecy-event" key={event.id}>
              {content.fold.beforeEventId === event.id ? <Fold content={content} /> : null}
              <EventBlock event={event} index={index} />
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

function Fold({ content }: { content: ProphecyPageContent }) {
  return (
    <aside className="prophecy-fold" aria-label={content.fold.label}>
      <p className="font-display text-heading-3 text-ink">{content.fold.label}</p>
      <p className="mt-3 max-w-measure font-sans text-body-sm text-ink-soft">
        {content.fold.explanation}
      </p>
    </aside>
  )
}

function EventBlock({ event, index }: { event: PropheticEvent; index: number }) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <article className="prophecy-event-block" id={event.id}>
      <header className="prophecy-event-year">
        <p className="font-sans text-eyebrow text-ink-muted uppercase">
          <span className="tabular">{number}</span>
        </p>
        <p className="mt-3 font-display text-display-2 text-ink">
          <PropheticTime date={event.date} />
        </p>
      </header>

      <div className="prophecy-event-copy">
        <h3 className="font-display text-heading-2 text-ink">{event.title}</h3>
        <p className="mt-3 font-sans text-eyebrow text-dawn uppercase">
          {event.scripture.reference}
        </p>
        <p className="mt-6 max-w-measure font-sans text-body-lg text-ink">{event.summary}</p>

        {event.arithmetic ? <Arithmetic arithmetic={event.arithmetic} /> : null}

        {event.explanation.map((paragraph) => (
          <p className="mt-6 max-w-measure font-sans text-body text-ink-soft" key={paragraph}>
            {paragraph}
          </p>
        ))}

        {event.objections?.map((objection) => (
          <details className="prophecy-objection group mt-10" key={objection.title}>
            <summary className="cursor-pointer font-display text-heading-3 text-ink">
              {objection.title}
            </summary>
            <div className="mt-4 space-y-4">
              {objection.paragraphs.map((paragraph) => (
                <p className="max-w-measure font-sans text-body text-ink-soft" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </article>
  )
}

function Arithmetic({ arithmetic }: { arithmetic: NonNullable<PropheticEvent['arithmetic']> }) {
  return (
    <p className="prophecy-sum mt-10">
      <span aria-hidden="true">
        <span className="prophecy-sum-part">{arithmetic.from}</span>
        <span className="prophecy-sum-op">+</span>
        <span className="prophecy-sum-part">{arithmetic.plus}</span>
        <span className="prophecy-sum-op">=</span>
        <span className="prophecy-sum-result">{arithmetic.result}</span>
        <span className="mt-3 block font-sans text-body-sm text-ink-muted">{arithmetic.note}</span>
      </span>
      <span className="sr-only">
        {arithmetic.from} plus {arithmetic.plus} equals {arithmetic.result}. {arithmetic.note}
      </span>
    </p>
  )
}
