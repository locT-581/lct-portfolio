import { getSiteUrl } from "@/lib/seo";

export function PersonWebsiteJsonLd() {
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        "name": "Loc Tran",
        "jobTitle": "Full Stack Engineer & Software Architect",
        "url": siteUrl,
        "sameAs": ["https://github.com/locT-581"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Loc Tran - Portfolio",
        "publisher": {
          "@id": `${siteUrl}/#person`,
        },
        "inLanguage": ["en", "vi"],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
