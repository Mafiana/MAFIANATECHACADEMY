// Cleans blog HTML written in the admin editor. Only simple formatting is kept; scripts, styles,
// event handlers and unsafe links or image addresses are removed.
const VOID = new Set(["br", "img"]);
const KEEP = new Set(["p", "h2", "h3", "ul", "ol", "li", "strong", "em", "u", "br", "a", "img", "blockquote"]);
const RENAME = { b: "strong", i: "em", div: "p", h1: "h2", h4: "h3", h5: "h3", h6: "h3" };
const DROP_WITH_CONTENT = new Set(["script", "style", "iframe", "object", "embed", "svg", "math", "template", "noscript"]);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const unesc = (s) => String(s).replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const attr = (src, name) => {
  const m = new RegExp("(?:^|\\s)" + name + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)')", "i").exec(src);
  return m ? unesc(m[1] ?? m[2]) : "";
};
const clean = (v) => v.replace(/[\u0000-\u001f\u007f\s]+/g, (m) => (m.length ? "" : m)).trim();

const safeHref = (v) => { const u = clean(v); return /^(https?:\/\/|mailto:|#|\/(?!\/))/i.test(u) ? u : ""; };
const safeSrc = (v) => { const u = clean(v); return /^(https:\/\/|\/(?!\/))/i.test(u) || /^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(u) ? u : ""; };

export const slugifyHeading = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const textOf = (h) => unesc(h.replace(/<[^>]*>/g, ""));

export function sanitizeHtml(input) {
  const html = String(input || "");
  const out = [];
  const stack = [];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^'">])*)>|([^<]+)|</g;
  let m, skip = null;
  while ((m = re.exec(html))) {
    if (m[4] !== undefined) { if (!skip) out.push(m[4].replace(/&(?![a-zA-Z]+;|#\d+;|#x[0-9a-fA-F]+;)/g, "&amp;").replace(/>/g, "&gt;")); continue; }
    if (!m[2]) { if (!skip && m[0] === "<") out.push("&lt;"); continue; }
    const closing = !!m[1];
    let name = m[2].toLowerCase();
    if (skip) { if (closing && name === skip) skip = null; continue; }
    if (DROP_WITH_CONTENT.has(name)) { if (!closing) skip = name; continue; }
    name = RENAME[name] || name;
    if (!KEEP.has(name)) continue;
    if (closing) {
      const i = stack.lastIndexOf(name);
      if (i >= 0) { while (stack.length > i) out.push(`</${stack.pop()}>`); }
      continue;
    }
    if (name === "a") {
      const href = safeHref(attr(m[3], "href"));
      if (!href) { out.push("<a>"); }
      else out.push(`<a href="${esc(href)}"${/^https?:/i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : ""}>`);
      stack.push("a");
    } else if (name === "img") {
      const src = safeSrc(attr(m[3], "src"));
      if (src) out.push(`<img src="${esc(src)}" alt="${esc(attr(m[3], "alt").slice(0, 160))}" loading="lazy">`);
    } else if (VOID.has(name)) out.push(`<${name}>`);
    else { out.push(`<${name}>`); stack.push(name); }
  }
  while (stack.length) out.push(`</${stack.pop()}>`);
  return out.join("").replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner) => `<h2 id="${slugifyHeading(textOf(inner))}">${inner}</h2>`);
}

export const headingsOf = (html) => [...String(html || "").matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((x) => textOf(x[1])).filter(Boolean);
export const wordCount = (html) => textOf(String(html || "")).split(/\s+/).filter(Boolean).length;
