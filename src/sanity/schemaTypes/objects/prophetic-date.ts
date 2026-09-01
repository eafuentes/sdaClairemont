import { defineField, defineType } from 'sanity'

/**
 * A prophetic date is not an ISO day. Several points are seasonal, there is no
 * year zero, and the display string is what a reader should see.
 */
export const propheticDate = defineType({
  name: 'propheticDate',
  title: 'Prophetic date',
  type: 'object',
  fields: [
    defineField({
      name: 'era',
      title: 'Era',
      type: 'string',
      options: {
        list: [
          { title: 'BC', value: 'bc' },
          { title: 'AD', value: 'ad' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'The year number only. 457 for 457 BC, 27 for AD 27. There is no year zero.',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'season',
      title: 'Season',
      type: 'string',
      options: {
        list: [
          { title: 'Spring', value: 'spring' },
          { title: 'Summer', value: 'summer' },
          { title: 'Autumn', value: 'autumn' },
          { title: 'Winter', value: 'winter' },
        ],
      },
    }),
    defineField({
      name: 'display',
      title: 'How it reads',
      type: 'string',
      description: 'What visitors see. For example: Autumn AD 27.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { display: 'display', era: 'era', year: 'year' },
    prepare({ display, era, year }) {
      return {
        title: display,
        subtitle: era && year ? `${year} ${String(era).toUpperCase()}` : undefined,
      }
    },
  },
})
