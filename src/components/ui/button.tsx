import Link from 'next/link'

import { brandGradient } from '@/styles/palette'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'on-dusk' | 'on-dusk-quiet'

interface ButtonBaseProps {
  children: React.ReactNode
  variant?: ButtonVariant
  className?: string
}

interface ButtonAsLinkProps extends ButtonBaseProps {
  href: string
  /** Set for destinations outside this site; adds the correct rel and target. */
  external?: boolean
  type?: never
}

interface ButtonAsButtonProps extends ButtonBaseProps {
  href?: never
  external?: never
  type?: 'button' | 'submit'
}

type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps

/**
 * One size, five variants, 44px minimum touch target.
 *
 * Filled variants are pills on the brand CTA gradient (crimson into black). Outline
 * variants share the pill so a row of buttons reads as one family. Tertiary stays a
 * text link. Hover swaps the gradient; nothing lifts or scales.
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary: `${brandGradient.cta} text-paper shadow-cta hover:bg-grad-cta-hover`,
  secondary: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink/5',
  tertiary: 'text-ink underline decoration-dawn decoration-1 underline-offset-4 hover:decoration-2',
  'on-dusk': `${brandGradient.cta} text-paper shadow-cta hover:bg-grad-cta-hover`,
  'on-dusk-quiet':
    'border border-paper-on-dusk/70 text-paper-on-dusk hover:border-paper-on-dusk hover:bg-paper-on-dusk/10',
}

/*
 * The press is the one place this system moves a control.
 *
 * 1px down on `:active`, and it goes down faster than it comes back up — `--dur-instant`
 * pressing, `--dur-quick` releasing. That asymmetry is what physical objects do, and it
 * is the difference between a button that acknowledges a press and one that animates.
 *
 * Still absent: hover lift and scale. The gradient shift is the hover response.
 */
const baseClasses =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-7 font-sans ' +
  'text-body-sm font-medium transition-[background-color,background-image,border-color,transform,text-decoration-color] ' +
  'duration-[var(--dur-quick)] ease-out active:translate-y-px active:duration-[var(--dur-instant)]'

export function Button({ children, variant = 'primary', className, ...rest }: ButtonProps) {
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    // Tertiary reads as a link, so it drops the button padding, height, and pill.
    variant === 'tertiary' && 'min-h-0 rounded-none px-0 shadow-none',
    className,
  )

  if ('href' in rest && rest.href !== undefined) {
    const { href, external } = rest

    if (external) {
      return (
        <a className={classes} href={href} target="_blank" rel="noreferrer noopener">
          {children}
        </a>
      )
    }

    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} type={rest.type ?? 'button'}>
      {children}
    </button>
  )
}
