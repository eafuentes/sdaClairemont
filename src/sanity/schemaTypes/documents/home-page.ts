import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * The homepage, chapter by chapter. A singleton, pinned in the desk structure.
 *
 * **This is deliberately not a page builder.** The homepage is a composed narrative that
 * moves a stranger from "where is this place" to "I could walk in on Saturday", and the
 * order of that argument is the design. A free-form block list would let an editor
 * produce a page with four heroes and the service times at the bottom — not through
 * carelessness, but because the tool offered it.
 *
 * So the chapters are fixed and named, each with the fields that chapter actually needs.
 * An editor can change every word and picture, and can hide a chapter entirely. They
 * cannot reorder the argument or invent a new kind of section. That is a smaller surface
 * than a page builder and a much larger one than a hardcoded page.
 *
 * Every chapter carries `isVisible` because the honest answer to "what if we have
 * nothing for Ministries yet" is to turn it off, not to fill it with something weak.
 */

/** Shared by every chapter, so the toggle sits in the same place each time. */
const visibilityField = defineField({
  name: 'isVisible',
  title: 'Show this section',
  type: 'boolean',
  description: 'Turn off to hide the whole section. Nothing is deleted.',
  initialValue: true,
})

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'opening', title: 'Opening', default: true },
    { name: 'belonging', title: 'Belonging' },
    { name: 'life', title: 'Church life' },
    { name: 'closing', title: 'Closing' },
  ],
  fields: [
    defineField({
      name: 'arrival',
      title: '01 · Arrival',
      type: 'object',
      group: 'opening',
      description: 'The first thing a visitor sees.',
      options: { collapsible: true },
      fields: [
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'string',
          description:
            'Speak to one person, not a congregation. Short is better — this is set very large.',
          validation: (rule) =>
            rule.required().max(60).warning('Long headlines lose their weight.'),
        }),
        defineField({ name: 'subhead', title: 'Supporting line', type: 'string' }),
        defineField({
          name: 'heroImage',
          title: 'Background photograph',
          type: 'imageWithAlt',
          description:
            'The building, ideally in late afternoon light. This is the only picture of the place many visitors will see.',
          validation: (rule) => rule.required(),
        }),
        defineField({ name: 'primaryCta', title: 'Main button', type: 'cta' }),
        defineField({ name: 'secondaryCta', title: 'Second button', type: 'cta' }),
      ],
    }),
    defineField({
      name: 'thisSabbath',
      title: '02 · This Sabbath',
      type: 'object',
      group: 'opening',
      description:
        'Only the wording around it. The program itself comes from Sabbath Programs and updates on its own.',
      options: { collapsible: true, collapsed: true },
      fields: [
        visibilityField,
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'intro', title: 'Introduction', type: 'text', rows: 2 }),
      ],
    }),
    defineField({
      name: 'belong',
      title: '03 · Belong',
      type: 'object',
      group: 'belonging',
      description: 'The answer to "will I be alone there".',
      options: { collapsible: true, collapsed: true },
      fields: [
        visibilityField,
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
        defineField({
          name: 'plates',
          title: 'Photographs',
          type: 'array',
          of: [defineArrayMember({ type: 'imageWithAlt' })],
          description:
            'Three works best. Candid beats posed — people mid-conversation, not lined up smiling.',
          validation: (rule) => rule.max(3),
        }),
        defineField({
          name: 'testimonial',
          title: 'Quote',
          type: 'reference',
          to: [{ type: 'testimonial' }],
        }),
      ],
    }),
    defineField({
      name: 'ministries',
      title: '04 · Ministries',
      type: 'object',
      group: 'life',
      options: { collapsible: true, collapsed: true },
      fields: [
        visibilityField,
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'intro', title: 'Introduction', type: 'text', rows: 2 }),
        defineField({
          name: 'featured',
          title: 'Which ministries?',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'ministry' }] }],
          description: 'In the order they should appear. Four to six reads best.',
        }),
      ],
    }),
    defineField({
      name: 'events',
      title: '05 · What\u2019s coming',
      type: 'object',
      group: 'life',
      options: { collapsible: true, collapsed: true },
      fields: [
        visibilityField,
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({
          name: 'count',
          title: 'How many to show',
          type: 'number',
          description: 'The soonest few. Three or four keeps it feeling current.',
          initialValue: 4,
          validation: (rule) => rule.min(1).max(8).integer(),
        }),
      ],
    }),
    defineField({
      name: 'story',
      title: '06 · Our story',
      type: 'object',
      group: 'life',
      options: { collapsible: true, collapsed: true },
      fields: [
        visibilityField,
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'body', title: 'The story', type: 'blockContent' }),
        defineField({ name: 'plate', title: 'Photograph', type: 'imageWithAlt' }),
        defineField({
          name: 'pastor',
          title: 'Pastor',
          type: 'reference',
          to: [{ type: 'person' }],
        }),
      ],
    }),
    defineField({
      name: 'watch',
      title: '07 · Watch',
      type: 'object',
      group: 'life',
      options: { collapsible: true, collapsed: true },
      fields: [
        visibilityField,
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({
          name: 'featuredSermon',
          title: 'Which sermon?',
          type: 'reference',
          to: [{ type: 'sermon' }],
          description: 'Leave empty to always show the most recent one, which is usually right.',
        }),
      ],
    }),
    defineField({
      name: 'prayer',
      title: '08 · Prayer',
      type: 'object',
      group: 'closing',
      options: { collapsible: true, collapsed: true },
      fields: [
        visibilityField,
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({
          name: 'invitation',
          title: 'The invitation',
          type: 'text',
          rows: 3,
          description:
            'Say who reads the requests and what happens to them. People share more when they know.',
        }),
        defineField({ name: 'scripture', title: 'Scripture', type: 'scriptureRef' }),
      ],
    }),
    defineField({
      name: 'hope',
      title: '09 · Hope',
      type: 'object',
      group: 'closing',
      description: 'A quiet moment before the last invitation. Scripture, set large.',
      options: { collapsible: true, collapsed: true },
      fields: [
        visibilityField,
        defineField({
          name: 'scripture',
          title: 'Scripture',
          type: 'scriptureRef',
          validation: (rule) => rule.required(),
        }),
        defineField({ name: 'atmosphereImage', title: 'Background', type: 'imageWithAlt' }),
      ],
    }),
    defineField({
      name: 'invitation',
      title: '10 · Come and see',
      type: 'object',
      group: 'closing',
      description: 'The last thing on the page. Practical, warm, and specific.',
      options: { collapsible: true, collapsed: true },
      fields: [
        visibilityField,
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
        defineField({
          name: 'whatToExpect',
          title: 'What to expect',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
          description:
            'The questions people are too polite to ask. What to wear, where to park, what happens to their children, how long it lasts.',
        }),
        defineField({ name: 'cta', title: 'Button', type: 'cta' }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Homepage' }
    },
  },
})
