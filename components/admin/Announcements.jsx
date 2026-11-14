"use client";
import ActionForm from "./ActionForm";
import { postAnnouncement, deleteAnnouncement } from "../../app/admin/actions";

const dateOf = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function Announcements({ items, missing }) {
  return (
    <div className="card" id="announcements">
      <h3>Announcements</h3>
      <p className="m" style={{ margin: "0 0 8px" }}>Messages students see on their portal dashboard, for example a holiday or a new class time.</p>
      {missing && <p className="adm-msg bad">Announcements are not set up yet. Run <code>supabase/add-announcements.sql</code> in the Supabase SQL Editor, then refresh this page.</p>}
      <ActionForm action={postAnnouncement} label="Post announcement" busy="Posting..." className="form adm-edit">
        <label>Title</label>
        <input name="title" maxLength={100} required placeholder="No classes on Monday" />
        <label>Message <span className="m">optional</span></label>
        <textarea name="body" maxLength={1000} rows={3} placeholder="Classes resume on Tuesday at 10:00 AM." />
        <div style={{ height: 10 }} />
      </ActionForm>
      {!missing && !items.length && <p className="m" style={{ marginTop: 12 }}>No announcements yet.</p>}
      {items.map((a) => (
        <div className="adm-item" key={a.id}>
          <div className="adm-item-main">
            <span><b>{a.title}</b> <span className="m">{dateOf(a.created_at)}</span>{a.body && <span className="m" style={{ display: "block", marginTop: 2 }}>{a.body}</span>}</span>
            <ActionForm action={deleteAnnouncement} label="Delete" busy="..." cls="btn danger sm" confirm="Delete this announcement?" className="adm-inline">
              <input type="hidden" name="id" value={a.id} />
            </ActionForm>
          </div>
        </div>
      ))}
    </div>
  );
}
