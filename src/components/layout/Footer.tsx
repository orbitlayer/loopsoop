import Link from "next/link";
import { Mail } from "lucide-react";
import { site } from "@/lib/data";
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

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Our Editing", href: "/our-editing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark mt-auto bg-dark text-white">
      <Container className="py-16 md:py-20">
        {/* CTA */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.2em] text-dark-muted">
              Let&apos;s Work Together
            </span>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-medium leading-[1.1] md:text-[2.5rem]">
              Let&apos;s create something extraordinary.
            </h2>
          </div>
          <Button href="/contact" variant="invert" className="shrink-0">
            Start Your Project
          </Button>
        </div>

        {/* Columns */}
        <div className="flex flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div>
            <Logo onDark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-dark-muted">
              We edit videos. You tell stories. We elevate them.
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

          {/* Explore */}
          <nav aria-label="Footer" className="md:text-right">
            <h3 className="text-sm font-semibold text-white">Explore</h3>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-dark-muted transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start gap-3 border-t border-white/10 pt-7 text-xs text-dark-muted sm:flex-row sm:items-center sm:justify-between">
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
