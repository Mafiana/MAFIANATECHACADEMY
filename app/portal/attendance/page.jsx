import PortalShell from "../../../components/portal/PortalShell";
import { getPortalData, fmtDate } from "../../../lib/portalData";

export const metadata = { title: "Attendance | MAFIANA Tech Academy" };

export default async function Attendance() {
  const d = await getPortalData();
  // Group the days by month, newest first.
  const months = [];
  d.attendance.forEach((a) => {
    const label = fmtDate(a.class_date, { month: "long", year: "numeric" });
    let g = months.find((m) => m.label === label);
    if (!g) months.push((g = { label, rows: [] }));
    g.rows.push(a);
  });
  return (
    <PortalShell active="attendance" role={d.profile?.role}>
      <div><h3 style={{ fontSize: 26 }}>Attendance</h3><span className="m" style={{ color: "var(--mute)" }}>Every class your instructor has marked.</span></div>
      {d.error && <div className="adm-msg bad" role="alert">Some information could not be loaded. Please refresh the page.</div>}

      <div className="card">
        <div className="grid p-stats" style={{ marginBottom: 14 }}>
          <div><div className="m">Attendance</div><h3>{d.attendance.length ? d.pct + "%" : "–"}</h3></div>
          <div><div className="m">Present</div><h3>{d.present}</h3></div>
          <div><div className="m">Absent</div><h3>{d.absent}</h3></div>
        </div>
        <div className="pbar" aria-label={`${d.pct}% attendance`}><i style={{ width: d.pct + "%" }} /></div>
        {d.attendance.length > 0 && d.pct < 75 && <p className="adm-msg bad" style={{ marginTop: 12 }}>Your attendance is below 75%. Try not to miss more classes so you can finish and get your certificate.</p>}
      </div>

      {!d.attendance.length && <div className="card"><p className="m" style={{ margin: 0 }}>No attendance recorded yet. It appears here after your first class.</p></div>}
      {months.map((m) => (
        <div className="card" key={m.label}>
          <h3>{m.label}</h3>
          {m.rows.map((a) => (
            <div className="stat" key={a.id}><span>{fmtDate(a.class_date, { weekday: "long", day: "numeric", month: "short" })}</span><span className={"badge " + (a.present ? "ok" : "bad")}>{a.present ? "Present" : "Absent"}</span></div>
          ))}
        </div>
      ))}
    </PortalShell>
  );
}
