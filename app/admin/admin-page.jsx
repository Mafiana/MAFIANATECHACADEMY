import Shell from "../../components/Shell";
import { createClient } from "../../lib/supabase/server";
import { signOut } from "../auth-actions";
import { COURSE_NAMES, naira } from "../../lib/courses";
import { enroll, recordPayment, markAttendance, issueCertificate } from "./actions";

export const metadata = { title: "Admin panel | MAFIANA Tech Academy" };

export default async function Admin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") {
    return <Shell><section><h2>Not allowed</h2><p className="sub">This page is for academy staff only.</p><a className="btn" href="/portal">Go to student portal</a></section></Shell>;
  }

  const [{ data: st }, { data: en }, { data: pa }] = await Promise.all([
    supabase.from("profiles").select("id,full_name,email").eq("role", "student").order("full_name"),
    supabase.from("enrollments").select("*").order("created_at", { ascending: false }),
    supabase.from("payments").select("*").order("created_at", { ascending: false }),
  ]);
  const students = st || [], enr = en || [], pays = pa || [];
  const nameOf = (id) => { const s = students.find((x) => x.id === id); return s?.full_name || s?.email || "Unknown"; };
  const opts = students.map((s) => <option key={s.id} value={s.id}>{s.full_name || s.email}</option>);
  const owed = enr.reduce((a, e) => a + e.total_fee, 0);
  const collected = pays.reduce((a, p) => a + p.amount, 0);

  return (
    <Shell>
      <section style={{ paddingTop: 24 }}>
        <div className="portal">
          <aside>
            <b className="side-title">Admin panel</b>
            <a className="on" href="#overview">Overview</a>
            <a href="#students">Students</a>
            <a href="#enroll">Enroll</a>
            <a href="#payments">Payments</a>
            <a href="#attendance">Attendance</a>
            <a href="#certificates">Certificates</a>
            <a href="/portal">My student view</a>
            <form action={signOut}><button className="lnk">Log out</button></form>
          </aside>
          <main>
            <div id="overview"><h3 style={{ fontSize: 26 }}>Overview</h3></div>
            <div className="grid">
              <div className="card"><div className="m">Students</div><h3>{students.length}</h3></div>
              <div className="card"><div className="m">Enrollments</div><h3>{enr.length}</h3></div>
              <div className="card"><div className="m">Collected</div><h3>{naira(collected)}</h3></div>
              <div className="card"><div className="m">Outstanding</div><h3>{naira(Math.max(owed - collected, 0))}</h3></div>
            </div>

            <div className="card" id="students" style={{ overflowX: "auto" }}>
              <h3>Student records</h3>
              <table className="tbl">
                <thead><tr><th>Student</th><th>Courses</th><th>Fees</th><th>Paid</th></tr></thead>
                <tbody>{students.map((s) => {
                  const e = enr.filter((x) => x.student_id === s.id);
                  return <tr key={s.id}><td>{s.full_name || s.email}</td><td>{e.map((x) => x.course).join(", ") || "None"}</td>
                    <td>{naira(e.reduce((a, x) => a + x.total_fee, 0))}</td>
                    <td>{naira(pays.filter((p) => p.student_id === s.id).reduce((a, p) => a + p.amount, 0))}</td></tr>;
                })}</tbody>
              </table>
              {!students.length && <p className="m">No students yet. They appear here after they sign up.</p>}
            </div>

            <div className="grid">
              <form action={enroll} className="card form" id="enroll"><h3>Enroll a student</h3>
                <label>Student</label><select name="student" required>{opts}</select>
                <label>Course</label><select name="course">{COURSE_NAMES.map((c) => <option key={c}>{c}</option>)}</select>
                <label>Class type</label><select name="mode"><option>physical</option><option>online</option></select>
                <label>Course fee (₦)</label><input name="fee" type="number" min="0" required />
                <button className="btn" style={{ marginTop: 14 }}>Enroll</button></form>
              <form action={recordPayment} className="card form"><h3>Record payment</h3>
                <label>Student</label><select name="student" required>{opts}</select>
                <label>Amount (₦)</label><input name="amount" type="number" min="1" required />
                <label>Note</label><input name="note" placeholder="Seat fee, balance..." />
                <button className="btn" style={{ marginTop: 14 }}>Save payment</button></form>
              <form action={markAttendance} className="card form" id="attendance"><h3>Today’s attendance</h3>
                <label>Student</label><select name="student" required>{opts}</select>
                <label>Status</label><select name="present"><option value="yes">Present</option><option value="no">Absent</option></select>
                <button className="btn" style={{ marginTop: 14 }}>Mark</button></form>
              <form action={issueCertificate} className="card form" id="certificates"><h3>Issue certificate</h3>
                <label>Enrollment</label>
                <select name="enrollment" required>{enr.filter((e) => !e.certificate_issued).map((e) => <option key={e.id} value={e.id}>{nameOf(e.student_id)} · {e.course}</option>)}</select>
                <button className="btn" style={{ marginTop: 14 }}>Issue</button></form>
            </div>

            <div className="card" id="payments" style={{ overflowX: "auto" }}>
              <h3>Recent payments</h3>
              <table className="tbl">
                <thead><tr><th>Date</th><th>Student</th><th>Note</th><th>Amount</th></tr></thead>
                <tbody>{pays.slice(0, 10).map((p) => <tr key={p.id}><td>{new Date(p.created_at).toLocaleDateString("en-NG")}</td><td>{nameOf(p.student_id)}</td><td>{p.note || ""}</td><td>{naira(p.amount)}</td></tr>)}</tbody>
              </table>
              {!pays.length && <p className="m">No payments recorded yet.</p>}
            </div>
          </main>
        </div>
      </section>
    </Shell>
  );
}
