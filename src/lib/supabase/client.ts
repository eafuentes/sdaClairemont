import { createBrowserClient } from '@supabase/ssr'

import { supabaseEnv } from '@/env'

/**
 * Supabase client for Client Components.
 *
 * Uses the publishable key, which is browser-safe: it grants only what Row Level
 * Security allows. Authorization is never decided here — client-side checks are
 * cosmetic, and the real boundary is the policy in Postgres.
 *
 * Generated database types are wired in as the schema lands in Phase 5.
 */
export function createSupabaseBrowserClient() {
  const env = supabaseEnv()

  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
}
