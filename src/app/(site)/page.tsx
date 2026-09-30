import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  categories,
  processSteps,
  statsMain,
  stylesShort,
  trustedHome,
} from "@/lib/data";
import { getFeaturedProjects } from "@/lib/portfolio";
import { getVisibleCategories } from "@/lib/categories";
import { getFaqs, resolvePageMetadata } from "@/lib/content";
import { cn } from "@/lib/cn";
import { Icon } from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button, ArrowLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ParentBadge } from "@/components/ui/ParentBadge";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { HeroAurora } from "@/components/ui/HeroAurora";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { LogoRow } from "@/components/sections/LogoStrip";
import { StatsBand } from "@/components/sections/StatsBand";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBand } from "@/components/sections/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("home");
}

// Always fresh so featured items managed in the admin panel appear immediately.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedProjects();
  const faqs = await getFaqs();
  const visibleCategories = await getVisibleCategories();

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden pb-16 pt-32 md:pb-20 md:pt-44">
        <HeroAurora />
        <Container className="relative z-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Reveal immediate>
              <ParentBadge className="mb-6" />
            </Reveal>
            <Reveal immediate delay={0.04}>
              <SectionLabel className="mb-5">
                Video Editing &amp; Graphic Design
              </SectionLabel>
            </Reveal>
            <Reveal immediate delay={0.08}>
              <h1 className="font-display text-5xl font-medium leading-[1.0] tracking-tight sm:text-6xl md:text-7xl">
                Crafted Edits.
                <br />
                <span className="text-faint">Real Impact.</span>
              </h1>
            </Reveal>
            <Reveal immediate delay={0.14}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                Professional Video Editing &amp; Graphic Design for Creators,
                Brands &amp; Businesses.
              </p>
            </Reveal>
            <Reveal immediate delay={0.18} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
              <Button href="/our-work">Explore Our Work</Button>
              <ArrowLink href="/contact">Start your project</ArrowLink>
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
            action={<ArrowLink href="/portfolio">View All Projects</ArrowLink>}
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

      {/* ------------------------------------------------------------ Services */}
      <section className="py-20 md:py-28">
        <Container>
          <Reveal className="max-w-2xl">
            <SectionLabel className="mb-4">What We Do</SectionLabel>
            <h2 className="font-display text-3xl font-medium leading-tight md:text-[2.6rem]">
              Editing services built <span className="text-faint">around your story.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              From documentaries to motion graphics, we craft every format your
              brand needs. Explore the work behind each.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {visibleCategories.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 2) * 0.06}>
                <Link
                  href={`/portfolio?category=${c.slug}`}
                  className="group flex h-full items-start justify-between gap-5 rounded-[20px] border border-line bg-surface p-6 transition-colors hover:border-ink/20 md:p-7"
                >
                  <div>
                    <h3 className="font-display text-lg font-medium text-ink md:text-xl">
                      {c.name}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                      {c.description}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="mt-1 h-5 w-5 shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </Link>
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
              {stylesShort.map((style, i) => (
                <Reveal
                  key={style.name}
                  delay={i * 0.06}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <div className="relative aspect-square w-full max-w-[72px] overflow-hidden rounded-full border border-line/60">
                    <MediaPlaceholder seed={(i + 2) * 13} />
                    <span className="absolute inset-0 flex items-center justify-center text-white">
                      <Icon name={style.icon} className="h-6 w-6" strokeWidth={1.5} />
                    </span>
                  </div>
                  <span className="text-xs leading-tight text-muted">
                    {style.name}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* -------------------------------------------------------- How it works */}
      <section className="py-20 md:py-28">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionLabel className="mb-4">How It Works</SectionLabel>
            <h2 className="font-display text-3xl font-medium leading-tight md:text-[2.6rem]">
              From Brief to <span className="text-faint">Final Cut.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              A simple, transparent process that keeps you in the loop from the
              first conversation to the final export.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <Reveal
                key={step.n}
                delay={(i % 5) * 0.07}
                className="group flex flex-col items-center px-4 text-center"
              >
                <span
                  aria-hidden
                  className="select-none font-display text-5xl font-semibold leading-none text-ink/[0.08]"
                >
                  {step.n}
                </span>
                <span className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-surface text-ink transition-colors group-hover:border-ink/25">
                  <Icon name={step.icon} className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 text-base font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------------------- Stats */}
      <section className="py-4 md:py-6">
        <StatsBand stats={statsMain} />
      </section>

      {/* -------------------------------------------------------- Testimonials */}
      <Testimonials />

      {/* ----------------------------------------------------------------- FAQ */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <SectionLabel className="mb-4">FAQ</SectionLabel>
              <h2 className="font-display text-3xl font-medium leading-[1.1] md:text-[2.6rem]">
                Quick Answers To Common{" "}
                <span className="text-faint">Questions.</span>
              </h2>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-muted">
                Everything you need to know before we start. Still curious?{" "}
                <Link href="/contact" className="text-ink underline-offset-4 hover:underline">
                  Get in touch.
                </Link>
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <FaqAccordion faqs={faqs} />
            </Reveal>
          </div>
        </Container>
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
