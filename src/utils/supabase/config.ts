export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * True once both public Supabase env vars are present. When false, every auth
 * feature disables itself gracefully instead of crashing — most importantly the
 * proxy, which otherwise turns missing env vars into a site-wide 500.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
