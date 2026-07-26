import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type {
  CompanyProfile,
  Profile,
  Project,
  StudentProfile,
} from "@/lib/db-types";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";
import ProfileDashboard from "./ProfileDashboard";

export const metadata: Metadata = {
  title: "Your profile",
  description: "Your Tenzok dashboard.",
  robots: { index: false },
};

export default async function ProfilePage() {
  if (!isSupabaseConfigured) redirect("/login");

  const supabase = createClient(await cookies());
  const { data: authData } = await supabase.auth.getClaims();
  const userId = authData?.claims.sub;
  if (!userId) redirect("/login");

  const [
    { data: profile },
    { data: projects },
    { data: student },
    { data: company },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single<Profile>(),
    supabase
      .from("projects")
      .select("*")
      .eq("owner_id", userId)
      .order("updated_at", { ascending: false })
      .returns<Project[]>(),
    supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle<StudentProfile>(),
    supabase
      .from("company_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle<CompanyProfile>(),
  ]);

  // The signup trigger creates this row; a missing one means the database
  // migration hasn't run yet. Fail soft rather than crash.
  if (!profile) redirect("/login");

  const authMethods = Array.isArray(authData?.claims.amr)
    ? authData.claims.amr
    : [];
  const lastAuthTimestamp = authMethods.reduce(
    (latest, method) =>
      typeof method === "object" &&
      method !== null &&
      typeof method.timestamp === "number"
        ? Math.max(latest, method.timestamp)
        : latest,
    0,
  );
  const lastLogin = lastAuthTimestamp
    ? new Date(lastAuthTimestamp * 1000).toISOString()
    : null;

  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <ProfileDashboard
        profile={profile}
        projects={projects ?? []}
        student={profile.role === "student" ? (student ?? null) : null}
        company={profile.role === "company" ? (company ?? null) : null}
        lastLogin={lastLogin}
      />
    </main>
  );
}
