import { redirect } from "next/navigation";
import Shell from "../../components/Shell";
import Greeting from "../../components/Greeting";
import AdminMenuButton from "../../components/admin/AdminMenuButton";
import AddStudent from "../../components/admin/AddStudent";
import Students from "../../components/admin/Students";
import EnrollForm from "../../components/admin/EnrollForm";
import Register from "../../components/admin/Register";
import Certificates from "../../components/admin/Certificates";
import Lessons from "../../components/admin/Lessons";
import Quizzes from "../../components/admin/Quizzes";
import Announcements from "../../components/admin/Announcements";
import Staff from "../../components/admin/Staff";
import BlogAdmin from "../../components/admin/BlogAdmin";
import ShopAdmin from "../../components/admin/ShopAdmin";
import CoursesAdmin from "../../components/admin/CoursesAdmin";
import OnlineAdmin from "../../components/admin/OnlineAdmin";
import { createClient } from "../../lib/supabase/server";
import { fetchAll } from "../../lib/supabase/fetchAll";
import { naira } from "../../lib/courses";
import { accessSummary } from "../../lib/access";
import { lagosToday, prettyDate } from "../../lib/dates";
import { signOut } from "../auth-actions";

export const metadata = { title: "Admin panel | MAFIANA Tech Academy" };
export const dynamic = "force-dynamic";

function who(p) {
  return p?.full_name || p?.email || p?.phone || p?.student_code || "Student";
}

function subLine(p) {
  const bits = [p.student_code, p.phone, p.email].filter(Boolean);
  return bits.join(" · ");
}

