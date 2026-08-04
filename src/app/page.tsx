import type { Metadata } from "next";
import {
  categories,
  projects,
  statsMain,
  stylesShort,
  trustedHome,
} from "@/lib/data";
import { cn } from "@/lib/cn";
import { Icon } from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { LogoRow } from "@/components/sections/LogoStrip";
import { StatsBand } from "@/components/sections/StatsBand";
import { CtaBand } from "@/components/sections/CtaBand";

const featured = projects.filter((p) => p.featured);

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="pb-14 pt-32 md:pt-40">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <Reveal>
                <SectionLabel className="mb-5">
                  Video Editing &amp; Production
                </SectionLabel>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="font-display text-5xl font-medium leading-[1.0] tracking-tight sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl">
                  Crafted Edits.
                  <br />
                  <span className="text-faint">Real Impact.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">
                  We turn raw footage into powerful stories that connect, engage
                  and deliver results.
                </p>
              </Reveal>
              <Reveal delay={0.18} className="mt-8">
                <ArrowLink href="/work">Explore Our Work</ArrowLink>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="group relative aspect-[16/11] overflow-hidden rounded-[20px]">
                <MediaPlaceholder seed={9} play playSize="lg" vignette />
                <div className="absolute bottom-5 right-6 text-right text-white">
                  <div className="font-display text-sm font-medium">
                    Showreel 2024
                  </div>
                  <div className="mt-1 flex items-center justify-end gap-2 text-xs text-white/70">
                    Watch Now <span className="h-px w-8 bg-white/50" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------- Trusted by */}
      <section className="border-y border-line py-8">
        <Container>
          <LogoRow brands={trustedHome} label="Trusted By" />
        </Container>
      </section>

      {/* -------------------------------------------------------- Categories */}
      <section className="py-20 md:py-28">
        <Container>
          <Reveal>
            <SectionLabel className="mb-4">Portfolio Categories</SectionLabel>
            <h2 className="font-display text-3xl font-medium leading-tight md:text-[2.6rem]">
              We Edit Everything <span className="text-faint">You Create.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c, i) => (
              <Reveal
                key={c.label}
                delay={i * 0.06}
                className={cn(
                  "flex flex-col items-center px-4 text-center",
                  "lg:border-l lg:border-line",
                  i === 0 && "lg:border-l-0",
                )}
              >
                <Icon name={c.icon} className="h-7 w-7 text-ink" strokeWidth={1.25} />
                <span className="mt-4 text-sm text-muted">{c.label}</span>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------- Featured projects */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading
            label="Our Work"
            title="Featured Projects"
            action={<ArrowLink href="/work">View All Projects</ArrowLink>}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------ Editing styles */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
            <Reveal>
              <SectionLabel className="mb-4">Editing Styles</SectionLabel>
              <h2 className="font-display text-3xl font-medium leading-[1.1] md:text-[2.6rem]">
                Different Styles.
                <br />
                <span className="text-faint">Same Quality.</span>
              </h2>
            </Reveal>

            <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-6">
              {stylesShort.map((name, i) => (
                <Reveal
                  key={name}
                  delay={i * 0.06}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <div className="aspect-square w-full max-w-[72px] overflow-hidden rounded-full border border-line/60">
                    <MediaPlaceholder seed={(i + 2) * 13} />
                  </div>
                  <span className="text-xs leading-tight text-muted">{name}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------------------- Stats */}
      <section className="py-4 md:py-6">
        <StatsBand stats={statsMain} />
      </section>

      {/* ----------------------------------------------------------------- CTA */}
      <section className="py-20 md:py-28">
        <CtaBand
          title="Have a project in mind?"
          subtitle="Let's create something amazing together."
          buttonLabel="Let's Work Together"
        />
      </section>
    </>
  );
}
