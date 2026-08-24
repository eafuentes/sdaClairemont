import Link from 'next/link'

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
 * The two `on-dusk` variants exist because the light-register primary is `bg-ink`, which
 * over the dusk register is dark on dark and effectively disappears. Rather than letting
 * call sites patch that with one-off className overrides, the inversion is a named
 * variant that carries its own verified contrast.
 *
 * Notably absent: hover lift, scale, and shadow bloom. Feedback is a colour or underline
 * change — quick enough to read as a response rather than as an animation. Radius is
 * 2px, because this system's shape scale stops at 4px.
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-paper hover:bg-ink-soft',
  secondary: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink/5',
  tertiary: 'text-ink underline decoration-dawn decoration-1 underline-offset-4 hover:decoration-2',
  'on-dusk': 'bg-paper-on-dusk text-dusk hover:bg-paper',
  // The border is /70 rather than a subtler /40 because this variant sits over
  // photography, where a control outline still has to clear 3:1 against a highlight.
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
 * Still absent: hover lift, scale, and shadow bloom. Nothing moves before it is touched.
 */
const baseClasses =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xs px-6 font-sans ' +
  'text-body-sm font-medium transition-[background-color,border-color,transform,text-decoration-color] ' +
  'duration-[var(--dur-quick)] ease-out active:translate-y-px active:duration-[var(--dur-instant)]'

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
