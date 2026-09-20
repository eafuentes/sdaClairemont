import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="Not found"
        title="That page is not here."
        intro="It may have moved, or the address may be mistyped. These are reliable ways back into the church."
      />
      <div className="bg-paper-bloom pb-section">
        <Container>
          <div className="flex flex-wrap gap-4">
            <Button href="/">Homepage</Button>
            <Button href="/visit" variant="secondary">
              Plan a visit
            </Button>
          </div>
          <p className="mt-8 font-sans text-body-sm text-ink-soft">
            <Link className="underline decoration-dawn underline-offset-4" href="/this-sabbath">
              This Sabbath
            </Link>
            <span aria-hidden="true"> · </span>
            <Link className="underline decoration-dawn underline-offset-4" href="/prophecy">
              Walk through the years
            </Link>
          </p>
        </Container>
      </div>
    </>
  )
}
