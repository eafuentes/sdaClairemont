import { defineField, defineType } from 'sanity'

/**
 * A destination: either a page on this site or an address elsewhere.
 *
 * The editor picks which kind, and only the relevant field appears. Internal links are
 * references rather than typed paths, so renaming a page's slug cannot silently produce
 * a dead link — and Sanity will warn before deleting a document something links to.
 *
 * Notably absent: an "open in a new tab" checkbox. Whether a link leaves the site is
 * knowable from the link itself, so asking is asking an editor to make a decision they
 * have no basis for. External links open in a new tab; internal ones do not.
 */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Where does this go?',
      type: 'string',
      options: {
        list: [
          { title: 'A page on this site', value: 'internal' },
          { title: 'Another website', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'internalTarget',
      title: 'Page',
      type: 'reference',
      to: [
        { type: 'page' },
        { type: 'event' },
        { type: 'ministry' },
        { type: 'sermon' },
        { type: 'gallery' },
      ],
      hidden: ({ parent }) => parent?.kind !== 'internal',
      validation: (rule) =>
        rule.custom((value, context) => {
          const kind = (context.parent as { kind?: string } | undefined)?.kind
          if (kind !== 'internal') return true
          return value ? true : 'Choose the page this should link to.'
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'Web address',
      type: 'url',
      description: 'The full address, starting with https://',
      hidden: ({ parent }) => parent?.kind !== 'external',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }).custom((value, context) => {
          const kind = (context.parent as { kind?: string } | undefined)?.kind
          if (kind !== 'external') return true
          return value ? true : 'Enter the web address this should link to.'
        }),
    }),
  ],
})

/** A link with a label and a visual weight — the thing a button is made of. */
export const cta = defineType({
  name: 'cta',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button text',
      type: 'string',
      description:
        'Say what happens next, from the visitor\'s point of view: "Plan your visit" rather than "Click here".',
      validation: (rule) =>
        rule.required().max(28).warning('Long labels wrap awkwardly on phones.'),
    }),
    defineField({
      name: 'link',
      title: 'Destination',
      type: 'link',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Emphasis',
      type: 'string',
      description:
        'Use the strong style for the one action you most want someone to take, and the quiet style for everything beside it. Two strong buttons next to each other cancel each other out.',
      options: {
        list: [
          { title: 'Strong', value: 'primary' },
          { title: 'Quiet', value: 'secondary' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'variant' },
  },
})
