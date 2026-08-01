"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isValidPhoneNumber } from "libphonenumber-js/min";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";

export type AuthState = { error?: string; notice?: string } | null;

const NOT_CONFIGURED: AuthState = {
  error:
    "Accounts aren't live just yet — we're finishing setup. Email info@tenzok.in and we'll onboard you personally.",
};

/** Network failures surface as a bare "fetch failed" — translate it. */
const friendly = (message: string) =>
  /fetch failed/i.test(message)
    ? "We couldn't reach the accounts server. Please try again in a few minutes — or email info@tenzok.in."
    : message;

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = createClient(await cookies());
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: friendly(error.message) };
  if (!user) return { error: "We couldn't start your session. Please try again." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  revalidatePath("/", "layout");
  redirect(profile?.role === "admin" ? "/admin" : "/profile");
}

const DESIGNATIONS = ["Student", "Company"];

export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const name = String(formData.get("name") ?? "").trim();
  const designation = String(formData.get("designation") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password || !designation || !country)
    return { error: "Fill in every field." };
  if (!DESIGNATIONS.includes(designation))
    return { error: "Choose whether you're a student or a company." };
  if (phone && !isValidPhoneNumber(phone)) {
    return { error: "Enter a valid mobile number." };
  }
  if (password.length < 6) return { error: "Password needs at least 6 characters." };

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // Lands in auth.users.raw_user_meta_data; the on_auth_user_created trigger
    // (supabase/profiles.sql) copies it into public.profiles.
    options: {
      data: { full_name: name, designation, phone, country, address },
    },
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
  redirect("/profile");
}
