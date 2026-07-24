import type { Metadata } from "next";
import { Inter, Manrope, Space_Grotesk } from "next/font/google";
import ChatWidget from "@/components/chat/ChatWidget";
import { ToastProvider } from "@/components/ui/Toast";
import { SITE } from "@/lib/site";
import "./globals.css";

// Variable fonts: no `weight` array needed — one woff2 covers every weight.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Software Products, AI Solutions & Student Projects`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  // Root OG stays generic. Pages that override this nested object use
  // socialMetadata(), because Next replaces nested metadata instead of merging it.
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
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
      className={`${inter.variable} ${manrope.variable} ${spaceGrotesk.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-surface text-ink">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ToastProvider>
          {children}
          {/* Floating messenger; renders nothing while signed out. */}
          <ChatWidget />
        </ToastProvider>
        {/* .reveal starts at opacity:0 until an IntersectionObserver fires, so
            without this the whole page is invisible to non-JS crawlers. */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </body>
    </html>
  );
}
