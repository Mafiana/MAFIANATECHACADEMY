"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function SupportAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [replying, setReplying] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const sb = createClient();
      const { data, error } = await sb
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        setMsg("Support table not ready. Run supabase/add-ebooks-support.sql");
        setItems([]);
      } else {
        setItems(data || []);
        setMsg("");
      }
    } catch {
      setMsg("Could not load tickets.");
      setItems([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function sendReply(id) {
    if (!replyText.trim()) return;
    setBusy(true);
    const sb = createClient();
    await sb
      .from("support_tickets")
      .update({ admin_reply: replyText.trim(), status: "replied", updated_at: new Date().toISOString() })
      .eq("id", id);
    setReplying(null);
    setReplyText("");
    setBusy(false);
    load();
  }

  async function setStatus(id, status) {
    const sb = createClient();
    await sb.from("support_tickets").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    load();
  }

  return (
    <div className="card" id="support-admin">
      <h3>Customer Support</h3>
      <p className="m" style={{ margin: "0 0 12px" }}>
        Tickets sent by students from the portal.
      </p>
      {loading && <p className="m">Loading…</p>}
      {msg && <p className="adm-msg bad">{msg}</p>}
      {!loading && !items.length && !msg && <p className="m">No support tickets yet.</p>}

      <div className="adm-list">
        {items.map((t) => (
          <div className="adm-item" key={t.id} style={{ flexDirection: "column", alignItems: "stretch", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <div>
                <b>{t.subject}</b>
                <span className="m"> · {t.student_name || "Student"}</span>
              </div>
              <span className={"badge " + (t.status === "closed" ? "mute" : t.status === "replied" ? "ok" : "warn")}>
                {t.status}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 14 }}>{t.message}</p>
            {t.admin_reply && (
              <div style={{ background: "var(--mint)", padding: "8px 12px", borderRadius: 8, fontSize: 14 }}>
                <b>Your reply:</b> {t.admin_reply}
              </div>
            )}
            <div className="adm-acts">
              {replying === t.id ? (
                <>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply…"
                    style={{ width: "100%", marginBottom: 8 }}
                  />
                  <button type="button" className="btn sm" disabled={busy} onClick={() => sendReply(t.id)}>
                    {busy ? "Sending…" : "Send reply"}
                  </button>
                  <button type="button" className="btn ghost sm" onClick={() => setReplying(null)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn ghost sm" onClick={() => { setReplying(t.id); setReplyText(t.admin_reply || ""); }}>
                    {t.admin_reply ? "Edit reply" : "Reply"}
                  </button>
                  {t.status !== "closed" && (
                    <button type="button" className="btn ghost sm" onClick={() => setStatus(t.id, "closed")}>
                      Close
                    </button>
                  )}
                  {t.status === "closed" && (
                    <button type="button" className="btn ghost sm" onClick={() => setStatus(t.id, "open")}>
                      Re-open
                    </button>
                  )}
                </>
              )}
            </div>
            <span className="m" style={{ fontSize: 12 }}>{new Date(t.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
