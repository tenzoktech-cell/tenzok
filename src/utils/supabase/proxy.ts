import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./config";

/** Refreshes the auth session on every request and keeps the request and
 *  response cookies in sync, so Server Components always see a valid token. */
export const updateSession = async (request: NextRequest) => {
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gate protected routes at the edge. Doing it here (rather than only in the
  // page) gives a clean redirect before any streaming — so a signed-out visitor
  // never sees a page's loading skeleton flash before bouncing to /login.
  const path = request.nextUrl.pathname;
  const isProtected = path.startsWith("/profile") || path.startsWith("/admin");
  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
};
