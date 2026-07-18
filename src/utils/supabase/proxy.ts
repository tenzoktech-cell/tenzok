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
  await supabase.auth.getUser();

  return supabaseResponse;
};
