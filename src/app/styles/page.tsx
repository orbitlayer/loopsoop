import type { Metadata } from "next";
import { Check } from "lucide-react";
import { styleIncludes, styles } from "@/lib/data";
import { cn } from "@/lib/cn";
import { Icon } from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button, ArrowLink } from "@/components/ui/Button";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Editing Styles",
  description:
    "Every story is different. Explore Loopsoop's editing styles — cinematic, dynamic, minimal, emotional, modern and documentary — tailored to your audience and brand.",
};

const checklist = [
  "Free consultation",
  "Style recommendation",
  "Custom approach for your brand",
];

export default function StylesPage() {
  return (
    <>
      <PageHero
        label="Editing Styles"
        title={
          <>
            Edit. Elevate.
            <br />
            Tell Stories <span className="text-faint">Your Way.</span>
          </>
        }
        subtitle="Every story is different. That's why we offer multiple editing styles to match your vision, audience and purpose."
        action={<Button href="/contact">Let&apos;s Work Together</Button>}
        seed={38}
      />

      {/* Styles grid */}
      <section className="py-16 md:py-20">
        <Container>
          <Reveal className="mb-14 text-center">
            <h2 className="font-display text-2xl font-medium md:text-3xl">
              Find the <span className="font-semibold">perfect style</span> for
              your next project.
            </h2>
            <span className="mx-auto mt-5 block h-px w-14 bg-ink/30" />
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {styles.map((s, i) => (
              <Reveal key={s.name} delay={(i % 3) * 0.08}>
                <article className="group relative aspect-[4/5] overflow-hidden rounded-[24px] border border-line/50 bg-dark">
                  <MediaPlaceholder
                    seed={s.seed}
                    className="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <span className="absolute left-6 top-6 font-display text-sm text-white/60">
                    {s.n}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-2xl font-medium text-white">
                      {s.name}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/70">
                      {s.description}
                    </p>
                    <div className="mt-5">
                      <ArrowLink href="/work" onDark>
                        View Example
                      </ArrowLink>
                    </div>
                  </div>
                </article>
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
              What You Get With <span className="text-dark-faint">Every Style</span>
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-y-10 md:grid-cols-5">
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
      <section className="py-16 md:py-24">
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
