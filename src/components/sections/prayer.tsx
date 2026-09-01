import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import type { HomePageContent } from '@/types/content'

interface PrayerProps {
  content: HomePageContent['prayer']
}

/**
 * Chapter 08 — Prayer. The entrance into darkness.
 *
 * The chapter contains the invitation, not the form. Asking someone to type something
 * painful into a homepage section, between an events list and a scripture quote, is the
 * wrong context; `/prayer` is a quiet page with the church phone and email until the
 * private form exists.
 *
 * It should feel like the room quieting rather than a dramatic reveal.
 */
export function Prayer({ content }: PrayerProps) {
  return (
    <section
      aria-labelledby="prayer-title"
      className="relative isolate overflow-hidden register-dusk py-section-xl"
      id="prayer"
    >
      {/* Low-prominence atmosphere. No faces here — this chapter should feel private. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-dusk-raised via-dusk to-dusk"
      />

      <Container>
        <div className="max-w-measure-lead">
          <Eyebrow className="text-dawn-soft" index="08">
            Prayer
          </Eyebrow>
          <h2
            className="mt-8 font-serif text-display-2 font-light text-paper-on-dusk"
            id="prayer-title"
          >
            {content.headline}
          </h2>

          <div className="mt-8 space-y-5">
            {content.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="max-w-measure font-sans text-body text-paper-on-dusk/75"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12">
            <Button href="/prayer" variant="on-dusk-quiet">
              Share a prayer request
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
