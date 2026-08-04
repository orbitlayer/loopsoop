import type { Metadata } from "next";
import { statsWork } from "@/lib/data";
import { PageHero } from "@/components/sections/PageHero";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { StatsBand } from "@/components/sections/StatsBand";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "From raw footage to real impact — explore a curated collection of video edits crafted for brands, creators, startups and businesses.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        label="Our Work"
        title={
          <>
            Stories We&apos;ve
            <br />
            Brought to <span className="text-faint">Life.</span>
          </>
        }
        subtitle="From raw footage to real impact. Here's a look at some of the projects we've crafted."
        seed={24}
        play
      />

      <WorkGrid />

      <section className="py-16 md:py-20">
        <StatsBand stats={statsWork} />
      </section>

      <section className="pb-24">
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
