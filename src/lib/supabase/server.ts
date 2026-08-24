import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { supabaseEnv } from '@/env'

/**
 * Supabase client for Server Components, Server Actions and route handlers.
 *
 * Reads and writes the session through Next's cookie store using `getAll`/`setAll`
 * — not the deprecated individual `get`/`set`/`remove`, which do not round-trip
 * correctly.
 *
 * When identifying the current user, always call `supabase.auth.getUser()`, never
 * `getSession()`. `getSession` trusts a cookie the client could have tampered with;
 * `getUser` verifies against the auth server.
 *
 * Generated database types are wired in as the schema lands in Phase 5.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  const env = supabaseEnv()

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // Server Components cannot write cookies. Refreshed sessions are
            // persisted by middleware instead, which arrives with auth in Phase 5.
          }
        },
      },
    },
  )
}
