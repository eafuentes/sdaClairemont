'use client'

import {
  m,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { StarReadingPanel, readingForStar } from '@/components/prophecy/star-reading'
import { SCROLL_FLIGHT, SPRING, travelProgress } from '@/lib/motion'
import {
  type Star,
  buildConstellation,
  cameraFromProgress,
  flightZ,
  FOCAL,
  NEAR_Z,
  PASSED_Z,
  progressFromZ,
  rulerPercentFromCamera,
  SPREAD,
} from '@/lib/prophecy-constellation'
import { axisPercent } from '@/lib/prophetic-date'
import type { ProphecyPageContent } from '@/types/content'

const FINE_POINTER = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'

/**
 * How far the sticky track has been scrolled, 0–1.
 *
 * Read from the track's box, not Motion's `useScroll`. `start start` / `end end`
 * is mapped to a CSS view timeline `contain` range, which is empty for a
 * 720vh subject, so the first sample can land mid-flight (year 145) on load.
 */
function progressFromTrack(track: HTMLElement): number {
  const distance = track.offsetHeight - window.innerHeight
  if (distance <= 0) return 0
  return Math.min(1, Math.max(0, -track.getBoundingClientRect().top / distance))
}

interface FlightProps {
  content: ProphecyPageContent
}

/**
 * A scroll flight through the prophetic years.
 *
 * The charts site the church brought is a constellation you travel: nodes,
 * connecting lines, a giant year, labels only on what is nearby. This is that
 * spatial idea in SVG and DOM — not WebGL — so the same chronology remains a
 * document underneath.
 */
export function Flight({ content }: FlightProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <>
      {prefersReducedMotion ? null : <FlightActive content={content} />}
      <FlightRest content={content} />
    </>
  )
}

function FlightRest({ content }: FlightProps) {
  return (
    <header className="prophecy-flight-rest relative isolate overflow-hidden register-dusk pt-section pb-section">
      <div
        aria-hidden="true"
        className="hope-horizon absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-dawn/30 to-transparent"
      />
      <div className="mx-auto w-full max-w-page px-5 md:px-8 lg:px-16">
        <p className="font-sans text-eyebrow text-dawn-soft uppercase">{content.eyebrow}</p>
        <h1 className="mt-6 max-w-[16ch] font-serif text-display-2 text-pretty text-paper-on-dusk md:max-w-[18ch]">
          {content.title}
        </h1>
        <p className="mt-8 max-w-measure font-sans text-body-lg text-paper-on-dusk/75">
          {content.lede}
        </p>
        <figure className="mt-12 max-w-[38rem]">
          <blockquote className="font-serif text-quote text-paper-on-dusk italic">
            {content.scripture.text}
          </blockquote>
          <figcaption className="mt-6 font-sans text-eyebrow text-dawn-soft uppercase">
            {content.scripture.reference}
            {content.scripture.translation ? (
              <>
                <span aria-hidden="true"> · </span>
                {content.scripture.translation}
              </>
            ) : null}
          </figcaption>
        </figure>
      </div>

      <ol className="prophecy-years-snap mt-14">
        {content.spine.map((event, index) => (
          <li className="prophecy-years-card" key={event.id}>
            <p className="font-sans text-eyebrow text-dawn-soft uppercase">
              <span className="tabular">{String(index + 1).padStart(2, '0')}</span>
            </p>
            <p className="mt-3 font-serif text-heading-1 text-paper-on-dusk">
              {event.date.display}
            </p>
            <p className="mt-4 font-serif text-heading-3 text-paper-on-dusk">{event.title}</p>
            <p className="mt-3 font-sans text-eyebrow text-paper-on-dusk/60 uppercase">
              {event.scripture.reference}
            </p>
          </li>
        ))}
      </ol>
    </header>
  )
}

