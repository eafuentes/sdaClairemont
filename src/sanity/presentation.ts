import { defineDocuments, defineLocations } from 'sanity/presentation'

/**
 * Which document Presentation should treat as the main one for a public URL.
 *
 * Locations (below) list every page a document appears on. This half is what
 * happens when an editor navigates the preview iframe: the form on the left
 * follows the page on the right.
 */
export const presentationDocuments = defineDocuments([
  { route: '/', type: 'homePage' },
  { route: '/prophecy', type: 'prophecyPage' },
  { route: '/this-sabbath', filter: `_type == "sabbathProgram"` },
  { route: '/visit', filter: `_type == "page" && slug.current == "visit"` },
  { route: '/about', filter: `_type == "page" && slug.current == "about"` },
  { route: '/about/beliefs', filter: `_type == "page" && slug.current == "about/beliefs"` },
  { route: '/give', filter: `_type == "page" && slug.current == "give"` },
  { route: '/prayer', filter: `_type == "page" && slug.current == "prayer"` },
  { route: '/events/:slug', filter: `_type == "event" && slug.current == $slug` },
  { route: '/ministries/:slug', filter: `_type == "ministry" && slug.current == $slug` },
  { route: '/watch/:slug', filter: `_type == "sermon" && slug.current == $slug` },
  { route: '/:slug', filter: `_type == "page" && slug.current == $slug` },
])

/**
 * Where each document type appears on the public site.
 *
 * Presentation uses this to open the matching route beside the form, and to list
 * every place a document is visible so an editor is not guessing.
 */
export const presentationLocations = {
  siteSettings: defineLocations({
    select: { title: 'shortName' },
    resolve: (document) => ({
      locations: [{ title: document?.title ?? 'The public site', href: '/' }],
    }),
  }),

  homePage: defineLocations({
    select: { title: 'arrival.headline' },
    resolve: () => ({
      locations: [{ title: 'Homepage', href: '/' }],
    }),
  }),

  prophecyPage: defineLocations({
    select: { title: 'title' },
    resolve: () => ({
      locations: [{ title: 'Prophecy timeline', href: '/prophecy' }],
    }),
  }),

  sabbathProgram: defineLocations({
    select: { title: 'sermonTitle', date: 'date' },
    resolve: (document) => ({
      locations: [
        { title: document?.title ?? 'This Sabbath', href: '/this-sabbath' },
        { title: 'Homepage', href: '/' },
      ],
    }),
  }),

  event: defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (document) => ({
      locations: document?.slug
        ? [
            { title: document.title ?? 'Event', href: `/events/${document.slug}` },
            { title: 'All events', href: '/events' },
          ]
        : [{ title: 'All events', href: '/events' }],
    }),
  }),

  ministry: defineLocations({
    select: { title: 'name', slug: 'slug.current' },
    resolve: (document) => ({
      locations: document?.slug
        ? [
            { title: document.title ?? 'Ministry', href: `/ministries/${document.slug}` },
            { title: 'All ministries', href: '/ministries' },
          ]
        : [{ title: 'All ministries', href: '/ministries' }],
    }),
  }),

  sermon: defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (document) => ({
      locations: document?.slug
        ? [
            { title: document.title ?? 'Message', href: `/watch/${document.slug}` },
            { title: 'All messages', href: '/watch' },
          ]
        : [{ title: 'All messages', href: '/watch' }],
    }),
  }),

  page: defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (document) =>
      document?.slug
        ? { locations: [{ title: document.title ?? 'Page', href: `/${document.slug}` }] }
        : null,
  }),

  person: defineLocations({
    select: { title: 'name' },
    resolve: (document) => ({
      locations: [{ title: document?.title ?? 'Leadership', href: '/about/leadership' }],
    }),
  }),

  announcement: defineLocations({
    select: { title: 'title' },
    resolve: () => ({
      locations: [{ title: 'This Sabbath', href: '/this-sabbath' }],
    }),
  }),

  testimonial: defineLocations({
    select: { title: 'personName' },
    resolve: () => ({
      locations: [{ title: 'Homepage', href: '/' }],
    }),
  }),
}
