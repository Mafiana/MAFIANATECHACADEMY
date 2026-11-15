import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { accessProblem } from "./lib/access";

// /portal needs a signed-in student (or staff) whose access is active and not expired.
// /admin needs an admin or instructor (instructors cannot open exports or certificates).
export async function middleware(request) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const path = request.nextUrl.pathname;
  const go = (to, query = {}) => {
    const url = request.nextUrl.clone();
    url.pathname = to;
    url.search = "";
    Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => res.cookies.set(c)); // keep any refreshed or cleared session cookies
    return res;
  };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return go("/login", path.startsWith("/admin") ? { next: "/admin" } : {});

  const { data: me, error } = await supabase.from("profiles").select("role,access_status,access_until").eq("id", user.id).single();
  // If the database could not be reached, let the request through: pages and actions check again.
  const unreachable = error && error.code !== "PGRST116";
  if (unreachable) return response;

  // Expired or paused access is enforced on every request, not just at login.
  const problem = accessProblem(me);
  if (problem) {
    await supabase.auth.signOut();
    return go("/login", { notice: me?.access_status === "revoked" ? "revoked" : "expired" });
  }

  if (path.startsWith("/admin")) {
    const adminOnly = path.startsWith("/admin/export") || path.startsWith("/admin/certificate");
    const allowed = me?.role === "admin" || (me?.role === "instructor" && !adminOnly);
    if (!allowed) return go("/portal");
  }
  return response;
}

export const config = { matcher: ["/portal/:path*", "/admin/:path*"] };
