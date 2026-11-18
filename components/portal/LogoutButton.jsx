"use client";
import { useRef, useState } from "react";
import Icon from "./Icons";
import { signOut } from "../../app/auth-actions";
import { ConfirmModal } from "../Modal";

// Log out button for the student portal. Asks first in a modal box, then signs out.
export default function LogoutButton() {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const form = useRef(null);

  return (
    <form ref={form} action={signOut}>
      <button className="lnk" type="button" onClick={() => setOpen(true)}>
        <Icon name="logout" />
        Log out
      </button>
      <ConfirmModal
        open={open}
        title="Log out?"
        message="You will need your Access PIN to sign back in."
        confirmLabel="Log out"
        busy={leaving}
        onCancel={() => setOpen(false)}
        onConfirm={() => { setLeaving(true); form.current?.requestSubmit(); }}
      />
    </form>
  );
}
