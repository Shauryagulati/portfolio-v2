import { site } from "~/content/site";

/** Standard meta block: title, description, canonical, OG, twitter card. */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
}) {
  const url = `${site.url}${opts.path}`;
  return [
    { title: opts.title },
    { name: "description", content: opts.description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:title", content: opts.title },
    { property: "og:description", content: opts.description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: site.name },
    { property: "og:image", content: `${site.url}/og.png` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: opts.title },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: `${site.url}/og.png` },
  ];
}

/** Person schema — the entity signal for name searches. */
export const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${site.url}/#person`,
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: site.role,
  description: site.intro,
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: site.school,
  },
  sameAs: [site.github, site.linkedin],
});
