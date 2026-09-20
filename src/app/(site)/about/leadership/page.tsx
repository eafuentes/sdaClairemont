import { AboutSubnav } from '@/components/about/about-subnav'
import { LeaderProfile } from '@/components/leadership/leader-profile'
import { LeadershipHero } from '@/components/leadership/leadership-hero'
import { Container } from '@/components/layout/container'
import { pageMetadata } from '@/lib/page-metadata'
import { getLeadership } from '@/sanity/lib/load'
import type { Leader } from '@/types/content'

export const metadata = pageMetadata(
  'Our leadership',
  'The pastors, elders, and ministry leaders who serve the Clairemont congregation.',
)

const CATEGORY_ORDER = ['pastoral', 'elder', 'ministry-leader', 'staff'] as const

const CATEGORY_LABEL: Record<(typeof CATEGORY_ORDER)[number], string> = {
  pastoral: 'Pastoral',
  elder: 'Elders',
  'ministry-leader': 'Ministry leaders',
  staff: 'Staff',
}

function groupLeaders(leaders: Leader[]) {
  const groups = new Map<string, Leader[]>()

  for (const leader of leaders) {
    const category = CATEGORY_ORDER.includes(leader.roleCategory as (typeof CATEGORY_ORDER)[number])
      ? (leader.roleCategory as (typeof CATEGORY_ORDER)[number])
      : 'ministry-leader'
    const existing = groups.get(category) ?? []
    existing.push(leader)
    groups.set(category, existing)
  }

  return CATEGORY_ORDER.flatMap((category) => {
    const people = groups.get(category)
    return people?.length ? [{ category, label: CATEGORY_LABEL[category], people }] : []
  })
}

export default async function LeadershipPage() {
  const leaders = await getLeadership()
  const groups = groupLeaders(leaders)

  return (
    <>
      <AboutSubnav />
      <LeadershipHero />
      <div className="bg-paper-warm pb-section">
        <Container>
          {groups.map((group) => (
            <section key={group.category} className="mb-8 last:mb-0">
              {groups.length > 1 ? (
                <h2 className="pt-8 font-display text-heading-2 text-ink">{group.label}</h2>
              ) : null}
              <ul className="divide-y divide-rule border-y border-rule">
                {group.people.map((leader, index) => (
                  <LeaderProfile index={index} key={leader.slug} leader={leader} />
                ))}
              </ul>
            </section>
          ))}
        </Container>
      </div>
    </>
  )
}
