import { defineField, defineType } from 'sanity'

/**
 * A pastor, elder, ministry leader, or staff member.
 *
 * The field worth pausing on is `showContactPublicly`. An elder may be entirely willing
 * to be listed as an elder and entirely unwilling to have their mobile number on the
 * public internet, and those are two different consents. Defaulting to private means
 * the failure mode is a missing phone number rather than a published one.
 */
export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Who they are', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'details', title: 'Details' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Full name',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'identity',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      group: 'identity',
      description: 'As it should appear beneath their name. For example: Senior Pastor.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'roleCategory',
      title: 'Kind of role',
      type: 'string',
      group: 'identity',
      description: 'Used to group people on the leadership page.',
      options: {
        list: [
          { title: 'Pastoral', value: 'pastoral' },
          { title: 'Elder', value: 'elder' },
          { title: 'Ministry leader', value: 'ministry-leader' },
          { title: 'Staff', value: 'staff' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photograph',
      type: 'imageWithAlt',
      group: 'identity',
    }),
    defineField({
      name: 'bio',
      title: 'About them',
      type: 'blockContent',
      group: 'details',
      description:
        'A few sentences in their own voice, if possible. Where they are from, their family, what they love about this church.',
    }),
    defineField({
      name: 'ministries',
      title: 'Ministries they lead',
      type: 'array',
      group: 'details',
      of: [{ type: 'reference', to: [{ type: 'ministry' }] }],
    }),
    defineField({
      name: 'order',
      title: 'Position in the list',
      type: 'number',
      group: 'details',
      description: 'Lower numbers appear first. Leave empty to sort alphabetically.',
    }),
    defineField({
      name: 'showContactPublicly',
      title: 'Show their contact details on the website',
      type: 'boolean',
      group: 'contact',
      description:
        'Off by default, and it should stay off unless this person has said yes. Their email and phone are stored either way, for the church office.',
      initialValue: false,
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'contact',
    }),
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
    select: { title: 'name', subtitle: 'role', media: 'image' },
  },
})
