"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/utils/supabase/client";

/** Redirect an existing session after the login form has rendered immediately. */
export default function LoginSessionRedirect() {
  const router = useRouter();
  const { user, status } = useAuth();

  useEffect(() => {
    if (status !== "signed-in" || !user) return;

    let cancelled = false;
    void createClient()
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (cancelled) return;
        router.replace(data?.role === "admin" ? "/admin" : "/profile");
      });

    return () => {
      cancelled = true;
    };
  }, [router, status, user]);

  return null;
}