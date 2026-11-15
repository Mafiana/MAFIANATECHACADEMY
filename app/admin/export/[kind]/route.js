import { createClient } from "../../../../lib/supabase/server";
import { fetchAll } from "../../../../lib/supabase/fetchAll";
import { buildStudents } from "../../../../lib/adminStats";
import { toCsv } from "../../../../lib/csv";

// Admin-only CSV downloads (open in Excel or Google Sheets): /admin/export/students | payments | attendance | enrollments
export async function GET(_req, { params }) {
  const s = createClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user) return new Response("Please log in.", { status: 401 });
  const { data: me } = await s.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") return new Response("Admins only.", { status: 403 });

  const [st, en, pa, at] = await Promise.all([
    fetchAll(() => s.from("profiles").select("id,full_name,email,phone,student_code,access_plan,access_until,access_status").eq("role", "student").order("full_name").order("id")),
    fetchAll(() => s.from("enrollments").select("*").order("id")),
    fetchAll(() => s.from("payments").select("*").order("id")),
    fetchAll(() => s.from("attendance").select("*").order("class_date").order("id")),
  ]);
  const err = [st, en, pa, at].map((r) => r.error?.message).find(Boolean);
  if (err) return new Response("Could not read the data: " + err, { status: 500 });

  const people = Object.fromEntries(st.data.map((p) => [p.id, p]));
  const name = (id) => people[id]?.full_name || people[id]?.email || "Unknown";
  const code = (id) => people[id]?.student_code || "";
  const day = (d) => String(d).slice(0, 10);
  let headers, rows;

  switch (params.kind) {
    case "students": {
      const list = buildStudents({ students: st.data, enrollments: en.data, payments: pa.data, attendance: at.data });
      const label = { owing: "Owing", part: "Part paid", paid: "Paid", none: "No course" };
      headers = ["Student ID", "Name", "Phone", "Courses", "Total fees (NGN)", "Paid (NGN)", "Balance (NGN)", "Payment status", "Classes attended", "Classes marked", "Attendance %", "Plan", "Access until", "Access status"];
      rows = list.map((x) => [x.code, x.label, x.phone, x.courses.join("; "), x.fees, x.paid, x.balance, label[x.status], x.present, x.total, x.total ? x.pct : "", x.accessPlan, x.accessUntil, x.accessStatus === "revoked" ? "Paused" : "Active"]);
      break;
    }
    case "payments":
      headers = ["Date", "Student ID", "Student", "Amount (NGN)", "Note"];
      rows = pa.data.map((p) => [day(p.created_at), code(p.student_id), name(p.student_id), p.amount, p.note || ""]);
      break;
    case "attendance":
      headers = ["Date", "Student ID", "Student", "Present"];
      rows = at.data.map((a) => [day(a.class_date), code(a.student_id), name(a.student_id), a.present ? "Yes" : "No"]);
      break;
    case "enrollments":
      headers = ["Student ID", "Student", "Course", "Class type", "Fee (NGN)", "Certificate issued", "Certificate number", "Certificate date"];
      rows = en.data.map((e) => [code(e.student_id), name(e.student_id), e.course, e.mode, e.total_fee, e.certificate_issued ? "Yes" : "No", e.certificate_code || "", e.certificate_issued_at || ""]);
      break;
    default:
      return new Response("Unknown export.", { status: 404 });
  }

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
  return new Response(toCsv(headers, rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mafiana-${params.kind}-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
