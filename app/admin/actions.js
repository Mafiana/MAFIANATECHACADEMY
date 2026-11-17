"use server";
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";
import { createClient } from "../../lib/supabase/server";
import { COURSE_NAMES, naira } from "../../lib/courses";
import { isHttpUrl } from "../../lib/video";
import { serviceClient } from "../../lib/supabase/service";
import { generatePin, prettyPin, pinEmail } from "../../lib/pin";
import { lagosToday, addMonths, prettyDate } from "../../lib/dates";
import { sanitizeHtml } from "../../lib/sanitizeHtml";
import { posts as builtInPosts, slugify, POST_CATEGORIES } from "../../lib/posts";
import { DEFAULT_SHOP, SHOP_CATEGORIES } from "../../lib/shop";

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

// ---- Student tools: edit name/phone, profile picture, delete (need supabase/add-admin-upgrades.sql for pictures) ----
const IMG_EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const storageMsg = (e) => /bucket|not found|storage/i.test(e.message || "") ? "Picture storage is not set up yet. Run supabase/add-admin-upgrades.sql in the Supabase SQL Editor first." : "Could not upload the picture: " + e.message;

async function readImage(fd, field, maxBytes) {
  const f = fd.get(field);
  if (!f || typeof f === "string" || !f.size) return { err: "Choose a picture first." };
  const ext = IMG_EXT[f.type];
  if (!ext) return { err: "Use a JPG, PNG or WebP picture." };
  if (f.size > maxBytes) return { err: "That picture is too big. Choose one under " + Math.round(maxBytes / 1048576) + " MB." };
  return { ext, type: f.type, buf: Buffer.from(await f.arrayBuffer()) };
}

export const updateStudent = admin(async (s, fd, user) => {
  const name = String(fd.get("name") || "").trim().slice(0, 80);
  const phone = String(fd.get("phone") || "").trim().slice(0, 30);
  if (name.length < 2) return bad("Enter the student's full name.");
  if (!phoneOk(phone)) return bad("That phone number does not look right.");
  const r = await target(s, String(fd.get("student") || ""), user);
  if (r.err) return bad(r.err);
  const { error } = await s.from("profiles").update({ full_name: name, phone: phone || null }).eq("id", r.t.id);
  if (error) return dbErr(error);
  try { await serviceClient().auth.admin.updateUserById(r.t.id, { user_metadata: { full_name: name, phone: phone || undefined, pin_account: true } }); } catch {} // keep the sign-in record in step; the profile above is what the site shows
  return ok("Saved. The name is now " + name + ".");
});

export const setAvatar = admin(async (s, fd, user) => {
  const r = await target(s, String(fd.get("student") || ""), user);
  if (r.err) return bad(r.err);
  if (fd.get("remove") === "1") {
    try { await serviceClient().storage.from("avatars").remove(Object.values(IMG_EXT).map((x) => `${r.t.id}.${x}`)); } catch {}
    const { error } = await s.from("profiles").update({ avatar_url: null }).eq("id", r.t.id);
    return error ? dbErr(error) : ok("Picture removed.");
  }
  const img = await readImage(fd, "photo", 1.5 * 1048576);
  if (img.err) return bad(img.err);
  let svc;
  try { svc = serviceClient(); } catch (e) { return bad(setupMsg(e)); }
  const path = `${r.t.id}.${img.ext}`;
  const up = await svc.storage.from("avatars").upload(path, img.buf, { contentType: img.type, upsert: true });
  if (up.error) return bad(storageMsg(up.error));
  const url = svc.storage.from("avatars").getPublicUrl(path).data.publicUrl + "?v=" + Date.now();
  const { error } = await s.from("profiles").update({ avatar_url: url }).eq("id", r.t.id);
  if (error) return /avatar_url/.test(error.message) ? bad("Picture storage is not set up yet. Run supabase/add-admin-upgrades.sql in the Supabase SQL Editor first.") : dbErr(error);
  return { ...ok("Picture saved."), url };
});

// Removes the student's sign-in account; their profile, enrollments, payments, attendance and quiz results go with it.
export const deleteStudent = admin(async (s, fd, user) => {
  const r = await target(s, String(fd.get("student") || ""), user);
  if (r.err) return bad(r.err);
  if (r.t.role !== "student") return bad("Instructors are removed from the Instructors section.");
  let svc;
  try { svc = serviceClient(); } catch (e) { return bad(setupMsg(e)); }
  try { await svc.storage.from("avatars").remove(Object.values(IMG_EXT).map((x) => `${r.t.id}.${x}`)); } catch {}
  const { error } = await svc.auth.admin.deleteUser(r.t.id);
  if (error) return bad("Could not delete the student: " + error.message + ".");
  return ok((r.t.full_name || "The student") + " was deleted.");
});

