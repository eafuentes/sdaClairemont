import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * One Sabbath's program. The type the whole CMS is judged by.
 *
 * This is the document a volunteer opens on a Thursday evening, often on a phone, often
 * without having been shown how. Every choice here is made for that person.
 *
 * **The date is validated to a Saturday as a warning, not an error.** Almost every
 * program is a Saturday, so flagging a Tuesday catches a real mistake. But a special
 * Sunday service is a real thing too, and a schema that refuses to save it teaches the
 * volunteer that the CMS is something to work around rather than with.
 *
 * **Service times are optional and default from Site Settings.** Filling them in every
 * week would be transcription, and transcription is where errors come from. They exist
 * only for the Sabbath that starts early because of a potluck.
 *
 * **The speaker is a reference or free text.** Guest speakers are common and creating a
 * `person` document for someone preaching once is friction that ends with the field
 * left empty.
 */
export const sabbathProgram = defineType({
  name: 'sabbathProgram',
  title: 'Sabbath program',
  type: 'document',
  groups: [
    { name: 'sermon', title: 'The message', default: true },
    { name: 'schedule', title: 'Times' },
    { name: 'extras', title: 'Music and notices' },
    { name: 'media', title: 'Media' },
  ],
  fields: [
    defineField({
      name: 'date',
      title: 'Which Sabbath?',
      type: 'date',
      group: 'sermon',
      options: { dateFormat: 'dddd, MMMM D, YYYY' },
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true
          /*
           * Parsed as a plain calendar date. `new Date('2026-08-29')` is midnight UTC,
           * which is Friday evening in California and would report the wrong weekday for
           * every Saturday in the dataset.
           */
          const [year, month, day] = value.split('-').map(Number)
          if (year === undefined || month === undefined || day === undefined) return true
          const isSaturday = new Date(year, month - 1, day).getDay() === 6
          return isSaturday
            ? true
            : 'This is not a Saturday. That is fine for a special service — just checking it was intended.'
        }),
    }),
    defineField({
      name: 'sermonTitle',
      title: 'Sermon title',
      type: 'string',
      group: 'sermon',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'speaker',
      title: 'Speaker',
      type: 'reference',
      to: [{ type: 'person' }],
      group: 'sermon',
      description: 'For our own pastors and elders. For a visiting speaker, use the name below.',
    }),
    defineField({
      name: 'speakerName',
      title: 'Visiting speaker',
      type: 'string',
      group: 'sermon',
      description: 'Their name, if they are not on our leadership page.',
    }),
    defineField({
      name: 'speakerRole',
      title: 'Visiting speaker\u2019s role',
      type: 'string',
      group: 'sermon',
      description: 'Optional. For example: Conference Youth Director.',
    }),
    defineField({
      name: 'scripture',
      title: 'Scripture',
      type: 'array',
      group: 'sermon',
      of: [defineArrayMember({ type: 'scriptureRef' })],
    }),
    defineField({
      name: 'sermonSummary',
      title: 'What is it about?',
      type: 'text',
      rows: 3,
      group: 'sermon',
      description: 'A couple of sentences. This appears on the homepage during the week.',
    }),
    defineField({
      name: 'isSpecialService',
      title: 'This is a special service',
      type: 'boolean',
      group: 'sermon',
      description: 'Communion, a baptism, Youth Sabbath, and so on.',
      initialValue: false,
    }),
    defineField({
      name: 'specialServiceLabel',
      title: 'What kind?',
      type: 'string',
      group: 'sermon',
      description: 'Shown as a small label. For example: Communion Sabbath.',
      hidden: ({ document }) => !document?.isSpecialService,
      validation: (rule) =>
        rule.custom((value, context) => {
          const isSpecial = (context.document as { isSpecialService?: boolean } | undefined)
            ?.isSpecialService
          if (!isSpecial) return true
          return value ? true : 'Say what kind of special service this is.'
        }),
    }),
    defineField({
      name: 'sabbathSchoolTime',
      title: 'Sabbath School',
      type: 'string',
      group: 'schedule',
      description:
        'Only fill this in if it differs from the usual time. Left empty, the site uses the time from Site Settings.',
    }),
    defineField({
      name: 'worshipTime',
      title: 'Divine Worship',
      type: 'string',
      group: 'schedule',
      description: 'Same again — only if it differs this week.',
    }),
    defineField({
      name: 'specialMusic',
      title: 'Special music',
      type: 'array',
      group: 'extras',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'musicItem',
          fields: [
            defineField({
              name: 'title',
              title: 'Piece',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'performer', title: 'Performed by', type: 'string' }),
          ],
          preview: { select: { title: 'title', subtitle: 'performer' } },
        }),
      ],
    }),
    defineField({
      name: 'announcements',
      title: 'Notices',
      type: 'array',
      group: 'extras',
      of: [{ type: 'reference', to: [{ type: 'announcement' }] }],
      description: 'Pick from the notices already written. Add new ones under Announcements.',
    }),
    defineField({
      name: 'featuredMessage',
      title: 'A note from the pastor',
      type: 'blockContent',
      group: 'extras',
      description: 'Optional. A short word for the week.',
    }),
    defineField({ name: 'image', title: 'Photograph', type: 'imageWithAlt', group: 'media' }),
    defineField({
      name: 'bulletin',
      title: 'Bulletin',
      type: 'file',
      group: 'media',
      description: 'The PDF, if there is one.',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'livestreamUrl',
      title: 'Livestream link',
      type: 'url',
      group: 'media',
      description: "This week's stream, if it differs from the usual channel.",
      validation: (rule) => rule.uri({ scheme: ['https'] }),
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
  orderings: [
    { title: 'Most recent first', name: 'recent', by: [{ field: 'date', direction: 'desc' }] },
    { title: 'Oldest first', name: 'oldest', by: [{ field: 'date', direction: 'asc' }] },
  ],
  preview: {
    select: {
      date: 'date',
      sermonTitle: 'sermonTitle',
      speakerName: 'speakerName',
      referencedSpeaker: 'speaker.name',
      specialServiceLabel: 'specialServiceLabel',
      media: 'image',
    },
    prepare({ date, sermonTitle, speakerName, referencedSpeaker, specialServiceLabel, media }) {
      const formatted = date
        ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
        : 'No date set'

      return {
        title: formatted,
        subtitle: [sermonTitle, referencedSpeaker ?? speakerName, specialServiceLabel]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
