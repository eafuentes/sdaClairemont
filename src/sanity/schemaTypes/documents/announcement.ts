import { defineField, defineType } from 'sanity'

/**
 * A time-limited notice.
 *
 * `endDate` is required, and that is the entire point of the type. Announcements that
 * have to be deleted by hand are announcements that sit on a church website for two
 * years — every stale notice makes the next one less believable. Making the expiry a
 * required field at the moment of writing, when the author knows when it stops
 * mattering, is what keeps the site current without anyone maintaining it.
 */
export const announcement = defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Details',
      type: 'blockContent',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start showing on',
      type: 'date',
      options: { dateFormat: 'MMMM D, YYYY' },
      description: 'Leave as today to show it straight away.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Stop showing on',
      type: 'date',
      options: { dateFormat: 'MMMM D, YYYY' },
      description:
        'Required. After this date the announcement disappears on its own, so nobody has to remember to remove it.',
      validation: (rule) =>
        rule
          .required()
          .min(rule.valueOfField('startDate'))
          .error('The end date needs to be on or after the start date.'),
    }),
    defineField({
      name: 'priority',
      title: 'How prominent?',
      type: 'string',
      options: {
        list: [
          { title: 'Normal', value: 'normal' },
          { title: 'Important', value: 'important' },
          { title: 'Urgent', value: 'urgent' },
        ],
        layout: 'radio',
      },
      initialValue: 'normal',
      description:
        'Urgent is for genuine disruptions — a cancelled service, a change of venue. Used sparingly it gets read; used often it gets ignored.',
    }),
    defineField({
      name: 'link',
      title: 'Read more',
      type: 'link',
      description: 'Optional. Somewhere with the full details.',
    }),
    defineField({
      name: 'ministry',
      title: 'Related ministry',
      type: 'reference',
      to: [{ type: 'ministry' }],
    }),
    defineField({
      name: 'showOnHomepage',
      title: 'Show on the homepage',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Ending soonest',
      name: 'endingSoonest',
      by: [{ field: 'endDate', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', endDate: 'endDate', priority: 'priority' },
    prepare({ title, endDate, priority }) {
      const hasExpired = endDate ? new Date(endDate) < new Date() : false
      return {
        title,
        subtitle: [
          hasExpired ? 'EXPIRED' : `Until ${endDate}`,
          priority !== 'normal' ? priority : null,
        ]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
