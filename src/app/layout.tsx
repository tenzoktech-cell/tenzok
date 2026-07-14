import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

// Variable fonts: no `weight` array needed — one woff2 covers every weight.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — We turn projects into careers`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${playfair.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-surface text-ink">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        {/* .reveal starts at opacity:0 until an IntersectionObserver fires, so
            without this the whole page is invisible to non-JS crawlers. */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </body>
    </html>
  );
}
