/**
 * Verifies that the configured Sanity project is reachable and that the
 * NEXT_PUBLIC_SANITY_* environment variables are correct.
 *
 * Run with: pnpm sanity:ping
 *
 * Intentionally standalone. It uses the same library and the same variable names as
 * src/sanity/lib/client.ts, but does not import the app, so it validates
 * configuration without dragging the Next runtime into a CLI script.
 */
import { createClient } from '@sanity/client'

const required = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'NEXT_PUBLIC_SANITY_API_VERSION',
]

const missing = required.filter((name) => !process.env[name])

if (missing.length > 0) {
  console.error(`Missing environment variables:\n${missing.map((n) => `  - ${n}`).join('\n')}`)
  console.error('\nCopy .env.example to .env.local and fill in the Sanity values.')
  process.exit(1)
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
})

console.log(`Sanity project ${projectId}, dataset "${dataset}", API ${apiVersion}`)

try {
  const documentCount = await client.fetch('count(*)')
  console.log(`Connected. ${documentCount} published document(s) in the dataset.`)

  if (documentCount === 0) {
    console.log('An empty dataset is expected until schemas and content arrive in Phase 2.')
  }
} catch (error) {
  const status = error?.statusCode ?? error?.response?.statusCode

  if (status === 401 || status === 403) {
    console.error('Reachable, but the dataset is not publicly readable.')
    console.error('Either make the dataset public or supply a read token (Phase 2).')
  } else if (status === 404) {
    console.error('Project or dataset not found. Check the project ID and dataset name.')
  } else {
    console.error(`Failed to reach Sanity: ${error?.message ?? String(error)}`)
  }

  process.exit(1)
}
