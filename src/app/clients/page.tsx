import type { Metadata } from "next";
import { statsMain, trustedClients } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { LogoMarquee } from "@/components/sections/LogoStrip";
import { Testimonials } from "@/components/sections/Testimonials";
import { StatsBand } from "@/components/sections/StatsBand";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Past Clients",
  description:
    "We've partnered with creators, startups, brands and businesses to produce videos that drive attention, engagement and results. See our client work and testimonials.",
  alternates: { canonical: "/clients" },
};

export default function ClientsPage() {
  return (
    <>
      <PageHero
        label="Past Clients"
        title={
          <>
            Stories We&apos;ve Created.{" "}
            <span className="text-faint">Impact We&apos;ve Delivered.</span>
          </>
        }
        subtitle="We've had the privilege of working with amazing creators, brands and businesses across the globe. Here are some of them."
        action={<Button href="/contact">Let&apos;s Work Together</Button>}
        seed={30}
      />

      {/* Trusted brands */}
      <section className="border-y border-line py-12">
        <Container>
          <p className="eyebrow mb-9 text-center">
            Trusted by creators &amp; brands worldwide
          </p>
          <LogoMarquee brands={trustedClients} />
        </Container>
      </section>

      <Testimonials />

      {/* Results */}
      <section className="pb-4 md:pb-8">
        <StatsBand stats={statsMain} />
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <CtaBand
          label="Let's Create Impact Together"
          title={
            <>
              Your Next Story{" "}
              <span className="text-faint">Starts Here.</span>
            </>
          }
          aside={
            <p className="max-w-sm text-base text-muted md:text-right">
              Have a project in mind? Let&apos;s create something amazing
              together.
            </p>
          }
          buttonLabel="Let's Work Together"
        />
      </section>
    </>
  );
}
