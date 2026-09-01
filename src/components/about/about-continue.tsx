import Link from 'next/link'

import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { Eyebrow } from '@/components/ui/eyebrow'
import { pastoralTeamPhoto } from '@/content/leadership'

/**
 * The way off the About page into the rest of the family.
 *
 * CMS copy does not currently carry these links, so they live in the template —
 * a visitor who reads About us should not have to guess that the pastors have a page.
 */
export function AboutContinue() {
  return (
    <section className="mt-16 border-t border-rule pt-16" aria-labelledby="about-continue-heading">
      <Eyebrow>Continue</Eyebrow>
      <h2 className="sr-only" id="about-continue-heading">
        More about Clairemont
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
        <Link className="group block" href="/about/leadership">
          <MediaPlaceholder
            className="aspect-[4/5] max-w-md [&_img]:object-top"
            description="Pastor Robert Berry and Pastor London L. Lee standing together in the sanctuary."
            image={pastoralTeamPhoto}
          />
          <p className="mt-5 font-serif text-heading-2 text-ink underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out group-hover:decoration-dawn">
            Meet our pastors
          </p>
          <p className="mt-2 max-w-measure font-sans text-body-sm text-ink-soft">
            Pastor London L. Lee and Pastor Robert Berry — who they are, and how they came to
            Clairemont.
          </p>
        </Link>

        <Link className="group block md:pt-0" href="/about/beliefs">
          <div className="flex aspect-[4/5] max-w-md items-end bg-paper-warm p-8">
            <p className="max-w-[16ch] font-serif text-heading-1 text-ink">
              What we believe, in our own words.
            </p>
          </div>
          <p className="mt-5 font-serif text-heading-2 text-ink underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out group-hover:decoration-dawn">
            What we believe
          </p>
          <p className="mt-2 max-w-measure font-sans text-body-sm text-ink-soft">
            The Sabbath, Scripture, and the hope that shapes a week here.
          </p>
        </Link>
      </div>
    </section>
  )
}
