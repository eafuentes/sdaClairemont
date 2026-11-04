import type { Metadata, Viewport } from 'next'
import { Instrument_Sans, Newsreader, Oswald, Permanent_Marker } from 'next/font/google'

import { InlineScript } from '@/components/immersive/inline-script'
import { DraftPreview } from '@/components/sanity/draft-preview'
import { siteConfig } from '@/config/site'
import { appEnv } from '@/env'
import { DEFAULT_MOBILE_THEME, MOBILE_THEME_SCRIPT } from '@/lib/mobile-theme'

import '@/styles/globals.css'

/**
 * Editorial serif. Scripture, testimonials, and pull quotes — not titles.
 * The optical-size axis is requested explicitly so the same family sets correctly
 * at both caption and display sizes.
 */
const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-newsreader',
})

/** Interface sans. Carries body copy, navigation, labels and metadata. */
const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-sans',
})

/** Condensed display. The 2026 SERMONIC lockup — tall, athletic, uppercase. */
const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-oswald',
})

/**
 * Hand-painted accent, from the pastor's slides. Two or three words at a time, mobile
 * only. Not preloaded: desktop never renders it, so desktop never downloads it.
 */
const permanentMarker = Permanent_Marker({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  preload: false,
  variable: '--font-permanent-marker',
})

export const metadata: Metadata = {
  metadataBase: new URL(appEnv().NEXT_PUBLIC_SITE_URL),
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  // Full SEO — JSON-LD, Open Graph images, per-route metadata from Sanity — is Phase 6.
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={`${newsreader.variable} ${instrumentSans.variable} ${oswald.variable} ${permanentMarker.variable}`}
      data-mobile-theme={DEFAULT_MOBILE_THEME}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={MOBILE_THEME_SCRIPT} />
      </head>
      <body>
        {children}
        <DraftPreview />
      </body>
    </html>
  )
}
