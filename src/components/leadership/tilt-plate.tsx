'use client'

import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

import { MediaPlaceholder } from '@/components/media/media-placeholder'
import { SPRING } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { ContentImage } from '@/types/content'

const FINE_POINTER = '(hover: hover) and (pointer: fine)'

interface TiltPlateProps {
  image?: ContentImage
  description: string
  className?: string
  /** Hero plates look around a little more; portraits stay closer to the hand. */
  intensity?: 'portrait' | 'hero'
}

/**
 * A photograph with a little mass.
 *
 * Fine pointers tilt the plate in perspective and slide the print the other way,
 * so it reads as a shallow physical object rather than a flat rectangle. Touch and
 * reduced motion keep the still frame. Transform only — the image never fades.
 */
export function TiltPlate({
  image,
  description,
  className,
  intensity = 'portrait',
}: TiltPlateProps) {
  const plateRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING.look)
  const y = useSpring(rawY, SPRING.look)

  const tilt = intensity === 'hero' ? 5.5 : 6.5
  const pitch = intensity === 'hero' ? 2.8 : 3.4
  const pan = intensity === 'hero' ? 4 : 3.2

  const rotateY = useTransform(x, [-1, 1], [-tilt, tilt])
  const rotateX = useTransform(y, [-1, 1], [pitch, -pitch])
  const imageX = useTransform(x, (value) => `${-value * pan}%`)
  const imageY = useTransform(y, (value) => `${-value * (pan * 0.6)}%`)

  useEffect(() => {
    if (prefersReducedMotion) return

    const node = plateRef.current
    if (!node) return

    const pointer = window.matchMedia(FINE_POINTER)
    let attached = false

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = node.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      rawX.set(Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1)))
      rawY.set(Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1)))
    }

    const onLeave = () => {
      rawX.set(0)
      rawY.set(0)
    }

    const attach = () => {
      if (attached) return
      attached = true
      node.addEventListener('pointermove', onMove, { passive: true })
      node.addEventListener('pointerleave', onLeave)
    }

    const detach = () => {
      if (!attached) return
      attached = false
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerleave', onLeave)
      onLeave()
    }

    const sync = () => {
      if (pointer.matches) attach()
      else detach()
    }

    sync()
    pointer.addEventListener('change', sync)
    return () => {
      pointer.removeEventListener('change', sync)
      detach()
    }
  }, [prefersReducedMotion, rawX, rawY])

  if (!image) {
    return <MediaPlaceholder className={className} description={description} image={image} />
  }

  if (prefersReducedMotion) {
    return (
      <div className={cn('relative overflow-hidden bg-paper-deep', className)}>
        <Image alt={image.alt} className="object-cover object-top" fill sizes="50vw" src={image.src} />
      </div>
    )
  }

  return (
    <div
      ref={plateRef}
      className={cn('relative overflow-hidden bg-paper-deep [perspective:1400px]', className)}
    >
      <m.div
        className="absolute inset-0 origin-center will-change-transform [transform-style:preserve-3d]"
        data-motion
        style={{ rotateX, rotateY }}
      >
        <m.div
          className="absolute inset-0 origin-center scale-[1.1] will-change-transform"
          data-motion
          style={{ x: imageX, y: imageY }}
        >
          <Image
            alt={image.alt}
            className="object-cover object-top"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            src={image.src}
          />
        </m.div>
      </m.div>
    </div>
  )
}
