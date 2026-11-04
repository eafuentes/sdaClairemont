import { cn } from '@/lib/utils'

/**
 * A kinetic ticker band. Pure CSS: one track, written twice, sliding half its width on a
 * loop, so the seam is invisible. Screen readers get the sentence once, still.
 *
 * Stops under reduced motion and on low-power devices, where it reads as a static band.
 */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const run = items.map((item, index) => (
    <span key={`${item}-${index}`} className="marquee-item">
      {item}
      <span aria-hidden="true" className="marquee-star">
        ✦
      </span>
    </span>
  ))

  return (
    <div className={cn('marquee', className)}>
      <p className="sr-only">{items.join('. ')}</p>
      <div aria-hidden="true" className="marquee-track">
        <div className="marquee-run">{run}</div>
        <div className="marquee-run">{run}</div>
      </div>
    </div>
  )
}
