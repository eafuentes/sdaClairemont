'use client'

import { m, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

import { DURATION, EASE_OUT } from '@/lib/motion'
import type { GalleryEntry } from '@/types/content'

interface LightboxProps {
  items: GalleryEntry[]
  index: number | null
  onClose: () => void
  onIndex: (index: number) => void
}

/**
 * Fullscreen photograph viewer.
 *
 * Native `<dialog>` owns focus trap, Escape, and restoring focus to the trigger.
 * Arrows move between photographs. Swipe does the same on touch. The image enters
 * at 0.98 and settles — photographic scale, not a bounce.
 */
export function Lightbox({ items, index, onClose, onIndex }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const touchStartX = useRef(0)
  const prefersReducedMotion = useReducedMotion()
  const open = index !== null
  const current = index !== null ? items[index] : undefined

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (!open) return

    const { style } = document.documentElement
    const previousOverflow = style.overflow
    style.overflow = 'hidden'
    return () => {
      style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open || items.length < 2) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onIndex(((index ?? 0) + 1) % items.length)
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onIndex(((index ?? 0) - 1 + items.length) % items.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, items.length, onIndex, open])

  return (
    <dialog
      aria-label={current?.title ?? current?.image.alt ?? 'Photograph'}
      className="m-0 h-dvh max-h-dvh w-full max-w-none bg-dusk p-0 text-paper-on-dusk backdrop:bg-ink/70"
      onClose={onClose}
      onTouchEnd={(event) => {
        if (items.length < 2 || index === null) return
        const travel = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current
        if (travel > 50) onIndex((index - 1 + items.length) % items.length)
        if (travel < -50) onIndex((index + 1) % items.length)
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? 0
      }}
      ref={dialogRef}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-5 py-4 md:px-8">
          <p className="font-sans text-eyebrow uppercase">
            {index !== null ? (
              <>
                <span className="tabular">{index + 1}</span>
                <span aria-hidden="true"> / </span>
                {items.length}
              </>
            ) : null}
          </p>
          <button
            className="inline-flex min-h-11 items-center font-sans text-eyebrow uppercase"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center px-5 md:px-16">
          {current ? (
            <m.div
              className="relative h-full w-full"
              data-motion
              key={current.id}
              {...(prefersReducedMotion
                ? {}
                : {
                    animate: { opacity: 1, scale: 1 },
                    initial: { opacity: 0.001, scale: 0.98 },
                    transition: { duration: DURATION.slow, ease: EASE_OUT },
                  })}
            >
              <Image
                alt={current.image.alt}
                className="object-contain"
                fill
                sizes="100vw"
                src={current.image.src}
              />
            </m.div>
          ) : null}
        </div>

        <div className="flex items-end justify-between gap-6 px-5 py-6 md:px-8">
          <div>
            {current?.title ? <p className="font-serif text-heading-3">{current.title}</p> : null}
            {current?.date ? (
              <p className="mt-1 font-sans text-eyebrow text-dawn-soft uppercase">{current.date}</p>
            ) : null}
            {current?.sentence || current?.image.caption ? (
              <p className="mt-3 max-w-measure font-sans text-body-sm text-paper-on-dusk/75">
                {current.sentence ?? current.image.caption}
              </p>
            ) : null}
            {current?.image.credit ? (
              <p className="mt-2 font-sans text-eyebrow text-paper-on-dusk/50 uppercase">
                {current.image.credit}
              </p>
            ) : null}
          </div>

          {items.length > 1 ? (
            <div className="flex gap-3">
              <button
                className="inline-flex min-h-11 items-center border border-paper-on-dusk/40 px-4 font-sans text-eyebrow uppercase"
                onClick={() => onIndex(((index ?? 0) - 1 + items.length) % items.length)}
                type="button"
              >
                Previous
              </button>
              <button
                className="inline-flex min-h-11 items-center border border-paper-on-dusk/40 px-4 font-sans text-eyebrow uppercase"
                onClick={() => onIndex(((index ?? 0) + 1) % items.length)}
                type="button"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  )
}
