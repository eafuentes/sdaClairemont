import { defineField, defineType } from 'sanity'

export const WEEKDAYS = [
  { title: 'Sunday', value: 'sunday' },
  { title: 'Monday', value: 'monday' },
  { title: 'Tuesday', value: 'tuesday' },
  { title: 'Wednesday', value: 'wednesday' },
  { title: 'Thursday', value: 'thursday' },
  { title: 'Friday', value: 'friday' },
  { title: 'Saturday', value: 'saturday' },
] as const

/**
 * One recurring service, as it appears in Site Settings.
 *
 * Times are stored as display strings rather than as `datetime` values, and that is a
 * considered choice. "9:30 AM" every Saturday is a recurring wall-clock time, not an
 * instant — binding it to a date would mean re-deriving it weekly, and storing it as a
 * time-with-timezone invites a UTC conversion that shifts it by an hour twice a year.
 * A one-off service with a real date is an `event`, which does use `datetime`.
 *
 * The cost is that the format is not machine-validated, so the validation below checks
 * the shape rather than trusting it.
 */
export const serviceTime = defineType({
  name: 'serviceTime',
  title: 'Service time',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'What is it called?',
      type: 'string',
      description: 'For example: Sabbath School, Divine Worship, Prayer Meeting.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'day',
      title: 'Day',
      type: 'string',
      options: { list: [...WEEKDAYS] },
      initialValue: 'saturday',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Start time',
      type: 'string',
      description: 'Written the way it should appear on the page, for example 9:30 AM.',
      validation: (rule) =>
        rule
          .required()
          .regex(/^\d{1,2}:\d{2}\s?(AM|PM)$/i, {
            name: 'time',
            invert: false,
          })
          .error('Please write the time like 9:30 AM or 11:00 AM.'),
    }),
    defineField({
      name: 'endTime',
      title: 'End time',
      type: 'string',
      description: 'Optional. Leave empty if it varies.',
      validation: (rule) =>
        rule
          .regex(/^\d{1,2}:\d{2}\s?(AM|PM)$/i, { name: 'time' })
          .error('Please write the time like 12:15 PM.'),
    }),
    defineField({
      name: 'notes',
      title: 'Anything a visitor should know',
      type: 'string',
      description: 'Optional. For example: "Children\'s classes meet in the west wing."',
    }),
    defineField({
      name: 'isPrimary',
      title: 'Show this on the homepage',
      type: 'boolean',
      description:
        'The homepage shows only the main services, so a first-time visitor sees when to arrive without reading a list. Usually Sabbath School and Divine Worship.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { label: 'label', day: 'day', startTime: 'startTime', isPrimary: 'isPrimary' },
    prepare({ label, day, startTime, isPrimary }) {
      const dayTitle = WEEKDAYS.find((weekday) => weekday.value === day)?.title ?? day
      return {
        title: label,
        subtitle: [dayTitle, startTime, isPrimary ? '· on homepage' : null]
          .filter(Boolean)
          .join(' '),
      }
    },
  },
})
