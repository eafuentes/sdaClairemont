'use client'

import { m, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import Image from 'next/image'
import { useRef } from 'react'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { DURATION, EASE_OUT, HERO_CUE, SPRING } from '@/lib/motion'
import type { HomePageContent, SiteSettings } from '@/types/content'

interface ArrivalProps {
  content: HomePageContent['arrival']
  settings: SiteSettings
}

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
 * scroll, walks the light down into dusk. That second part is not decoration: Sabbath
 * begins at sunset, so the one transformation the homepage opens with is the one the week
 * actually turns on.
 *
 * Four things here are load-bearing.
 *
 * **The photograph never animates its opacity.** It is the LCP element, and an element
 * that fades in is an element that paints late. It enters on `scale` alone — a transform,
 * which the compositor handles after paint — so the opening camera move costs nothing in
 * measured load performance. Every other element may fade, because none of them is what
 * the browser is timing.
 *
 * **The entrance is front-loaded.** The last element lands at 1.45s. A long opening is a
 * toll charged on every visit, and it stops being cinematic the second time.
 *
 * **The service times are visible without scrolling.** A visitor who never moves still
 * learns when to show up, which is the single job this page has.
 *
 * **The scrim is layered so motion can only ever darken it.** The static base scrim alone
 * guarantees the contrast floor; the scroll-driven layer sits on top and adds to it. So
 * there is no scroll position, and no interrupted spring, at which the type becomes
 * unreadable — the guarantee does not depend on the animation landing anywhere.
 */
export function Arrival({ content, settings }: ArrivalProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const lead = useSpring(scrollYProgress, SPRING.lead)
  const trail = useSpring(scrollYProgress, SPRING.trail)
  const drift = useSpring(scrollYProgress, SPRING.drift)

  // The frame settles out of a slight push-in rather than starting at rest.
  const plateScale = useTransform(lead, [0, 1], [1.06, 1])
  const plateY = useTransform(lead, [0, 1], ['0%', '7%'])

  // Golden hour walking down into dusk.
  const duskOpacity = useTransform(lead, [0, 0.55, 1], [0, 0.4, 0.85])

  /*
   * Three depth rates. The headline is heaviest and moves furthest, the rail follows on a
   * slower spring, and the cue leaves almost immediately. Parallax reads as depth only
   * when the layers disagree about how fast they are travelling.
   */
  const headlineY = useTransform(trail, [0, 1], [0, -90])
  const railY = useTransform(drift, [0, 1], [0, -40])
  const cueOpacity = useTransform(lead, [0, 0.1], [1, 0])

  const primaryServices = settings.serviceTimes.filter((service) => service.isPrimary)
  const heroImage = content.hero.image
  const headlineWords = content.headline.split(' ')

  /*
   * With reduced motion on, the entrance is skipped at the source rather than played and
   * then overridden — no initial state, no transition, nothing scheduled. The CSS
   * `[data-motion]` rule in globals.css is the second layer, covering the scroll-linked
   * inline styles that a transition override cannot reach.
   */
  const entrance = (delay: number) =>
    prefersReducedMotion
      ? undefined
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: DURATION.slow, ease: EASE_OUT },
        }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="arrival-headline"
      className="relative h-[180vh] register-dusk"
      id="arrival"
    >
      <div className="sticky top-0 flex h-dvh flex-col justify-end overflow-hidden">
        {heroImage ? (
          <m.div
            animate={prefersReducedMotion ? undefined : { scale: 1 }}
            className="absolute inset-0 -z-20"
            data-motion
            initial={prefersReducedMotion ? undefined : { scale: 1.08 }}
            style={prefersReducedMotion ? undefined : { scale: plateScale, y: plateY }}
            transition={{ duration: DURATION.cinematic, ease: EASE_OUT }}
          >
            {/*
             * Described rather than decorative. This is the only picture of the building
             * a first-time visitor gets, and "what does the place look like" is exactly
             * what someone deciding whether to walk in on Saturday wants to know.
             */}
            <Image
              alt={heroImage.alt}
              className="h-full w-full object-cover"
              fill
              priority
              sizes="100vw"
              src={heroImage.src}
            />
          </m.div>
        ) : null}

        {/*
         * Static base scrim. The 85% stop is pushed up to 70% of the height so the whole
         * lower band — everywhere type is placed — sits at 85% dusk or denser. That is
         * the number the contrast floor is derived from: at 85%, a blown-out white
         * highlight directly behind a line of text still composites to 6.75:1 against
         * paper-on-dusk. Moving this stop down means re-running check:contrast.
         */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-dusk/95 via-dusk/85 via-70% to-dusk/20"
        />

        {/*
         * Scroll-driven sunset. Only ever adds density on top of the base scrim.
         *
         * Tagged `sunset` rather than the bare `data-motion`, because the blanket
         * reduced-motion rule resolves elements to opacity 1 and for a scrim that is a
         * blackout rather than a resting state. See globals.css.
         */}
        <m.div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-dusk"
          data-motion="sunset"
          style={prefersReducedMotion ? { opacity: 0.4 } : { opacity: duskOpacity }}
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

              {/*
               * The headline rises a word at a time out of a mask. `aria-label` carries
               * the sentence so assistive technology reads one continuous line rather
               * than a list of words, and the visual spans are hidden from it.
               */}
              <h1
                aria-label={content.headline}
                className="mt-6 max-w-[16ch] font-serif text-display-1 text-paper-on-dusk"
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
              {/* The rule draws itself out from the left rather than fading in. */}
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
                        <dd className="tabular font-serif text-heading-2 text-paper-on-dusk">
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

            {/*
             * Two nested elements rather than one, because the cue both fades in on
             * entrance and fades out on scroll. A `style` motion value silently wins
             * over `animate` for the same property, so combining them on one element
             * would drop the entrance without erroring. Outer owns scroll, inner owns
             * entrance.
             */}
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
