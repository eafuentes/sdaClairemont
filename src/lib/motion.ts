/**
 * Typed motion tokens, mirroring the CSS custom properties in globals.css.
 *
 * One source of truth per value. CSS owns hover and focus transitions; this file owns
 * anything driven from JavaScript. When a number appears in both places it is because a
 * transition and an animation genuinely share a duration, not because it was copied.
 *
 * See docs/MOTION-SYSTEM.md.
 */

/**
 * The house curve. A long, flat deceleration — motion arrives fast and spends most of its
 * time settling, which is what reads as weight. Nothing overshoots anywhere in this
 * system: bounce reads as playful, and playful is the wrong note for a sanctuary.
 */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const

/** Two-way state changes, where the start and end deserve the same treatment. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

/** Ambient and atmospheric transitions. */
export const EASE_SETTLE = [0.25, 0.8, 0.25, 1] as const

export const DURATION = {
  instant: 0.14,
  quick: 0.24,
  base: 0.42,
  slow: 0.7,
  ambient: 1.4,
  /** Reserved for the hero's opening camera move, which is longer than anything else. */
  cinematic: 1.8,
} as const

/*
 * Scroll-linked springs, deliberately mismatched.
 *
 * `lead` tracks scroll closely and carries the photograph. `trail` is looser and heavier
 * and carries the type, so it arrives a beat later. That gap is the whole effect: matched
 * springs read as one rigid sheet sliding, mismatched springs read as separate objects
 * with separate mass. `drift` is slower still, for the furthest depth layer.
 *
 * High damping relative to stiffness in all three, so they settle rather than bounce.
 */
export const SPRING = {
  lead: { stiffness: 120, damping: 30, restDelta: 0.001 },
  trail: { stiffness: 62, damping: 26, restDelta: 0.001 },
  drift: { stiffness: 38, damping: 24, restDelta: 0.001 },
  /**
   * Pointer-follow. Damped enough that it settles rather than bounces; stiff enough
   * that the scene still feels attached to the hand.
   */
  follow: { stiffness: 110, damping: 20, mass: 0.85, restDelta: 0.001 },
  /**
   * Homepage hero look-around. Quicker than `follow` so the scene stays on the
   * hand while still settling without bounce.
   */
  look: { stiffness: 170, damping: 22, mass: 0.55, restDelta: 0.001 },
} as const

/**
 * The hero's opening sequence, in seconds.
 *
 * Read this as a storyboard rather than a config object. The camera settles first, the
 * name of the church arrives, the headline rises a word at a time, then the practical
 * details a visitor actually came for.
 *
 * Deliberately front-loaded: the last element lands at 1.5s, not 3s. A long entrance is
 * a toll charged to every visitor on every visit, and it stops being cinematic the second
 * time someone sees it.
 */
export const HERO_CUE = {
  plate: 0,
  eyebrow: 0.25,
  headline: 0.38,
  /** Per-word offset in the headline's staggered rise. */
  headlineStagger: 0.075,
  rule: 0.85,
  services: 0.95,
  address: 1.1,
  actions: 1.2,
  cue: 1.45,
} as const

/**
 * Scroll-triggered reveal for content below the fold.
 *
 * `amount: 0.25` fires when a quarter of the element is visible, which for a tall chapter
 * means it starts as the heading clears the fold rather than when the last pixel does.
 * `once` because a section that re-animates every time it scrolls past is a section that
 * fights the reader.
 */
export const REVEAL_VIEWPORT = { once: true, amount: 0.25 } as const

/** Distance a revealed element rises. Small on purpose — 16px reads, 60px lurches. */
export const REVEAL_DISTANCE = 20

/** Line stagger for RevealText, in seconds. */
export const REVEAL_TEXT_STAGGER = 0.05

/**
 * Parallax travel caps from MOTION-SYSTEM.md, as fractions of the element's own height
 * so a 6% foreground shift stays inside the budget without measuring the viewport.
 */
export const PARALLAX = {
  foreground: 0.06,
  background: 0.12,
  photoScale: 1.06,
} as const

/** Pointer displacement caps, in pixels. */
export const POINTER = {
  far: 14,
  near: 6,
  plate: 6,
} as const

/**
 * Flagship-page hero: full-bleed photograph settling into a contained plate.
 *
 * Scale here is photographic, not UI. The plate is one picture changing composition
 * as you read, the same way the homepage hero walks golden hour into dusk. Type
 * travels and fades; it does not bounce.
 */
export const SCROLL_HERO = {
  trackVh: 180,
  plateScale: [1.04, 1] as const,
  titleScale: [1, 0.52] as const,
} as const

/**
 * Prophecy flight. Longer than other sticky scenes on purpose: 200vh is one flick
 * of the wheel, which reads as paging the site. This page *is* the years, so the
 * track is several viewports. Leaving it is still native scroll — no wheel hijack.
 */
export const SCROLL_FLIGHT = {
  trackVh: 720,
  /** First and last fraction of the track where the camera holds still. */
  linger: 0.05,
} as const

/**
 * Maps sticky-track progress so the camera lingers at the first and last years.
 * The middle is a smoothstep: travel does not start or stop with a jump.
 */
export function travelProgress(progress: number, linger: number = SCROLL_FLIGHT.linger): number {
  const p = Math.max(0, Math.min(1, progress))
  const start = linger
  const end = 1 - linger
  if (p <= start) return 0
  if (p >= end) return 1
  const t = (p - start) / (end - start)
  return t * t * (3 - 2 * t)
}

/**
 * Inverse of `travelProgress`. Used when a click names a year and the camera
 * should travel there — the scroll position jumps, the spring flies.
 */
export function untravelProgress(travel: number, linger: number = SCROLL_FLIGHT.linger): number {
  const y = Math.max(0, Math.min(1, travel))
  if (y <= 0) return 0
  if (y >= 1) return 1
  let lo = 0
  let hi = 1
  for (let step = 0; step < 16; step += 1) {
    const mid = (lo + hi) / 2
    if (mid * mid * (3 - 2 * mid) < y) lo = mid
    else hi = mid
  }
  const t = (lo + hi) / 2
  return linger + t * (1 - 2 * linger)
}
