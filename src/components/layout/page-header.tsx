import { Container } from '@/components/layout/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Rule } from '@/components/ui/rule'

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
    <header className="bg-paper-bloom pt-12 pb-10 md:pt-section md:pb-12">
      <Container>
        <Eyebrow className="text-dawn">{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-measure-lead text-display-2 text-ink md:mt-6">{title}</h1>
        {intro ? (
          <p className="mt-6 max-w-measure font-sans text-body-lg text-ink-soft md:mt-8">{intro}</p>
        ) : null}
        <Rule className="mt-10 max-w-measure-lead" mark />
      </Container>
    </header>
  )
}
