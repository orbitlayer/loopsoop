import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";

/* Shared inner-page hero: label + large headline + copy on the left,
   a large edge-bleeding cinematic image on the right (lg+). */
export function PageHero({
  label,
  title,
  subtitle,
  action,
  extra,
  seed = 24,
  play = false,
}: {
  label: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  action?: React.ReactNode;
  extra?: React.ReactNode;
  seed?: number;
  play?: boolean;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-32 md:pb-20 md:pt-40 lg:min-h-[600px]">
      {/* Edge-bleed image (desktop) */}
      <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[48%] lg:block">
        <MediaPlaceholder seed={seed} play={play} playSize="lg" className="group h-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/25 to-transparent" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-xl">
          <Reveal>
            <SectionLabel className="mb-5">{label}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-display text-[2.75rem] font-medium leading-[1.02] tracking-tight sm:text-6xl">
              {title}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">
              {subtitle}
            </p>
          </Reveal>
          {action && (
            <Reveal delay={0.18} className="mt-8">
              {action}
            </Reveal>
          )}
          {extra && (
            <Reveal delay={0.24} className="mt-8">
              {extra}
            </Reveal>
          )}
        </div>

        {/* Contained image (mobile / tablet) */}
        <Reveal delay={0.1} className="mt-10 lg:hidden">
          <div className="relative aspect-[16/11] overflow-hidden rounded-[20px]">
            <MediaPlaceholder seed={seed} play={play} playSize="md" className="group" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
