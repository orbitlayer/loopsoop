import type { Metadata } from "next";
import { Check, ChevronDown } from "lucide-react";
import { editingCategories, styleIncludes } from "@/lib/data";
import { resolvePageMetadata } from "@/lib/content";
import { cn } from "@/lib/cn";
import { Icon } from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { CategoryCard } from "@/components/sections/CategoryCard";
import { CtaBand } from "@/components/sections/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("our-work");
}

// Served fresh on every request so category renames / image swaps show
// immediately instead of being pinned by the CDN's long static cache.
export const dynamic = "force-dynamic";

const checklist = [
  "Free consultation",
  "Style recommendation",
  "Custom approach for your brand",
];

export default function OurWorkPage() {
  return (
    <>
      <PageHero
        centered
        label="Our Work"
        title={
          <>
            Edit. Elevate.
            <br />
            Tell Stories <span className="text-faint">Your Way.</span>
          </>
        }
        subtitle="Premium Video Editing and Graphic Design, crafted for your brand. Pick a style to explore the work - each one opens the matching projects in our portfolio."
        action={<Button href="/contact">Let&apos;s Work Together</Button>}
        extra={
          <a
            href="#work"
            className="group flex flex-col items-center gap-2 text-faint transition-colors hover:text-ink"
          >
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em]">
              Scroll to explore the work
            </span>
            <ChevronDown
              className="h-4 w-4 motion-safe:animate-bounce"
              strokeWidth={1.5}
              aria-hidden
            />
          </a>
        }
      />

      {/* Category grid — each card deep-links into the filtered portfolio */}
      <section id="work" className="scroll-mt-24 py-16 md:py-20">
        <Container>
          <Reveal className="mb-14 text-center">
            <h2 className="font-display text-3xl font-medium md:text-[2.6rem]">
              Find the right <span className="text-faint">edit for your project.</span>
            </h2>
            <span className="mx-auto mt-5 block h-px w-14 bg-ink/30" />
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {editingCategories.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 3) * 0.08}>
                <CategoryCard category={c} index={i} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* What you get */}
      <section className="py-12 md:py-16">
        <Container>
          <Reveal className="on-dark overflow-hidden rounded-[24px] bg-dark px-6 py-14 md:px-10">
            <h2 className="text-center font-display text-2xl font-medium text-white md:text-3xl">
              What You Get With <span className="text-dark-faint">Every Edit</span>
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-y-10 sm:grid-cols-3 md:grid-cols-5">
              {styleIncludes.map((f, i) => (
                <Reveal
                  key={f.title}
                  delay={i * 0.07}
                  className={cn(
                    "flex flex-col items-center px-4 text-center",
                    "md:border-l md:border-white/10",
                    i === 0 && "md:border-l-0",
                  )}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                    <Icon name={f.icon} className="h-5 w-5 text-white" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-dark-muted">
                    {f.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <CtaBand
          title={
            <>
              Not Sure Which Style
              <br className="hidden sm:block" /> Fits{" "}
              <span className="text-faint">Your Project?</span>
            </>
          }
          subtitle="Tell us about your idea and we'll recommend the best editing style for your story."
          aside={
            <ul className="space-y-3">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-ink">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-ink/20">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          }
          buttonLabel="Let's Work Together"
        />
      </section>
    </>
  );
}
