/**
 * Brand utilities that read the palette in `src/styles/palette.css`.
 *
 * Hex never lives here. Change a colour or a gradient stop in that file; these
 * strings only name the compiled classes so components do not interpolate tokens.
 */
export const brandGradient = {
  ember: 'bg-grad-ember',
  horizon: 'bg-grad-horizon',
  void: 'bg-grad-void',
  radial: 'bg-grad-radial',
  wash: 'bg-grad-wash',
  flare: 'bg-grad-flare',
  rise: 'bg-grad-rise',
  band: 'bg-grad-band',
  cta: 'bg-grad-cta',
  ctaHover: 'bg-grad-cta-hover',
  bloom: 'bg-paper-bloom',
} as const

export type BrandGradient = keyof typeof brandGradient

const LIGHT_GRADIENTS = new Set<BrandGradient>(['wash'])

/** Gradients that keep ink type; the rest are dusk-register (paper type). */
export function isLightGradient(name: BrandGradient): boolean {
  return LIGHT_GRADIENTS.has(name)
}
