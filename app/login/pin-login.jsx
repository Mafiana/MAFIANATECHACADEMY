"use client";
import { useFormState, useFormStatus } from "react-dom";
import PasswordInput from "../../components/PasswordInput";
import AuthShell from "../../components/AuthShell";
import { signInWithPin } from "./actions";

const NOTICES = {
  expired: "Your access has ended. Message the academy to renew your Access PIN.",
  revoked: "Your access has been paused. Please contact the academy.",
};

function Submit() {
  const { pending } = useFormStatus();
  return (
    <>
      <button className="btn auth-btn" disabled={pending}>
        {pending ? <><span className="spin" aria-hidden="true" /> Signing in</> : "Sign in"}
      </button>
      {pending && <div className="auth-loading" role="status"><span className="spin big" /><p>Signing you in...</p></div>}
    </>
  );
}

export default function PinLogin({ notice, whatsapp }) {
  const [state, action] = useFormState(signInWithPin, { msg: "" });
  const msg = state.msg || NOTICES[notice] || "";
  return (
    <AuthShell title="Student login" subtitle="Enter the Access PIN the academy gave you.">
      <form className="form auth-form" action={action}>
        <label htmlFor="pin">Access PIN</label>
        <PasswordInput id="pin" name="pin" className="pin-input" required autoComplete="off" autoCapitalize="characters" autoCorrect="off" spellCheck={false} maxLength={24} placeholder="MAF-XXXX-XXXX" />
        <p className="auth-hint">Type it exactly as printed. Capital letters and dashes do not matter.</p>
        <Submit />
        {msg && <p className="auth-msg" role="alert">{msg}</p>}
        <p className="auth-switch">
          No PIN yet or lost yours? {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer">Message the academy</a> : "Ask the academy"} and we will issue or renew it.
        </p>
        <p className="auth-switch"><a href="/admin">Admin login</a></p>
      </form>
    </AuthShell>
  );
}
