import 'server-only'

/**
 * Cache tags used by GROQ fetches and by `/api/revalidate`.
 *
 * Publishing one event should regenerate the events routes and the homepage, not
 * the whole site. The webhook reads `_type` and `slug` from the payload and
 * returns exactly these tags.
 */
export function cacheTagsForSanityDocument(document: {
  _id?: string | null
  _type?: string | null
  slug?: string | { current?: string | null } | null
}): string[] {
  const type = document._type
  if (!type) return []

  const slug =
    typeof document.slug === 'string' ? document.slug : (document.slug?.current ?? undefined)

  const tags = new Set<string>([type])
  if (slug) tags.add(`${type}:${slug}`)

  if (HOMEPAGE_TYPES.has(type)) {
    tags.add('homePage')
    tags.add('siteSettings')
  }

  if (type === 'announcement') tags.add('sabbathProgram')
  if (type === 'resource') tags.add('ministry')
  if (type === 'person') tags.add('ministry')
  if (type === 'prophecyPage') tags.add('prophecyPage')

  return [...tags]
}

const HOMEPAGE_TYPES = new Set([
  'siteSettings',
  'homePage',
  'sabbathProgram',
  'event',
  'ministry',
  'sermon',
  'testimonial',
  'person',
  'announcement',
])
