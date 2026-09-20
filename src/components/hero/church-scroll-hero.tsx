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

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { DURATION, EASE_OUT, HERO_CUE, SPRING } from '@/lib/motion'
import { brandGradient } from '@/styles/palette'
import type { HomePageContent, SiteSettings } from '@/types/content'

interface ChurchScrollHeroProps {
  content: HomePageContent['arrival']
  settings: SiteSettings
}

const FINE_POINTER = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'

/** A word that rises out of a mask. The mask is the parent; this is what moves inside it. */
function RisingWord({ children, delay }: { children: string; delay: number }) {
  return (
    /*
     * The mask needs vertical slack or it shears the descenders off letters like the "p"
     * in "place" — `overflow-hidden` on a line box crops to the em box, not to the ink.
     * The padding buys room for them and the negative margin gives the space back, so the
     * headline's leading is unchanged.
     */
    <span className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-bottom">
      <m.span
        animate={{ y: '0%' }}
        className="inline-block"
        data-motion
        initial={{ y: '110%' }}
        transition={{ delay, duration: DURATION.slow, ease: EASE_OUT }}
      >
        {children}
      </m.span>
    </span>
  )
}

/**
 * Chapter 01 — Arrival.
 *
 * The church at golden hour. It opens with a choreographed entrance and then, as you
 * scroll, walks the light down into dusk. The photograph tracks scroll on a tight spring;
 * the type is looser and heavier, so the two objects have different mass.
 *
 * Four things here are load-bearing.
 *
 * **The photograph never animates its opacity.** It is the LCP element, and an element
 * that fades in is an element that paints late. It enters on `scale` alone.
 *
 * **The entrance is front-loaded.** The last element lands at 1.45s.
 *
 * **The service times are visible without scrolling.**
 *
 * **The scrim is layered so motion can only ever darken it.** The static base scrim
 * guarantees the contrast floor; the scroll-driven layer sits on top and adds to it.
 */
