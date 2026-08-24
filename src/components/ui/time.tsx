import { formatServiceDate, formatShortDate, formatTime } from '@/lib/datetime'
import { cn } from '@/lib/utils'

type TimeFormat = 'date' | 'shortDate' | 'time' | 'dateTime'

interface TimeProps {
  /** ISO 8601 string. Rendered into the `datetime` attribute unchanged. */
  dateTime: string
  format?: TimeFormat
  className?: string
}

/**
 * A `<time>` element carrying a machine-readable timestamp and church-local display.
 *
 * Formatting happens on the server in a fixed timezone, so the markup is identical on
 * both sides of hydration and assistive technology gets a parseable `datetime`.
 */
export function Time({ dateTime, format = 'date', className }: TimeProps) {
  const formatted =
    format === 'time'
      ? formatTime(dateTime)
      : format === 'shortDate'
        ? formatShortDate(dateTime)
        : format === 'dateTime'
          ? `${formatServiceDate(dateTime)} · ${formatTime(dateTime)}`
          : formatServiceDate(dateTime)

  return (
    <time className={cn('tabular', className)} dateTime={dateTime}>
      {formatted}
    </time>
  )
}
