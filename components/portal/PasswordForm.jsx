"use client";
import { useState } from "react";
import PasswordInput from "../PasswordInput";
import { createClient } from "../../lib/supabase/client";

export default function PasswordForm() {
  const [pw, setPw] = useState("");
  const [again, setAgain] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: false });

  async function submit(e) {
    e.preventDefault();
    if (pw.length < 6) return setMsg({ text: "Use at least 6 characters.", ok: false });
    if (pw !== again) return setMsg({ text: "The two passwords do not match.", ok: false });
    setBusy(true); setMsg({ text: "", ok: false });
    const { error } = await createClient().auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setMsg({ text: error.message, ok: false });
    setPw(""); setAgain("");
    setMsg({ text: "Password changed. Use the new one next time you log in.", ok: true });
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h3>Change password</h3>
      <label htmlFor="pw1">New password</label>
      <PasswordInput id="pw1" autoComplete="new-password" minLength={6} required value={pw} onChange={(e) => setPw(e.target.value)} />
      <label htmlFor="pw2">Type it again</label>
      <PasswordInput id="pw2" autoComplete="new-password" minLength={6} required value={again} onChange={(e) => setAgain(e.target.value)} />
      <button className="btn" disabled={busy} style={{ marginTop: 14 }}>{busy ? <><span className="spin" aria-hidden="true" /> Saving</> : "Change password"}</button>
      {msg.text && <p className={"adm-msg " + (msg.ok ? "ok" : "bad")} role={msg.ok ? "status" : "alert"}>{msg.text}</p>}
    </form>
  );
}
