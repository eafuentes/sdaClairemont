import { cn } from '@/lib/utils'

interface ScriptureQuoteProps {
  children: React.ReactNode
  /** Passage reference, for example `John 3:16-17`. */
  reference: string
  /** Translation abbreviation, shown alongside the reference when supplied. */
  translation?: string
  className?: string
}

/**
 * Scripture, set in Newsreader italic with the reference beneath.
 *
 * This pairing is the site's most recognisable typographic signature and recurs on
 * the homepage, sermon pages and the Prayer chapter. It is a single component so
 * that treatment stays identical everywhere rather than drifting per page.
 */
export function ScriptureQuote({
  children,
  reference,
  translation,
  className,
}: ScriptureQuoteProps) {
  return (
    <figure className={cn('max-w-measure', className)}>
      <blockquote className="font-serif text-quote text-balance italic">{children}</blockquote>
      <figcaption className="mt-4 font-sans text-eyebrow text-ink-muted uppercase">
        {reference}
        {translation ? <span className="text-ink-muted"> · {translation}</span> : null}
      </figcaption>
    </figure>
  )
}
