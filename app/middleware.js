import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// /portal needs any signed-in user. /admin needs a signed-in user whose profile role is "admin".
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
  const go = (to, next) => {
    const url = request.nextUrl.clone();
    url.pathname = to;
    url.search = "";
    if (next) url.searchParams.set("next", next);
    const res = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => res.cookies.set(c)); // keep any refreshed session cookies
    return res;
  };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return go("/login", path.startsWith("/admin") ? "/admin" : "/portal");

  if (path.startsWith("/admin")) {
    const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (me?.role !== "admin") return go("/portal");
  }
  return response;
}

export const config = { matcher: ["/portal/:path*", "/admin/:path*"] };
