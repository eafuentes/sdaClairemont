import type { PropheticDate } from '@/types/content'

/**
 * Years from one prophetic date to another. There is no year zero, so a span that
 * crosses from BC to AD is `bcYear + adYear - 1`.
 */
export function yearsSpanned(start: PropheticDate, end: PropheticDate): number {
  if (start.era === 'bc' && end.era === 'ad') {
    return start.year + end.year - 1
  }

  if (start.era === end.era) {
    return Math.abs(end.year - start.year)
  }

  return start.year + end.year - 1
}

/**
 * How far `at` sits between `start` and `end`, as a percentage of the linear span.
 * Used to place ticks on the 2300-year scale.
 */
export function axisPercent(start: PropheticDate, at: PropheticDate, end: PropheticDate): number {
  const total = yearsSpanned(start, end)
  if (total === 0) return 0
  return (yearsSpanned(start, at) / total) * 100
}

/**
 * A year-only `datetime` value. ISO 8601 has a year zero (1 BC), so 457 BC is −0456.
 */
export function isoYear(date: PropheticDate): string {
  if (date.era === 'ad') {
    return String(date.year).padStart(4, '0')
  }

  const iso = 1 - date.year
  if (iso >= 0) return String(iso).padStart(4, '0')
  return `-${String(Math.abs(iso)).padStart(4, '0')}`
}

/** Signed year for axis math. 457 BC is -457; AD 27 is 27. There is no year zero. */
export function axisYear(date: PropheticDate): number {
  return date.era === 'bc' ? -date.year : date.year
}
