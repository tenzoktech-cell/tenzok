import { SITE, url } from "./site";

/**
 * JSON-LD structured data.
 *
 * This is the highest-leverage SEO work on the site: it is what lets Google
 * render rich results (breadcrumbs, FAQ accordions, article cards) instead of a
 * plain blue link, and it is how the crawler learns what Tenzok *is* rather
 * than guessing from prose.
 *
 * Everything here must be TRUE and must match what is visible on the page.
 * Marking up content the user cannot see is a manual-action risk, not a shortcut.
 */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": url("/#organization"),
    name: SITE.name,
    url: SITE.url,
    logo: url("/icon.svg"),
    email: SITE.email,
    description: SITE.description,
    slogan: SITE.tagline,
    knowsAbout: [
      "Software engineering mentorship",
      "Final year projects",
      "Machine learning",
      "Deep learning",
      "Full-stack web development",
      "Data engineering",
      "Cloud and DevOps",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": url("/#website"),
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": url("/#organization") },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: url(crumb.path),
    })),
  };
}

export function serviceSchema(service: {
  name: string;
  description: string;
  slug: string;
  audience: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: url(`/services/${service.slug}`),
    provider: { "@id": url("/#organization") },
    audience: { "@type": "Audience", audienceType: service.audience },
    areaServed: "Worldwide",
  };
}

export function articleSchema(post: {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: url(`/blogs/${post.slug}`),
    mainEntityOfPage: url(`/blogs/${post.slug}`),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    keywords: post.tags.join(", "),
    image: url(`/blogs/${post.slug}/opengraph-image`),
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: { "@id": url("/#organization") },
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function itemListSchema(
  name: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: url(item.path),
    })),
  };
}

/** The 14 districts of Kerala, used for areaServed and visible on-page copy. */
export const KERALA_DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
] as const;

/**
 * Local presence for Kerala searches. Address is the team's real base
 * (Infopark, Kakkanad, Kochi). Only used on pages that show it visibly.
 */
export function localBusinessSchema(path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": url(`${path}#localbusiness`),
    name: SITE.name,
    url: url(path),
    email: SITE.email,
    description,
    parentOrganization: { "@id": url("/#organization") },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Infopark, Kakkanad",
      addressLocality: "Kochi",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "State", name: "Kerala" },
      ...KERALA_DISTRICTS.map((name) => ({ "@type": "AdministrativeArea", name })),
    ],
    knowsAbout: [
      "Final year projects",
      "KTU mini projects",
      "KTU main projects",
      "Computer science engineering projects",
      "Machine learning projects",
      "IoT and embedded projects",
    ],
  };
}
