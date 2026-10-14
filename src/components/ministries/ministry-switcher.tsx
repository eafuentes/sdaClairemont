'use client'

import Link from 'next/link'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { Container } from '@/components/layout/container'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { PointerParallax } from '@/components/motion/pointer-parallax'
import { Reveal } from '@/components/motion/reveal'
import { Button } from '@/components/ui/button'
import { DURATION, EASE_OUT, POINTER } from '@/lib/motion'
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

const copyTransition = { duration: DURATION.base, ease: EASE_OUT }

/**
 * Desktop ministries chapter: names beside one photographic plate.
 *
 * Only the active ministry's copy is in the layout — stacking every description in
 * one grid cell looked like a broken caption when the inactive lines still painted.
 * Hover and focus swap the plate; the name remains a real link through to the page.
 */
export function MinistrySwitcher({ ministries }: MinistrySwitcherProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const active = ministries[activeIndex] ?? ministries[0]
  if (!active) return null

  return (
    <div className="ministry-switcher">
      <Container className="grid grid-cols-12 items-start gap-x-8">
        <div className="col-span-5">
          <ul>
            {ministries.map((ministry, index) => {
              const isActive = ministry.slug === active.slug
              return (
                <Reveal as="li" delay={index * 0.05} key={ministry.slug}>
                  <Link
                    className={cn(
                      'block border-l-2 py-2 pl-5 font-display text-heading-2 transition-[color,border-color] duration-[var(--dur-quick)] ease-out',
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

          <div className="mt-8 border-t border-rule pt-6">
            {prefersReducedMotion ? (
              <MinistryCopy ministry={active} />
            ) : (
              <AnimatePresence mode="wait">
                <m.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  initial={{ opacity: 0, y: 8 }}
                  key={active.slug}
                  transition={copyTransition}
                >
                  <MinistryCopy ministry={active} />
                </m.div>
              </AnimatePresence>
            )}
          </div>

          <Button className="mt-4" href="/ministries" variant="tertiary">
            All ministries
          </Button>
        </div>

        <div className="col-span-6 col-start-7">
          <div
            className={cn(
              'transition-colors duration-[var(--dur-slow)] ease-[var(--ease-out)]',
              toneWash[active.tone],
            )}
          >
            <PointerParallax className="relative aspect-[3/2] overflow-hidden" max={POINTER.plate}>
              {ministries.map((ministry) => {
                const isActive = ministry.slug === active.slug
                return (
                  <div
                    aria-hidden={!isActive}
                    className={cn(
                      'absolute inset-0 transition-[opacity,transform] duration-[var(--dur-slow)] ease-[var(--ease-out)]',
                      isActive ? 'z-[1] opacity-100' : 'z-0 opacity-0',
                      prefersReducedMotion ? null : isActive ? 'translate-y-0' : 'translate-y-3',
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
                )
              })}
            </PointerParallax>
          </div>
        </div>
      </Container>
    </div>
  )
}

function MinistryCopy({ ministry }: { ministry: Ministry }) {
  return (
    <>
      <p className="max-w-measure font-sans text-body-sm text-ink-soft">{ministry.shortDescription}</p>
      <p className="mt-3 font-sans text-body-sm text-ink-muted">
        {ministry.ageRange}
        {ministry.ageRange && ministry.meetingSchedule ? (
          <span aria-hidden="true"> · </span>
        ) : null}
        {ministry.meetingSchedule}
      </p>
    </>
  )
}
