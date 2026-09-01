/**
 * Fails a production deploy if any published Sanity document still references
 * placeholder photography.
 *
 * Launch cannot proceed with an AI or stock image on a live page. Studio's
 * "Needs attention" list is the human-facing version of this check; this is the
 * one that cannot be talked past.
 *
 * Runs only when `VERCEL_ENV=production` or `CHECK_PLACEHOLDERS=1`. CI and local
 * production builds skip it so placeholders can exist while photography is in
 * progress. A missing Sanity configuration is also a skip — the site then renders
 * fixtures, which are not CMS documents.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-08-23'
const TOKEN = process.env.SANITY_API_READ_TOKEN

const shouldRun = process.env.VERCEL_ENV === 'production' || process.env.CHECK_PLACEHOLDERS === '1'

const projectIdLooksReal = typeof PROJECT_ID === 'string' && /^[a-z0-9]+$/.test(PROJECT_ID)

if (!shouldRun) {
  console.log('  skip  check:placeholders (not a production deploy)')
  process.exit(0)
}

if (!projectIdLooksReal || !DATASET) {
  console.log('  skip  check:placeholders (Sanity is not configured)')
  process.exit(0)
}

const QUERY = `*[
  !(_id in path("drafts.**")) &&
  !(_type in ["sanity.imageAsset", "sanity.fileAsset", "system.group", "system.retention"])
]`

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function findPlaceholders(value, path = '') {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => findPlaceholders(entry, `${path}[${index}]`))
  }

  if (!isRecord(value)) return []

  const provenance = value.provenance
  const hasAsset = Boolean(value.asset)
  if (hasAsset && provenance && provenance !== 'church-photo') {
    return [
      {
        path: path || '(document)',
        provenance,
        alt: typeof value.alt === 'string' ? value.alt : '',
      },
    ]
  }

  return Object.entries(value).flatMap(([key, nested]) =>
    findPlaceholders(nested, path ? `${path}.${key}` : key),
  )
}

async function fetchDocuments() {
  const { createClient } = await import('@sanity/client')
  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    token: TOKEN,
    useCdn: false,
    perspective: 'published',
  })

  return client.fetch(QUERY)
}

const documents = await fetchDocuments()
const offenders = documents.flatMap((document) => {
  const hits = findPlaceholders(document).filter((hit) => !hit.path.startsWith('_'))
  if (hits.length === 0) return []
  return [
    {
      id: document._id,
      type: document._type,
      title: document.title ?? document.name ?? document.sermonTitle ?? document.shortName,
      hits,
    },
  ]
})

if (offenders.length === 0) {
  console.log('  pass  no published placeholder photography')
  process.exit(0)
}

console.error(
  `  fail  ${offenders.length} published document(s) still use placeholder photography:\n`,
)
for (const document of offenders) {
  console.error(`    ${document.type}  ${document.id}  ${document.title ?? ''}`)
  for (const hit of document.hits) {
    console.error(`      ${hit.path}  ${hit.provenance}${hit.alt ? `  “${hit.alt}”` : ''}`)
  }
}

console.error(
  '\n  Replace those images with church photographs (provenance: church-photo) and republish.',
)
process.exit(1)
