import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/* Only the publishable anon key reaches the browser, and it grants nothing
   on its own: every table is protected by the row-level security policies
   in supabase/schema.sql. Service-role keys belong on the server only. */
export const supabaseConfigured = () => Boolean(url && anonKey);

let cached: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!cached) {
    if (!url || !anonKey) {
      throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }
    cached = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return cached;
}
