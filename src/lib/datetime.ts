import { siteConfig } from '@/config/site'

/**
 * Date and time formatting, always in the church's timezone.
 *
 * Every helper here pins `timeZone` to America/Los_Angeles rather than the visitor's
 * locale. A service at 10:45 AM is at 10:45 AM in Clairemont — showing it shifted into
 * a visitor's own timezone would be technically correct and practically wrong, and it
 * would also mean the server and the browser could disagree after hydration.
 */

const timeZone = siteConfig.timeZone
const locale = siteConfig.locale

/**
 * Formats a date-only value (`YYYY-MM-DD`).
 *
 * A calendar date is not an instant. `new Date('2026-08-29')` parses as UTC midnight,
 * which is 5pm on the 28th in California — so formatting a Sabbath date in the church
 * timezone would silently show the previous day. Parsing and formatting both in UTC
 * keeps a plain date meaning the day it says.
 */
export function formatPlainDate(plainDate: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${plainDate}T00:00:00Z`))
}

export function formatServiceDate(isoDate: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone,
  }).format(new Date(isoDate))
}

export function formatShortDate(isoDate: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    timeZone,
  }).format(new Date(isoDate))
}

export function formatTime(isoDate: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(new Date(isoDate))
}

/** A full event when-line: `Saturday, August 29 · 12:30 PM`. */
export function formatEventWhen(start: string, end?: string, isAllDay?: boolean): string {
  const date = formatServiceDate(start)
  if (isAllDay) return date

  const startTime = formatTime(start)
  if (!end) return `${date} · ${startTime}`
  return `${date} · ${startTime}–${formatTime(end)}`
}

/** Parts for a stacked date block: `SAT` over `14`. */
export function formatDateParts(isoDate: string): { weekday: string; day: string; month: string } {
  const date = new Date(isoDate)
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, { ...options, timeZone }).format(date)

  return {
    weekday: part({ weekday: 'short' }),
    day: part({ day: 'numeric' }),
    month: part({ month: 'short' }),
  }
}
