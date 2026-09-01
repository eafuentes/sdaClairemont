'use client'

import dynamic from 'next/dynamic'

import config from '../../../../sanity.config'

/**
 * Studio must not server-render.
 *
 * `NextStudio` uses `React.lazy`, which still SSRs. On the server the structure plugin
 * is not in the tree yet, so a memo inside Studio sees `[]`; on the client it sees
 * `[structure]`. React 19 treats a dependency array that changes size as a crash, which
 * is the error at `/studio`. Skipping SSR means the first render already has the plugins.
 */
const NextStudio = dynamic(() => import('next-sanity/studio').then((mod) => mod.NextStudio), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-dvh items-center justify-center bg-paper font-sans text-body-sm text-ink-muted">
      Loading Studio…
    </div>
  ),
})

export function Studio() {
  return <NextStudio config={config} />
}
