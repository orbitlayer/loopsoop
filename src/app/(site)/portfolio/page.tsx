import type { Metadata } from "next";
import { categorySlugToName, statsWork } from "@/lib/data";
import { getPortfolioProjects } from "@/lib/portfolio";
import { resolvePageMetadata } from "@/lib/content";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { StatsBand } from "@/components/sections/StatsBand";
import { CtaBand } from "@/components/sections/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("portfolio");
}

// Always render fresh so videos added/edited in the admin panel appear
// immediately with no redeploy.
export const dynamic = "force-dynamic";

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initialCategory = categorySlugToName(category) ?? "All Work";
  const { projects, error } = await getPortfolioProjects();

  return (
    <>
      <WorkGrid
        initialCategory={initialCategory}
        className="pt-32 md:pt-36"
        projects={projects}
        loadError={error}
      />

      <section className="py-16 md:py-20">
        <StatsBand stats={statsWork} />
      </section>

      <section className="py-20 md:py-28">
        <CtaBand
          title="Let's Create Something Amazing Together."
          aside={
            <p className="max-w-sm text-base text-muted md:text-right">
              Have a project in mind? Let&apos;s bring your vision to life with
              edits that leave a lasting impact.
            </p>
          }
          buttonLabel="Let's Work Together"
        />
      </section>
    </>
  );
}
