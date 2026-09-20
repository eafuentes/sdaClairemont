import { Container } from '@/components/layout/container'
import { EmpireLanes } from '@/components/prophecy/empire-lanes'
import { Flight } from '@/components/prophecy/flight'
import { PeriodScale } from '@/components/prophecy/period-scale'
import { Spine } from '@/components/prophecy/spine'
import { Button } from '@/components/ui/button'
import type { ProphecyPageContent } from '@/types/content'

interface ProphecyPageProps {
  content: ProphecyPageContent
}

/**
 * The prophecy timeline: a scroll flight through the years, then the same
 * chronology as a document. The flight is enhancement. The argument is in the
 * markup either way.
 */
export function ProphecyPage({ content }: ProphecyPageProps) {
  return (
    <>
      <Flight content={content} />
      <PeriodScale content={content} />
      <Spine content={content} />
      <EmpireLanes content={content} />
      <Close content={content} />
    </>
  )
}

function Close({ content }: { content: ProphecyPageContent }) {
  return (
    <section className="register-dusk py-section-lg">
      <Container>
        <h2 className="max-w-measure-lead font-display text-heading-1 text-paper-on-dusk">
          {content.close.headline}
        </h2>
        <p className="mt-6 max-w-measure font-sans text-body-lg text-paper-on-dusk/75">
          {content.close.body}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/visit" variant="on-dusk">
            Plan a visit
          </Button>
          <Button href="/watch" variant="on-dusk-quiet">
            Watch a message
          </Button>
        </div>
      </Container>
    </section>
  )
}
