import { isoYear } from '@/lib/prophetic-date'
import { cn } from '@/lib/utils'
import type { PropheticDate } from '@/types/content'

interface PropheticTimeProps {
  date: PropheticDate
  className?: string
}

/**
 * A prophetic date in a real `<time>` element. The machine value is a year, not a day,
 * because several of these points are seasonal rather than calendar-exact.
 */
export function PropheticTime({ date, className }: PropheticTimeProps) {
  return (
    <time className={cn('tabular', className)} dateTime={isoYear(date)}>
      {date.display}
    </time>
  )
}
