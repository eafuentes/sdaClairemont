/**
 * Static, non-secret build-time constants.
 *
 * Deliberately narrow. Facts about the church that staff may need to change —
 * service times, address, phone, the AdventistGiving URL, social links — are
 * editorial content and belong in Sanity `siteSettings`, not here. Anything that
 * differs between deployments or must stay secret belongs in the environment.
 */
export const siteConfig = {
  name: 'San Diego Clairemont Seventh-day Adventist Church',
  shortName: 'Clairemont SDA Church',
  description:
    'A Seventh-day Adventist congregation in Clairemont, San Diego. Join us Saturdays for Bible study and worship.',
  locale: 'en-US',
  /** All service dates and times are authored and displayed in church-local time. */
  timeZone: 'America/Los_Angeles',
} as const
