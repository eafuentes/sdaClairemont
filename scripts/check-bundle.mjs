/**
 * Measures the JavaScript a real browser downloads for the homepage, and fails when it
 * exceeds the budget.
 *
 * Counts only what a modern browser actually fetches. Next emits a core-js polyfill chunk
 * — around 39 KB gzipped — behind `nomodule`, which every browser this site targets skips
 * entirely. Counting it would inflate the number by a third and push the budget toward
 * decisions that buy nothing, so it is excluded and reported separately.
 *
 * Sizes are gzipped, because that is what goes over the wire.
 *
 * Requires a production build. Run with `pnpm check:bundle`. Wired into CI.
 */
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const DOCUMENT = '.next/server/app/index.html'

/*
 * Measured, not aspirational. The planning docs carried a 120 KB budget written before
 * anything was built; Next 16 App Router with React 19 costs 140.8 KB gzipped on a page
 * with no client components at all, so 120 KB was never reachable and a budget nobody can
 * meet is a budget everybody ignores.
 *
 * The breakdown, each line measured by building with that feature stubbed out:
 *
 *   140.8 KB  framework floor — React and the App Router runtime, not ours to cut
 *    38.4 KB  motion: scroll springs and transforms, for the hero's dusk transformation
 *     7.1 KB  motion: the keyframe engine, pulled in by the hero's entrance sequence
 *     0.7 KB  scroll reveals across the nine chapters below the hero
 *     6.6 KB  re-chunking overhead from co-locating Sanity Studio in this app
 *   -------
 *   193.6 KB
 *
 * The last line is the surprising one and worth reading twice. None of Studio's code is
 * on the homepage — no Sanity, no styled-components, verified by grepping the chunks.
 * Mounting a second large client application in the same Next app simply changes how
 * Turbopack splits shared vendor code, and the homepage ends up paying 6.6 KB for the
 * same modules arranged across eleven chunks instead of eight. Measured by moving the
 * route out and rebuilding: 187.0 KB without it, 193.6 KB with it.
 *
 * That cost buys same-origin Presentation and Visual Editing, and one deployment to hand
 * over to the church instead of two. It is a deliberate trade recorded in
 * CMS-ARCHITECTURE.md, not an accident — and if this number ever becomes the constraint
 * that matters, moving Studio to its own deployment is what recovers it.
 *
 * The 7.1 KB line is the one worth understanding before trimming anything. Scroll-linked
 * motion and keyframed motion are separate engines: a component that only maps scroll
 * position onto `style` never loads the second one. The hero's opening sequence is the
 * first thing on the site to use `initial`/`animate`, and it pays for the whole engine.
 * Reveals then ride along for almost nothing, which is why nine chapters of them cost
 * less than a tenth of what the entrance did.
 *
 * So the honest trade is: the entrance sequence costs 7 KB, and everything animated
 * after it is close to free. Removing one reveal saves nothing. Removing the entrance
 * saves 7 KB and is a design decision, not a performance one.
 *
 * The headroom is deliberately small. Anything that moves this number should be a
 * decision someone made on purpose, which means it should have to edit this line.
 */
const BUDGET_KB = 196

let html
try {
  html = readFileSync(DOCUMENT, 'utf8')
} catch {
  console.error(`  ERROR  ${DOCUMENT} not found. Run \`pnpm build\` first.`)
  process.exit(1)
}

const modern = []
const skipped = []

for (const tag of html.matchAll(/<script[^>]*\bsrc="([^"]+\.js)"[^>]*>/g)) {
  const [element, src] = tag
  const target = /\bnomodule\b/i.test(element) ? skipped : modern
  if (!target.some((entry) => entry.src === src)) target.push({ src, element })
}

function measure(entries) {
  let total = 0
  const rows = []

  for (const { src } of entries) {
    try {
      const bytes = gzipSync(readFileSync(`.next${src.replace('/_next', '')}`)).length
      total += bytes
      rows.push([bytes, src])
    } catch {
      rows.push([0, `${src}  (not found)`])
    }
  }

  return { total, rows: rows.sort((a, b) => b[0] - a[0]) }
}

const { total, rows } = measure(modern)
const { total: skippedTotal } = measure(skipped)

for (const [bytes, src] of rows) {
  console.log(`  ${String(bytes).padStart(7)}  ${src.replace('/_next/static/chunks/', '')}`)
}

const totalKb = total / 1024
const overBudget = totalKb > BUDGET_KB

console.log(
  `\n  ${overBudget ? 'FAIL' : 'pass'}  homepage JavaScript ${totalKb.toFixed(1)} KB gzipped ` +
    `(budget ${BUDGET_KB} KB)`,
)
console.log(
  `        excluded ${(skippedTotal / 1024).toFixed(1)} KB of nomodule polyfills that ` +
    `modern browsers never request`,
)

process.exit(overBudget ? 1 : 0)
