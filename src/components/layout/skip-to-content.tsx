/**
 * The first focusable element on every page.
 *
 * Hidden until focused, then rendered as a real, visible control. Keyboard and screen
 * reader users should not have to tab through the whole navigation on every page.
 */
export function SkipToContent() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-xs focus:bg-ink focus:px-5 focus:font-sans focus:text-body-sm focus:font-medium focus:text-paper"
    >
      Skip to content
    </a>
  )
}
