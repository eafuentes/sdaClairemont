import { MobileDock } from '@/components/immersive/mobile-dock'
import { TouchGlow } from '@/components/immersive/touch-glow'
import { HeroVersionSwitcher } from '@/components/layout/hero-version-switcher'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { SkipToContent } from '@/components/layout/skip-to-content'
import { MotionProvider } from '@/components/motion/motion-provider'
import { DraftBanner } from '@/components/sanity/draft-banner'
import { getSiteSettings } from '@/sanity/lib/load'

/**
 * The public site shell.
 *
 * A route group rather than a path segment, so the header and footer wrap every public
 * page without adding a URL prefix — and so future surfaces that should not have them
 * (the Studio, an authenticated area) can sit outside this group.
 *
 * Settings are fetched once here and passed down as props. No layout component reaches
 * for its own data. `getSiteSettings` is wrapped in React `cache`, so the homepage
 * sharing the same request does not issue a second query.
 *
 * Below `lg` the floating dock replaces the header navigation; the touch glow is the
 * Golden Hour theme's backlight and renders nothing visible otherwise.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <MotionProvider>
      <SkipToContent />
      <DraftBanner />
      <SiteHeader settings={settings} />
      <main id="main">{children}</main>
      <SiteFooter settings={settings} />
      <TouchGlow />
      <MobileDock
        settings={{
          serviceTimes: settings.serviceTimes,
          address: settings.address,
          phone: settings.phone,
          isLive: settings.isLive,
          livestreamUrl: settings.livestreamUrl,
        }}
      />
      <HeroVersionSwitcher />
    </MotionProvider>
  )
}
