import { Container } from '@/components/layout/container'
import { Eyebrow } from '@/components/ui/eyebrow'

interface PageHeaderProps {
  eyebrow: string
  title: string
  intro?: string
}

/**
 * Opening of every interior page: kicker, one H1, optional intro.
 *
 * Interior pages are not chapters, so they do not carry a number. The H1 is the
 * document title; everything below is body.
 */
export function PageHeader({ eyebrow, title, intro }: PageHeaderProps) {
  return (
    <header className="bg-paper-bloom pt-section pb-12">
      <Container>
        <Eyebrow className="text-dawn">{eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-measure-lead text-display-2 text-ink">{title}</h1>
        {intro ? (
          <p className="mt-8 max-w-measure font-sans text-body-lg text-ink-soft">{intro}</p>
        ) : null}
      </Container>
    </header>
  )
}
