import { createClient } from "@supabase/supabase-js";

/*
 * Stateless anonymous Supabase client for PUBLIC, read-only queries
 * (server or client). It carries no session — Row Level Security limits it to
 * published (`is_active = true`) portfolio items. Never used for writes.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/** True when Supabase env vars are configured. */
export const hasSupabaseEnv = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
