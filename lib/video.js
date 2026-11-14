// Turns a pasted video link into a safe embed address. Only YouTube, Vimeo and Google Drive are embedded.
// Any other link returns null and is shown as an "Open video" button instead.
export function videoEmbed(url) {
  try {
    const u = new URL(url);
    const h = u.hostname.replace(/^www\./, "");
    let id = null;
    if (h === "youtu.be") id = u.pathname.slice(1);
    else if (h === "youtube.com" || h === "m.youtube.com" || h === "youtube-nocookie.com") {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else { const m = u.pathname.match(/^\/(embed|shorts|live)\/([\w-]+)/); if (m) id = m[2]; }
    }
    if (id && /^[\w-]{6,20}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;
    if (h === "vimeo.com") { const m = u.pathname.match(/^\/(\d+)/); if (m) return `https://player.vimeo.com/video/${m[1]}`; }
    if (h === "drive.google.com") { const m = u.pathname.match(/^\/file\/d\/([\w-]+)/); if (m) return `https://drive.google.com/file/d/${m[1]}/preview`; }
  } catch {}
  return null;
}

export const isHttpUrl = (v) => { try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:"; } catch { return false; } };
