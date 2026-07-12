import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tenzok — Obsession · Purpose · Excellence",
  description:
    "Tenzok is a global project and training studio: end-to-end project execution, industry-ready mentorship, and launch support for students and companies worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
