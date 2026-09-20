'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import config from '../../../../sanity.config'

function StudioLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper font-sans text-body-sm text-ink-muted">
      Loading Studio…
    </div>
  )
}

/**
 * Studio must not server-render, and must not go through `NextStudio`.
 *
 * `NextStudio` uses `useDeferredValue(useSyncExternalStore(...), false)` to detect
 * mount. React 19.2 treats that deferred update as a state write before the
 * component has committed, which is the overlay error at `/studio`.
 *
 * `sanity`'s `Studio` does not use that hook. Skipping SSR still avoids the
 * structure-plugin useMemo crash: on the server the plugin list is `[]`, on the
 * client it is `[structure]`, and React 19 treats a dependency array that changes
 * size as a crash.
 */
const SanityStudio = dynamic(() => import('sanity').then((mod) => mod.Studio), {
  ssr: false,
  loading: () => <StudioLoading />,
})

export function Studio() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <StudioLoading />

  return (
    <div className="h-dvh max-h-dvh overflow-auto overscroll-none antialiased">
      <SanityStudio config={config} unstable_globalStyles />
    </div>
  )
}
