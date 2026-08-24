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

const paperTokens = [
  { name: 'paper', value: '#FAF7F2', className: 'bg-paper' },
  { name: 'paper-deep', value: '#F2EDE4', className: 'bg-paper-deep' },
  { name: 'paper-warm', value: '#EDE3D4', className: 'bg-paper-warm' },
]

const inkTokens = [
  { name: 'ink', value: '#14181A', className: 'bg-ink' },
  { name: 'ink-70', value: '#4A5154', className: 'bg-ink-70' },
  { name: 'ink-45', value: '#626769', className: 'bg-ink-45' },
]

const skyTokens = [
  { name: 'sky-100', value: '#E8EFF4', className: 'bg-sky-100' },
  { name: 'sky-300', value: '#C3D6E3', className: 'bg-sky-300' },
  { name: 'sky-500', value: '#8FB0C7', className: 'bg-sky-500' },
  { name: 'sky-700', value: '#4A6A85', className: 'bg-sky-700' },
  { name: 'sky-900', value: '#2A3F52', className: 'bg-sky-900' },
]

const accentTokens = [
  { name: 'dawn', value: '#A97937', className: 'bg-dawn' },
  { name: 'dawn-soft', value: '#E2C08A', className: 'bg-dawn-soft' },
  { name: 'dawn-deep', value: '#8E6224', className: 'bg-dawn-deep' },
  { name: 'sage', value: '#7F8C77', className: 'bg-sage' },
  { name: 'sage-deep', value: '#4E5A49', className: 'bg-sage-deep' },
]

const duskTokens = [
  { name: 'dusk', value: '#161D2B', className: 'bg-dusk' },
  { name: 'dusk-raised', value: '#1F2739', className: 'bg-dusk-raised' },
  { name: 'ember', value: '#BA715E', className: 'bg-ember' },
  { name: 'paper-on-dusk', value: '#F0EBE3', className: 'bg-paper-on-dusk' },
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
          <p className="tabular font-sans text-body-sm text-ink-45">{token.value}</p>
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
          <p className="mt-6 max-w-measure-lead font-sans text-body-lg text-ink-70">
            The design system for San Diego Clairemont Seventh-day Adventist Church. Warm paper,
            editorial serif, hairline structure, photography carrying the emotion.
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
              <h2 className="font-sans text-heading-3">Sky</h2>
              <div className="mt-4">
                <Swatches tokens={skyTokens} />
              </div>
            </div>
            <div>
              <h2 className="font-sans text-heading-3">Dawn and sage</h2>
              <div className="mt-4">
                <Swatches tokens={accentTokens} />
              </div>
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
              { token: 'body-sm', className: 'font-sans text-body-sm text-ink-70' },
            ].map((entry) => (
              <div key={entry.token}>
                <p className="font-sans text-eyebrow text-ink-45 uppercase">{entry.token}</p>
                <p className={`mt-2 max-w-page ${entry.className}`}>
                  There&rsquo;s a place for you here
                </p>
              </div>
            ))}

            <div>
              <p className="font-sans text-eyebrow text-ink-45 uppercase">eyebrow</p>
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
              <p className="mt-3 max-w-measure-lead font-sans text-body-lg text-ink-70">
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
          <p className="mt-6 max-w-measure font-sans text-body-sm text-ink-70">
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
                  <p className="tabular font-sans text-body-sm text-ink-45">{step.value}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section index="07" title="Shape">
          <div className="flex flex-wrap items-end gap-8">
            <div>
              <div className="h-20 w-20 rounded-xs bg-ink" />
              <p className="mt-2 font-sans text-body-sm text-ink-70">rounded-xs · 2px · controls</p>
            </div>
            <div>
              <div className="h-20 w-20 rounded-sm bg-ink" />
              <p className="mt-2 font-sans text-body-sm text-ink-70">rounded-sm · 4px · maximum</p>
            </div>
            <div>
              <div className="h-20 w-20 bg-ink" />
              <p className="mt-2 font-sans text-body-sm text-ink-70">none · photographic plates</p>
            </div>
          </div>
          <p className="mt-6 max-w-measure font-sans text-body-sm text-ink-70">
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
            <Button
              href="/prayer"
              variant="secondary"
              className="border-dawn-soft/40 text-paper-on-dusk hover:border-dawn-soft hover:bg-paper-on-dusk/5"
            >
              Share a prayer request
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
