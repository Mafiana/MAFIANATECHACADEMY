import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Shell from "../../components/Shell";
import Greeting from "../../components/Greeting";

export const metadata = { title: "Admin panel | MAFIANA Tech Academy" };

export default function Admin() {
  const jar = cookies();
  const temp = jar.get("temp_admin")?.value === "1";

  // No cookie → send to admin login
  if (!temp) {
    redirect("/login?next=/admin");
  }

  return (
    <Shell>
      <section style={{ paddingTop: 24 }}>
        <div className="portal">
          <aside>
            <b className="side-title">Admin panel</b>
            <a className="on" href="#overview">
              Overview
            </a>
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
            <form action="/api/temp-logout" method="post">
              <button className="lnk" type="submit">
                Log out
              </button>
            </form>
          </aside>

          <main>
            <div className="adm-msg ok" role="status">
              Design mode is on. No Supabase required. Login: <b>admin@mafiana.test</b> / <b>Admin123!</b>
            </div>

            <div className="p-hero" id="overview">
              <Greeting name="MAFIANA" badge="Admin (design)" />
            </div>

            <div className="grid">
              <div className="card">
                <div className="m">Students</div>
                <h3>0</h3>
              </div>
              <div className="card">
                <div className="m">Enrollments</div>
                <h3>0</h3>
              </div>
              <div className="card">
                <div className="m">Collected</div>
                <h3>₦0</h3>
              </div>
              <div className="card">
                <div className="m">Outstanding</div>
                <h3>₦0</h3>
              </div>
            </div>

            <div className="card" id="add-student">
              <h3>Add a student</h3>
              <p className="m">Form will appear here after Supabase is connected.</p>
            </div>

            <div className="card" id="students">
              <h3>Students</h3>
              <p className="m">Student list will load from the database later.</p>
            </div>

            <div className="grid" id="enroll">
              <div className="card">
                <h3>Enroll</h3>
                <p className="m">Enrollment form placeholder.</p>
              </div>
              <div className="card">
                <h3>Record payment</h3>
                <p className="m">Payment form placeholder.</p>
              </div>
            </div>

            <div className="card" id="attendance">
              <h3>Class register</h3>
              <p className="m">Attendance tools placeholder.</p>
            </div>

            <div className="card" id="payments">
              <h3>Payments</h3>
              <p className="m">Payment history placeholder.</p>
            </div>

            <div className="card" id="certificates">
              <h3>Certificates</h3>
              <p className="m">Certificate tools placeholder.</p>
            </div>

            <div className="card" id="lessons">
              <h3>Video lessons</h3>
              <p className="m">Lessons placeholder.</p>
            </div>

            <div className="card" id="quizzes">
              <h3>Quizzes</h3>
              <p className="m">Quizzes placeholder.</p>
            </div>

            <div className="card" id="announcements">
              <h3>Announcements</h3>
              <p className="m">Announcements placeholder.</p>
            </div>

            <div className="card" id="instructors">
              <h3>Instructors</h3>
              <p className="m">Staff list placeholder.</p>
            </div>

            <div className="card" id="export">
              <h3>Export to Excel</h3>
              <p className="m" style={{ margin: "0 0 12px" }}>
                CSV downloads will work after Supabase is connected.
              </p>
              <div className="adm-acts">
                <span className="btn ghost sm">Students and fees</span>
                <span className="btn ghost sm">Payments</span>
                <span className="btn ghost sm">Attendance</span>
                <span className="btn ghost sm">Enrollments</span>
              </div>
            </div>
          </main>
        </div>
      </section>
    </Shell>
  );
}