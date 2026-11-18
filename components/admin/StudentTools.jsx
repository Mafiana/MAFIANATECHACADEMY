"use client";
import { useRef, useState } from "react";
import ActionForm from "./ActionForm";
import Avatar from "../Avatar";
import { CopyModal } from "../Modal";
import { resizeImage } from "../../lib/resizeImage";
import { deleteStudent, setAvatar, updateStudent } from "../../app/admin/actions";

// The student's saved Access PIN, always visible here (copy it any time).
export function SavedPin({ pin }) {
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(pin); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { setManual(true); }
  };
  if (!pin) return <p className="m" style={{ margin: "0 0 8px" }}>No PIN is saved for this student. Press “New PIN” to issue one and it will stay here.</p>;
  return (
    <div className="adm-pinbox">
      <span className="m">Saved PIN</span>
      <code>{pin}</code>
      <button type="button" className="btn ghost sm" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
      <CopyModal open={manual} title="Copy this PIN" text={pin} onClose={() => setManual(false)} />
    </div>
  );
}

function PhotoEditor({ s }) {
  const [url, setUrl] = useState(s.avatar);
  const [msg, setMsg] = useState({ ok: null, text: "" });
  const [busy, setBusy] = useState(false);
  const input = useRef(null);

  async function send(fd) {
    setBusy(true); setMsg({ ok: null, text: "" });
    try { const r = await setAvatar(null, fd); setMsg({ ok: r.ok, text: r.msg }); if (r.ok) setUrl(r.url || ""); }
    catch { setMsg({ ok: false, text: "Could not upload. Try again." }); }
    setBusy(false);
  }
  async function pick(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      const blob = await resizeImage(f, 480, 0.88, true);
      const fd = new FormData();
      fd.set("student", s.id);
      fd.set("photo", new File([blob], "photo.jpg", { type: "image/jpeg" }));
      await send(fd);
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  }
  function remove() {
    const fd = new FormData();
    fd.set("student", s.id); fd.set("remove", "1");
    send(fd);
  }
  return (
    <div>
      <div className="adm-avatar-row">
        <Avatar name={s.name || s.label} src={url} size={72} />
        <div className="adm-acts">
          <input ref={input} type="file" accept="image/*" hidden onChange={pick} />
          <button type="button" className="btn sm" disabled={busy} onClick={() => input.current?.click()}>{busy ? "Uploading..." : url ? "Change picture" : "Add picture"}</button>
          {url && <button type="button" className="btn ghost sm" disabled={busy} onClick={remove}>Remove</button>}
        </div>
      </div>
      {msg.text && <p className={"adm-msg " + (msg.ok ? "ok" : "bad")} role={msg.ok ? "status" : "alert"}>{msg.text}</p>}
    </div>
  );
}

export default function StudentTools({ s }) {
  return (
    <div className="adm-tools">
      <div>
        <h4>Profile</h4>
        <PhotoEditor s={s} />
        <ActionForm action={updateStudent} label="Save name and phone" busy="Saving..." className="form adm-edit" reset={false}>
          <input type="hidden" name="student" value={s.id} />
          <label>Full name</label>
          <input name="name" required minLength={2} maxLength={80} defaultValue={s.name} autoComplete="off" />
          <label>Phone number <span className="m">optional</span></label>
          <input name="phone" type="tel" maxLength={30} defaultValue={s.phone} autoComplete="off" />
          <div style={{ height: 10 }} />
        </ActionForm>
      </div>
      <div className="adm-danger">
        <h4 style={{ marginTop: 0 }}>Delete student</h4>
        <p className="m" style={{ margin: "0 0 10px" }}>Removes {s.label}, their Access PIN, enrollments, payments, attendance and quiz results for good. This cannot be undone.</p>
        <ActionForm action={deleteStudent} label="Delete student" busy="Deleting..." cls="btn danger sm" className="adm-inline" confirmTitle="Delete student?" confirm={"Delete " + s.label + " permanently? Their PIN stops working and all their records are removed. This cannot be undone."}>
          <input type="hidden" name="student" value={s.id} />
        </ActionForm>
      </div>
    </div>
  );
}
