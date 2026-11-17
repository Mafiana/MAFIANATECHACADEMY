import { createClient } from "@supabase/supabase-js";

// A read-only client for public pages (blog, shop). It sends no cookies, so those pages can stay fast and cached.
export function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