// Blog pictures. The browser shrinks the picture first, then this stores it and returns its public address.
export const uploadBlogImage = admin(async (s, fd) => {
  const img = await readImage(fd, "photo", 3 * 1048576);
  if (img.err) return bad(img.err);
  let svc;
  try { svc = serviceClient(); } catch (e) { return bad(setupMsg(e)); }
  const path = `${Date.now()}-${randomBytes(4).toString("hex")}.${img.ext}`;
  const up = await svc.storage.from("blog-images").upload(path, img.buf, { contentType: img.type });
  if (up.error) return bad(storageMsg(up.error));
  return { ...ok("Picture uploaded."), url: svc.storage.from("blog-images").getPublicUrl(path).data.publicUrl };
});

// ---- Blog posts (stored in Supabase, shown on the public /blog page; needs supabase/add-content-tables.sql) ----
const TABLE_MSG = "That table is not set up yet. Run supabase/add-content-tables.sql in the Supabase SQL Editor first.";
const tableErr = (error) => (/relation|does not exist|schema cache/i.test(error.message) ? bad(TABLE_MSG) : dbErr(error));
const okImage = (v) => v === "" || /^(https:\/\/|\/(?!\/))/.test(v) || /^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(v);

function postFields(fd) {
  const title = String(fd.get("title") || "").trim().slice(0, 140);
  const excerpt = String(fd.get("excerpt") || "").trim().slice(0, 300);
  const category = String(fd.get("category") || "");
  const cover = String(fd.get("cover") || "").trim();
  const body_html = sanitizeHtml(String(fd.get("body") || "").slice(0, 600000));
  if (title.length < 3) return { err: "Add a title for the post." };
  if (!POST_CATEGORIES.includes(category)) return { err: "Choose a category." };
  if (!okImage(cover) || cover.length > 700000) return { err: "The cover image is not valid or is too big. Upload it again." };
  if (body_html.replace(/<[^>]*>/g, "").trim().length < 20 && !/<img/.test(body_html)) return { err: "The post is empty. Write something first." };
  return { row: { title, excerpt, category, cover: cover || null, body_html, published: fd.get("published") === "1", updated_at: new Date().toISOString() } };
}

export const savePost = admin(async (s, fd) => {
  const f = postFields(fd);
  if (f.err) return bad(f.err);
  const id = String(fd.get("id") || "");
  let slug;
  if (id) {
    if (!/^\d+$/.test(id)) return bad("That post could not be found.");
    const { data, error } = await s.from("blog_posts").update(f.row).eq("id", id).select("slug").maybeSingle();
    if (error) return tableErr(error);
    if (!data) return bad("That post could not be found. It may have been deleted.");
    slug = data.slug;
  } else {
    const base = slugify(f.row.title).slice(0, 70) || "post";
    const taken = new Set(builtInPosts.map((p) => p.slug));
    let tries = 0, error;
    do {
      slug = tries ? `${base}-${tries + 1}` : base;
      if (taken.has(slug)) { tries++; continue; }
      ({ error } = await s.from("blog_posts").insert({ ...f.row, slug }));
      if (!error || error.code !== "23505") break;
      tries++;
    } while (tries < 8);
    if (error) return tableErr(error);
  }
  revalidatePath("/blog", "layout");
  return ok(f.row.published ? "Saved and published. It is on the blog now." : "Saved as a draft. It is not on the blog yet.");
});

export const deletePost = admin(async (s, fd) => {
  const id = String(fd.get("id") || "");
  if (!/^\d+$/.test(id)) return bad("That post could not be found.");
  const { error } = await s.from("blog_posts").delete().eq("id", id);
  if (error) return tableErr(error);
  revalidatePath("/blog", "layout");
  return ok("Post deleted.");
});

// One-time: copies posts that were only saved inside this browser into the database.
export const importPosts = admin(async (s, fd) => {
  let list;
  try { list = JSON.parse(String(fd.get("posts") || "[]")); } catch { return bad("Could not read the saved posts."); }
  if (!Array.isArray(list) || !list.length) return bad("There are no saved posts to import.");
  let n = 0;
  for (const p of list.slice(0, 30)) {
    const x = new FormData();
    x.set("title", String(p.title || "")); x.set("excerpt", String(p.excerpt || ""));
    x.set("category", POST_CATEGORIES.includes(p.category) ? p.category : "Learning");
    x.set("cover", String(p.cover || "")); x.set("body", String(p.bodyHtml || "")); x.set("published", "1");
    const f = postFields(x);
    if (f.err) continue;
    const base = slugify(f.row.title).slice(0, 70) || "post";
    for (let t = 0; t < 8; t++) {
      const slug = t ? `${base}-${t + 1}` : base;
      if (builtInPosts.some((x) => x.slug === slug)) continue;
      const { error } = await s.from("blog_posts").insert({ ...f.row, slug });
      if (!error) { n++; break; }
      if (error.code !== "23505") return tableErr(error);
    }
  }
  revalidatePath("/blog", "layout");
  return n ? ok(`Imported ${n} post${n === 1 ? "" : "s"} and published ${n === 1 ? "it" : "them"}.`) : bad("Nothing could be imported (posts need a title and some text).");
});

