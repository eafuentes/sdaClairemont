'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const VERSIONS = [
  { href: '/', label: 'Home' },
  { href: '/home-photo', label: 'Layers' },
  { href: '/home-video', label: 'Video' },
] as const

const HERO_PATHS: ReadonlySet<string> = new Set(['/home-photo', '/home-video'])

/**
 * A temporary compare control so homepage heroes can be judged side by side.
 */
export function HeroVersionSwitcher() {
  const pathname = usePathname()
  if (!HERO_PATHS.has(pathname)) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--dock-clearance)+0.5rem)] z-50 flex justify-center px-4 lg:bottom-6">
      <nav
        aria-label="Homepage hero versions"
        className="pointer-events-auto flex items-center gap-1 rounded-xs border border-rule bg-paper/95 p-1 shadow-[0_8px_24px_rgb(20_24_26/0.12)]"
      >
        {VERSIONS.map((version) => {
          const current = pathname === version.href
          return (
            <Link
              key={version.href}
              aria-current={current ? 'page' : undefined}
              className={
                current
                  ? 'inline-flex min-h-11 items-center rounded-xs bg-ink px-4 font-sans text-body-sm font-medium text-paper'
                  : 'inline-flex min-h-11 items-center rounded-xs px-4 font-sans text-body-sm text-ink-soft hover:text-ink'
              }
              href={version.href}
            >
              {version.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
