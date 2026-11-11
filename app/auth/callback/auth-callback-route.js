import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

// Finishes Google sign-in and password-reset links, then sends the user to the right place.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/portal";
  if (!next.startsWith("/")) next = "/portal";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (next === "/portal") {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (p?.role === "admin") next = "/admin";
      }
      return NextResponse.redirect(origin + next);
    }
  }
  return NextResponse.redirect(origin + "/login");
}