export default async function Admin() {
  const s = createClient();
  const {
    data: { user },
  } = await s.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: me } = await s.from("profiles").select("role, full_name").eq("id", user.id).single();
  if (me?.role !== "admin") redirect("/login?next=/admin");

  const today = lagosToday();
  const errors = [];

  // ---- Load data (tolerate missing tables) ----
  const [profRes, enRes, payRes, attRes, lesRes, quizRes, annRes] = await Promise.all([
    fetchAll(() => s.from("profiles").select("*").order("created_at", { ascending: false })),
    fetchAll(() => s.from("enrollments").select("*").order("id", { ascending: false })),
    fetchAll(() => s.from("payments").select("*").order("id", { ascending: false })),
    fetchAll(() => s.from("attendance").select("*").order("class_date", { ascending: false })),
    s.from("lessons").select("*").order("course").order("position"),
    s.from("quizzes").select("id, course, title, questions, created_at").order("id", { ascending: false }),
    s.from("announcements").select("*").order("id", { ascending: false }),
  ]);

  if (profRes.error) errors.push("profiles: " + profRes.error.message);
  if (enRes.error) errors.push("enrollments: " + enRes.error.message);
  if (payRes.error) errors.push("payments: " + payRes.error.message);
  if (attRes.error) errors.push("attendance: " + attRes.error.message);

  const profiles = profRes.data || [];
  const enrollments = enRes.data || [];
  const payments = payRes.data || [];
  const attendance = attRes.data || [];

  const lessons = lesRes.error ? [] : lesRes.data || [];
  const quizzes = quizRes.error ? [] : quizRes.data || [];
  const announcements = annRes.error ? [] : annRes.data || [];
  const lqMissing = !!(lesRes.error || quizRes.error);
  const annMissing = !!annRes.error;

  const byId = Object.fromEntries(profiles.map((p) => [p.id, p]));

  // Students only (not admin/instructor)
  const studentProfiles = profiles.filter((p) => !p.role || p.role === "student");
  const instructors = profiles
    .filter((p) => p.role === "instructor")
    .map((p) => ({
      id: p.id,
      label: who(p),
      sub: subLine(p),
      paused: p.access_status === "revoked",
    }));

  // Group related rows per student
  const enByStudent = {};
  for (const e of enrollments) {
    (enByStudent[e.student_id] ||= []).push(e);
  }
  const payByStudent = {};
  for (const p of payments) {
    (payByStudent[p.student_id] ||= []).push(p);
  }
  const attByStudent = {};
  for (const a of attendance) {
    (attByStudent[a.student_id] ||= []).push(a);
  }

  const rows = studentProfiles.map((p) => {
    const ens = enByStudent[p.id] || [];
    const pays = payByStudent[p.id] || [];
    const atts = attByStudent[p.id] || [];
    const fees = ens.reduce((n, e) => n + (Number(e.total_fee) || 0), 0);
    const paid = pays.reduce((n, x) => n + (Number(x.amount) || 0), 0);
    const balance = fees - paid;
    const present = atts.filter((a) => a.present).length;
    const total = atts.length;
    const pct = total ? Math.round((present / total) * 100) : 0;
    let status = "none";
    if (ens.length) {
      if (balance <= 0) status = "paid";
      else if (paid > 0) status = "part";
      else status = "owing";
    }
    return {
      id: p.id,
      label: who(p),
      sub: subLine(p),
      code: p.student_code || "",
      courses: [...new Set(ens.map((e) => e.course))],
      fees,
      paid,
      balance,
      status,
      present,
      total,
      pct,
      lessonsDone: 0,
      lessonsTotal: 0,
      accessUntil: p.access_until || null,
      accessStatus: p.access_status || "active",
      accessPlan: p.access_plan || "",
      enrollments: ens,
      payments: pays,
    };
  });

  const picks = rows.map((r) => ({ id: r.id, label: r.label, sub: r.sub }));
  const enr = enrollments.map((e) => ({
    id: e.id,
    student_id: e.student_id,
    course: e.course,
    mode: e.mode,
    who: who(byId[e.student_id]),
  }));

  const certs = enrollments.map((e) => ({
    id: e.id,
    course: e.course,
    who: who(byId[e.student_id]),
    issued: !!e.certificate_issued,
  }));

  const collected = payments.reduce((n, p) => n + (Number(p.amount) || 0), 0);
  const owed = rows.reduce((n, r) => n + Math.max(r.balance, 0), 0);
  const owing = rows.filter((r) => r.balance > 0).sort((a, b) => b.balance - a.balance);

  const renewals = rows
    .map((r) => ({ s: r, a: accessSummary({ access_until: r.accessUntil }) }))
    .filter(({ a, s }) => a && (a.expired || a.soon) && s.accessStatus !== "revoked")
    .sort((x, y) => (x.a.left || 0) - (y.a.left || 0));

  return (
    <Shell>
      <section style={{ paddingTop: 24 }}>
        <AdminMenuButton />

        <div className="portal">
          <aside id="admin-side">
            <b className="side-title">Admin panel</b>
            <a className="on" href="#overview">
              Overview
            </a>
            <a href="#add-student">Add a student</a>
            <a href="#students">Students</a>
            <a href="#enroll">Enroll</a>
            <a href="#attendance">Class register</a>
            <a href="#payments">Payments</a>
            <a href="#certificates">Certificates</a>
            <a href="#lessons">Video lessons</a>
            <a href="#quizzes">Quizzes</a>
            <a href="#announcements">Announcements</a>
            <a href="#instructors">Instructors</a>
            <a href="#export">Export</a>
            <a href="/portal">My student view</a>

            <form action={signOut}>
              <button className="lnk" type="submit">
                <span className="side-icon" aria-hidden="true">
                  🚪
                </span>{" "}
                Log out
              </button>
            </form>
          </aside>

          <main>
            {errors.length > 0 && (
              <div className="adm-msg bad" role="alert">
                Some data could not be loaded: {errors[0]}. Run <code>supabase/schema.sql</code> and{" "}
                <code>supabase/add-all-features.sql</code> in the Supabase SQL Editor if you have not already.
              </div>
            )}

            <div className="p-hero" id="overview">
              <Greeting name={me?.full_name || "Admin"} badge="Admin" />
            </div>

            <div className="grid">
              <div className="card">
                <div className="m">Students</div>
                <h3>{rows.length}</h3>
              </div>
              <div className="card">
                <div className="m">Enrollments</div>
                <h3>{enrollments.length}</h3>
              </div>
              <div className="card">
                <div className="m">Collected</div>
                <h3>{naira(collected)}</h3>
              </div>
              <div className="card">
                <div className="m">Outstanding</div>
                <h3>{naira(Math.max(owed, 0))}</h3>
                <div className="m">
                  {owing.length} student{owing.length === 1 ? "" : "s"} owing
                </div>
              </div>
            </div>

            {renewals.length > 0 && (
              <div className="card">
                <h3>
                  PINs to renew <span className="m">({renewals.length})</span>
                </h3>
                {renewals.slice(0, 8).map(({ s: st, a }) => (
                  <div className="stat" key={st.id}>
                    <span>
                      {st.label} <span className="m">{st.courses.join(", ")}</span>
                    </span>
                    <b>
                      {a.expired
                        ? `ended ${prettyDate(st.accessUntil)}`
                        : a.left === 0
                          ? "ends today"
                          : `${a.left} day${a.left === 1 ? "" : "s"} left`}
                    </b>
                  </div>
                ))}
                <p className="m" style={{ margin: "10px 0 0" }}>
                  Open the student below and use Renew.
                </p>
              </div>
            )}

            <div id="add-student">
              <AddStudent />
            </div>

            {owing.length > 0 && (
              <div className="card">
                <h3>Who owes the most</h3>
                {owing.slice(0, 5).map((st) => (
                  <div className="stat" key={st.id}>
                    <span>
                      {st.label} <span className="m">{st.courses.join(", ")}</span>
                    </span>
                    <b>{naira(st.balance)}</b>
                  </div>
                ))}
              </div>
            )}

            <Students students={rows} />

            <div className="grid" id="enroll">
              <EnrollForm students={picks} />
              {/* Payments intentionally disabled for now */}
              <div className="card" id="payments">
                <h3>Record payment</h3>
                <p className="m">
                  Payments are turned off for now. You can still see balances on each student card. We will enable recording
                  payments in a later step.
                </p>
              </div>
            </div>

            <Register students={picks} enrollments={enr} attendance={attendance} today={today} />

            {/* Full payments list disabled */}
            <div className="card" id="payments-list">
              <h3>Payments</h3>
              <p className="m">
                Payment recording is disabled. Collected total shown above is based on any existing payment rows in the
                database ({payments.length} record{payments.length === 1 ? "" : "s"}).
              </p>
            </div>

            <Certificates pending={certs.filter((c) => !c.issued)} issued={certs.filter((c) => c.issued)} />

            <Lessons lessons={lessons} missing={lqMissing} />
            <Quizzes quizzes={quizzes} missing={lqMissing} />
            <Announcements items={announcements} missing={annMissing} />
            <Staff instructors={instructors} />

            <OnlineAdmin />
            <BlogAdmin />
            <ShopAdmin />
            <CoursesAdmin />

            <div className="card" id="export">
              <h3>Export to Excel</h3>
              <p className="m" style={{ margin: "0 0 12px" }}>
                Download a CSV file. Excel and Google Sheets open it directly.
              </p>
              <div className="adm-acts">
                {[
                  ["students", "Students and fees"],
                  ["enrollments", "Enrollments and certificates"],
                  ["attendance", "Attendance"],
                ].map(([k, l]) => (
                  <a key={k} className="btn ghost sm" href={`/admin/export/${k}`} download>
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </main>
        </div>
      </section>
    </Shell>
  );
}
