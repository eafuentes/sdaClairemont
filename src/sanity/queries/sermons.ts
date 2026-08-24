import { defineQuery } from 'next-sanity'

import { IMAGE_PROJECTION, SCRIPTURE_PROJECTION, SPEAKER_PROJECTION } from './fragments'

const SERMON_CARD_PROJECTION = /* groq */ `{
  title,
  "slug": slug.current,
  date,
  ${SPEAKER_PROJECTION},
  scripture[] ${SCRIPTURE_PROJECTION},
  youtubeUrl,
  duration,
  thumbnail ${IMAGE_PROJECTION}
}`

/**
 * The sermon to feature.
 *
 * Prefers an explicitly featured one and falls back to the most recent. The homepage
 * schema says as much to the editor — "leave empty to always show the most recent one" —
 * so the common case needs no maintenance and the override exists for the week when the
 * newest recording is not the one to lead with.
 */
export const featuredSermonQuery = defineQuery(`
  coalesce(
    *[_type == "sermon" && featured == true] | order(date desc)[0],
    *[_type == "sermon"] | order(date desc)[0]
  ) ${SERMON_CARD_PROJECTION}
`)

export const recentSermonsQuery = defineQuery(`
  *[_type == "sermon"] | order(date desc)[0...$limit] ${SERMON_CARD_PROJECTION}
`)

export const sermonBySlugQuery = defineQuery(`
  *[_type == "sermon" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    date,
    ${SPEAKER_PROJECTION},
    "speakerImage": speaker->image ${IMAGE_PROJECTION},
    scripture[] ${SCRIPTURE_PROJECTION},
    description,
    youtubeUrl,
    duration,
    thumbnail ${IMAGE_PROJECTION},
    "notesUrl": notesFile.asset->url,
    "ministry": ministry->{ name, "slug": slug.current }
  }
`)

export const sermonSlugsQuery = defineQuery(`
  *[_type == "sermon" && defined(slug.current)].slug.current
`)
