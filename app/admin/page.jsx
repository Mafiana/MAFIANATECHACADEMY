import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Shell from "../../components/Shell";
import Greeting from "../../components/Greeting";
import BlogAdmin from "../../components/admin/BlogAdmin";
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
        <div className="portal">
          <aside className="admin-side" id="admin-side">
  <div className="side-head">
    <b className="side-title">Admin panel</b>
    <button type="button" className="side-close" aria-label="Close menu" onClick={() => document.getElementById("admin-side")?.classList.remove("open")}>
      ×
    </button>
  </div>

  <a className="on" href="#overview">
    <span className="side-icon" aria-hidden="true">📊</span> Overview
  </a>
  <a href="#add-student">
    <span className="side-icon" aria-hidden="true">➕</span> Add a student
  </a>
  <a href="#students">
    <span className="side-icon" aria-hidden="true">👥</span> Students
  </a>
  <a href="#enroll">
    <span className="side-icon" aria-hidden="true">📝</span> Enroll and pay
  </a>
  <a href="#attendance">
    <span className="side-icon" aria-hidden="true">📅</span> Class register
  </a>
  <a href="#payments">
    <span className="side-icon" aria-hidden="true">💰</span> Payments
  </a>
  <a href="#certificates">
    <span className="side-icon" aria-hidden="true">🎓</span> Certificates
  </a>
  <a href="#lessons">
    <span className="side-icon" aria-hidden="true">▶️</span> Video lessons
  </a>
  <a href="#quizzes">
    <span className="side-icon" aria-hidden="true">❓</span> Quizzes
  </a>
  <a href="#announcements">
    <span className="side-icon" aria-hidden="true">📢</span> Announcements
  </a>
  <a href="#instructors">
    <span className="side-icon" aria-hidden="true">🧑‍🏫</span> Instructors
  </a>
  <a href="#export">
    <span className="side-icon" aria-hidden="true">📥</span> Export to Excel
  </a>
  <a href="/portal">
    <span className="side-icon" aria-hidden="true">🏠</span> My student view
  </a>

  <form action={signOut}>
    <button className="lnk" type="submit">
      <span className="side-icon" aria-hidden="true">🚪</span> Log out
    </button>
  </form>
</aside>

          <main>
            <div className="adm-msg ok" role="status">
              Design mode. Blog, shop and courses save in this browser until Supabase is connected.
            </div>

            <div className="p-hero" id="overview">
              <Greeting name="MAFIANA" badge="Admin (design)" />
            </div>

            <div className="grid">
              <div className="card"><div className="m">Students</div><h3>0</h3></div>
              <div className="card"><div className="m">Enrollments</div><h3>0</h3></div>
              <div className="card"><div className="m">Collected</div><h3>₦0</h3></div>
              <div className="card"><div className="m">Outstanding</div><h3>₦0</h3></div>
            </div>

            <OnlineAdmin />
            <BlogAdmin />
            <ShopAdmin />
            <CoursesAdmin />

            <div className="card" id="add-student"><h3>Add a student</h3><p className="m">Connect Supabase to enable.</p></div>
            <div className="card" id="students"><h3>Students</h3><p className="m">Student list loads from the database later.</p></div>
            <div className="grid" id="enroll">
              <div className="card"><h3>Enroll</h3><p className="m">Placeholder.</p></div>
              <div className="card"><h3>Record payment</h3><p className="m">Placeholder.</p></div>
            </div>
            <div className="card" id="attendance"><h3>Class register</h3><p className="m">Placeholder.</p></div>
            <div className="card" id="payments"><h3>Payments</h3><p className="m">Placeholder.</p></div>
            <div className="card" id="certificates"><h3>Certificates</h3><p className="m">Placeholder. Public verify page: <a href="/verify">/verify</a></p></div>
            <div className="card" id="lessons"><h3>Video lessons</h3><p className="m">Placeholder.</p></div>
            <div className="card" id="quizzes"><h3>Quizzes</h3><p className="m">Placeholder.</p></div>
            <div className="card" id="announcements"><h3>Announcements</h3><p className="m">Placeholder.</p></div>
            <div className="card" id="instructors"><h3>Instructors</h3><p className="m">Placeholder.</p></div>
            <div className="card" id="export"><h3>Export to Excel</h3><p className="m">Available after Supabase is connected.</p></div>
          </main>
        </div>
      </section>
    </Shell>
  );
}