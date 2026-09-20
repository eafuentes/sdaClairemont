import { brandGradient, type BrandGradient } from '@/styles/palette'
import { cn } from '@/lib/utils'

interface BrandStatementProps {
  children: React.ReactNode
  gradient?: BrandGradient
}

function gradientClass(name: BrandGradient): string {
  return brandGradient[name]
}

/**
 * Full-bleed statement band. Keywords in the children should be wrapped in
 * `<strong>` — they inherit paper and go semibold against the gradient.
 */
export function BrandStatement({ children, gradient = 'horizon' }: BrandStatementProps) {
  return (
    <section className={cn(gradientClass(gradient), 'px-6 py-section-sm md:py-16')}>
      <p className="mx-auto max-w-measure-lead text-center font-sans text-body-lg leading-relaxed text-paper [&_strong]:font-semibold">
        {children}
      </p>
    </section>
  )
}

/** The church's one-sentence brand line, used under pathway tiles. */
export function ChurchStatement() {
  return (
    <BrandStatement>
      Clairemont is a Seventh-day Adventist church on Hathaway Street. We gather on Saturday
      because that is the Sabbath. What we preach is meant to be{' '}
      <strong>fresh, real, and powerful</strong> — and the <strong>Great Commission</strong> is why
      the doors stay open.
    </BrandStatement>
  )
}
