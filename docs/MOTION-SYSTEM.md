# Motion System

Motion on this site is a design system with a small vocabulary, not a collection of animations added page by page. If a motion is not defined here, it does not get built.

---

## 1. Principles

**Motion must have a job.** Every animation does one of exactly four things: reveals content as it becomes relevant, establishes spatial depth, confirms an interaction, or transitions between states. Animation that exists because it is possible is removed.

**Two speeds, two purposes.** _Interface motion_ responds to the user and must feel instant — 120–250ms. _Environmental motion_ describes the world and can be slow — 800ms to continuous. Confusing the two is the most common failure: slow buttons feel broken, fast clouds feel nervous.

**Transform and opacity only.** No animation of `width`, `height`, `top`, `left`, `margin`, `filter`, or `box-shadow`. Anything that triggers layout or paint on every frame is disqualified, not optimized.

**Small distances.** Reveals travel 12–24px. The 60px-fade-up that dominates template sites reads as a page that has not finished loading.

**Almost no scale.** Scale is reserved for photographic depth (a plate drifting 1.00 → 1.06 across a long scroll). No element scales from 0.8 on entrance, ever. No button grows on hover.

**Enter once, quietly.** An element reveals a single time and stays. Nothing re-animates on scroll-back. Above-the-fold content is not animated in at all — it is already there, because the first thing a visitor sees should not be a page assembling itself.

**Content never depends on motion.** With JavaScript off, animation broken, or reduced motion on, every word and image is present and readable. Motion is progressive enhancement, verified by testing with it disabled.

**Reduced motion is a first-class design, not a fallback.** The reduced state is composed deliberately: the final, correct frame of every animation.

These follow the interaction-design principles associated with Emil Kowalski's work — purposeful motion, responsive interface feedback, restraint on entrance animation and scale, transform-and-opacity discipline, and reduced-motion support as a requirement rather than a courtesy.

---

## 2. Tokens

Defined as CSS custom properties in `globals.css` and mirrored in a typed `src/lib/motion.ts` for Motion for React. There is one source of truth for each value.

### Duration

| Token           | Value   | Use                                          |
| --------------- | ------- | -------------------------------------------- |
| `--dur-instant` | 140ms   | Hover, press, focus — immediate feedback     |
| `--dur-quick`   | 240ms   | Small state changes, underlines, tooltips    |
| `--dur-base`    | 420ms   | Reveals, menu open, tab change               |
| `--dur-slow`    | 700ms   | Chapter reveals, image cross-fades, lightbox |
| `--dur-ambient` | 1400ms+ | Light shifts, background transitions         |
| continuous      | 40–90s  | Cloud drift loops                            |

These were lengthened in Phase 1 from an original 120/200/320/560/1200. The site should feel **weighted rather than snappy** — things settle into place as though they have mass, which suits a building people walk into slowly. The values stay inside the interface-motion band, so buttons still respond rather than lag.

### Easing

