/** Single source of truth for contact details and the production origin. */
export const SITE = {
  name: "Tenzok",
  tagline: "Obsession · Purpose · Excellence",
  /** Update this once the production domain is live — it drives OG tags and the sitemap. */
  url: "https://tenzok.tech",
  email: "tenzok.tech@gmail.com",
  description:
    "Tenzok builds real software with students and for companies — mini and major projects across full-stack, AI, ML, deep learning and data engineering, plus mentorship and end-to-end product delivery.",
} as const;

export function mailto(subject: string) {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;
}
