'use client'

import { useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

const VIDEO_SRC = '/video/church-hero-zoom.mp4'
const POSTER_SRC = '/images/hero/church-hero-video-poster.jpg'

/**
 * The zoom clip, playing through on its own.
 *
 * Earlier versions scrubbed `currentTime` from the pointer, which is why the
 * motion felt choppy. This version just autoplays and loops.
 */
export function ChurchVideoScene() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const node = videoRef.current
    if (!node) return

    node.muted = true
    node.loop = true

    if (prefersReducedMotion) {
      node.pause()
      node.currentTime = 0
      return
    }

    const play = () => {
      void node.play().catch(() => undefined)
    }
    if (node.readyState >= 2) play()
    else node.addEventListener('canplay', play, { once: true })
    return () => node.removeEventListener('canplay', play)
  }, [prefersReducedMotion])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-dusk">
      <Image
        alt=""
        className="object-cover object-center"
        fill
        priority
        sizes="100vw"
        src={POSTER_SRC}
      />
      {prefersReducedMotion ? null : (
        <video
          ref={videoRef}
          aria-hidden="true"
          autoPlay
          className="absolute inset-0 h-full w-full object-cover object-center"
          loop
          muted
          playsInline
          poster={POSTER_SRC}
          preload="auto"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}
    </div>
  )
}
