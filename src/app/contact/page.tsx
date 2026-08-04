import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { site, trustedClients } from "@/lib/data";
import { Icon, DiscordIcon } from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button, ArrowLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { PageHero } from "@/components/sections/PageHero";
import { LogoMarquee } from "@/components/sections/LogoStrip";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Have a project in mind? Tell Loopsoop about your vision and we'll handle the editing from concept to final delivery. We usually respond within 24 hours.",
  alternates: { canonical: "/contact" },
};

const contactItems = [
  {
    icon: "mail",
    title: "Email",
    value: site.email,
    sub: "We reply within 24 hours",
    href: `mailto:${site.email}`,
  },
  {
    icon: "phone",
    title: "Phone / WhatsApp",
    value: site.phone,
    sub: site.hours,
    href: `tel:${site.phoneHref}`,
  },
  {
    icon: "discord",
    title: "Discord",
    value: site.discord,
    sub: "For quick conversations",
    href: site.discordHref,
  },
  {
    icon: "map-pin",
    title: "Location",
    value: site.location,
    sub: "Working with clients worldwide",
  },
];

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
        subtitle="Have a project in mind? We'd love to hear about it. Tell us your vision and we'll take care of the rest."
        action={<Button href="#form">Start Your Project</Button>}
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
              We usually respond within{" "}
              <span className="font-medium text-ink">24 hours.</span>
            </p>
          </div>
        }
        seed={34}
      />

      {/* Form + direct contact */}
      <section id="form" className="scroll-mt-24 py-8 md:py-12">
        <Container>
          <Reveal className="on-dark overflow-hidden rounded-[24px] bg-dark px-6 py-10 md:px-12 md:py-14">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left — form */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Icon name="mail" className="h-4 w-4 text-dark-muted" />
                  <SectionLabel onDark>Send Us A Message</SectionLabel>
                </div>
                <h2 className="mb-8 font-display text-2xl font-medium text-white md:text-3xl">
                  Fill out the form and we&apos;ll{" "}
                  <span className="text-dark-faint">get back to you.</span>
                </h2>
                <ContactForm />
              </div>

              {/* Right — direct */}
              <div className="lg:border-l lg:border-white/10 lg:pl-16">
                <SectionLabel onDark className="mb-4">
                  Let&apos;s Talk
                </SectionLabel>
                <h2 className="mb-8 font-display text-2xl font-medium text-white md:text-3xl">
                  Or reach us directly.
                </h2>

                <ul className="space-y-6">
                  {contactItems.map((item) => {
                    const inner = (
                      <>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white">
                          {item.icon === "discord" ? (
                            <DiscordIcon className="h-5 w-5" />
                          ) : (
                            <Icon name={item.icon} className="h-5 w-5" />
                          )}
                        </span>
                        <span>
                          <span className="block text-sm font-medium text-white">
                            {item.title}
                          </span>
                          <span className="block text-sm text-white/85">
                            {item.value}
                          </span>
                          <span className="block text-xs text-dark-muted">
                            {item.sub}
                          </span>
                        </span>
                      </>
                    );
                    return (
                      <li key={item.title}>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="flex items-start gap-4 transition-opacity hover:opacity-80"
                          >
                            {inner}
                          </a>
                        ) : (
                          <div className="flex items-start gap-4">{inner}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Prefer a quick call?
                    </p>
                    <p className="text-sm text-dark-muted">
                      Book a free call with our team.
                    </p>
                  </div>
                  <a
                    href={site.discordHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-ink"
                  >
                    <Calendar className="h-4 w-4" /> Book a Call
                  </a>
                </div>
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
                <ArrowLink href={`mailto:${site.email}`}>
                  See more questions
                </ArrowLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
