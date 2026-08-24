import { cn } from '@/lib/utils'

interface RuleProps {
  className?: string
}

/**
 * The hairline.
 *
 * There is exactly one border weight in this design system, and this is it.
 * Structure is drawn with rules, spacing and typographic hierarchy rather than with
 * cards, shadows and rounded containers.
 */
export function Rule({ className }: RuleProps) {
  return <hr className={cn('border-0 border-t border-rule', className)} />
}