export function ChurchScrollHero({ content, settings }: ChurchScrollHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const lead = useSpring(scrollYProgress, SPRING.lead)
  const trail = useSpring(scrollYProgress, SPRING.trail)
  const drift = useSpring(scrollYProgress, SPRING.drift)

  const plateScale = useTransform(lead, [0, 1], [1.06, 1])
  const plateY = useTransform(lead, [0, 1], ['0%', '7%'])
  const duskOpacity = useTransform(lead, [0, 0.55, 1], [0, 0.4, 0.85])
  const headlineY = useTransform(trail, [0, 1], [0, -90])
  const railY = useTransform(drift, [0, 1], [0, -40])
  const cueOpacity = useTransform(lead, [0, 0.1], [1, 0])
  const heroLock = useTransform(lead, [0, 0.2, 0.7, 1], [0, 0.15, 1, 1])

  const primaryServices = settings.serviceTimes.filter((service) => service.isPrimary)
  const heroImage = content.hero.image
  const headlineWords = content.headline.split(' ')
  const photograph = {
    src: '/images/church-exterior-golden-hour.png',
    alt:
      heroImage?.alt ??
      'The San Diego Clairemont Seventh-day Adventist church at sunset, its low tiled roof and stucco walls warm in the last light, with steps rising from the sidewalk between clipped hedges and a eucalyptus overhanging from the right.',
  }

  const entrance = (delay: number) =>
    prefersReducedMotion
      ? undefined
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: DURATION.slow, ease: EASE_OUT },
        }

  useMotionValueEvent(heroLock, 'change', (value) => {
    document.documentElement.style.setProperty('--hero-lock', value.toFixed(3))
  })

  useEffect(() => {
    if (prefersReducedMotion) return

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
  }, [prefersReducedMotion])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="arrival-headline"
      className="arrival-scene relative h-[180vh] register-dusk"
      id="arrival"
    >
      <div className="sticky top-0 flex h-dvh flex-col justify-end overflow-hidden">
        <m.div
          animate={prefersReducedMotion ? undefined : { scale: 1 }}
          className="absolute inset-0 -z-20"
          data-motion
          initial={prefersReducedMotion ? undefined : { scale: 1.08 }}
          style={prefersReducedMotion ? undefined : { scale: plateScale, y: plateY }}
          transition={{ duration: DURATION.cinematic, ease: EASE_OUT }}
        >
          <Image
            alt={photograph.alt}
            className="h-full w-full object-cover"
            fill
            priority
            sizes="100vw"
            src={photograph.src}
          />
          {prefersReducedMotion ? null : (
            <video
              aria-hidden="true"
              autoPlay
              className="absolute inset-0 h-full w-full object-cover"
              loop
              muted
              playsInline
              poster={photograph.src}
              preload="metadata"
            >
              <source src="/video/AnimateChurchVideo.mp4" type="video/mp4" />
            </video>
          )}
        </m.div>

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/80 via-55% to-dawn/35"
        />

        <m.div
          aria-hidden="true"
          className={`absolute inset-0 -z-10 ${brandGradient.radial}`}
          data-motion="sunset"
          style={prefersReducedMotion ? { opacity: 0.35 } : { opacity: duskOpacity }}
        />

        <Container>
          <div className="pb-14 md:pb-20">
            <m.div data-motion style={prefersReducedMotion ? undefined : { y: headlineY }}>
              <m.p
                className="font-sans text-eyebrow text-dawn-glow uppercase"
                data-motion
                {...entrance(HERO_CUE.eyebrow)}
              >
                {settings.name}
              </m.p>

              <h1
                aria-label={content.headline}
                className="mt-6 max-w-[16ch] font-display text-display-1 text-paper-on-dusk"
                id="arrival-headline"
              >
                {prefersReducedMotion
                  ? content.headline
                  : headlineWords.map((word, index) => (
                      <span key={`${word}-${index}`} aria-hidden="true">
                        <RisingWord delay={HERO_CUE.headline + index * HERO_CUE.headlineStagger}>
                          {word}
                        </RisingWord>{' '}
                      </span>
                    ))}
              </h1>
            </m.div>

            <m.div
              className="mt-10"
              data-motion
              style={prefersReducedMotion ? undefined : { y: railY }}
            >
              <m.div
                animate={prefersReducedMotion ? undefined : { scaleX: 1 }}
                aria-hidden="true"
                className="h-px origin-left bg-paper-on-dusk/25"
                data-motion
                initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
                transition={{
                  delay: HERO_CUE.rule,
                  duration: DURATION.ambient,
                  ease: EASE_OUT,
                }}
              />

              <div className="flex flex-col gap-8 pt-7 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <m.p
                    className="font-sans text-eyebrow text-dawn-glow uppercase"
                    data-motion
                    {...entrance(HERO_CUE.services)}
                  >
                    Saturdays
                  </m.p>
                  <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-4">
                    {primaryServices.map((service, index) => (
                      <m.div
                        key={service.label}
                        data-motion
                        {...entrance(HERO_CUE.services + index * 0.08)}
                      >
                        <dt className="font-sans text-body-sm text-paper-on-dusk/75">
                          {service.label}
                        </dt>
                        <dd className="tabular font-display text-heading-2 text-paper-on-dusk">
                          {service.startTime}
                        </dd>
                      </m.div>
                    ))}
                  </dl>
                  <m.a
                    className="mt-5 inline-block font-sans text-body-sm text-paper-on-dusk/75 underline decoration-paper-on-dusk/40 underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out hover:text-paper-on-dusk hover:decoration-dawn-soft"
                    data-motion
                    href={settings.address.mapUrl}
                    rel="noreferrer noopener"
                    target="_blank"
                    {...entrance(HERO_CUE.address)}
                  >
                    {settings.address.street}, {settings.address.city}, {settings.address.state}{' '}
                    {settings.address.postalCode}
                  </m.a>
                </div>

                <m.div
                  className="flex flex-wrap items-center gap-4"
                  data-motion
                  {...entrance(HERO_CUE.actions)}
                >
                  <Button href="/visit" variant="on-dusk">
                    Plan Your Visit
                  </Button>
                  <Button href="/watch" variant="on-dusk-quiet">
                    Watch Online
                  </Button>
                </m.div>
              </div>
            </m.div>

            <m.div
              aria-hidden="true"
              className="mt-12"
              data-motion
              style={prefersReducedMotion ? undefined : { opacity: cueOpacity }}
            >
              <m.div
                className="flex items-center gap-3 font-sans text-eyebrow text-paper-on-dusk/75 uppercase"
                data-motion
                {...entrance(HERO_CUE.cue)}
              >
                <span>Scroll</span>
                <span className="h-px w-10 origin-left bg-paper-on-dusk/40" />
              </m.div>
            </m.div>
          </div>
        </Container>
      </div>
    </section>
  )
}
