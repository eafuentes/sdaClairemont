import type { ProphecyPageQueryResult } from '../../../sanity.types'
import type {
  EmpireAlignment,
  ProphecyPageContent,
  PropheticDate,
  PropheticEvent,
  PropheticPeriod,
  ScriptureRef,
} from '@/types/content'

function mapDate(
  value:
    | { era: string | null; year: number | null; season?: string | null; display: string | null }
    | null
    | undefined,
): PropheticDate | null {
  if (!value?.era || !value.year || !value.display) return null
  if (value.era !== 'bc' && value.era !== 'ad') return null

  const season = value.season
  const allowed =
    season === 'spring' || season === 'summer' || season === 'autumn' || season === 'winter'

  return {
    era: value.era,
    year: value.year,
    display: value.display,
    ...(allowed ? { season } : {}),
  }
}

function mapCitation(
  value:
    | { reference: string | null; translation?: string | null; text?: string | null }
    | null
    | undefined,
): ScriptureRef | null {
  if (!value?.reference) return null
  return {
    reference: value.reference,
    translation: value.translation ?? undefined,
    text: value.text ?? undefined,
  }
}

export function mapProphecyPage(data: ProphecyPageQueryResult): ProphecyPageContent | null {
  if (!data?.title || !data.eyebrow || !data.lede || !data.close?.headline || !data.close.body) {
    return null
  }

  const scripture = mapCitation(data.scripture)
  if (!scripture) return null

  const spine = (data.spine ?? []).flatMap((event): PropheticEvent[] => {
    if (!event?.id || !event.title || !event.summary) return []
    const date = mapDate(event.date)
    const eventScripture = mapCitation(event.scripture)
    if (!date || !eventScripture) return []

    const arithmetic =
      event.arithmetic?.from && event.arithmetic.plus && event.arithmetic.result
        ? {
            from: event.arithmetic.from,
            plus: event.arithmetic.plus,
            result: event.arithmetic.result,
            note: event.arithmetic.note ?? '',
          }
        : undefined

    return [
      {
        id: event.id,
        date,
        title: event.title,
        scripture: eventScripture,
        summary: event.summary,
        explanation: (event.explanation ?? []).filter((paragraph): paragraph is string =>
          Boolean(paragraph),
        ),
        arithmetic,
        objections: (event.objections ?? []).flatMap((objection) => {
          if (!objection?.title) return []
          return [
            {
              title: objection.title,
              paragraphs: (objection.paragraphs ?? []).filter((paragraph): paragraph is string =>
                Boolean(paragraph),
              ),
            },
          ]
        }),
      },
    ]
  })

  const periods = (data.periods ?? []).flatMap((period): PropheticPeriod[] => {
    if (!period?.id || !period.label || !period.years) return []
    const start = mapDate(period.start)
    const end = mapDate(period.end)
    if (!start || !end) return []
    return [
      {
        id: period.id,
        label: period.label,
        years: period.years,
        start,
        end,
        nestedIn: period.nestedIn ?? undefined,
      },
    ]
  })

  const empires = (data.empires ?? []).flatMap((empire): EmpireAlignment[] => {
    if (!empire?.empire || !empire.span) return []
    const start = mapDate(empire.start)
    const end = mapDate(empire.end)
    if (!start || !end) return []
    return [
      {
        empire: empire.empire,
        span: empire.span,
        start,
        end,
        daniel2: empire.daniel2 ?? '—',
        daniel7: empire.daniel7 ?? '—',
        daniel8: empire.daniel8 ?? '—',
        daniel11: empire.daniel11 ?? undefined,
        revelation: empire.revelation ?? undefined,
      },
    ]
  })

  if (
    spine.length === 0 ||
    periods.length === 0 ||
    !data.fold?.beforeEventId ||
    !data.fold.label ||
    !data.fold.explanation ||
    !data.fold.yearsFolded
  ) {
    return null
  }

  return {
    title: data.title,
    eyebrow: data.eyebrow,
    lede: data.lede,
    scripture,
    intro: (data.intro ?? []).filter((paragraph): paragraph is string => Boolean(paragraph)),
    periods,
    spine,
    fold: {
      beforeEventId: data.fold.beforeEventId,
      yearsFolded: data.fold.yearsFolded,
      label: data.fold.label,
      explanation: data.fold.explanation,
    },
    empires,
    close: { headline: data.close.headline, body: data.close.body },
  }
}
