import type { NextConfig } from "next";

/**
 * Vercel auto-assigns tenzok.vercel.app and serves the full site from it — it
 * returns 200, not a redirect, and there is no dashboard switch to change that.
 * To Google that is a second, complete copy of the site: it splits ranking
 * signals between the two hosts and lets it pick the wrong one to show.
 *
 * Every page already emits a canonical tag pointing at www.tenzok.in, but a
 * canonical is only a hint, and a hint is contradicted by a host that happily
 * answers 200. This makes it a fact: the vercel.app host 308s to the real domain,
 * preserving the path, so nothing is lost and there is only one address.
 *
 * (The apex tenzok.in already 308s to www — Vercel handles that one itself.)
 */
const CANONICAL_HOST = "www.tenzok.in";
const VERCEL_HOST = "tenzok.vercel.app";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: VERCEL_HOST }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true, // 308 — cached by search engines
      },
    ];
  },
};

export default nextConfig;
