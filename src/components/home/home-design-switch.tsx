'use client'

import { useLayoutEffect } from 'react'

import {
  DEFAULT_HOME_DESIGN,
  HOME_DESIGN_KEY,
  HOME_DESIGNS,
  type HomeDesign,
  applyHomeDesign,
  isHomeDesign,
} from '@/content/direction'

const LABELS: Record<HomeDesign, string> = {
  paper: 'Paper',
  ink: 'Ink & Brush',
  poster: 'Poster',
  harbor: 'Harbor',
  current: 'Current',
  daylight: 'Daylight',
}

/**
 * Review control for the homepage only.
 *
 * Paper, Ink & Brush, and Poster say the same thing in three of our own designs.
 * Current is the homepage as it stands. The selected look is styled from
 * `data-home-design` on <html>,
 * which the inline script set before paint, so this control holds no design state.
 */
export function HomeDesignSwitch() {
  // The inline script only runs on a full page load. Arriving here by client-side
  // navigation, resolve the design again: ?design= first, then the saved choice.
  useLayoutEffect(() => {
    const design = resolveDesign()
    document.documentElement.dataset.homeDesign = design
    mark(design)
  }, [])

  function select(design: HomeDesign) {
    applyHomeDesign(design)
    mark(design)
  }

  return (
    <div className="home-design-switch">
      <div
        aria-label="Homepage design, for review"
        className="home-design-options"
        role="radiogroup"
      >
        {HOME_DESIGNS.map((design) => (
          <button
            key={design}
            aria-checked="false"
            className="home-design-option"
            data-design={design}
            onClick={() => select(design)}
            role="radio"
            type="button"
          >
            {LABELS[design]}
          </button>
        ))}
      </div>
    </div>
  )
}

function resolveDesign(): HomeDesign {
  const query = new URLSearchParams(window.location.search).get('design')
  if (isHomeDesign(query)) return query
  try {
    const saved = localStorage.getItem(HOME_DESIGN_KEY)
    if (isHomeDesign(saved)) return saved
  } catch {
    // Storage can be refused; fall through to the default.
  }
  return DEFAULT_HOME_DESIGN
}

function mark(design: HomeDesign) {
  document.querySelectorAll<HTMLButtonElement>('.home-design-option').forEach((button) => {
    button.setAttribute('aria-checked', String(button.dataset.design === design))
  })
}
