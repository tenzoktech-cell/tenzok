"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";
import type { ActionState } from "./profile-actions";

/** Admin-only actions. RLS enforces the same rule server-side — this guard
 *  just gives a clean error instead of a policy violation. */
async function requireAdmin() {
  if (!isSupabaseConfigured)
    return { ok: false as const, fail: { error: "Not configured." } };
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, fail: { error: "Signed out." } };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin")
    return { ok: false as const, fail: { error: "Admin access required." } };

  return { ok: true as const, supabase, user };
}

const ROLES = ["student", "company", "freelancer", "recruiter", "admin"];
const STATUSES = ["active", "suspended"];
const PROJECT_STATUSES = ["draft", "active", "completed"];
const ENQUIRY_STATUSES = ["new", "reviewing", "contacted", "qualified", "closed"];

export async function adminUpdateUser(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx.ok) return ctx.fail;

  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id) return { error: "Missing user id." };
  if (id === ctx.user.id)
    return { error: "You can't change your own role or status here." };
  if (!ROLES.includes(role) || !STATUSES.includes(status))
    return { error: "Invalid role or status." };

  const { error } = await ctx.supabase
    .from("profiles")
    .update({ role, status })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { notice: "User updated." };
}

export async function adminDeleteProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx.ok) return ctx.fail;

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing project id." };

  const { error } = await ctx.supabase.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { notice: "Project deleted." };
}

export async function adminDeleteMessage(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx.ok) return ctx.fail;

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing message id." };

  const { error } = await ctx.supabase.from("messages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { notice: "Message deleted." };
}

export async function adminCreateProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx.ok) return ctx.fail;

  const ownerId = String(formData.get("owner_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "draft");
  if (!ownerId || !title) return { error: "Choose a user and enter a project title." };
  if (title.length > 140 || description.length > 3000 || !PROJECT_STATUSES.includes(status)) {
    return { error: "Check the project details and try again." };
  }

  const { error } = await ctx.supabase.from("projects").insert({
    owner_id: ownerId,
    title,
    description: description || null,
    status,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/profile");
  return { notice: "Project assigned to the workspace." };
}

export async function adminUpdateEnquiry(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx.ok) return ctx.fail;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const adminNote = String(formData.get("admin_note") ?? "").trim();
  if (!id || !ENQUIRY_STATUSES.includes(status)) return { error: "Invalid enquiry update." };
  if (adminNote.length > 2000) return { error: "Internal note is too long." };

  const { error } = await ctx.supabase
    .from("enquiries")
    .update({ status, admin_note: adminNote || null })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { notice: "Enquiry updated." };
}

export async function adminCreateProjectUpdate(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx.ok) return ctx.fail;

  const projectId = String(formData.get("project_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!projectId || !body) return { error: "Choose a project and write an update." };
  if (body.length > 3000) return { error: "Project update is too long." };

  const { error } = await ctx.supabase
    .from("project_updates")
    .insert({ project_id: projectId, body, created_by: ctx.user.id });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/profile");
  return { notice: "Project update published." };
}

export async function adminAddProjectFile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx.ok) return ctx.fail;

  const projectId = String(formData.get("project_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (!projectId || !name || !url) return { error: "Add a project, file name, and link." };
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error();
  } catch {
    return { error: "Use a valid http(s) file link." };
  }

  const { error } = await ctx.supabase
    .from("project_files")
    .insert({ project_id: projectId, name, url, created_by: ctx.user.id });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/profile");
  return { notice: "File link added to the project." };
}
const FINANCE_KINDS = ["income", "expense"];
const FINANCE_CATEGORIES = ["student_project", "webinar", "client", "product", "other"];

/** Validates a finance form; returns the row to write or an error message. */
function readFinanceForm(formData: FormData) {
  const kind = String(formData.get("kind") ?? "");
  const category = String(formData.get("category") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim();
  const entryDate = String(formData.get("entry_date") ?? "");
  const amount = Number(String(formData.get("amount") ?? "").replace(/,/g, ""));

  if (!FINANCE_KINDS.includes(kind)) return { error: "Choose money in or money out." };
  if (!FINANCE_CATEGORIES.includes(category)) return { error: "Choose a category." };
  if (!title || title.length > 140) return { error: "Add a short title (up to 140 characters)." };
  if (details.length > 2000) return { error: "Details can be up to 2000 characters." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entryDate) || Number.isNaN(Date.parse(entryDate)))
    return { error: "Choose a valid date." };
  if (!Number.isFinite(amount) || amount <= 0 || amount >= 1e10)
    return { error: "Enter an amount greater than zero." };

  return {
    row: {
      kind,
      category,
      title,
      details: details || null,
      entry_date: entryDate,
      amount: Math.round(amount * 100) / 100,
    },
  };
}

export async function adminCreateFinanceEntry(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx.ok) return ctx.fail;

  const parsed = readFinanceForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await ctx.supabase
    .from("finance_entries")
    .insert({ ...parsed.row, created_by: ctx.user.id });
  if (error) return { error: error.message };
  revalidatePath("/admin/finance");
  return { notice: "Entry saved." };
}

export async function adminUpdateFinanceEntry(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx.ok) return ctx.fail;

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing entry id." };
  const parsed = readFinanceForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await ctx.supabase
    .from("finance_entries")
    .update(parsed.row)
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/finance");
  return { notice: "Entry updated." };
}

export async function adminDeleteFinanceEntry(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx.ok) return ctx.fail;

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing entry id." };

  const { error } = await ctx.supabase.from("finance_entries").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/finance");
  return { notice: "Entry deleted." };
}