// ---- Shop products (stored in Supabase, shown on the homepage Student shop) ----
export const uploadShopImage = admin(async (s, fd) => {
  const img = await readImage(fd, "photo", 3 * 1048576);
  if (img.err) return bad(img.err);
  let svc;
  try { svc = serviceClient(); } catch (e) { return bad(setupMsg(e)); }
  const path = `${Date.now()}-${randomBytes(4).toString("hex")}.${img.ext}`;
  const up = await svc.storage.from("shop-images").upload(path, img.buf, { contentType: img.type });
  if (up.error) return bad(/bucket|not found/i.test(up.error.message) ? "Shop picture storage is not set up yet. Run supabase/add-content-tables.sql in the Supabase SQL Editor first." : "Could not upload the picture: " + up.error.message);
  return { ...ok("Picture uploaded."), url: svc.storage.from("shop-images").getPublicUrl(path).data.publicUrl };
});

function parseSpecs(text) {
  return String(text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 24).map((l) => {
    const i = l.indexOf(":");
    return i > 0 ? [l.slice(0, i).trim().slice(0, 40), l.slice(i + 1).trim().slice(0, 140)] : null;
  }).filter((x) => x && x[0] && x[1]);
}

export const saveProduct = admin(async (s, fd) => {
  const name = String(fd.get("name") || "").trim().slice(0, 100);
  const cat = String(fd.get("cat") || "");
  const price = toInt(fd.get("price")), stock = toInt(fd.get("stock"));
  const img = String(fd.get("img") || "").trim();
  let imgs = [];
  try { imgs = JSON.parse(String(fd.get("imgs") || "[]")); } catch {}
  imgs = (Array.isArray(imgs) ? imgs : []).map(String).filter((u) => u && okImage(u) && !u.startsWith("data:")).slice(0, 8);
  if (name.length < 2) return bad("Enter the product name.");
  if (!SHOP_CATEGORIES.includes(cat) || cat === "All") return bad("Choose a category.");
  if (!(price >= 0 && price <= 1e9)) return bad("Enter the price in naira, as a whole number.");
  if (!(stock >= 0 && stock <= 1e6)) return bad("Enter how many are in stock, as a whole number.");
  if (!okImage(img) || img.startsWith("data:")) return bad("The picture address is not valid. Upload the picture again.");
  const row = { name, cat, price, stock, img: img || null, imgs, specs: parseSpecs(fd.get("specs")), descr: String(fd.get("descr") || "").trim().slice(0, 300), active: fd.get("active") === "1" };
  const id = String(fd.get("id") || "");
  const q = id ? s.from("shop_products").update(row).eq("id", id) : s.from("shop_products").insert(row);
  const { error } = await q;
  if (error) return tableErr(error);
  revalidatePath("/");
  return ok(id ? "Product saved." : "Product added to the shop.");
});

export const deleteProduct = admin(async (s, fd) => {
  const id = String(fd.get("id") || "");
  if (!/^\d+$/.test(id)) return bad("That product could not be found.");
  const { error } = await s.from("shop_products").delete().eq("id", id);
  if (error) return tableErr(error);
  revalidatePath("/");
  return ok("Product removed.");
});

// Copies the starter products into the database (only when it is empty) so they can be edited here.
export const seedShop = admin(async (s) => {
  const { count, error: ce } = await s.from("shop_products").select("id", { count: "exact", head: true });
  if (ce) return tableErr(ce);
  if (count) return bad("The shop already has products.");
  const rows = DEFAULT_SHOP.map((p, i) => ({ name: p.name, cat: p.cat, price: p.price, stock: p.stock ?? 0, descr: p.desc || "", img: p.img || null, imgs: p.imgs || [], specs: p.specs || [], active: true, sort: i }));
  const { error } = await s.from("shop_products").insert(rows);
  if (error) return tableErr(error);
  revalidatePath("/");
  return ok(`Loaded ${rows.length} starter products. Edit them below.`);
});
