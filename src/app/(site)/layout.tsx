import { AnimatedNav } from "@/components/layout/AnimatedNav";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { MaintenanceScreen } from "@/components/MaintenanceScreen";
import { StructuredData } from "@/components/StructuredData";
import { getSiteControls } from "@/lib/settings";
import { getSiteInfo } from "@/lib/content";
import { whatsappLink } from "@/lib/data";
import { getSession } from "@/lib/auth";

/* Public website chrome: nav, footer, floating WhatsApp button, skip link and
   reduced-motion provider. Wraps every public page; the admin app does not use
   this layout.

   Rendered per-request (force-dynamic) so the admin Control switches
   (Maintenance Mode / kill switches) take effect immediately and are never
   pinned by the CDN's static cache. Reads are fail-safe: if the settings table
   is missing, every switch defaults to OFF and the site behaves normally. */
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const controls = await getSiteControls();
  // Only bother resolving the admin session while maintenance is on.
  const isAdmin = controls.maintenance ? Boolean(await getSession()) : false;

  // Maintenance mode: visitors see the maintenance screen; a signed-in admin
  // still sees the real site (to preview) with a persistent banner. The admin
  // panel lives in a different route group and is never affected by this.
  if (controls.maintenance && !isAdmin) {
    return <MaintenanceScreen message={controls.maintenanceMessage} />;
  }

  const info = await getSiteInfo();

  return (
    <MotionProvider>
      <StructuredData info={info} />
      {controls.maintenance && isAdmin && (
        <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1.5 text-center text-xs font-medium text-black shadow-lg shadow-black/20">
          Maintenance mode is ON - only you can see the site
        </div>
      )}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <AnimatedNav />
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
      {!controls.killContact && (
        <WhatsAppFloat href={whatsappLink(info.whatsapp)} />
      )}
    </MotionProvider>
  );
}
