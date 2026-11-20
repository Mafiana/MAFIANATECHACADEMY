"use client";
import { useState } from "react";
import PortalShell from "../../../components/portal/PortalShell";
import { createClient } from "../../../lib/supabase/client";

export default function FeedbackPage() {
  const [msg, setMsg] = useState("");
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!msg.trim()) return;
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
      const { error } = await sb.from("feedback").insert({
        student_id: user.id,
        student_name: p?.full_name || user.email?.split("@")[0] || "Student",
        message: msg.trim(),
        rating: Number(rating),
      });
      if (error) {
        setErr(error.message || "Could not send feedback. Make sure the feedback table exists.");
        setBusy(false);
        return;
      }
      setDone(true);
      setMsg("");
    } catch (ex) {
      setErr("Network error. Try again.");
    }
    setBusy(false);
  }

  return (
    <PortalShell active="feedback" role="student">
      <div>
        <h3 style={{ fontSize: 26 }}>Feedback</h3>
        <span className="m" style={{ color: "var(--mute)" }}>
          Tell us what you think. Good feedback can be shown on the homepage.
        </span>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        {done ? (
          <p style={{ margin: 0 }}>
            Thank you! Your feedback has been sent. The admin can choose to feature it on the homepage.
          </p>
        ) : (
          <form className="form" onSubmit={submit}>
            <label htmlFor="rating">Rating</label>
            <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value={5}>5 – Excellent</option>
              <option value={4}>4 – Good</option>
              <option value={3}>3 – Okay</option>
              <option value={2}>2 – Needs work</option>
              <option value={1}>1 – Poor</option>
            </select>

            <label htmlFor="fb">Your feedback</label>
            <textarea
              id="fb"
              rows={5}
              required
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="What did you like? What can we improve?"
            />

            <button className="btn" type="submit" disabled={busy} style={{ marginTop: 14 }}>
              {busy ? (
                <>
                  <span className="spin" aria-hidden="true" /> Sending…
                </>
              ) : (
                "Send feedback"
              )}
            </button>
            {err && (
              <p className="adm-msg bad" role="alert" style={{ marginTop: 10 }}>
                {err}
              </p>
            )}
          </form>
        )}
      </div>
    </PortalShell>
  );
}
