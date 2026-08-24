import { defineField, defineType } from 'sanity'

/**
 * A downloadable file or an outside link — forms, study guides, policies.
 */
export const resource = defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'What is it?',
      type: 'text',
      rows: 2,
      description: 'One sentence, so someone knows whether it is the thing they need.',
    }),
    defineField({
      name: 'kind',
      title: 'Is this a file or a link?',
      type: 'string',
      options: {
        list: [
          { title: 'A file to download', value: 'file' },
          { title: 'A link to another site', value: 'url' },
        ],
        layout: 'radio',
      },
      initialValue: 'file',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      hidden: ({ parent }) => parent?.kind !== 'file',
      validation: (rule) =>
        rule.custom((value, context) => {
          const kind = (context.parent as { kind?: string } | undefined)?.kind
          if (kind !== 'file') return true
          return value ? true : 'Upload the file, or switch this to a link.'
        }),
    }),
    defineField({
      name: 'url',
      title: 'Web address',
      type: 'url',
      hidden: ({ parent }) => parent?.kind !== 'url',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }).custom((value, context) => {
          const kind = (context.parent as { kind?: string } | undefined)?.kind
          if (kind !== 'url') return true
          return value ? true : 'Enter the web address, or switch this to a file.'
        }),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Forms', value: 'forms' },
          { title: 'Bible study', value: 'study' },
          { title: 'Policies', value: 'policies' },
          { title: 'Bulletins', value: 'bulletins' },
          { title: 'Other', value: 'other' },
        ],
      },
      initialValue: 'other',
    }),
    defineField({
      name: 'ministry',
      title: 'Related ministry',
      type: 'reference',
      to: [{ type: 'ministry' }],
    }),
    defineField({
      name: 'order',
      title: 'Position in the list',
      type: 'number',
      description: 'Lower numbers appear first.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', kind: 'kind' },
    prepare({ title, subtitle, kind }) {
      return { title, subtitle: [subtitle, kind === 'file' ? 'file' : 'link'].join(' · ') }
    },
  },
})
