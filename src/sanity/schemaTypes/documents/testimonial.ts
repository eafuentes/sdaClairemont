import { defineField, defineType } from 'sanity'

/**
 * Someone's own words about this church.
 *
 * The attribution is either a reference to a `person` or a plain name, because most
 * people who say something worth quoting are not on the leadership page, and requiring
 * a full person document for a one-line quote means the quote never gets added.
 */
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'What they said',
      type: 'text',
      rows: 4,
      description:
        'Their words, lightly tidied at most. Specific beats glowing — "I sat at the back for a month and nobody made a fuss" says more than "everyone is so welcoming."',
      validation: (rule) => rule.required().max(320).warning('Long quotes lose their force.'),
    }),
    defineField({
      name: 'personRef',
      title: 'Are they on the leadership page?',
      type: 'reference',
      to: [{ type: 'person' }],
      description: 'If so, choose them here and leave the name below empty.',
    }),
    defineField({
      name: 'personName',
      title: 'Name',
      type: 'string',
      description: 'For everyone else. First name alone is fine if they prefer.',
    }),
    defineField({
      name: 'personContext',
      title: 'A few words about them',
      type: 'string',
      description:
        'What grounds the quote. For example: "Member since 2019" or "Started coming last spring."',
    }),
    defineField({ name: 'image', title: 'Photograph', type: 'imageWithAlt' }),
    defineField({
      name: 'ministry',
      title: 'Related ministry',
      type: 'reference',
      to: [{ type: 'ministry' }],
      description: 'Optional. If this quote is about a particular ministry.',
    }),
    defineField({
      name: 'featured',
      title: 'Can appear on the homepage',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  validation: (rule) =>
    rule.custom((document) => {
      const value = document as { personRef?: unknown; personName?: string } | undefined
      if (value?.personRef || value?.personName) return true
      return {
        message: 'A quote needs someone attached to it — either choose a person or type a name.',
        paths: [['personName']],
      }
    }),
  preview: {
    select: {
      quote: 'quote',
      personName: 'personName',
      referencedName: 'personRef.name',
      media: 'image',
    },
    prepare({ quote, personName, referencedName, media }) {
      return {
        title: personName ?? referencedName ?? 'Unattributed',
        subtitle: quote,
        media,
      }
    },
  },
})
