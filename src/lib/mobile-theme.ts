/**
 * The two mobile themes. Desktop ignores both.
 *
 * `ink`   Ink & Brush — paper, black ink, red swipes, lime stickers.
 * `gold`  Golden Hour — dusk, a sunrise backlight that follows the finger.
 *
 * The attribute lives on <html> so CSS can theme every surface without a provider, and
 * so the inline script can set it before first paint.
 */
export const MOBILE_THEMES = ['ink', 'gold'] as const
export type MobileTheme = (typeof MOBILE_THEMES)[number]

export const DEFAULT_MOBILE_THEME: MobileTheme = 'ink'
export const MOBILE_THEME_KEY = 'mobile-theme'

export const MOBILE_THEME_LABEL: Record<MobileTheme, string> = {
  ink: 'Ink & Brush',
  gold: 'Golden Hour',
}

export function isMobileTheme(value: unknown): value is MobileTheme {
  return typeof value === 'string' && (MOBILE_THEMES as readonly string[]).includes(value)
}

export function readMobileTheme(): MobileTheme {
  try {
    const stored = localStorage.getItem(MOBILE_THEME_KEY)
    return isMobileTheme(stored) ? stored : DEFAULT_MOBILE_THEME
  } catch {
    return DEFAULT_MOBILE_THEME
  }
}

export function applyMobileTheme(theme: MobileTheme) {
  document.documentElement.dataset.mobileTheme = theme
}

/**
 * Runs during HTML parsing, before first paint.
 *
 * Also marks low-power devices — Save-Data, or four cores or fewer — with `data-lite`,
 * which CSS uses to drop the continuous effects (marquee, backlight) and keep the rest.
 */
export const MOBILE_THEME_SCRIPT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem(${JSON.stringify(MOBILE_THEME_KEY)});d.dataset.mobileTheme=(t===${JSON.stringify(MOBILE_THEMES[0])}||t===${JSON.stringify(MOBILE_THEMES[1])})?t:${JSON.stringify(DEFAULT_MOBILE_THEME)}}catch(e){d.dataset.mobileTheme=${JSON.stringify(DEFAULT_MOBILE_THEME)}}try{var c=navigator.connection;if((c&&c.saveData)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4))d.dataset.lite=""}catch(e){}})()`
