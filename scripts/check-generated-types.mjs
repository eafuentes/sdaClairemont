/**
 * Verifies that the committed Sanity types still match the schemas and the queries.
 *
 * `sanity.types.ts` is generated, and generated files that are committed drift. Someone
 * adds a field to a schema, or adds a projection to a GROQ query, and forgets to rerun
 * typegen. Nothing complains: the old types still compile, because they describe a valid
 * shape — just not the shape the API now returns.
 *
 * That failure mode is nastier than a normal type error, because the types keep asserting
 * something false. A component reads `program.speakerRole` and TypeScript confirms it is a
 * string, while the query stopped selecting the field a week ago and it is `undefined` at
 * runtime. The whole point of typegen is that the compiler knows what the API returns, and
 * a stale file quietly inverts that guarantee into a lie the compiler now helps enforce.
 *
 * So this regenerates both artefacts into a scratch directory and compares them to what is
 * committed. It never rewrites the checked-in files — a CI gate that fixes the thing it is
 * measuring passes for the wrong reason, and the diff still needs to reach review.
 *
 * Run with `pnpm check:types`. Wired into CI. Fix a failure with `pnpm typegen`.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, existsSync, copyFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const SCHEMA_FILE = 'schema.json'
const TYPES_FILE = 'sanity.types.ts'

/** Both artefacts must already be committed, or there is nothing to compare against. */
for (const file of [SCHEMA_FILE, TYPES_FILE]) {
  if (!existsSync(file)) {
    console.error(`✗ ${file} is missing.\n`)
    console.error('  Both generated artefacts are committed to the repository so that a')
    console.error('  clean checkout type-checks without needing Sanity credentials.\n')
    console.error('  Generate them with: pnpm typegen\n')
    process.exit(1)
  }
}

const committed = {
  schema: readFileSync(SCHEMA_FILE, 'utf8'),
  types: readFileSync(TYPES_FILE, 'utf8'),
}

/*
 * Regenerate in place, then restore. The Sanity CLI writes to fixed paths relative to the
 * project root and offers no output override, so working in a scratch directory is not an
 * option — the originals are copied aside and put back in a `finally` instead.
 */
const backupDir = mkdtempSync(join(tmpdir(), 'sanity-typegen-'))
const backups = {
  schema: join(backupDir, SCHEMA_FILE),
  types: join(backupDir, TYPES_FILE),
}

copyFileSync(SCHEMA_FILE, backups.schema)
copyFileSync(TYPES_FILE, backups.types)

let regenerated

try {
  const run = (args) =>
    execFileSync('sanity', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, SANITY_TELEMETRY_DISABLED: '1' },
      encoding: 'utf8',
    })

  run(['schema', 'extract', '--enforce-required-fields', '--force'])
  const typegenOutput = run(['typegen', 'generate'])

  /*
   * Typegen reports an invalid query as a warning and still writes a file, so a broken
   * GROQ string produces a green exit code and a types file missing that query's result
   * type. Treat any reported error as a failure.
   */
  if (/Encountered errors in \d+ file/.test(typegenOutput)) {
    console.error('✗ Typegen reported errors while evaluating queries.\n')
    console.error(typegenOutput.trim().replace(/^/gm, '  '))
    console.error('\n  A query that fails to evaluate silently loses its result type,')
    console.error('  so the code calling it falls back to an untyped shape.\n')
    process.exit(1)
  }

  regenerated = {
    schema: readFileSync(SCHEMA_FILE, 'utf8'),
    types: readFileSync(TYPES_FILE, 'utf8'),
  }
} catch (error) {
  console.error('✗ Could not regenerate the Sanity types.\n')
  console.error(
    String(error.stderr || error.message)
      .trim()
      .replace(/^/gm, '  '),
  )
  console.error('')
  process.exit(1)
} finally {
  copyFileSync(backups.schema, SCHEMA_FILE)
  copyFileSync(backups.types, TYPES_FILE)
  rmSync(backupDir, { recursive: true, force: true })
}

const stale = [
  committed.schema !== regenerated.schema && {
    file: SCHEMA_FILE,
    cause: 'a schema type was added, removed, or had a field changed',
  },
  committed.types !== regenerated.types && {
    file: TYPES_FILE,
    cause: 'a GROQ projection or a schema field changed',
  },
].filter(Boolean)

if (stale.length > 0) {
  console.error('✗ Generated Sanity types are out of date.\n')
  for (const { file, cause } of stale) {
    console.error(`  ${file} — ${cause}`)
  }
  console.error('\n  The committed types no longer describe what the API returns, which')
  console.error('  means TypeScript is confirming field shapes that are not true.\n')
  console.error('  Fix: pnpm typegen, then commit the result.\n')
  process.exit(1)
}

console.log('✓ Generated Sanity types match the schemas and queries')
