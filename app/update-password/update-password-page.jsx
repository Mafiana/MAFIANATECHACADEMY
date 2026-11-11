"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "../../components/AuthShell";
import { createClient } from "../../lib/supabase/client";

export default function UpdatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setMsg("");
    const { error } = await createClient().auth.updateUser({ password });
    if (error) { setBusy(false); return setMsg(error.message); }
    router.push("/portal"); router.refresh();
  }

  return (
    <AuthShell title="Choose a new password" subtitle="Enter a new password for your account">
      <form className="form auth-form" onSubmit={submit}>
        <label htmlFor="np">New password</label>
        <input id="np" type="password" minLength={6} required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn auth-btn" disabled={busy}>{busy ? <><span className="spin" aria-hidden="true" /> Saving</> : "Save password"}</button>
        {msg && <p className="auth-msg" role="alert">{msg}</p>}
      </form>
    </AuthShell>
  );
}
