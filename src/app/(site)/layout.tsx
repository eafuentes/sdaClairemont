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
      <HeroVersionSwitcher />
    </MotionProvider>
  )
}
