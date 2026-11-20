"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function FeedbackAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    try {
      const sb = createClient();
      const { data, error } = await sb
        .from("feedback")
        .select("id, student_name, message, rating, featured, created_at")
        .order("created_at", { ascending: false });
      if (error) {
        setMsg("Feedback table not ready. Run supabase/add-materials-feedback.sql");
        setItems([]);
      } else {
        setItems(data || []);
        setMsg("");
      }
    } catch {
      setMsg("Could not load feedback.");
      setItems([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleFeatured(id, current) {
    const sb = createClient();
    await sb.from("feedback").update({ featured: !current }).eq("id", id);
    setItems((list) => list.map((x) => (x.id === id ? { ...x, featured: !current } : x)));
  }

  return (
    <div className="card" id="feedback-admin">
      <h3>Student feedback</h3>
      <p className="m" style={{ margin: "0 0 12px" }}>
        Toggle “Show on homepage” to feature a review on the public site.
      </p>
      {loading && <p className="m">Loading…</p>}
      {msg && <p className="adm-msg bad">{msg}</p>}
      {!loading && !items.length && !msg && (
        <p className="m">No feedback yet. Students submit from the portal sidebar.</p>
      )}
      <div className="adm-list">
        {items.map((f) => (
          <div className="adm-item" key={f.id}>
            <div className="adm-item-main">
              <span>
                <b>{f.student_name || "Student"}</b>{" "}
                <span className="m">
                  · {f.rating}/5 · {new Date(f.created_at).toLocaleDateString()}
                </span>
                <br />
                <span style={{ fontSize: 14 }}>{f.message}</span>
              </span>
              <button
                type="button"
                className={"btn sm" + (f.featured ? "" : " ghost")}
                onClick={() => toggleFeatured(f.id, f.featured)}
              >
                {f.featured ? "On homepage" : "Show on homepage"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
