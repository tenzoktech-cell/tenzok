import type { MetadataRoute } from "next";
import { DOMAINS } from "@/components/projects-data";
import { SERVICES } from "@/components/services-data";
import { SITE } from "@/lib/site";

/** Derived from the data, so it can never drift from the pages that exist.
 *  /blogs and /feedbacks are deliberately omitted until they have content. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/projects",
    "/services",
    "/contact",
    ...DOMAINS.map((d) => `/projects/${d.slug}`),
    ...SERVICES.map((s) => `/services/${s.slug}`),
  ];

  return routes.map((route) => ({
    url: `${SITE.url}${route}`,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
