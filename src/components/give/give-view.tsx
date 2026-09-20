import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/motion/reveal'
import { Button } from '@/components/ui/button'
import { ScriptureQuote } from '@/components/ui/scripture-quote'
import { brandGradient } from '@/styles/palette'
import type { EditorialPage, SiteSettings } from '@/types/content'

interface GiveViewProps {
  page: EditorialPage
  settings: SiteSettings
}

/**
 * Give — a cinematic opening, then the facts.
 *
 * The lockup and the black-to-crimson wash are the new brand. The words are still
 * this church's: giving is how the lights stay on, not a ticket.
 */
export function GiveView({ page, settings }: GiveViewProps) {
  const intro =
    page.intro ??
    'Giving here is how we keep the lights on, feed people, and send our young people to camp.'

  return (
    <>
      <section className={`relative isolate overflow-hidden ${brandGradient.ember} py-section-xl`}>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${brandGradient.radial} opacity-50`}
        />

        <Container className="relative">
          <Reveal>
            <p className="font-sans text-eyebrow text-dawn-glow uppercase">Give</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-5 max-w-[12ch] text-display-1 text-paper">{page.title}</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-measure font-sans text-body-lg text-paper/80">{intro}</p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-10">
              <Button external href={settings.givingUrl} variant="on-dusk">
                Give through AdventistGiving
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-paper-bloom py-section-lg">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <ScriptureQuote reference="Malachi 3:10" translation="NKJV">
                Bring all the tithes into the storehouse, that there may be food in My house, and
                try Me now in this, says the Lord of hosts.
              </ScriptureQuote>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <p className="font-sans text-body text-ink-soft">
                Tithe and offerings can be given online through AdventistGiving, or in person on
                Sabbath. If you are visiting, please do not feel any pressure to give. You being
                here is enough.
              </p>
              <p className="mt-6 font-sans text-body-sm text-ink-muted">
                Nobody will know whether you did. It is not a ticket.
              </p>
              <p className="mt-10">
                <Button external href={settings.givingUrl} variant="primary">
                  Give now
                </Button>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
