import type { Star } from '@/lib/prophecy-constellation'
import type { ProphecyPageContent, PropheticArithmetic, PropheticObjection } from '@/types/content'

export interface StarReading {
  id: string
  year: string
  title: string
  kicker?: string
  summary: string
  explanation: string[]
  arithmetic?: PropheticArithmetic
  objections?: PropheticObjection[]
  chronologyHref?: string
  chronologyLabel: string
}

export function readingForStar(star: Star, content: ProphecyPageContent): StarReading {
  if (star.kind === 'spine') {
    const event = content.spine.find((entry) => entry.id === star.id)
    if (event) {
      return {
        id: star.id,
        year: event.date.display,
        title: event.title,
        kicker: event.scripture.reference,
        summary: event.summary,
        explanation: event.explanation,
        arithmetic: event.arithmetic,
        objections: event.objections,
        chronologyHref: `#${event.id}`,
        chronologyLabel: 'Read this in the chronology',
      }
    }
  }

  if (star.kind === 'fold') {
    return {
      id: star.id,
      year: content.fold.label,
      title: content.fold.label,
      kicker: 'Marked compression',
      summary: content.fold.explanation,
      explanation: [],
      chronologyHref: '#chronology',
      chronologyLabel: 'See the fold on the spine',
    }
  }

  if (star.kind === 'empire') {
    const empire = content.empires.find((entry) => `empire-${entry.empire}` === star.id)
    if (empire) {
      return {
        id: star.id,
        year: empire.span,
        title: empire.empire,
        kicker: empire.span,
        summary: `Daniel 2, 7 and 8 name this kingdom in the same order, in different symbols.`,
        explanation: [
          `Daniel 2: ${empire.daniel2}`,
          `Daniel 7: ${empire.daniel7}`,
          `Daniel 8: ${empire.daniel8}`,
          ...(empire.daniel11 ? [`Daniel 11: ${empire.daniel11}`] : []),
        ],
        chronologyHref: '#the-lanes',
        chronologyLabel: 'See the alignment',
      }
    }
  }

  if (star.kind === 'lane') {
    const empire = content.empires.find((entry) => star.id.startsWith(`empire-${entry.empire}-`))
    if (empire) {
      return {
        id: star.id,
        year: empire.start.display,
        title: star.title,
        kicker: star.kicker,
        summary: `${star.kicker ?? 'This prophecy'} names ${empire.empire} here.`,
        explanation: [],
        chronologyHref: '#the-lanes',
        chronologyLabel: 'See the alignment',
      }
    }
  }

  return {
    id: star.id,
    year: star.year,
    title: star.year,
    kicker: 'A year on the axis',
    summary:
      'This is a year on the prophetic clock, not an event. The dated stations around it are the story.',
    explanation: [],
    chronologyHref: '#chronology',
    chronologyLabel: 'Read the chronology',
  }
}

interface StarReadingPanelProps {
  reading: StarReading | null
  onClose: () => void
}

/**
 * What a clicked year contains. Not a modal: scroll still flies the camera.
 * The full argument remains in the document underneath.
 */
export function StarReadingPanel({ reading, onClose }: StarReadingPanelProps) {
  if (!reading) return null

  return (
    <aside aria-labelledby="prophecy-reading-title" className="prophecy-star-reading" role="region">
      <p className="font-display text-heading-2 text-paper-on-dusk">{reading.year}</p>
      <h2 className="mt-3 font-display text-heading-3 text-paper-on-dusk" id="prophecy-reading-title">
        {reading.title}
      </h2>
      {reading.kicker ? (
        <p className="mt-2 font-sans text-eyebrow text-dawn-soft uppercase">{reading.kicker}</p>
      ) : null}
      <p className="mt-5 font-sans text-body-sm text-paper-on-dusk/80">{reading.summary}</p>

      {reading.arithmetic ? (
        <p className="mt-5 font-sans text-body-sm text-paper-on-dusk/70">
          <span className="tabular">
            {reading.arithmetic.from} + {reading.arithmetic.plus} = {reading.arithmetic.result}
          </span>
          {reading.arithmetic.note ? (
            <span className="mt-2 block text-paper-on-dusk/55">{reading.arithmetic.note}</span>
          ) : null}
        </p>
      ) : null}

      {reading.explanation.slice(0, 2).map((paragraph) => (
        <p className="mt-4 font-sans text-body-sm text-paper-on-dusk/70" key={paragraph}>
          {paragraph}
        </p>
      ))}

      {reading.objections?.[0] ? (
        <p className="mt-5 font-sans text-eyebrow text-paper-on-dusk/55">
          Also asked: {reading.objections[0].title}
        </p>
      ) : null}

      <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        {reading.chronologyHref ? (
          <a className="prophecy-star-reading-link" href={reading.chronologyHref}>
            {reading.chronologyLabel}
          </a>
        ) : null}
        <button className="prophecy-star-reading-close" onClick={onClose} type="button">
          Close
        </button>
      </p>
    </aside>
  )
}
