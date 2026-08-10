import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/admin/DashboardClient";
import type { AdminCategory } from "@/components/admin/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Real authorization: signed-in AND profiles.role = 'admin'.
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");

  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id,name,slug")
    .order("sort_order", { ascending: true });

  return (
    <DashboardClient
      categories={(categories ?? []) as AdminCategory[]}
      adminEmail={admin.email}
    />
  );
}
