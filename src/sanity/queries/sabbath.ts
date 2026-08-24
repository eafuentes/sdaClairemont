import { defineQuery } from 'next-sanity'

import { IMAGE_PROJECTION, SCRIPTURE_PROJECTION, SPEAKER_PROJECTION } from './fragments'

const SABBATH_PROGRAM_PROJECTION = /* groq */ `{
  date,
  sermonTitle,
  ${SPEAKER_PROJECTION},
  "speakerImage": speaker->image ${IMAGE_PROJECTION},
  scripture[] ${SCRIPTURE_PROJECTION},
  sermonSummary,
  sabbathSchoolTime,
  worshipTime,
  specialMusic[]{ title, performer },
  announcements[]->{
    title,
    body,
    link
  },
  featuredMessage,
  image ${IMAGE_PROJECTION},
  "bulletinUrl": bulletin.asset->url,
  livestreamUrl,
  isSpecialService,
  specialServiceLabel
}`

/**
 * The Sabbath program to show right now.
 *
 * Takes the earliest program dated today or later. `$today` is passed in as a plain
 * `YYYY-MM-DD` string computed in `America/Los_Angeles` by `src/lib/sabbath.ts` — it is
 * deliberately not `now()`.
 *
 * The reason is a real bug rather than a hypothetical one. Sanity evaluates `now()` in
 * UTC, and Pacific time is seven or eight hours behind. A comparison against UTC midnight
 * rolls the date over at 4 or 5 PM local, so from late Friday afternoon onward the site
 * would consider Saturday already past and show next week's program — during the hours
 * when people are actually checking what time to arrive.
 */
export const currentSabbathProgramQuery = defineQuery(`
  *[_type == "sabbathProgram" && date >= $today] | order(date asc)[0] ${SABBATH_PROGRAM_PROJECTION}
`)

/**
 * The most recent past program, used only as a fallback.
 *
 * If staff have not posted the coming Sabbath yet, showing last week is better than
 * showing an empty section — a visitor still learns roughly what a service here looks
 * like. The UI is responsible for labelling it as past rather than presenting stale
 * information as current.
 */
export const latestPastSabbathProgramQuery = defineQuery(`
  *[_type == "sabbathProgram" && date < $today] | order(date desc)[0] ${SABBATH_PROGRAM_PROJECTION}
`)

/** The archive listing. */
export const sabbathProgramArchiveQuery = defineQuery(`
  *[_type == "sabbathProgram"] | order(date desc)[0...$limit]{
    date,
    sermonTitle,
    ${SPEAKER_PROJECTION},
    sermonSummary,
    image ${IMAGE_PROJECTION},
    isSpecialService,
    specialServiceLabel
  }
`)
