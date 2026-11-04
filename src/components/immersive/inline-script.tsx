'use client'

/**
 * A script that runs during HTML parsing and is inert when React renders on the client.
 * `text/plain` on the client stops React warning about a script it would never execute;
 * `suppressHydrationWarning` covers the type mismatch.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
    />
  )
}
