import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { RevealText } from '@/components/motion/reveal-text'
import type { HomePageContent } from '@/types/content'

interface HopeProps {
  content: HomePageContent['hope']
}

/**
 * Chapter 09 — Hope. Night, and the first hint of light returning.
 *
 * The shortest chapter and the only purely contemplative one. No card, no
 * primary button — the scripture is the gift. A quiet trail into the years
 * follows, for the visitor who wants the dates after the rest.
 *
 * The horizon glow at the lower edge is where the dawn of the final chapter begins,
 * so chapter 10 does not arrive abruptly.
 */
export function Hope({ content }: HopeProps) {
  return (
    <section className="relative isolate overflow-hidden register-dusk py-section-xl" id="hope">
      <div
        aria-hidden="true"
        className="hope-horizon absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-dawn/35 to-transparent"
      />

      <Container>
        <figure className="mx-auto max-w-[38rem] text-center">
          <blockquote className="font-serif text-quote text-balance text-paper-on-dusk italic">
            <RevealText stagger={0.07} text={content.scripture} />
          </blockquote>
          <figcaption className="mt-10 font-sans text-eyebrow text-dawn-soft uppercase">
            {content.reference}
            <span aria-hidden="true"> · </span>
            {content.translation}
          </figcaption>
          <p className="mt-12">
            <Link
              className="font-sans text-body-sm text-paper-on-dusk underline decoration-dawn-soft underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out hover:decoration-paper-on-dusk"
              href="/prophecy"
            >
              Walk through the years
            </Link>
          </p>
        </figure>
      </Container>
    </section>
  )
}
