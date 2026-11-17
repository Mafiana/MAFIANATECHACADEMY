import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { accessProblem } from "./lib/access";

export async function middleware(request) {
  let response = NextResponse.next({ request });
  const path = request.nextUrl.pathname;

  // Temporary design-mode admin (cookie set by login-form)
  if (path.startsWith("/admin") && request.cookies.get("temp_admin")?.value === "1") {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(list) {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const go = (to, query = {}) => {
    const url = request.nextUrl.clone();
    url.pathname = to;
    url.search = "";
    Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => res.cookies.set(c));
    return res;
  };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    // /admin itself shows the admin sign-in form right at the /admin address (no redirect to /login).
    if (path === "/admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "?next=/admin";
      const res = NextResponse.rewrite(url);
      response.cookies.getAll().forEach((c) => res.cookies.set(c));
      return res;
    }
    return go(path.startsWith("/admin") ? "/admin" : "/login");
  }

  const { data: me, error } = await supabase
    .from("profiles")
    .select("role,access_status,access_until")
    .eq("id", user.id)
    .single();
  const unreachable = error && error.code !== "PGRST116";
  if (unreachable) return response;

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