function FlightActive({ content }: FlightProps) {
  const constellation = useMemo(() => buildConstellation(content), [content])
  const trackRef = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const starEls = useRef(new Map<string, SVGCircleElement>())
  const hitEls = useRef(new Map<string, HTMLButtonElement>())
  const sizeRef = useRef({ w: 1200, h: 800 })
  const ghostId = useRef<string | null>(null)
  const selectedIdRef = useRef<string | null>(null)
  const lastHitRef = useRef<HTMLButtonElement | null>(null)

  const scrollYProgress = useMotionValue(0)
  const lead = useSpring(scrollYProgress, { ...SPRING.lead, skipInitialAnimation: true })
  const trail = useSpring(scrollYProgress, { ...SPRING.trail, skipInitialAnimation: true })

  const longPeriod = content.periods.find((period) => period.id === '2300')
  const nestedPeriod = content.periods.find((period) => period.id === '490')
  const nestedWidth =
    longPeriod && nestedPeriod
      ? axisPercent(longPeriod.start, nestedPeriod.end, longPeriod.end)
      : 21.3
  const ruler = useMemo(() => {
    return {
      nestedWidth,
      zStart: longPeriod ? flightZ(longPeriod.start) : 0,
      zNestedEnd: nestedPeriod ? flightZ(nestedPeriod.end) : 490,
      zEnd: longPeriod ? flightZ(longPeriod.end) : 640,
    }
  }, [longPeriod, nestedPeriod, nestedWidth])

  const titleOpacity = useTransform(trail, [0, 0.08, 0.16], [1, 1, 0])
  const cueOpacity = useTransform(trail, [0, 0.05, 0.12], [1, 0.65, 0])
  const heroLock = useTransform(lead, [0, 0.88, 0.97, 1], [0, 0, 0.85, 1])
  const travel = useTransform(lead, (progress) => {
    const cam = cameraFromProgress(progress, constellation.minZ, constellation.maxZ)
    return (
      rulerPercentFromCamera(cam, ruler.zStart, ruler.zNestedEnd, ruler.zEnd, ruler.nestedWidth) /
      100
    )
  })
  const playheadX = useTransform(travel, (percent) => `${percent * 100}%`)

  const openingStar = constellation.stars.find((star) => star.kind === 'spine')
  const [ghost, setGhost] = useState<Star | undefined>(openingStar)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

  const syncProgress = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    scrollYProgress.set(progressFromTrack(track))
  }, [scrollYProgress])

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration
    if (!window.location.hash) {
      window.history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)
    }
    syncProgress()

    let userMoved = false
    const markMoved = () => {
      userMoved = true
    }
    const pinOpening = () => {
      if (window.location.hash || userMoved) return
      window.scrollTo(0, 0)
      syncProgress()
    }
    const raf = window.requestAnimationFrame(pinOpening)
    const later = window.setTimeout(pinOpening, 200)
    window.addEventListener('load', pinOpening)
    window.addEventListener('pageshow', pinOpening)
    window.addEventListener('wheel', markMoved, { passive: true })
    window.addEventListener('touchmove', markMoved, { passive: true })
    window.addEventListener('scroll', syncProgress, { passive: true })
    window.addEventListener('resize', syncProgress)

    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(later)
      window.removeEventListener('load', pinOpening)
      window.removeEventListener('pageshow', pinOpening)
      window.removeEventListener('wheel', markMoved)
      window.removeEventListener('touchmove', markMoved)
      window.removeEventListener('scroll', syncProgress)
      window.removeEventListener('resize', syncProgress)
      window.history.scrollRestoration = previous
    }
  }, [syncProgress])

  const selectedStar = selectedId
    ? constellation.stars.find((star) => star.id === selectedId)
    : undefined
  const reading = selectedStar ? readingForStar(selectedStar, content) : null

  const closeReading = useCallback(() => {
    setSelectedId(null)
    selectedIdRef.current = null
    lastHitRef.current?.focus()
  }, [])

  const travelToStar = useCallback(
    (star: Star, trigger: HTMLButtonElement) => {
      lastHitRef.current = trigger
      if (selectedIdRef.current === star.id) {
        closeReading()
        return
      }
      selectedIdRef.current = star.id
      setSelectedId(star.id)
      const track = trackRef.current
      if (!track) return
      const progress = progressFromZ(star.z, constellation.minZ, constellation.maxZ)
      const top = window.scrollY + track.getBoundingClientRect().top
      const distance = track.offsetHeight - window.innerHeight
      window.scrollTo({ top: top + progress * Math.max(0, distance), behavior: 'auto' })
    },
    [closeReading, constellation.maxZ, constellation.minZ],
  )

  const paint = useCallback(
    (progress: number) => {
      const { w, h } = sizeRef.current
      const cam = cameraFromProgress(progress, constellation.minZ, constellation.maxZ)
      const projected = new Map<string, { x: number; y: number; t: number; dz: number }>()
      const selected = selectedIdRef.current

      for (const star of constellation.stars) {
        const dz = star.z - cam
        const t = FOCAL / (FOCAL + dz)
        const node = starEls.current.get(star.id)
        const isSelected = star.id === selected

        if (!Number.isFinite(t) || t <= 0.08 || (dz < PASSED_Z && !isSelected)) {
          node?.setAttribute('opacity', '0')
          continue
        }

        const x = w / 2 + star.x * t * SPREAD
        const y = h / 2 + star.y * t * SPREAD
        projected.set(star.id, { x, y, t, dz })

        if (node) {
          node.setAttribute('cx', x.toFixed(1))
          node.setAttribute('cy', y.toFixed(1))
          node.setAttribute('r', (star.r * (0.4 + t * t * 2.1)).toFixed(2))
          const fade = dz < 0 ? Math.max(0.15, 1 + dz / 160) : Math.min(1, 0.18 + t * 1.05)
          node.setAttribute('opacity', fade.toFixed(3))
          node.classList.toggle('is-selected', isSelected)
        }
      }

      let path = ''
      for (const edge of constellation.edges) {
        const from = projected.get(edge.from)
        const to = projected.get(edge.to)
        if (!from || !to) continue
        path += `M${from.x.toFixed(1)} ${from.y.toFixed(1)}L${to.x.toFixed(1)} ${to.y.toFixed(1)}`
      }
      pathRef.current?.setAttribute('d', path)

      let ghostStar: Star | undefined
      let ghostDistance = Infinity

      for (const star of constellation.stars) {
        const hit = hitEls.current.get(star.id)
        const point = projected.get(star.id)
        if (!hit) continue

        const isSelected = star.id === selected
        const around = Boolean(
          point && Math.abs(point.dz) < (star.kind === 'tick' ? 48 : NEAR_Z) && point.t > 0.32,
        )
        const live = around || isSelected

        if (!point || !live) {
          hit.style.opacity = '0'
          hit.style.pointerEvents = 'none'
          hit.tabIndex = -1
          continue
        }

        const closeness = 1 - Math.min(1, Math.abs(point.dz) / NEAR_Z)
        hit.style.opacity = isSelected ? '1' : Math.min(1, closeness * 1.2).toFixed(3)
        hit.style.transform = `translate3d(${point.x - 22}px, ${point.y - 22}px, 0)`
        hit.style.pointerEvents = 'auto'
        hit.tabIndex = 0
        hit.classList.toggle('is-selected', isSelected)

        const distance = Math.abs(point.dz)
        if (distance < ghostDistance) {
          ghostStar = star
          ghostDistance = distance
        }
      }

      if (travelProgress(progress) === 0 && openingStar) {
        ghostStar = openingStar
      }

      if (ghostStar && ghostStar.id !== ghostId.current) {
        ghostId.current = ghostStar.id
        setGhost(ghostStar)
      }
    },
    [constellation, openingStar],
  )

  useMotionValueEvent(lead, 'change', paint)

  useMotionValueEvent(heroLock, 'change', (value) => {
    document.documentElement.style.setProperty('--hero-lock', value.toFixed(3))
  })

  useEffect(() => {
    const svg = svgRef.current
    const frame = () => {
      if (!svg) return
      sizeRef.current = { w: svg.clientWidth || 1200, h: svg.clientHeight || 800 }
      paint(lead.get())
    }
    frame()
    if (!svg) return undefined
    const observer = new ResizeObserver(frame)
    observer.observe(svg)

    const pointer = window.matchMedia(FINE_POINTER)
    const sync = () => {
      document.documentElement.classList.toggle('header-over-media', pointer.matches)
      document.documentElement.style.setProperty('--hero-lock', pointer.matches ? '0' : '1')
    }
    sync()
    pointer.addEventListener('change', sync)

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedIdRef.current) {
        event.preventDefault()
        closeReading()
        paint(lead.get())
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      observer.disconnect()
      pointer.removeEventListener('change', sync)
      window.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('header-over-media')
      document.documentElement.style.removeProperty('--hero-lock')
    }
  }, [closeReading, lead, paint])

  useEffect(() => {
    paint(lead.get())
  }, [lead, paint, selectedId])

  return (
    <section
      className="prophecy-flight-motion relative -mt-16 lg:-mt-20"
      ref={trackRef}
      style={{ height: `${SCROLL_FLIGHT.trackVh}vh` }}
    >
      <h1 className="sr-only">{content.title}</h1>
      <div className="prophecy-flight-stage sticky top-0 isolate h-dvh overflow-hidden register-dusk">
        <div aria-hidden="true" className="prophecy-horizon" />

        <p aria-hidden="true" className="prophecy-ghost-year">
          <span className="tabular">{ghost?.yearShort ?? ''}</span>
        </p>

        <svg aria-hidden="true" className="prophecy-constellation" ref={svgRef}>
          <path className="prophecy-constellation-edges" ref={pathRef} />
          {constellation.stars.map((star) => (
            <circle
              className={`prophecy-star prophecy-star-${star.kind}`}
              cx="-100"
              cy="-100"
              key={star.id}
              r={star.r}
              ref={(node) => {
                if (node) starEls.current.set(star.id, node)
                else starEls.current.delete(star.id)
              }}
            />
          ))}
        </svg>

        <div className="prophecy-star-labels">
          {constellation.stars.map((star) => (
            <button
              aria-label={`${star.title}, ${star.year}. Open what happened.`}
              className={`prophecy-star-hit prophecy-star-hit-${star.kind}`}
              key={star.id}
              onClick={(event) => travelToStar(star, event.currentTarget)}
              ref={(node) => {
                if (node) hitEls.current.set(star.id, node)
                else hitEls.current.delete(star.id)
              }}
              tabIndex={-1}
              type="button"
            >
              <span aria-hidden="true" className="prophecy-star-hotspot" />
              {star.number ? <span className="prophecy-star-number">{star.number}</span> : null}
              <span className="prophecy-star-copy">
                {star.kicker && star.kind !== 'tick' ? (
                  <span className="prophecy-star-kicker">{star.kicker}</span>
                ) : null}
                {star.kind === 'tick' ? null : (
                  <span className="prophecy-star-name">{star.title}</span>
                )}
                <span className="prophecy-star-date">{star.year}</span>
              </span>
            </button>
          ))}
        </div>

        <StarReadingPanel onClose={closeReading} reading={reading} />

        {reading ? null : (
          <m.div className="prophecy-flight-intro" style={{ opacity: titleOpacity }}>
            <p className="font-sans text-eyebrow text-dawn-soft uppercase">{content.eyebrow}</p>
            <p className="mt-5 max-w-[16ch] font-serif text-display-2 text-paper-on-dusk">
              {content.title}
            </p>
            <p className="mt-6 max-w-[28rem] font-sans text-body text-paper-on-dusk/70">
              {content.lede}
            </p>
          </m.div>
        )}

        <m.p className="prophecy-flight-cue" style={{ opacity: cueOpacity }}>
          Scroll to travel the years
        </m.p>

        <div className="prophecy-flight-hud">
          <p className="font-serif text-heading-2 text-paper-on-dusk">{ghost?.year}</p>
          <p className="mt-2 max-w-[36rem] font-sans text-body-sm text-paper-on-dusk/70">
            {ghost?.title}
          </p>
          {ghost?.kicker ? (
            <p className="mt-2 font-sans text-eyebrow text-dawn-soft uppercase">{ghost.kicker}</p>
          ) : null}

          <div className="prophecy-flight-ruler mt-6">
            <div
              className="prophecy-flight-ruler-track"
              style={{ '--nested-width': `${nestedWidth}%` } as CSSProperties}
            >
              <m.div className="prophecy-flight-ruler-progress" style={{ scaleX: travel }} />
              <div className="prophecy-flight-ruler-weeks" />
              <m.div className="prophecy-flight-playhead" style={{ x: playheadX }}>
                <span />
              </m.div>
            </div>
            <p className="prophecy-flight-ruler-caption">
              <span>{longPeriod?.start.display ?? '457 BC'}</span>
              <span>the 490, to true scale</span>
              <span>{longPeriod?.end.display ?? '1844'}</span>
            </p>
          </div>
        </div>

        <p className="prophecy-flight-skip">
          <a href="#chronology">Read the chronology</a>
        </p>
      </div>
    </section>
  )
}
