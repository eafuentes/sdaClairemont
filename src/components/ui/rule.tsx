import { cn } from '@/lib/utils'

interface RuleProps {
  className?: string
  /**
   * A 24px dawn tick at the start of the hairline. The typesetter's mark that
   * tells a reader a new thought has begun.
   */
  mark?: boolean
}

/**
 * The hairline.
 *
 * There is exactly one border weight in this design system, and this is it.
 * Structure is drawn with rules, spacing and typographic hierarchy rather than with
 * cards, shadows and rounded containers.
 */
export function Rule({ className, mark = false }: RuleProps) {
  if (mark) {
    return (
      <div aria-hidden="true" className={cn('flex items-center', className)}>
        <span className="h-px w-6 bg-dawn" />
        <span className="h-px min-w-0 flex-1 bg-rule" />
      </div>
    )
  }

  return <hr className={cn('border-0 border-t border-rule', className)} />
}
