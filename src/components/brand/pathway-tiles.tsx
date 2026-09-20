'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { PathwayTile, PathwayTileSurface } from '@/content/pathways'
import { brandGradient, isLightGradient, type BrandGradient } from '@/styles/palette'
import { cn } from '@/lib/utils'

interface PathwayTilesProps {
  tiles: readonly PathwayTile[]
  label: string
}

function gradientClass(name: BrandGradient): string {
  return brandGradient[name]
}

function isLightSurface(surface: PathwayTileSurface): boolean {
  return surface.kind === 'photo' || isLightGradient(surface.name)
}

/**
 * Three equal destination tiles — photograph wash or a named brand gradient.
 *
 * Full-bleed, no gap. Each tile is a large hit target. Titles stay serif; hints
 * stay sans. Colour classes are spelled out through `brandGradient`, never built.
 */
export function PathwayTiles({ tiles, label }: PathwayTilesProps) {
  const pathname = usePathname()

  return (
    <nav aria-label={label}>
      <ul className="grid grid-cols-1 md:grid-cols-3">
        {tiles.map((tile) => {
          const current = pathname === tile.href
          const light = isLightSurface(tile.surface)

          return (
            <li key={`${tile.href}-${tile.title}`} className="min-h-56 md:min-h-64">
              <Link
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'relative flex h-full min-h-56 flex-col justify-end overflow-hidden px-8 py-10 md:min-h-64',
                  tile.surface.kind === 'gradient' ? gradientClass(tile.surface.name) : 'bg-paper',
                  light ? 'text-ink' : 'text-paper',
                )}
                href={tile.href}
              >
                {tile.surface.kind === 'photo' ? (
                  <>
                    <Image
                      alt=""
                      className="object-cover grayscale contrast-[0.85] brightness-[1.15]"
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      src={tile.surface.image.src}
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-0 bg-paper',
                        current ? 'opacity-55' : 'opacity-75',
                      )}
                    />
                  </>
                ) : null}

                <span className="relative">
                  <span className="block font-display text-heading-1">{tile.title}</span>
                  <span
                    className={cn(
                      'mt-2 block font-sans text-body-sm',
                      light ? 'text-ink-soft' : 'text-paper/80',
                    )}
                  >
                    {tile.hint}
                  </span>
                  {current ? (
                    <span
                      aria-hidden="true"
                      className={cn('mt-5 block h-px w-8', light ? 'bg-dawn' : 'bg-paper')}
                    />
                  ) : null}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
