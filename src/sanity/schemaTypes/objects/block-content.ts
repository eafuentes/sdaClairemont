import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * The standard Portable Text configuration, used everywhere prose belongs.
 *
 * The style list is deliberately short. H1 is absent because the page itself owns the
 * only H1 on any route, and letting an editor add a second one inside the body is how a
 * document outline quietly breaks for screen-reader users. H4 and below are absent
 * because nothing on this site is nested that deeply, and offering the option invites
 * someone to pick a heading level for its size rather than its meaning.
 *
 * Only two annotations: emphasis and links. No inline colour, no font size, no text
 * alignment. Those are design decisions, and moving them into the editor is how a
 * considered typographic system becomes an inconsistent one within a month.
 */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading', value: 'h2' },
        { title: 'Subheading', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bulleted', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          defineField({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Web address',
                type: 'url',
                description:
                  'A full address starting with https:// for another site, or a path like /visit for a page on this site.',
                validation: (rule) =>
                  rule
                    .required()
                    .uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true }),
              }),
            ],
          }),
        ],
      },
    }),
    /*
     * Images are allowed inside prose, and carry the same alt and provenance
     * requirements as everywhere else. An editor should never encounter a second,
     * laxer image field just because it happens to sit inside a paragraph.
     */
    defineArrayMember({ type: 'imageWithAlt', name: 'inlineImage', title: 'Image' }),
  ],
})
