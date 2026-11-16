"use server";
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";
import { createClient } from "../../lib/supabase/server";
import { COURSE_NAMES, naira } from "../../lib/courses";
import { isHttpUrl } from "../../lib/video";
import { serviceClient } from "../../lib/supabase/service";
import { generatePin, prettyPin, pinEmail } from "../../lib/pin";
import { lagosToday, addMonths, prettyDate } from "../../lib/dates";

// Every action returns { ok, msg } so the form can show success or the real error.
const ok = (msg) => ({ ok: true, msg });
const bad = (msg) => ({ ok: false, msg });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const toInt = (v) => { const n = Number(v); return Number.isInteger(n) ? n : NaN; };
const dbErr = (error) => bad("Could not save: " + error.message);

async function requireRole(roles) {
  const s = createClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user) return { err: "Your session ended. Please log in again." };
  const { data: me, error } = await s.from("profiles").select("role").eq("id", user.id).single();
  if (error && error.code !== "PGRST116") return { err: "Could not reach the database. Check your connection and try again in a moment." };
  if (!roles.includes(me?.role)) return { err: roles.includes("instructor") ? "Only academy staff can do this." : "Only admins can do this." };
  return { s, user };
}

// guarded(roles, fn): runs fn only for those roles. admin(...) = admins only. staff(...) = admins and instructors.
function guarded(roles, fn) {
  return async (_prev, fd) => {
    try {
      const a = await requireRole(roles);
      if (a.err) return bad(a.err);
      const res = await fn(a.s, fd, a.user);
      if (res.ok) revalidatePath("/admin");
      return res;
    } catch (e) {
      console.error(e);
      return bad("Something went wrong. Please try again.");
    }
  };
}
const admin = (fn) => guarded(["admin"], fn);
const staff = (fn) => guarded(["admin", "instructor"], fn);

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
export const saveRegister = staff(async (s, fd) => {
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

const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I so numbers are easy to read out
const newCode = () => "MTA-" + Array.from(randomBytes(8), (x) => CODE_CHARS[x % CODE_CHARS.length]).join("");

export const setCertificate = admin(async (s, fd) => {
  const id = toInt(fd.get("id")), action = String(fd.get("action") || "");
  if (!(id > 0)) return bad("Enrollment not found.");
  const issue = action === "issue";
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" }); // YYYY-MM-DD
  const { data: cur } = await s.from("enrollments").select("*").eq("id", id).maybeSingle();
  if (!cur) return bad("Enrollment not found.");
  let res;
  if (!issue) {
    res = await s.from("enrollments").update({ certificate_issued: false }).eq("id", id).select("student_id").single();
  } else {
    // A certificate keeps its number for life (even if withdrawn and issued again), so a printed copy always verifies.
    for (let i = 0; i < 4; i++) {
      res = await s.from("enrollments").update({ certificate_issued: true, certificate_issued_at: today, certificate_code: cur.certificate_code || newCode() }).eq("id", id).select("student_id").single();
      if (res.error?.code !== "23505") break; // only retry on a number clash
    }
    // If the certificate columns were not added yet (see supabase/add-all-features.sql), issue without them.
    if (res.error && /certificate_(issued_at|code)/.test(res.error.message)) {
      res = await s.from("enrollments").update({ certificate_issued: true }).eq("id", id).select("student_id").single();
    }
  }
  if (res.error) return dbErr(res.error);
  if (!issue) return ok("Certificate withdrawn.");
  const b = await balanceOf(s, res.data.student_id);
  return ok(b.balance > 0 ? "Certificate issued. Note: this student still owes " + naira(b.balance) + "." : "Certificate issued.");
});

// ---- Access PIN accounts (students and instructors) ----
// The admin creates people; nobody signs themselves up. Each gets an Access PIN that is shown ONCE and never stored.
const MONTH_CHOICES = [1, 2, 3, 6, 12];
const phoneOk = (v) => v === "" || /^[0-9+()\-\s]{6,30}$/.test(v);
const setupMsg = (e) => /SUPABASE_SERVICE_ROLE_KEY/.test(e.message)
  ? "Student accounts are not set up yet. Add SUPABASE_SERVICE_ROLE_KEY to your hosting settings (see the setup steps)."
  : /ACCESS_PIN_SECRET/.test(e.message) ? "Access PINs are not set up yet. Add ACCESS_PIN_SECRET (any long random text) to your hosting settings."
  : "Something went wrong. Please try again.";
const authHint = (m) => /email|invalid/i.test(m) ? " If it says the email is invalid, set PIN_EMAIL_DOMAIN in your hosting settings to a real domain you own, such as yourdomain.com." : "";

// Finds the person an admin action is aimed at and refuses admins and the admin themselves.
async function target(s, id, user) {
  if (!UUID.test(id)) return { err: "Choose a person." };
  if (id === user.id) return { err: "You cannot change your own access." };
  const { data: t } = await s.from("profiles").select("id,role,full_name,access_plan,access_until,student_code").eq("id", id).maybeSingle();
  if (!t) return { err: "That person was not found." };
  if (t.role === "admin") return { err: "Admin accounts are managed in Supabase, not here." };
  return { t };
}

async function newAccount({ s, name, phone, role, plan, until }) {
  let svc, pin, email;
  try { svc = serviceClient(); pin = generatePin(); email = pinEmail(pin); } catch (e) { return { err: setupMsg(e) }; }
  const { data, error } = await svc.auth.admin.createUser({ email, password: pin, email_confirm: true, user_metadata: { full_name: name, phone: phone || undefined, pin_account: true } });
  if (error || !data?.user) return { err: "Could not create the account: " + (error?.message || "unknown error") + "." + authHint(error?.message || "") };
  const id = data.user.id;
  const { error: pe } = await s.from("profiles").update({ phone: phone || null, role, access_plan: plan, access_until: until, access_status: "active" }).eq("id", id);
  if (pe) { await svc.auth.admin.deleteUser(id); return { err: "Could not save: " + pe.message }; }
  return { id, pin, svc };
}

const cardOf = (t, pin, extra = {}) => ({ name: t.full_name || "Student", pin: prettyPin(pin), plan: t.access_plan || "", until: t.access_until || "", code: t.student_code || "", ...extra });

export const addStudent = admin(async (s, fd) => {
  const name = String(fd.get("name") || "").trim().slice(0, 80);
  const phone = String(fd.get("phone") || "").trim().slice(0, 30);
  const course = String(fd.get("course") || ""), mode = String(fd.get("mode") || "");
  const fee = toInt(fd.get("fee")), months = toInt(fd.get("months"));
  if (name.length < 2) return bad("Enter the student's full name.");
  if (!phoneOk(phone)) return bad("That phone number does not look right.");
  if (!COURSE_NAMES.includes(course)) return bad("Choose a course.");
  if (!["physical", "online"].includes(mode)) return bad("Choose physical or online.");
  if (!(fee >= 0 && fee <= 10000000)) return bad("Enter a valid course fee.");
  if (!MONTH_CHOICES.includes(months)) return bad("Choose how long the access lasts.");
  const plan = `${course} · ${mode === "online" ? "Online" : "Physical"}`;
  const until = addMonths(lagosToday(), months);
  const a = await newAccount({ s, name, phone, role: "student", plan, until });
  if (a.err) return bad(a.err);
  const { error } = await s.from("enrollments").insert({ student_id: a.id, course, mode, total_fee: fee });
  if (error) { await a.svc.auth.admin.deleteUser(a.id); return dbErr(error); }
  const pretty = prettyPin(a.pin);
  await s.from("profiles").update({ access_pin: pretty }).eq("id", a.id);
  const { data: p } = await s.from("profiles").select("student_code").eq("id", a.id).single();
  return { ...ok(`${name} was added. Give them the Access PIN below. It stays on their profile.`), card: cardOf({ full_name: name, access_plan: plan, access_until: until, student_code: p?.student_code }, a.pin) };
});

export const addInstructor = admin(async (s, fd) => {
  const name = String(fd.get("name") || "").trim().slice(0, 80);
  const phone = String(fd.get("phone") || "").trim().slice(0, 30);
  if (name.length < 2) return bad("Enter the instructor's full name.");
  if (!phoneOk(phone)) return bad("That phone number does not look right.");
  const a = await newAccount({ s, name, phone, role: "instructor", plan: "Instructor", until: null });
  if (a.err) return bad(a.err);
  const pretty = prettyPin(a.pin);
  await s.from("profiles").update({ access_pin: pretty }).eq("id", a.id);
  const { data: p } = await s.from("profiles").select("student_code").eq("id", a.id).single();
  return { ...ok(`${name} was added as an instructor. Give them the Access PIN below. It stays on their profile.`), card: cardOf({ full_name: name, access_plan: "Instructor", access_until: null, student_code: p?.student_code }, a.pin, { staff: true }) };
});

// Extends access from the later of today and the current end date, and switches a paused account back on.
export const renewAccess = admin(async (s, fd, user) => {
  const months = toInt(fd.get("months"));
  if (!MONTH_CHOICES.includes(months)) return bad("Choose how long to extend the access.");
  const r = await target(s, String(fd.get("student") || ""), user);
  if (r.err) return bad(r.err);
  if (r.t.role !== "student") return bad("Instructor access does not have an end date.");
  const today = lagosToday();
  const base = r.t.access_until && r.t.access_until > today ? r.t.access_until : today;
  const until = addMonths(base, months);
  const { error } = await s.from("profiles").update({ access_until: until, access_status: "active" }).eq("id", r.t.id);
  if (error) return dbErr(error);
  try { await serviceClient().auth.admin.updateUserById(r.t.id, { ban_duration: "none" }); } catch (e) { return bad(setupMsg(e)); }
  return ok(`${r.t.full_name || "Student"}'s access now runs until ${prettyDate(until)}. Their PIN still works.`);
});

// A new PIN replaces the old one at once (use it when a PIN is lost or shared). The end date stays the same.
export const resetPin = admin(async (s, fd, user) => {
  const r = await target(s, String(fd.get("student") || ""), user);
  if (r.err) return bad(r.err);
  let svc, pin;
  try { svc = serviceClient(); pin = generatePin(); const email = pinEmail(pin); const { error } = await svc.auth.admin.updateUserById(r.t.id, { email, password: pin, email_confirm: true }); if (error) return bad("Could not change the PIN: " + error.message + "."); }
  catch (e) { return bad(setupMsg(e)); }
  const pretty = prettyPin(pin);
  await s.from("profiles").update({ access_pin: pretty }).eq("id", r.t.id);
  return { ...ok("A new Access PIN was issued. The old one no longer works. The new PIN is saved on the student profile."), card: cardOf(r.t, pin, { staff: r.t.role === "instructor", renewed: true }) };
});

// Pause stops the PIN working straight away (use when fees are unpaid or someone leaves). Restore turns it back on.
export const setAccess = admin(async (s, fd, user) => {
  const act = String(fd.get("action") || "");
  if (!["pause", "restore"].includes(act)) return bad("Invalid action.");
  const r = await target(s, String(fd.get("student") || ""), user);
  if (r.err) return bad(r.err);
  const pause = act === "pause";
  const { error } = await s.from("profiles").update({ access_status: pause ? "revoked" : "active" }).eq("id", r.t.id);
  if (error) return dbErr(error);
  try { await serviceClient().auth.admin.updateUserById(r.t.id, { ban_duration: pause ? "876000h" : "none" }); } catch (e) { return bad(setupMsg(e)); }
  const who = r.t.full_name || "This person";
  const ended = !pause && r.t.role === "student" && r.t.access_until && r.t.access_until < lagosToday();
  return ok(pause ? `${who}'s access is paused. Their PIN stops working now.` : ended ? `${who}'s access is switched on, but the end date has already passed. Use Renew to extend it.` : `${who}'s access is back on.`);
});

const noTable = (error) => /announcements/.test(error.message) ? bad("Announcements are not set up yet. Run supabase/add-announcements.sql in the Supabase SQL Editor first.") : dbErr(error);

export const postAnnouncement = admin(async (s, fd) => {
  const title = String(fd.get("title") || "").trim().slice(0, 100);
  const body = String(fd.get("body") || "").trim().slice(0, 1000);
  if (!title) return bad("Give the announcement a title.");
  const { error } = await s.from("announcements").insert({ title, body });
  return error ? noTable(error) : ok("Posted. Students see it on their dashboard.");
});

export const deleteAnnouncement = admin(async (s, fd) => {
  const id = toInt(fd.get("id"));
  if (!(id > 0)) return bad("Announcement not found.");
  const { error } = await s.from("announcements").delete().eq("id", id);
  return error ? noTable(error) : ok("Announcement deleted.");
});

// ---- lessons and quizzes (need supabase/add-lessons-quizzes.sql) ----
const lqErr = (error) => /lessons|quizzes|quiz_keys|quiz_attempts/.test(error.message) && /schema cache|does not exist/.test(error.message)
  ? bad("Lessons and quizzes are not set up yet. Run supabase/add-lessons-quizzes.sql in the Supabase SQL Editor first.") : dbErr(error);

function lessonFields(fd) {
  const title = String(fd.get("title") || "").trim().slice(0, 120);
  const url = String(fd.get("url") || "").trim().slice(0, 500);
  const minRaw = String(fd.get("minutes") || "").trim();
  const posRaw = String(fd.get("position") || "").trim();
  const minutes = minRaw === "" ? null : toInt(minRaw);
  const position = posRaw === "" ? null : toInt(posRaw);
  if (!title) return { err: "Give the lesson a title." };
  if (!isHttpUrl(url)) return { err: "Paste the full video link, starting with https://" };
  if (minutes !== null && !(minutes >= 0 && minutes <= 600)) return { err: "Minutes must be a number from 0 to 600." };
  if (position !== null && !(position >= 1 && position <= 999)) return { err: "Order must be a number from 1 to 999." };
  return { title, url, minutes, position };
}

export const addLesson = staff(async (s, fd) => {
  const course = String(fd.get("course") || "");
  if (!COURSE_NAMES.includes(course)) return bad("Choose a course.");
  const f = lessonFields(fd);
  if (f.err) return bad(f.err);
  let position = f.position;
  if (position === null) {
    const { data: last } = await s.from("lessons").select("position").eq("course", course).order("position", { ascending: false }).limit(1);
    position = (last?.[0]?.position || 0) + 1;
  }
  const { error } = await s.from("lessons").insert({ course, title: f.title, video_url: f.url, minutes: f.minutes, position });
  return error ? lqErr(error) : ok("Lesson added to " + course + ". Enrolled students can watch it now.");
});

export const updateLesson = staff(async (s, fd) => {
  const id = toInt(fd.get("id"));
  if (!(id > 0)) return bad("Lesson not found.");
  const f = lessonFields(fd);
  if (f.err) return bad(f.err);
  const patch = { title: f.title, video_url: f.url, minutes: f.minutes };
  if (f.position !== null) patch.position = f.position;
  const { error } = await s.from("lessons").update(patch).eq("id", id);
  return error ? lqErr(error) : ok("Lesson updated.");
});

export const deleteLesson = staff(async (s, fd) => {
  const id = toInt(fd.get("id"));
  if (!(id > 0)) return bad("Lesson not found.");
  const { error } = await s.from("lessons").delete().eq("id", id);
  return error ? lqErr(error) : ok("Lesson deleted.");
});

export const createQuiz = staff(async (s, fd) => {
  const course = String(fd.get("course") || "");
  const title = String(fd.get("title") || "").trim().slice(0, 120);
  if (!COURSE_NAMES.includes(course)) return bad("Choose a course.");
  if (!title) return bad("Give the quiz a title.");
  let raw;
  try { raw = JSON.parse(String(fd.get("payload") || "[]")); } catch { return bad("Could not read the questions."); }
  if (!Array.isArray(raw) || raw.length < 1) return bad("Add at least one question.");
  if (raw.length > 50) return bad("A quiz can have at most 50 questions.");
  const questions = [], answers = [];
  for (let i = 0; i < raw.length; i++) {
    const q = String(raw[i]?.q || "").trim().slice(0, 300);
    const opts = Array.isArray(raw[i]?.options) ? raw[i].options.map((o) => String(o || "").trim().slice(0, 200)) : [];
    const answer = raw[i]?.answer;
    if (!q) return bad("Question " + (i + 1) + " is empty.");
    if (opts.length < 2 || opts.length > 6 || opts.some((o) => !o)) return bad("Question " + (i + 1) + " needs 2 to 6 options, all filled in.");
    if (!Number.isInteger(answer) || answer < 0 || answer >= opts.length) return bad("Choose the correct answer for question " + (i + 1) + ".");
    questions.push({ q, options: opts }); answers.push(answer);
  }
  const { data: quiz, error } = await s.from("quizzes").insert({ course, title, questions }).select("id").single();
  if (error) return lqErr(error);
  const { error: e2 } = await s.from("quiz_keys").insert({ quiz_id: quiz.id, answers });
  if (e2) { await s.from("quizzes").delete().eq("id", quiz.id); return lqErr(e2); }
  return ok("Quiz created with " + questions.length + " question" + (questions.length === 1 ? "" : "s") + ". Enrolled students can take it now.");
});

export const deleteQuiz = staff(async (s, fd) => {
  const id = toInt(fd.get("id"));
  if (!(id > 0)) return bad("Quiz not found.");
  const { error } = await s.from("quizzes").delete().eq("id", id);
  return error ? lqErr(error) : ok("Quiz deleted along with its results.");
});
