import type { Metadata } from "next";
import {
  projectTypes,
  trustedClients,
  whatsappLink,
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
import { ContactForm } from "@/components/sections/ContactForm";
import { PageStructuredData } from "@/components/PageStructuredData";
import { getSiteControls } from "@/lib/settings";
import {
  getFaqs,
  getFaqsForEdit,
  getContactCopy,
  getContactCopyForEdit,
  getSiteInfo,
  getSiteDetailsForEdit,
  resolvePageMetadata,
} from "@/lib/content";
import { getSession } from "@/lib/auth";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("contact");
}

const quickStart = projectTypes.filter((t) => t !== "Other");

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  // Kill switch: when the public contact channel is disabled, show a calm
  // "paused" notice instead of the WhatsApp CTAs.
  const { killContact } = await getSiteControls();
  if (killContact) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
        <Container>
          <SectionLabel className="justify-center">Contact</SectionLabel>
          <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.02em] md:text-[2.6rem]">
            We&apos;re not taking new inquiries{" "}
            <span className="text-faint">right now.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
            We&apos;ve paused new project inquiries temporarily. Please check
            back soon - we&apos;d love to hear from you.
          </p>
        </Container>
      </section>
    );
  }

  // Contact copy + FAQs come from the CMS (published), with an admin-only
  // draft preview via ?preview=1.
  const { preview } = await searchParams;
  const isPreview = preview === "1" && Boolean(await getSession());
  const copy = isPreview
    ? (await getContactCopyForEdit()).draft
    : await getContactCopy();
  const faqs = isPreview ? (await getFaqsForEdit()).draft : await getFaqs();
  const info = isPreview
    ? (await getSiteDetailsForEdit()).draft
    : await getSiteInfo();

  return (
    <>
      <PageStructuredData
        type="ContactPage"
        name="Contact Us"
        description="Have a project in mind? Message Loopsoop on WhatsApp and get a tailored quote, usually within a few hours."
        path="/contact"
        crumbs={[
          { name: "Home", path: "" },
          { name: "Contact Us", path: "/contact" },
        ]}
      />
      {isPreview && (
        <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1.5 text-center text-xs font-medium text-black shadow-lg shadow-black/20">
          Preview - showing unpublished draft content
        </div>
      )}
      <PageHero
        centered
        label="Contact Us"
        title={
          <>
            Let&apos;s Create Something{" "}
            <span className="text-faint">Extraordinary.</span>
          </>
        }
        subtitle={copy.heroSubtitle}
        action={
          <WhatsAppButton
            message={WHATSAPP_DEFAULT_MESSAGE}
            href={whatsappLink(info.whatsapp, WHATSAPP_DEFAULT_MESSAGE)}
          />
        }
        extra={
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[
                "/about/top-left.webp",
                "/about/middle-left.webp",
                "/about/bottom-left.webp",
              ].map((src) => (
                <span
                  key={src}
                  className="h-8 w-8 overflow-hidden rounded-full border-2 border-bg"
                >
                  <MediaPlaceholder src={src} alt="" />
                </span>
              ))}
            </div>
            <p className="text-sm text-muted">
              We usually reply within{" "}
              <span className="font-medium text-ink">a few hours.</span>
            </p>
          </div>
        }
      />

      {/* WhatsApp — the only contact / quote channel */}
      <section id="whatsapp" className="scroll-mt-24 py-8 md:py-12">
        <Container>
          <Reveal className="on-dark overflow-hidden rounded-[24px] bg-dark px-6 py-14 text-center md:px-12 md:py-16">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-white">
              <WhatsappIcon className="h-8 w-8" />
            </span>
            <h2 className="mt-6 font-display text-3xl font-medium text-white md:text-4xl">
              {copy.quoteHeading}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-dark-muted">
              {copy.quoteBody}
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
              <WhatsAppButton
                variant="invert"
                className="px-8 py-4 text-base"
                href={whatsappLink(info.whatsapp)}
              />
              <a
                href={`tel:${info.phoneHref}`}
                className="text-sm text-dark-muted transition-colors hover:text-white"
              >
                {info.phone}
              </a>
              <span className="text-xs text-dark-faint">{info.hours}</span>
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
                    href={whatsappLink(
                      info.whatsapp,
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

      {/* Contact form — stored inquiry (alternative to WhatsApp) */}
      <section id="message" className="scroll-mt-24 py-8 md:py-12">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <SectionLabel className="justify-center">Or send a message</SectionLabel>
              <h2 className="mt-3 font-display text-3xl font-medium md:text-4xl">
                Prefer a form?{" "}
                <span className="text-faint">Write to us.</span>
              </h2>
            </div>
            <ContactForm projectTypes={quickStart} />
          </div>
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
              <FaqAccordion faqs={faqs} />
              <div className="mt-8">
                <ArrowLink
                  href={whatsappLink(
                    info.whatsapp,
                    "Hi LOOPSOOP! I have a few questions.",
                  )}
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
