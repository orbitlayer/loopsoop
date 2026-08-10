import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  // The admin app must never be indexed or previewed publicly.
  robots: { index: false, follow: false, nocache: true },
};

/* Admin shell — dark, self-contained, no public nav/footer. Rendered inside the
   minimal root <html>/<body>; the wrapper covers the body background. */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-neutral-100 [color-scheme:dark]">
      {children}
    </div>
  );
}
