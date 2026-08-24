import { readFileSync } from 'node:fs'

import type { Metadata } from 'next'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Rule } from '@/components/ui/rule'
import { ScriptureQuote } from '@/components/ui/scripture-quote'

export const metadata: Metadata = {
  title: 'Design system',
  robots: { index: false, follow: false },
}

/*
 * Swatch values are read out of the stylesheet at build time rather than retyped here.
 * A review surface that can disagree with the thing it is reviewing is worse than no
 * review surface, and hand-copied hex values are the most reliable way to get there.
 * Safe as a Server Component: this runs once during the build, never in the browser.
 */
const themeSource = readFileSync('src/styles/globals.css', 'utf8')

/*
 * The class name is spelled out rather than built as `bg-${name}`. Tailwind resolves
 * utilities by scanning source text, so an interpolated class produces no rule at all and
 * the swatch renders as a blank box — the exact failure this page exists to catch. Only
 * the value is derived.
 */
function swatch(name: string, className: string) {
  const declared = themeSource.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{3,8})`))?.[1]

  return { name, value: declared?.toUpperCase() ?? 'NOT DECLARED', className }
}

const paperTokens = [
  swatch('paper', 'bg-paper'),
  swatch('paper-deep', 'bg-paper-deep'),
  swatch('paper-warm', 'bg-paper-warm'),
]

const inkTokens = [
  swatch('ink', 'bg-ink'),
  swatch('ink-soft', 'bg-ink-soft'),
  swatch('ink-muted', 'bg-ink-muted'),
]

const accentTokens = [
  swatch('dawn', 'bg-dawn'),
  swatch('dawn-soft', 'bg-dawn-soft'),
  swatch('dawn-glow', 'bg-dawn-glow'),
]

const duskTokens = [
  swatch('dusk', 'bg-dusk'),
  swatch('dusk-raised', 'bg-dusk-raised'),
  swatch('paper-on-dusk', 'bg-paper-on-dusk'),
]

const sectionSpacing = [
  { name: 'section-sm', value: '4rem', className: 'h-16' },
  { name: 'section', value: '6rem', className: 'h-24' },
  { name: 'section-lg', value: '8rem', className: 'h-32' },
  { name: 'section-xl', value: '12rem', className: 'h-48' },
]

function Swatches({
  tokens,
}: {
  tokens: Array<{ name: string; value: string; className: string }>
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
      {tokens.map((token) => (
        <li key={token.name}>
          <div className={`h-20 w-full border border-rule ${token.className}`} />
          <p className="mt-2 font-sans text-body-sm text-ink">{token.name}</p>
          <p className="tabular font-sans text-body-sm text-ink-muted">{token.value}</p>
        </li>
      ))}
    </ul>
  )
}

function Section({
  index,
  title,
  children,
}: {
  index: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="py-section">
      <Rule />
      <div className="pt-8">
        <Eyebrow index={index}>{title}</Eyebrow>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}

/**
 * Internal review surface for the design system. Not linked from the site and not
 * indexed. It exists so tokens and component states can be judged together, in a
 * browser, rather than inferred from a stylesheet.
 */
export default function DesignSystemPage() {
  return (
    <>
      <Container>
        <header className="pt-section pb-section-sm">
          <Eyebrow>Internal reference</Eyebrow>
          <h1 className="mt-6 font-serif text-display-2">Morning Light</h1>
          <p className="mt-6 max-w-measure-lead font-sans text-body-lg text-ink-soft">
            The design system for San Diego Clairemont Seventh-day Adventist Church. Warm paper,
            editorial serif, hairline structure, photography carrying the emotion.
          </p>
          <p className="mt-4 max-w-measure font-sans text-body-sm text-ink-soft">
            The palette is sampled from the church&rsquo;s own exterior at golden hour: warm
            neutrals, the sun and tile roof as <code>dawn</code>, the cool top of that same sky as{' '}
            <code>dusk</code>. Two hues, and everything else is a tint of them over paper.
          </p>
        </header>

        <Section index="01" title="Colour">
          <div className="space-y-10">
            <div>
              <h2 className="font-sans text-heading-3">Paper</h2>
              <div className="mt-4">
                <Swatches tokens={paperTokens} />
              </div>
            </div>
            <div>
              <h2 className="font-sans text-heading-3">Ink</h2>
              <div className="mt-4">
                <Swatches tokens={inkTokens} />
              </div>
            </div>
            <div>
              <h2 className="font-sans text-heading-3">Dawn</h2>
              <div className="mt-4">
                <Swatches tokens={accentTokens} />
              </div>
              <p className="mt-4 max-w-measure font-sans text-body-sm text-ink-soft">
                Three weights of one hue, not three hues. <code>dawn</code> is dark enough to carry
                links and small text on any paper surface; <code>dawn-soft</code> is the
                dusk-register equivalent; <code>dawn-glow</code> exists for type set over
                photography, where the accent has to survive a blown-out highlight behind it.
              </p>
            </div>
            <div>
              <h2 className="font-sans text-heading-3">Dusk</h2>
              <div className="mt-4">
                <Swatches tokens={duskTokens} />
              </div>
            </div>
          </div>
        </Section>

        <Section index="02" title="Type scale">
          <div className="space-y-10">
            {[
              { token: 'display-1', className: 'font-serif text-display-1' },
              { token: 'display-2', className: 'font-serif text-display-2' },
              { token: 'heading-1', className: 'font-serif text-heading-1' },
              { token: 'heading-2', className: 'font-serif text-heading-2' },
              { token: 'heading-3', className: 'font-sans text-heading-3' },
              { token: 'body-lg', className: 'font-sans text-body-lg' },
              { token: 'body', className: 'font-sans text-body' },
              { token: 'body-sm', className: 'font-sans text-body-sm text-ink-soft' },
            ].map((entry) => (
              <div key={entry.token}>
                <p className="font-sans text-eyebrow text-ink-muted uppercase">{entry.token}</p>
                <p className={`mt-2 max-w-page ${entry.className}`}>
                  There&rsquo;s a place for you here
                </p>
              </div>
            ))}

            <div>
              <p className="font-sans text-eyebrow text-ink-muted uppercase">eyebrow</p>
              <div className="mt-2">
                <Eyebrow index="04">Ministries</Eyebrow>
              </div>
            </div>
          </div>
        </Section>

        <Section index="03" title="Scripture">
          <ScriptureQuote reference="Matthew 11:28" translation="NKJV">
            Come to Me, all you who labor and are heavy laden, and I will give you rest.
          </ScriptureQuote>
        </Section>

        <Section index="04" title="Measure">
          <div className="space-y-8">
            <div>
              <Eyebrow>Lead, ~60 characters</Eyebrow>
              <p className="mt-3 max-w-measure-lead font-sans text-body-lg text-ink-soft">
                Join us Saturdays for Bible study at half past nine and worship at a quarter to
                eleven, at 4125 Hathaway Street in Clairemont.
              </p>
            </div>
            <div>
              <Eyebrow>Body, ~68 characters</Eyebrow>
              <p className="mt-3 max-w-measure font-sans text-body">
                Full-width body text is the fastest way to look unedited, so every block of prose on
                this site is capped at a comfortable reading measure. The cap is a token rather than
                a decision made per page.
              </p>
            </div>
          </div>
        </Section>

        <Section index="05" title="Buttons and focus">
          <div className="flex flex-wrap items-center gap-6">
            <Button href="/visit">Plan Your Visit</Button>
            <Button href="/watch" variant="secondary">
              Watch Online
            </Button>
            <Button href="/events" variant="tertiary">
              See all events
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6 register-dusk p-8">
            <Button href="/visit" variant="on-dusk">
              Plan Your Visit
            </Button>
            <Button href="/watch" variant="on-dusk-quiet">
              Watch Online
            </Button>
          </div>
          <p className="mt-6 max-w-measure font-sans text-body-sm text-ink-soft">
            Tab through these. Focus is a 2px dawn ring at 2px offset, never removed and never
            replaced by a colour change alone. No variant lifts, scales, or gains a shadow on hover.
          </p>
        </Section>

        <Section index="06" title="Section rhythm">
          <ul className="space-y-4">
            {sectionSpacing.map((step) => (
              <li key={step.name} className="flex items-end gap-4">
                <div className={`w-16 bg-dawn-soft ${step.className}`} />
                <div className="pb-1">
                  <p className="font-sans text-body-sm text-ink">{step.name}</p>
                  <p className="tabular font-sans text-body-sm text-ink-muted">{step.value}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section index="07" title="Shape">
          <div className="flex flex-wrap items-end gap-8">
            <div>
              <div className="h-20 w-20 rounded-xs bg-ink" />
              <p className="mt-2 font-sans text-body-sm text-ink-soft">
                rounded-xs · 2px · controls
              </p>
            </div>
            <div>
              <div className="h-20 w-20 rounded-sm bg-ink" />
              <p className="mt-2 font-sans text-body-sm text-ink-soft">
                rounded-sm · 4px · maximum
              </p>
            </div>
            <div>
              <div className="h-20 w-20 bg-ink" />
              <p className="mt-2 font-sans text-body-sm text-ink-soft">
                none · photographic plates
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-measure font-sans text-body-sm text-ink-soft">
            The radius scale is reset in the theme, so larger radii do not exist as utilities. There
            are no rounded cards because there are almost no cards.
          </p>
        </Section>
      </Container>

      <section className="mt-section register-dusk py-section-lg">
        <Container>
          <Eyebrow index="08" className="text-dawn-soft">
            The dusk register
          </Eyebrow>
          <h2 className="mt-6 max-w-measure-lead font-serif text-display-2 font-light">
            Is something heavy right now?
          </h2>
          <p className="mt-6 max-w-measure font-sans text-body text-paper-on-dusk/70">
            Scoped to the Prayer and Hope chapters and parts of Watch. Always full-bleed, never a
            dark card on a light page. Two dark chapters inside a light site carry more weight than
            a uniformly dark site, and the transition into them is the most cinematic moment
            available.
          </p>
          <div className="mt-10">
            <Button href="/prayer" variant="on-dusk-quiet">
              Share a prayer request
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
