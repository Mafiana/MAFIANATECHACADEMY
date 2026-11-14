import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { fetchAll } from "./supabase/fetchAll";

// Loads everything one student can see, plus the totals the portal screens share.
export async function getPortalData() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: profile }, en, pa, at] = await Promise.all([
    supabase.from("profiles").select("full_name,email,role").eq("id", user.id).single(),
    fetchAll(() => supabase.from("enrollments").select("*").eq("student_id", user.id).order("id")),
    fetchAll(() => supabase.from("payments").select("*").eq("student_id", user.id).order("created_at", { ascending: false }).order("id", { ascending: false })),
    fetchAll(() => supabase.from("attendance").select("*").eq("student_id", user.id).order("class_date", { ascending: false }).order("id", { ascending: false })),
  ]);
  const enrollments = en.data, payments = pa.data, attendance = at.data;
  const fees = enrollments.reduce((a, e) => a + e.total_fee, 0);
  const paid = payments.reduce((a, p) => a + p.amount, 0);
  const present = attendance.filter((a) => a.present).length;
  return {
    supabase, user, profile,
    name: profile?.full_name || profile?.email || "student",
    enrollments, payments, attendance,
    fees, paid, balance: Math.max(fees - paid, 0), paidPct: fees ? Math.min(Math.round((paid / fees) * 100), 100) : 0,
    present, absent: attendance.length - present,
    pct: attendance.length ? Math.round((present / attendance.length) * 100) : 0,
    error: [en, pa, at].map((r) => r.error?.message).find(Boolean) || "",
  };
}

export function waUrl(text) {
  const n = process.env.NEXT_PUBLIC_WHATSAPP;
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : "";
}

export const fmtDate = (d, opts = { day: "numeric", month: "short", year: "numeric" }) =>
  new Date(String(d).length === 10 ? d + "T12:00:00" : d).toLocaleDateString("en-GB", opts);
