import Link from 'next/link'

import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary'

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
 * One size, three variants, 44px minimum touch target.
 *
 * Notably absent: hover lift, scale, and shadow bloom. Feedback is a fast colour or
 * underline change at 120ms — quick enough to feel like a response rather than an
 * animation. Radius is 2px, because this system's shape scale stops at 4px.
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-paper hover:bg-ink-70',
  secondary: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink/5',
  tertiary: 'text-ink underline decoration-dawn decoration-1 underline-offset-4 hover:decoration-2',
}

const baseClasses =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xs px-6 font-sans ' +
  'text-body-sm font-medium transition-colors duration-[var(--dur-instant)] ease-out'

export function Button({ children, variant = 'primary', className, ...rest }: ButtonProps) {
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    // Tertiary reads as a link, so it drops the button padding and height.
    variant === 'tertiary' && 'min-h-0 px-0',
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
