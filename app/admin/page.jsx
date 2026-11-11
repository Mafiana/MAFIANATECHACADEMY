import Shell from "../../components/Shell";
import { createClient } from "../../lib/supabase/server";
import { COURSE_NAMES, naira } from "../../lib/courses";
import { enroll, recordPayment, markAttendance, issueCertificate } from "./actions";

export const metadata = { title: "Admin | MAFIANA Tech Academy" };

export default async function Admin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") return <Shell><section><h2>Not allowed</h2><p className="sub">This page is for academy staff only.</p></section></Shell>;

  const [{ data: students = [] }, { data: enr = [] }, { data: pays = [] }] = await Promise.all([
    supabase.from("profiles").select("id,full_name,email").eq("role", "student").order("full_name"),
    supabase.from("enrollments").select("*"),
    supabase.from("payments").select("student_id,amount"),
  ]);
  const opts = students.map((s) => <option key={s.id} value={s.id}>{s.full_name || s.email}</option>);
  const name = (id) => students.find((s) => s.id === id)?.full_name || "";

  return (
    <Shell>
      <section>
        <h2>Admin</h2>
        <div className="card" style={{ overflowX: "auto" }}>
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
        </div>
        <div className="grid" style={{ marginTop: 16 }}>
          <form action={enroll} className="card form"><h3>Enroll a student</h3>
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
          <form action={markAttendance} className="card form"><h3>Today’s attendance</h3>
            <label>Student</label><select name="student" required>{opts}</select>
            <label>Status</label><select name="present"><option value="yes">Present</option><option value="no">Absent</option></select>
            <button className="btn" style={{ marginTop: 14 }}>Mark</button></form>
          <form action={issueCertificate} className="card form"><h3>Issue certificate</h3>
            <label>Enrollment</label>
            <select name="enrollment" required>{enr.filter((e) => !e.certificate_issued).map((e) => <option key={e.id} value={e.id}>{name(e.student_id)} · {e.course}</option>)}</select>
            <button className="btn" style={{ marginTop: 14 }}>Issue</button></form>
        </div>
      </section>
    </Shell>
  );
}
