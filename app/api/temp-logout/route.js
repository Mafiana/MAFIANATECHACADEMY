import { NextResponse } from "next/server";

export async function POST(request) {
  const res = NextResponse.redirect(new URL("/login?next=/admin", request.url));
  res.cookies.set("temp_admin", "", { path: "/", maxAge: 0 });
  return res;
}

export async function GET(request) {
  return POST(request);
}