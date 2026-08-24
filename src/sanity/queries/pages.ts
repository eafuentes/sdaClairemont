import { defineQuery } from 'next-sanity'

import { IMAGE_PROJECTION, SCRIPTURE_PROJECTION } from './fragments'

/**
 * One editorial page, with its content blocks resolved by type.
 *
 * Portable Text arrays holding several block types need each one projected explicitly,
 * or references inside them come back as unresolved `_ref` strings. The `_type ==` guards
 * are what make a gallery embed arrive as a gallery rather than as an id.
 */
export const pageBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    heroImage ${IMAGE_PROJECTION},
    intro,
    content[]{
      ...,
      _type == "imagePlate" => ${IMAGE_PROJECTION},
      _type == "scripture" => ${SCRIPTURE_PROJECTION},
      _type == "galleryEmbed" => @->{
        title,
        "slug": slug.current,
        layout,
        coverImage ${IMAGE_PROJECTION},
        items[] ${IMAGE_PROJECTION}
      }
    },
    seo{ title, description, ogImage ${IMAGE_PROJECTION}, noIndex }
  }
`)

export const pageSlugsQuery = defineQuery(`
  *[_type == "page" && defined(slug.current)].slug.current
`)

/** Notices currently in their display window, for the homepage and the bulletin. */
export const activeAnnouncementsQuery = defineQuery(`
  *[_type == "announcement" && startDate <= $today && endDate >= $today]
    | order(priority desc, endDate asc){
      title,
      body,
      priority,
      link,
      "ministryName": ministry->name,
      showOnHomepage
    }
`)

export const leadershipQuery = defineQuery(`
  *[_type == "person"] | order(order asc, name asc){
    name,
    "slug": slug.current,
    role,
    roleCategory,
    bio,
    image ${IMAGE_PROJECTION},
    "email": select(showContactPublicly => email, null),
    "phone": select(showContactPublicly => phone, null)
  }
`)
