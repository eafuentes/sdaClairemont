/**
 * Measures the JavaScript a real browser downloads for the homepage and the prophecy
 * page, and fails when either exceeds its budget.
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

const ROUTES = [
  {
    name: 'homepage',
    /*
     * Adding /prophecy reshuffled shared vendor chunks by about 0.6 KB. Same class of
     * cost as mounting Studio: the homepage imports none of the new page, but the
     * split changes. Recorded rather than fought.
     */
    budgetKb: 199,
    documents: ['.next/server/app/index.html'],
  },
  {
    name: 'prophecy',
    /*
     * This page is a document with CSS drawings. It must not import homepage motion
     * islands. The budget is the layout floor plus a little room, recorded so a future
     * WebGL temptation has to edit this line on purpose.
     */
    budgetKb: 180,
    documents: ['.next/server/app/(site)/prophecy.html', '.next/server/app/prophecy.html'],
  },
]

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
 * The 6.6 KB line is the surprising one and worth reading twice. None of Studio's code is
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
 * Phase 3 adds about 2 KB on top of that 193.6: the ministry switcher island, parallax
 * plates, line-split text, and the shared atmosphere listener. Those ride the engines
 * already paid for. They are not a second animation library.
 *
 * The headroom is deliberately small. Anything that moves this number should be a
 * decision someone made on purpose, which means it should have to edit this line.
 */
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

function scriptsFrom(html) {
  const modern = []
  const skipped = []

  for (const tag of html.matchAll(/<script[^>]*\bsrc="([^"]+\.js)"[^>]*>/g)) {
    const [element, src] = tag
    const target = /\bnomodule\b/i.test(element) ? skipped : modern
    if (!target.some((entry) => entry.src === src)) target.push({ src, element })
  }

  return { modern, skipped }
}

function readFirst(paths) {
  for (const path of paths) {
    try {
      return { path, html: readFileSync(path, 'utf8') }
    } catch {
      /* try the next candidate */
    }
  }

  return null
}

let failed = false

for (const route of ROUTES) {
  const document = readFirst(route.documents)
  if (!document) {
    console.error(`  ERROR  ${route.name} HTML not found. Run \`pnpm build\` first.`)
    failed = true
    continue
  }

  const { modern, skipped } = scriptsFrom(document.html)
  const { total, rows } = measure(modern)
  const { total: skippedTotal } = measure(skipped)
  const totalKb = total / 1024
  const overBudget = totalKb > route.budgetKb
  if (overBudget) failed = true

  console.log(`\n  ${route.name}  (${document.path})`)
  for (const [bytes, src] of rows) {
    console.log(`  ${String(bytes).padStart(7)}  ${src.replace('/_next/static/chunks/', '')}`)
  }

  console.log(
    `\n  ${overBudget ? 'FAIL' : 'pass'}  ${route.name} JavaScript ${totalKb.toFixed(1)} KB gzipped ` +
      `(budget ${route.budgetKb} KB)`,
  )
  console.log(
    `        excluded ${(skippedTotal / 1024).toFixed(1)} KB of nomodule polyfills that ` +
      `modern browsers never request`,
  )
}

process.exit(failed ? 1 : 0)
