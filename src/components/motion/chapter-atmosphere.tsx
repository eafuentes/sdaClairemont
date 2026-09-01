'use client'

import { useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'

/**
 * One scroll listener for the light arc that runs through the homepage.
 *
 * Chapters do not each own a listener. They read `--light-warmth` and
 * `--light-position` from the document root and interpolate in CSS. The mapping is
 * dawn at the top, dusk through prayer, morning again at the invitation.
 *
 * Children stay server-rendered. This wrapper hydrates; the chapters do not.
 */
export function ChapterAtmosphere({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return children
  }

  return <ChapterAtmosphereActive>{children}</ChapterAtmosphereActive>
}

function ChapterAtmosphereActive({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll()
  const warmth = useTransform(scrollYProgress, [0, 0.45, 0.78, 1], [0.22, 0.48, 0.88, 0.28])
  const position = useTransform(scrollYProgress, [0, 1], [0.15, 0.85])

  useMotionValueEvent(warmth, 'change', (value) => {
    document.documentElement.style.setProperty('--light-warmth', value.toFixed(3))
  })
  useMotionValueEvent(position, 'change', (value) => {
    document.documentElement.style.setProperty('--light-position', value.toFixed(3))
  })

  return children
}
