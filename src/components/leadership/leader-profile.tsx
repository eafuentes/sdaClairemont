import { TiltPlate } from '@/components/leadership/tilt-plate'
import { Reveal } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'
import type { Leader } from '@/types/content'

interface LeaderProfileProps {
  leader: Leader
  index: number
}

/**
 * One pastor: a tilting plate, then the words they wrote about themselves.
 *
 * Odd rows swap on desktop so the two portraits do not stack as a single column
 * of identical cards. The type does not move with the pointer — only the print does.
 */
export function LeaderProfile({ leader, index }: LeaderProfileProps) {
  const reverse = index % 2 === 1

  return (
    <Reveal as="li" delay={Math.min(index, 3) * 0.08}>
      <article
        aria-labelledby={`${leader.slug}-name`}
        className="grid grid-cols-1 gap-8 py-12 md:grid-cols-12 md:items-start md:gap-8"
      >
        <TiltPlate
          className={cn('aspect-[4/5] md:col-span-5', reverse && 'md:col-start-8')}
          description={`Portrait of ${leader.name}, natural light, at the church rather than in a studio.`}
          image={leader.image}
        />
        <div
          className={cn(
            'md:col-span-6',
            reverse ? 'md:col-start-1 md:row-start-1' : 'md:col-start-7',
          )}
        >
          <h2 className="font-serif text-heading-1 text-ink" id={`${leader.slug}-name`}>
            {leader.name}
          </h2>
          <p className="mt-2 font-sans text-body-sm text-ink-soft">{leader.role}</p>
          {leader.bio?.map((paragraph, paragraphIndex) => (
            <p
              className="mt-6 max-w-measure font-sans text-body text-ink-soft"
              key={`${leader.slug}-${paragraphIndex}`}
            >
              {paragraph}
            </p>
          ))}
          {leader.email || leader.phone ? (
            <p className="mt-6 font-sans text-body-sm text-ink-muted">
              {leader.email ? (
                <a
                  className="underline decoration-dawn underline-offset-4"
                  href={`mailto:${leader.email}`}
                >
                  {leader.email}
                </a>
              ) : null}
              {leader.email && leader.phone ? <span aria-hidden="true"> · </span> : null}
              {leader.phone ? (
                <a
                  className="underline decoration-dawn underline-offset-4"
                  href={`tel:${leader.phone}`}
                >
                  {leader.phone}
                </a>
              ) : null}
            </p>
          ) : null}
        </div>
      </article>
    </Reveal>
  )
}
