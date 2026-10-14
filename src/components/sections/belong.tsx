import { Container } from '@/components/layout/container'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { Reveal } from '@/components/motion/reveal'
import { RevealText } from '@/components/motion/reveal-text'
import { Eyebrow } from '@/components/ui/eyebrow'
import type { HomePageContent } from '@/types/content'

interface BelongProps {
  content: HomePageContent['belong']
}

/**
 * Chapter 03 — Belong.
 *
 * The answer to the visitor's real question, which is not "what do you believe" but
 * "will I be alone there". Words and a member's voice sit on the left; three still
 * photographs sit on the right as one cluster, with a column of air between them.
 * Mixed aspect ratios and parallax were making the plates compete with the copy.
 */
export function Belong({ content }: BelongProps) {
  const [foyerPlate, biblePlate, kitchenPlate] = content.plates

  return (
    <section aria-labelledby="belong-title" className="bg-paper-bloom py-section md:py-section-lg" id="belong">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <Eyebrow index="03">Belong</Eyebrow>
            <h2 className="mt-4 max-w-measure-lead font-display text-heading-1" id="belong-title">
              {content.headline}
            </h2>
            <p className="mt-5 max-w-measure font-sans text-body text-ink-soft">{content.body}</p>

            <figure className="mt-8 max-w-measure border-t border-rule pt-6">
              <blockquote className="font-serif text-body-lg text-balance text-ink italic">
                <RevealText text={content.testimonial.quote} />
              </blockquote>
              <figcaption className="mt-4 font-sans text-body-sm text-ink-soft">
                <span className="text-ink">{content.testimonial.personName}</span>
                {' · '}
                {content.testimonial.personContext}
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="md:col-span-6 md:col-start-7" delay={0.08}>
            <div className="grid grid-cols-2 gap-3">
              {foyerPlate ? (
                <MediaPlaceholder
                  className="col-span-2 aspect-[3/2]"
                  description={foyerPlate.description}
                  image={foyerPlate.image}
                  tone="neutral"
                />
              ) : null}
              {biblePlate ? (
                <MediaPlaceholder
                  className="aspect-[4/3] [&_img]:object-center"
                  description={biblePlate.description}
                  image={biblePlate.image}
                  tone="warm"
                />
              ) : null}
              {kitchenPlate ? (
                <MediaPlaceholder
                  className="aspect-[4/3] [&_img]:object-center"
                  description={kitchenPlate.description}
                  image={kitchenPlate.image}
                  tone="cool"
                />
              ) : null}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
