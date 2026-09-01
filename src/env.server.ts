import 'server-only'

import { z } from 'zod'

/**
 * Server-only environment values.
 *
 * The `server-only` import above is the enforcement mechanism: importing this
 * module from a Client Component fails the build rather than leaking a secret at
 * runtime. Do not remove it, and do not re-export anything from here through a
 * module that a client component can reach.
 */

/**
 * Supabase secret key. Bypasses Row Level Security entirely.
 *
 * Only `lib/supabase/admin.ts` should read this, and only for intentionally
 * privileged server operations such as accepting a public form submission into a
 * table that grants the anon role no access at all.
 */
export const supabaseSecretEnv = (() => {
  const schema = z.object({
    SUPABASE_SECRET_KEY: z.string().min(1, 'is required'),
  })

  let cached: z.output<typeof schema> | undefined

  return () => {
    if (cached !== undefined) return cached

    const result = schema.safeParse({
      SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    })

    if (!result.success) {
      throw new Error(
        [
          'Missing SUPABASE_SECRET_KEY.',
          'This is the server-only Supabase key (sb_secret_...) used for privileged',
          'operations. Add it to .env.local, and to the Vercel project environment.',
          'It must never be prefixed with NEXT_PUBLIC_.',
        ].join('\n'),
      )
    }

    cached = result.data
    return cached
  }
})()

/**
 * Viewer token for drafts and Presentation. Optional: published pages do not need it,
 * and a missing value must not take down the public site. Draft mode and Visual
 * Editing fail closed when it is absent.
 */
export function sanityApiReadToken(): string | undefined {
  const token = process.env.SANITY_API_READ_TOKEN
  return token && token.length > 0 ? token : undefined
}

/**
 * Shared secret for the Sanity revalidation webhook. Optional until the webhook is
 * configured; published fetches keep a short ISR window in that case.
 */
export function sanityRevalidateSecret(): string | undefined {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  return secret && secret.length > 0 ? secret : undefined
}
