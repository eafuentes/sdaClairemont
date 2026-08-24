import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * A set of photographs from one occasion.
 *
 * `layout` is offered because the two shapes carry different meanings: masonry reads as
 * an archive to browse, a horizontal sequence reads as a story told in order. That is an
 * editorial decision about the photographs, which is why an editor makes it — unlike
 * colour or spacing, which are not.
 */
export const gallery = defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  groups: [
    { name: 'details', title: 'Details', default: true },
    { name: 'photographs', title: 'Photographs' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'details',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'When was this?',
      type: 'date',
      group: 'details',
      options: { dateFormat: 'MMMM D, YYYY' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'What was the occasion?',
      type: 'text',
      rows: 3,
      group: 'details',
    }),
    defineField({
      name: 'ministry',
      title: 'Related ministry',
      type: 'reference',
      to: [{ type: 'ministry' }],
      group: 'details',
    }),
    defineField({
      name: 'layout',
      title: 'How should these be shown?',
      type: 'string',
      group: 'details',
      description:
        'Choose a grid when the photographs stand on their own, and a sequence when they tell a story in order.',
      options: {
        list: [
          { title: 'Grid', value: 'masonry' },
          { title: 'Sequence, side to side', value: 'horizontal' },
        ],
        layout: 'radio',
      },
      initialValue: 'masonry',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover photograph',
      type: 'imageWithAlt',
      group: 'photographs',
      description: 'The one that represents the whole set.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Photographs',
      type: 'array',
      group: 'photographs',
      of: [
        defineArrayMember({ type: 'imageWithAlt', name: 'photo', title: 'Photograph' }),
        defineArrayMember({ type: 'videoRef', name: 'video', title: 'Video' }),
      ],
      validation: (rule) => rule.min(1).error('A gallery needs at least one photograph.'),
    }),
    defineField({
      name: 'featured',
      title: 'Can appear on the homepage',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
  ],
  orderings: [{ title: 'Most recent', name: 'recent', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', date: 'date', media: 'coverImage', items: 'items' },
    prepare({ title, date, media, items }) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title,
        subtitle: [date, `${count} ${count === 1 ? 'item' : 'items'}`].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
