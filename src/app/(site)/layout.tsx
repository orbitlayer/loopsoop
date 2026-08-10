import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";

/* Public website chrome: nav, footer, floating WhatsApp button, skip link and
   reduced-motion provider. Wraps every public page; the admin app does not use
   this layout. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </MotionProvider>
  );
}
