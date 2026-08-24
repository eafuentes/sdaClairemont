import { defineField, defineType } from 'sanity'

import { WEEKDAYS } from './service-time'

/**
 * When a ministry meets.
 *
 * Structured rather than a free-text sentence, because the real schedules here are not
 * simple. Adventurers meeting "twice monthly on Sundays during the school year" needs a
 * frequency and a seasonal note, and squashing that into one string means the site can
 * never do anything with it but print it.
 */
export const meetingSchedule = defineType({
  name: 'meetingSchedule',
  title: 'Meeting schedule',
  type: 'object',
  fields: [
    defineField({
      name: 'day',
      title: 'Day',
      type: 'string',
      options: { list: [...WEEKDAYS] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Start time',
      type: 'string',
      description: 'Written the way it should appear, for example 4:00 PM.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endTime',
      title: 'End time',
      type: 'string',
      description: 'Optional.',
    }),
    defineField({
      name: 'frequency',
      title: 'How often',
      type: 'string',
      options: {
        list: [
          { title: 'Every week', value: 'weekly' },
          { title: 'Every other week', value: 'biweekly' },
          { title: 'Twice a month', value: 'twice-monthly' },
          { title: 'Once a month', value: 'monthly' },
          { title: 'Now and then', value: 'occasional' },
        ],
      },
      initialValue: 'weekly',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'notes',
      title: 'Anything else',
      type: 'string',
      description:
        'For example: "During the school year only" or "Check the calendar for exact dates."',
    }),
  ],
  preview: {
    select: { day: 'day', startTime: 'startTime', frequency: 'frequency', notes: 'notes' },
    prepare({ day, startTime, frequency, notes }) {
      const dayTitle = WEEKDAYS.find((weekday) => weekday.value === day)?.title ?? day
      return {
        title: `${dayTitle}s at ${startTime}`,
        subtitle: [frequency, notes].filter(Boolean).join(' · '),
      }
    },
  },
})

/**
 * A number worth stating plainly — years running, members, miles hiked.
 *
 * The description field matters more than it looks. A number without context is a
 * boast; a number with one sentence of context is a reason to trust the place.
 */
export const statistic = defineType({
  name: 'statistic',
  title: 'Statistic',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'The number',
      type: 'string',
      description: 'For example: 40, 120+, 15 years.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'What it counts',
      type: 'string',
      description: 'For example: Pathfinders, years running, campouts a year.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'One sentence of context',
      type: 'string',
      description: 'Optional, but a number on its own rarely means much to a parent reading it.',
    }),
  ],
  preview: {
    select: { value: 'value', label: 'label', subtitle: 'description' },
    prepare({ value, label, subtitle }) {
      return { title: `${value} ${label}`, subtitle }
    },
  },
})

/** One entry in a ministry's history — a campout, an investiture, a trip. */
export const timelineEntry = defineType({
  name: 'timelineEntry',
  title: 'Timeline entry',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'What happened',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'When',
      type: 'date',
      options: { dateFormat: 'MMMM D, YYYY' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Tell the story',
      type: 'text',
      rows: 3,
    }),
    defineField({ name: 'image', title: 'Photograph', type: 'imageWithAlt' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'date', media: 'image' },
  },
})

/**
 * One of the Pathfinder classes. Nested inside the ministry rather than given its own
 * document type, because a class has no page of its own and nothing else references it.
 */
export const pathfinderClass = defineType({
  name: 'pathfinderClass',
  title: 'Pathfinder class',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Class name',
      type: 'string',
      description: 'For example: Friend, Companion, Explorer, Ranger.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ageRange',
      title: 'Ages',
      type: 'string',
      description: 'For example: 10-11.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'What this class does',
      type: 'text',
      rows: 3,
      description: 'Written for a parent deciding whether their child would enjoy it.',
    }),
  ],
  preview: {
    select: { title: 'name', ageRange: 'ageRange', subtitle: 'description' },
    prepare({ title, ageRange, subtitle }) {
      return { title: `${title} (${ageRange})`, subtitle }
    },
  },
})
