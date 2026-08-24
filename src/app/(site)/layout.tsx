import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { SkipToContent } from '@/components/layout/skip-to-content'
import { MotionProvider } from '@/components/motion/motion-provider'
import { siteSettings } from '@/content/site-settings'

/**
 * The public site shell.
 *
 * A route group rather than a path segment, so the header and footer wrap every public
 * page without adding a URL prefix — and so future surfaces that should not have them
 * (the Studio, an authenticated area) can sit outside this group.
 *
 * Settings are fetched once here and passed down as props. No layout component reaches
 * for its own data.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <SkipToContent />
      <SiteHeader settings={siteSettings} />
      <main id="main">{children}</main>
      <SiteFooter settings={siteSettings} />
    </MotionProvider>
  )
}
