import { Container } from '@/components/layout/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { cn } from '@/lib/utils'

type ChapterRegister = 'paper' | 'paper-deep' | 'dusk'

interface ChapterProps {
  /** Anchor target, also used by the chapter progress indicator in Phase 3. */
  id: string
  /** Two-digit chapter number. The numbering is what turns scrolling into reading. */
  index: string
  eyebrow: string
  title?: string
  children: React.ReactNode
  register?: ChapterRegister
  /**
   * Set when the chapter composes its own full-bleed layout. Photographic plates break
   * the container deliberately and often, so this is common rather than exceptional.
   */
  bleed?: boolean
  className?: string
}

const registerClasses: Record<ChapterRegister, string> = {
  paper: 'bg-paper',
  'paper-deep': 'bg-paper-deep',
  dusk: 'register-dusk',
}

/**
 * The homepage chapter wrapper: numbering, heading, vertical rhythm, and register.
 *
 * Centralising the rhythm here is what keeps ten chapters feeling like one composed
 * document instead of ten sections that each chose their own padding.
 */
export function Chapter({
  id,
  index,
  eyebrow,
  title,
  children,
  register = 'paper',
  bleed = false,
  className,
}: ChapterProps) {
  const header = (
    <div className={cn(bleed && 'mb-12')}>
      <Eyebrow className={register === 'dusk' ? 'text-dawn-soft' : undefined} index={index}>
        {eyebrow}
      </Eyebrow>
      {title ? (
        <h2 className="mt-6 max-w-measure-lead font-serif text-display-2" id={`${id}-title`}>
          {title}
        </h2>
      ) : null}
    </div>
  )

  return (
    <section
      aria-labelledby={title ? `${id}-title` : undefined}
      className={cn('py-section-lg', registerClasses[register], className)}
      id={id}
    >
      {bleed ? (
        <>
          <Container>{header}</Container>
          {children}
        </>
      ) : (
        <Container>
          {header}
          <div className="mt-12">{children}</div>
        </Container>
      )}
    </section>
  )
}
