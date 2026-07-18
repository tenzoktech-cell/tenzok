// trim(): env values pasted into dashboards routinely pick up a trailing
// newline, and a URL ending in "\n" makes every Supabase fetch fail.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

/**
 * True once both public Supabase env vars are present. When false, every auth
 * feature disables itself gracefully instead of crashing — most importantly the
 * proxy, which otherwise turns missing env vars into a site-wide 500.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
