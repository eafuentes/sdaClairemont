'use client'

import { m, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'

import { TiltPlate } from '@/components/leadership/tilt-plate'
import { Container } from '@/components/layout/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { pastoralTeamPhoto } from '@/content/leadership'
import { SPRING } from '@/lib/motion'

/**
 * Opening of Our leadership: the two pastors as a shallow physical plate.
 *
 * The photograph tracks scroll on the tighter spring and looks around under a
 * fine pointer. Type stays still — the first line on the page should not assemble
 * itself. Reduced motion is the resting frame, not a faded one.
 */
export function LeadershipHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const lead = useSpring(scrollYProgress, SPRING.lead)
  const plateY = useTransform(lead, [0, 1], ['0%', '8%'])
  const plateScale = useTransform(lead, [0, 1], [1, 1.04])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="leadership-headline"
      className="overflow-hidden bg-paper pb-section"
    >
      <Container>
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5 lg:pb-6">
            <Eyebrow>About</Eyebrow>
            <h1
              className="mt-6 max-w-[12ch] font-serif text-display-2 text-ink"
              id="leadership-headline"
            >
              Our leadership
            </h1>
            <p className="mt-8 max-w-measure font-sans text-body-lg text-ink-soft">
              These are the people who would be glad to meet you after the service.
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <m.div
              className="origin-center will-change-transform"
              data-motion
              style={prefersReducedMotion ? undefined : { y: plateY, scale: plateScale }}
            >
              <TiltPlate
                className="aspect-[4/5]"
                description="Pastor Robert Berry and Pastor London L. Lee standing together in the sanctuary."
                image={pastoralTeamPhoto}
                intensity="hero"
              />
            </m.div>
          </div>
        </div>
      </Container>
    </section>
  )
}
