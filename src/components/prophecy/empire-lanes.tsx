import { Container } from '@/components/layout/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { yearsSpanned } from '@/lib/prophetic-date'
import type { EmpireAlignment, ProphecyPageContent } from '@/types/content'

interface EmpireLanesProps {
  content: ProphecyPageContent
}

/**
 * Convergence, not depth: four prophecies naming the same four empires.
 *
 * The table is the argument and is visible without opening anything. Extra lanes
 * and the true-scale duration strip live behind a native disclosure.
 */
export function EmpireLanes({ content }: EmpireLanesProps) {
  const first = content.empires[0]
  const last = content.empires[content.empires.length - 1]
  const totalYears = first && last ? yearsSpanned(first.start, last.end) : 0

  return (
    <section className="bg-paper-deep py-section-lg" id="the-lanes">
      <Container>
        <Eyebrow>The lanes</Eyebrow>
        <h2 className="mt-6 max-w-measure-lead font-serif text-heading-1 text-ink">
          Four vocabularies. One sequence.
        </h2>
        <p className="mt-6 max-w-measure font-sans text-body text-ink-soft">
          Daniel 2, 7 and 8 were written in different symbols, centuries apart. They name the same
          four kingdoms in the same order. Watching that alignment is the argument — it does not
          need a caption to finish it.
        </p>

        <div className="mt-14 overflow-x-auto">
          <table className="prophecy-lanes-table">
            <caption className="sr-only">
              Parallel identifications of Babylon, Medo-Persia, Greece, and Rome in Daniel 2, Daniel
              7, and Daniel 8.
            </caption>
            <thead>
              <tr>
                <th scope="col">Empire</th>
                <th scope="col">Daniel 2</th>
                <th scope="col">Daniel 7</th>
                <th scope="col">Daniel 8</th>
              </tr>
            </thead>
            <tbody>
              {content.empires.map((empire) => (
                <tr key={empire.empire}>
                  <th scope="row">
                    <span className="block font-serif text-heading-3 text-ink">
                      {empire.empire}
                    </span>
                    <span className="mt-1 block font-sans text-eyebrow text-ink-muted uppercase">
                      {empire.span}
                    </span>
                  </th>
                  <td>{empire.daniel2}</td>
                  <td>{empire.daniel7}</td>
                  <td>{empire.daniel8}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <details className="prophecy-lanes-more mt-14">
          <summary className="cursor-pointer font-serif text-heading-3 text-ink">
            Open the parallel chart
          </summary>

          <div className="mt-10">
            <p className="max-w-measure font-sans text-body text-ink-soft">
              Daniel 11 and Revelation 13 continue the same sequence in their own vocabulary. After
              476 the iron kingdom is divided; the historicist reading this church holds continues
              the little horn through the medieval papacy to a wound in 1798 and the sanctuary’s
              cleansing in 1844. Those later dates live on the spine, not on the strip below.
            </p>

            <div className="mt-10 overflow-x-auto">
              <table className="prophecy-lanes-table">
                <caption className="sr-only">
                  The same four empires with Daniel 11 and Revelation 13 added.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Empire</th>
                    <th scope="col">Daniel 11</th>
                    <th scope="col">Revelation</th>
                  </tr>
                </thead>
                <tbody>
                  {content.empires.map((empire) => (
                    <tr key={`${empire.empire}-depth`}>
                      <th scope="row">{empire.empire}</th>
                      <td>{empire.daniel11 ?? '—'}</td>
                      <td>{empire.revelation ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalYears > 0 && first && last ? (
              <EmpireDurations empires={content.empires} totalYears={totalYears} />
            ) : null}
          </div>
        </details>
      </Container>
    </section>
  )
}

function EmpireDurations({
  empires,
  totalYears,
}: {
  empires: EmpireAlignment[]
  totalYears: number
}) {
  return (
    <figure className="mt-14">
      <figcaption className="font-sans text-body-sm text-ink-soft">
        How long each empire held, from {empires[0]?.span.split('–')[0]} to AD 476, drawn to true
        scale. {totalYears.toLocaleString()} years. No compression.
      </figcaption>
      <ol className="prophecy-empire-strip mt-6">
        {empires.map((empire) => {
          const years = yearsSpanned(empire.start, empire.end)
          const width = (years / totalYears) * 100

          return (
            <li
              className="prophecy-empire-band"
              key={empire.empire}
              style={{ flexGrow: years, flexBasis: 0 }}
              title={`${empire.empire}, ${empire.span}, ${years} years (${width.toFixed(1)}% of the strip)`}
            >
              <span className="prophecy-empire-band-name">{empire.empire}</span>
              <span className="prophecy-empire-band-years tabular">{years} yrs</span>
            </li>
          )
        })}
      </ol>
    </figure>
  )
}
