import Link from 'next/link'

import { Icon, type IconName } from '@/components/ui/icon'
import { brandGradient } from '@/styles/palette'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'on-dusk' | 'on-dusk-quiet'

interface ButtonBaseProps {
  children: React.ReactNode
  variant?: ButtonVariant
  className?: string
  /**
   * Trailing icon. Defaults to an outbound arrow for external links and a forward
   * arrow for tertiary links; pass `false` to suppress it.
   */
  icon?: IconName | false
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
 * One size, five variants, 44px minimum touch target — tertiary included.
 *
 * Filled variants are pills on the brand CTA gradient (crimson into black). Outline
 * variants share the pill so a row of buttons reads as one family. Tertiary stays a
 * text link but keeps the full-height hit area. Hover swaps the gradient and nudges
 * the trailing arrow; nothing lifts or scales.
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary: `${brandGradient.cta} text-paper shadow-cta hover:bg-grad-cta-hover`,
  secondary: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink/5',
  tertiary: 'text-ink',
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
 */
const baseClasses =
  'group/button inline-flex min-h-11 items-center gap-2 font-sans text-body-sm font-medium ' +
  'transition-[background-color,background-image,border-color,transform] duration-[var(--dur-quick)] ease-out ' +
  'active:translate-y-px active:duration-[var(--dur-instant)]'

const pillClasses = 'justify-center rounded-full px-7'

/*
 * The underline thickens rather than appears: it is already there at rest, so the
 * link is legible as a link on touch, where there is no hover to discover it.
 */
const tertiaryLabelClasses =
  'underline decoration-dawn decoration-1 underline-offset-[0.3em] transition-[text-decoration-thickness] ' +
  'duration-[var(--dur-quick)] ease-out group-hover/button:decoration-2 group-focus-visible/button:decoration-2'

const iconMotion: Partial<Record<IconName, string>> = {
  'arrow-right': 'group-hover/button:translate-x-0.5 group-focus-visible/button:translate-x-0.5',
  'arrow-up-right':
    'group-hover/button:translate-x-px group-hover/button:-translate-y-px group-focus-visible/button:translate-x-px group-focus-visible/button:-translate-y-px',
}

export function Button({ children, variant = 'primary', className, icon, ...rest }: ButtonProps) {
  const isTertiary = variant === 'tertiary'
  const external = 'href' in rest && rest.href !== undefined && rest.external === true
  const iconName =
    icon === false ? null : (icon ?? (external ? 'arrow-up-right' : isTertiary ? 'arrow-right' : null))

  const classes = cn(baseClasses, !isTertiary && pillClasses, variantClasses[variant], className)

  const content = (
    <>
      <span className={isTertiary ? tertiaryLabelClasses : undefined}>{children}</span>
      {iconName ? (
        <Icon
          className={cn(
            'text-[1.1em] transition-transform duration-[var(--dur-quick)] ease-out',
            isTertiary && 'text-dawn',
            iconMotion[iconName],
          )}
          name={iconName}
        />
      ) : null}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </>
  )

  if ('href' in rest && rest.href !== undefined) {
    if (external) {
      return (
        <a className={classes} href={rest.href} target="_blank" rel="noreferrer noopener">
          {content}
        </a>
      )
    }

    return (
      <Link className={classes} href={rest.href}>
        {content}
      </Link>
    )
  }

  return (
    <button className={classes} type={rest.type ?? 'button'}>
      {content}
    </button>
  )
}
