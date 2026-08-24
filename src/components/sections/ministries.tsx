import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { Eyebrow } from '@/components/ui/eyebrow'
import { cn } from '@/lib/utils'
import type { Ministry, MinistryTone } from '@/types/content'

interface MinistriesProps {
  ministries: Ministry[]
}

const toneClasses: Record<MinistryTone, string> = {
  dawn: 'bg-gradient-to-b from-paper-warm to-paper-deep',
  sage: 'bg-gradient-to-b from-sage/25 to-paper-deep',
  sky: 'bg-gradient-to-b from-sky-100 to-paper-deep',
}

const placeholderTone: Record<MinistryTone, 'paper' | 'sage' | 'sky'> = {
  dawn: 'paper',
  sage: 'sage',
  sky: 'sky',
}

/**
 * Chapter 04 — Ministries. Explicitly not a grid of cards.
 *
 * Phase 1 renders the stacked full-bleed composition at every width. On mobile this is
 * the final design; on desktop the pointer-driven switcher replaces it in Phase 3.
 * Building the stacked version first is deliberate — it is the reduced-motion and
 * no-JavaScript state, every name is already a real link, and the switcher is layered
 * on top of something that already works rather than being the only thing that does.
 */
export function Ministries({ ministries }: MinistriesProps) {
  const ordered = [...ministries].sort((first, second) => first.order - second.order)

  return (
    <section aria-labelledby="ministries-title" className="bg-paper py-section-lg" id="ministries">
      <Container>
        <Eyebrow index="04">Ministries</Eyebrow>
        <h2 className="mt-6 max-w-measure-lead font-serif text-display-2" id="ministries-title">
          There is somewhere here for your whole family.
        </h2>
      </Container>

      <ul className="mt-16">
        {ordered.map((ministry) => (
          <li
            key={ministry.slug}
            className={cn('border-t border-rule', toneClasses[ministry.tone])}
          >
            <Link
              className="group block transition-colors duration-[var(--dur-quick)] ease-out hover:bg-ink/[0.02]"
              href={`/ministries/${ministry.slug}`}
            >
              <Container>
                <div className="grid grid-cols-1 items-center gap-8 py-12 lg:grid-cols-12 lg:gap-8 lg:py-16">
                  <div className="lg:col-span-5 lg:col-start-1">
                    <h3 className="font-serif text-display-2 text-ink underline decoration-transparent decoration-1 underline-offset-[0.15em] transition-colors duration-[var(--dur-quick)] ease-out group-hover:decoration-dawn">
                      {ministry.name}
                    </h3>
                    <p className="mt-5 max-w-measure font-sans text-body text-ink-70">
                      {ministry.shortDescription}
                    </p>
                    <p className="mt-5 font-sans text-eyebrow text-ink-45 uppercase">
                      {ministry.ageRange}
                      <span aria-hidden="true"> · </span>
                      {ministry.meetingSchedule}
                    </p>
                  </div>

                  <MediaPlaceholder
                    className="aspect-[16/9] lg:col-span-6 lg:col-start-7"
                    description={`Wide atmospheric frame for ${ministry.name}: the group in the middle of doing the thing, shot from a distance rather than posed.`}
                    tone={placeholderTone[ministry.tone]}
                  />
                </div>
              </Container>
            </Link>
          </li>
        ))}
      </ul>

      <Container>
        <Link
          className="mt-12 inline-block font-sans text-body-sm text-ink underline decoration-dawn decoration-1 underline-offset-4 transition-all duration-[var(--dur-instant)] ease-out hover:decoration-2"
          href="/ministries"
        >
          All ministries
        </Link>
      </Container>
    </section>
  )
}
