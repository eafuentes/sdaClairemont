import { travelProgress, untravelProgress } from '@/lib/motion'
import { yearsSpanned } from '@/lib/prophetic-date'
import type { ProphecyPageContent, PropheticDate } from '@/types/content'

export type StarKind = 'spine' | 'empire' | 'lane' | 'tick' | 'fold'

export interface Star {
  id: string
  kind: StarKind
  x: number
  y: number
  z: number
  r: number
  number?: number
  year: string
  yearShort: string
  era: string
  title: string
  kicker?: string
}

export interface ConstellationEdge {
  from: string
  to: string
}

export interface Constellation {
  stars: Star[]
  edges: ConstellationEdge[]
  minZ: number
  maxZ: number
}

const ORIGIN: PropheticDate = { era: 'bc', year: 457, display: '457 BC' }
const FOLD_START: PropheticDate = { era: 'ad', year: 34, display: 'Autumn AD 34' }
const FOLD_GAP = 150

const LANE_X = {
  spine: 0,
  daniel2: -320,
  daniel7: 150,
  daniel8: 330,
} as const

function scatter(id: string, spread: number): number {
  let hash = 2166136261
  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (((hash >>> 0) % 1000) / 1000) * spread - spread / 2
}

function yearShortOf(date: PropheticDate): { short: string; era: string } {
  return {
    short: String(date.year),
    era: date.era === 'bc' ? 'BC' : 'AD',
  }
}

function dateFromYear(era: 'bc' | 'ad', year: number): PropheticDate {
  return {
    era,
    year,
    display: era === 'bc' ? `${year} BC` : `AD ${year}`,
  }
}

/**
 * Place a date on the flight axis. Years before 457 BC run negative. The 490
 * run forward. 1844 sits after a labeled gap so the empty centuries are folded
 * in space the same way they are on the document.
 */
export function flightZ(date: PropheticDate): number {
  if (date.era === 'ad' && date.year > 34) {
    return yearsSpanned(ORIGIN, FOLD_START) + FOLD_GAP
  }

  if (date.era === 'bc' && date.year > 457) {
    return -yearsSpanned(date, ORIGIN)
  }

  return yearsSpanned(ORIGIN, date)
}

/**
 * Stars and edges for the prophecy flight. Every node is a real date or a
 * year-tick — nothing invented to fill space.
 */
