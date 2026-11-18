import { addDays, daysBetween, prettyDate } from "./dates";
import { toWhatsAppNumber } from "./phone";

// Renewal reminders: WhatsApp messages to students whose access is about to end (or just ended).
// Automatic sending uses Twilio's WhatsApp API. Settings (hosting environment variables):
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM (your WhatsApp sender, like +14155238886)
//   TWILIO_CONTENT_SID (optional) an approved WhatsApp template. Needed to message students first, outside the 24 hour window.
//   DEFAULT_COUNTRY_CODE (optional, default 234) used to read numbers like 0801 234 5678.

export const MAX_PER_RUN = 60; // keeps one run short enough for a serverless time limit; the rest go out on the next run
export const MAX_FAILED_TRIES = 3; // after this many failed sends for one step, stop trying until the end date changes
const PARALLEL = 5;

export const whatsappConfigured = () => !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM);

// Which reminder step a student is at, from the days left on their access (negative = already ended).
// 7d: 4 to 7 days left. 3d: 1 to 3 days left. 0d: ends today. after: ended in the last 7 days. null: no reminder due.
export function stageFor(left) {
  if (left >= 4 && left <= 7) return "7d";
  if (left >= 1 && left <= 3) return "3d";
  if (left === 0) return "0d";
  if (left <= -1 && left >= -7) return "after";
  return null;
}

export const firstName = (name) => String(name || "").trim().split(/\s+/)[0] || "there";

export function statusPhrase(left, until) {
  const d = prettyDate(until);
  if (left > 1) return `ends on ${d} (${left} days left)`;
  if (left === 1) return `ends tomorrow, ${d}`;
  if (left === 0) return `ends today, ${d}`;
  return `ended on ${d}`;
}

export function reminderText({ name, until, left, plan }) {
  return `Hello ${firstName(name)}, this is MAF Tech Academy. Your access${plan ? ` (${plan})` : ""} ${statusPhrase(left, until)}. ` +
    `Please reply to this message or contact us to renew your Access PIN, so you keep your lessons, modules and certificate.`;
}

// ---- sending ----
async function twilioSend(to, { name, until, left, plan }) {
  const sid = process.env.TWILIO_ACCOUNT_SID, token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const wa = (n) => (n.startsWith("whatsapp:") ? n : "whatsapp:" + n);
  const params = new URLSearchParams({ To: wa(to), From: wa(from.startsWith("+") || from.startsWith("whatsapp:") ? from : "+" + from) });
  const template = process.env.TWILIO_CONTENT_SID;
  if (template) {
    // Template body to approve in Twilio: "Hello {{1}}, this is MAF Tech Academy. Your access {{2}}. Please reply to this message or contact us to renew your Access PIN."
    params.set("ContentSid", template);
    params.set("ContentVariables", JSON.stringify({ 1: firstName(name), 2: statusPhrase(left, until) }));
  } else {
    params.set("Body", reminderText({ name, until, left, plan }));
  }
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 9000);
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: { Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
      signal: ctl.signal,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const hint = json.code === 63016 || json.code === 63007
        ? " WhatsApp only allows free text within 24 hours of the student's last message. Set TWILIO_CONTENT_SID to an approved template."
        : "";
      return { ok: false, error: (json.message || `Twilio error ${res.status}`) + hint };
    }
    return { ok: true, id: json.sid || null };
  } catch (e) {
    return { ok: false, error: e?.name === "AbortError" ? "WhatsApp provider timed out." : "Could not reach WhatsApp provider." };
  } finally {
    clearTimeout(timer);
  }
}

// Sends one reminder to one person row { id, full_name, phone, access_until, access_plan }. Never throws.
export async function deliver(person, left) {
  const to = toWhatsAppNumber(person.phone);
  if (!to) return { ok: false, skipped: true, error: person.phone ? "The phone number does not look right." : "No phone number saved." };
  if (!whatsappConfigured()) return { ok: false, skipped: true, error: "WhatsApp sending is not set up yet." };
  return twilioSend(to, { name: person.full_name, until: person.access_until, left, plan: person.access_plan });
}

const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));
const missing = (error) => error && /renewal_reminders/.test(error.message || "") && /schema cache|does not exist|relation/.test(error.message || "");
export const SETUP_MSG = "Reminders are not set up yet. Run supabase/add-renewal-reminders.sql in the Supabase SQL Editor first.";

