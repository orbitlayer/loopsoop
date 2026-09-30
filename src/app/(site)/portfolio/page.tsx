import type { Metadata } from "next";
import { categorySlugToName, statsWork } from "@/lib/data";
import { getPortfolioProjects } from "@/lib/portfolio";
import { getVisibleCategoryNames } from "@/lib/categories";
import { resolvePageMetadata } from "@/lib/content";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { StatsBand } from "@/components/sections/StatsBand";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageStructuredData } from "@/components/PageStructuredData";

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
  const filters = ["All Work", ...(await getVisibleCategoryNames())];

  return (
    <>
      <PageStructuredData
        name="Video Editing Portfolio"
        description="From raw footage to real impact - explore Loopsoop's portfolio of long-form and short-form video edits crafted for brands, creators, startups and businesses."
        path="/portfolio"
        crumbs={[
          { name: "Home", path: "" },
          { name: "Our Work", path: "/our-work" },
          { name: "Portfolio", path: "/portfolio" },
        ]}
      />
      <WorkGrid
        initialCategory={initialCategory}
        className="pt-32 md:pt-36"
        projects={projects}
        loadError={error}
        heading="Video Editing Portfolio"
        intro="From raw footage to real impact - explore Loopsoop's portfolio of long-form and short-form video edits crafted for brands, creators, startups and businesses."
        filters={filters}
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
