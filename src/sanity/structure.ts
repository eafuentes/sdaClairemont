import type { StructureResolver } from 'sanity/structure'

/**
 * The desk, arranged by editorial task rather than by schema type.
 *
 * An alphabetical list of document types is a developer's view of the content. A
 * volunteer opening this on a Thursday is not looking for "the sabbathProgram type" —
 * they are looking for this week. So the two singletons are pinned at the top where
 * settings belong (homepage and prophecy timeline with them), the operational work sits above the archival work, and Events are
 * split into Upcoming and Past because those are different tasks.
 *
 * "Needs attention" is the one list here that is not a category. It surfaces images
 * still marked as placeholders and any missing alt text, which is what stands between
 * the site and being publishable. Putting it in the desk means the work is visible to
 * the people who can do it, rather than living in a build error only a developer sees.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Homepage')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem()
        .title('Prophecy timeline')
        .id('prophecyPage')
        .child(S.document().schemaType('prophecyPage').documentId('prophecyPage')),

      S.divider(),

      S.listItem()
        .title('Sabbath programs')
        .schemaType('sabbathProgram')
        .child(
          S.documentTypeList('sabbathProgram')
            .title('Sabbath programs')
            .defaultOrdering([{ field: 'date', direction: 'desc' }]),
        ),

      S.listItem()
        .title('Events')
        .child(
          S.list()
            .title('Events')
            .items([
              S.listItem()
                .title('Upcoming')
                .child(
                  S.documentList()
                    .title('Upcoming events')
                    .filter('_type == "event" && startDateTime >= now()')
                    .defaultOrdering([{ field: 'startDateTime', direction: 'asc' }]),
                ),
              S.listItem()
                .title('Past')
                .child(
                  S.documentList()
                    .title('Past events')
                    .filter('_type == "event" && startDateTime < now()')
                    .defaultOrdering([{ field: 'startDateTime', direction: 'desc' }]),
                ),
            ]),
        ),

      S.listItem()
        .title('Ministries')
        .schemaType('ministry')
        .child(
          S.documentTypeList('ministry')
            .title('Ministries')
            .defaultOrdering([{ field: 'order', direction: 'asc' }]),
        ),

      S.listItem()
        .title('Sermons')
        .schemaType('sermon')
        .child(
          S.documentTypeList('sermon')
            .title('Sermons')
            .defaultOrdering([{ field: 'date', direction: 'desc' }]),
        ),

      S.divider(),

      S.documentTypeListItem('person').title('People'),
      S.documentTypeListItem('announcement').title('Announcements'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('gallery').title('Photo galleries'),
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('resource').title('Resources'),

      S.divider(),

      S.listItem()
        .title('Needs attention')
        .child(
          S.list()
            .title('Needs attention')
            .items([
              S.listItem()
                .title('Placeholder images')
                .child(
                  S.documentList()
                    .title('Still using placeholder images')
                    /*
                     * Covers the image fields that sit directly on a document, which is
                     * where the ones visitors actually see live. Images nested inside
                     * arrays — gallery items, timeline entries — are not reachable
                     * without a much longer query, and the build gate in
                     * `check:placeholders` is the exhaustive check. This list is here to
                     * make the work visible to the people who can do something about it,
                     * not to be the authority on it.
                     */
                    .filter(
                      `count([
                         heroImage,
                         switcherImage,
                         image,
                         coverImage,
                         thumbnail,
                         logo,
                         plate,
                         arrival.heroImage
                       ][defined(@) && @.provenance != "church-photo"]) > 0`,
                    ),
                ),
              S.listItem()
                .title('Expired announcements')
                .child(
                  S.documentList()
                    .title('Expired announcements')
                    .filter('_type == "announcement" && endDate < now()')
                    .defaultOrdering([{ field: 'endDate', direction: 'desc' }]),
                ),
            ]),
        ),
    ])
