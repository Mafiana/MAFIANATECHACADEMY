"use client";
import { useEffect, useState } from "react";

// Design-mode presence list. Later: track real sessions from Supabase / realtime.
const SEED = [
  { id: "1", name: "Amina Yusuf", role: "Student", page: "Portal · Lessons", mins: 2 },
  { id: "2", name: "Chidi Okeke", role: "Student", page: "Portal · Quiz", mins: 5 },
  { id: "3", name: "Tolu Adeyemi", role: "Student", page: "Courses", mins: 1 },
  { id: "4", name: "Stanley Mafiana", role: "Admin", page: "Admin panel", mins: 0 },
];

export default function OnlineAdmin() {
  const [people, setPeople] = useState(SEED);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setPeople((list) =>
      list.map((p) => ({
        ...p,
        mins: p.role === "Admin" ? 0 : Math.min(60, p.mins + (Math.random() > 0.5 ? 1 : 0)),
      }))
    );
  }, [tick]);

  return (
    <div className="card" id="online">
      <h3>
        Who is online <span className="m">({people.length})</span>
      </h3>
      <p className="m" style={{ margin: "0 0 12px" }}>
        Design preview. Live presence will use Supabase Realtime later.
      </p>
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
    </div>
  );
}