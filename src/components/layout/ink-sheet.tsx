'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'

import { BrushStroke } from '@/components/immersive/brush-stroke'
import { primaryNav } from '@/content/navigation'
import type { ServiceTime } from '@/types/content'

/** One photograph per section: the visitor sees the church before they click. */
const SECTION_PHOTOS: Record<string, { src: string; alt: string; position?: string }> = {
  '/visit': {
    src: '/images/life/foyer-welcome.webp',
    alt: 'The Clairemont foyer: bulletin boards on a brick wall and a Welcome To Church sign.',
  },
  '/about': {
    src: '/images/pastor-website-assets/pastor-team.webp',
    alt: 'Pastor Robert Berry and Pastor London L. Lee standing together in the sanctuary.',
    position: '50% 20%',
  },
  '/ministries': {
    src: '/images/life/fellowship-kitchen.webp',
    alt: 'Clairemont members gathered around the fellowship kitchen island after the service.',
  },
  '/events': {
    src: '/images/life/kitchen-prep.webp',
    alt: 'Volunteers preparing lunch in the fellowship kitchen.',
  },
  '/watch': {
    src: '/images/sabbath/speaker-portrait.webp',
    alt: 'Pastor London L. Lee preaching from the pulpit, arms open.',
    position: '50% 25%',
  },
}

/**
 * Ink & Brush navigation: the menu as a sermon-slide index.
 *
 * The header keeps only the wordmark, this MENU stamp, and the visit button. The
 * stamp opens a full-screen paper sheet: the sections as huge numbered words, a red
 * brush painted under the one you point at, and beside it that section's photograph
 * in a hard ink frame with its pages listed underneath. When we gather and the two
 * ways in close the sheet.
 *
 * A native modal <dialog>: Escape closes it, focus stays inside, and the page
 * behind is inert. Shown only while the homepage is set to Ink & Brush (CSS).
 */
export function InkSheet({ times, givingUrl }: { times: ServiceTime[]; givingUrl: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pathname = usePathname()
  const [active, setActive] = useState(0)
  const section = primaryNav[active] ?? primaryNav[0]
  const primary = times.filter((service) => service.isPrimary)
  const shown = primary.length > 0 ? primary : times

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  const open = () => {
    setActive(Math.max(0, primaryNav.findIndex((item) => isCurrent(item.href))))
    dialogRef.current?.showModal()
  }
  const close = () => dialogRef.current?.close()

  if (!section) return null
  const photo = SECTION_PHOTOS[section.href]

  return (
    <>
      <button aria-haspopup="dialog" className="ink-sheet-trigger" onClick={open} type="button">
        <span aria-hidden="true" className="ink-sheet-trigger-bars">
          <span />
          <span />
        </span>
        Menu
      </button>

      <dialog aria-label="Site menu" className="ink-sheet" ref={dialogRef}>
        <div className="ink-sheet-inner">
          <div className="ink-sheet-top">
            <span className="font-display text-heading-3 uppercase">Clairemont</span>
            <button className="ink-sheet-close" onClick={close} type="button">
              Close <span aria-hidden="true">✕</span>
            </button>
          </div>

          <nav aria-label="Primary" className="ink-sheet-body">
            <ol className="ink-sheet-words">
              {primaryNav.map((item, index) => (
                <li key={item.href}>
                  <Link
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                    className="ink-sheet-word"
                    data-active={index === active ? '' : undefined}
                    href={item.href}
                    onClick={close}
                    onFocus={() => setActive(index)}
                    onMouseEnter={() => setActive(index)}
                  >
                    <span className="ink-sheet-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="ink-sheet-label">
                      {item.label}
                      {index === active ? (
                        <BrushStroke className="ink-sheet-brush" delay={0} key={item.href} />
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="ink-sheet-panel">
              {photo ? (
                <div className="ink-sheet-photo" key={section.href}>
                  <Image
                    alt={photo.alt}
                    className="object-cover"
                    fill
                    sizes="28rem"
                    src={photo.src}
                    style={photo.position ? { objectPosition: photo.position } : undefined}
                  />
                </div>
              ) : null}
              <p className="ink-sheet-intro">{section.intro}</p>
              <ul className="ink-sheet-links">
                {section.links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link className="ink-sheet-link" href={link.href} onClick={close}>
                      <span>{link.label}</span>
                      {link.hint ? <span className="ink-sheet-hint">{link.hint}</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="ink-sheet-foot">
            <p className="ink-sheet-times">
              <span className="ink-sheet-times-label">Saturdays</span>
              {shown.map((service, index) => (
                <span key={service.label}>
                  {index > 0 ? <span className="text-dawn">{' // '}</span> : null}
                  <span className="tabular">{service.startTime}</span>
                </span>
              ))}
            </p>
            <div className="ink-sheet-actions">
              <Link className="ink-button ink-button-primary" href="/visit" onClick={close}>
                Plan your visit
              </Link>
              <a
                className="ink-sheet-give"
                href={givingUrl}
                onClick={close}
                rel="noreferrer noopener"
                target="_blank"
              >
                Give <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
