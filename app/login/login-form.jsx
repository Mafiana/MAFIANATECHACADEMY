"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "../../components/PasswordInput";
import AuthShell from "../../components/AuthShell";
import { createClient } from "../../lib/supabase/client";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

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
      // Keep the loader visible for at least 1.2s so the user always sees it
      await wait(Math.max(0, 1200 - (Date.now() - started)));
      setRedirecting(true);
      // Small extra delay so the "Opening the admin panel..." text is visible
      await wait(400);
      router.push("/admin");
      router.refresh();
    } catch {
      setBusy(false);
      setMsg("Could not reach the server. Check your internet connection and try again.");
    }
  }

  return (
    <AuthShell
      title="Sign in"
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
          disabled={busy || redirecting}
        />
        <label htmlFor="p">Password</label>
        <PasswordInput
          id="p"
          required
          autoComplete="current-password"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
          disabled={busy || redirecting}
        />
        <button className="btn auth-btn" disabled={busy || redirecting}>
          {busy || redirecting ? (
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
      </form>

      {/* Full-screen loader – always shown while busy or redirecting */}
      {(busy || redirecting) && (
        <div className="auth-loading" role="status" aria-live="polite">
          <span className="spin big" aria-hidden="true" />
          <p>{redirecting ? "Opening the admin panel..." : "Signing you in..."}</p>
        </div>
      )}
    </AuthShell>
  );
}
