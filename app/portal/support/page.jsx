"use client";
import { useEffect, useState } from "react";
import PortalShell from "../../../components/portal/PortalShell";
import { createClient } from "../../../lib/supabase/client";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;
      const { data } = await sb
        .from("support_tickets")
        .select("*")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });
      setTickets(data || []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setBusy(true);
    setErr("");
    try {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) {
        setErr("You must be signed in.");
        setBusy(false);
        return;
      }
      const { data: p } = await sb.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
      const { error } = await sb.from("support_tickets").insert({
        student_id: user.id,
        student_name: p?.full_name || "Student",
        subject: subject.trim(),
        message: message.trim(),
      });
      if (error) {
        setErr(error.message || "Could not send. Make sure the support table exists.");
        setBusy(false);
        return;
      }
      setDone(true);
      setSubject("");
      setMessage("");
      load();
    } catch {
      setErr("Network error. Try again.");
    }
    setBusy(false);
  }

  return (
    <PortalShell active="support" role="student">
      <div>
        <h3 style={{ fontSize: 26 }}>Customer Support</h3>
        <span className="m" style={{ color: "var(--mute)" }}>
          Send a message to the academy. We reply here and you can also contact us on WhatsApp.
        </span>
      </div>

      <div className="card" style={{ maxWidth: 560, marginTop: 16 }}>
        {done ? (
          <p style={{ margin: 0 }}>
            Thank you! Your ticket has been sent. You can see replies below.
            <button type="button" className="btn ghost sm" style={{ marginLeft: 10 }} onClick={() => setDone(false)}>
              Send another
            </button>
          </p>
        ) : (
          <form className="form" onSubmit={submit}>
            <label htmlFor="sub">Subject</label>
            <input id="sub" required value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={100} placeholder="e.g. Access PIN, payment, lesson problem" />

            <label htmlFor="msg">Message</label>
            <textarea id="msg" rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue…" />

            <button className="btn" type="submit" disabled={busy} style={{ marginTop: 14 }}>
              {busy ? "Sending…" : "Send ticket"}
            </button>
            {err && <p className="adm-msg bad" role="alert" style={{ marginTop: 10 }}>{err}</p>}
          </form>
        )}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3>Your tickets</h3>
        {loading && <p className="m">Loading…</p>}
        {!loading && !tickets.length && <p className="m">No tickets yet.</p>}
        <div className="adm-list">
          {tickets.map((t) => (
            <div className="adm-item" key={t.id} style={{ flexDirection: "column", alignItems: "stretch", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <b>{t.subject}</b>
                <span className={"badge " + (t.status === "closed" ? "mute" : t.status === "replied" ? "ok" : "warn")}>
                  {t.status}
                </span>
              </div>
              <p className="m" style={{ margin: 0 }}>{t.message}</p>
              {t.admin_reply && (
                <div style={{ background: "var(--mint)", padding: "10px 12px", borderRadius: 10, marginTop: 4 }}>
                  <b style={{ fontSize: 13 }}>Academy reply</b>
                  <p style={{ margin: "4px 0 0", fontSize: 14 }}>{t.admin_reply}</p>
                </div>
              )}
              <span className="m" style={{ fontSize: 12 }}>{new Date(t.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
