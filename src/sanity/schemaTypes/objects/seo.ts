import { defineField, defineType } from 'sanity'

/**
 * Per-document search and social overrides.
 *
 * Every field is optional. Routes derive sensible metadata from the content they
 * already have, and this object exists for the cases where the derived version is
 * wrong — not as a checklist an editor has to complete before publishing. A required
 * SEO tab is how publishing a Sabbath program on a Thursday night becomes a chore.
 */
export const seo = defineType({
  name: 'seo',
  title: 'Search and sharing',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Title override',
      type: 'string',
      description:
        'Leave empty to use the page title. Around 60 characters is what Google shows before cutting it off.',
      validation: (rule) => rule.max(70).warning('Longer than this usually gets truncated.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description:
        'The sentence under the link in search results, and the preview text when someone shares the page. Write it for a person deciding whether to click.',
      validation: (rule) => rule.max(160).warning('Longer than this usually gets truncated.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Sharing image',
      type: 'imageWithAlt',
      description:
        'Shown when the page is shared on Facebook or in a text message. Landscape works best. Leave empty to use the site default.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide this page from search engines',
      type: 'boolean',
      description:
        'For pages that should exist but not be found, such as a link you only share with a specific group.',
      initialValue: false,
    }),
  ],
})
