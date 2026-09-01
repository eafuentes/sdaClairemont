import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * The prophecy timeline. A singleton. Staff edit the dates, the copy, and the
 * objections — never x/y positions. The constellation is derived from the dates.
 */
export const prophecyPage = defineType({
  name: 'prophecyPage',
  title: 'Prophecy timeline',
  type: 'document',
  description:
    'Edit dates, copy, and objections. The flight is built from the dates — there are no positions to set.',
  groups: [
    { name: 'opening', title: 'Opening', default: true },
    { name: 'years', title: 'Years' },
    { name: 'spine', title: 'Scale & fold' },
    { name: 'lanes', title: 'The lanes' },
    { name: 'closing', title: 'Closing' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      group: 'opening',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Kicker',
      type: 'string',
      group: 'opening',
      description: 'Usually the lead passage, for example Daniel 8:14.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lede',
      title: 'Opening paragraph',
      type: 'text',
      rows: 3,
      group: 'opening',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'scripture',
      title: 'Lead scripture',
      type: 'scriptureRef',
      group: 'opening',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Further introduction',
      type: 'array',
      group: 'opening',
      of: [defineArrayMember({ type: 'text', rows: 3 })],
    }),
    defineField({
      name: 'periods',
      title: 'Prophetic periods',
      type: 'array',
      group: 'spine',
      description:
        'Usually two: the 2,300 years, and the 490 nested inside them. Drawn to true scale. Do not add a fold here.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'propheticPeriod',
          fields: [
            defineField({
              name: 'key',
              title: 'Which period',
              type: 'string',
              options: {
                list: [
                  { title: '2,300 years', value: '2300' },
                  { title: '490 years', value: '490' },
                ],
                layout: 'radio',
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'years',
              title: 'Length in years',
              type: 'number',
              validation: (rule) => rule.required().integer().positive(),
            }),
            defineField({
              name: 'start',
              title: 'Starts',
              type: 'propheticDate',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'end',
              title: 'Ends',
              type: 'propheticDate',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'nestedIn',
              title: 'Nested inside',
              type: 'string',
              description: 'For the 490, choose 2,300 years. Leave blank on the longer period.',
              options: {
                list: [{ title: '2,300 years', value: '2300' }],
              },
            }),
          ],
          preview: {
            select: { title: 'label', years: 'years', start: 'start.display', end: 'end.display' },
            prepare({ title, years, start, end }) {
              return {
                title,
                subtitle: [years && `${years} years`, start && end && `${start} – ${end}`]
                  .filter(Boolean)
                  .join(' · '),
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'spine',
      title: 'Years',
      type: 'array',
      group: 'years',
      description:
        'Each item is a year visitors can open in the flight. Date, title, scripture, and the short summary are what they see when they click the node. The longer explanation and objections sit in the chronology underneath. Add a row to add a year. The unlabeled dots between years are the clock — they have no copy.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'propheticEvent',
          fields: [
            defineField({
              name: 'key',
              title: 'Id',
              type: 'slug',
              options: { source: 'title', maxLength: 48 },
              description:
                'A short stable word: decree, baptism, sanctuary. The fold field must match one of these.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'date',
              title: 'Year',
              type: 'propheticDate',
              description: 'Changing the year moves this station in the flight.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'scripture',
              title: 'Scripture',
              type: 'scriptureRef',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'summary',
              title: 'What this year says',
              type: 'text',
              rows: 3,
              description:
                'Shown when someone clicks this year in the flight. One or two sentences.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'explanation',
              title: 'Fuller explanation',
              type: 'array',
              description: 'The chronology underneath. Not required for the flight card.',
              of: [defineArrayMember({ type: 'text', rows: 4 })],
            }),
            defineField({
              name: 'arithmetic',
              title: 'Arithmetic',
              type: 'object',
              options: { collapsible: true, collapsed: true },
              fields: [
                defineField({ name: 'from', title: 'From', type: 'string' }),
                defineField({ name: 'plus', title: 'Plus', type: 'string' }),
                defineField({ name: 'result', title: 'Equals', type: 'string' }),
                defineField({ name: 'note', title: 'Note', type: 'string' }),
              ],
            }),
            defineField({
              name: 'objections',
              title: 'Objections',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'propheticObjection',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Question',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'paragraphs',
                      title: 'Answer',
                      type: 'array',
                      of: [defineArrayMember({ type: 'text', rows: 4 })],
                    }),
                  ],
                  preview: { select: { title: 'title' } },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: 'title', date: 'date.display' },
            prepare({ title, date }) {
              return { title: date ?? title, subtitle: title }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'fold',
      title: 'The fold',
      type: 'object',
      group: 'spine',
      description:
        'Where empty centuries are compressed. Always labeled. The two prophetic periods themselves are never folded.',
      fields: [
        defineField({
          name: 'beforeEventKey',
          title: 'Folds before this event',
          type: 'string',
          description: 'Must match a spine event Id. Usually sanctuary — the 1844 station.',
          options: {
            list: [
              { title: 'The decree', value: 'decree' },
              { title: 'Jerusalem rebuilt', value: 'rebuilt' },
              { title: 'The baptism', value: 'baptism' },
              { title: 'The crucifixion', value: 'crucifixion' },
              { title: 'The gospel to the nations', value: 'stephen' },
              { title: 'The sanctuary cleansed', value: 'sanctuary' },
            ],
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'yearsFolded',
          title: 'Years folded',
          type: 'number',
          validation: (rule) => rule.required().integer().positive(),
        }),
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'explanation',
          title: 'Explanation',
          type: 'text',
          rows: 4,
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'empires',
      title: 'Empire alignments',
      type: 'array',
      group: 'lanes',
      description:
        'Daniel 2, 7 and 8 naming the same four kingdoms. Leave a symbol blank if that prophecy is silent. Dates here also place the empire nodes in the flight.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'empireAlignment',
          fields: [
            defineField({
              name: 'empire',
              title: 'Empire',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'span',
              title: 'Dates, as a label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'start',
              title: 'Begins',
              type: 'propheticDate',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'end',
              title: 'Ends',
              type: 'propheticDate',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'daniel2', title: 'Daniel 2', type: 'string' }),
            defineField({ name: 'daniel7', title: 'Daniel 7', type: 'string' }),
            defineField({ name: 'daniel8', title: 'Daniel 8', type: 'string' }),
            defineField({ name: 'daniel11', title: 'Daniel 11', type: 'string' }),
            defineField({ name: 'revelation', title: 'Revelation', type: 'string' }),
          ],
          preview: { select: { title: 'empire', subtitle: 'span' } },
        }),
      ],
    }),
    defineField({
      name: 'close',
      title: 'Close',
      type: 'object',
      group: 'closing',
      fields: [
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'text',
          rows: 4,
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Prophecy timeline', subtitle: '/prophecy' }
    },
  },
})
