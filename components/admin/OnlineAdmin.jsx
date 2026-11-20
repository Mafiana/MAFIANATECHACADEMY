"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

/*
  Real presence using the `presence` table (see supabase/add-presence.sql).
  - Every signed-in user heartbeats every 25 s while a page is open.
  - This component reads rows that were updated in the last 2 minutes.
  - Falls back to a small seed list only when the table is empty / missing.
*/

const FALLBACK = [
  { id: "seed-1", name: "Amina Yusuf", role: "Student", page: "Portal · Lessons", mins: 2 },
  { id: "seed-2", name: "Chidi Okeke", role: "Student", page: "Portal · Quiz", mins: 5 },
  { id: "seed-3", name: "Tolu Adeyemi", role: "Student", page: "Courses", mins: 1 },
];

function minsAgo(iso) {
  if (!iso) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
}

export default function OnlineAdmin() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const sb = createClient();
    let alive = true;

    async function load() {
      try {
        // Rows updated in the last 2 minutes = currently online
        const cutoff = new Date(Date.now() - 2 * 60 * 1000).toISOString();
        const { data, error } = await sb
          .from("presence")
          .select("user_id, full_name, role, page, updated_at")
          .gte("updated_at", cutoff)
          .order("updated_at", { ascending: false });

        if (!alive) return;

        if (error || !data) {
          // Table missing or RLS – show fallback
          setPeople(FALLBACK);
          setLive(false);
        } else if (data.length === 0) {
          setPeople(FALLBACK);
          setLive(false);
        } else {
          setPeople(
            data.map((r) => ({
              id: r.user_id,
              name: r.full_name || "Student",
              role: r.role || "Student",
              page: r.page || "Portal",
              mins: minsAgo(r.updated_at),
            }))
          );
          setLive(true);
        }
      } catch {
        if (alive) {
          setPeople(FALLBACK);
          setLive(false);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    const t = setInterval(load, 20000); // refresh every 20 s
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="card" id="online">
      <h3>
        Who is online <span className="m">({people.length})</span>
      </h3>
      <p className="m" style={{ margin: "0 0 12px" }}>
        {live
          ? "Live presence from signed-in students and staff (last 2 minutes)."
          : "Showing sample list. Run supabase/add-presence.sql and open the student portal to see real people."}
      </p>
      {loading ? (
        <p className="m">Checking…</p>
      ) : (
        <div className="adm-list">
          {people.map((p) => (
            <div className="adm-item" key={p.id}>
              <div className="adm-item-main">
                <span>
                  <span className="online-dot" aria-hidden="true" />
                  <b>{p.name}</b>{" "}
                  <span className="m">
                    {p.role} · {p.page}
                  </span>
                </span>
                <span className="m">{p.mins === 0 ? "Active now" : p.mins + " min ago"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
