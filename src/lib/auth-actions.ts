"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";

export type AuthState = { error?: string; notice?: string } | null;

const NOT_CONFIGURED: AuthState = {
  error:
    "Accounts aren't live just yet — we're finishing setup. Email hello@tenzok.com and we'll onboard you personally.",
};

/** Network failures surface as a bare "fetch failed" — translate it. */
const friendly = (message: string) =>
  /fetch failed/i.test(message)
    ? "We couldn't reach the accounts server. Please try again in a few minutes — or email hello@tenzok.com."
    : message;

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: friendly(error.message) };

  revalidatePath("/", "layout");
  redirect("/");
}

const DESIGNATIONS = ["Student", "Company"];

export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const name = String(formData.get("name") ?? "").trim();
  const designation = String(formData.get("designation") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password || !designation || !country || !address)
    return { error: "Fill in every field." };
  if (!DESIGNATIONS.includes(designation))
    return { error: "Choose whether you're a student or a company." };
  if (password.length < 6) return { error: "Password needs at least 6 characters." };

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // Lands in auth.users.raw_user_meta_data; the on_auth_user_created trigger
    // (supabase/profiles.sql) copies it into public.profiles.
    options: { data: { full_name: name, designation, country, address } },
  });
  if (error) return { error: friendly(error.message) };

  // No session means email confirmation is on — the account isn't live yet.
  if (!data.session) {
    return {
      notice:
        "Almost there — we've emailed you a confirmation link. Click it to finish creating your account.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
