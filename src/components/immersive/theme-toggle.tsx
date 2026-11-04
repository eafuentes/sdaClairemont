'use client'

import { useLayoutEffect, useSyncExternalStore } from 'react'

import {
  MOBILE_THEME_KEY,
  MOBILE_THEME_LABEL,
  type MobileTheme,
  applyMobileTheme,
  isMobileTheme,
  readMobileTheme,
} from '@/lib/mobile-theme'
import { cn } from '@/lib/utils'

const CHANGE_EVENT = 'mobile-theme-change'

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => window.removeEventListener(CHANGE_EVENT, onChange)
}

function getTheme(): MobileTheme | null {
  const value = document.documentElement.dataset.mobileTheme
  return isMobileTheme(value) ? value : null
}

/**
 * Switches the mobile theme. Two swatches — paper with a red swipe, dusk with a gold sun.
 *
 * The attribute on <html> is the source of truth; the inline script in the root layout
 * set it before first paint. The layout effect re-applies the stored value after React's
 * development remount clears it, and is a no-op in production.
 */
export function ThemeToggle({
  className,
  withLabel = false,
}: {
  className?: string
  withLabel?: boolean
}) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => null)

  useLayoutEffect(() => {
    applyMobileTheme(readMobileTheme())
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  function toggle() {
    const next: MobileTheme = (getTheme() ?? readMobileTheme()) === 'ink' ? 'gold' : 'ink'
    applyMobileTheme(next)
    try {
      localStorage.setItem(MOBILE_THEME_KEY, next)
    } catch {}
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }

  const nextLabel = MOBILE_THEME_LABEL[theme === 'gold' ? 'ink' : 'gold']

  return (
    <button
      aria-label={`Switch to ${nextLabel} theme`}
      className={cn('theme-toggle press inline-flex min-h-11 items-center gap-3', className)}
      onClick={toggle}
      type="button"
    >
      <span aria-hidden="true" className="theme-toggle-swatch">
        <span className="theme-toggle-swatch-ink" />
        <span className="theme-toggle-swatch-gold" />
      </span>
      {withLabel ? (
        <span aria-hidden="true" className="font-sans text-body-sm">
          {MOBILE_THEME_LABEL[theme ?? 'ink']}
        </span>
      ) : null}
    </button>
  )
}
