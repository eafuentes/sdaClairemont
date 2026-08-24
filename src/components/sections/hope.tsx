import { Container } from '@/components/layout/container'
import type { HomePageContent } from '@/types/content'

interface HopeProps {
  content: HomePageContent['hope']
}

/**
 * Chapter 09 — Hope. Night, and the first hint of light returning.
 *
 * The shortest chapter and the only purely contemplative one. No button, no heading,
 * no card — just the words and space. A page that has been asking for the visitor's
 * attention for eight chapters should give something back before asking again.
 *
 * The horizon glow at the lower edge is where the dawn of the final chapter begins,
 * so chapter 10 does not arrive abruptly.
 */
export function Hope({ content }: HopeProps) {
  return (
    <section className="relative isolate overflow-hidden register-dusk py-section-xl" id="hope">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ember/20 to-transparent"
      />

      <Container>
        <figure className="mx-auto max-w-[38rem] text-center">
          <blockquote className="font-serif text-quote text-balance text-paper-on-dusk italic">
            {content.scripture}
          </blockquote>
          <figcaption className="mt-10 font-sans text-eyebrow text-dawn-soft uppercase">
            {content.reference}
            <span aria-hidden="true"> · </span>
            {content.translation}
          </figcaption>
        </figure>
      </Container>
    </section>
  )
}