| Token           | Curve                              | Use                                             |
| --------------- | ---------------------------------- | ----------------------------------------------- |
| `--ease-out`    | `cubic-bezier(0.16, 1, 0.3, 1)`    | Default for anything entering or responding     |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)`   | Two-way state changes                           |
| `--ease-settle` | `cubic-bezier(0.25, 0.8, 0.25, 1)` | Ambient and atmospheric transitions             |
| linear          | —                                  | Continuous loops and scroll-linked mapping only |

Nothing overshoots. No spring bounce, no elastic, no anticipation. Bounce reads as playful, and playful is the wrong note for a sanctuary.

Springs are used for pointer-follow smoothing and for the hero, where the visible result is damping rather than bounce. In the hero, two springs are deliberately **mismatched** — the photograph tracks scroll closely at `stiffness: 120, damping: 30`, the type is looser and heavier at `stiffness: 62, damping: 26`. That gap is the effect: matched springs read as one rigid sheet sliding, mismatched springs read as separate objects with separate mass.

### Distance and transform limits

| Motion                                 | Limit                                     |
| -------------------------------------- | ----------------------------------------- |
| Reveal translateY                      | 16px default, 24px maximum                |
| Reveal translateX (horizontal reveals) | 24px maximum                              |
| Scroll parallax, background layer      | 12% of viewport height maximum travel     |
| Scroll parallax, foreground layer      | 6% maximum                                |
| Layer speed differential               | 0.3 ratio maximum between adjacent layers |
| Pointer parallax, far layer            | 14px maximum displacement                 |
| Pointer parallax, near layer           | 6px maximum displacement                  |
| Photographic scale drift               | 1.00 → 1.06 over a full section scroll    |
| Any UI element scale                   | not permitted                             |

The parallax numbers are deliberately conservative. The brief asks for depth perceived before it is consciously noticed; that happens at roughly 8–15px of relative displacement, not 60px. Anything larger produces the "game-like" effect the brief rules out, and reliably causes motion discomfort.

### Stagger

40–60ms between siblings, capped at 6 items. Beyond six, the group reveals as one — a twelve-item stagger is a loading screen.

---

## 3. Primitives

Only these get built in Phase 3. Each is listed with the concrete experience that justifies it. Everything else on the brief's candidate list is deferred with a reason.

### Built in Phase 1

Two primitives were pulled forward from Phase 3, because the homepage hero was built with motion rather than composed motionless and animated later.

**`<Reveal>`** — the workhorse, in `src/components/motion/reveal.tsx`. `whileInView` with `viewport={{ once: true, amount: 0.25 }}`, animating `opacity: 0 → 1` and `translateY: 20px → 0` over `--dur-slow` with `--ease-out`. Accepts `delay`, `className`, and `as`. Takes server-rendered `children`, so wrapping a section in it does not pull that section's content across the client boundary.

Two constraints worth keeping. It only wraps **headers and self-contained blocks, never arbitrary chapter bodies** — `transform` establishes a containing block, so wrapping a subtree silently changes how any sticky or absolutely positioned descendant resolves. And list staggers are **capped at four steps**; past that the last row waits noticeably for its turn, and a delay you can feel while looking at an empty row is worse than no stagger.

**The hero entrance sequence** — storyboarded in `HERO_CUE` in `src/lib/motion.ts`. The camera settles, the church name arrives, the headline rises a word at a time out of a mask, then the service times and the actions. Everything lands by 1.45s: a long opening is a toll charged on every visit, and it stops being cinematic the second time someone sees it.

The headline's word-mask is the line-splitting idea below, applied at word granularity because word boundaries need no measurement and survive any reflow. The `<h1>` carries the full sentence on `aria-label` and the visual word spans are `aria-hidden`, so assistive technology reads one continuous line. Each mask needs `padding-bottom` with a matching negative margin, or `overflow-hidden` crops to the em box and shears the descenders off letters like the "p" in "place".

**`<RevealText>`** — still deferred as a general component. If it lands, it splits on **lines**, not characters, with a 50ms stagger. Line-splitting only: per-character animation on a church homepage is decorative typing, and it destroys screen-reader output and text selection.

### Entrance motion must not touch the LCP element

The hero photograph animates on `scale` alone. It never animates `opacity`.

This is the rule, not a detail of one component. Largest Contentful Paint is measured when the element paints, and an element at `opacity: 0` has not painted — so fading in the largest image on the page moves the metric by the full length of the fade plus its delay. `transform` is handled by the compositor after paint and costs nothing.

So: the LCP element may move, scale, or be masked by an ancestor, but it enters at full opacity. Everything else in the hero may fade, because none of it is what the browser is timing.

**`<AtmosphericBackground>`** — the hero's sky. Layered CSS gradients (sky scale plus a `dawn-soft` wash), one very soft cloud texture, and a light-position custom property driven by the chapter scroll orchestrator. No canvas, no WebGL.

**`<CloudParallax>`** — two or three cloud layers translating at different rates, combining a continuous drift (60–90s, `linear`, `transform` only) with scroll-linked vertical offset within the 12% budget. Suspended via `IntersectionObserver` when off-screen so it costs nothing for the rest of the page.

**`<PointerParallax>`** — a client wrapper that maps normalized pointer position to spring-smoothed `x`/`y` offsets for its children, respecting the per-layer displacement caps. Enabled only when `(hover: hover) and (pointer: fine)` matches — never on touch. Used in exactly two places: the hero atmosphere and the ministry switcher. Listens on the section, not the window, and updates a `MotionValue` so React does not re-render on pointer move.

**`<ParallaxMedia>`** — a full-bleed image plate whose inner image translates and scale-drifts against the section as it passes. Uses `useScroll({ target, offset: ['start end', 'end start'] })` with `useTransform`. The workhorse of the chapter transitions.

**`<ChapterAtmosphere>`** — the light-arc orchestrator. Chapters do not each own a scroll listener; they read from **one shared source of scroll state** and interpolate their own background in CSS from custom properties (`--light-warmth`, `--light-position`, `--register`). That sharing is the requirement. Whether it is implemented as a single scroll listener writing to the document root, a context-provided `MotionValue`, a scroll-driven CSS animation, or `IntersectionObserver` at chapter boundaries is an implementation choice to be made when the code is written — pick whichever is cleanest, provided the color work stays in CSS and no chapter registers its own redundant listener.

**`<HorizontalGallery>`** — a horizontally scrollable photo sequence. Built on **native overflow scrolling** with `scroll-snap-type: x mandatory`, plus buttons and full keyboard support. Motion is limited to a subtle scroll-linked offset on each item's inner image. Native scrolling means trackpad, touch, shift-wheel, arrow keys, and screen readers all work for free, and there is nothing to hijack.

**`<Lightbox>`** — a focus-trapped fullscreen viewer. Opacity and a small scale-in on the image only (0.98 → 1.00), `--dur-slow`. Escape closes, arrows navigate, focus returns to the trigger, background scroll locked.

### Deferred, with reasons

- **`<MagneticCTA>`** — a button that pulls toward the cursor. Cheap novelty, degrades click accuracy, meaningless on touch and keyboard, and tonally wrong for a church. Not building it.
- **`<ScrollProgress>`** — no value on the homepage, where the narrative is the progress indicator. Reconsider only for the long Pathfinders page, and then as a thin `dawn` hairline driven by `useScroll` with `scaleX`.
- **`<AnimatedNavigation>`** — the header's scroll-state change is a CSS transition on two properties triggered by one boolean. It does not need a motion primitive.
- **`<ImageReveal>` / clip-path masking** — folded into `<Reveal>` with a `clipPath` variant if a specific moment needs it. Not a standalone component until it earns one.
- **`<SectionTransition>`** — replaced by `<ChapterAtmosphere>`, which does the same job with one listener instead of per-boundary components.

---

## 4. Scroll behavior

**Native scrolling is never touched.** No smooth-scroll library, no `wheel` interception, no scroll-jacking, no pinned sections that trap the user, no `scroll-behavior: smooth` on the root (it fights keyboard paging and jump links).

Scroll-linked motion is read-only: we observe position and map it to transforms. Position is read exclusively through Motion's `useScroll`, which uses a passive listener and requestAnimationFrame batching. No component calls `getBoundingClientRect()` in a scroll handler.

Sticky storytelling uses `position: sticky` in normal document flow, so scrolling out of a sticky scene is as easy as scrolling into it. Sticky scenes are capped at **200vh** of scroll each and there are at most **two** on any page — a sticky scene is a paragraph, not a chapter. **`/prophecy` is the exception:** that page *is* the years, so its flight track is several viewports (`SCROLL_FLIGHT` in `src/lib/motion.ts`). Leaving it is still native scroll. Homepage scenes stay at the cap.

At most **two scroll-linked scenes are active at once**; each is gated by `IntersectionObserver` and fully suspended when off-screen.

---

## 5. Reduced motion

`prefers-reduced-motion: reduce` is honored globally and by design, in three layers.

**CSS layer.** A global rule collapses transitions and animations to 1ms and disables the cloud drift loops.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }

  [data-motion] {
    transform: none !important;
    opacity: 1 !important;
    clip-path: none !important;
    filter: none !important;
  }

  [data-motion='sunset'] {
    opacity: 0.4 !important;
  }
}
```

