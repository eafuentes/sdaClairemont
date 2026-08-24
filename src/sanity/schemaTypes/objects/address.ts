import { defineField, defineType } from 'sanity'

/**
 * The church's physical address, plus the coordinates a map needs.
 *
 * Coordinates are stored explicitly rather than geocoded at render time. Geocoding on
 * request adds a third-party dependency and a failure mode to the one piece of
 * information a visitor most needs to be correct, in exchange for saving an editor two
 * numbers they enter once.
 */
export const address = defineType({
  name: 'address',
  title: 'Address',
  type: 'object',
  fields: [
    defineField({
      name: 'street',
      title: 'Street address',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      initialValue: 'San Diego',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
      initialValue: 'CA',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'postalCode',
      title: 'ZIP code',
      type: 'string',
      validation: (rule) => rule.required().regex(/^\d{5}(-\d{4})?$/, { name: 'ZIP code' }),
    }),
    defineField({
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
      description:
        'Find the church on Google Maps, right-click the building, and the two numbers at the top of the menu are latitude and longitude. Copy the first one here.',
      validation: (rule) => rule.min(-90).max(90),
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
      description: 'The second of the two numbers.',
      validation: (rule) => rule.min(-180).max(180),
    }),
    defineField({
      name: 'mapUrl',
      title: 'Google Maps link',
      type: 'url',
      description: 'The link the "Get directions" button opens.',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'drivingNotes',
      title: 'Parking and arrival notes',
      type: 'text',
      rows: 3,
      description:
        'What you would tell a first-time visitor on the phone. Where to park, which door to use, what to do if they are late. This is one of the most-read sentences on the site.',
    }),
  ],
  preview: {
    select: { street: 'street', city: 'city', state: 'state' },
    prepare({ street, city, state }) {
      return {
        title: street ?? 'No address set',
        subtitle: [city, state].filter(Boolean).join(', '),
      }
    },
  },
})
