export type UserRole = "student" | "company" | "freelancer" | "recruiter" | "admin";
export type Plan = "free" | "pro" | "enterprise";
export type AccountStatus = "active" | "suspended";
export type ProjectStatus = "draft" | "active" | "completed";

export interface Profile {
  id: string;
  email: string | null;
  username: string | null;
  full_name: string | null;
  designation: string | null;
  role: UserRole;
  avatar_url: string | null;
  cover_url: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  bio: string | null;
  skills: string[];
  website: string | null;
  linkedin: string | null;
  github: string | null;
  plan: Plan;
  plan_expires_at: string | null;
  status: AccountStatus;
  prefs: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  user_id: string;
  college: string | null;
  university: string | null;
  degree: string | null;
  department: string | null;
  semester: string | null;
  graduation_year: string | null;
  cgpa: string | null;
  resume_url: string | null;
}

export interface CompanyProfile {
  user_id: string;
  organization_name: string | null;
  industry: string | null;
  website: string | null;
  company_size: string | null;
  description: string | null;
  headquarters: string | null;
  contact_number: string | null;
  gst_number: string | null;
}

export interface Project {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface ChatContact {
  id: string;
  username: string | null;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

/** The label shown next to a role chip. */
export const ROLE_LABELS: Record<UserRole, string> = {
  student: "Student",
  company: "Company",
  freelancer: "Freelancer",
  recruiter: "Recruiter",
  admin: "Admin",
};
