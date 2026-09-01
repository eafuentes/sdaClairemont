import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { MinistryRow } from '@/components/ministries/ministry-row'
import { MinistrySwitcher } from '@/components/ministries/ministry-switcher'
import { Reveal } from '@/components/motion/reveal'
import { Eyebrow } from '@/components/ui/eyebrow'
import type { Ministry } from '@/types/content'

interface MinistriesProps {
  ministries: Ministry[]
}

/**
 * Chapter 04 — Ministries. Explicitly not a grid of cards.
 *
 * The stacked rows are the design on touch, on small screens, without JavaScript, and
 * with reduced-width viewports. The pointer switcher is layered on top for fine
 * pointers at desktop width — hover is enhancement, every name is already a link.
 */
export function Ministries({ ministries }: MinistriesProps) {
  const ordered = [...ministries].sort((first, second) => first.order - second.order)

  return (
    <section aria-labelledby="ministries-title" className="bg-paper" id="ministries">
      <Container className="pt-section-lg">
        <Reveal>
          <Eyebrow index="04">Ministries</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-measure-lead font-serif text-display-2" id="ministries-title">
            There is somewhere here for your whole family.
          </h2>
        </Reveal>
      </Container>

      <div className="ministry-switcher-scene">
        <div className="ministry-switcher-sticky">
          <MinistrySwitcher ministries={ordered} />
        </div>
      </div>

      <ul className="ministry-stack mt-16">
        {ordered.map((ministry) => (
          <Reveal key={ministry.slug} as="li">
            <MinistryRow ministry={ministry} />
          </Reveal>
        ))}
      </ul>

      <Container className="pb-section-lg">
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
