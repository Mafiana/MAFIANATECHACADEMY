import { createClient } from "@supabase/supabase-js";

// A client with FULL powers over your Supabase project. Used only on the server, inside admin actions, to create students
// and change PINs. SUPABASE_SERVICE_ROLE_KEY must never start with NEXT_PUBLIC_ and must never reach the browser.
export function serviceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
