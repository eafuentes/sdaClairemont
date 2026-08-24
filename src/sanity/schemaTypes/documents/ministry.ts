import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * A ministry — Pathfinders, Adventurers, Sabbath School, and the rest.
 *
 * Two things here are deliberate.
 *
 * **`heroImage` and `switcherImage` are separate fields.** They are not the same
 * photograph at different sizes. The hero needs headroom and quiet space for a headline
 * to sit over it; the switcher needs a wide atmospheric frame that reads instantly at a
 * glance. Asking for one image and cropping it produces something that works in neither
 * place.
 *
 * **`accentTone` is a temperature, not a colour.** An editor choosing "warm" or "cool"
 * is making a judgement about the ministry, which they are qualified to make. An editor
 * choosing a hex value is making a design decision, which is how a considered palette
 * becomes fourteen colours.
 *
 * Pathfinder-specific fields live in their own group and stay hidden unless switched on,
 * so the twelve ministries that are not Pathfinders are not editing around them.
 */
export const ministry = defineType({
  name: 'ministry',
  title: 'Ministry',
  type: 'document',
  groups: [
    { name: 'details', title: 'Details', default: true },
    { name: 'media', title: 'Photographs' },
    { name: 'people', title: 'People and links' },
    { name: 'pathfinders', title: 'Pathfinder details' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'details',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'In one sentence',
      type: 'string',
      group: 'details',
      description:
        'This is what appears on the homepage. Say what actually happens, not what it is for: "Sixty kids, one campfire, and a lot of knots" beats "developing character in young people."',
      validation: (rule) => rule.required().max(140).warning('Keep it to one line if you can.'),
    }),
    defineField({
      name: 'description',
      title: 'The full description',
      type: 'blockContent',
      group: 'details',
      description: 'Written for a parent or a newcomer deciding whether to come along.',
    }),
    defineField({
      name: 'ageRange',
      title: 'Ages',
      type: 'string',
      group: 'details',
      description: 'For example: Ages 10-15, or All ages.',
    }),
    defineField({
      name: 'meetingSchedules',
      title: 'When it meets',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'meetingSchedule' })],
    }),
    defineField({
      name: 'accentTone',
      title: 'Feel',
      type: 'string',
      group: 'details',
      description:
        'Gives each ministry a slightly different temperature on the page. Warm suits the active and outdoor ones, cool the reflective ones.',
      options: {
        list: [
          { title: 'Warm', value: 'warm' },
          { title: 'Cool', value: 'cool' },
          { title: 'Neutral', value: 'neutral' },
        ],
        layout: 'radio',
      },
      initialValue: 'neutral',
    }),
    defineField({
      name: 'order',
      title: 'Position in the list',
      type: 'number',
      group: 'details',
      description: 'Lower numbers appear first.',
    }),
    defineField({
      name: 'featured',
      title: 'Show on the homepage',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      name: 'heroImage',
      title: 'Main photograph',
      type: 'imageWithAlt',
      group: 'media',
      description:
        "The banner at the top of this ministry's own page. Leave some open sky or wall at the top — a headline sits over it.",
    }),
    defineField({
      name: 'switcherImage',
      title: 'Homepage photograph',
      type: 'imageWithAlt',
      group: 'media',
      description:
        'A wide shot of the group in the middle of doing the thing, taken from a distance rather than posed. This is a different picture from the one above, on purpose.',
    }),
    defineField({
      name: 'gallery',
      title: 'Photo gallery',
      type: 'reference',
      to: [{ type: 'gallery' }],
      group: 'media',
    }),
    defineField({
      name: 'leaders',
      title: 'Leaders',
      type: 'array',
      group: 'people',
      of: [{ type: 'reference', to: [{ type: 'person' }] }],
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      group: 'people',
      of: [{ type: 'reference', to: [{ type: 'sermon' }] }],
    }),
    defineField({
      name: 'resources',
      title: 'Forms and resources',
      type: 'array',
      group: 'people',
      of: [{ type: 'reference', to: [{ type: 'resource' }] }],
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Sign-up link',
      type: 'url',
      group: 'people',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'hasPathfinderDetails',
      title: 'This ministry has classes, statistics and a history',
      type: 'boolean',
      group: 'pathfinders',
      description:
        'Switch on for Pathfinders and Adventurers. It reveals the extra fields those pages use.',
      initialValue: false,
    }),
    defineField({
      name: 'classes',
      title: 'Classes',
      type: 'array',
      group: 'pathfinders',
      of: [defineArrayMember({ type: 'pathfinderClass' })],
      hidden: ({ document }) => !document?.hasPathfinderDetails,
    }),
    defineField({
      name: 'statistics',
      title: 'By the numbers',
      type: 'array',
      group: 'pathfinders',
      of: [defineArrayMember({ type: 'statistic' })],
      hidden: ({ document }) => !document?.hasPathfinderDetails,
    }),
    defineField({
      name: 'timeline',
      title: 'Our story so far',
      type: 'array',
      group: 'pathfinders',
      of: [defineArrayMember({ type: 'timelineEntry' })],
      hidden: ({ document }) => !document?.hasPathfinderDetails,
    }),
    defineField({
      name: 'safetyPolicy',
      title: 'Child safety policy',
      type: 'blockContent',
      group: 'pathfinders',
      description:
        'Say plainly how children are kept safe here — screening, ratios, who to talk to. A parent looking for this and not finding it draws their own conclusion.',
      hidden: ({ document }) => !document?.hasPathfinderDetails,
    }),
    defineField({ name: 'seo', title: 'Search and sharing', type: 'seo', group: 'details' }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'shortDescription', media: 'switcherImage' },
  },
})
