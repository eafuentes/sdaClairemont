import { defineField, defineType } from 'sanity'

/**
 * A scripture reference, kept structured rather than as a sentence.
 *
 * Book, chapter and verses are separate fields because they are separate facts, and
 * keeping them apart is what lets the site format a reference consistently, sort by
 * book, and eventually link to a passage — none of which is possible once "John 3:16"
 * is a string someone typed. The translation is recorded because quoting the NKJV and
 * labelling it NIV is a real error with a real cost in a church.
 */
export const scriptureRef = defineType({
  name: 'scriptureRef',
  title: 'Scripture reference',
  type: 'object',
  fields: [
    defineField({
      name: 'book',
      title: 'Book',
      type: 'string',
      description: 'For example: John, 1 Corinthians, Psalms.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'chapter',
      title: 'Chapter',
      type: 'number',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'verses',
      title: 'Verses',
      type: 'string',
      description: 'Optional. A single verse like 16, or a range like 16-17.',
    }),
    defineField({
      name: 'translation',
      title: 'Translation',
      type: 'string',
      options: {
        list: [
          { title: 'New King James Version', value: 'NKJV' },
          { title: 'King James Version', value: 'KJV' },
          { title: 'New International Version', value: 'NIV' },
          { title: 'English Standard Version', value: 'ESV' },
          { title: 'New Living Translation', value: 'NLT' },
        ],
      },
      initialValue: 'NKJV',
    }),
    defineField({
      name: 'text',
      title: 'The passage itself',
      type: 'text',
      rows: 4,
      description:
        'Optional, and only needed where the words are shown on the page rather than just cited. Paste the verse exactly as it appears in the translation above.',
    }),
  ],
  preview: {
    select: {
      book: 'book',
      chapter: 'chapter',
      verses: 'verses',
      translation: 'translation',
      text: 'text',
    },
    prepare({ book, chapter, verses, translation, text }) {
      const citation = `${book} ${chapter}${verses ? `:${verses}` : ''}`
      return {
        title: translation ? `${citation} (${translation})` : citation,
        subtitle: text ?? undefined,
      }
    },
  },
})
