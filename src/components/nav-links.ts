import {
  Building2,
  Code2,
  GraduationCap,
  Megaphone,
  Rocket,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "about-us", label: "About Us" },
  { id: "our-services", label: "Our Services" },
  { id: "feedbacks", label: "Feedbacks" },
  { id: "blogs", label: "Blogs" },
];

export interface ServiceMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

/** Items shown in the "Our Services" dropdown. */
export const SERVICES_MENU: ServiceMenuItem[] = [
  { id: "mentorship", label: "Mentorship", icon: GraduationCap },
  { id: "student-projects", label: "Student Projects", icon: Code2 },
  { id: "company-services", label: "Company Services", icon: Building2 },
  { id: "digital-marketing", label: "Digital Marketing", icon: Megaphone },
  { id: "launch-support", label: "Launch Support", icon: Rocket },
];
