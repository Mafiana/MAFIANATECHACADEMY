"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "../../components/AuthShell";
import { createClient } from "../../lib/supabase/client";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function GoogleG() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z" />
    </svg>
  );
}

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState("signin"); // signin | signup | forgot
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState({ text: "", ok: false });
  const [busy, setBusy] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const switchTo = (m) => (e) => { e.preventDefault(); setMode(m); setMsg({ text: "", ok: false }); };

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setMsg({ text: "", ok: false });
    const supabase = createClient();
    const started = Date.now();

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(f.email, { redirectTo: `${location.origin}/auth/callback?next=/update-password` });
      setBusy(false);
      return setMsg(error ? { text: error.message, ok: false } : { text: "Check your email for a link to reset your password.", ok: true });
    }

    const res = mode === "signup"
      ? await supabase.auth.signUp({ email: f.email, password: f.password, options: { data: { full_name: f.name } } })
      : await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
    if (res.error) { setBusy(false); return setMsg({ text: res.error.message, ok: false }); }
    if (!res.data.session) { setBusy(false); return setMsg({ text: "Check your email to confirm your account, then log in.", ok: true }); }

    const { data: p } = await supabase.from("profiles").select("role").eq("id", res.data.user.id).single();
    await wait(Math.max(0, 1400 - (Date.now() - started))); // keep the loader visible for a moment
    setRedirecting(true);
    router.push(p?.role === "admin" ? "/admin" : "/portal");
    router.refresh();
  }

  async function google() {
    setBusy(true);
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback?next=/portal` } });
    if (error) { setBusy(false); setMsg({ text: error.message, ok: false }); }
  }

  const titles = { signin: ["Welcome back", "Please enter your details"], signup: ["Create your account", "Join MAFIANA Tech Academy as a student"], forgot: ["Reset password", "We will email you a reset link"] };

  return (
    <AuthShell title={titles[mode][0]} subtitle={titles[mode][1]}>
      <form className="form auth-form" onSubmit={submit}>
        {mode === "signup" && (<><label htmlFor="n">Full name</label><input id="n" required autoComplete="name" value={f.name} onChange={set("name")} /></>)}
        <label htmlFor="e">Email address</label>
        <input id="e" type="email" required autoComplete="email" value={f.email} onChange={set("email")} />
        {mode !== "forgot" && (<>
          <label htmlFor="p">Password</label>
          <input id="p" type="password" minLength={6} required autoComplete={mode === "signup" ? "new-password" : "current-password"} value={f.password} onChange={set("password")} />
        </>)}
        {mode === "signin" && <div className="auth-row"><a href="#" onClick={switchTo("forgot")}>Forgot password?</a></div>}
        <button className="btn auth-btn" disabled={busy}>
          {busy ? <><span className="spin" aria-hidden="true" /> Please wait</> : mode === "signin" ? "Sign in" : mode === "signup" ? "Sign up" : "Send reset link"}
        </button>
        {mode !== "forgot" && (<>
          <div className="auth-or"><span>or</span></div>
          <button type="button" className="auth-google" onClick={google} disabled={busy}><GoogleG /> Sign in with Google</button>
        </>)}
        {msg.text && <p className={"auth-msg" + (msg.ok ? " ok" : "")} role="alert">{msg.text}</p>}
        <p className="auth-switch">
          {mode === "signin" ? <>Don’t have an account? <a href="#" onClick={switchTo("signup")}>Sign up</a></> : <>Already a student? <a href="#" onClick={switchTo("signin")}>Sign in</a></>}
        </p>
        {mode === "signup" && <p className="auth-switch">By signing up you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.</p>}
      </form>
      {redirecting && <div className="auth-loading" role="status"><span className="spin big" /><p>Signing you in...</p></div>}
    </AuthShell>
  );
}
