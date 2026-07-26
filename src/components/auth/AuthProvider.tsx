"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { isSupabaseConfigured } from "@/utils/supabase/config";

type AuthStatus = "loading" | "signed-in" | "signed-out";

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Keeps one auth snapshot alive across client-side page transitions.
 *
 * Supabase's INITIAL_SESSION event reads the browser session locally, so the
 * header does not wait for a network request before showing the correct state.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(
    isSupabaseConfigured ? "loading" : "signed-out",
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      setStatus(nextUser ? "signed-in" : "signed-out");
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login and signup run as server actions, so their Set-Cookie response does
  // not emit a browser-side auth event. Re-read the local cookie after route
  // changes to pick that session up without a network request.
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;
    void createClient()
      .auth.getSession()
      .then(({ data }) => {
        if (cancelled) return;
        const nextUser = data.session?.user ?? null;
        setUser(nextUser);
        setStatus(nextUser ? "signed-in" : "signed-out");
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    // Update the navigation immediately; Supabase then clears the persisted
    // session and emits SIGNED_OUT to every remaining listener.
    setUser(null);
    setStatus("signed-out");
    await createClient().auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ user, status, signOut }),
    [signOut, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
