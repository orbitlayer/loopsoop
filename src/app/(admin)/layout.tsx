import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  // The admin app must never be indexed or previewed publicly.
  robots: { index: false, follow: false, nocache: true },
};

// Render admin routes dynamically (never statically prerender/cache them) so a
// redeploy can't leave a cached page pointing at deleted CSS/JS chunk files.
export const dynamic = "force-dynamic";

/* Admin shell — layered near-black with a soft top glow. Self-contained, no
   public nav/footer. Rendered inside the minimal root <html>/<body>. */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#08080a] text-neutral-200 [color-scheme:dark]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(70%_55%_at_50%_-10%,rgba(255,255,255,0.06),transparent_70%)]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
