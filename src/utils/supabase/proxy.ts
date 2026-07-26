import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./config";

/** Verifies protected-route sessions and keeps refreshed cookies in sync. */
export const updateSession = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const isProtected = path.startsWith("/profile") || path.startsWith("/admin");

  // Public pages do not read server-side auth state. Avoiding an auth round
  // trip here makes Home/Services/About navigation immediate; the persistent
  // browser AuthProvider owns their header state.
  if (!isProtected) return NextResponse.next({ request });
  // Without Supabase env vars there is no session to refresh — and calling
  // createServerClient(undefined, …) here would 500 every route on the site.
  if (!isSupabaseConfigured) return NextResponse.next({ request });

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Not decorative: this call is what triggers the token refresh.
  const { data: authData } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(authData?.claims.sub);

  // Gate protected routes at the edge. Doing it here (rather than only in the
  // page) gives a clean redirect before any streaming — so a signed-out visitor
  // never sees a page's loading skeleton flash before bouncing to /login.
  if (isProtected && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
};
