import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { Eyebrow } from '@/components/ui/eyebrow'
import type { HomePageContent, SiteSettings } from '@/types/content'

interface OurStoryProps {
  content: HomePageContent['story']
  settings: SiteSettings
}

/**
 * Chapter 06 — Our Story.
 *
 * The tagline sits over the plate on desktop as real text over a real photograph, with
 * a tested contrast floor — not baked into the image and not resting on a full-image
 * scrim. On mobile it moves beneath the plate, which guarantees contrast without a
 * scrim being needed at all.
 */
export function OurStory({ content, settings }: OurStoryProps) {
  return (
    <section aria-labelledby="story-title" className="bg-paper py-section-lg" id="our-story">
      <div className="relative">
        <MediaPlaceholder
          className="h-[50vh] w-full lg:h-[70vh]"
          description={content.plate.description}
          tone="paper"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden lg:block">
          <Container>
            <p className="max-w-[24ch] bg-paper/85 p-8 font-serif text-display-2 text-ink">
              {settings.tagline}
            </p>
          </Container>
        </div>
      </div>

      <Container>
        <p className="mt-10 max-w-measure-lead font-serif text-heading-1 text-ink lg:hidden">
          {settings.tagline}
        </p>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 lg:col-start-2">
            <Eyebrow index="06">Our story</Eyebrow>
            <h2 className="sr-only" id="story-title">
              Our story
            </h2>
            <div className="mt-8 space-y-6">
              {content.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="max-w-measure font-sans text-body text-ink-70"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <Link
              className="mt-10 inline-block font-sans text-body-sm text-ink underline decoration-dawn decoration-1 underline-offset-4 transition-all duration-[var(--dur-instant)] ease-out hover:decoration-2"
              href="/about"
            >
              More about us
            </Link>
          </div>

          <div className="lg:col-span-3 lg:col-start-9">
            <Link className="group block" href="/about/leadership">
              <MediaPlaceholder
                className="aspect-[4/5]"
                description={content.pastorPortrait.description}
                tone="paper"
              />
              <p className="mt-4 font-serif text-heading-3 text-ink underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-[var(--dur-instant)] ease-out group-hover:decoration-dawn">
                {content.pastor.name}
              </p>
              <p className="font-sans text-body-sm text-ink-45">{content.pastor.role}</p>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
