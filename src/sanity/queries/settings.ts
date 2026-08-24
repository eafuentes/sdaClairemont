import { defineQuery } from 'next-sanity'

import { IMAGE_PROJECTION } from './fragments'

/**
 * Site settings — the facts that appear on every page.
 *
 * Fetched once per route in the layout and passed down as props. No component reaches
 * for this itself.
 *
 * `_id == "siteSettings"` rather than `_type == "siteSettings"[0]`, because the desk
 * structure pins this document at a known id. Querying by type and taking the first
 * result would silently pick one of two documents if a second ever appeared; querying by
 * id returns nothing, which is a visible failure rather than a confusing one.
 */
export const siteSettingsQuery = defineQuery(`
  *[_id == "siteSettings"][0]{
    name,
    shortName,
    tagline,
    missionStatement,
    logo ${IMAGE_PROJECTION},
    serviceTimes[]{
      label,
      day,
      startTime,
      endTime,
      notes,
      isPrimary
    },
    address{
      street,
      city,
      state,
      postalCode,
      latitude,
      longitude,
      mapUrl,
      drivingNotes
    },
    phone,
    email,
    givingUrl,
    youtubeChannelUrl,
    socialLinks[]{ platform, url },
    isLive,
    livestreamUrl,
    nextStreamDate,
    defaultSeo{
      title,
      description,
      ogImage ${IMAGE_PROJECTION},
      noIndex
    }
  }
`)
