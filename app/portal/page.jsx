import Shell from "../../components/Shell";
import { createClient } from "../../lib/supabase/server";
import { signOut } from "../auth-actions";
import { naira } from "../../lib/courses";

export const metadata = { title: "Student portal | MAFIANA Tech Academy" };

export default async function Portal() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile }, { data: enr }, { data: pays }, { data: att }] = await Promise.all([
    supabase.from("profiles").select("full_name,role").eq("id", user.id).single(),
    supabase.from("enrollments").select("*").eq("student_id", user.id).order("created_at"),
    supabase.from("payments").select("*").eq("student_id", user.id).order("created_at", { ascending: false }),
    supabase.from("attendance").select("*").eq("student_id", user.id).order("class_date", { ascending: false }),
  ]);
  const E = enr || [], P = pays || [], A = att || [];
  const total = E.reduce((s, e) => s + e.total_fee, 0);
  const paid = P.reduce((s, p) => s + p.amount, 0);
  const present = A.filter((a) => a.present).length;
  const pct = A.length ? Math.round((present / A.length) * 100) : 0;

  return (
    <Shell>
      <section style={{ paddingTop: 24 }}>
        <div className="portal">
          <aside>
            <b className="side-title">Student portal</b>
            <a className="on" href="#overview">Dashboard</a>
            <a href="#my-courses">My courses</a>
            <a href="#payments">Payments</a>
            <a href="#attendance">Attendance</a>
            {profile?.role === "admin" && <a href="/admin">Admin panel</a>}
            <form action={signOut}><button className="lnk">Log out</button></form>
          </aside>
          <main>
            <div id="overview">
              <h3 style={{ fontSize: 26 }}>Welcome back, {profile?.full_name || "student"}</h3>
              <span className="m" style={{ color: "var(--mute)" }}>Here is where you stand.</span>
            </div>
            <div className="grid">
              <div className="card"><div className="m">Fees paid</div><h3>{naira(paid)}</h3><div className="m">Total {naira(total)}</div></div>
              <div className="card"><div className="m">Balance</div><h3>{naira(Math.max(total - paid, 0))}</h3></div>
              <div className="card"><div className="m">Attendance</div><h3>{pct}%</h3><div className="m">{present} of {A.length} classes</div></div>
            </div>
            <div className="card" id="my-courses"><h3>My courses</h3>
              {E.length ? E.map((e) => <div className="stat" key={e.id}><span>{e.course} ({e.mode})</span><b>{e.certificate_issued ? "Certificate issued" : "In progress"}</b></div>)
                : <p className="m">No course yet. Ask the admission office to enroll you.</p>}
            </div>
            <div className="card" id="payments"><h3>Payment history</h3>
              {P.length ? P.map((p) => <div className="stat" key={p.id}><span>{new Date(p.created_at).toLocaleDateString("en-NG")} {p.note || ""}</span><b>{naira(p.amount)}</b></div>)
                : <p className="m">No payments recorded yet.</p>}
            </div>
            <div className="card" id="attendance"><h3>Attendance</h3>
              {A.length ? A.slice(0, 10).map((a) => <div className="stat" key={a.id}><span>{new Date(a.class_date).toLocaleDateString("en-NG")}</span><b>{a.present ? "Present" : "Absent"}</b></div>)
                : <p className="m">No attendance recorded yet.</p>}
            </div>
          </main>
        </div>
      </section>
    </Shell>
  );
}