The `[data-motion]` rule is the part that actually holds. The blanket rule collapses CSS transitions, but scroll-linked motion is driven from JavaScript and writes **inline styles**, which a `transition-duration` override cannot reach. Any element animated that way carries `data-motion`, and this rule forces it to its resting frame regardless of what the JS layer computed. `clip-path` is included because reveals use it, and an element left clipped is an element that is simply invisible.

**Overlays are the exception, and getting this wrong is invisible until someone turns reduced motion on.** For ordinary content, "resting" and "fully opaque" are the same thing. For a scrim they are opposites: the hero's sunset overlay resolved to `opacity: 1` stops being a wash over the photograph and becomes a solid sheet of dusk covering it. Reduced motion means less movement, not a blacked-out hero. So that element is tagged `data-motion="sunset"` and lands on the middle value the scroll animation passes through rather than on its endpoint. Any future scrim animated from JavaScript needs the same treatment — never the bare attribute.

**React layer.** A `useReducedMotion()` hook (Motion's, wrapped) gates behavior at the source. `<Reveal>` renders children in their final state with no observer attached. `<PointerParallax>` returns children directly and never registers a listener. `<ParallaxMedia>` renders a static, well-composed frame. `<CloudParallax>` renders a still sky.

**Composition layer.** The reduced state is designed, not degraded. Every parallax scene has a defined resting composition — the frame we would have chosen if the section were a still photograph. Because reveals are opacity-plus-20px, the reduced version is simply the finished page, which is the correct outcome. The hero's entrance is skipped at the source rather than played and suppressed: with reduced motion on, the headline renders as plain text with no word masks and no scheduled transitions.

Also honored: `prefers-reduced-transparency` (overlay opacities firm up) and `prefers-contrast: more` (hairlines darken, overlays strengthen). Both are two lines of CSS and both matter to real users.

---

## 6. Mobile and touch

Mobile is a different composition, not a broken desktop one.

| Desktop                         | Mobile                                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Pointer parallax                | Removed entirely — no device-orientation substitute, which drains battery and causes nausea          |
| Background parallax up to 12%   | Reduced to 6%, or removed where it costs a repaint                                                   |
| Cloud drift, 3 layers           | 1 layer, or a static gradient sky on low-end devices                                                 |
| Ministry hover switcher         | Vertical list of full-bleed photographic rows, each tappable — the same content, composed for thumbs |
| Horizontal gallery with buttons | Native scroll-snap carousel with a position indicator                                                |
| Sticky scroll scenes            | Reduced to two stacked, fully-visible states                                                         |
| Reveals                         | Kept — they are cheap and they still read well                                                       |

Every hover-only affordance has a touch equivalent that shows the same information without requiring a hover. Touch targets are 44px minimum. `100dvh` rather than `100vh` for the hero, so the mobile browser chrome does not crop it.

---

## 7. Performance constraints

Budgets, enforced by `pnpm check:bundle` in CI:

- Homepage client JavaScript: **under 196KB gzipped**, excluding the `nomodule` polyfill chunk that modern browsers never request. Currently measuring 193.6KB.

  This number was **revised up from 120KB after measuring**. The original was written before anything was built and turned out to be unreachable: Next 16's App Router with React 19 costs **140.8KB gzipped on a page with no client components at all**. A budget nobody can meet is a budget everybody ignores, so it was replaced with a measured ceiling and a recorded breakdown. Each line below was measured by building with that feature stubbed out, not estimated:

  | Component                                              | Gzipped      |
  | ------------------------------------------------------ | ------------ |
  | Framework floor — React + App Router runtime           | 140.8 KB     |
  | Motion: scroll springs and transforms, for the hero    | 38.4 KB      |
  | Motion: keyframe engine, for the hero entrance         | 7.1 KB       |
  | Scroll reveals across the nine chapters below the hero | 0.7 KB       |
  | Re-chunking overhead from co-locating Sanity Studio    | 6.6 KB       |
  | **Total**                                              | **193.6 KB** |

  The Studio line is counter-intuitive and worth reading twice. **None of Studio's code is on the homepage** — no Sanity, no styled-components, verified by grepping the emitted chunks. Mounting a second large client application in the same Next app changes how Turbopack splits shared vendor code, and the homepage ends up paying 6.6KB for the same modules arranged across eleven chunks instead of eight. Measured by moving the route out and rebuilding: 187.0KB without it, 193.6KB with it. That cost buys same-origin Visual Editing and one deployment to hand over instead of two, which is the trade recorded in `CMS-ARCHITECTURE.md`. If this number ever becomes the binding constraint, moving Studio to its own deployment recovers it.

  The 7.1KB line is the one to understand before trimming anything. **Scroll-linked motion and keyframed motion are separate engines**: a component that only maps scroll position onto `style` never loads the second one. The hero's entrance sequence is the first thing on the site to use `initial`/`animate`, so it pays for the whole engine — and every reveal afterwards rides along for almost nothing, which is why nine chapters of them cost less than a tenth of what the entrance did.

  The practical consequence: removing an individual reveal saves nothing measurable. Removing the entrance sequence saves 7KB and is a design decision, not a performance one.

  The motion share overall did land close to the 40KB the original budget predicted, via `LazyMotion` with the `domAnimation` feature bundle. The framework floor is the part that was mis-estimated, and it is not ours to cut.

  Headroom is deliberately thin, so anything that moves this number has to edit the budget on purpose.

- Verified separately: no server-only dependency reaches the client. Supabase, the Sanity client, and Zod are all absent from every browser chunk, which is what the `server-only` boundary is for.
- Animated properties: `transform` and `opacity` only. A code review that finds an animated layout property rejects the change.
- Simultaneous animating elements in a viewport: **under 12**.
- `will-change` is applied on activation and removed on completion, never left permanently in CSS. Permanent `will-change` on many elements is worse than none.
- Compositing: animated layers are promoted deliberately and counted. No stacking of a dozen `translateZ(0)` hacks.
- All scroll and pointer listeners are passive and observer-gated.
- Off-screen chapters use `content-visibility: auto` with `contain-intrinsic-size` to keep rendering work proportional to what is visible.
- Hero LCP is a real, prioritized, optimized image — never a video, never text waiting on a font, and never an element that fades in. It may scale, since `transform` runs after paint; `opacity` blocks paint and moves the metric by the full length of the fade.

Targets: LCP under 2.5s on a mid-tier Android over 4G, CLS under 0.05 (every image has explicit dimensions; nothing animates in a way that can shift layout), INP under 200ms, Lighthouse mobile performance 90+.

---

## 8. Implementation notes

- Motion primitives are the only Client Components in the presentation layer. They accept server-rendered `children`, so content stays on the server and only the animation wrapper hydrates.
- Wrap the app in `<LazyMotion features={domAnimation} strict>` and use the `m` component rather than `motion`, which keeps the imported feature set small and makes accidental full-bundle imports a build error.
- Prefer CSS for anything CSS can do: hover, focus, the header state change, continuous cloud drift. Motion for React is for scroll-linked and pointer-linked mapping, and for orchestration that CSS cannot express.
- Scroll and pointer values flow through `MotionValue`s, never React state. A pointer handler that calls `setState` re-renders on every mouse move and will drop frames.
- Every primitive is verified in four modes before it is considered done: full motion, reduced motion, keyboard-only, and touch.
