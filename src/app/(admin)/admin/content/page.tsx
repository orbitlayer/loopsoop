import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getFaqsForEdit } from "@/lib/content";
import { AdminShell } from "@/components/admin/AdminShell";
import { ContentClient } from "@/components/admin/ContentClient";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const faqs = await getFaqsForEdit();

  return (
    <AdminShell email={session.email} active="content">
      <ContentClient
        initialItems={faqs.draft}
        publishedItems={faqs.published}
        publishedAt={faqs.publishedAt}
        updatedAt={faqs.updatedAt}
        updatedBy={faqs.updatedBy}
      />
    </AdminShell>
  );
}
