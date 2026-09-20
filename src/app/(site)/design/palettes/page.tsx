import type { Metadata } from 'next'

import { Container } from '@/components/layout/container'
import { Eyebrow } from '@/components/ui/eyebrow'

export const metadata: Metadata = {
  title: 'Palette options',
  robots: { index: false, follow: false },
}

const OPTIONS = [
  {
    id: 'sea',
    name: 'Garden and sea',
    promise: 'Sabbath, creation, Clairemont. The green–blue you liked, on white.',
    recommended: true,
  },
  {
    id: 'sun',
    name: 'Sun and sky',
    promise: 'Pacific light and a little gold. Warmer joy, less garden.',
    recommended: false,
  },
] as const

/**
 * A side-by-side preview of two living palettes. Scoped here so the public site
 * stays on the current crimson lockup until one of these is chosen.
 */
export default function PaletteOptionsPage() {
  return (
    <>
      <style href="joy-palette-preview">{previewStyles}</style>

      <div className="bg-paper">
        <Container>
          <header className="pt-section pb-section-sm">
            <Eyebrow>Internal preview</Eyebrow>
            <h1 className="mt-6 text-display-2">Two ways toward joy</h1>
            <p className="mt-6 max-w-measure-lead font-sans text-body-lg text-ink-soft">
              Nothing on the public pages has changed. Hover the submenu rows and the
              buttons. Pick the temperature that feels like Saturday morning.
            </p>
          </header>
        </Container>
      </div>

      <div className="grid grid-cols-1 border-t border-rule lg:grid-cols-2">
        {OPTIONS.map((option) => (
          <article
            className="joy-option border-b border-rule lg:border-r lg:border-b-0 lg:last:border-r-0"
            data-joy={option.id}
            key={option.id}
          >
            <div className="joy-frame">
              <p className="joy-kicker">
                {option.recommended ? 'Recommended · ' : null}
                {option.name}
              </p>
              <p className="joy-promise">{option.promise}</p>

              <div className="joy-bar">
                <p className="joy-wordmark">Clairemont</p>
                <span className="joy-pill">Plan Your Visit</span>
              </div>

              <ul className="joy-menu">
                <li>
                  <span className="joy-link">
                    <span className="joy-wipe" />
                    <span className="joy-link-label">Messages</span>
                    <span className="joy-link-hint">The recent sermons, to watch back.</span>
                  </span>
                </li>
                <li>
                  <span className="joy-link">
                    <span className="joy-wipe" />
                    <span className="joy-link-label">This Sabbath</span>
                    <span className="joy-link-hint">The program for this week.</span>
                  </span>
                </li>
              </ul>

              <div className="joy-chapter">
                <p className="joy-eyebrow">02 — This Sabbath</p>
                <p className="joy-date">Saturday, August 29</p>
                <h2 className="joy-title">The Long Way Home</h2>
                <p className="joy-quote">
                  The son who left assumed there was a version of himself his father could no
                  longer welcome. He was wrong about that.
                </p>
                <p className="joy-ref">Luke 15:11-32 · NKJV</p>
              </div>

              <p className="joy-band">
                What we preach is meant to be <strong>fresh, real, and powerful</strong>.
              </p>

              <div className="joy-dusk">
                <p className="joy-eyebrow joy-eyebrow-dusk">Prayer</p>
                <p className="joy-dusk-title">Is something heavy right now?</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

const previewStyles = `
  .joy-option {
    --joy-paper: #f6fbf8;
    --joy-ink: #122821;
    --joy-ink-soft: #3d5a52;
    --joy-ink-muted: #5a736c;
    --joy-dawn: #0b6b5c;
    --joy-live: linear-gradient(115deg, #7cff6b 0%, #2ee6d0 40%, #2563eb 74%, #5ec8ff 100%);
    --joy-cta: linear-gradient(90deg, #0e9f78 0%, #1d6fd8 100%);
    --joy-dusk: #0c2f3d;
    --joy-on-dusk: #f4fffb;
    --joy-bloom:
      radial-gradient(ellipse 70% 70% at 92% 8%, rgb(154 239 212 / 0.55), transparent 60%),
      radial-gradient(ellipse 45% 50% at 78% 90%, rgb(232 197 71 / 0.22), transparent 55%),
      var(--joy-paper);
  }

  .joy-option[data-joy='sun'] {
    --joy-paper: #fffdf6;
    --joy-ink: #1a2744;
    --joy-ink-soft: #4a5568;
    --joy-ink-muted: #64748b;
    --joy-dawn: #1a6f9a;
    --joy-live: linear-gradient(115deg, #7dd3fc 0%, #38bdf8 38%, #f5c542 78%, #fde68a 100%);
    --joy-cta: linear-gradient(90deg, #1578a8 0%, #1e4d8c 100%);
    --joy-dusk: #1e3a5f;
    --joy-on-dusk: #fffdf6;
    --joy-bloom:
      radial-gradient(ellipse 70% 70% at 92% 8%, rgb(125 211 252 / 0.5), transparent 60%),
      radial-gradient(ellipse 45% 50% at 78% 90%, rgb(245 197 66 / 0.35), transparent 55%),
      var(--joy-paper);
  }

  .joy-frame {
    background: var(--joy-bloom);
    color: var(--joy-ink);
    padding: 2rem 1.5rem 2.5rem;
  }

  @media (min-width: 768px) {
    .joy-frame {
      padding: 2.5rem 2.25rem 3rem;
    }
  }

  .joy-kicker {
    font-family: var(--font-sans);
    font-size: var(--text-eyebrow);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--joy-dawn);
  }

  .joy-promise {
    margin-top: 0.6rem;
    max-width: 34rem;
    font-family: var(--font-sans);
    font-size: var(--text-body);
    color: var(--joy-ink-soft);
  }

  .joy-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid color-mix(in srgb, var(--joy-ink) 12%, transparent);
  }

  .joy-wordmark {
    font-family: var(--font-display);
    font-size: var(--text-heading-3);
    letter-spacing: -0.01em;
    text-transform: uppercase;
  }

  .joy-pill {
    display: inline-flex;
    min-height: 2.5rem;
    align-items: center;
    padding: 0 1.25rem;
    border-radius: 9999px;
    background-image: var(--joy-cta);
    color: var(--joy-on-dusk);
    font-family: var(--font-sans);
    font-size: var(--text-body-sm);
    font-weight: 500;
    cursor: pointer;
  }

  .joy-menu {
    margin-top: 0;
    border-bottom: 1px solid color-mix(in srgb, var(--joy-ink) 12%, transparent);
  }

  .joy-link {
    position: relative;
    display: flex;
    min-height: 3.25rem;
    cursor: pointer;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    overflow: hidden;
    padding: 0.85rem 0.75rem;
    border-top: 1px solid color-mix(in srgb, var(--joy-ink) 12%, transparent);
  }

  .joy-wipe {
    pointer-events: none;
    position: absolute;
    inset: 0;
    background-image: var(--joy-live);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .joy-link:hover .joy-wipe,
  .joy-link:focus-visible .joy-wipe {
    transform: scaleX(1);
  }

  .joy-link-label,
  .joy-link-hint {
    position: relative;
    transition: color 240ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .joy-link-label {
    font-family: var(--font-display);
    font-size: var(--text-heading-3);
    text-transform: uppercase;
    color: var(--joy-ink-soft);
  }

  .joy-link-hint {
    display: none;
    max-width: 16rem;
    font-family: var(--font-sans);
    font-size: var(--text-body-sm);
    color: var(--joy-ink-muted);
    text-align: right;
  }

  @media (min-width: 640px) {
    .joy-link-hint {
      display: block;
    }
  }

  .joy-link:hover .joy-link-label,
  .joy-link:focus-visible .joy-link-label {
    color: var(--joy-on-dusk);
  }

  .joy-link:hover .joy-link-hint,
  .joy-link:focus-visible .joy-link-hint {
    color: color-mix(in srgb, var(--joy-on-dusk) 75%, transparent);
  }

  .joy-chapter {
    padding: 2rem 0 1.5rem;
  }

  .joy-eyebrow {
    font-family: var(--font-sans);
    font-size: var(--text-eyebrow);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--joy-ink-muted);
  }

  .joy-date,
  .joy-title,
  .joy-dusk-title {
    font-family: var(--font-display);
    text-transform: uppercase;
  }

  .joy-date {
    margin-top: 1rem;
    font-size: var(--text-heading-1);
    letter-spacing: -0.02em;
  }

  .joy-title {
    margin-top: 0.35rem;
    font-size: var(--text-heading-2);
    letter-spacing: -0.015em;
  }

  .joy-quote {
    margin-top: 1.25rem;
    max-width: 32rem;
    font-family: var(--font-serif);
    font-size: var(--text-body-lg);
    font-style: italic;
    color: var(--joy-ink-soft);
  }

  .joy-ref {
    margin-top: 0.85rem;
    font-family: var(--font-sans);
    font-size: var(--text-eyebrow);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--joy-dawn);
  }

  .joy-band {
    margin: 0 -1.5rem;
    padding: 1.5rem 1.5rem;
    background-image: var(--joy-live);
    color: var(--joy-on-dusk);
    font-family: var(--font-sans);
    font-size: var(--text-body);
    line-height: 1.65;
    text-align: center;
  }

  @media (min-width: 768px) {
    .joy-band {
      margin-inline: -2.25rem;
      padding-inline: 2.25rem;
    }
  }

  .joy-dusk {
    margin: 0 -1.5rem -2.5rem;
    padding: 1.75rem 1.5rem 2rem;
    background-color: var(--joy-dusk);
    color: var(--joy-on-dusk);
  }

  @media (min-width: 768px) {
    .joy-dusk {
      margin-inline: -2.25rem;
      margin-bottom: -3rem;
      padding-inline: 2.25rem;
    }
  }

  .joy-eyebrow-dusk {
    color: color-mix(in srgb, var(--joy-on-dusk) 65%, transparent);
  }

  .joy-dusk-title {
    margin-top: 0.65rem;
    font-size: var(--text-heading-2);
  }
`
