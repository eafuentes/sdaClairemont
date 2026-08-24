'use client'

import { LazyMotion, domAnimation } from 'motion/react'

/**
 * Loads the motion feature bundle once, for the whole site.
 *
 * `domAnimation` rather than the full package: it carries animations, exit transitions and
 * gestures, and leaves out drag and layout projection, which this site never uses. `strict`
 * makes importing the full `motion` component a runtime error rather than a quiet 25KB —
 * the mistake it guards against is one import, in one file, that nobody notices in review.
 *
 * Mounted in the site layout so `children` stay server-rendered. This component is a
 * client boundary, but content passed through it as `children` is not pulled across it.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
