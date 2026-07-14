import { POSTS } from "@/components/blog-posts";
import { SITE, url } from "@/lib/site";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = [...POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const items = posts
    .map((post) =>
      [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url(`/blogs/${post.slug}`)}</link>`,
        `      <guid isPermaLink="true">${url(`/blogs/${post.slug}`)}</guid>`,
        `      <description>${escapeXml(post.description)}</description>`,
        `      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`,
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        "    </item>",
      ].join("\n"),
    )
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(SITE.name)} Blog</title>`,
    `    <link>${url("/blogs")}</link>`,
    `    <description>${escapeXml(SITE.description)}</description>`,
    "    <language>en</language>",
    `    <atom:link href="${url("/blogs/rss.xml")}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
