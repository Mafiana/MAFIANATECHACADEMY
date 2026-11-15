"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "../../components/PasswordInput";
import AuthShell from "../../components/AuthShell";
import { createClient } from "../../lib/supabase/client";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// TEMP design login — remove when Supabase admin is live
const TEMP_EMAIL = "admin@mafiana.test";
const TEMP_PASSWORD = "Admin123!";

export default function AdminLogin() {
  const router = useRouter();
  const [f, setF] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");

    const email = f.email.trim();
    const password = f.password;

    // Temporary bypass so you can design the admin UI without Supabase
    if (email === TEMP_EMAIL && password === TEMP_PASSWORD) {
      document.cookie = "temp_admin=1; path=/; max-age=86400; SameSite=Lax";
      setRedirecting(true);
      router.push("/admin");
      router.refresh();
      return;
    }

    try {
      const supabase = createClient();
      const started = Date.now();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data?.user) {
        setBusy(false);
        return setMsg(error?.message || "Could not sign in.");
      }
      const { data: p } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
      if (p?.role !== "admin") {
        await supabase.auth.signOut();
        setBusy(false);
        return setMsg(
          "This is not an admin account. Students and instructors sign in with an Access PIN on the student login."
        );
      }
      await wait(Math.max(0, 1200 - (Date.now() - started)));
      setRedirecting(true);
      router.push("/admin");
      router.refresh();
    } catch {
      setBusy(false);
      setMsg("Could not reach the server. Use the temporary design login if Supabase is not set up yet.");
    }
  }

  return (
    <AuthShell
      title="Admin login"
      subtitle="For the academy admin. Instructors sign in with their Access PIN on the student login."
    >
      <form className="form auth-form" onSubmit={submit}>
        <label htmlFor="e">Email address</label>
        <input
          id="e"
          type="email"
          required
          autoComplete="username"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
        />
        <label htmlFor="p">Password</label>
        <PasswordInput
          id="p"
          required
          autoComplete="current-password"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
        />
        <button className="btn auth-btn" disabled={busy}>
          {busy ? (
            <>
              <span className="spin" aria-hidden="true" /> Please wait
            </>
          ) : (
            "Sign in"
          )}
        </button>
        {msg && (
          <p className="auth-msg" role="alert">
            {msg}
          </p>
        )}
        <p className="auth-switch">
          Student or instructor? <a href="/login">Sign in with your Access PIN</a>
        </p>
        <p className="m" style={{ marginTop: 12, fontSize: 13 }}>
          Design mode: <code>admin@mafiana.test</code> / <code>Admin123!</code>
        </p>
      </form>
      {(busy || redirecting) && (
        <div className="auth-loading" role="status">
          <span className="spin big" />
          <p>{redirecting ? "Opening the admin panel..." : "Signing you in..."}</p>
        </div>
      )}
    </AuthShell>
  );
}