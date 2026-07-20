"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";

export type ActionState = { error?: string; notice?: string } | null;

/** Every action starts here: a client + the verified caller, or an error. */
async function requireUser() {
  if (!isSupabaseConfigured)
    return { ok: false as const, fail: { error: "Accounts aren't configured yet." } };
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { ok: false as const, fail: { error: "You're signed out — log in again." } };
  return { ok: true as const, supabase, user };
}

const str = (formData: FormData, key: string, max = 300) =>
  String(formData.get(key) ?? "")
    .trim()
    .slice(0, max);

export async function updateProfile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireUser();
  if (!ctx.ok) return ctx.fail;

  const full_name = str(formData, "full_name", 120);
  if (!full_name) return { error: "Name can't be empty." };

  const skills = str(formData, "skills", 500)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30);

  const { error } = await ctx.supabase
    .from("profiles")
    .update({
      full_name,
      username: str(formData, "username", 40) || null,
      phone: str(formData, "phone", 30) || null,
      country: str(formData, "country", 80) || null,
      city: str(formData, "city", 80) || null,
      bio: str(formData, "bio", 1000) || null,
      website: str(formData, "website") || null,
      linkedin: str(formData, "linkedin") || null,
      github: str(formData, "github") || null,
      skills,
    })
    .eq("id", ctx.user.id);

  if (error) return { error: error.message };
  revalidatePath("/profile");
  return { notice: "Profile saved." };
}

export async function updateStudentDetails(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireUser();
  if (!ctx.ok) return ctx.fail;

  const { error } = await ctx.supabase.from("student_profiles").upsert({
    user_id: ctx.user.id,
    college: str(formData, "college", 160) || null,
    university: str(formData, "university", 160) || null,
    degree: str(formData, "degree", 120) || null,
    department: str(formData, "department", 120) || null,
    semester: str(formData, "semester", 40) || null,
    graduation_year: str(formData, "graduation_year", 10) || null,
    cgpa: str(formData, "cgpa", 10) || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/profile");
  return { notice: "Academic details saved." };
}

export async function updateCompanyDetails(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireUser();
  if (!ctx.ok) return ctx.fail;

  const { error } = await ctx.supabase.from("company_profiles").upsert({
    user_id: ctx.user.id,
    organization_name: str(formData, "organization_name", 160) || null,
    industry: str(formData, "industry", 120) || null,
    website: str(formData, "website") || null,
    company_size: str(formData, "company_size", 40) || null,
    description: str(formData, "description", 1500) || null,
    headquarters: str(formData, "headquarters", 160) || null,
    contact_number: str(formData, "contact_number", 30) || null,
    gst_number: str(formData, "gst_number", 30) || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/profile");
  return { notice: "Organization details saved." };
}

export async function saveProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireUser();
  if (!ctx.ok) return ctx.fail;

  const title = str(formData, "title", 160);
  if (!title) return { error: "Give the project a name." };

  const status = str(formData, "status", 20);
  if (!["draft", "active", "completed"].includes(status))
    return { error: "Pick a valid status." };

  const id = str(formData, "id", 60);
  const row = {
    title,
    description: str(formData, "description", 2000) || null,
    status,
  };

  const { error } = id
    ? await ctx.supabase.from("projects").update(row).eq("id", id).eq("owner_id", ctx.user.id)
    : await ctx.supabase.from("projects").insert({ ...row, owner_id: ctx.user.id });

  if (error) return { error: error.message };
  revalidatePath("/profile");
  return { notice: id ? "Project updated." : "Project created." };
}

export async function deleteProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireUser();
  if (!ctx.ok) return ctx.fail;

  const id = str(formData, "id", 60);
  if (!id) return { error: "Missing project id." };

  const { error } = await ctx.supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("owner_id", ctx.user.id);

  if (error) return { error: error.message };
  revalidatePath("/profile");
  return { notice: "Project deleted." };
}

export async function changePassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireUser();
  if (!ctx.ok) return ctx.fail;

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 6) return { error: "Password needs at least 6 characters." };
  if (password !== confirm) return { error: "Passwords don't match." };

  const { error } = await ctx.supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { notice: "Password changed." };
}

export async function savePrefs(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireUser();
  if (!ctx.ok) return ctx.fail;

  const prefs = {
    email_notifications: formData.get("email_notifications") === "on",
    chat_notifications: formData.get("chat_notifications") === "on",
    profile_public: formData.get("profile_public") === "on",
  };

  const { error } = await ctx.supabase
    .from("profiles")
    .update({ prefs })
    .eq("id", ctx.user.id);

  if (error) return { error: error.message };
  revalidatePath("/profile");
  return { notice: "Preferences saved." };
}
