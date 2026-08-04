import type { Metadata } from "next";
import { categorySlugToName, statsWork } from "@/lib/data";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { StatsBand } from "@/components/sections/StatsBand";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "From raw footage to real impact — explore a curated collection of video edits crafted for brands, creators, startups and businesses.",
  alternates: { canonical: "/our-work" },
};

export default async function OurWorkPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initialCategory = categorySlugToName(category) ?? "All Work";

  return (
    <>
      <WorkGrid initialCategory={initialCategory} className="pt-32 md:pt-36" />

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
