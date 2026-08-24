import { Container } from '@/components/layout/container'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { Eyebrow } from '@/components/ui/eyebrow'
import type { HomePageContent } from '@/types/content'

interface BelongProps {
  content: HomePageContent['belong']
}

/**
 * Chapter 03 — Belong.
 *
 * The answer to the visitor's real question, which is not "what do you believe" but
 * "will I be alone there".
 *
 * The three plates are deliberately un-gridded — different sizes, offset vertically,
 * one breaking the container. Captions naming real people are what make the chapter
 * work; uncaptioned photographs read as stock.
 */
export function Belong({ content }: BelongProps) {
  const [firstPlate, secondPlate, thirdPlate] = content.plates

  return (
    <section aria-labelledby="belong-title" className="bg-paper py-section-lg" id="belong">
      <Container>
        <Eyebrow index="03">Belong</Eyebrow>
        <h2 className="mt-6 max-w-measure-lead font-serif text-display-2" id="belong-title">
          {content.headline}
        </h2>
        <p className="mt-8 max-w-measure font-sans text-body-lg text-ink-70">{content.body}</p>
      </Container>

      <div className="mt-16 lg:mt-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            {firstPlate ? (
              <MediaPlaceholder
                caption={firstPlate.caption}
                className="aspect-[3/2] lg:col-span-7 lg:col-start-1"
                description={firstPlate.description}
                tone="paper"
              />
            ) : null}

            {secondPlate ? (
              <div className="lg:col-span-4 lg:col-start-9 lg:pt-24">
                <MediaPlaceholder
                  caption={secondPlate.caption}
                  className="aspect-[4/5]"
                  description={secondPlate.description}
                  tone="sage"
                />

                <figure className="mt-10 border-t border-rule pt-8">
                  <blockquote className="font-serif text-quote text-balance text-ink italic">
                    {content.testimonial.quote}
                  </blockquote>
                  <figcaption className="mt-5 font-sans text-body-sm text-ink-70">
                    <span className="text-ink">{content.testimonial.personName}</span>
                    {' · '}
                    {content.testimonial.personContext}
                  </figcaption>
                </figure>
              </div>
            ) : null}

            {thirdPlate ? (
              <MediaPlaceholder
                caption={thirdPlate.caption}
                className="aspect-[16/9] lg:col-span-6 lg:col-start-2 lg:-mt-16"
                description={thirdPlate.description}
                tone="sky"
              />
            ) : null}
          </div>
        </Container>
      </div>
    </section>
  )
}
