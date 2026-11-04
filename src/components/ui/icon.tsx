import { cn } from '@/lib/utils'

/**
 * The site's hand-built icon set.
 *
 * One grid (24), one stroke (1.5px), round caps and joins, no fills. The stroke is
 * `non-scaling`, so an icon set at caption size and one set beside a display title
 * draw the same line weight as the type around them. Icons inherit `currentColor`
 * and default to 1em, so they take their size and colour from the text they sit in.
 *
 * Icons never carry meaning alone. They are always `aria-hidden` and always sit next
 * to a word that says the same thing.
 */
const paths = {
  'arrow-right': <path d="M4 12h15M13 6l6 6-6 6" />,
  'arrow-up-right': <path d="M7 17 17 7M8.5 7H17v8.5" />,
  'chevron-down': <path d="m6 9.5 6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M3.5 8.5h17M3.5 15.5h17" />,
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />,
  phone: (
    <path d="M5.5 4h3l1.5 4-2 1.25a10 10 0 0 0 5.75 5.75L15 13l4 1.5v3A2 2 0 0 1 17 19.5 14.5 14.5 0 0 1 3.5 6a2 2 0 0 1 2-2Z" />
  ),
  'map-pin': (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.25" />
    </>
  ),
  calendar: (
    <>
      <rect height="15" rx="1" width="17" x="3.5" y="5.5" />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  mail: (
    <>
      <rect height="14" rx="1" width="18" x="3" y="5" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  heart: (
    <path d="M12 19.5s-7.5-4.6-7.5-10A4.25 4.25 0 0 1 12 6.9a4.25 4.25 0 0 1 7.5 2.6c0 5.4-7.5 10-7.5 10Z" />
  ),
  flame: (
    <>
      <path d="M12 3.5c2.5 2.6 4 4.9 4 7.4a4 4 0 0 1-8 0c0-1.4.6-2.6 1.6-3.6.2 1.3.9 2.1 1.9 2.4-.3-2.3.1-4.3.5-6.2Z" />
      <path d="M8 20.5h8" />
    </>
  ),
} as const

export type IconName = keyof typeof paths

interface IconProps {
  name: IconName
  className?: string
}

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn('icon inline-block size-[1em] shrink-0', className)}
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths[name]}
    </svg>
  )
}
