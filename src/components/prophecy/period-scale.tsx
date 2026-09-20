import type { CSSProperties } from 'react'

import { Container } from '@/components/layout/container'
import { PropheticTime } from '@/components/prophecy/prophetic-time'
import { Eyebrow } from '@/components/ui/eyebrow'
import { axisPercent, yearsSpanned } from '@/lib/prophetic-date'
import type { ProphecyPageContent } from '@/types/content'

interface PeriodScaleProps {
  content: ProphecyPageContent
}

/**
 * The 2,300 years and the 490 nested inside them, drawn to true linear scale.
 *
 * This is the visual argument: the seventy weeks are cut from the beginning of the
 * longer period, and the remaining 1,810 years are the visible remainder. No breaks.
 */
export function PeriodScale({ content }: PeriodScaleProps) {
  const longPeriod = content.periods.find((period) => period.id === '2300')
  const nestedPeriod = content.periods.find((period) => period.id === '490')
  if (!longPeriod || !nestedPeriod) return null

  const nestedWidth = axisPercent(longPeriod.start, nestedPeriod.end, longPeriod.end)
  const remainderYears = longPeriod.years - nestedPeriod.years
  const ticks = [
    { date: longPeriod.start, percent: 0 },
    { date: nestedPeriod.end, percent: nestedWidth },
    { date: longPeriod.end, percent: 100 },
  ]

  return (
    <section className="bg-paper-warm py-section" id="the-scale">
      <Container>
        <Eyebrow>To true scale</Eyebrow>
        <h2 className="mt-6 max-w-measure-lead font-display text-heading-1 text-ink">
          The 490 are cut from the start.
        </h2>
        <p className="mt-6 max-w-measure font-sans text-body text-ink-soft">
          {yearsSpanned(longPeriod.start, longPeriod.end).toLocaleString()} years from{' '}
          <PropheticTime date={longPeriod.start} /> to <PropheticTime date={longPeriod.end} />. The
          first {nestedPeriod.years.toLocaleString()} end in{' '}
          <PropheticTime date={nestedPeriod.end} />. The remaining {remainderYears.toLocaleString()}{' '}
          years are the rest of the bar. Drawn linearly. No folds on this drawing — the proportion
          is the argument.
        </p>

        <div className="prophecy-scale mt-14">
          <p className="font-sans text-eyebrow text-ink-muted uppercase">{longPeriod.label}</p>

          <div
            aria-hidden="true"
            className="prophecy-scale-track mt-4"
            style={{ '--nested-width': `${nestedWidth}%` } as CSSProperties}
          >
            <div className="prophecy-scale-weeks" />
            <div className="prophecy-scale-rest" />
          </div>

          <p className="prophecy-scale-legend mt-3">
            <span>{nestedPeriod.label} nested</span>
            <span>{remainderYears.toLocaleString()} years remain</span>
          </p>

          <ol className="prophecy-scale-ticks mt-6">
            {ticks.map((tick) => (
              <li
                className="prophecy-scale-tick"
                key={tick.date.display}
                style={{ left: `${tick.percent}%` }}
              >
                <PropheticTime date={tick.date} />
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
