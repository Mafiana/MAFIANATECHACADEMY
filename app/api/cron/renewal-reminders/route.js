import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { serviceClient } from "../../../../lib/supabase/service";
import { lagosToday } from "../../../../lib/dates";
import { runReminders, whatsappConfigured } from "../../../../lib/reminders";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const same = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

// The daily job. Call it once a day (see the setup steps) with the header  Authorization: Bearer <CRON_SECRET>
// (or the address ending in ?key=<CRON_SECRET> for free cron sites that cannot set headers).
async function handle(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "CRON_SECRET is not set." }, { status: 503 });
  const auth = request.headers.get("authorization") || "";
  const given = auth.startsWith("Bearer ") ? auth.slice(7) : request.headers.get("x-cron-secret") || new URL(request.url).searchParams.get("key") || "";
  if (!given || !same(given, secret)) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 401 });

  if (!whatsappConfigured()) return NextResponse.json({ ok: false, skipped: "WhatsApp sending is not set up (TWILIO_* settings)." });
  try {
    const r = await runReminders(serviceClient(), { today: lagosToday() });
    return NextResponse.json({ ...r, items: r.items.map((i) => ({ status: i.status, note: i.note })) }); // no names in the response
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
