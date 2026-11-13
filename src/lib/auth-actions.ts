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

/** Translate Supabase's raw auth errors into plain language. */
const friendly = (message: string) => {
  if (/fetch failed/i.test(message))
    return "We couldn't reach the accounts server. Please try again in a few minutes — or email info@tenzok.in.";
  if (/email not confirmed/i.test(message))
    return "Please confirm your email first — open the link we sent when you signed up, then log in.";
  if (/invalid login credentials/i.test(message))
    return "That email and password don't match. Check both and try again.";
  if (/rate limit|too many/i.test(message))
    return "Too many attempts. Please wait a minute and try again.";
  return message;
};

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
    .select("role, status")
    .eq("id", user.id)
    .single();

  // The admin panel can suspend an account; honour it at sign-in.
  if (profile?.status === "suspended") {
    await supabase.auth.signOut();
    return {
      error: "This account is suspended. Email info@tenzok.in if you think this is a mistake.",
    };
  }

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
    return { error: "Fill in your name, role, email, password and country." };
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

  // With email confirmation on, Supabase hides an existing account by returning
  // a user with no identities instead of an error. Say so plainly.
  if (data.user && data.user.identities?.length === 0) {
    return { error: "An account with this email already exists. Log in instead." };
  }

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
