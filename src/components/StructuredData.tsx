import { site } from "@/lib/data";

/*
 * Site-wide JSON-LD structured data (Organization + WebSite), server-rendered
 * into the initial HTML per the seo-schema guidance (JSON-LD preferred, absolute
 * URLs, only truthful data). Rendered by the public (site) layout so it appears
 * on every public page. Helps Google/AI understand the brand entity.
 */
export function StructuredData() {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      logo: `${site.url}/loopmark.png`,
      description: site.description,
      email: site.email,
      sameAs: Object.values(site.socials),
      contactPoint: {
        "@type": "ContactPoint",
        telephone: site.phoneHref,
        email: site.email,
        contactType: "customer service",
        areaServed: "Worldwide",
        availableLanguage: ["English"],
      },
      parentOrganization: {
        "@type": "Organization",
        name: site.parent.name,
        url: site.parent.url,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      url: site.url,
      inLanguage: "en",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ];

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
