import { defineField, defineType } from 'sanity'

import { extractYouTubeId, YOUTUBE_URL_PATTERN } from '@/lib/youtube'

export { extractYouTubeId, YOUTUBE_URL_PATTERN }

/**
 * A YouTube video, referenced by URL.
 *
 * Validated at entry rather than at render. A mistyped video link that fails when a
 * volunteer pastes it costs them ten seconds; the same link failing silently means a
 * blank rectangle where the sermon should be, discovered by a member on Sabbath
 * afternoon. The regex accepts every URL shape YouTube hands out, including the short
 * form from the Share button, because telling an editor their correct link is wrong is
 * worse than not checking at all.
 */
export const videoRef = defineType({
  name: 'videoRef',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube link',
      type: 'url',
      description:
        'Paste the full YouTube link. Any of the forms YouTube gives you will work, including the short one from the Share button.',
      /*
       * `regex` is not available on a url rule, so the shape check runs through
       * `custom`. Returning `true` for an empty value leaves the "required" message to
       * the rule that owns it, rather than showing two errors for one empty field.
       */
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ['https'] })
          .custom((value) =>
            !value || YOUTUBE_URL_PATTERN.test(value)
              ? true
              : 'That does not look like a YouTube link. It should look like https://www.youtube.com/watch?v=... or https://youtu.be/...',
          ),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'How the video should be labelled on the page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Custom thumbnail',
      type: 'imageWithAlt',
      description: "Optional. Leave empty to use YouTube's own thumbnail, which is usually fine.",
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'url', media: 'thumbnail' },
  },
})
