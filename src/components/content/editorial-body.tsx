import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { Button } from '@/components/ui/button'
import { ScriptureQuote } from '@/components/ui/scripture-quote'
import type { EditorialBlock } from '@/types/content'

interface EditorialBodyProps {
  blocks: EditorialBlock[]
}

/**
 * Renders the constrained block set used by editorial pages.
 *
 * Headings inside the body start at H2 because the page already used its only H1.
 * Accordion items use native `<details>` so they work without JavaScript.
 */
export function EditorialBody({ blocks }: EditorialBodyProps) {
  return (
    <div className="space-y-8">
      {blocks.map((block) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={block.key} className="max-w-measure font-sans text-body text-ink-soft">
                {block.text}
              </p>
            )
          case 'heading':
            return block.level === 2 ? (
              <h2 key={block.key} className="max-w-measure-lead font-serif text-heading-1 text-ink">
                {block.text}
              </h2>
            ) : (
              <h3 key={block.key} className="max-w-measure font-serif text-heading-2 text-ink">
                {block.text}
              </h3>
            )
          case 'quote':
            return (
              <blockquote
                key={block.key}
                className="max-w-measure font-serif text-quote text-ink italic"
              >
                {block.text}
              </blockquote>
            )
          case 'list':
            return block.ordered ? (
              <ol
                key={block.key}
                className="max-w-measure list-decimal space-y-2 pl-5 font-sans text-body text-ink-soft"
              >
                {block.items.map((item, index) => (
                  <li key={`${block.key}-${index}`}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul
                key={block.key}
                className="max-w-measure list-disc space-y-2 pl-5 font-sans text-body text-ink-soft"
              >
                {block.items.map((item, index) => (
                  <li key={`${block.key}-${index}`}>{item}</li>
                ))}
              </ul>
            )
          case 'image':
            return (
              <MediaPlaceholder
                key={block.key}
                className="aspect-[16/9] max-w-measure-lead"
                description={block.image.alt}
                image={block.image}
              />
            )
          case 'scripture':
            return (
              <ScriptureQuote
                key={block.key}
                reference={block.reference}
                translation={block.translation}
              >
                {block.text ?? block.reference}
              </ScriptureQuote>
            )
          case 'cta':
            return (
              <Button key={block.key} external={block.external} href={block.href}>
                {block.label}
              </Button>
            )
          case 'video':
            return (
              <p key={block.key}>
                <Button external href={block.url} variant="secondary">
                  {block.title}
                </Button>
              </p>
            )
          case 'links':
            return (
              <div key={block.key}>
                {block.heading ? (
                  <h2 className="font-serif text-heading-2 text-ink">{block.heading}</h2>
                ) : null}
                <ul className={block.heading ? 'mt-5 space-y-3' : 'space-y-3'}>
                  {block.links.map((link) => (
                    <li key={link.href}>
                      <Button
                        external={/^https?:\/\//.test(link.href)}
                        href={link.href}
                        variant="tertiary"
                      >
                        {link.label}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          case 'accordion':
            return (
              <div key={block.key} className="max-w-measure">
                {block.heading ? (
                  <h2 className="mb-6 font-serif text-heading-2 text-ink">{block.heading}</h2>
                ) : null}
                <div className="divide-y divide-rule border-y border-rule">
                  {block.items.map((item, index) => (
                    <details key={`${block.key}-${index}`} className="group py-5">
                      <summary className="cursor-pointer font-serif text-heading-3 text-ink">
                        {item.question}
                      </summary>
                      <div className="mt-4 space-y-4">
                        {item.answer.map((paragraph, paragraphIndex) => (
                          <p
                            key={`${block.key}-${index}-${paragraphIndex}`}
                            className="font-sans text-body text-ink-soft"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )
        }
      })}
    </div>
  )
}
