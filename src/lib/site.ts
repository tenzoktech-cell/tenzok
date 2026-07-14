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
  email: "tenzok.tech@gmail.com",
  description:
    "Tenzok builds real software with students and for companies — mini and major projects across full-stack, AI, ML, deep learning and data engineering, plus mentorship and end-to-end product delivery.",
} as const;

/** Absolute URL for a route. Used for canonicals, OG tags, sitemap and JSON-LD. */
export function url(path = "/") {
  return new URL(path, SITE.url).toString();
}

export function mailto(subject: string) {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;
}
