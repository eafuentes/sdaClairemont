import { defineArrayMember, defineField, defineType } from 'sanity'

import { YOUTUBE_URL_PATTERN } from '../objects/video-ref'

/**
 * A recorded message.
 *
 * The speaker is either a reference or free text, for the same reason as everywhere else
 * in this schema: visiting speakers are common, and requiring a full `person` document
 * for someone preaching once means the sermon goes up without a speaker at all.
 */
export const sermon = defineType({
  name: 'sermon',
  title: 'Sermon',
  type: 'document',
  groups: [
    { name: 'details', title: 'Details', default: true },
    { name: 'video', title: 'Video' },
    { name: 'related', title: 'Related' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Sermon title',
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
      title: 'Date preached',
      type: 'date',
      group: 'details',
      options: { dateFormat: 'MMMM D, YYYY' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'speaker',
      title: 'Speaker',
      type: 'reference',
      to: [{ type: 'person' }],
      group: 'details',
      description: 'For our own pastors and elders. For a visiting speaker, use the name below.',
    }),
    defineField({
      name: 'speakerName',
      title: 'Visiting speaker',
      type: 'string',
      group: 'details',
      description: 'Their name, if they are not on our leadership page.',
    }),
    defineField({
      name: 'speakerRole',
      title: 'Visiting speaker\u2019s role',
      type: 'string',
      group: 'details',
      description: 'Optional. For example: Conference Youth Director.',
    }),
    defineField({
      name: 'scripture',
      title: 'Scripture',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'scriptureRef' })],
    }),
    defineField({
      name: 'description',
      title: 'What is it about?',
      type: 'text',
      rows: 4,
      group: 'details',
      description: 'A short paragraph, for someone deciding whether to watch.',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube link',
      type: 'url',
      group: 'video',
      description: 'Paste the full YouTube link.',
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ['https'] })
          .custom((value) =>
            !value || YOUTUBE_URL_PATTERN.test(value)
              ? true
              : 'That does not look like a YouTube link. It should look like https://www.youtube.com/watch?v=... or https://youtu.be/...',
          ),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Custom thumbnail',
      type: 'imageWithAlt',
      group: 'video',
      description: "Optional. Leave empty to use YouTube's own.",
    }),
    defineField({
      name: 'duration',
      title: 'How long is it?',
      type: 'string',
      group: 'video',
      description: 'For example: 38 min.',
    }),
    defineField({
      name: 'notesFile',
      title: 'Sermon notes',
      type: 'file',
      group: 'video',
      description: 'Optional. A PDF people can follow along with.',
    }),
    defineField({
      name: 'ministry',
      title: 'Related ministry',
      type: 'reference',
      to: [{ type: 'ministry' }],
      group: 'related',
    }),
    defineField({
      name: 'featured',
      title: 'Feature this on the homepage',
      type: 'boolean',
      group: 'related',
      description: 'Leave off and the homepage shows the most recent sermon automatically.',
      initialValue: false,
    }),
  ],
  validation: (rule) =>
    rule.custom((document) => {
      const value = document as { speaker?: unknown; speakerName?: string } | undefined
      if (value?.speaker || value?.speakerName) return true
      return {
        message: 'Choose a speaker, or type the name of the visiting speaker.',
        paths: [['speakerName']],
      }
    }),
  orderings: [{ title: 'Most recent', name: 'recent', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      speakerName: 'speakerName',
      referencedSpeaker: 'speaker.name',
      media: 'thumbnail',
    },
    prepare({ title, date, speakerName, referencedSpeaker, media }) {
      return {
        title,
        subtitle: [date, referencedSpeaker ?? speakerName].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
