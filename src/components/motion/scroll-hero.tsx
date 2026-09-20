'use client'

import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

import { SCROLL_HERO, SPRING } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { ContentImage } from '@/types/content'

interface ScrollHeroProps {
  image: ContentImage
  eyebrow: string
  title: string
  lede: string
  meta: string
  children?: React.ReactNode
}

const FINE_POINTER = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'

/**
 * Flagship opening: a full-bleed photograph that settles into a contained plate,
 * while the title compresses into a lockup under the site wordmark.
 *
 * Native scroll only. The track is 180vh, under the 200vh cap. The photograph leads
 * on the tighter spring; the type trails so the two objects have different mass.
 * Transform, clip-path, and opacity — no width or height animation.
 *
 * Reduced motion and small or touch viewports render the resting composition: title
 * on the left, plate on the right. That is the designed still page, not a fallback.
 */
export function ScrollHero({ image, eyebrow, title, lede, meta, children }: ScrollHeroProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <>
      {prefersReducedMotion ? null : (
        <ScrollHeroActive eyebrow={eyebrow} image={image} lede={lede} meta={meta} title={title}>
          {children}
        </ScrollHeroActive>
      )}
      <ScrollHeroRest eyebrow={eyebrow} image={image} lede={lede} meta={meta} title={title}>
        {children}
      </ScrollHeroRest>
    </>
  )
}

function ScrollHeroRest({ image, eyebrow, title, lede, meta, children }: ScrollHeroProps) {
  return (
    <section className="scroll-hero-rest bg-paper">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-deep">
        <Image
          alt={image.alt}
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src={image.src}
        />
      </div>
      <div className="mx-auto w-full max-w-page px-5 pt-12 pb-4 md:px-8 lg:px-16">
        <p className="font-sans text-eyebrow text-ink-muted uppercase">{eyebrow}</p>
        <h1 className="mt-5 font-display text-display-2 text-ink">{title}</h1>
        <p className="mt-6 max-w-measure font-display text-heading-3 text-ink-soft">{lede}</p>
        <p className="mt-5 font-sans text-eyebrow text-ink-muted uppercase">{meta}</p>
        {children ? <div className="mt-8 flex flex-wrap gap-4">{children}</div> : null}
      </div>
    </section>
  )
}

function ScrollHeroActive({ image, eyebrow, title, lede, meta, children }: ScrollHeroProps) {
  const trackRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end start'],
  })
  const lead = useSpring(scrollYProgress, SPRING.lead)
  const trail = useSpring(scrollYProgress, SPRING.trail)

  const plateScale = useTransform(
    lead,
    [0, 0.12, 0.82, 1],
    [
      SCROLL_HERO.plateScale[0],
      SCROLL_HERO.plateScale[0],
      SCROLL_HERO.plateScale[1],
      SCROLL_HERO.plateScale[1],
    ],
  )
  const clipPath = useTransform(
    lead,
    [0, 0.12, 0.82, 1],
    [
      'inset(0% 0% 0% 0% round 0px)',
      'inset(0% 0% 0% 0% round 0px)',
      'inset(14% 6% 12% 48% round 2px)',
      'inset(14% 6% 12% 48% round 2px)',
    ],
  )
  const scrim = useTransform(lead, [0, 0.2, 0.55], [0.28, 0.18, 0])
  const heroLock = useTransform(lead, [0, 0.2, 0.7, 1], [0, 0.15, 1, 1])

  const titleX = useTransform(trail, [0, 0.15, 0.85, 1], ['6vw', '6vw', '5vw', '5vw'])
  const titleY = useTransform(trail, [0, 0.15, 0.85, 1], ['54vh', '54vh', '18vh', '18vh'])
  const titleScale = useTransform(
    trail,
    [0, 0.15, 0.85, 1],
    [
      SCROLL_HERO.titleScale[0],
      SCROLL_HERO.titleScale[0],
      SCROLL_HERO.titleScale[1],
      SCROLL_HERO.titleScale[1],
    ],
  )
  const ledeOpacity = useTransform(trail, [0.35, 0.7], [1, 0])
  const lightType = useTransform(trail, [0.35, 0.62], [1, 0])
  const inkType = useTransform(trail, [0.42, 0.72], [0, 1])

  useMotionValueEvent(heroLock, 'change', (value) => {
    document.documentElement.style.setProperty('--hero-lock', value.toFixed(3))
  })

  useEffect(() => {
    const pointer = window.matchMedia(FINE_POINTER)
    const sync = () => {
      document.documentElement.classList.toggle('header-over-media', pointer.matches)
      if (!pointer.matches) {
        document.documentElement.style.setProperty('--hero-lock', '1')
      }
    }
    sync()
    pointer.addEventListener('change', sync)
    return () => {
      pointer.removeEventListener('change', sync)
      document.documentElement.classList.remove('header-over-media')
      document.documentElement.style.removeProperty('--hero-lock')
    }
  }, [])

  return (
    <section className="scroll-hero-motion relative -mt-16 h-[180vh] lg:-mt-20" ref={trackRef}>
      <div className="sticky top-0 h-dvh overflow-hidden bg-paper">
        <m.div
          className="absolute inset-0 origin-center will-change-transform"
          data-motion
          style={{ clipPath, scale: plateScale }}
        >
          <Image
            alt={image.alt}
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src={image.src}
          />
          <m.div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/15 to-ink/20"
            data-motion="sunset"
            style={{ opacity: scrim }}
          />
        </m.div>

        <m.div
          className="absolute top-0 left-0 w-[min(42rem,90vw)] origin-top-left will-change-transform"
          data-motion
          style={{ x: titleX, y: titleY, scale: titleScale }}
        >
          <div className="relative">
            <p className="font-sans text-eyebrow uppercase">
              <span className="sr-only">{eyebrow}</span>
              <m.span
                aria-hidden="true"
                className="block text-paper-on-dusk"
                style={{ opacity: lightType }}
              >
                {eyebrow}
              </m.span>
              <m.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 block text-ink-muted"
                style={{ opacity: inkType }}
              >
                {eyebrow}
              </m.span>
            </p>
            <h1 className="relative mt-4 font-display text-display-1">
              <span className="sr-only">{title}</span>
              <m.span
                aria-hidden="true"
                className="block text-paper-on-dusk"
                style={{ opacity: lightType }}
              >
                {title}
              </m.span>
              <m.span
                aria-hidden="true"
                className="absolute inset-0 block text-ink"
                style={{ opacity: inkType }}
              >
                {title}
              </m.span>
            </h1>
          </div>
          <m.div style={{ opacity: ledeOpacity }}>
            <p className="mt-6 max-w-[22ch] font-display text-heading-2 text-paper-on-dusk/90">
              {lede}
            </p>
            <p className="mt-4 font-sans text-eyebrow text-paper-on-dusk/70 uppercase">{meta}</p>
            {children ? <div className="mt-8 flex flex-wrap gap-4">{children}</div> : null}
          </m.div>
        </m.div>
      </div>
    </section>
  )
}

export function FlagshipLockup({
  title,
  meta,
  className,
}: {
  title: string
  meta: string
  className?: string
}) {
  return (
    <div className={cn('sticky top-16 z-30 border-b border-rule bg-paper/95 lg:top-20', className)}>
      <div className="mx-auto flex w-full max-w-page items-baseline justify-between gap-6 px-5 py-3 md:px-8 lg:px-16">
        <p className="font-display text-heading-3 text-ink">{title}</p>
        <p className="hidden font-sans text-eyebrow text-ink-muted uppercase sm:block">{meta}</p>
      </div>
    </div>
  )
}
