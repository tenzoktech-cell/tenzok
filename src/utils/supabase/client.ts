import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseUrl } from "./config";

let browserClient: SupabaseClient | undefined;

/** Share one browser client, auth listener, and session lock across the app. */
export const createClient = () => {
  browserClient ??= createBrowserClient(supabaseUrl!, supabaseKey!);
  return browserClient;
};
