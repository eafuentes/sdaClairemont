'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  activeClassName?: string
}

/**
 * A navigation link that knows whether it is the current section.
 *
 * This is the only reason any part of the header is a Client Component: `aria-current`
 * needs the pathname, and the pathname is a client concern. Keeping it in a leaf this
 * small means the header itself stays a Server Component.
 */
export function NavLink({ href, children, className, activeClassName }: NavLinkProps) {
  const pathname = usePathname()
  const isCurrent = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      aria-current={isCurrent ? 'page' : undefined}
      className={cn(className, isCurrent && activeClassName)}
      href={href}
    >
      {children}
    </Link>
  )
}
