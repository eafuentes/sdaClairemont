import { defineQuery } from 'next-sanity'

import { IMAGE_PROJECTION } from './fragments'

const EVENT_CARD_PROJECTION = /* groq */ `{
  title,
  "slug": slug.current,
  shortDescription,
  startDateTime,
  endDateTime,
  isAllDay,
  atChurch,
  locationName,
  "ministryName": ministry->name,
  "ministrySlug": ministry->slug.current,
  image ${IMAGE_PROJECTION},
  registrationUrl,
  cost,
  ageRange
}`

/**
 * Upcoming events, soonest first.
 *
 * `$now` is supplied by the caller rather than using GROQ's `now()`, for the same
 * timezone reason set out in `sabbath.ts`: an event at 6 PM Pacific is still upcoming at
 * 5 PM Pacific, but has already passed by UTC's reckoning.
 */
export const upcomingEventsQuery = defineQuery(`
  *[_type == "event" && startDateTime >= $now]
    | order(startDateTime asc)[0...$limit] ${EVENT_CARD_PROJECTION}
`)

export const pastEventsQuery = defineQuery(`
  *[_type == "event" && startDateTime < $now]
    | order(startDateTime desc)[0...$limit] ${EVENT_CARD_PROJECTION}
`)

/** One event, with everything its own page needs. */
export const eventBySlugQuery = defineQuery(`
  *[_type == "event" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    shortDescription,
    description,
    startDateTime,
    endDateTime,
    isAllDay,
    atChurch,
    locationName,
    locationAddress,
    locationMapUrl,
    recurrence{ frequency, interval, until },
    cost,
    ageRange,
    registrationUrl,
    image ${IMAGE_PROJECTION},
    "ministry": ministry->{ name, "slug": slug.current },
    // Consent is applied in the query, not in the component. An elder may agree to be
    // listed as an event contact and still not want their mobile number on the public
    // internet. Filtering here means the number never enters the response at all, so it
    // cannot be leaked by a component that forgets to check, or scraped from the page
    // source. GROQ takes // comments; it has no block comment syntax.
    "contact": contactPerson->{
      name,
      role,
      "email": select(showContactPublicly => email, null),
      "phone": select(showContactPublicly => phone, null)
    },
    seo{ title, description, ogImage ${IMAGE_PROJECTION}, noIndex }
  }
`)

/** Slugs for static generation. */
export const eventSlugsQuery = defineQuery(`
  *[_type == "event" && defined(slug.current)].slug.current
`)
