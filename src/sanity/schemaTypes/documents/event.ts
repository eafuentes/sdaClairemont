import { defineField, defineType } from 'sanity'

/**
 * Something happening on a specific date.
 *
 * `atChurch` is a boolean rather than an address field, because most events are at the
 * church and re-typing the address every time is both tedious and a way for a stale
 * address to end up on the site. When it is off, a custom location appears.
 *
 * `recurrence` is deliberately shallow — enough to express "second Sunday, monthly,
 * until June" and nothing more. Implementing RFC 5545 properly is weeks of work and a
 * lifetime of edge cases, and no volunteer has ever wanted to describe an event in
 * terms of BYSETPOS.
 */
export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [
    { name: 'details', title: 'Details', default: true },
    { name: 'when', title: 'When and where' },
    { name: 'signup', title: 'Signing up' },
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
      name: 'shortDescription',
      title: 'In one sentence',
      type: 'string',
      group: 'details',
      description: 'This is what shows in the list on the homepage.',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'description',
      title: 'Full details',
      type: 'blockContent',
      group: 'details',
    }),
    defineField({ name: 'image', title: 'Photograph', type: 'imageWithAlt', group: 'details' }),
    defineField({
      name: 'ministry',
      title: 'Which ministry?',
      type: 'reference',
      to: [{ type: 'ministry' }],
      group: 'details',
    }),
    defineField({
      name: 'featured',
      title: 'Feature this',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      name: 'startDateTime',
      title: 'Starts',
      type: 'datetime',
      group: 'when',
      options: { dateFormat: 'MMMM D, YYYY', timeFormat: 'h:mm A' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDateTime',
      title: 'Ends',
      type: 'datetime',
      group: 'when',
      options: { dateFormat: 'MMMM D, YYYY', timeFormat: 'h:mm A' },
      validation: (rule) =>
        rule
          .min(rule.valueOfField('startDateTime'))
          .error('The end time needs to be after the start time.'),
    }),
    defineField({
      name: 'isAllDay',
      title: 'This runs all day',
      type: 'boolean',
      group: 'when',
      initialValue: false,
    }),
    defineField({
      name: 'atChurch',
      title: 'This is at the church',
      type: 'boolean',
      group: 'when',
      description: 'Leave this on and the church address is used automatically.',
      initialValue: true,
    }),
    defineField({
      name: 'locationName',
      title: 'Where is it?',
      type: 'string',
      group: 'when',
      description: 'The name of the place. For example: Cuyamaca Rancho State Park.',
      hidden: ({ document }) => document?.atChurch !== false,
      validation: (rule) =>
        rule.custom((value, context) => {
          const atChurch = (context.document as { atChurch?: boolean } | undefined)?.atChurch
          if (atChurch !== false) return true
          return value ? true : 'Say where this event is happening.'
        }),
    }),
    defineField({
      name: 'locationAddress',
      title: 'Address',
      type: 'string',
      group: 'when',
      hidden: ({ document }) => document?.atChurch !== false,
    }),
    defineField({
      name: 'locationMapUrl',
      title: 'Map link',
      type: 'url',
      group: 'when',
      hidden: ({ document }) => document?.atChurch !== false,
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'recurrence',
      title: 'Does this repeat?',
      type: 'object',
      group: 'when',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'frequency',
          title: 'How often',
          type: 'string',
          options: {
            list: [
              { title: 'Does not repeat', value: 'none' },
              { title: 'Weekly', value: 'weekly' },
              { title: 'Monthly', value: 'monthly' },
            ],
          },
          initialValue: 'none',
        }),
        defineField({
          name: 'interval',
          title: 'Every how many?',
          type: 'number',
          description: 'For example, 2 with "Weekly" means every other week.',
          initialValue: 1,
          validation: (rule) => rule.integer().positive(),
        }),
        defineField({
          name: 'until',
          title: 'Until',
          type: 'date',
          options: { dateFormat: 'MMMM D, YYYY' },
          description: 'When it stops repeating. Leave empty if it is open-ended.',
        }),
      ],
    }),
    defineField({
      name: 'cost',
      title: 'Cost',
      type: 'string',
      group: 'signup',
      description: 'Write "Free" if it is free — saying so plainly matters to some families.',
    }),
    defineField({
      name: 'ageRange',
      title: 'Who is it for?',
      type: 'string',
      group: 'signup',
      description: 'For example: Everyone, or Ages 10-15.',
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Sign-up link',
      type: 'url',
      group: 'signup',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'contactPerson',
      title: 'Who to ask',
      type: 'reference',
      to: [{ type: 'person' }],
      group: 'signup',
    }),
    defineField({ name: 'seo', title: 'Search and sharing', type: 'seo', group: 'details' }),
  ],
  orderings: [
    { title: 'Soonest first', name: 'soonest', by: [{ field: 'startDateTime', direction: 'asc' }] },
    {
      title: 'Most recent first',
      name: 'recent',
      by: [{ field: 'startDateTime', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      startDateTime: 'startDateTime',
      ministryName: 'ministry.name',
      media: 'image',
    },
    prepare({ title, startDateTime, ministryName, media }) {
      const when = startDateTime
        ? new Date(startDateTime).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'America/Los_Angeles',
          })
        : 'No date set'

      return { title, subtitle: [when, ministryName].filter(Boolean).join(' · '), media }
    },
  },
})
