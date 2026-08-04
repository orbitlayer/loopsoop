import Link from "next/link";
import { Mail } from "lucide-react";
import { site } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
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

const footerNav = [
  { label: "Home", href: "/" },
  { label: "Our Editing", href: "/our-editing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark mt-auto bg-dark text-white">
      <Container className="py-14 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div>
            <Logo onDark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-dark-muted">
              We edit videos. You tell stories. We elevate them.
            </p>
            <div className="mt-6 flex items-center gap-3">
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

          {/* Nav */}
          <nav
            aria-label="Footer"
            className="flex flex-col gap-3 text-sm md:items-end"
          >
            {footerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-dark-muted transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start gap-3 border-t border-white/10 pt-7 text-xs text-dark-muted sm:flex-row sm:items-center sm:justify-between">
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
