import { ViewTransition } from 'react'

/**
 * Page-to-page transitions.
 *
 * A template rather than the layout, because a template remounts on navigation and so
 * gives `ViewTransition` an exit for the old page and an enter for the new one. What the
 * classes look like is entirely CSS: on phones, Ink & Brush paints the new page in with a
 * brush stroke and Golden Hour opens it as a circle from the last touch. Desktop and
 * reduced motion get no animation at all.
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition default="none" enter="page-in" exit="page-out">
      {children}
    </ViewTransition>
  )
}
