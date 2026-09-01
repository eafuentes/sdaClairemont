'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ABOUT_SECTIONS } from '@/content/about'

/**
 * The About family is three pages. This is the trail between them, so Leadership
 * is never a dead end reached only from the homepage sidebar.
 */
export function AboutSubnav() {
  const pathname = usePathname()

  return (
    <nav aria-label="About pages">
      <ul className="flex flex-wrap gap-1 border-y border-rule py-2">
        {ABOUT_SECTIONS.map((section) => {
          const current = pathname === section.href
          return (
            <li key={section.href}>
              <Link
                aria-current={current ? 'page' : undefined}
                className={
                  current
                    ? 'inline-flex min-h-11 items-center rounded-xs bg-ink px-4 font-sans text-body-sm font-medium text-paper'
                    : 'inline-flex min-h-11 items-center rounded-xs px-4 font-sans text-body-sm text-ink-soft hover:text-ink'
                }
                href={section.href}
              >
                {section.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
