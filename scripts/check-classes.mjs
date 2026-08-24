/**
 * Verifies that every colour utility written in the source actually compiles to a rule.
 *
 * Tailwind resolves utilities by scanning source text, and a class naming a token that
 * does not exist is not an error — it simply produces no rule. `text-sage-deep` after
 * `sage` is deleted, or `to-paper` after a rename, looks completely normal in the JSX and
 * silently renders as inherited colour. Type checking cannot see it, the linter cannot see
 * it, and the build succeeds. The only reliable signal is the compiled stylesheet.
 *
 * So this reads the real build output and asserts that each colour class in the source has
 * a matching selector. It also rejects interpolated class names such as `bg-${name}`,
 * which cannot resolve for the same reason and are easy to introduce while refactoring.
 *
 * Scoped to colour utilities on purpose. Those are the ones tied to the token namespace
 * resets in globals.css, so they are the ones a palette change can quietly break — and a
 * narrow check that nobody disables beats a broad one full of false positives.
 *
 * Requires a production build to exist. Run with `pnpm check:classes`. Wired into CI.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SOURCE_ROOT = 'src'
const BUILD_ROOT = '.next/static/chunks'

const COLOUR_PREFIXES = [
  'bg',
  'text',
  'border',
  'from',
  'via',
  'to',
  'decoration',
  'outline',
  'ring',
  'fill',
  'stroke',
  'accent',
  'caret',
  'divide',
  'placeholder',
  'shadow',
]

/*
 * Utilities whose value is a keyword rather than a palette token. They compile fine and
 * are not what this check is looking for, so measuring them would only add noise.
 */
const NON_TOKEN_VALUES = new Set([
  'current',
  'transparent',
  'inherit',
  'balance',
  'pretty',
  'center',
  'left',
  'right',
  'start',
  'end',
  'justify',
  'nowrap',
  'wrap',
  'clip',
  'ellipsis',
  'none',
  'auto',
  'solid',
  'dashed',
  'dotted',
  'double',
  'hidden',
  'visible',
  'collapse',
  'separate',
  'fixed',
  'sm',
  'md',
  'lg',
  'xl',
  'xs',
  'base',
])

function walk(dir, test, found = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, test, found)
    else if (test(full)) found.push(full)
  }
  return found
}

/** Escapes a class name the way a CSS selector spells it. */
function escapeSelector(className) {
  return className.replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`)
}

const sourceFiles = walk(SOURCE_ROOT, (file) => /\.(tsx|ts)$/.test(file))

let stylesheet = ''
try {
  const cssFiles = walk(BUILD_ROOT, (file) => file.endsWith('.css'))
  stylesheet = cssFiles.map((file) => readFileSync(file, 'utf8')).join('\n')
} catch {
  console.error(`  ERROR  no build output under ${BUILD_ROOT}. Run \`pnpm build\` first.`)
  process.exit(1)
}

if (stylesheet.length === 0) {
  console.error(`  ERROR  no stylesheets found under ${BUILD_ROOT}. Run \`pnpm build\` first.`)
  process.exit(1)
}

const missing = new Map()
const interpolated = new Map()
let checked = 0

for (const file of sourceFiles) {
  const source = readFileSync(file, 'utf8')

  for (const match of source.matchAll(/className[=:]\s*[{(]?\s*(['"`])([\s\S]*?)\1/g)) {
    const literal = match[2]

    for (const token of literal.split(/\s+/)) {
      if (token.length === 0) continue

      // `bg-${name}` and friends resolve to nothing.
      if (token.includes('${')) {
        const root = token.split('-')[0].replace(/^.*:/, '')
        if (COLOUR_PREFIXES.includes(root)) {
          interpolated.set(token, (interpolated.get(token) ?? new Set()).add(file))
        }
        continue
      }

      const utility = token.replace(/^.*:/, '')
      const [prefix, ...rest] = utility.split('-')
      if (!COLOUR_PREFIXES.includes(prefix) || rest.length === 0) continue
      if (NON_TOKEN_VALUES.has(rest.join('-').split('/')[0])) continue
      // Arbitrary values carry their own value and cannot reference a deleted token.
      if (utility.includes('[')) continue

      checked += 1
      if (!stylesheet.includes(escapeSelector(token))) {
        missing.set(token, (missing.get(token) ?? new Set()).add(file))
      }
    }
  }
}

for (const [token, files] of interpolated) {
  console.error(`  FAIL  interpolated colour class \`${token}\``)
  for (const file of files) console.error(`          ${file}`)
}

for (const [token, files] of missing) {
  console.error(`  FAIL  \`${token}\` compiles to no rule — the token behind it does not exist`)
  for (const file of files) console.error(`          ${file}`)
}

const failures = missing.size + interpolated.size

console.log(
  failures === 0
    ? `  pass  all ${checked} colour utilities resolve to a compiled rule.`
    : `\n${failures} colour ${failures === 1 ? 'class' : 'classes'} resolve to nothing.`,
)

process.exit(failures === 0 ? 0 : 1)
