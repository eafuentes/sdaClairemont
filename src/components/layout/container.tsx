import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

/**
 * The page container: 88rem maximum, with margins that widen with the viewport.
 *
 * Full-bleed photographic plates deliberately break out of this container and do so
 * often, so plates are composed outside it rather than fighting it from within.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-page px-5 md:px-8 lg:px-16', className)}>
      {children}
    </div>
  )
}
