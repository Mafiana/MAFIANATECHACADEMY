"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";
import { COURSE_NAMES, naira } from "../../lib/courses";

// Every action returns { ok, msg } so the form can show success or the real error.
const ok = (msg) => ({ ok: true, msg });
const bad = (msg) => ({ ok: false, msg });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const toInt = (v) => { const n = Number(v); return Number.isInteger(n) ? n : NaN; };
const dbErr = (error) => bad("Could not save: " + error.message);

async function requireAdmin() {
  const s = createClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user) return { err: "Your session ended. Please log in again." };
  const { data: me } = await s.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") return { err: "Only admins can do this." };
  return { s };
}

function admin(fn) {
  return async (_prev, fd) => {
    try {
      const a = await requireAdmin();
      if (a.err) return bad(a.err);
      const res = await fn(a.s, fd);
      if (res.ok) revalidatePath("/admin");
      return res;
    } catch (e) {
      console.error(e);
      return bad("Something went wrong. Please try again.");
    }
  };
}

async function balanceOf(s, studentId) {
  const [{ data: e }, { data: p }] = await Promise.all([
    s.from("enrollments").select("total_fee").eq("student_id", studentId),
    s.from("payments").select("amount").eq("student_id", studentId),
  ]);
  const fees = (e || []).reduce((a, x) => a + x.total_fee, 0);
  const paid = (p || []).reduce((a, x) => a + x.amount, 0);
  return { fees, paid, balance: fees - paid };
}

export const enroll = admin(async (s, fd) => {
  const student = String(fd.get("student") || "");
  const course = String(fd.get("course") || "");
  const mode = String(fd.get("mode") || "");
  const fee = toInt(fd.get("fee"));
  if (!UUID.test(student)) return bad("Choose a student.");
  if (!COURSE_NAMES.includes(course)) return bad("Choose a course.");
  if (!["physical", "online"].includes(mode)) return bad("Choose physical or online.");
  if (!(fee >= 0 && fee <= 10000000)) return bad("Enter a valid course fee.");
  const { data: dup } = await s.from("enrollments").select("id").eq("student_id", student).eq("course", course).limit(1);
  if (dup?.length) return bad("This student is already enrolled in " + course + ". Open the student and edit that enrollment instead.");
  const { error } = await s.from("enrollments").insert({ student_id: student, course, mode, total_fee: fee });
  return error ? dbErr(error) : ok("Enrolled in " + course + " (" + naira(fee) + ").");
});

export const updateEnrollment = admin(async (s, fd) => {
  const id = toInt(fd.get("id")), fee = toInt(fd.get("fee")), mode = String(fd.get("mode") || "");
  if (!(id > 0)) return bad("Enrollment not found.");
  if (!["physical", "online"].includes(mode)) return bad("Choose physical or online.");
  if (!(fee >= 0 && fee <= 10000000)) return bad("Enter a valid fee.");
  const { error } = await s.from("enrollments").update({ mode, total_fee: fee }).eq("id", id);
  return error ? dbErr(error) : ok("Enrollment updated.");
});

export const deleteEnrollment = admin(async (s, fd) => {
  const id = toInt(fd.get("id"));
  if (!(id > 0)) return bad("Enrollment not found.");
  const { error } = await s.from("enrollments").delete().eq("id", id);
  return error ? dbErr(error) : ok("Enrollment deleted.");
});

export const recordPayment = admin(async (s, fd) => {
  const student = String(fd.get("student") || "");
  const amount = toInt(fd.get("amount"));
  const note = String(fd.get("note") || "").trim().slice(0, 120) || null;
  if (!UUID.test(student)) return bad("Choose a student.");
  if (!(amount > 0 && amount <= 100000000)) return bad("Enter an amount greater than zero.");
  const { error } = await s.from("payments").insert({ student_id: student, amount, note });
  if (error) return dbErr(error);
  const b = await balanceOf(s, student);
  const tail = b.fees === 0 ? " This student has no enrollment yet." : b.balance > 0 ? " Balance left: " + naira(b.balance) + "." : b.balance < 0 ? " Note: that is " + naira(-b.balance) + " more than the fees." : " Fees are fully paid.";
  return ok("Saved " + naira(amount) + "." + tail);
});

export const updatePayment = admin(async (s, fd) => {
  const id = toInt(fd.get("id")), amount = toInt(fd.get("amount"));
  const note = String(fd.get("note") || "").trim().slice(0, 120) || null;
  if (!(id > 0)) return bad("Payment not found.");
  if (!(amount > 0 && amount <= 100000000)) return bad("Enter an amount greater than zero.");
  const { error } = await s.from("payments").update({ amount, note }).eq("id", id);
  return error ? dbErr(error) : ok("Payment updated.");
});

export const deletePayment = admin(async (s, fd) => {
  const id = toInt(fd.get("id"));
  if (!(id > 0)) return bad("Payment not found.");
  const { error } = await s.from("payments").delete().eq("id", id);
  return error ? dbErr(error) : ok("Payment deleted.");
});

// Saves a whole class register for one date. Re-saving the same date updates it instead of duplicating.
export const saveRegister = admin(async (s, fd) => {
  const date = String(fd.get("date") || "");
  if (!DATE.test(date)) return bad("Choose a valid date.");
  let entries;
  try { entries = JSON.parse(String(fd.get("entries") || "[]")); } catch { return bad("Could not read the register."); }
  if (!Array.isArray(entries) || !entries.length) return bad("No students to save.");
  if (entries.length > 500) return bad("Too many students in one register.");
  const rows = [];
  for (const [id, present] of entries) {
    if (!UUID.test(String(id))) return bad("Could not read the register.");
    rows.push({ student_id: id, class_date: date, present: present === true });
  }
  const ids = rows.map((r) => r.student_id);
  const { error: delErr } = await s.from("attendance").delete().in("student_id", ids).eq("class_date", date);
  if (delErr) return dbErr(delErr);
  const { error } = await s.from("attendance").insert(rows);
  if (error) return dbErr(error);
  const present = rows.filter((r) => r.present).length;
  return ok("Register saved for " + date + ": " + present + " present, " + (rows.length - present) + " absent.");
});

export const setCertificate = admin(async (s, fd) => {
  const id = toInt(fd.get("id")), action = String(fd.get("action") || "");
  if (!(id > 0)) return bad("Enrollment not found.");
  const issue = action === "issue";
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" }); // YYYY-MM-DD
  // Saves the issue date too. If the certificate_issued_at column has not been added yet (see supabase/add-certificate-date.sql),
  // fall back to the plain update so issuing still works.
  let res = await s.from("enrollments").update({ certificate_issued: issue, certificate_issued_at: issue ? today : null }).eq("id", id).select("student_id").single();
  if (res.error && /certificate_issued_at/.test(res.error.message)) {
    res = await s.from("enrollments").update({ certificate_issued: issue }).eq("id", id).select("student_id").single();
  }
  if (res.error) return dbErr(res.error);
  if (!issue) return ok("Certificate withdrawn.");
  const b = await balanceOf(s, res.data.student_id);
  return ok(b.balance > 0 ? "Certificate issued. Note: this student still owes " + naira(b.balance) + "." : "Certificate issued.");
});
