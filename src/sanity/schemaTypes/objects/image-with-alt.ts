import { defineField, defineType } from 'sanity'

/**
 * Every image in the system. Nothing references a raw `image` type.
 *
 * This object exists so three guarantees are enforced by the CMS rather than by
 * developer discipline, because only one of those survives contact with a volunteer
 * editing a bulletin on a Thursday night.
 *
 * **Alt text is required.** The cheapest accessibility win available, and it has to be
 * required at the point of authoring — nobody backfills alt text later.
 *
 * **Provenance is a required choice with no default.** The editor has to say where the
 * picture came from. This is what makes the launch gate in MEDIA-STRATEGY.md
 * enforceable: `check:placeholders` queries for published documents referencing media
 * that is not `church-photo` and fails the production build. Without a required field
 * there is nothing to query, and "we'll remember to swap the placeholders" is not a
 * plan.
 *
 * **Consent is recorded for identifiable people.** A photograph of a congregation is
 * not the same as a photograph of a building, and the person who took it is the only
 * one who knows whether the people in it agreed to be on the internet.
 */
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: {
    // Needed for art-directed cropping across the aspect ratios the layouts use.
    hotspot: true,
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description:
        'Describe what is in the picture, for people using a screen reader. Write what you would say to someone on the phone: "The sanctuary from the back, full on a Sabbath morning." If the image is purely decorative, still describe it briefly.',
      validation: (rule) =>
        rule
          .required()
          .min(10)
          .error('Alt text is required, and needs to be a real description rather than a word.'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description:
        'Optional. Shown beneath the image on the page. Captions naming real people are what make a photograph feel like this church rather than stock.',
    }),
    defineField({
      name: 'credit',
      title: 'Photographer credit',
      type: 'string',
      description: 'Optional. Who took the photograph, if they should be credited.',
    }),
    defineField({
      name: 'provenance',
      title: 'Where did this come from?',
      type: 'string',
      description:
        'Required. The site cannot be published to production while any visible image is a placeholder, so this answer is what tells us what still needs replacing.',
      options: {
        list: [
          { title: 'A real photograph of our church', value: 'church-photo' },
          { title: 'AI-generated placeholder', value: 'ai-placeholder' },
          { title: 'Licensed stock placeholder', value: 'stock-placeholder' },
        ],
        layout: 'radio',
      },
      // No `initialValue`, deliberately. A default would be answered by not answering.
      validation: (rule) => rule.required().error('Please say where this image came from.'),
    }),
    defineField({
      name: 'provenanceNote',
      title: 'Placeholder details',
      type: 'string',
      description:
        'Which generator or stock library this came from, and the licence if there is one. Required for placeholders so we can prove what we used and find it again.',
      hidden: ({ parent }) => parent?.provenance === 'church-photo',
      validation: (rule) =>
        rule.custom((value, context) => {
          const provenance = (context.parent as { provenance?: string } | undefined)?.provenance
          if (!provenance || provenance === 'church-photo') return true
          if (typeof value === 'string' && value.trim().length > 0) return true
          return 'Placeholders need a note recording the generator or stock library and licence.'
        }),
    }),
    defineField({
      name: 'depictsIdentifiablePeople',
      title: 'Are there recognisable people in this photograph?',
      type: 'boolean',
      description:
        'Faces that someone in the congregation could name. Wide shots where nobody is identifiable do not count.',
      initialValue: false,
    }),
    defineField({
      name: 'consentConfirmed',
      title: 'Everyone in this photograph has agreed to it being published',
      type: 'boolean',
      description:
        'For photographs of children, this means a parent or guardian has agreed. If you are unsure, leave this unchecked and use a different image.',
      hidden: ({ parent }) => !parent?.depictsIdentifiablePeople,
      initialValue: false,
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { depictsIdentifiablePeople?: boolean } | undefined
          if (!parent?.depictsIdentifiablePeople) return true
          return value === true
            ? true
            : 'Photographs of recognisable people cannot be published without confirmed consent.'
        }),
    }),
  ],
  preview: {
    select: { media: 'asset', title: 'alt', subtitle: 'provenance' },
    prepare({ media, title, subtitle }) {
      const provenanceLabels: Record<string, string> = {
        'church-photo': 'Our photograph',
        'ai-placeholder': 'PLACEHOLDER — AI generated',
        'stock-placeholder': 'PLACEHOLDER — stock',
      }

      return {
        media,
        title: title || 'Missing alt text',
        subtitle: subtitle ? provenanceLabels[subtitle] : 'Source not recorded',
      }
    },
  },
})
