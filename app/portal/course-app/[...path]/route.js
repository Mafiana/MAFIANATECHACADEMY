import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "../../../../lib/supabase/server";

// Serves the Interactive Computer Science Course from /private so that only signed-in students can open it.
// /portal/* is already protected by middleware.js; the check below is a second lock in case that ever changes.
const ROOT = path.join(process.cwd(), "private", "computer-science-course");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

// Keeps only what the course app really stores, so nothing odd can be saved by hand-made requests.
const clamp = (n) => (Number.isInteger(n) ? Math.max(0, Math.min(100, n)) : 0);
function cleanProgress(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    if (/^\d{1,3}$/.test(k) && v && typeof v === "object") out[k] = { completed: v.completed === true, score: clamp(v.score) };
  }
  if (raw.finalTestPassed === true) out.finalTestPassed = true;
  if (Number.isInteger(raw.finalTestScore)) out.finalTestScore = clamp(raw.finalTestScore);
  if (typeof raw.studentName === "string") out.studentName = raw.studentName.slice(0, 80);
  return out;
}

// The course app saves each student's progress here (POST /portal/course-app/progress).
export async function POST(req, { params }) {
  if ((params.path || []).join("/") !== "progress") return new Response("Not found", { status: 404 });
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Please log in.", { status: 401 });
  let body;
  try { body = await req.json(); } catch { return new Response("Bad request", { status: 400 }); }
  const data = cleanProgress(body?.progress);
  if (!data) return new Response("Bad request", { status: 400 });
  if (Number.isInteger(body?.total) && body.total > 0 && body.total < 500) data._total = body.total;
  const { error } = await supabase.from("course_progress").upsert({ student_id: user.id, data, updated_at: new Date().toISOString() });
  return new Response(null, { status: error ? 204 : 200 }); // 204 = table not created yet; the course still works from the browser copy
}

export async function GET(_req, { params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Please log in.", { status: 401 });

  const rel = (params.path || []).join("/") || "index.html";
  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT + path.sep)) return new Response("Not found", { status: 404 });
  const type = TYPES[path.extname(file).toLowerCase()];
  if (!type) return new Response("Not found", { status: 404 });

  let body;
  try { body = await readFile(file); } catch { return new Response("Not found", { status: 404 }); }

  if (path.basename(file) === "index.html") {
    const [{ data: me }, { data: saved, error: pe }] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      supabase.from("course_progress").select("data").eq("student_id", user.id).maybeSingle(),
    ]);
    const esc = (o) => JSON.stringify(o).replace(/</g, "\\u003c");
    const student = esc({ id: user.id, name: me?.full_name || "" });
    let progress = "null"; // null = nothing saved on the server yet, so the app uses (and uploads) the browser copy
    if (!pe && saved?.data) { const { _total, ...rest } = saved.data; progress = esc(rest); }
    body = body.toString("utf8").replace('<script src="course-data.js">', `<script>window.MAF_STUDENT=${student};window.MAF_PROGRESS=${progress};</script>\n  <script src="course-data.js">`);
  }
  return new Response(body, { headers: { "Content-Type": type, "Cache-Control": "private, no-cache" } });
}
