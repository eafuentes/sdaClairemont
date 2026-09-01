'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Container } from '@/components/layout/container'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { PointerParallax } from '@/components/motion/pointer-parallax'
import { Reveal } from '@/components/motion/reveal'
import { POINTER } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { Ministry } from '@/types/content'

interface MinistrySwitcherProps {
  ministries: Ministry[]
}

const toneWash: Record<Ministry['tone'], string> = {
  warm: 'bg-paper-warm',
  cool: 'bg-paper-deep',
  neutral: 'bg-paper',
}

const placeholderTone: Record<Ministry['tone'], 'warm' | 'cool' | 'neutral'> = {
  warm: 'warm',
  cool: 'cool',
  neutral: 'neutral',
}

/**
 * Desktop ministries chapter: a list of names beside one photographic plate.
 *
 * State is a single active index. Every image is in the DOM from the start so a hover
 * never waits on the network. Each name is a real link; hover and focus change which
 * plate is showing, clicking goes through. Visibility versus the stacked rows is CSS
 * (`hover: hover` and `pointer: fine`), so this component can hydrate on a phone
 * without attaching a pointer scene the visitor cannot use.
 */
export function MinistrySwitcher({ ministries }: MinistrySwitcherProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = ministries[activeIndex] ?? ministries[0]
  if (!active) return null

  return (
    <div
      className={cn(
        'ministry-switcher min-h-dvh transition-colors duration-[var(--dur-slow)] ease-[var(--ease-out)]',
        toneWash[active.tone],
      )}
    >
      <Container className="grid min-h-dvh grid-cols-12 items-center gap-8">
        <ul className="col-span-5">
          {ministries.map((ministry, index) => {
            const isActive = ministry.slug === active.slug
            return (
              <Reveal as="li" delay={index * 0.04} key={ministry.slug}>
                <Link
                  className={cn(
                    'block border-l-2 py-3 pl-5 font-serif text-display-2 transition-[color,border-color] duration-[var(--dur-quick)] ease-out',
                    isActive
                      ? 'border-dawn text-ink'
                      : 'border-transparent text-ink-muted hover:text-ink-soft',
                  )}
                  href={`/ministries/${ministry.slug}`}
                  onFocus={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {ministry.name}
                </Link>
              </Reveal>
            )
          })}
        </ul>

        <div className="col-span-6 col-start-7">
          <PointerParallax className="relative aspect-[4/5] overflow-hidden" max={POINTER.plate}>
            {ministries.map((ministry) => (
              <div
                aria-hidden={ministry.slug !== active.slug}
                className={cn(
                  'absolute inset-0 transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-out)]',
                  ministry.slug === active.slug ? 'opacity-100' : 'opacity-0',
                )}
                key={ministry.slug}
              >
                <MediaPlaceholder
                  className="h-full"
                  description={`Wide atmospheric frame for ${ministry.name}: the group in the middle of doing the thing, shot from a distance rather than posed.`}
                  image={ministry.switcherImage}
                  tone={placeholderTone[ministry.tone]}
                />
              </div>
            ))}
          </PointerParallax>

          <div className="mt-8 grid">
            {ministries.map((ministry) => {
              const isActive = ministry.slug === active.slug
              return (
                <p
                  aria-hidden={!isActive}
                  className={cn(
                    'col-start-1 row-start-1 max-w-measure font-sans text-body text-ink-soft transition-[opacity,transform] duration-[var(--dur-slow)] ease-[var(--ease-out)]',
                    isActive
                      ? 'translate-y-0 opacity-100'
                      : 'pointer-events-none translate-y-2 opacity-0',
                  )}
                  key={ministry.slug}
                >
                  {ministry.shortDescription}
                  <span className="mt-4 block font-sans text-eyebrow text-ink-muted uppercase">
                    {ministry.ageRange}
                    <span aria-hidden="true"> · </span>
                    {ministry.meetingSchedule}
                  </span>
                </p>
              )
            })}
          </div>
        </div>
      </Container>
    </div>
  )
}
