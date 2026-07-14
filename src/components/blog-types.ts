/** A block of article body. Plain data, so posts stay type-checked and
 *  searchable — no MDX toolchain, no runtime markdown parser. */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "callout"; tone: "note" | "warn"; text: string }
  | { type: "quote"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  /** One sentence, shown on the index card. */
  excerpt: string;
  /** Meta description. 140–158 chars. */
  description: string;
  /** Real search phrases, used for the keywords meta and to steer the copy. */
  keywords: string[];
  /** ISO date. */
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  tags: string[];
  body: Block[];
  /** Becomes FAQPage structured data — Google can render these directly in results. */
  faq: { q: string; a: string }[];
}
