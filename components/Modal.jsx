"use client";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Base modal. Closes on Escape or a click outside, locks page scroll, keeps keyboard focus inside and puts it back when closed.
// Replaces the browser's own alert / confirm / prompt boxes.
export function Modal({ open, title, onClose, children, actions, size = "sm" }) {
  const box = useRef(null);
  const titleId = useId();
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    if (!open) return;
    const before = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = box.current?.querySelector("[data-autofocus]") || box.current?.querySelector(FOCUSABLE);
    first?.focus();
    function onKey(e) {
      if (e.key === "Escape") { e.stopPropagation(); close.current?.(); return; }
      if (e.key !== "Tab" || !box.current) return;
      const items = [...box.current.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const a = items[0], z = items[items.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prev;
      if (before && typeof before.focus === "function" && document.contains(before)) before.focus();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="mdl-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div ref={box} className={"mdl " + size} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h3 id={titleId} className="mdl-title">{title}</h3>
        <div className="mdl-body">{children}</div>
        {actions && <div className="mdl-actions">{actions}</div>}
      </div>
    </div>,
    document.body
  );
}

// "Are you sure?" box with Cancel and a confirm button. Use danger for destructive actions.
export function ConfirmModal({ open, title = "Please confirm", message, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false, busy = false, onConfirm, onCancel }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      actions={
        <>
          <button type="button" className="btn ghost sm" onClick={onCancel} disabled={busy} data-autofocus>{cancelLabel}</button>
          <button type="button" className={"btn sm" + (danger ? " danger-fill" : "")} onClick={onConfirm} disabled={busy}>{busy ? <><span className="spin" aria-hidden="true" /> Please wait</> : confirmLabel}</button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
}

// A message with a single OK button.
export function NoticeModal({ open, title = "Notice", message, okLabel = "OK", onClose }) {
  return (
    <Modal open={open} title={title} onClose={onClose} actions={<button type="button" className="btn sm" onClick={onClose} data-autofocus>{okLabel}</button>}>
      <p>{message}</p>
    </Modal>
  );
}

// Asks for one line of text (like a link address).
export function PromptModal({ open, title, label, placeholder, initial = "", confirmLabel = "OK", cancelLabel = "Cancel", type = "text", onSubmit, onCancel }) {
  const [value, setValue] = useState(initial);
  useEffect(() => { if (open) setValue(initial); }, [open, initial]);
  const submit = (e) => { e?.preventDefault(); onSubmit?.(value.trim()); };
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      actions={
        <>
          <button type="button" className="btn ghost sm" onClick={onCancel}>{cancelLabel}</button>
          <button type="button" className="btn sm" onClick={submit}>{confirmLabel}</button>
        </>
      }
    >
      <form onSubmit={submit}>
        {label && <label className="mdl-label" htmlFor="mdl-input">{label}</label>}
        <input id="mdl-input" className="mdl-input" type={type} value={value} placeholder={placeholder} onChange={(e) => setValue(e.target.value)} data-autofocus autoComplete="off" />
      </form>
    </Modal>
  );
}

// Shown when the browser blocks copying: the text is selected so it can be copied by hand.
export function CopyModal({ open, title = "Copy this", text, onClose }) {
  const input = useRef(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!open) return;
    setCopied(false);
    const t = setTimeout(() => input.current?.select(), 30);
    return () => clearTimeout(t);
  }, [open]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); }
    catch { input.current?.select(); document.execCommand?.("copy"); setCopied(true); }
  };
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      actions={
        <>
          <button type="button" className="btn ghost sm" onClick={onClose}>Close</button>
          <button type="button" className="btn sm" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
        </>
      }
    >
      <input ref={input} className="mdl-input" readOnly value={text} onFocus={(e) => e.target.select()} data-autofocus aria-label={title} />
    </Modal>
  );
}
