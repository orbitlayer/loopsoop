import type { Metadata } from "next";
import { site } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Loopsoop collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    h: "Information We Collect",
    p: "When you contact us or submit a project enquiry, we collect the details you provide — such as your name, email address, phone number, company and project description. We may also collect basic, anonymised analytics about how visitors use this website.",
  },
  {
    h: "How We Use Your Information",
    p: "We use your information solely to respond to your enquiry, deliver our editing services, communicate about your project, and improve our website. We do not sell your personal information.",
  },
  {
    h: "Sharing & Third Parties",
    p: "We only share information with trusted service providers that help us operate (for example, email delivery and hosting). These providers process data on our behalf and are bound by confidentiality obligations.",
  },
  {
    h: "Data Retention",
    p: "We keep enquiry and project information only for as long as necessary to provide our services and meet legal or business requirements, after which it is deleted or anonymised.",
  },
  {
    h: "Your Rights",
    p: `You can request access to, correction of, or deletion of your personal data at any time by emailing ${site.email}.`,
  },
];

export default function PrivacyPage() {
  return (
    <section className="pb-24 pt-32 md:pt-40">
      <Container className="max-w-3xl">
        <SectionLabel className="mb-4">Legal</SectionLabel>
        <h1 className="font-display text-4xl font-medium tracking-tight md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-muted">Last updated: August 2026</p>

        <p className="mt-8 text-muted">
          This policy explains how {site.name} handles the information you share
          with us. It is provided as a general template and should be reviewed by
          a qualified professional before publication.
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
          Questions about this policy? Contact us at{" "}
          <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
