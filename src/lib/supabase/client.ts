import { createBrowserClient } from "@supabase/ssr";

/*
 * Browser Supabase client for the admin app (Client Components). It persists
 * the auth session in cookies so the server/proxy can read it. Uses only the
 * public anon key; all privileged actions are gated by RLS (is_admin()).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
