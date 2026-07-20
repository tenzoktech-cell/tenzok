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
