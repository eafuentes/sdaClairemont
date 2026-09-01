import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { cn } from '@/lib/utils'
import type { Ministry, MinistryTone } from '@/types/content'

interface MinistryRowProps {
  ministry: Ministry
  headingLevel?: 'h2' | 'h3'
}

const toneClasses: Record<MinistryTone, string> = {
  warm: 'bg-gradient-to-b from-paper-warm to-paper-deep',
  cool: 'bg-gradient-to-b from-dusk/[0.07] to-paper-deep',
  neutral: 'bg-gradient-to-b from-paper-deep to-paper',
}

const placeholderTone: Record<MinistryTone, 'warm' | 'cool' | 'neutral'> = {
  warm: 'warm',
  cool: 'cool',
  neutral: 'neutral',
}

/**
 * One ministry as a full-bleed row. Shared by the homepage chapter and the ministries
 * index so the stacked composition cannot drift between them.
 */
export function MinistryRow({ ministry, headingLevel = 'h3' }: MinistryRowProps) {
  const Title = headingLevel

  return (
    <Link
      className={cn(
        'group block border-t border-rule transition-colors duration-[var(--dur-quick)] ease-out hover:bg-ink/[0.02]',
        toneClasses[ministry.tone],
      )}
      href={`/ministries/${ministry.slug}`}
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 py-12 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="lg:col-span-5 lg:col-start-1">
            <Title className="font-serif text-display-2 text-ink underline decoration-transparent decoration-1 underline-offset-[0.15em] transition-colors duration-[var(--dur-quick)] ease-out group-hover:decoration-dawn">
              {ministry.name}
            </Title>
            <p className="mt-5 max-w-measure font-sans text-body text-ink-soft">
              {ministry.shortDescription}
            </p>
            <p className="mt-5 font-sans text-eyebrow text-ink-muted uppercase">
              {ministry.ageRange}
              <span aria-hidden="true"> · </span>
              {ministry.meetingSchedule}
            </p>
          </div>

          <MediaPlaceholder
            className="aspect-[16/9] lg:col-span-6 lg:col-start-7"
            description={`Wide atmospheric frame for ${ministry.name}: the group in the middle of doing the thing, shot from a distance rather than posed.`}
            image={ministry.switcherImage}
            tone={placeholderTone[ministry.tone]}
          />
        </div>
      </Container>
    </Link>
  )
}
