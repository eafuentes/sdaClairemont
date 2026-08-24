import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * The facts that appear everywhere. A singleton, pinned in the desk structure.
 *
 * Service times and the AdventistGiving URL live here rather than in code or
 * environment variables, and that is the single highest-leverage decision in this
 * schema. When the giving link changes, the difference between this and a constant in a
 * component is a five-second edit versus finding a developer and running a deployment.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'services', title: 'Service times' },
    { name: 'contact', title: 'Contact' },
    { name: 'external', title: 'Giving and social' },
    { name: 'livestream', title: 'Livestream' },
    { name: 'seo', title: 'Search defaults' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Church name',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortName',
      title: 'Short name',
      type: 'string',
      group: 'identity',
      description: 'Used where the full name will not fit, such as the top of a phone screen.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'identity',
      description: 'One line that says who this church is.',
    }),
    defineField({
      name: 'missionStatement',
      title: 'Mission statement',
      type: 'text',
      rows: 3,
      group: 'identity',
    }),
    defineField({ name: 'logo', title: 'Logo', type: 'imageWithAlt', group: 'identity' }),
    defineField({
      name: 'serviceTimes',
      title: 'Service times',
      type: 'array',
      group: 'services',
      of: [defineArrayMember({ type: 'serviceTime' })],
      description:
        'Every regular service. Tick "Show this on the homepage" for the main two, so a first-time visitor sees when to arrive without reading the whole list.',
      validation: (rule) => rule.min(1).error('Add at least one service time.'),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'address',
      group: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Church phone',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'email',
      title: 'Church email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'givingUrl',
      title: 'AdventistGiving link',
      type: 'url',
      group: 'external',
      description:
        'Every Give button on the site opens this. Changing it here changes all of them.',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'youtubeChannelUrl',
      title: 'YouTube channel',
      type: 'url',
      group: 'external',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social media',
      type: 'array',
      group: 'external',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Where',
              type: 'string',
              options: {
                list: [
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Other', value: 'other' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Link',
              type: 'url',
              validation: (rule) => rule.required().uri({ scheme: ['https'] }),
            }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({
      name: 'lessonResourceLinks',
      title: 'Sabbath School lesson links',
      type: 'array',
      group: 'external',
      of: [defineArrayMember({ type: 'cta' })],
      description: 'Where members go for the quarterly and study helps.',
    }),
    defineField({
      name: 'isLive',
      title: 'We are streaming right now',
      type: 'boolean',
      group: 'livestream',
      description:
        'This is a manual switch — nothing turns it off automatically. Turn it on when the stream starts and off when it ends, or the site will tell people you are live on a Tuesday.',
      initialValue: false,
    }),
    defineField({
      name: 'livestreamUrl',
      title: 'Current stream link',
      type: 'url',
      group: 'livestream',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'nextStreamDate',
      title: 'Next stream',
      type: 'datetime',
      group: 'livestream',
      options: { dateFormat: 'MMMM D, YYYY', timeFormat: 'h:mm A' },
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Search defaults',
      type: 'seo',
      group: 'seo',
      description: 'Used for any page that does not set its own.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site settings' }
    },
  },
})
