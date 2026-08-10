import "server-only";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = { id: string; email: string | null };

/*
 * Server-side authorization check. Returns the user only if they are signed in
 * AND their profiles.role = 'admin'. Used by admin Server Components to gate
 * access. Writes are additionally protected by RLS (is_admin()).
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || profile?.role !== "admin") return null;

  return { id: user.id, email: user.email ?? null };
}
