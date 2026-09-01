import type { Metadata, Viewport } from 'next'
import { Instrument_Sans, Newsreader } from 'next/font/google'

import { DraftPreview } from '@/components/sanity/draft-preview'
import { siteConfig } from '@/config/site'
import { appEnv } from '@/env'

import '@/styles/globals.css'

/**
 * Editorial serif. Carries display type, headings, and scripture in italic.
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${instrumentSans.variable}`}>
      <body>
        {children}
        <DraftPreview />
      </body>
    </html>
  )
}