export function buildConstellation(content: ProphecyPageContent): Constellation {
  const stars: Star[] = []
  const edges: ConstellationEdge[] = []
  const byId = new Map<string, Star>()

  const add = (star: Star) => {
    stars.push(star)
    byId.set(star.id, star)
  }

  const link = (from: string, to: string) => {
    if (from === to) return
    if (!byId.has(from) || !byId.has(to)) return
    edges.push({ from, to })
  }

  content.spine.forEach((event, index) => {
    const { short, era } = yearShortOf(event.date)
    add({
      id: event.id,
      kind: 'spine',
      x: LANE_X.spine + scatter(event.id, 48),
      y: scatter(`${event.id}-y`, 110),
      z: flightZ(event.date),
      r: 7,
      number: index + 1,
      year: event.date.display,
      yearShort: short,
      era,
      title: event.title,
      kicker: event.scripture.reference,
    })
  })

  add({
    id: 'fold',
    kind: 'fold',
    x: scatter('fold', 36),
    y: scatter('fold-y', 70),
    z: yearsSpanned(ORIGIN, FOLD_START) + FOLD_GAP / 2,
    r: 5,
    year: content.fold.label,
    yearShort: '1810',
    era: 'yrs',
    title: content.fold.label,
    kicker: 'Fold, marked',
  })

  const spineIds = content.spine.map((event) => event.id)
  const foldAt = content.spine.findIndex((event) => event.id === content.fold.beforeEventId)
  const chain = [
    ...spineIds.slice(0, Math.max(foldAt, 0)),
    'fold',
    ...spineIds.slice(Math.max(foldAt, 0)),
  ]
  for (let index = 0; index < chain.length - 1; index += 1) {
    link(chain[index]!, chain[index + 1]!)
  }

  content.empires.forEach((empire) => {
    const empireId = `empire-${empire.empire}`
    const { short, era } = yearShortOf(empire.start)
    add({
      id: empireId,
      kind: 'empire',
      x: scatter(empireId, 90),
      y: scatter(`${empireId}-y`, 150),
      z: flightZ(empire.start),
      r: 4.5,
      year: empire.start.display,
      yearShort: short,
      era,
      title: empire.empire,
      kicker: empire.span,
    })

    const laneIds: string[] = []
    const lanes = [
      { key: 'daniel2' as const, symbol: empire.daniel2, kicker: 'Daniel 2' },
      { key: 'daniel7' as const, symbol: empire.daniel7, kicker: 'Daniel 7' },
      { key: 'daniel8' as const, symbol: empire.daniel8, kicker: 'Daniel 8' },
    ]

    for (const lane of lanes) {
      if (!lane.symbol || lane.symbol === '—') continue
      const id = `${empireId}-${lane.key}`
      add({
        id,
        kind: 'lane',
        x: LANE_X[lane.key] + scatter(id, 40),
        y: scatter(`${id}-y`, 130),
        z: flightZ(empire.start) + scatter(`${id}-z`, 28),
        r: 3,
        year: empire.start.display,
        yearShort: short,
        era,
        title: lane.symbol,
        kicker: `${lane.kicker} · ${empire.empire}`,
      })
      laneIds.push(id)
      link(empireId, id)
    }

    for (let index = 0; index < laneIds.length - 1; index += 1) {
      link(laneIds[index]!, laneIds[index + 1]!)
    }
    if (laneIds.length === 3) link(laneIds[0]!, laneIds[2]!)
  })

  for (let index = 0; index < content.empires.length - 1; index += 1) {
    link(`empire-${content.empires[index]!.empire}`, `empire-${content.empires[index + 1]!.empire}`)
  }

  const occupied = new Set(content.spine.map((event) => `${event.date.era}-${event.date.year}`))

  const tickYears: Array<{ era: 'bc' | 'ad'; year: number }> = []
  for (let year = 605; year >= 20; year -= 20) {
    tickYears.push({ era: 'bc', year })
  }
  for (let year = 1; year <= 48; year += 12) {
    tickYears.push({ era: 'ad', year })
  }

  const tickIds: string[] = []
  tickYears.forEach((tick) => {
    const key = `${tick.era}-${tick.year}`
    if (occupied.has(key)) return
    const date = dateFromYear(tick.era, tick.year)
    const id = `tick-${key}`
    const { short, era } = yearShortOf(date)
    add({
      id,
      kind: 'tick',
      x: scatter(id, 210),
      y: scatter(`${id}-y`, 190),
      z: flightZ(date),
      r: 1.4,
      year: date.display,
      yearShort: short,
      era,
      title: date.display,
    })
    tickIds.push(id)
  })

  for (let index = 0; index < tickIds.length - 1; index += 1) {
    link(tickIds[index]!, tickIds[index + 1]!)
  }

  content.spine.forEach((event) => {
    const z = flightZ(event.date)
    let nearest: Star | undefined
    let nearestDistance = Infinity
    for (const star of stars) {
      if (star.kind !== 'empire' && star.kind !== 'tick') continue
      const distance = Math.abs(star.z - z)
      if (distance < nearestDistance && distance < 90) {
        nearest = star
        nearestDistance = distance
      }
    }
    if (nearest) link(event.id, nearest.id)
  })

  const zs = stars.map((star) => star.z)
  return {
    stars,
    edges,
    minZ: Math.min(...zs),
    maxZ: Math.max(...zs),
  }
}

export const NEAR_Z = 100
export const FOCAL = 240
export const PASSED_Z = -170
/** How far behind the first year the camera starts, so the cloud is ahead of you. */
export const APPROACH = 220
export const AFTERMATH = 150
/** Radial explosion as a star approaches. Far stars sit near the vanishing point. */
export const SPREAD = 2.65

export function cameraFromProgress(progress: number, minZ: number, maxZ: number): number {
  return minZ - APPROACH + travelProgress(progress) * (maxZ - minZ + APPROACH + AFTERMATH)
}

export function progressFromZ(z: number, minZ: number, maxZ: number): number {
  const span = maxZ - minZ + APPROACH + AFTERMATH
  if (span === 0) return 0
  return untravelProgress((z - (minZ - APPROACH)) / span)
}

/**
 * Where the camera sits on the true-scale 2,300-year ruler (0–100).
 * The 490 occupy the first `nestedWidth` percent; the remainder is 1844.
 */
export function rulerPercentFromCamera(
  cam: number,
  zStart: number,
  zNestedEnd: number,
  zEnd: number,
  nestedWidth: number,
): number {
  if (cam <= zStart) return 0
  if (cam >= zEnd) return 100
  if (cam <= zNestedEnd) {
    const span = zNestedEnd - zStart || 1
    return ((cam - zStart) / span) * nestedWidth
  }
  const span = zEnd - zNestedEnd || 1
  return nestedWidth + ((cam - zNestedEnd) / span) * (100 - nestedWidth)
}
