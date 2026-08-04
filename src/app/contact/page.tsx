import type { Metadata } from "next";
import {
  projectTypes,
  site,
  trustedClients,
  whatsappUrl,
  WHATSAPP_DEFAULT_MESSAGE,
} from "@/lib/data";
import { WhatsappIcon } from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PageHero } from "@/components/sections/PageHero";
import { LogoMarquee } from "@/components/sections/LogoStrip";
import { FaqAccordion } from "@/components/sections/FaqAccordion";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Have a project in mind? Message Loopsoop on WhatsApp and get a tailored quote, usually within a few hours.",
  alternates: { canonical: "/contact" },
};

const quickStart = projectTypes.filter((t) => t !== "Other");

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Contact Us"
        title={
          <>
            Let&apos;s Create Something{" "}
            <span className="text-faint">Extraordinary.</span>
          </>
        }
        subtitle="Have a project in mind? Message us on WhatsApp — tell us your vision and we'll send over a tailored quote, fast."
        action={<WhatsAppButton message={WHATSAPP_DEFAULT_MESSAGE} />}
        extra={
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[15, 41, 66].map((s) => (
                <span
                  key={s}
                  className="h-8 w-8 overflow-hidden rounded-full border-2 border-bg"
                >
                  <MediaPlaceholder seed={s} />
                </span>
              ))}
            </div>
            <p className="text-sm text-muted">
              We usually reply within{" "}
              <span className="font-medium text-ink">a few hours.</span>
            </p>
          </div>
        }
        seed={34}
      />

      {/* WhatsApp — the only contact / quote channel */}
      <section id="whatsapp" className="scroll-mt-24 py-8 md:py-12">
        <Container>
          <Reveal className="on-dark overflow-hidden rounded-[24px] bg-dark px-6 py-14 text-center md:px-12 md:py-16">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-white">
              <WhatsappIcon className="h-8 w-8" />
            </span>
            <h2 className="mt-6 font-display text-3xl font-medium text-white md:text-4xl">
              Get a quote on WhatsApp
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-dark-muted">
              Skip the forms. Send us your project details — length, style and
              deadline — and we&apos;ll reply with a tailored quote, usually
              within a few hours.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
              <WhatsAppButton
                variant="invert"
                className="px-8 py-4 text-base"
              />
              <a
                href={`tel:${site.phoneHref}`}
                className="text-sm text-dark-muted transition-colors hover:text-white"
              >
                {site.phone}
              </a>
              <span className="text-xs text-dark-faint">{site.hours}</span>
            </div>

            {/* Quick-start: prefill a quote message by service */}
            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="text-xs uppercase tracking-[0.2em] text-dark-muted">
                Or start with a service
              </p>
              <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2">
                {quickStart.map((t) => (
                  <a
                    key={t}
                    href={whatsappUrl(
                      `Hi LOOPSOOP! I'd like a quote for a ${t} edit.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white hover:text-white"
                  >
                    {t}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Trusted */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="rounded-[24px] border border-line bg-surface px-6 py-10">
            <p className="eyebrow mb-8 text-center">
              Trusted by creators &amp; brands worldwide
            </p>
            <LogoMarquee brands={trustedClients} />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 py-16 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <SectionLabel className="mb-4">FAQ</SectionLabel>
              <h2 className="font-display text-3xl font-medium leading-[1.1] md:text-[2.6rem]">
                Quick Answers To Common{" "}
                <span className="text-faint">Questions.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <FaqAccordion />
              <div className="mt-8">
                <ArrowLink
                  href={whatsappUrl("Hi LOOPSOOP! I have a few questions.")}
                >
                  Still have questions? Ask on WhatsApp
                </ArrowLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
