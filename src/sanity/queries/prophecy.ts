import { defineQuery } from 'next-sanity'

import { SCRIPTURE_PROJECTION } from './fragments'

const DATE_PROJECTION = /* groq */ `{ era, year, season, display }`

export const prophecyPageQuery = defineQuery(`
  *[_id == "prophecyPage"][0]{
    title,
    eyebrow,
    lede,
    scripture ${SCRIPTURE_PROJECTION},
    intro,
    periods[]{
      "id": coalesce(key.current, key),
      label,
      years,
      start ${DATE_PROJECTION},
      end ${DATE_PROJECTION},
      nestedIn
    },
    spine[]{
      "id": key.current,
      date ${DATE_PROJECTION},
      title,
      scripture ${SCRIPTURE_PROJECTION},
      summary,
      explanation,
      arithmetic{ from, plus, result, note },
      objections[]{ title, paragraphs }
    },
    fold{
      "beforeEventId": beforeEventKey,
      yearsFolded,
      label,
      explanation
    },
    empires[]{
      empire,
      span,
      start ${DATE_PROJECTION},
      end ${DATE_PROJECTION},
      daniel2,
      daniel7,
      daniel8,
      daniel11,
      revelation
    },
    close{ headline, body }
  }
`)
