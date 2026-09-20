'use client'

import { useReducedMotion } from 'motion/react'
import { useRef } from 'react'

import { ChurchHeroScene } from '@/components/hero/church-hero-scene'
import { ChurchStillScene } from '@/components/hero/church-still-scene'
import { ChurchVideoScene } from '@/components/hero/church-video-scene'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { usePointerParallax } from '@/hooks/use-pointer-parallax'
import type { HomePageContent, SiteSettings } from '@/types/content'

export type ChurchHeroMedia = 'photo' | 'still' | 'video'

interface ChurchHeroProps {
  content: HomePageContent['arrival']
  settings: SiteSettings
  media?: ChurchHeroMedia
}

/**
 * Chapter 01 — Arrival. A 2.5D church scene, then the words a visitor came for.
 *
 * The plates are decorative. Identity lives in the heading, the times, and the
 * actions — which is why the images carry empty alt and the copy does not move
 * with the pointer.
 */
export function ChurchHero({ content, settings, media = 'photo' }: ChurchHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const enabled = !prefersReducedMotion && media !== 'video'
  const pointer = usePointerParallax(sectionRef, enabled)
  const primaryServices = settings.serviceTimes.filter((service) => service.isPrimary)

  return (
    <section
      ref={sectionRef}
      aria-labelledby="arrival-headline"
      className="relative isolate min-h-[32rem] w-full touch-pan-y overflow-hidden bg-dusk lg:h-[min(56.25vw,calc(100dvh-5.5rem))] lg:min-h-0"
      id="arrival"
    >
      {media === 'video' ? (
        <ChurchVideoScene />
      ) : media === 'still' ? (
        <ChurchStillScene enabled={enabled} pointerX={pointer.x} pointerY={pointer.y} />
      ) : (
        <ChurchHeroScene enabled={enabled} pointerX={pointer.x} pointerY={pointer.y} />
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-paper/80 via-paper/35 to-transparent lg:from-paper/45 lg:via-paper/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-dusk/20 to-transparent"
      />

      <Container className="relative flex min-h-[32rem] items-end pb-12 lg:absolute lg:inset-0 lg:min-h-0 lg:items-center lg:pb-0">
        <div className="max-w-[38rem] py-16 md:py-24">
          <Eyebrow>{settings.name}</Eyebrow>
          <h1
            className="mt-6 max-w-[18ch] font-display text-display-1 text-ink"
            id="arrival-headline"
          >
            {content.headline}
          </h1>
          {content.subhead ? (
            <p className="mt-6 max-w-[36ch] font-sans text-body-lg text-ink-soft">
              {content.subhead}
            </p>
          ) : null}

          <div className="mt-10 h-px origin-left bg-rule" />

          <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
            {primaryServices.map((service) => (
              <div key={service.label}>
                <dt className="font-sans text-eyebrow text-ink-muted uppercase">{service.label}</dt>
                <dd className="tabular mt-1 font-display text-heading-2 text-ink">
                  {service.startTime}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/visit">Plan Your Visit</Button>
            <Button href="/watch" variant="secondary">
              Watch Online
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
