import { PageHeader } from '@/components/layout/page-header'
import { MinistryRow } from '@/components/ministries/ministry-row'
import { pageMetadata } from '@/lib/page-metadata'
import { getMinistries } from '@/sanity/lib/load'

export const metadata = pageMetadata(
  'Ministries',
  'Pathfinders, Adventurers, Sabbath School, CARE Group, and Vacation Bible School — a place for the whole family.',
)

export default async function MinistriesPage() {
  const ministries = await getMinistries()
  const ordered = [...ministries].sort((first, second) => first.order - second.order)

  return (
    <>
      <PageHeader
        eyebrow="Ministries"
        title="There is somewhere here for your whole family."
        intro="Not a directory of programs. These are the groups of people you would actually join."
      />
      <div className="bg-paper-bloom pb-section">
        <ul>
          {ordered.map((ministry) => (
            <li key={ministry.slug}>
              <MinistryRow headingLevel="h2" ministry={ministry} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
