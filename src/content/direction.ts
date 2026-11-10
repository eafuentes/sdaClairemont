/**
 * Homepage words from the 2026 Leadership Alignment Guide.
 *
 * The short lines are the homepage. The paragraphs stay in
 * docs/DIRECTION-FROM-LEADERSHIP.md until About is the next stage.
 */

/**
 * `harbor` is not a layout. It is the Poster composition in a second palette (navy,
 * sand, sunset coral), there so the pastors can judge colour apart from layout.
 * `daylight` is Current with its arrival in daylight: the photograph without the
 * dark scrims, the words on white beneath it. Current stays as the baseline.
 */
export const HOME_DESIGNS = ['paper', 'ink', 'poster', 'harbor', 'current', 'daylight'] as const
export type HomeDesign = (typeof HOME_DESIGNS)[number]

export const DEFAULT_HOME_DESIGN: HomeDesign = 'paper'
export const HOME_DESIGN_KEY = 'home-design'

export function isHomeDesign(value: unknown): value is HomeDesign {
  return typeof value === 'string' && (HOME_DESIGNS as readonly string[]).includes(value)
}

/** The review switch writes the choice where CSS and the next visit can both see it. */
export function applyHomeDesign(design: HomeDesign) {
  document.documentElement.dataset.homeDesign = design
  try {
    localStorage.setItem(HOME_DESIGN_KEY, design)
  } catch {
    // Private browsing can refuse storage. The attribute still switches the page.
  }
  const url = new URL(window.location.href)
  if (design === DEFAULT_HOME_DESIGN) url.searchParams.delete('design')
  else url.searchParams.set('design', design)
  window.history.replaceState(null, '', url)
}

/** Runs before first paint so the review switch does not flash the wrong design. */
export const HOME_DESIGN_SCRIPT = `(function(){try{var allowed=${JSON.stringify([...HOME_DESIGNS])};var q=new URLSearchParams(location.search).get("design");var s=localStorage.getItem(${JSON.stringify(HOME_DESIGN_KEY)});var d=allowed.indexOf(q)>=0?q:(allowed.indexOf(s)>=0?s:${JSON.stringify(DEFAULT_HOME_DESIGN)});document.documentElement.dataset.homeDesign=d}catch(e){document.documentElement.dataset.homeDesign=${JSON.stringify(DEFAULT_HOME_DESIGN)}}})()`

export const visionLine = 'To make true disciples.'
export const visionGloss =
  'A church where people move beyond simply attending to becoming committed followers of Jesus.'

export const coreValues = [
  {
    name: 'Biblical truth',
    line: "We are shaped by and committed to God's Word.",
    photo: {
      src: '/images/life/open-bible.webp',
      alt: 'A study Bible open to Romans, held in the pew during worship.',
      position: '50% 50%',
    },
  },
  {
    name: 'Authentic community',
    line: 'We intentionally build meaningful, Christ-centered relationships.',
    photo: {
      src: '/images/life/fellowship-kitchen.webp',
      alt: 'Clairemont members gathered around the fellowship kitchen island after the service.',
      position: '50% 45%',
    },
  },
  {
    name: 'Generational discipleship',
    line: 'We intentionally develop disciples across every generation.',
    // Two pastors, two generations: the value, without a caption.
    photo: {
      src: '/images/pastor-website-assets/pastor-team.webp',
      alt: 'Pastor Robert Berry and Pastor London L. Lee standing together in the Clairemont sanctuary.',
      position: '50% 22%',
    },
  },
] as const

export const valuesBanner = 'Our values describe who we are and how we live.'
export const valuesClose = 'One church. One direction.'

export const missionAccent = 'biblical truth'
export const missionLine =
  'We exist to lead people to Christ through biblical truth, to loving God, loving others, making disciples, and preparing the world for His soon coming.'

/** Matthew 28:19, King James Version. Public domain. */
export const commissionLine = 'Go ye therefore, and teach all nations.'
export const commissionReference = 'Matthew 28:19'
