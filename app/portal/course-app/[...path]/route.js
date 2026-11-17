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
    const { data: me } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
    const student = JSON.stringify({ id: user.id, name: me?.full_name || "" }).replace(/</g, "\\u003c");
    body = body.toString("utf8").replace('<script src="course-data.js">', `<script>window.MAF_STUDENT=${student};</script>\n  <script src="course-data.js">`);
  }
  return new Response(body, { headers: { "Content-Type": type, "Cache-Control": "private, no-cache" } });
}
