import { EditorialBody } from '@/components/content/editorial-body'
import { Container } from '@/components/layout/container'
import { PageHeader } from '@/components/layout/page-header'
import { MediaPlaceholder } from '@/components/media/media-placeholder'
import type { EditorialPage } from '@/types/content'

interface EditorialPageViewProps {
  page: EditorialPage
  eyebrow: string
  /** Rendered in the paper well, above the hero and body — used for the About trail. */
  before?: React.ReactNode
  children?: React.ReactNode
}

/**
 * Shared interior layout for Sanity `page` documents: header, optional hero plate,
 * then the constrained block set. Extra practical content (address, giving URL) is
 * passed as `children` so dedicated routes can add it without a second template.
 */
export function EditorialPageView({ page, eyebrow, before, children }: EditorialPageViewProps) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={page.title} intro={page.intro} />
      <div className="bg-paper pb-section">
        <Container>
          {before ? <div className="mb-12">{before}</div> : null}
          {page.hero ? (
            <MediaPlaceholder
              className="mb-12 aspect-[16/9] max-w-measure-lead"
              description={page.hero.alt}
              image={page.hero}
            />
          ) : null}
          <EditorialBody blocks={page.blocks} />
          {children}
        </Container>
      </div>
    </>
  )
}
