/**
 * Tenzok products shown on the homepage.
 *
 * To add a product: drop a 1600×1000 screenshot in /public/products and add an
 * entry below. The homepage section picks it up automatically — order here is
 * the order on the page. Keep claims to what the product actually does.
 */

export interface Product {
  slug: string;
  name: string;
  /** Short label above the name, e.g. the industry or product type. */
  category: string;
  /** One line under the name. */
  tagline: string;
  /** Two or three sentences for the card. */
  description: string;
  /** Up to four concrete capabilities. */
  highlights: string[];
  url: string;
  /** Path under /public. 16:10 screenshot. */
  image: string;
  imageAlt: string;
  /** Short status chip, e.g. "Live demo" or "Live". */
  status: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: "safekeep",
    name: "Safekeep",
    category: "Self-storage platform · Kochi",
    tagline: "Book a secure storage unit in minutes.",
    description:
      "A booking platform for a self-storage business: customers see live unit availability, get an instant quote for exactly what they are storing, and book or track everything over WhatsApp.",
    highlights: [
      "Live unit availability map",
      "Instant size and price calculator",
      "WhatsApp-first booking and alerts",
      "Photo inventory and staff dashboard",
    ],
    url: "https://p1-safe-keep.vercel.app/",
    image: "/products/safekeep.jpg",
    imageAlt:
      "Safekeep homepage with a live floor map showing available storage units",
    status: "Live demo",
  },
];
