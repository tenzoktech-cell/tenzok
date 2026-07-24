import type { Metadata } from "next";

/** Single source of truth for contact details and the production origin. */
export const SITE = {
  name: "Tenzok",
  tagline: "Obsession · Purpose · Excellence",
  /**
   * The canonical origin. The site is also reachable at tenzok.vercel.app, so
   * every page emits a canonical tag pointing here — otherwise Google treats the
   * two hosts as duplicates and splits the ranking between them.
   */
  url: "https://www.tenzok.in",
  email: "info@tenzok.in",
  description:
    "Tenzok designs and engineers websites, web apps, mobile products, AI solutions, automation, and production-minded student projects—from first scope to launch and complete handover.",
} as const;

/** Absolute URL for a route. Used for canonicals, OG tags, sitemap and JSON-LD. */
export function url(path = "/") {
  return new URL(path, SITE.url).toString();
}

/** Complete social metadata for pages that override the root Open Graph object. */
export function socialMetadata({
  title,
  description,
  path,
  imagePath = "/opengraph-image",
}: {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
}) {
  const image = {
    url: url(imagePath),
    width: 1200,
    height: 630,
    alt: title,
  };

  return {
    openGraph: {
      type: "website" as const,
      siteName: SITE.name,
      locale: "en_US",
      title,
      description,
      url: url(path),
      images: [image],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [image],
    },
  } satisfies Pick<Metadata, "openGraph" | "twitter">;
}

export function mailto(subject: string) {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;
}
