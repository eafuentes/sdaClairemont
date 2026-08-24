/**
 * Verifies the colour palette against WCAG contrast floors.
 *
 * Token values are read out of src/styles/globals.css rather than duplicated here, so
 * this check cannot drift from the design system it is checking. Adjusting a colour in
 * the theme re-runs against the real value.
 *
 * Translucent foregrounds used in the dusk register are composited over their background
 * before measurement, because `text-paper-on-dusk/50` is not the contrast of
 * `paper-on-dusk` and measuring the opaque value would quietly overstate the result.
 *
 * Run with `pnpm check:contrast`. Wired into CI.
 */
import { readFileSync } from 'node:fs'

const THEME_PATH = 'src/styles/globals.css'

function readTokens() {
  const css = readFileSync(THEME_PATH, 'utf8')
  const tokens = {}

  for (const match of css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) {
    tokens[match[1]] = match[2]
  }

  return tokens
}

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

const relativeLuminance = (hex) => {
  const [r, g, b] = toRgb(hex).map((channel) => {
    const value = channel / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrastRatio = (foreground, background) => {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  )

  return (lighter + 0.05) / (darker + 0.05)
}

/** Flattens a translucent foreground against an opaque background. */
const composite = (foreground, background, alpha) =>
  '#' +
  toRgb(foreground)
    .map((channel, index) =>
      Math.round(channel * alpha + toRgb(background)[index] * (1 - alpha))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')

const t = readTokens()

/*
 * The hero puts type over a photograph, where the background is whatever the camera
 * happened to see. Rather than measure against the image — which would only hold for
 * this one image — the check measures against the worst case any image can present: a
 * blown-out white highlight sitting directly behind a line of text.
 *
 * The static base scrim is at least 85% dusk everywhere type is placed, so that worst
 * case flattens to this. The scroll-driven layer only ever adds more density on top, so
 * this is genuinely the floor rather than a typical value.
 */
const WORST_CASE_HIGHLIGHT = '#ffffff'
const HERO_SCRIM_MINIMUM_ALPHA = 0.85
const heroScrimFloor = composite(t.dusk, WORST_CASE_HIGHLIGHT, HERO_SCRIM_MINIMUM_ALPHA)

/*
 * Tonal washes are translucent hues laid over paper, which means the surface a caption
 * lands on is neither the hue nor the paper. Composite first, then measure.
 */
const warmWash = composite(t.dawn, t.paper, 0.25)
const coolWash = composite(t.dusk, t.paper, 0.2)
const ministryCoolWash = composite(t.dusk, t.paper, 0.07)
const invitationWash = composite(t.dawn, t.paper, 0.12)

// `min` follows WCAG: 4.5 for text under ~24px, 3 for large text and non-text boundaries.
const pairs = [
  // The light register.
  ['ink on paper', t.ink, t.paper, 4.5],
  ['ink-soft on paper', t['ink-soft'], t.paper, 4.5],
  ['ink-soft on paper-deep', t['ink-soft'], t['paper-deep'], 4.5],
  ['ink-soft on paper-warm', t['ink-soft'], t['paper-warm'], 4.5],
  ['ink-muted eyebrow on paper', t['ink-muted'], t.paper, 4.5],
  ['ink-muted eyebrow on paper-deep', t['ink-muted'], t['paper-deep'], 4.5],
  ['ink-muted eyebrow on paper-warm', t['ink-muted'], t['paper-warm'], 4.5],
  ['paper on ink (primary button)', t.paper, t.ink, 4.5],

  // Dawn carries links and small text, so it is held to the text floor, not the 3:1 one.
  ['dawn link on paper', t.dawn, t.paper, 4.5],
  ['dawn link on paper-deep', t.dawn, t['paper-deep'], 4.5],
  ['dawn link on paper-warm', t.dawn, t['paper-warm'], 4.5],
  ['dawn "Live now" on paper', t.dawn, t.paper, 4.5],

  // Tonal washes, composited over paper first.
  ['ink-soft caption on warm wash', t['ink-soft'], warmWash, 4.5],
  ['ink-soft caption on cool wash', t['ink-soft'], coolWash, 4.5],
  ['ink-muted on ministry cool wash', t['ink-muted'], ministryCoolWash, 4.5],
  ['ink-muted on invitation wash', t['ink-muted'], invitationWash, 4.5],
  ['dawn tag on invitation wash', t.dawn, invitationWash, 4.5],

  // The dusk register.
  ['paper-on-dusk on dusk', t['paper-on-dusk'], t.dusk, 4.5],
  ['paper-on-dusk on dusk-raised', t['paper-on-dusk'], t['dusk-raised'], 4.5],
  ['dawn-soft eyebrow on dusk', t['dawn-soft'], t.dusk, 4.5],
  ['dawn-soft eyebrow on dusk-raised', t['dawn-soft'], t['dusk-raised'], 4.5],
  ['dusk on paper-on-dusk (on-dusk button)', t.dusk, t['paper-on-dusk'], 4.5],

  // The hero, against the worst case any photograph can present behind the type.
  ['paper-on-dusk over hero scrim floor', t['paper-on-dusk'], heroScrimFloor, 4.5],
  ['dawn-glow eyebrow over hero scrim floor', t['dawn-glow'], heroScrimFloor, 4.5],
  [
    'paper-on-dusk/75 over hero scrim floor',
    composite(t['paper-on-dusk'], heroScrimFloor, 0.75),
    heroScrimFloor,
    4.5,
  ],

  // Non-text boundaries and marks.
  ['dawn focus ring against paper', t.dawn, t.paper, 3],
  ['dawn focus ring against paper-deep', t.dawn, t['paper-deep'], 3],
  ['dawn focus ring against paper-warm', t.dawn, t['paper-warm'], 3],
  ['dawn-soft focus ring against dusk', t['dawn-soft'], t.dusk, 3],
  ['paper glyph on dawn', t.paper, t.dawn, 3],
  [
    'on-dusk-quiet button border over hero scrim',
    composite(t['paper-on-dusk'], heroScrimFloor, 0.7),
    heroScrimFloor,
    3,
  ],
  ['dawn-soft underline over hero scrim (non-text)', t['dawn-soft'], heroScrimFloor, 3],

  // Translucent text in the dusk register, measured composited.
  ['paper-on-dusk/75 over dusk', composite(t['paper-on-dusk'], t.dusk, 0.75), t.dusk, 4.5],
  ['paper-on-dusk/70 over dusk', composite(t['paper-on-dusk'], t.dusk, 0.7), t.dusk, 4.5],
  ['paper-on-dusk/60 over dusk', composite(t['paper-on-dusk'], t.dusk, 0.6), t.dusk, 4.5],
  [
    'paper-on-dusk/70 over dusk-raised',
    composite(t['paper-on-dusk'], t['dusk-raised'], 0.7),
    t['dusk-raised'],
    4.5,
  ],
]

let failures = 0

for (const [label, foreground, background, minimum] of pairs) {
  if (!foreground || !background) {
    console.error(`  ERROR  ${label} — token missing from ${THEME_PATH}`)
    failures += 1
    continue
  }

  const ratio = contrastRatio(foreground, background)
  const passes = ratio >= minimum
  if (!passes) failures += 1

  console.log(
    `  ${passes ? 'pass' : 'FAIL'}  ${ratio.toFixed(2).padStart(6)}:1  (min ${minimum})  ${label}`,
  )
}

console.log(
  failures === 0
    ? `\nAll ${pairs.length} colour pairs meet their contrast floor.`
    : `\n${failures} of ${pairs.length} colour pairs are below their contrast floor.`,
)

process.exit(failures === 0 ? 0 : 1)
