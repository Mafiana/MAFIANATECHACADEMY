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
          <aside>
            <b className="side-title">Admin panel</b>
            <a className="on" href="#overview">Overview</a>
            <a href="#online">Who is online</a>
            <a href="#blog">Blog</a>
            <a href="#shop-admin">Student shop</a>
            <a href="#courses-admin">Courses</a>
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
            <a href="/verify">Verify certificate</a>
            <a href="/portal">My student view</a>
            <form action="/api/temp-logout" method="post">
              <button className="lnk" type="submit">Log out</button>
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