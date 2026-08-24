/**
 * Shared GROQ projections.
 *
 * Interpolated into queries as plain strings. Sanity's typegen resolves simple constant
 * interpolation, so these stay type-safe while keeping one definition of what an image
 * or a scripture reference looks like on the wire.
 *
 * The rule from CMS-ARCHITECTURE.md holds throughout: projections are explicit. No query
 * returns a whole document. Fetching only what a component uses keeps payloads small and
 * makes it obvious in review when a component's needs change.
 */

/**
 * Every image the site renders.
 *
 * `dimensions` is not optional. Next's `<Image>` needs intrinsic width and height to
 * reserve space before the file arrives, and without them the page reflows as each photo
 * loads — which is the single largest source of layout shift on an image-led site.
 *
 * `lqip` is the tiny base64 preview Sanity generates on upload. It costs nothing extra to
 * fetch here and gives every photograph a blur placeholder rather than a grey rectangle.
 *
 * `hotspot` and `crop` come along because the layouts crop the same photograph to several
 * aspect ratios, and the editor's chosen focal point is what keeps a face in frame.
 */
export const IMAGE_PROJECTION = /* groq */ `{
  "src": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  alt,
  caption,
  credit,
  provenance,
  provenanceNote,
  hotspot,
  crop
}`

/**
 * A scripture reference, assembled into a citation string in the query.
 *
 * Done here rather than in a component because every surface that shows a reference
 * formats it identically, and three components each building "John 3:16 (NKJV)" from
 * parts is three chances to punctuate it differently.
 */
export const SCRIPTURE_PROJECTION = /* groq */ `{
  book,
  chapter,
  verses,
  translation,
  text,
  "reference": book + " " + string(chapter) + select(defined(verses) => ":" + verses, "")
}`

/**
 * A speaker, resolved from either a referenced person or the free-text fields.
 *
 * Guest speakers are common and are not `person` documents, so both shapes exist in the
 * schema. Collapsing them here means components receive a name and never have to know
 * which kind it was.
 */
export const SPEAKER_PROJECTION = /* groq */ `
  "speakerName": coalesce(speaker->name, speakerName),
  "speakerRole": coalesce(speaker->role, speakerRole),
  "speakerSlug": speaker->slug.current
`
