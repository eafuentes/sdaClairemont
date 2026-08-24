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

// `min` follows WCAG: 4.5 for text under ~24px, 3 for large text and non-text boundaries.
const pairs = [
  ['ink on paper', t.ink, t.paper, 4.5],
  ['ink-70 on paper', t['ink-70'], t.paper, 4.5],
  ['ink-70 on paper-deep', t['ink-70'], t['paper-deep'], 4.5],
  ['ink-45 eyebrow on paper', t['ink-45'], t.paper, 4.5],
  ['ink-45 eyebrow on paper-deep', t['ink-45'], t['paper-deep'], 4.5],
  ['ink-45 eyebrow on paper-warm', t['ink-45'], t['paper-warm'], 4.5],
  ['ink-45 eyebrow on sky-100', t['ink-45'], t['sky-100'], 4.5],
  ['paper on ink (primary button)', t.paper, t.ink, 4.5],
  ['dawn-deep body link on paper', t['dawn-deep'], t.paper, 4.5],
  ['sage-deep tag on paper-deep', t['sage-deep'], t['paper-deep'], 4.5],
  ['sky-900 on sky-100', t['sky-900'], t['sky-100'], 4.5],
  ['sky-900 on sky-300', t['sky-900'], t['sky-300'], 4.5],
  ['paper-on-dusk on dusk', t['paper-on-dusk'], t.dusk, 4.5],
  ['paper-on-dusk on dusk-raised', t['paper-on-dusk'], t['dusk-raised'], 4.5],
  ['ember "Live now" on dusk', t.ember, t.dusk, 4.5],

  // Non-text boundaries and marks.
  ['dawn focus ring against paper', t.dawn, t.paper, 3],
  ['dawn focus ring against paper-deep', t.dawn, t['paper-deep'], 3],
  ['dawn focus ring against paper-warm', t.dawn, t['paper-warm'], 3],
  ['dawn-soft focus ring against dusk', t['dawn-soft'], t.dusk, 3],
  ['paper glyph on dawn', t.paper, t.dawn, 3],

  // Translucent text in the dusk register, measured composited.
  ['paper-on-dusk/75 over dusk', composite(t['paper-on-dusk'], t.dusk, 0.75), t.dusk, 4.5],
  ['paper-on-dusk/70 over dusk', composite(t['paper-on-dusk'], t.dusk, 0.7), t.dusk, 4.5],
  ['paper-on-dusk/60 over dusk', composite(t['paper-on-dusk'], t.dusk, 0.6), t.dusk, 4.5],
  ['paper-on-dusk/50 over dusk', composite(t['paper-on-dusk'], t.dusk, 0.5), t.dusk, 4.5],
  [
    'paper-on-dusk/60 over dusk-raised',
    composite(t['paper-on-dusk'], t['dusk-raised'], 0.6),
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
