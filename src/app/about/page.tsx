import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { process, statsMain, team, values } from "@/lib/data";
import { Icon, InstagramIcon, LinkedinIcon } from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { LoopMark } from "@/components/ui/Logo";
import { PageHero } from "@/components/sections/PageHero";
import { StatsBand } from "@/components/sections/StatsBand";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "About",
  description:
    "Loopsoop transforms raw footage into cinematic, engaging and high-performing content. Meet the team and the philosophy behind the edits.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About Loopsoop"
        title={
          <>
            We Edit Videos.
            <br />
            You Tell Stories.
            <br />
            We <span className="text-faint">Elevate</span> Them.
          </>
        }
        subtitle="At Loopsoop, we believe great editing isn't just about cutting clips — it's about creating emotion, building connection and leaving a lasting impact."
        action={<Button href="/contact">Let&apos;s Work Together</Button>}
        seed={28}
      />

      {/* Stats */}
      <section className="pb-6">
        <StatsBand stats={statsMain} />
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Reveal>
                <SectionLabel className="mb-4">Our Mission</SectionLabel>
                <h2 className="font-display text-3xl font-medium leading-[1.1] md:text-[2.6rem]">
                  Empowering Creators{" "}
                  <span className="text-faint">Through Exceptional Editing.</span>
                </h2>
                <p className="mt-6 max-w-md text-muted">
                  We partner with creators, brands and businesses to turn raw
                  footage into content that performs. Our goal is simple: make
                  every second count.
                </p>
              </Reveal>

              <div className="mt-10 space-y-7">
                {values.map((v, i) => (
                  <Reveal key={v.title} delay={i * 0.08} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                      <Icon name={v.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-ink">
                        {v.title}
                      </h3>
                      <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted">
                        {v.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Collage */}
            <Reveal delay={0.1}>
              <div className="grid h-full grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <div className="aspect-[4/3] overflow-hidden rounded-[18px]">
                    <MediaPlaceholder seed={13} />
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-[18px]">
                    <MediaPlaceholder seed={2} />
                    <span className="absolute inset-0 flex items-center justify-center text-white">
                      <LoopMark className="h-10 w-auto" />
                    </span>
                  </div>
                  <div className="aspect-[4/3] overflow-hidden rounded-[18px]">
                    <MediaPlaceholder seed={47} />
                  </div>
                </div>
                <div className="overflow-hidden rounded-[18px]">
                  <MediaPlaceholder seed={61} className="min-h-full" />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section id="process" className="scroll-mt-24 py-16 md:py-20">
        <Container>
          <Reveal className="text-center">
            <SectionLabel className="mb-4">Our Process</SectionLabel>
            <h2 className="font-display text-3xl font-medium md:text-[2.6rem]">
              Simple. Collaborative. <span className="text-faint">Effective.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {process.map((step, i) => (
              <Reveal
                key={step.n}
                delay={i * 0.07}
                className="flex flex-col rounded-[18px] border border-line bg-surface p-6"
              >
                <Icon name={step.icon} className="h-6 w-6 text-ink" strokeWidth={1.25} />
                <div className="mt-6 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[0.65rem] font-semibold text-white">
                    {step.n}
                  </span>
                  <h3 className="text-base font-semibold text-ink">{step.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-12 md:py-16">
        <Container>
          <Reveal className="on-dark overflow-hidden rounded-[24px] bg-dark px-6 py-14 md:px-10 md:py-16">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionLabel onDark className="mb-4">
                  Meet The Team
                </SectionLabel>
                <h2 className="font-display text-3xl font-medium text-white md:text-[2.4rem]">
                  The People Behind The Edits.
                </h2>
              </div>
              <p className="max-w-xs text-sm text-dark-muted">
                A team of passionate editors, storytellers and creatives who live
                and breathe video.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
              {team.map((m, i) => (
                <Reveal key={m.name} delay={i * 0.08}>
                  <div className="group relative aspect-[3/4] overflow-hidden rounded-[18px] bg-dark-surface">
                    <MediaPlaceholder
                      seed={m.seed}
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="text-sm font-semibold text-white">
                        {m.name}
                      </h3>
                      <p className="text-xs text-white/60">{m.role}</p>
                      <div className="mt-3 flex items-center gap-2 text-white/60">
                        <Link href="#" aria-label={`${m.name} on LinkedIn`} className="hover:text-white">
                          <LinkedinIcon className="h-4 w-4" />
                        </Link>
                        <Link href="#" aria-label={`${m.name} on Instagram`} className="hover:text-white">
                          <InstagramIcon className="h-4 w-4" />
                        </Link>
                        <Link href="#" aria-label={`Email ${m.name}`} className="hover:text-white">
                          <Mail className="h-4 w-4" strokeWidth={1.5} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <CtaBand
          dark
          label="Let's Create Impact Together"
          title={
            <>
              Your Story Deserves{" "}
              <span className="text-dark-faint">To Be Extraordinary.</span>
            </>
          }
          aside={
            <p className="max-w-sm text-base text-dark-muted md:text-right">
              Have a project in mind? Let&apos;s collaborate and create something
              amazing together.
            </p>
          }
          buttonLabel="Let's Work Together"
        />
      </section>
    </>
  );
}
