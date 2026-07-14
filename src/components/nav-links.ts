import { DOMAINS } from "./projects-data";
import { SERVICES } from "./services-data";

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

/** Primary nav. Every entry points at a page with real content on it. */
export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "services", label: "Services", href: "/services" },
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

/** Kept out of the primary nav until they have content — an empty page in the
 *  nav reads as an abandoned site, and Feedbacks is exactly where a buyer
 *  goes to check that you are real. */
export const FOOTER_COMING_SOON: NavItem[] = [
  { id: "feedbacks", label: "Feedbacks", href: "/feedbacks" },
  { id: "blogs", label: "Blogs", href: "/blogs" },
];
