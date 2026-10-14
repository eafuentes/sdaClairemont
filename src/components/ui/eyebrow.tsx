import { cn } from '@/lib/utils'

interface EyebrowProps {
  children: React.ReactNode
  /**
   * Chapter number, rendered before the label as `01 — ARRIVAL`. The numbering is
   * what turns scrolling into reading, so it is a first-class prop rather than
   * something callers hand-assemble into the label.
   */
  index?: string
  className?: string
}

/**
 * The small uppercase label that opens a chapter or section.
 *
 * Renders as a `<p>` rather than a heading: it is a kicker, not a document-outline
 * entry, and promoting it to `<h*>` would put a bare label into the screen-reader
 * heading list ahead of the real title.
 */
export function Eyebrow({ children, index, className }: EyebrowProps) {
  return (
    <p className={cn('flex items-center gap-3 font-sans text-eyebrow text-ink-muted uppercase', className)}>
      <span aria-hidden="true" className="inline-block h-px w-5 shrink-0 bg-dawn" />
      <span>
        {index ? (
          <>
            <span className="tabular">{index}</span>
            <span aria-hidden="true"> — </span>
          </>
        ) : null}
        {children}
      </span>
    </p>
  )
}
