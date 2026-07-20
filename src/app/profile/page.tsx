import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TenzokNav from "@/components/TenzokNav";
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  // The signup trigger creates this row; a missing one means the database
  // migration hasn't run yet. Fail soft rather than crash.
  if (!profile) redirect("/login");

  const [{ data: projects }, { data: student }, { data: company }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("*")
        .eq("owner_id", user.id)
        .order("updated_at", { ascending: false })
        .returns<Project[]>(),
      profile.role === "student"
        ? supabase
            .from("student_profiles")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle<StudentProfile>()
        : Promise.resolve({ data: null }),
      profile.role === "company"
        ? supabase
            .from("company_profiles")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle<CompanyProfile>()
        : Promise.resolve({ data: null }),
    ]);

  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <TenzokNav />
      <ProfileDashboard
        profile={profile}
        projects={projects ?? []}
        student={student ?? null}
        company={company ?? null}
        lastLogin={user.last_sign_in_at ?? null}
      />
    </main>
  );
}
