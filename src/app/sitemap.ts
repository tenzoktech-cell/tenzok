import type { MetadataRoute } from "next";
import { POSTS } from "@/components/blog-posts";
import { DOMAINS } from "@/components/projects-data";
import { SERVICES } from "@/components/services-data";
import { url } from "@/lib/site";

/** Derived from the data, so it can never drift from the pages that exist.
 *  /feedbacks is deliberately omitted until it has content — submitting an
 *  empty holding page to Google is a thin-content signal, not a win. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), priority: 1, changeFrequency: "monthly" },
    { url: url("/projects"), priority: 0.9, changeFrequency: "monthly" },
    { url: url("/services"), priority: 0.9, changeFrequency: "monthly" },
    { url: url("/blogs"), priority: 0.8, changeFrequency: "weekly" },
    { url: url("/contact"), priority: 0.7, changeFrequency: "yearly" },
  ];

  const domains: MetadataRoute.Sitemap = DOMAINS.map((domain) => ({
    url: url(`/projects/${domain.slug}`),
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const services: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: url(`/services/${service.slug}`),
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const posts: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: url(`/blogs/${post.slug}`),
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    priority: 0.7,
    changeFrequency: "yearly",
  }));

  return [...pages, ...domains, ...services, ...posts];
}