async function log(db, row) {
  const { error } = await db.from("renewal_reminders").insert(row);
  return error;
}

// Finds students who are due a reminder today and sends it. `db` is a Supabase client that may read profiles and write
// renewal_reminders (the admin's own client, or the service client for the daily job). Safe to run many times a day:
// each student gets each step once per end date.
export async function runReminders(db, { today, onlyIds } = {}) {
  const out = { ok: true, sent: 0, failed: 0, skipped: 0, already: 0, remaining: 0, items: [] };
  let q = db.from("profiles").select("id,full_name,phone,access_until,access_plan,access_status,role")
    .eq("role", "student").not("access_until", "is", null)
    .gte("access_until", addDays(today, -7)).lte("access_until", addDays(today, 7));
  if (onlyIds?.length) q = q.in("id", onlyIds);
  const { data: people, error } = await q;
  if (error) return { ...out, ok: false, error: "Could not read students: " + error.message };

  const due = [];
  for (const p of people || []) {
    if (p.access_status === "revoked") continue; // paused on purpose, so no reminder
    const left = daysBetween(today, p.access_until);
    const stage = stageFor(left);
    if (stage) due.push({ p, left, stage });
  }
  if (!due.length) return out;

  // What has already been sent (or has failed too often) for these students.
  const prior = [];
  for (const ids of chunk(due.map((d) => d.p.id), 80)) {
    const { data, error: e } = await db.from("renewal_reminders").select("student_id,access_until,stage,status").in("student_id", ids);
    if (missing(e)) return { ...out, ok: false, setup: true, error: SETUP_MSG };
    if (e) return { ...out, ok: false, error: "Could not read the reminder log: " + e.message };
    prior.push(...(data || []));
  }
  const key = (id, until, stage) => `${id}|${until}|${stage}`;
  const sentSet = new Set(), failCount = {};
  for (const r of prior) {
    const k = key(r.student_id, r.access_until, r.stage);
    if (r.status === "sent") sentSet.add(k); else failCount[k] = (failCount[k] || 0) + 1;
  }

  const todo = [];
  for (const d of due) {
    const k = key(d.p.id, d.p.access_until, d.stage);
    if (sentSet.has(k)) { out.already++; continue; }
    if ((failCount[k] || 0) >= MAX_FAILED_TRIES) { out.skipped++; out.items.push({ name: d.p.full_name, status: "gave up", note: "Failed " + MAX_FAILED_TRIES + " times already." }); continue; }
    todo.push({ ...d, k });
  }
  if (todo.length > MAX_PER_RUN) out.remaining = todo.length - MAX_PER_RUN;

  for (const group of chunk(todo.slice(0, MAX_PER_RUN), PARALLEL)) {
    await Promise.all(group.map(async ({ p, left, stage }) => {
      const r = await deliver(p, left);
      if (r.skipped) { // nothing was attempted: no phone, or sending not set up. Not logged, so it is retried once fixed.
        out.skipped++; out.items.push({ name: p.full_name, status: "skipped", note: r.error }); return;
      }
      const e = await log(db, { student_id: p.id, access_until: p.access_until, stage, channel: "whatsapp", status: r.ok ? "sent" : "failed", provider_id: r.id || null, error: r.ok ? null : String(r.error || "").slice(0, 300) });
      if (e?.code === "23505") { out.already++; return; } // another run sent it a moment ago
      if (r.ok) { out.sent++; out.items.push({ name: p.full_name, status: "sent" }); }
      else { out.failed++; out.items.push({ name: p.full_name, status: "failed", note: r.error }); }
    }));
  }
  return out;
}

// One-line summary of a run for the admin screen.
export function summarise(r) {
  if (!r.ok) return r.error || "Could not send reminders.";
  const bits = [];
  if (r.sent) bits.push(`${r.sent} sent`);
  if (r.failed) bits.push(`${r.failed} failed`);
  if (r.skipped) bits.push(`${r.skipped} skipped`);
  if (r.already) bits.push(`${r.already} already reminded`);
  if (!bits.length) return "Nobody needs a reminder right now.";
  let msg = "Reminders: " + bits.join(", ") + ".";
  const why = r.items.find((i) => i.status !== "sent" && i.note);
  if (why) msg += ` ${why.name || "A student"}: ${why.note}`;
  if (r.remaining) msg += ` ${r.remaining} more will go out on the next run.`;
  return msg;
}
