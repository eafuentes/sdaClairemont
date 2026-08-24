import 'server-only'

import { createClient } from '@supabase/supabase-js'

import { supabaseEnv } from '@/env'
import { supabaseSecretEnv } from '@/env.server'

/**
 * PRIVILEGED CLIENT — BYPASSES ROW LEVEL SECURITY.
 *
 * This client authenticates with the Supabase secret key and is subject to no
 * policy. Anything it reads, it can read in full; anything it writes, it can write
 * anywhere. Treat every call site as security-relevant.
 *
 * The `server-only` import above is the enforcement mechanism: importing this
 * module from a Client Component fails the build instead of leaking the key at
 * runtime. Do not remove it.
 *
 * Legitimate use is narrow — a Server Action accepting a public form submission
 * into a table that grants the anon role no access at all, which is how prayer
 * requests and contact submissions are designed to work. If a request can be
 * satisfied by the session-scoped server client in `server.ts`, use that instead.
 *
 * Never use this client to work around a policy that is inconvenient. If a role
 * genuinely needs access, the policy is what should change.
 */
export function createSupabaseAdminClient() {
  const { NEXT_PUBLIC_SUPABASE_URL } = supabaseEnv()
  const { SUPABASE_SECRET_KEY } = supabaseSecretEnv()

  return createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: {
      // A privileged client has no user session and must never persist or refresh one.
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
