import { redirect } from "next/navigation";
import Greeting from "../../components/Greeting";
import Shell from "../../components/Shell";
import { createClient } from "../../lib/supabase/server";
import { fetchAll } from "../../lib/supabase/fetchAll";
import { buildStudents } from "../../lib/adminStats";
import { signOut } from "../auth-actions";
import { naira } from "../../lib/courses";
import Students from "../../components/admin/Students";
import EnrollForm from "../../components/admin/EnrollForm";
import PaymentForm from "../../components/admin/PaymentForm";
import Register from "../../components/admin/Register";
import Payments from "../../components/admin/Payments";
import Certificates from "../../components/admin/Certificates";
import Announcements from "../../components/admin/Announcements";
import Lessons from "../../components/admin/Lessons";
import Quizzes from "../../components/admin/Quizzes";

export const metadata = { title: "Admin panel | MAFIANA Tech Academy" };

export default async function Admin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");
  const { data: me, error: meErr } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (meErr && meErr.code !== "PGRST116") {
    return <Shell><section><h2>Could not load the admin panel</h2><p className="sub">The database could not be reached. Check your internet connection and refresh the page. If it keeps happening, check that your Supabase project is running.</p></section></Shell>;
  }
  if (me?.role !== "admin") redirect("/portal");

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" }); // YYYY-MM-DD
  const since = new Date(Date.now() - 120 * 864e5).toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });

  const [st, en, pa, at] = await Promise.all([
    fetchAll(() => supabase.from("profiles").select("id,full_name,email").eq("role", "student").order("full_name").order("id")),
    fetchAll(() => supabase.from("enrollments").select("*").order("id")),
    fetchAll(() => supabase.from("payments").select("*").order("id", { ascending: false })),
    fetchAll(() => supabase.from("attendance").select("student_id,class_date,present").gte("class_date", since).order("id")),
  ]);
  // Announcements are optional: a missing table just shows a setup hint instead of an error.
  const an = await supabase.from("announcements").select("id,title,body,created_at").order("created_at", { ascending: false }).limit(20);
  const annMissing = !!an.error;
  // Lessons and quizzes are optional too: if their tables are missing, the admin sees a setup hint instead.
  const [ls, qz, qa] = await Promise.all([
    fetchAll(() => supabase.from("lessons").select("*").order("course").order("position").order("id")),
    fetchAll(() => supabase.from("quizzes").select("id,course,title,questions").order("id", { ascending: false })),
    fetchAll(() => supabase.from("quiz_attempts").select("*").order("id", { ascending: false })),
  ]);
  const lqMissing = !!(ls.error || qz.error || qa.error);
  const errors = [st, en, pa, at].map((r) => r.error?.message).filter(Boolean);

  const rows = buildStudents({ students: st.data, enrollments: en.data, payments: pa.data, attendance: at.data });
  const byId = Object.fromEntries(rows.map((s) => [s.id, s]));
  const nameOf = (id) => byId[id]?.label || "Unknown";

  const owed = rows.reduce((a, s) => a + s.fees, 0);
  const collected = rows.reduce((a, s) => a + s.paid, 0);
  const owing = rows.filter((s) => s.balance > 0).sort((a, b) => b.balance - a.balance);

  const payments = pa.data.map((p) => ({ ...p, who: nameOf(p.student_id) }));
  const certs = en.data.map((e) => ({ id: e.id, course: e.course, who: nameOf(e.student_id), issued: e.certificate_issued, balance: byId[e.student_id]?.balance || 0 }));
  const quizzes = qz.data.map((z) => ({
    id: z.id, course: z.course, title: z.title, count: Array.isArray(z.questions) ? z.questions.length : 0,
    attempts: qa.data.filter((t) => t.quiz_id === z.id).map((t) => ({ id: t.id, who: nameOf(t.student_id), score: t.score, total: t.total, created_at: t.created_at })),
  }));
  const picks = rows.map((s) => ({ id: s.id, label: s.label, email: s.email }));
  const enr = en.data.map((e) => ({ student_id: e.student_id, course: e.course }));

  return (
    <Shell>
      <section style={{ paddingTop: 24 }}>
        <div className="portal">
          <aside>
            <b className="side-title">Admin panel</b>
            <a className="on" href="#overview">Overview</a>
            <a href="#students">Students</a>
            <a href="#enroll">Enroll and pay</a>
            <a href="#attendance">Class register</a>
            <a href="#payments">Payments</a>
            <a href="#certificates">Certificates</a>
            <a href="#lessons">Video lessons</a>
            <a href="#quizzes">Quizzes</a>
            <a href="#announcements">Announcements</a>
            <a href="/portal">My student view</a>
            <form action={signOut}><button className="lnk">Log out</button></form>
          </aside>
          <main>
            {errors.length > 0 && (
              <div className="adm-msg bad" role="alert">
                Some data could not be loaded: {errors[0]}. Check that you ran <code>supabase/schema.sql</code> in the Supabase SQL Editor.
              </div>
            )}
            <div className="p-hero" id="overview"><Greeting name="MAFIANA" badge="Admin" /></div>
            <div className="grid">
              <div className="card"><div className="m">Students</div><h3>{rows.length}</h3></div>
              <div className="card"><div className="m">Enrollments</div><h3>{en.data.length}</h3></div>
              <div className="card"><div className="m">Collected</div><h3>{naira(collected)}</h3></div>
              <div className="card"><div className="m">Outstanding</div><h3>{naira(Math.max(owed - collected, 0))}</h3><div className="m">{owing.length} student{owing.length === 1 ? "" : "s"} owing</div></div>
            </div>

            {owing.length > 0 && (
              <div className="card">
                <h3>Who owes the most</h3>
                {owing.slice(0, 5).map((s) => (
                  <div className="stat" key={s.id}><span>{s.label} <span className="m">{s.courses.join(", ")}</span></span><b>{naira(s.balance)}</b></div>
                ))}
              </div>
            )}

            <Students students={rows} />

            <div className="grid" id="enroll">
              <EnrollForm students={picks} />
              <PaymentForm students={picks} />
            </div>

            <Register students={picks} enrollments={enr} attendance={at.data} today={today} />
            <Payments payments={payments} />
            <Certificates pending={certs.filter((c) => !c.issued)} issued={certs.filter((c) => c.issued)} />
            <Lessons lessons={ls.data} missing={lqMissing} />
            <Quizzes quizzes={quizzes} missing={lqMissing} />
            <Announcements items={an.data || []} missing={annMissing} />
          </main>
        </div>
      </section>
    </Shell>
  );
}
