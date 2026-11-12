import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import LazyChatWidget from "@/components/chat/LazyChatWidget";
import MobileCtaBar from "@/components/MobileCtaBar";
import TenzokNav from "@/components/TenzokNav";
import { ToastProvider } from "@/components/ui/Toast";
import { SITE } from "@/lib/site";
import "./globals.css";

// Headings, body and labels use system fonts (see globals.css).
// Brand wordmark only: one weight keeps the extra download tiny.
const brand = Space_Grotesk({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-brand-face",
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
      data-scroll-behavior="auto"
      className={`${brand.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-surface text-ink">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <AuthProvider>
          <ToastProvider>
            <TenzokNav />
            {children}
            <MobileCtaBar />
            {/* Floating messenger; renders nothing while signed out. */}
            <LazyChatWidget />
          </ToastProvider>
        </AuthProvider>
        {/* .reveal starts at opacity:0 until an IntersectionObserver fires, so
            without this the whole page is invisible to non-JS crawlers. */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </body>
    </html>
  );
}
