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

// "Company" renamed to "Explore" — these are the site's main pages.
const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Our Editing", href: "/our-editing" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const serviceLinks = [
  { label: "Documentary", href: "/our-work?category=documentary" },
  { label: "Commercial", href: "/our-work?category=commercial" },
  { label: "Corporate", href: "/our-work?category=corporate" },
  { label: "Social Media", href: "/our-work?category=social-media" },
  { label: "Educational", href: "/our-work?category=educational" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark mt-auto bg-dark text-white">
      <Container className="py-16 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-4">
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
          <nav aria-label="Explore" className="md:col-span-2">
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

          {/* Services */}
          <nav aria-label="Services" className="md:col-span-3">
            <h3 className="text-sm font-semibold text-white">Services</h3>
            <ul className="mt-5 space-y-3">
              {serviceLinks.map((item) => (
                <li key={item.label}>
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

          {/* Let's Work Together */}
          <div className="sm:col-span-2 md:col-span-3">
            <h3 className="text-sm font-semibold text-white">
              Let&apos;s Work Together
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-dark-muted">
              Have a project in mind? Let&apos;s create something amazing
              together.
            </p>
            <Button href="/contact" variant="invert" className="mt-6">
              Start Your Project
            </Button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start gap-3 border-t border-white/10 pt-7 text-xs text-dark-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Loopsoop. A Creative Division of {site.parent.name}. All
            Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href={site.parent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Visit {site.parent.name} →
            </a>
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
