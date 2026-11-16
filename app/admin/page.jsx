import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Shell from "../../components/Shell";
import Greeting from "../../components/Greeting";
import BlogAdmin from "../../components/admin/BlogAdmin";
import AdminMenuButton from "../../components/admin/AdminMenuButton";
import ShopAdmin from "../../components/admin/ShopAdmin";
import CoursesAdmin from "../../components/admin/CoursesAdmin";
import OnlineAdmin from "../../components/admin/OnlineAdmin";

export const metadata = { title: "Admin panel | MAFIANA Tech Academy" };

export default function Admin() {
  const jar = cookies();
  if (jar.get("temp_admin")?.value !== "1") redirect("/login?next=/admin");

   return (
    <Shell>
      <section style={{ paddingTop: 24 }}>
        {/* Mobile menu button – only visible on small screens */}
        <AdminMenuButton />

        <div className="portal">
          <aside id="admin-side">
            <b className="side-title">Admin panel</b>
            <a className="on" href="#overview">Overview</a>
            <a href="#add-student">Add a student</a>
            <a href="#students">Students</a>
            <a href="#enroll">Enroll and pay</a>
            <a href="#attendance">Class register</a>
            <a href="#payments">Payments</a>
            <a href="#certificates">Certificates</a>
            <a href="#lessons">Video lessons</a>
            <a href="#quizzes">Quizzes</a>
            <a href="#announcements">Announcements</a>
            <a href="#instructors">Instructors</a>
            <a href="#export">Export to Excel</a>
            <a href="/portal">My student view</a>

            <form action={signOut}>
              <button className="lnk" type="submit">
                <span className="side-icon" aria-hidden="true">🚪</span> Log out
              </button>
            </form>
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

            {renewals.length > 0 && (
              <div className="card">
                <h3>PINs to renew <span className="m">({renewals.length})</span></h3>
                {renewals.slice(0, 8).map(({ s, a }) => (
                  <div className="stat" key={s.id}><span>{s.label} <span className="m">{s.courses.join(", ")}</span></span><b>{a.expired ? `ended ${prettyDate(s.accessUntil)}` : a.left === 0 ? "ends today" : `${a.left} day${a.left === 1 ? "" : "s"} left`}</b></div>
                ))}
                <p className="m" style={{ margin: "10px 0 0" }}>Open the student below and use Renew.</p>
              </div>
            )}

            <div id="add-student"><AddStudent /></div>

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
            <Staff instructors={instructors} />
            <div className="card" id="export">
              <h3>Export to Excel</h3>
              <p className="m" style={{ margin: "0 0 12px" }}>Download a CSV file. Excel and Google Sheets open it directly.</p>
              <div className="adm-acts">
                {[["students", "Students and fees"], ["payments", "Payments"], ["attendance", "Attendance"], ["enrollments", "Enrollments and certificates"]].map(([k, l]) => (
                  <a key={k} className="btn ghost sm" href={`/admin/export/${k}`} download>{l}</a>
                ))}
              </div>
            </div>
          </main>
        </div>
      </section>
    </Shell>
  );
}