"use client";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import PinCard from "./PinCard";
import { ConfirmModal } from "../Modal";

function Submit({ label, busy, cls }) {
  const { pending } = useFormStatus();
  return (
    <button className={cls} disabled={pending}>
      {pending ? <><span className="spin" aria-hidden="true" /> {busy}</> : label}
    </button>
  );
}

// A form wired to a server action. Shows a saving spinner, then the success or error message the action returns.
export default function ActionForm({ action, children, label = "Save", busy = "Saving...", className = "", cls = "btn", reset = true, confirm, confirmTitle, hideMsg = false, onSuccess }) {
  const [state, formAction] = useFormState(action, { ok: null, msg: "" });
  const ref = useRef(null);
  const done = useRef(onSuccess);
  const [asking, setAsking] = useState(false);
  const approved = useRef(false);
  done.current = onSuccess;
  useEffect(() => {
    if (!state.ok) return;
    if (reset) ref.current?.reset();
    done.current?.();
  }, [state, reset]);
  return (
    <form
      ref={ref}
      action={formAction}
      className={className}
      onSubmit={confirm ? (e) => {
        if (approved.current) { approved.current = false; return; }
        e.preventDefault();
        setAsking(true);
      } : undefined}
    >
      {children}
      <Submit label={label} busy={busy} cls={cls} />
      {state.msg && !hideMsg && <p className={"adm-msg " + (state.ok ? "ok" : "bad")} role={state.ok ? "status" : "alert"}>{state.msg}</p>}
      {state.ok && state.card && <PinCard card={state.card} />}
      {confirm && (
        <ConfirmModal
          open={asking}
          title={confirmTitle || "Please confirm"}
          message={confirm}
          confirmLabel={label}
          danger={/danger/.test(cls)}
          onCancel={() => setAsking(false)}
          onConfirm={() => { setAsking(false); approved.current = true; ref.current?.requestSubmit(); }}
        />
      )}
    </form>
  );
}
