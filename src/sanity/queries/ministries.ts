import { defineQuery } from 'next-sanity'

import { IMAGE_PROJECTION } from './fragments'

const MINISTRY_CARD_PROJECTION = /* groq */ `{
  name,
  "slug": slug.current,
  shortDescription,
  ageRange,
  meetingSchedules[]{ day, startTime, endTime, frequency, notes },
  switcherImage ${IMAGE_PROJECTION},
  "tone": accentTone,
  order
}`

/** Ministries in display order, for the homepage and the index. */
export const ministriesQuery = defineQuery(`
  *[_type == "ministry"] | order(order asc, name asc) ${MINISTRY_CARD_PROJECTION}
`)

export const featuredMinistriesQuery = defineQuery(`
  *[_type == "ministry" && featured == true]
    | order(order asc, name asc) ${MINISTRY_CARD_PROJECTION}
`)

/**
 * One ministry, with everything its page needs — including the Pathfinder-specific
 * fields, which are simply absent on the ministries that do not use them.
 */
export const ministryBySlugQuery = defineQuery(`
  *[_type == "ministry" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    shortDescription,
    description,
    ageRange,
    meetingSchedules[]{ day, startTime, endTime, frequency, notes },
    "tone": accentTone,
    heroImage ${IMAGE_PROJECTION},
    switcherImage ${IMAGE_PROJECTION},
    registrationUrl,
    leaders[]->{
      name,
      "slug": slug.current,
      role,
      image ${IMAGE_PROJECTION}
    },
    resources[]->{
      title,
      description,
      category,
      url,
      "fileUrl": file.asset->url
    },
    "gallery": gallery->{
      title,
      "slug": slug.current,
      layout,
      coverImage ${IMAGE_PROJECTION}
    },
    videos[]->{
      title,
      "slug": slug.current,
      date,
      youtubeUrl,
      duration,
      thumbnail ${IMAGE_PROJECTION}
    },
    hasPathfinderDetails,
    classes[]{ name, ageRange, description },
    statistics[]{ value, label, description },
    timeline[]{ title, date, description, image ${IMAGE_PROJECTION} },
    safetyPolicy,
    seo{ title, description, ogImage ${IMAGE_PROJECTION}, noIndex }
  }
`)

export const ministrySlugsQuery = defineQuery(`
  *[_type == "ministry" && defined(slug.current)].slug.current
`)
