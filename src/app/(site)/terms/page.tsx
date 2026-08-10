import type { Metadata } from "next";
import { site } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of the Loopsoop website and services.",
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    h: "Services",
    p: "Loopsoop provides video editing and post-production services. The specific scope, deliverables, timelines and revisions for each engagement are agreed in writing before work begins.",
  },
  {
    h: "Client Responsibilities",
    p: "You are responsible for providing the raw footage, assets and information needed to complete your project, and for confirming that you hold the necessary rights to any material you supply.",
  },
  {
    h: "Revisions & Delivery",
    p: "Each project includes an agreed number of revision rounds. Final files are delivered once the project is approved. Additional work beyond the agreed scope may be quoted separately.",
  },
  {
    h: "Intellectual Property",
    p: "Upon full payment, you receive the rights to the final delivered edit for the agreed use. Loopsoop may showcase completed work in its portfolio unless otherwise agreed in writing.",
  },
  {
    h: "Limitation of Liability",
    p: "Our services are provided on a best-effort basis. To the extent permitted by law, Loopsoop is not liable for indirect or consequential losses arising from the use of our services or this website.",
  },
];

export default function TermsPage() {
  return (
    <section className="pb-24 pt-32 md:pt-40">
      <Container className="max-w-3xl">
        <SectionLabel className="mb-4">Legal</SectionLabel>
        <h1 className="font-display text-4xl font-medium tracking-tight md:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-muted">Last updated: August 2026</p>

        <p className="mt-8 text-muted">
          These terms govern your use of the {site.name} website and services.
          They are provided as a general template and should be reviewed by a
          qualified professional before publication.
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-xl font-medium text-ink">{s.h}</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.p}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 border-t border-line pt-8 text-sm text-muted">
          Questions about these terms? Contact us at{" "}
          <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
