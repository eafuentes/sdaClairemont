import { siteConfig } from '@/config/site'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

/**
 * Which day of the week it is in Clairemont, regardless of where the server runs.
 *
 * Vercel functions run in UTC, so `getDay()` would report Sunday from late Saturday
 * afternoon California time onward — during the service itself. Deriving the weekday
 * through Intl in the church timezone is the only version that holds.
 */
function getChurchWeekday(date: Date): number {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: siteConfig.timeZone,
    weekday: 'short',
  }).format(date)

  return WEEKDAYS.indexOf(weekday as (typeof WEEKDAYS)[number])
}

/** The calendar date in Clairemont, as `YYYY-MM-DD`. */
export function getChurchPlainDate(date: Date): string {
  // en-CA formats as YYYY-MM-DD, which is the interchange format we want.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: siteConfig.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/**
 * The Sabbath the site should currently be pointing at, as `YYYY-MM-DD`.
 *
 * On Saturday this returns today rather than next week: a member opening the site
 * during Sabbath School should see the program they are sitting in, not the next one.
 */
export function getUpcomingSabbath(from: Date = new Date()): string {
  const daysUntilSaturday = (6 - getChurchWeekday(from) + 7) % 7
  const target = new Date(from)
  target.setUTCDate(target.getUTCDate() + daysUntilSaturday)

  return getChurchPlainDate(target)
}

/**
 * The Saturday on or before a calendar date.
 *
 * Sabbath sermons are often uploaded on Sunday. The date on the Watch page is the
 * day the message was preached, not the day the file reached YouTube.
 */
export function getMostRecentSabbath(plainDate: string): string {
  const weekday = new Date(`${plainDate}T00:00:00Z`).getUTCDay()
  const daysSinceSaturday = (weekday + 1) % 7
  return addDays(plainDate, -daysSinceSaturday)
}

/**
 * Walks back a number of weeks from a `YYYY-MM-DD` date, staying on the same weekday.
 *
 * Arithmetic runs in UTC because a plain date is a calendar date, not an instant, and
 * shifting it through a timezone is how you land on Friday.
 */
export function subtractWeeks(plainDate: string, weeks: number): string {
  return addDays(plainDate, -weeks * 7)
}

/** Shifts a `YYYY-MM-DD` date by a number of days, in UTC for the same reason. */
export function addDays(plainDate: string, days: number): string {
  const date = new Date(`${plainDate}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)

  return date.toISOString().slice(0, 10)
}

/**
 * Parameters for GROQ queries that compare against "now".
 *
 * `$today` is a calendar date in Clairemont. Sabbath programs store a date, not an
 * instant, so comparing them to UTC midnight would roll the day over at 4 or 5 PM
 * Pacific — during the hours people actually check what time to arrive.
 *
 * `$now` is a real instant. Event datetimes are instants, so the current moment in
 * ISO-8601 is the correct comparison; timezone conversion would be the bug.
 */
export function getChurchQueryParams(from: Date = new Date()): { today: string; now: string } {
  return {
    today: getChurchPlainDate(from),
    now: from.toISOString(),
  }
}
