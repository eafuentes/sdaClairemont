import { Container } from '@/components/layout/container'
import { MinistryRow } from '@/components/ministries/ministry-row'
import { MinistrySwitcher } from '@/components/ministries/ministry-switcher'
import { Reveal } from '@/components/motion/reveal'
import { RevealText } from '@/components/motion/reveal-text'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import type { Ministry } from '@/types/content'

interface MinistriesProps {
  ministries: Ministry[]
}

/**
 * Chapter 04 — Ministries. Explicitly not a grid of cards.
 *
 * The stacked rows are the design on touch and without a fine pointer. The switcher
 * is the same chapter on desktop: names beside one plate, hover and focus cross-fade
 * the photograph.
 */
export function Ministries({ ministries }: MinistriesProps) {
  const ordered = [...ministries].sort((first, second) => first.order - second.order)

  return (
    <section aria-labelledby="ministries-title" className="bg-paper-bloom py-section" id="ministries">
      <Container>
        <Reveal>
          <Eyebrow index="04">Ministries</Eyebrow>
        </Reveal>
        <h2 className="mt-4 max-w-measure-lead font-display text-heading-1" id="ministries-title">
          <RevealText text="There is somewhere here for your whole family." />
        </h2>
      </Container>

      <div className="ministry-switcher-scene mt-8">
        <MinistrySwitcher ministries={ordered} />
      </div>

      <div className="ministry-stack mt-8">
        <ul>
          {ordered.map((ministry) => (
            <Reveal key={ministry.slug} as="li">
              <MinistryRow ministry={ministry} />
            </Reveal>
          ))}
        </ul>
        <Container>
          <Button className="mt-6" href="/ministries" variant="tertiary">
            All ministries
          </Button>
        </Container>
      </div>
    </section>
  )
}
