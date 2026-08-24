import { defineQuery } from 'next-sanity'

import { IMAGE_PROJECTION, SCRIPTURE_PROJECTION } from './fragments'

/**
 * The homepage, in one request.
 *
 * Ten chapters, several of which pull live content — the coming Sabbath, the next few
 * events, the featured sermon — and all of it resolves in a single round trip. The
 * alternative, one fetch per chapter, would mean ten sequential requests on the route
 * that matters most and where the largest image is already competing for bandwidth.
 *
 * The nested `*[...]` sub-queries do the work references cannot: they select live
 * content by date at query time, so the homepage tracks the calendar without an editor
 * repointing anything each week.
 *
 * `$today` and `$now` are passed in from `src/lib/sabbath.ts`, computed in
 * `America/Los_Angeles`. See the note in `sabbath.ts` for why GROQ's `now()` is wrong
 * here.
 */
export const homePageQuery = defineQuery(`
  *[_id == "homePage"][0]{
    arrival{
      headline,
      subhead,
      heroImage ${IMAGE_PROJECTION},
      primaryCta{ label, variant, link },
      secondaryCta{ label, variant, link }
    },

    thisSabbath{
      isVisible,
      headline,
      intro,
      // Resolved here rather than referenced, so the section follows the calendar on
      // its own. Falls back to the most recent past program when the coming Sabbath has
      // not been posted yet: an out-of-date program still shows a visitor what a service
      // here looks like, where an empty section shows them nothing.
      "program": coalesce(
        *[_type == "sabbathProgram" && date >= $today] | order(date asc)[0],
        *[_type == "sabbathProgram" && date < $today] | order(date desc)[0]
      ){
        date,
        sermonTitle,
        "speakerName": coalesce(speaker->name, speakerName),
        "speakerRole": coalesce(speaker->role, speakerRole),
        scripture[] ${SCRIPTURE_PROJECTION},
        sermonSummary,
        sabbathSchoolTime,
        worshipTime,
        isSpecialService,
        specialServiceLabel,
        image ${IMAGE_PROJECTION},
        "isPast": date < $today
      }
    },

    belong{
      isVisible,
      headline,
      body,
      plates[] ${IMAGE_PROJECTION},
      "testimonial": testimonial->{
        quote,
        "personName": coalesce(personRef->name, personName),
        personContext,
        image ${IMAGE_PROJECTION}
      }
    },

    ministries{
      isVisible,
      headline,
      intro,
      featured[]->{
        name,
        "slug": slug.current,
        shortDescription,
        ageRange,
        meetingSchedules[]{ day, startTime, frequency, notes },
        switcherImage ${IMAGE_PROJECTION},
        "tone": accentTone
      }
    },

    events{
      isVisible,
      headline,
      count,
      // Sliced to a constant. The editor's count field applies in the component
      // instead, because typegen cannot infer a result type from a variable slice:
      // a slice of ^.count fails with "slicing must use constant numbers". Six is the
      // ceiling the chapter layout can hold, and over-fetching two small cards costs
      // less than losing the generated types for the whole homepage query.
      // (No backticks in comments here — this is inside a template literal.)
      "upcoming": *[_type == "event" && startDateTime >= $now]
        | order(startDateTime asc)[0...6]{
          title,
          "slug": slug.current,
          shortDescription,
          startDateTime,
          endDateTime,
          isAllDay,
          atChurch,
          locationName,
          "ministryName": ministry->name,
          image ${IMAGE_PROJECTION}
        }
    },

    story{
      isVisible,
      headline,
      body,
      plate ${IMAGE_PROJECTION},
      "pastor": pastor->{
        name,
        "slug": slug.current,
        role,
        image ${IMAGE_PROJECTION}
      }
    },

    watch{
      isVisible,
      headline,
      "featured": coalesce(
        featuredSermon->,
        *[_type == "sermon"] | order(date desc)[0]
      ){
        title,
        "slug": slug.current,
        date,
        "speakerName": coalesce(speaker->name, speakerName),
        scripture[] ${SCRIPTURE_PROJECTION},
        youtubeUrl,
        duration,
        thumbnail ${IMAGE_PROJECTION}
      },
      "recent": *[_type == "sermon"] | order(date desc)[0...4]{
        title,
        "slug": slug.current,
        date,
        "speakerName": coalesce(speaker->name, speakerName),
        youtubeUrl,
        duration,
        thumbnail ${IMAGE_PROJECTION}
      }
    },

    prayer{
      isVisible,
      headline,
      invitation,
      scripture ${SCRIPTURE_PROJECTION}
    },

    hope{
      isVisible,
      scripture ${SCRIPTURE_PROJECTION},
      atmosphereImage ${IMAGE_PROJECTION}
    },

    invitation{
      isVisible,
      headline,
      body,
      whatToExpect,
      cta{ label, variant, link }
    }
  }
`)
