import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * A flexible editorial page — /visit, /about, /give, and whatever staff need later.
 *
 * The block set is short on purpose. An unconstrained page builder is how a considered
 * design becomes an inconsistent one: given enough blocks, a page accumulates six
 * variations of the same idea, and the site stops looking like one thing. Everything
 * here is a composition the design system already knows how to render well.
 */
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'Search and sharing' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      description: 'This becomes the address, for example /visit.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Banner photograph',
      type: 'imageWithAlt',
      group: 'content',
      description: 'Optional. Leave some quiet space at the top — the page title sits over it.',
    }),
    defineField({
      name: 'intro',
      title: 'Opening paragraph',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Sets up the page. Shown larger than the rest of the text.',
    }),
    defineField({
      name: 'content',
      title: 'Page content',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({ type: 'block', styles: [], marks: {} }),
        defineArrayMember({ type: 'imageWithAlt', name: 'imagePlate', title: 'Photograph' }),
        defineArrayMember({ type: 'scriptureRef', name: 'scripture', title: 'Scripture quote' }),
        defineArrayMember({ type: 'cta', name: 'callToAction', title: 'Button' }),
        defineArrayMember({ type: 'videoRef', name: 'video', title: 'Video' }),
        defineArrayMember({
          type: 'reference',
          name: 'galleryEmbed',
          title: 'Photo gallery',
          to: [{ type: 'gallery' }],
        }),
        defineArrayMember({
          type: 'object',
          name: 'linkList',
          title: 'List of links',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [defineArrayMember({ type: 'cta' })],
            }),
          ],
          preview: { select: { title: 'heading' } },
        }),
        defineArrayMember({
          type: 'object',
          name: 'accordion',
          title: 'Questions and answers',
          description: 'Good for the questions a first-time visitor is too polite to ask.',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({
              name: 'items',
              title: 'Questions',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'accordionItem',
                  fields: [
                    defineField({
                      name: 'question',
                      title: 'Question',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'answer',
                      title: 'Answer',
                      type: 'blockContent',
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: { select: { title: 'question' } },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'heading' } },
        }),
      ],
    }),
    defineField({ name: 'seo', title: 'Search and sharing', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', media: 'heroImage' },
    prepare({ title, slug, media }) {
      return { title, subtitle: slug ? `/${slug}` : 'No address set', media }
    },
  },
})
