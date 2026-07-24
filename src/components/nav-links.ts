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
  { id: "services", label: "Services", href: "/services" },
  { id: "projects", label: "Student Projects", href: "/projects" },
  { id: "blogs", label: "Blog", href: "/blogs" },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
];

/** Derived from the data, so the menu can never drift from the pages. */
export const SERVICES_MENU = SERVICES.map((service) => ({
  id: service.slug,
  label: service.name,
  icon: service.icon,
}));

export const PROJECTS_MENU = DOMAINS.map((domain) => ({
  id: domain.slug,
  // Full names like "Power Electronics, EV & Energy Systems" do not fit a menu
  // column and get cut to an ellipsis. The pages still use the full name.
  label: domain.shortName ?? domain.name,
  icon: domain.icon,
}));

