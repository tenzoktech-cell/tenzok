import { DOMAINS } from "./projects-data";
import { SERVICES } from "./services-data";

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

/** Primary nav. */
export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "About Us", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "services", label: "Our Services", href: "/services" },
  { id: "blogs", label: "Blogs", href: "/blogs" },
  { id: "feedbacks", label: "Feedbacks", href: "/feedbacks" },
];

/** Derived from the data, so the menu can never drift from the pages. */
export const SERVICES_MENU = SERVICES.map((service) => ({
  id: service.slug,
  label: service.name,
  icon: service.icon,
}));

export const PROJECTS_MENU = DOMAINS.map((domain) => ({
  id: domain.slug,
  label: domain.name,
  icon: domain.icon,
}));

/** Still a holding page. Labelled "Soon" in the footer so it never surprises
 *  anyone who clicks it expecting testimonials. */
export const FOOTER_COMING_SOON: NavItem[] = [
  { id: "feedbacks", label: "Feedbacks", href: "/feedbacks" },
];
