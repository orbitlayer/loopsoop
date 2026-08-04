import Link from "next/link";
import { Mail } from "lucide-react";
import { footerColumns, site } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import {
  DiscordIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/lib/icons";

const socialLinks = [
  { label: "Instagram", href: site.socials.instagram, Icon: InstagramIcon },
  { label: "YouTube", href: site.socials.youtube, Icon: YoutubeIcon },
  { label: "LinkedIn", href: site.socials.linkedin, Icon: LinkedinIcon },
  { label: "Discord", href: site.socials.discord, Icon: DiscordIcon },
  { label: "Email", href: `mailto:${site.email}`, Icon: Mail },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark mt-auto bg-dark text-white">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Logo onDark />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-dark-muted">
              We edit videos.
              <br />
              You tell stories.
              <br />
              We elevate them.
            </p>
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-dark-muted transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CTA */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">
              Let&apos;s Work Together
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-dark-muted">
              Have a project in mind? Let&apos;s create something amazing together.
            </p>
            <Button href="/contact" variant="invert" className="mt-5">
              Start Your Project
            </Button>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-7 text-xs text-dark-muted sm:flex-row sm:items-center">
          <p>© {year} LOOPSOOP. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
